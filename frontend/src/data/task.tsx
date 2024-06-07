import { Message, MoveTaskToColumnParams, Tasks } from "../types";

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

export async function moveTask(id: string, columnId: string, from: number, to: number): Promise<Message> {
    const sendData = new URLSearchParams();
    sendData.append("column_id", columnId);
    sendData.append("from", from.toString());
    sendData.append("to", to.toString());

    const response = await fetch(import.meta.env.VITE_URL + `task/move/${id}`, {
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

export async function moveTaskToColumn({ id, sourceColumnId, destinationColumnId, sourceIndex, destinationIndex }: MoveTaskToColumnParams): Promise<Message> {
    const sendData = new URLSearchParams();
    sendData.append("source_id", sourceColumnId);
    sendData.append("destination_id", destinationColumnId);
    sendData.append("source_index", sourceIndex.toString());
    sendData.append("destination_index", destinationIndex.toString());

    const response = await fetch(import.meta.env.VITE_URL + `task/movetocolumn/${id}`, {
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
