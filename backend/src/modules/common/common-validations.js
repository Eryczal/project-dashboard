import { checkSession } from "../../core/session.js";

export default {
    smallString: (req, res, next, value) => {
        if (typeof value !== "string") {
            return false;
        }

        if (value.length < 5 || value.length > 120) {
            return false;
        }

        return true;
    },
    string: (req, res, next, value) => {
        return typeof value === "string";
    },
    number: (req, res, next, value) => {
        return !isNaN(value) && !isNaN(parseFloat(value));
    },
    sessionRequired: (req, res, next) => {
        return checkSession(req);
    },
};
