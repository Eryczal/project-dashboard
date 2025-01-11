import { BudgetResponse, BudgetType, Message } from "../types";

export async function getBudget(id: string, type: BudgetType): Promise<BudgetResponse | Message | null> {
    const response = await fetch(import.meta.env.VITE_URL + `budget/${id}/${type}`, {
        credentials: "include",
    });

    const data = response.status === 204 ? null : response.json();

    return data;
}

export async function createBudget(id: string, title: string, description: string, amount: string, task: string | null): Promise<Message> {
    const sendData = new URLSearchParams();
    sendData.append("title", title);
    sendData.append("description", description);
    sendData.append("amount", amount);
    sendData.append("task", String(task));

    const response = await fetch(import.meta.env.VITE_URL + `budget/add/${id}`, {
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
