import { checkSession } from "../../core/session.js";

export default {
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
