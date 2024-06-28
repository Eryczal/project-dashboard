import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

function NotFoundPage() {
    const { user } = useUser();

    return (
        <main>
            <h1>Nie znaleziono strony</h1>
            {user ? <Link to="/projects">Przejdź do projektów</Link> : <Link to="/login">Przejdź do logowania</Link>}
        </main>
    );
}

export default NotFoundPage;
