import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Project, getProjectById } from "../data/project";

function TaskPage() {
    const { id } = useParams<{ id: string }>();
    const [project, setProject] = useState<Project | undefined>(undefined);

    useEffect(() => {
        if (id) {
            const loadProject = async () => {
                const data = await getProjectById(id);

                if (!("message" in data)) {
                    setProject(data);
                }
            };

            loadProject().catch(console.error);
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
