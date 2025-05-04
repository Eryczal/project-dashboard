export default {
    log: (message) => {
        console.log(message);
    },
    debug: (message) => {
        console.log(`[DEBUG] ${message}`);
    },
    info: (message) => {
        console.log(`[INFO] ${message}`);
    },
    warn: (message) => {
        console.log(`\x1b[33m[WARNING] ${message}\x1b[0m`);
    },
    error: (message) => {
        console.log(`\x1b[31m[ERROR] ${message}\x1b[0m`);
    },
};
