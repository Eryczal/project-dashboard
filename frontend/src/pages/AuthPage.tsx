import { ChangeEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

type Page = "login" | "register";

function AuthPage({ routerPage }: { routerPage: Page }) {
    const [page, setPage] = useState<Page>(routerPage);
    const [login, setLogin] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [repeat, setRepeat] = useState<string>("");

    const userContext = useUser();

    useEffect(() => {
        setPage(routerPage);
    }, [routerPage]);

    const handleLogin = (event: ChangeEvent<HTMLInputElement>) => {
        setLogin(event.target.value);
    };

    const handlePassword = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleRepeat = (event: ChangeEvent<HTMLInputElement>) => {
        setRepeat(event.target.value);
    };

    const clickRegister = (event: React.MouseEvent) => {
        event.preventDefault();

        if (password === repeat) {
            userContext.registerUser(login, password);
        }
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
                            <button>Zaloguj się</button>
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
