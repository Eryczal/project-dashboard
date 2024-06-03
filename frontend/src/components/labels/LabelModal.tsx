import { ChangeEvent, useState } from "react";
import { useProject } from "../../contexts/ProjectContext";
import { ModalProps } from "../../types";
import Modal from "../_compound/modal/Modal";
import { createLabel } from "../../data/label";

function LabelModal({ onClose }: ModalProps) {
    const { project } = useProject();
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [color, setColor] = useState<string>("none");

    if (!project) {
        return <></>;
    }

    const closeModal = (success: boolean = false): void => {
        onClose(success);
    };

    const addLabel = async () => {
        let created = await createLabel(project.id, title, description, color);

        if (created.code === 201) {
            closeModal(true);
        }
    };

    const handleTitle = (event: ChangeEvent<HTMLInputElement>): void => {
        setTitle(event.target.value);
    };

    const handleDescription = (event: ChangeEvent<HTMLTextAreaElement>): void => {
        setDescription(event.target.value);
    };

    const handleColor = (event: ChangeEvent<HTMLSelectElement>): void => {
        setColor(event.target.value);
    };

    return (
        <Modal onClose={closeModal}>
            <Modal.Title>
                <h1>Dodaj etykietę</h1>
            </Modal.Title>
            <Modal.Content>
                <p>Nazwa</p>
                <input type="text" onChange={handleTitle} value={title} />
                <p>Opis</p>
                <textarea onChange={handleDescription} value={description}></textarea>
                <p>Kolor</p>
                <select onChange={handleColor} value={color}>
                    <option value="none">None</option>
                    <option value="red">Red</option>
                </select>
            </Modal.Content>
            <Modal.Footer>
                <button onClick={() => closeModal(false)}>Anuluj</button>
                <button onClick={addLabel}>Dodaj</button>
            </Modal.Footer>
        </Modal>
    );
}

export default LabelModal;
