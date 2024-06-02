import "./LabelsPage.css";
import ProjectAside from "../components/ProjectAside";
import ProjectHeader from "../components/ProjectHeader";
import { useProject } from "../contexts/ProjectContext";

function LabelsPage() {
    const { project } = useProject();

    if (!project) {
        return <></>;
    }

    return (
        <>
            <div className="labels-container">
                <ProjectAside />
                <div className="labels-page">
                    <ProjectHeader />
                    <h1>Etykiety</h1>
                </div>
            </div>
        </>
    );
}

export default LabelsPage;
