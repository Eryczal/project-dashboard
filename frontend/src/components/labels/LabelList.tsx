import { useEffect, useState } from "react";
import { useProject } from "../../contexts/ProjectContext";
import LabelModal from "./LabelModal";
import { getLabels } from "../../data/label";
import { Label } from "../../types";
import LabelDisplay from "./LabelDisplay";

function LabelList() {
    const { project } = useProject();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [labels, setLabels] = useState<Label[]>();
    const [reload, setReload] = useState<boolean>(false);

    useEffect(() => {
        if (project) {
            const loadLabels = async () => {
                const labelsData = await getLabels(project.id);

                if (labelsData && !("message" in labelsData)) {
                    setLabels(labelsData.labels);
                }

                setReload(false);
            };

            loadLabels().catch(console.error);
        }
    }, [project, reload]);

    const showModal = () => {
        setIsOpen(true);
    };

    const closeModal = (success: boolean = false): void => {
        setIsOpen(false);

        if (success) {
            setReload(true);
        }
    };

    if (!project) {
        return <></>;
    }

    return (
        <main>
            <h1>Etykiety</h1>
            {labels &&
                labels.map((label) => {
                    return <LabelDisplay label={label} key={label.id} />;
                })}
            <button onClick={showModal}>Dodaj nową etykietę</button>
            {isOpen && <LabelModal onClose={closeModal} />}
        </main>
    );
}

export default LabelList;
