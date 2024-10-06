import { Link } from "react-router-dom";
import "./Aside.css";

export default function Aside() {
    return (
        <aside className="aside">
            <div className="aside-name">Project Dashboard</div>
            <div className="aside-nav-list">
                <nav>
                    <ul>
                        <li>
                            <Link to="/dashboard">Panel główny</Link>
                        </li>
                        <li>
                            <Link to="/projects">Projekty</Link>
                        </li>
                        <li>
                            <Link to="/tasks">Zadania</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </aside>
    );
}
