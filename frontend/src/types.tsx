import { Dispatch, ReactNode, SetStateAction } from "react";

export type AuthPageType = "login" | "register";

export interface Label {
    id: string;
    title: string;
    description: string;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    labels?: Label[];
}

export interface Column {
    id: string;
    title: string;
    description: string;
    tasks?: Task[];
}

export interface ModalProps {
    onClose: (success: Boolean) => void;
    children?: ReactNode;
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
}
