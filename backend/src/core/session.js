import crypto from "crypto";
import dotenv from "dotenv";
import session from "express-session";
import logger from "./logger.js";

dotenv.config();

export const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60,
    },
});

export function regenerateSession(req, userId, reload = false) {
    if (!req.session.nonce || reload) {
        req.session.nonce = crypto.randomBytes(32).toString("hex");
    }

    if (!req.session.ipAddress || reload) {
        req.session.ipAddress = req.ip;
    }

    if (!req.session.userAgent || reload) {
        req.session.userAgent = req.get("User-Agent");
    }

    req.session.userId = userId;
    req.session.OBSOLETE = true;
    req.session.EXPIRES = Date.now() + 60 * 1000;

    req.session.regenerate((e) => {
        if (e) {
            logger.error(`Session regeneration failed: ${e}`);
        } else {
            req.session.userId = userId;
            req.session.OBSOLETE = false;
            req.session.EXPIRES = null;
        }
    });
}

export function checkSession(req) {
    try {
        if (req.session.OBSOLETE && req.session.EXPIRES && req.session.EXPIRES < Date.now()) {
            throw new Error("Attempt to use expired session");
        }

        if (typeof req.session.userId !== "number") {
            throw new Error("No session started");
        }

        if (req.session.ipAddress !== req.ip) {
            throw new Error("IP address mismatch");
        }

        if (req.session.userAgent !== req.get("User-Agent")) {
            throw new Error("User-Agent mismatch");
        }

        if (!req.session.OBSOLETE && Math.floor(Math.random() * 100) === 0) {
            regenerateSession(req, req.session.userId, true);
        }

        return true;
    } catch (e) {
        logger.error(`Session check failed: ${e}`);
        return false;
    }
}
