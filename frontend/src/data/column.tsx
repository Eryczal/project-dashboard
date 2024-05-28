import { Columns, Message } from "../types";

export async function getColumns(id: string): Promise<Columns | Message | null> {
    const response = await fetch(import.meta.env.VITE_URL + `columns/${id}`, {
        credentials: "include",
    });

    const data = response.status === 204 ? null : response.json();

    return data;
}

export async function createColumn(id: string, title: string, description: string): Promise<Message> {
    const sendData = new URLSearchParams();
    sendData.append("title", title);
    sendData.append("description", description);

    const response = await fetch(import.meta.env.VITE_URL + `column/add/${id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        credentials: "include",
        body: sendData,
    });

    const data = response.json();

    return data;
}
