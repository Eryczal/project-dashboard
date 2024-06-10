import { Columns, EditColumnData, Message } from "../types";

export async function getColumns(id: string): Promise<Columns | Message | null> {
    const response = await fetch(import.meta.env.VITE_URL + `columns/${id}`, {
        credentials: "include",
    });

    const data = response.status === 204 ? null : response.json();

    return data;
}

export async function createColumn(id: string, title: string, description: string, position: number): Promise<Message> {
    const sendData = new URLSearchParams();
    sendData.append("title", title);
    sendData.append("description", description);
    sendData.append("position", position.toString());

    const response = await fetch(import.meta.env.VITE_URL + `column/add/${id}`, {
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

export async function moveColumn(id: string, projectId: string, from: number, to: number): Promise<Message> {
    const sendData = new URLSearchParams();
    sendData.append("project_id", projectId);
    sendData.append("from", from.toString());
    sendData.append("to", to.toString());

    const response = await fetch(import.meta.env.VITE_URL + `column/move/${id}`, {
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

export async function updateColumn(id: string, columnData: EditColumnData): Promise<Message> {
    const sendData = new URLSearchParams();

    for (const [key, value] of Object.entries(columnData)) {
        if (value !== false) {
            sendData.append(key, value);
        }
    }

    const response = await fetch(import.meta.env.VITE_URL + `column/update/${id}`, {
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

export async function deleteColumn(id: string): Promise<Message> {
    const response = await fetch(import.meta.env.VITE_URL + `column/delete/${id}`, {
        credentials: "include",
    });

    const data = await response.json();
    data.code = response.status;

    return data;
}
