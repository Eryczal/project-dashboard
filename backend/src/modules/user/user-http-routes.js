export default [
    {
        method: "get",
        apiPath: "user/me",
        handler: "user/handlers/me.js",
        validations: [],
        parameters: [],
    },
    {
        method: "post",
        apiPath: "user/login",
        handler: "user/handlers/login.js",
        validations: [],
        parameters: [
            {
                name: "name",
                validations: ["string"],
                required: true,
            },
            {
                name: "password",
                validations: ["string"],
                required: true,
            },
        ],
    },
];
