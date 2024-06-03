import { ChangeEvent, useState } from "react";
import { createColumn } from "../../data/column";
import { ModalProps } from "../../types";
import Modal from "../_compound/modal/Modal";
import { useProject } from "../../contexts/ProjectContext";
import { Navigate } from "react-router-dom";

function ColumnModal({ onClose }: ModalProps) {
    const { project } = useProject();
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    if (!project) {
        return <Navigate to="/" />;
    }

    const closeModal = (success: boolean = false): void => {
        onClose(success);
    };

    const addColumn = async () => {
        let created = await createColumn(project.id, title, description);

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

    return (
        <Modal onClose={closeModal}>
            <Modal.Title>
                <h1>Dodaj kolumnę</h1>
            </Modal.Title>
            <Modal.Content>
                <p>Nazwa</p>
                <input type="text" onChange={handleTitle} value={title} />
                <p>Opis</p>
                <textarea onChange={handleDescription} value={description}></textarea>
            </Modal.Content>
            <Modal.Footer>
                <button onClick={() => closeModal(false)}>Anuluj</button>
                <button onClick={addColumn}>Dodaj</button>
            </Modal.Footer>
        </Modal>
    );
}

export default ColumnModal;
