import { regenerateSession } from "../../../core/session.js";
import userService from "../services/userService.js";

export default async function (req, res, next) {
    const parameters = {
        name: req.body.name,
        password: req.body.password,
    };

    let user = await userService.login(parameters);

    if (user) {
        regenerateSession(req, user.id, true);
        res.status(200).json(user);
    } else {
        res.status(400).json({
            errorCode: "INVALID_CREDENTIALS",
        });
    }
}
