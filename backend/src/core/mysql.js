import database from "../config/database.js";
import dotenv from "dotenv";
import logger from "./logger.js";
import mariadb from "mariadb";

dotenv.config();

const mysql = {
    init: async () => {
        try {
            logger.info("Connecting to MySQL");

            mysql.pool = mariadb.createPool({
                host: process.env.DATABASE_HOST,
                user: process.env.DATABASE_USER,
                password: process.env.DATABASE_PASS,
                database: database.name,
                connectionLimit: 5,
            });
        } catch (e) {
            logger.fatal(`Can't connect to MySQL: ${e}`);
        }
    },
    select: async (query, params = []) => {
        let conn;

        try {
            conn = await mysql.pool.getConnection();
            const rows = await conn.query(query, params);
            return Array.isArray(rows) ? rows : [];
        } catch (e) {
            logger.error(`MySQL select error: ${e}`);
            return null;
        } finally {
            if (conn) {
                conn.release();
            }
        }
    },
    insert: async (query, params = []) => {
        let conn;

        try {
            conn = await mysql.pool.getConnection();
            const result = await conn.query(query, params);
            return result.insertId || null;
        } catch (e) {
            logger.error(`MySQL insert error: ${e}`);
            return null;
        } finally {
            if (conn) {
                conn.release();
            }
        }
    },
};

export default mysql;
