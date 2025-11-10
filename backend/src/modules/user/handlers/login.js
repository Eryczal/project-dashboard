import { regenerateSession } from "../../../core/session.js";
import userService from "../services/userService.js";

export default async function (req, res, next) {
    const parameters = {
        name: req.parameters.name,
        password: req.parameters.password,
    };

    const user = await userService.login(parameters);

    if (user) {
        const data = {
            userId: user.id,
            companyId: user.company.id,
        };

        regenerateSession(req, data, true);
        res.status(200).json(user);
    } else {
        res.status(400).json({
            errorCode: "INVALID_CREDENTIALS",
        });
    }
}
