import "./TaskPage.css";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProjectById } from "../data/project";
import ProjectHeader from "../components/ProjectHeader";
import ProjectAside from "../components/ProjectAside";
import ColumnList from "../components/columns/ColumnList";
import { useProject } from "../contexts/ProjectContext";

function TaskPage() {
    const { id } = useParams<{ id: string }>();
    const { project, setProject } = useProject();

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
        <div className="task-container">
            <ProjectAside />
            <div className="task-page">
                <ProjectHeader />
                <main>
                    <ColumnList />
                </main>
            </div>
        </div>
    );
}

export default TaskPage;
