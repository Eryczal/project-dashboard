import { Dispatch, ReactNode, SetStateAction } from "react";

export type AuthPageType = "login" | "register";

export type TaskColumnModal = "task" | "edit" | "delete" | "none";

export type Theme = "light" | "glass";

export type DurationType = "h" | "d";

export type BudgetType = "income" | "expense";

export type Sort = "desc" | "asc";

export interface SearchParams {
    limit: number;
    page: number;
    sort: Sort;
    search: string;
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
    deadline: string;
    duration: number;
    cost: number;
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

export interface Budget {
    id: string;
    title: string;
    description: string;
    value: number;
    taskId?: string;
}

export interface BudgetResponse {
    budget: Budget[];
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
    deadline: false | string;
    duration: false | number;
    labelsAdd: false | string[];
    labelsRemove: false | string[];
}

export interface ErrorMessage {
    errorCode: string;
}

export interface Field {
    key: string;
    label: string;
    type?: string;
    required?: boolean;
}

export interface FilledField {
    key: string;
    value: string;
}

export interface Project {
    name: string;
    url: string;
}

export interface User {
    createTime: string;
    name: string;
    url: string;
    theme: number;
    company: {
        name: string;
        url: string;
    };
}

export interface ProjectsContextProps {
    projects: Project[] | null;
}

export interface UserContextProps {
    user: User | null;
    loginUser: (name: string, password: string) => Promise<void>;
    // logoutUser
}

export interface GenericFormProps {
    headerText: string;
    buttonText: string;
    fields: Field[];
    onSubmit: (fields: FilledField[]) => void | Promise<void>;
}
