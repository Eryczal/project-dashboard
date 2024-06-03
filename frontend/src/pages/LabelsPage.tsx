import "./LabelsPage.css";
import ProjectAside from "../components/ProjectAside";
import ProjectHeader from "../components/ProjectHeader";
import LabelList from "../components/labels/LabelList";

function LabelsPage() {
    return (
        <>
            <div className="labels-container">
                <ProjectAside />
                <div className="labels-page">
                    <ProjectHeader />
                    <LabelList />
                </div>
            </div>
        </>
    );
}

export default LabelsPage;
