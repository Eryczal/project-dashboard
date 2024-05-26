import { ReactNode, createContext, useContext, useState } from "react";
import { Project, ProjectContextProps } from "../types";

const ProjectContext = createContext<ProjectContextProps | null>(null);

export function useProject() {
    const projectContext = useContext(ProjectContext);

    if (projectContext === null) {
        throw new Error("Context error");
    }

    return projectContext;
}

export function ProjectProvider({ children }: { children: ReactNode }) {
    const [project, setProject] = useState<Project | undefined>();

    const value: ProjectContextProps = {
        project,
        setProject,
    };

    return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}
