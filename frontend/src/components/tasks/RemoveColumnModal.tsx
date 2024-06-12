import { deleteTask } from "../../data/task";
import { TaskColumnModal, TaskModalProps } from "../../types";
import Modal from "../_compound/modal/Modal";

function RemoveTaskModal({ onClose, task }: TaskModalProps) {
    const closeModal = (success: TaskColumnModal = "none"): void => {
        onClose(success);
    };

    if (!task) {
        return <></>;
    }

    const removeTask = async () => {
        let removed = await deleteTask(task.id);

        if (removed.code === 200) {
            closeModal("delete");
        }
    };

    return (
        <Modal onClose={closeModal}>
            <Modal.Title>
                <h1>Usuń zadanie</h1>
            </Modal.Title>
            <Modal.Content>
                <p>
                    Czy na pewno usunąć zadanie <span className="color-danger">{task.title}</span>?
                </p>
            </Modal.Content>
            <Modal.Footer>
                <button onClick={() => closeModal("none")}>Anuluj</button>
                <button className="color-danger" onClick={removeTask}>
                    Usuń zadanie
                </button>
            </Modal.Footer>
        </Modal>
    );
}

export default RemoveTaskModal;
