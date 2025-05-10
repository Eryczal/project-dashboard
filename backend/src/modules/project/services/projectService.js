import logger from "../../../core/logger.js";
import mysql from "../../../core/mysql.js";
import ProjectFactory from "../factories/ProjectFactory.js";

export default {
    getProjects: async (parameters) => {
        try {
            const rows = await mysql.select(
                `SELECT p.* FROM project p
                JOIN company c ON c.id = p.company_id
                WHERE c.url = ?`,
                [parameters.companyUrl]
            );

            const projects = [];

            rows.forEach((row) => {
                projects.push(ProjectFactory.create(row));
            });

            return projects;
        } catch (e) {
            logger.error(`Api getProjects error: ${e}`);
        }
    },
};
