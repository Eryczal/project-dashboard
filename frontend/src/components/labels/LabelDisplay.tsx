import { Label } from "../../types";
import "./LabelDisplay.css";

function LabelDisplay({ label }: { label: Label }) {
    return (
        <div className="full-label">
            <h3>{label.title}</h3>
            <p>{label.description}</p>
        </div>
    );
}

export default LabelDisplay;
