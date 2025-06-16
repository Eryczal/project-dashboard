import validations from "../config/validations.js";
import logger from "./logger.js";

export const validator = {
    validateRequest: (req, res, next, validations) => {
        for (const validation of validations) {
            if (!validator.validationFunctions[validation]) {
                logger.error(`Can't find validation ${validation}`);
                return res.sendStatus(500);
            }

            const isValid = validator.validationFunctions[validation](req, res, next);

            if (!isValid) {
                logger.warn(`Bad request: request doesn't pass validation: ${validation}`);
                return res.status(400);
            }
        }

        return true;
    },
    validateParameters: (req, res, next, parameters) => {
        const knownParameters = new Set(parameters.map((p) => p.name));
        const unknownParameters = Object.keys(req.parameters).filter((p) => !knownParameters.has(p));

        if (unknownParameters.length) {
            logger.warn(`Unknown parameters: ${unknownParameters.join(", ")}`);
        }

        for (const parameter of parameters) {
            const parameterValue = req.parameters[parameter.name] || null;

            if (!parameterValue) {
                if (parameter.required) {
                    logger.warn(`Bad request: parameter ${parameter.name} is required`);
                    return res.status(400);
                }

                continue;
            }

            for (const validation of parameter.validations) {
                if (!validator.validationFunctions[validation]) {
                    logger.error(`Can't find validation ${validation}`);
                    return res.status(500);
                }

                if (parameterValue) {
                    const isValid = validator.validationFunctions[validation](req, res, next, parameterValue);

                    if (!isValid) {
                        logger.warn(`Bad request: parameter ${parameter.name} doesn't pass validation: ${validation}`);
                        return res.status(400);
                    }
                }
            }
        }

        return true;
    },
    validationFunctions: {},
};

export async function initValidations() {
    logger.info("Initializing validations");

    for (const validationUrl of validations) {
        const validationFile = (await import(`../modules/${validationUrl}`)).default;

        Object.entries(validationFile).forEach(([key, value]) => {
            if (validator.validationFunctions[key]) {
                logger.warn(`Validation function ${key} already exists`);
            }

            validator.validationFunctions[key] = value;
        });
    }
}
