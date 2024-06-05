import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { Label, Project, ProjectContextProps } from "../types";
import { useParams } from "react-router-dom";
import { getProjectById } from "../data/project";
import { getLabels } from "../data/label";

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
    const [labels, setLabels] = useState<Label[]>([]);
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

    useEffect(() => {
        if (project) {
            const loadLabels = async () => {
                const labelsData = await getLabels(project.id);

                if (labelsData && !("message" in labelsData)) {
                    setLabels(labelsData.labels);
                }
            };

            loadLabels().catch(console.error);
        }
    }, [project]);

    const value: ProjectContextProps = {
        project,
        setProject,
        labels,
    };

    return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}
