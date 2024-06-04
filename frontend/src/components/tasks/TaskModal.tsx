import { ChangeEvent, useState } from "react";
import { Column, ModalProps } from "../../types";
import Modal from "../_compound/modal/Modal";
import LabelSelection from "./LabelSelection";
import { createTask } from "../../data/task";

function TaskModal({ onClose, column }: ModalProps & { column: Column }) {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [labels, setLabels] = useState<string[]>([]);

    if (!column) {
        return <></>;
    }

    const closeModal = (success: boolean = false): void => {
        onClose(success);
    };

    const addTask = async () => {
        let created = await createTask(column.id, title, description, labels);

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

    const handleLabel = (clicked: boolean, labelId: string): void => {
        if (clicked) {
            setLabels((prevLabels) => [...prevLabels, labelId]);
        } else {
            setLabels((prevLabels) => prevLabels.filter((l) => l !== labelId));
        }
    };

    if (!column) {
        return <></>;
    }

    return (
        <Modal onClose={closeModal}>
            <Modal.Title>
                <h1>Dodaj zadanie</h1>
                <p>Kolumna {column.title}</p>
            </Modal.Title>
            <Modal.Content>
                <p>Nazwa</p>
                <input type="text" onChange={handleTitle} value={title} />
                <p>Opis</p>
                <textarea onChange={handleDescription} value={description}></textarea>
                <p>Etykiety</p>
                <LabelSelection handleLabel={handleLabel} />
            </Modal.Content>
            <Modal.Footer>
                <button onClick={() => closeModal()}>Anuluj</button>
                <button onClick={addTask}>Dodaj</button>
            </Modal.Footer>
        </Modal>
    );
}

export default TaskModal;
