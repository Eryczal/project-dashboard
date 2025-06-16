import projectService from "../services/projectService.js";

export default async function (req, res, next) {
    const parameters = {
        name: req.parameters.name,
        url: req.parameters.url,
        companyId: req.session.data.companyId,
    };

    const projectId = await projectService.createProject(parameters);

    if (projectId) {
        res.status(200).json({ projectId });
    } else {
        res.status(400).json({
            errorCode: "ERROR",
        });
    }
}
