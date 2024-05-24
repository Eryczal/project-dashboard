import { ModalProps } from "../../types";
import Modal from "../_compound/modal/Modal";

function ColumnModal({ onClose }: ModalProps) {
    const closeModal = (): void => {
        onClose();
    };

    return (
        <Modal onClose={closeModal}>
            <Modal.Title>
                <h1>Dodaj kolumnę</h1>
            </Modal.Title>
            <Modal.Content>
                <p>Nazwa</p>
                <input type="text" />
                <p>Opis</p>
                <textarea></textarea>
            </Modal.Content>
            <Modal.Footer>
                <button onClick={closeModal}>Anuluj</button>
                <button>Dodaj</button>
            </Modal.Footer>
        </Modal>
    );
}

export default ColumnModal;
