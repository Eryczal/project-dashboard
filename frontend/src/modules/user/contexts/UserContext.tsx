import { createContext, ReactNode, useEffect, useState } from "react";
import { ErrorMessage, User, UserContextProps } from "../../../types";

export const UserContext = createContext<UserContextProps | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [refetch, setRefetch] = useState<boolean>(true);

    const fetchUserData = async (): Promise<void> => {
        const response = await fetch(import.meta.env.VITE_URL + "user/me", {
            credentials: "include",
        });

        const data: User | ErrorMessage = await response.json();

        setRefetch(false);

        setUser("errorCode" in data ? null : data);
    };

    useEffect(() => {
        if (refetch) {
            (async () => {
                try {
                    await fetchUserData();
                } catch (e) {
                    console.error(e);
                }
            })();
        }
    }, [refetch]);

    async function loginUser(name: string, password: string): Promise<void> {
        const sendData = new URLSearchParams();
        sendData.append("name", name);
        sendData.append("password", password);

        const response = await fetch(import.meta.env.VITE_URL + "user/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: sendData,
        });

        const data: User | ErrorMessage = await response.json();

        if (!("errorCode" in data)) {
            setUser(data);
        }
    }

    const value: UserContextProps = {
        user,
        loginUser,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
