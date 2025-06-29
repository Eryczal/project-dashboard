import { useNavigate } from "react-router-dom";
import { useUser } from "../../../contexts/useUser";
import UserLoginForm from "../../components/UserLoginForm/UserLoginForm";
import styles from "./UserLoginPage.module.css";
import { useEffect } from "react";

export default function UserLoginPage() {
    const { user } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (user !== null) {
            navigate(`${user.company.url}/projects`);
        }
    }, [user, navigate]);

    return (
        <main className={styles.loginPage}>
            <UserLoginForm />
        </main>
    );
}
