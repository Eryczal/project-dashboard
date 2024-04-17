import { useEffect, useState } from "react";
import { getUserProjects } from "../data/project";
import { Project } from "../data/project";
import { Link } from "react-router-dom";

function ProjectPage() {
    const [projects, setProjects] = useState<Project[] | null>(null);

    useEffect(() => {
        let data = getUserProjects();
        setProjects(data);
    }, []);

    if (projects === null) {
        return <main>Wystąpił problem</main>;
    }

    return (
        <main>
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
