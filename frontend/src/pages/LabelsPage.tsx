import "./LabelsPage.css";
import Aside from "../components/Aside";
import ProjectHeader from "../components/ProjectHeader";
import LabelList from "../components/labels/LabelList";

function LabelsPage() {
    return (
        <>
            <div className="labels-container">
                <Aside />
                <div className="labels-page">
                    <ProjectHeader />
                    <LabelList />
                </div>
            </div>
        </>
    );
}

export default LabelsPage;
