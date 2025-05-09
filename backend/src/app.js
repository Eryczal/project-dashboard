import express from "express";
import { sessionMiddleware } from "./core/session.js";
import { initRoutes } from "./core/router.js";
import { initValidations } from "./core/validator.js";
import logger from "./core/logger.js";
import mysql from "./core/mysql.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", process.env.CORS_ORIGIN);
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Credentials", "true");

    next();
});
const PORT = 3010;

await initValidations();
await initRoutes(app);
await mysql.init();

app.listen(PORT, (error) => {
    if (!error) {
        logger.info(`Server running on port: ${PORT}`);
    } else {
        logger.error(`Can't start server: ${error}`);
    }
});
