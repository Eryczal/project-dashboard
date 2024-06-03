import { Label } from "../../types";

function LabelDisplay({ label }: { label: Label }) {
    return <h1>{label.title}</h1>;
}

export default LabelDisplay;
