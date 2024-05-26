import { Project, Projects, Message } from "../types";

export async function getUserProjects(): Promise<Projects | Message | null> {
    const response = await fetch(import.meta.env.VITE_URL + "projects", {
        credentials: "include",
    });

    const data = response.status === 204 ? null : response.json();

    return data;
}

export async function createProject(): Promise<Projects | Message> {
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
