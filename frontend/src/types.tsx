import { Dispatch, ReactNode, SetStateAction } from "react";

export type AuthPageType = "login" | "register";

export interface ModalProps {
    onClose: (success: boolean) => void;
    children?: ReactNode;
    className?: string;
}

export interface User {
    id: string;
    name: string;
    type: string;
    creationDate: string;
}

export interface Project {
    id: string;
    title: string;
    description: string;
}

export interface Projects {
    projects: Project[];
}

export interface Column {
    id: string;
    title: string;
    description: string;
    position: number;
    tasks?: Task[];
}

export interface Columns {
    columns: Column[];
}

export interface Task {
    id: string;
    title: string;
    description: string;
    position: number;
    labels?: string[];
}

export interface Tasks {
    tasks: Task[];
}

export interface Label {
    id: string;
    title: string;
    description: string;
    color: string;
}

export interface Labels {
    labels: Label[];
}

export interface Message {
    message: string;
    code?: number;
}

export interface UserContextProps {
    user?: User;
    loginUser: (email: string, password: string) => Promise<Message>;
    registerUser: (email: string, password: string) => Promise<Message>;
    // logoutUser
}

export interface ProjectContextProps {
    project?: Project;
    setProject: Dispatch<SetStateAction<Project | undefined>>;
    labels: Label[];
}

export interface LabelSelectionProps {
    handleLabel: (clicked: boolean, labelId: string) => void;
}

export interface SelectableLabelProps {
    label: Label;
    handleLabel: (clicked: boolean, labelId: string) => void;
}
