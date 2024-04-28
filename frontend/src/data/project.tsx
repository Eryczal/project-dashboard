export interface Project {
    id: number;
    title: string;
    description: string;
}

export interface Projects {
    projects: Project[];
}

export interface Message {
    message: string;
    code?: number;
}

type Response = Projects | Message;

export async function getUserProjects(): Promise<Response | null> {
    const response = await fetch(import.meta.env.VITE_URL + "projects", {
        credentials: "include",
    });

    const data = response.status === 204 ? null : response.json();

    return data;
}

export async function createProject(): Promise<Response> {
    const response = await fetch(import.meta.env.VITE_URL + "project/add", {
        credentials: "include",
    });

    const data = await response.json();
    data.code = response.status;

    return data;
}

export async function getProjectById(id: string): Promise<Project | Message> {
    const response = await fetch(import.meta.env.VITE_URL + "project/" + id, {
        credentials: "include",
    });

    const data = response.json();

    return data;
}
