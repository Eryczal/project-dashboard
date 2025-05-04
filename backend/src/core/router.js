import routes from "../config/routes.js";
import logger from "./logger.js";
import { validator } from "./validator.js";

export async function initRoutes(app) {
    logger.info("Initializing routes");

    for (const routeUrl of routes) {
        const routeConfig = (await import(`../modules/${routeUrl}`)).default;

        for (const route of routeConfig) {
            const { method, apiPath, handler, validations, parameters } = route;

            const handlerFile = (await import(`../modules/${handler}`)).default;

            app[method](
                `/api/${apiPath}`,
                (req, res, next) => {
                    const isRequestValid = validator.validateRequest(req, res, next, validations);

                    if (isRequestValid) {
                        const areParametersValid = validator.validateParameters(req, res, next, parameters);

                        if (areParametersValid) {
                            next();
                        }
                    }
                },
                handlerFile
            );
        }
    }
}
