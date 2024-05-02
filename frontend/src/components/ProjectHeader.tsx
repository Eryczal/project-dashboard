import { Project } from "../data/project";
import { MdMenu, MdClose } from "react-icons/md";
import "./ProjectHeader.css";
import { useState } from "react";

export default function ProjectHeader({ project }: { project: Project }) {
    const [isOpened, setIsOpened] = useState<boolean>(false);

    const openMenu = (): void => {
        setIsOpened(!isOpened);
    };

    return (
        <>
            <header className="project-header">
                <h1>{project.title}</h1>
                {isOpened ? <MdClose onClick={openMenu} className="more-menu" /> : <MdMenu onClick={openMenu} className="more-menu" />}
            </header>
            <div className="header-overlay" style={{ display: isOpened ? "block" : "none" }}></div>
        </>
    );
}
