import { Label } from "../../types";

function LabelDisplay({ label }: { label: Label }) {
    return (
        <div>
            <h3>{label.title}</h3>
            <p>{label.description}</p>
        </div>
    );
}

export default LabelDisplay;
