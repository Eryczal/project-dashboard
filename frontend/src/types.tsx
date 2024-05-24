import { ReactNode } from "react";

export interface ModalProps {
    onClose: () => void;
    children?: ReactNode;
}

export interface User {
    id: string;
    name: string;
    type: string;
    creationDate: string;
}

export interface Response {
    message: string;
}

export interface UserContextProps {
    user?: User;
    loginUser: (email: string, password: string) => Promise<Response>;
    registerUser: (email: string, password: string) => Promise<Response>;
    // logoutUser
}
