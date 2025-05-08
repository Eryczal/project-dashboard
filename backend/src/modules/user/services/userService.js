import bcrypt from "bcryptjs";
import logger from "../../../core/logger.js";
import mysql from "../../../core/mysql.js";
import UserFactory from "../factories/UserFactory.js";

export default {
    login: async (parameters) => {
        try {
            const result = await mysql.select(
                `SELECT * FROM user u
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
};
