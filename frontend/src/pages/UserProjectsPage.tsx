import { useEffect, useState } from "react";
import { getUserProjects } from "../data/project";
import { Project } from "../types";
import { Link, Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import ProjectModal from "../components/ProjectModal";

function UserProjectsPage() {
    const { user } = useUser();
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
            <h1>Witaj {user ? user.name : "anonim"}</h1>
            {projects.map((project) => (
                <div key={project.id}>
                    <h2>{project.title}</h2>
                    <p>{project.description}</p>
                    <Link to={`/project/${project.id}/tasks`}>Przejdź do projektu</Link>
                </div>
            ))}
            <button onClick={openModal}>Stwórz projekt</button>
            {isOpen && <ProjectModal onClose={closeModal} />}
        </main>
    );
}

export default UserProjectsPage;
