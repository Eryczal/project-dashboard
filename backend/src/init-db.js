import database from "./config/database.js";
import databaseUser from "./config/databaseUser.js";
import dotenv from "dotenv";
import mariadb from "mariadb";
import logger from "./core/logger.js";

dotenv.config();

let connection = null;

try {
    logger.log("Connecting to MySQL...");

    connection = await mariadb.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASS,
    });

    logger.log("Connected to MySQL");
} catch (e) {
    logger.fatal(`Can't connect to MySQL: ${e}`);
}

try {
    const databaseExists = await connection.query(`SHOW DATABASES LIKE "${database.name}"`);

    if (databaseExists.length) {
        logger.log(`Found database ${database.name}`);
    } else {
        logger.log(`Creating database ${database.name}...`);

        await connection.query(`CREATE DATABASE ${database.name} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);

        logger.log(`Created database ${database.name}`);
    }

    await connection.query(`USE ${database.name}`);

    for (const table of database.tables) {
        const tableExists = await connection.query(`SHOW TABLES LIKE "${table.name}"`);

        if (tableExists.length) {
            logger.log(`Found table ${table.name}`);
        } else {
            logger.log(`Creating table ${table.name}...`);

            let tableQuery = `CREATE TABLE \`${table.name}\` (`;

            for (const column of table.columns) {
                tableQuery += `\`${column.name}\` ${column.type.toUpperCase()}`;
                tableQuery += `${column.size ? `(${column.size})` : ""}`;

                if (column.unsigned) {
                    tableQuery += " UNSIGNED";
                }

                if (column.notNull) {
                    tableQuery += " NOT NULL";
                }

                if (column.unique) {
                    tableQuery += " UNIQUE";
                }

                if (column.autoIncrement) {
                    tableQuery += " AUTO_INCREMENT";
                }

                if (column.default) {
                    tableQuery += ` DEFAULT ${column.default.toUpperCase()}`;
                }

                if (column.onUpdate) {
                    tableQuery += ` ON UPDATE ${column.onUpdate.toUpperCase()}`;
                }

                tableQuery += ", ";
            }

            const primaryKeyColumn = table.columns.filter((column) => column.primaryKey);

            if (primaryKeyColumn.length > 1) {
                logger.fatal(`Table ${table.name} has more than 1 primary key.`);
            }

            const foreignKeyColumns = table.columns.filter((column) => column.references);

            tableQuery += `PRIMARY KEY (${primaryKeyColumn[0].name}) ${foreignKeyColumns.length ? "," : ""}`;

            if (foreignKeyColumns.length) {
                const foreignKeys = foreignKeyColumns.map((foreignKey) => `FOREIGN KEY (${foreignKey.name}) REFERENCES ${foreignKey.references}`);

                tableQuery += foreignKeys.join(", ");
            }

            tableQuery += ") ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;";

            await connection.query(tableQuery);

            logger.log(`Created table ${table.name}`);
        }
    }

    logger.log(`Creating initial user...`);

    for (const table of databaseUser) {
        const columns = Object.keys(table.values)
            .map((key) => `\`${key}\``)
            .join(", ");
        const values = Object.values(table.values)
            .map((value) => (typeof value === "string" ? `'${value.replace(/'/g, "''")}'` : value))
            .join(", ");

        await connection.query(`INSERT INTO \`${table.name}\` (${columns}) VALUES (${values})`);
    }

    logger.log("Created inital user");
} catch (e) {
    connection.end();
    logger.fatal(`MySQL error: ${e}`);
}

connection.end();
