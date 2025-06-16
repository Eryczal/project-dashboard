import projectService from "../services/projectService.js";

export default async function (req, res, next) {
    const parameters = {
        companyUrl: req.parameters.companyUrl,
    };

    let projects = await projectService.getProjects(parameters);

    if (projects) {
        res.status(200).json(projects);
    } else {
        res.status(400).json({
            errorCode: "ERROR",
        });
    }
}
