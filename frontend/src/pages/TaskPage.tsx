import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProjectById } from "../data/project";
import { Project } from "../data/project";

function TaskPage() {
    const { id } = useParams<{ id: string }>();
    const [project, setProject] = useState<Project | undefined>(undefined);

    useEffect(() => {
        if (id) {
            const data = getProjectById(parseInt(id));

            setProject(data);
        }
    }, []);

    if (project === undefined) {
        return <>Błąd</>;
    }

    return (
        <main>
            <h1>{project.title}</h1>
            <p>{project.description}</p>
        </main>
    );
}

export default TaskPage;
