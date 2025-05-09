import { Link } from "react-router-dom";
import { useUser } from "../../../user/contexts/useUser";
import styles from "./NotFoundPage.module.css";

export default function NotFoundPage() {
    const { user } = useUser();

    return (
        <main className={styles.main}>
            <div>
                <h1>404</h1>
                <p>Nie znaleziono podanej strony.</p>
                {user ? <Link to={`/${user.company.url}/projects`}>Przeglądaj projekty</Link> : <Link to="/login">Zaloguj się</Link>}
            </div>
        </main>
    );
}
