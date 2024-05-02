import "./TaskPage.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Project, getProjectById } from "../data/project";
import { Task } from "../data/task";
import ProjectHeader from "../components/ProjectHeader";

function TaskPage() {
    const { id } = useParams<{ id: string }>();
    const [project, setProject] = useState<Project | undefined>(undefined);
    const [tasks, setTasks] = useState<Task | undefined>(undefined);

    useEffect(() => {
        if (id) {
            const loadProject = async () => {
                const projectData = await getProjectById(id);

                if (!("message" in projectData)) {
                    setProject(projectData);
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
            <ProjectHeader project={project} />
            <p>{project.description}</p>
        </main>
    );
}

export default TaskPage;
