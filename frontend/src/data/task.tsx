import { Label } from "./label";

export interface Task {
    id: number;
    title: string;
    description: string;
    labels?: Label[];
}
