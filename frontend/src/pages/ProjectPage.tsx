import { useEffect, useState } from "react";
import { Project } from "../data/project";
import { Link, Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

function ProjectPage() {
    const { user } = useUser();
    const [projects, setProjects] = useState<Project[] | null>(null);
    const [redirect, setRedirect] = useState<boolean>(false);

    useEffect(() => {
        const getProjects = async (): Promise<void> => {
            let data = await getUserProjects();

            if (data && "message" in data) {
                setRedirect(true);
                return;
            }

            setProjects(data ? data.projects : null);
        };

        getProjects().catch(console.error);
    }, []);

    const addProject = async () => {
    };

    if (redirect) {
        return <Navigate to="/login" />;
    }

    if (projects === null) {
        return (
            <main>
                Obecnie nie masz żadnych projektów. <button onClick={addProject}>Stwórz projekt</button>
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
                    <Link to={`/project/${project.id}`}>Przejdź do projektu</Link>
                </div>
            ))}
        </main>
    );
}

export default ProjectPage;
