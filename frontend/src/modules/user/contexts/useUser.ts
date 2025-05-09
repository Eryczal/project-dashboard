import { useContext } from "react";
import { UserContext } from "./UserContext";

export function useUser() {
    const userContext = useContext(UserContext);

    if (userContext === null) {
        throw new Error("Context error");
    }

    return userContext;
}
