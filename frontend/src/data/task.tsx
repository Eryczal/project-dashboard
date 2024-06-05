import { Message, Tasks } from "../types";

export async function getTasks(id: string): Promise<Tasks | Message | null> {
    const response = await fetch(import.meta.env.VITE_URL + `tasks/${id}`, {
        credentials: "include",
    });

    const data = response.status === 204 ? null : response.json();

    return data;
}

export async function createTask(id: string, title: string, description: string, labels: string[], position: number): Promise<Message> {
    const sendData = new URLSearchParams();
    sendData.append("title", title);
    sendData.append("description", description);
    sendData.append("position", position.toString());

    labels.forEach((label) => sendData.append("labels[]", label));

    const response = await fetch(import.meta.env.VITE_URL + `task/add/${id}`, {
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
