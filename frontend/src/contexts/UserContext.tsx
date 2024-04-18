import { ReactNode, createContext, useContext, useEffect, useState } from "react";

interface User {
    id: string;
    name: string;
    type: string;
    creationDate: string;
}

interface UserContextProps {
    user?: User;
    // loginUser:
    registerUser: (email: string, password: string) => void;
    // logoutUser
}

const UserContext = createContext<UserContextProps | null>(null);

export function useUser() {
    const userContext = useContext(UserContext);

    if (userContext === null) {
        throw new Error("Context error");
    }

    return userContext;
}

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | undefined>();
    const [refetch, setRefetch] = useState<boolean>(false);

    useEffect(() => {}, [refetch]);

    async function registerUser(email: string, password: string) {
        const response = await fetch(import.meta.env.VITE_URL + "register", {
            method: "POST",
            headers: {
                "Content-Type": "aplication/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error("Connection error");
        }

        const data = await response.json();
        return data;
    }

    const value: UserContextProps = {
        user,
        registerUser,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
