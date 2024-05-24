import "./TaskPage.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Project, getProjectById } from "../data/project";
import { Column, getColumns } from "../data/column";
import { Task } from "../data/task";
import ProjectHeader from "../components/ProjectHeader";
import ProjectAside from "../components/ProjectAside";
import ColumnList from "../components/columns/ColumnList";

function TaskPage() {
    const { id } = useParams<{ id: string }>();
    const [project, setProject] = useState<Project | undefined>(undefined);
    const [columns, setColumns] = useState<Column | undefined>(undefined);
    const [tasks, setTasks] = useState<Task | undefined>(undefined);

    useEffect(() => {
        if (id) {
            const loadProject = async () => {
                const projectData = await getProjectById(id);
                const columnsData = await getColumns(id);

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
        <div className="task-container">
            <ProjectAside />
            <div className="task-page">
                <ProjectHeader project={project} />
                <main>
                    <ColumnList />
                </main>
            </div>
        </div>
    );
}

export default TaskPage;
