import { ReactNode, createContext, useContext, useEffect, useState } from "react";

interface User {
    id: string;
    name: string;
    type: string;
    creationDate: string;
}

interface Response {
    message: string;
}

interface UserContextProps {
    user?: User;
    loginUser: (email: string, password: string) => Promise<Response>;
    registerUser: (email: string, password: string) => Promise<Response>;
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
    const [refetch, setRefetch] = useState<boolean>(true);

    useEffect(() => {
        if (refetch) {
            const fetchData = async () => {
                const response = await fetch(import.meta.env.VITE_URL + "me", {
                    credentials: "include",
                });

                const data = await response.json();

                setRefetch(false);

                setUser(data.user);
            };

            fetchData().catch(console.error);
        }
    }, [refetch]);

    async function registerUser(login: string, password: string): Promise<Response> {
        const formData = new URLSearchParams();
        formData.append("login", login);
        formData.append("password", password);

        const response = await fetch(import.meta.env.VITE_URL + "register", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData,
        });

        const data = await response.json();
        return data;
    }

    async function loginUser(login: string, password: string): Promise<Response> {
        const formData = new URLSearchParams();
        formData.append("login", login);
        formData.append("password", password);

        const response = await fetch(import.meta.env.VITE_URL + "login", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData,
        });

        const data = await response.json();

        setRefetch(true);

        return data;
    }

    const value: UserContextProps = {
        user,
        loginUser,
        registerUser,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
