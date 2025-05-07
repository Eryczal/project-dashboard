import express from "express";
import { sessionMiddleware } from "./core/session.js";
import { initRoutes } from "./core/router.js";
import { initValidations } from "./core/validator.js";
import logger from "./core/logger.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);
const PORT = 3010;

await initValidations();
await initRoutes(app);

app.listen(PORT, (error) => {
    if (!error) {
        logger.info(`Server running on port: ${PORT}`);
    } else {
        logger.error(`Can't start server: ${error}`);
    }
});
