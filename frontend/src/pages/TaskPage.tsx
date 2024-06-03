import "./TaskPage.css";
import ProjectHeader from "../components/ProjectHeader";
import ProjectAside from "../components/ProjectAside";
import ColumnBoard from "../components/columns/ColumnBoard";
import { useProject } from "../contexts/ProjectContext";

function TaskPage() {
    const { project } = useProject();

    if (project === undefined) {
        return <>Błąd</>;
    }

    return (
        <div className="task-container">
            <ProjectAside />
            <div className="task-page">
                <ProjectHeader />
                <main>
                    <ColumnBoard />
                </main>
            </div>
        </div>
    );
}

export default TaskPage;
