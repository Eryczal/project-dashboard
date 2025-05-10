export default {
    name: "project_dashboard",
    tables: [
        {
            name: "company",
            columns: [
                {
                    name: "id",
                    type: "int",
                    unsigned: true,
                    notNull: true,
                    primaryKey: true,
                    autoIncrement: true,
                },
                {
                    name: "create_time",
                    type: "datetime",
                    default: "current_timestamp",
                },
                {
                    name: "update_time",
                    type: "datetime",
                    default: "current_timestamp",
                    onUpdate: "current_timestamp",
                },
                {
                    name: "name",
                    type: "varchar",
                    size: 80,
                    notNull: true,
                    unique: true,
                },
                {
                    name: "url",
                    type: "varchar",
                    size: 80,
                    notNull: true,
                    unique: true,
                },
                {
                    name: "type",
                    type: "tinyint",
                },
            ],
        },
        {
            name: "user",
            columns: [
                {
                    name: "id",
                    type: "int",
                    unsigned: true,
                    notNull: true,
                    primaryKey: true,
                    autoIncrement: true,
                },
                {
                    name: "create_time",
                    type: "datetime",
                    default: "current_timestamp",
                },
                {
                    name: "update_time",
                    type: "datetime",
                    default: "current_timestamp",
                    onUpdate: "current_timestamp",
                },
                {
                    name: "name",
                    type: "varchar",
                    size: 80,
                    notNull: true,
                    unique: true,
                },
                {
                    name: "password",
                    type: "varchar",
                    size: 255,
                    notNull: true,
                },
                {
                    name: "url",
                    type: "varchar",
                    size: 80,
                    notNull: true,
                    unique: true,
                },
                {
                    name: "theme",
                    type: "tinyint",
                },
                {
                    name: "company_id",
                    type: "int",
                    unsigned: "true",
                    notNull: true,
                    references: "company(id)",
                },
            ],
        },
        {
            name: "role",
            columns: [
                {
                    name: "id",
                    type: "int",
                    unsigned: true,
                    notNull: true,
                    primaryKey: true,
                    autoIncrement: true,
                },
                {
                    name: "name",
                    type: "varchar",
                    size: 80,
                    notNull: true,
                    unique: true,
                },
            ],
        },
        {
            name: "user_role",
            columns: [
                {
                    name: "id",
                    type: "int",
                    unsigned: true,
                    notNull: true,
                    primaryKey: true,
                    autoIncrement: true,
                },
                {
                    name: "user_id",
                    type: "int",
                    unsigned: true,
                    notNull: true,
                    references: "user(id)",
                },
                {
                    name: "role_id",
                    type: "int",
                    unsigned: true,
                    notNull: true,
                    references: "role(id)",
                },
            ],
        },
        {
            name: "project",
            columns: [
                {
                    name: "id",
                    type: "int",
                    unsigned: true,
                    notNull: true,
                    primaryKey: true,
                    autoIncrement: true,
                },
                {
                    name: "create_time",
                    type: "datetime",
                    default: "current_timestamp",
                },
                {
                    name: "update_time",
                    type: "datetime",
                    default: "current_timestamp",
                    onUpdate: "current_timestamp",
                },
                {
                    name: "name",
                    type: "varchar",
                    size: 120,
                    notNull: true,
                },
                {
                    name: "url",
                    type: "varchar",
                    size: 120,
                    notNull: true,
                },
                {
                    name: "company_id",
                    type: "int",
                    unsigned: true,
                    notNull: true,
                    references: "company(id)",
                },
            ],
        },
    ],
};
