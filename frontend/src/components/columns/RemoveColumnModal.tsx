import { TaskColumnModal, TaskModalProps } from "../../types";
import Modal from "../_compound/modal/Modal";
import { deleteColumn } from "../../data/column";

function RemoveColumnModal({ onClose, column }: TaskModalProps) {
    const closeModal = (success: TaskColumnModal = "none"): void => {
        onClose(success);
    };

    if (!column) {
        return <></>;
    }

    const removeColumn = async () => {
        let removed = await deleteColumn(column.id);

        if (removed.code === 200) {
            closeModal("delete");
        }
    };

    return (
        <Modal onClose={closeModal}>
            <Modal.Title>
                <h1>Usuń kolumnę</h1>
            </Modal.Title>
            <Modal.Content>
                <p>
                    Czy na pewno usunąć kolumnę <span className="color-danger">{column.title}</span> wraz ze wszystkimi zadaniami przypisanymi do niej?
                </p>
            </Modal.Content>
            <Modal.Footer>
                <button onClick={() => closeModal("none")}>Anuluj</button>
                <button className="color-danger" onClick={removeColumn}>
                    Usuń kolumnę
                </button>
            </Modal.Footer>
        </Modal>
    );
}

export default RemoveColumnModal;
