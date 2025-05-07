export default {
    string: (req, res, next, value) => {
        return typeof value === "string";
    },
    number: (req, res, next, value) => {
        return !isNaN(value) && !isNaN(parseFloat(value));
    },
};
