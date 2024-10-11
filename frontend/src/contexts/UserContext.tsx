import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { Message, Theme, User, UserContextProps } from "../types";

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

                document.body.classList.add(data.user.theme);
            };

            fetchData().catch(console.error);
        }
    }, [refetch]);

    async function registerUser(login: string, password: string): Promise<Message> {
        const sendData = new URLSearchParams();
        sendData.append("login", login);
        sendData.append("password", password);

        const response = await fetch(import.meta.env.VITE_URL + "register", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: sendData,
        });

        const data = await response.json();
        return data;
    }

    async function loginUser(login: string, password: string): Promise<Message> {
        const sendData = new URLSearchParams();
        sendData.append("login", login);
        sendData.append("password", password);

        const response = await fetch(import.meta.env.VITE_URL + "login", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: sendData,
        });

        const data = await response.json();

        setRefetch(true);

        return data;
    }

    async function changeTheme(theme: Theme) {
        const sendData = new URLSearchParams();
        sendData.append("theme", theme);

        const response = await fetch(import.meta.env.VITE_URL + "user/theme", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: sendData,
        });

        const data = await response.json();

        if (user) {
            setUser({
                ...user,
                theme,
            });
        }

        return data;
    }

    const value: UserContextProps = {
        user,
        loginUser,
        registerUser,
        changeTheme,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
