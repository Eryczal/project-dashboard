import { Project, Projects, Message } from "../types";

export async function getUserProjects(): Promise<Projects | Message | null> {
    const response = await fetch(import.meta.env.VITE_URL + "projects", {
        credentials: "include",
    });

    const data = response.status === 204 ? null : response.json();

    return data;
}

export async function createProject(title: string, description: string, publicity: number): Promise<Projects | Message> {
    const sendData = new URLSearchParams();
    sendData.append("title", title);
    sendData.append("description", description);
    sendData.append("publicity", publicity.toString());

    const response = await fetch(import.meta.env.VITE_URL + "project/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        credentials: "include",
        body: sendData,
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
