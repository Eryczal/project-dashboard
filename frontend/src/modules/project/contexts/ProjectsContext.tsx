import { createContext, ReactNode, useCallback, useEffect, useState } from "react";
import { useUser } from "../../user/contexts/useUser";
import { ErrorMessage, IdResponse, Project, ProjectsContextProps } from "../../../types";

export const ProjectsContext = createContext<ProjectsContextProps | null>(null);

export function ProjectsProvider({ children }: { children: ReactNode }) {
    const { user } = useUser();
    const [projects, setProjects] = useState<Project[] | null>(null);
    const [refetch, setRefetch] = useState<boolean>(true);

    const fetchProjects = useCallback(async (): Promise<void> => {
        if (!user) {
            return;
        }

        const searchParams = new URLSearchParams();
        searchParams.append("companyUrl", user.company.url);

        const response = await fetch(import.meta.env.VITE_URL + `project/get-projects?${searchParams.toString()}`, {
            credentials: "include",
        });

        const data: Project[] | ErrorMessage = await response.json();

        setRefetch(false);

        setProjects("errorCode" in data ? null : data);
    }, [user]);

    useEffect(() => {
        if (refetch) {
            (async () => {
                try {
                    await fetchProjects();
                } catch (e) {
                    console.error(e);
                }
            })();
        }
    }, [refetch, fetchProjects]);

    async function createProject(name: string, url: string): Promise<void> {
        const sendData = new FormData();
        sendData.append("name", name);
        sendData.append("url", url);

        const response = await fetch(import.meta.env.VITE_URL + "project/create-project", {
            method: "POST",
            credentials: "include",
            body: sendData,
        });

        const data: IdResponse<"projectId"> | ErrorMessage = await response.json();

        if (!("errorCode" in data)) {
            setRefetch(true);
        }
    }

    const value: ProjectsContextProps = {
        projects,
        createProject,
    };

    return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>;
}
