import { Task } from "./task";

export interface Column {
    id: number;
    title: string;
    description: string;
    tasks?: Task[];
}

export async function getColumns(id: string): Promise<Column> {
    const response = await fetch(import.meta.env.VITE_URL + `project/${id}/columns`, {
        credentials: "include",
    });

    const data = response.json();

    return data;
}

export async function addColumn(id: string, title: string, description: string) {
    const formData = new FormData();
}
