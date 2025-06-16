import logger from "../../../core/logger.js";
import mysql from "../../../core/mysql.js";
import ProjectFactory from "../factories/ProjectFactory.js";

export default {
    async getProjects(parameters) {
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

    async createUniqueUrl(urlValue, companyId) {
        let baseUrl = urlValue
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-_]/g, "");
        let url = baseUrl;
        let counter = 1;

        const existingRows = await mysql.select(
            `SELECT p.url FROM project p
            JOIN company c ON c.id = p.company_id
            WHERE c.id = ? AND p.url LIKE ?`,
            [companyId, `${baseUrl}%`]
        );

        const existingUrls = new Set(existingRows.map((r) => r.url));

        while (existingUrls.has(url) || url.length >= 120) {
            url = `${baseUrl}-${counter}`;
            counter++;

            while (url.length >= 120) {
                baseUrl = baseUrl.slice(0, -1);

                if (baseUrl.length <= 5) {
                    logger.error("Base URL too short in createUniqueUrl");
                }

                url = `${baseUrl}-${counter}`;
            }
        }

        return url;
    },

    async createProject(parameters) {
        const url = await this.createUniqueUrl(parameters.url || parameters.name, parameters.companyId);

        try {
            const projectId = await mysql.insert(
                `INSERT INTO project (name, url, company_id)
                VALUES (?, ?, ?)`,
                [parameters.name, url, parameters.companyId]
            );

            return projectId;
        } catch (e) {
            logger.error(`Api createProject error: ${e}`);
        }
    },
};
