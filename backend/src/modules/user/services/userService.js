import bcrypt from "bcryptjs";
import logger from "../../../core/logger.js";
import mysql from "../../../core/mysql.js";
import UserFactory from "../factories/UserFactory.js";

export default {
    login: async (parameters) => {
        try {
            const result = await mysql.select(
                `SELECT u.*, c.name AS company_name, c.url AS company_url
                FROM user u
                JOIN company c ON c.id = u.company_id
                WHERE u.name = ?`,
                [parameters.name]
            );

            if (!result.length) {
                return null;
            }

            const isMatch = await bcrypt.compare(parameters.password, result[0].password);

            if (!isMatch) {
                return null;
            }

            return UserFactory.create(result[0]);
        } catch (e) {
            logger.error(`Api login error: ${e}`);
        }
    },
    getUser: async (parameters) => {
        try {
            const result = await mysql.select(
                `SELECT u.*, c.name AS company_name, c.url AS company_url
                FROM user u
                JOIN company c ON c.id = u.company_id
                WHERE u.id = ?`,
                [parameters.userId]
            );

            if (result.length !== 1) {
                return null;
            }

            return UserFactory.create(result[0]);
        } catch (e) {
            logger.error(`Api selectUser error: ${e}`);
        }
    },
};
