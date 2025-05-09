import UserLoginForm from "../../components/UserLoginForm/UserLoginForm";
import styles from "./UserLoginPage.module.css";

export default function UserLoginPage() {
    return (
        <main className={styles.loginPage}>
            <UserLoginForm />
        </main>
    );
}
