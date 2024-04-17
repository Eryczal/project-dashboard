import { Task } from "./task";

export interface Column {
    id: number;
    title: string;
    description: string;
    tasks?: Task[];
}
