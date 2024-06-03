import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { Project, ProjectContextProps } from "../types";
import { useParams } from "react-router-dom";
import { getProjectById } from "../data/project";

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
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (id) {
            const loadProject = async () => {
                const projectData = await getProjectById(id);

                if (!("message" in projectData)) {
                    setProject(projectData);
                }
            };

            loadProject().catch(console.error);
        }
    }, []);

    const value: ProjectContextProps = {
        project,
        setProject,
    };

    return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}
