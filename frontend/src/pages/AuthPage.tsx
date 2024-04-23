import { ChangeEvent, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

type Page = "login" | "register";

function AuthPage({ routerPage }: { routerPage: Page }) {
    const [page, setPage] = useState<Page>(routerPage);
    const [login, setLogin] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [repeat, setRepeat] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    const { user, loginUser, registerUser } = useUser();

    useEffect(() => {
        setPage(routerPage);
    }, [routerPage]);

    if (user) {
        return <Navigate to="/" />;
    }

    const handleLogin = (event: ChangeEvent<HTMLInputElement>) => {
        setLogin(event.target.value);
    };

    const handlePassword = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleRepeat = (event: ChangeEvent<HTMLInputElement>) => {
        setRepeat(event.target.value);
    };

    const clickRegister = async (event: React.MouseEvent) => {
        event.preventDefault();

        if (password !== repeat) {
            setMessage("Podane hasła nie są takie same");
            return;
        }

        if (login.length < 5) {
            setMessage("Login musi mieć minimum 5 znaków");
            return;
        } else if (login.length > 50) {
            setMessage("Podany login jest zbyt długi");
            return;
        }

        if (password.length < 8) {
            setMessage("Hasło musi mieć minimum 8 znaków");
            return;
        } else if (password.length > 60) {
            setMessage("Hasło jest zbyt długie");
            return;
        }

        const response = await registerUser(login, password);
        setMessage(response.message);
    };

    const clickLogin = async (event: React.MouseEvent) => {
        event.preventDefault();

        const response = await loginUser(login, password);
        setMessage(response.message);
    };

    return (
        <main>
            <form>
                <h1>{page === "login" ? "Logowanie" : "Rejestracja"}</h1>
                <div>
                    <label htmlFor="login">Login</label>
                    <input type="text" id="login" value={login} onChange={handleLogin} />
                </div>
                <div>
                    <label htmlFor="password">Hasło</label>
                    <input type="password" id="password" value={password} onChange={handlePassword} />
                </div>
                {page === "register" && (
                    <div>
                        <label htmlFor="repeat">Powtórz hasło</label>
                        <input type="password" id="repeat" value={repeat} onChange={handleRepeat} />
                    </div>
                )}

                {message}

                {page === "register" ? (
                    <>
                        <div>
                            <button onClick={clickRegister}>Zarejestruj się</button>
                        </div>
                        <div>
                            Masz już konto? <Link to="/login">Zaloguj się</Link>
                        </div>
                    </>
                ) : (
                    <>
                        <div>
                            <button onClick={clickLogin}>Zaloguj się</button>
                        </div>
                        <div>
                            Nie masz konta? <Link to="/register">Zarejestruj się</Link>
                        </div>
                    </>
                )}
            </form>
        </main>
    );
}

export default AuthPage;
