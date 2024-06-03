import { Labels, Message } from "../types";

export async function getLabels(id: string): Promise<Labels | Message | null> {
    const response = await fetch(import.meta.env.VITE_URL + `labels/${id}`, {
        credentials: "include",
    });

    const data = response.status === 204 ? null : response.json();

    return data;
}

export async function createLabel(id: string, title: string, description: string, color: string): Promise<Message> {
    const sendData = new URLSearchParams();
    sendData.append("title", title);
    sendData.append("description", description);
    sendData.append("color", color);

    const response = await fetch(import.meta.env.VITE_URL + `label/add/${id}`, {
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
