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
];
