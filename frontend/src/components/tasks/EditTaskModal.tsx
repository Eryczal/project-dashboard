import "./TaskModal.css";
import { ChangeEvent, useState } from "react";
import { EditTaskData, TaskColumnModal, TaskModalProps } from "../../types";
import Modal from "../_compound/modal/Modal";
import LabelSelection from "./LabelSelection";
import { updateTask } from "../../data/task";

function EditTaskModal({ onClose, task }: TaskModalProps) {
    const [title, setTitle] = useState<string>(task?.title || "");
    const [description, setDescription] = useState<string>(task?.description || "");
    const [labels, setLabels] = useState<string[]>(task?.labels || []);

    if (!task) {
        return <></>;
    }

    const closeModal = (success: TaskColumnModal = "none"): void => {
        onClose(success);
    };

    const editTask = async () => {
        if (title === task.title && description === task.description && JSON.stringify(labels) === JSON.stringify(task.labels)) {
            return;
        }

        const labelsAdd = labels.filter((label) => !task.labels?.includes(label));
        const labelsRemove = task.labels?.filter((label) => !labels.includes(label)) || [];

        let sendData: EditTaskData = {
            title: title === task.title ? false : title,
            description: description === task.description ? false : description,
            labelsAdd: labelsAdd.length === 0 ? false : labelsAdd,
            labelsRemove: labelsRemove.length === 0 ? false : labelsRemove,
        };

        let edited = await updateTask(task.id, sendData);

        if (edited.code === 200) {
            closeModal("edit");
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

    return (
        <Modal onClose={closeModal} className="task-modal">
            <Modal.Title>
                <h1>Edytuj zadanie</h1>
            </Modal.Title>
            <Modal.Content>
                <p>Nazwa</p>
                <input type="text" onChange={handleTitle} value={title} />
                <p>Opis</p>
                <textarea onChange={handleDescription} value={description}></textarea>
                <p>Etykiety</p>
                <LabelSelection handleLabel={handleLabel} activeLabels={task.labels} />
            </Modal.Content>
            <Modal.Footer>
                <button onClick={() => closeModal()}>Anuluj</button>
                <button onClick={editTask}>Edytuj</button>
            </Modal.Footer>
        </Modal>
    );
}

export default EditTaskModal;
