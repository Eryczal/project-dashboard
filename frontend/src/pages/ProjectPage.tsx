import { useEffect, useState } from "react";
import { getUserProjects, createProject } from "../data/project";
import { Project } from "../types";
import { Link, Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

function ProjectPage() {
    const { user } = useUser();
    const [projects, setProjects] = useState<Project[] | null>(null);
    const [redirect, setRedirect] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(true);

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

    const addProject = async () => {
        let created = await createProject();

        if ("code" in created && created.code === 201) {
            setRefresh(true);
        }
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
                    <Link to={`/project/${project.id}/tasks`}>Przejdź do projektu</Link>
                </div>
            ))}
            <button onClick={addProject}>Stwórz projekt</button>
        </main>
    );
}

export default ProjectPage;
