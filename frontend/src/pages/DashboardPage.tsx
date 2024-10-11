import "./DashboardPage.css";
import { useEffect, useState } from "react";
import { getUserProjects } from "../data/project";
import { Project } from "../types";
import { Navigate, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import ProjectModal from "../components/ProjectModal";
import Aside from "../components/Aside";

function DashboardPage() {
    const { user } = useUser();
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[] | null>(null);
    const [redirect, setRedirect] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(true);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const openModal = (): void => {
        setIsOpen(true);
    };

    const closeModal = (success: boolean = false): void => {
        setIsOpen(false);

        if (success) {
            setRefresh(true);
        }
    };

    const openProject = (id: string): void => {
        navigate(`/project/${id}/tasks`);
    };

    useEffect(() => {
        if (refresh === true) {
            const getProjects = async () => {
                let data = await getUserProjects();

                if (data && "message" in data) {
                    setRedirect(true);
                    return;
                }

                setProjects(data ? data.projects : null);
            };

            getProjects().catch(console.error);

            setRefresh(false);
        }
    }, [refresh]);

    if (redirect) {
        return <Navigate to="/login" />;
    }

    if (!user) {
        return <Aside />;
    }

    if (projects === null) {
        return (
            <main>
                Obecnie nie masz żadnych projektów. <button onClick={openModal}>Stwórz projekt</button>
                {isOpen && <ProjectModal onClose={closeModal} />}
            </main>
        );
    }

    return (
        <main>
            <div className="dashboard-container">
                <Aside />
                <div className="dashboard-content">
                    <h1>Panel główny</h1>
                    <div className="main-stats">
                        <div className="main-stat">
                            <h2>Projekty</h2>
                            <p>{projects.length}/5</p>
                        </div>
                        <div className="main-stat">
                            <h2>Budżet</h2>
                            <p>5zł</p>
                        </div>
                        <div className="main-stat">
                            <h2>Członkowie</h2>
                            <p>1/10</p>
                        </div>
                        <div className="main-stat">
                            <h2>Licencja</h2>
                            <p>Demo</p>
                        </div>
                    </div>
                    <div className="projects-container">
                        <div className="project-summary">
                            <h2>Podsumowanie projektów</h2>
                            <table className="project-summary-table">
                                <thead>
                                    <tr>
                                        <th>Projekt</th>
                                        <th>Manager</th>
                                        <th>Termin</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.map((project) => (
                                        <tr
                                            className="project-summary-row"
                                            key={project.id}
                                            title={project.description}
                                            onClick={() => openProject(project.id)}
                                        >
                                            <td>{project.title}</td>
                                            <td>{user.name}</td>
                                            <td>01.01.2010</td>
                                            <td>W trakcie</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="project-progress">{projects.length}</div>
                    </div>
                    <button onClick={openModal}>Stwórz projekt</button>
                    {isOpen && <ProjectModal onClose={closeModal} />}
                </div>
            </div>
        </main>
    );
}

export default DashboardPage;
