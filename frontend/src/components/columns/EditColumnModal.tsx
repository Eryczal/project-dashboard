import { ChangeEvent, useState } from "react";
import { EditColumnData, TaskColumnModal, TaskModalProps } from "../../types";
import Modal from "../_compound/modal/Modal";
import { useProject } from "../../contexts/ProjectContext";
import { Navigate } from "react-router-dom";
import { updateColumn } from "../../data/column";

function EditColumnModal({ onClose, column }: TaskModalProps) {
    const { project } = useProject();
    const [title, setTitle] = useState<string>(column?.title || "");
    const [description, setDescription] = useState<string>(column?.description || "");

    if (!project || !column) {
        return <Navigate to="/" />;
    }

    const closeModal = (success: TaskColumnModal = "none"): void => {
        onClose(success);
    };

    const editColumn = async () => {
        let sendData: EditColumnData = {
            title: title === column.title ? false : title,
            description: description === column.description ? false : description,
        };

        if (title !== column.title || description !== column.description) {
            let edited = await updateColumn(column.id, sendData);

            if (edited.code === 200) {
                closeModal("edit");
            }
        } else {
            closeModal("none");
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
                <h1>Edytuj kolumnę</h1>
            </Modal.Title>
            <Modal.Content>
                <p>Nazwa</p>
                <input type="text" onChange={handleTitle} value={title} />
                <p>Opis</p>
                <textarea onChange={handleDescription} value={description}></textarea>
            </Modal.Content>
            <Modal.Footer>
                <button onClick={() => closeModal("none")}>Anuluj</button>
                <button onClick={editColumn}>Edytuj</button>
            </Modal.Footer>
        </Modal>
    );
}

export default EditColumnModal;
