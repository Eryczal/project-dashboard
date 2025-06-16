import userService from "../services/userService.js";

export default async function (req, res, next) {
    const parameters = {
        userId: req.session.data?.userId,
    };

    if (typeof parameters.userId !== "number") {
        res.status(401).json({
            errorCode: "NOT_LOGGED",
        });

        return;
    }

    const user = await userService.getUser(parameters);

    res.status(200).json(user);
}
