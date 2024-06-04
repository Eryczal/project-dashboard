import { useEffect, useState } from "react";
import { useProject } from "../../contexts/ProjectContext";
import { getLabels } from "../../data/label";
import { Label, LabelSelectionProps } from "../../types";
import SelectableLabel from "./SelectableLabel";

function LabelSelection({ handleLabel }: LabelSelectionProps) {
    const { project } = useProject();
    const [projectLabels, setProjectLables] = useState<Label[]>([]);

    useEffect(() => {
        if (project) {
            const loadLabels = async () => {
                const labelsData = await getLabels(project.id);

                if (labelsData && !("message" in labelsData)) {
                    setProjectLables(labelsData.labels);
                }
            };

            loadLabels().catch(console.error);
        }
    }, []);

    return (
        <div>
            {projectLabels &&
                projectLabels.map((label) => {
                    return <SelectableLabel label={label} handleLabel={handleLabel} key={label.id} />;
                })}
        </div>
    );
}

export default LabelSelection;
