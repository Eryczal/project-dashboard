import { useContext } from "react";
import { ProjectsContext } from "./ProjectsContext";

export function useProjects() {
    const projectsContext = useContext(ProjectsContext);

    if (projectsContext === null) {
        throw new Error("Context error");
    }

    return projectsContext;
}
