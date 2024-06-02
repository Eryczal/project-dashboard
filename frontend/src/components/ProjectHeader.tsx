import { MdMenu, MdClose } from "react-icons/md";
import "./ProjectHeader.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useProject } from "../contexts/ProjectContext";

export default function ProjectHeader() {
    const { project } = useProject();
    const [isOpened, setIsOpened] = useState<boolean>(false);

    const openMenu = (): void => {
        setIsOpened(!isOpened);
    };

    if (!project) {
        return <></>;
    }

    return (
        <header className="project-header">
            <div className="header-name">
                <div className="project-desc">
                    <h1>{project.title}</h1>
                    <p>{project.description}</p>
                </div>
                {isOpened ? <MdClose onClick={openMenu} className="more-menu" /> : <MdMenu onClick={openMenu} className="more-menu" />}
            </div>
            <div className="header-nav" style={{ display: isOpened ? "block" : "none" }}>
                <Link to={`/project/${project.id}/tasks`}>Zadania</Link>
            </div>
        </header>
    );
}
