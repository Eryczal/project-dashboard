import { useProject } from "../../contexts/ProjectContext";
import { LabelSelectionProps } from "../../types";
import SelectableLabel from "./SelectableLabel";

function LabelSelection({ handleLabel }: LabelSelectionProps) {
    const { labels } = useProject();

    return (
        <div className="modal-labels">
            {labels &&
                labels.map((label) => {
                    return <SelectableLabel label={label} handleLabel={handleLabel} key={label.id} />;
                })}
        </div>
    );
}

export default LabelSelection;
