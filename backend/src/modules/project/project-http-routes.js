export default [
    {
        method: "get",
        apiPath: "project/get-projects",
        handler: "project/handlers/getProjects.js",
        validations: ["sessionRequired"],
        parameters: [
            {
                name: "companyUrl",
                validations: ["string"],
                required: true,
            },
        ],
    },
    {
        method: "post",
        apiPath: "project/create-project",
        handler: "project/handlers/createProject.js",
        validations: ["sessionRequired"],
        parameters: [
            {
                name: "name",
                validations: ["string"],
                required: true,
            },
            {
                name: "url",
                validations: ["smallString"],
                required: false,
            },
        ],
    },
];
