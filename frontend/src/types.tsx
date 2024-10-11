import { Dispatch, ReactNode, SetStateAction } from "react";

export type AuthPageType = "login" | "register";

export type TaskColumnModal = "task" | "edit" | "delete" | "none";

export type Theme = "light" | "glass";

export interface User {
    id: string;
    name: string;
    type: string;
    theme: Theme;
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
    changeTheme: (theme: Theme) => Promise<Message>;
    // logoutUser
}

export interface ProjectContextProps {
    project?: Project;
    setProject: Dispatch<SetStateAction<Project | undefined>>;
    labels: Label[];
}

export interface ModalProps {
    onClose: (success: any) => void;
    children?: ReactNode;
    className?: string;
}

export interface TaskModalProps extends ModalProps {
    onClose: (success: TaskColumnModal) => void;
    column?: Column;
    pos?: number;
    task?: Task;
}

export interface MenuItemProps {
    children: ReactNode;
    action?: any;
}

export interface LabelSelectionProps {
    handleLabel: (clicked: boolean, labelId: string) => void;
    activeLabels?: string[];
}

export interface SelectableLabelProps {
    label: Label;
    handleLabel: (clicked: boolean, labelId: string) => void;
    isActive?: boolean;
}

export interface MoveTaskToColumnParams {
    id: string;
    sourceColumnId: string;
    destinationColumnId: string;
    sourceIndex: number;
    destinationIndex: number;
}

export interface EditColumnData {
    title: false | string;
    description: false | string;
}

export interface EditTaskData {
    title: false | string;
    description: false | string;
    labelsAdd: false | string[];
    labelsRemove: false | string[];
}
