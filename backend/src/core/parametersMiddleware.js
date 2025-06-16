import dotenv from "dotenv";
import logger from "./logger.js";
import formidable from "formidable";

dotenv.config();

export default async function (req, res, next) {
    const method = req.method.toLowerCase();
    const contentType = req.headers["content-type"] || "";

    req.parameters = { ...req.query };

    if (method === "post" || method === "put" || method === "patch") {
        if (contentType.startsWith("multipart/form-data")) {
            const form = formidable();

            form.parse(req, (err, fields, files) => {
                if (err) {
                    logger.warn("Can't parse form data");
                    return res.status(400);
                }

                const stringFields = Object.fromEntries(
                    Object.entries(fields).map(([key, value]) => {
                        if (Array.isArray(value) && value.length === 1) {
                            return [key, value[0]];
                        } else {
                            return [key, value];
                        }
                    })
                );

                req.parameters = {
                    ...req.parameters,
                    ...stringFields,
                };

                next();
            });
        } else {
            req.parameters = {
                ...req.parameters,
                ...req.body,
            };

            next();
        }
    } else {
        next();
    }
}
