import "./Modal.css";
import { ModalProps } from "../../../types";
import ReactDOM from "react-dom";
import ModalTitle from "./ModalTitle";
import ModalContent from "./ModalContent";
import ModalFooter from "./ModalFooter";

export default function Modal({ onClose, children }: ModalProps) {
    const modalElement = document.getElementById("modal");

    const handleClose = (): void => {
        onClose();
    };

    const stopPropagation = (event: React.MouseEvent): void => {
        event.stopPropagation();
    };

    if (!modalElement) {
        throw new Error("Cannot find modal element");
    }

    return ReactDOM.createPortal(
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal" role="dialog" aria-modal="true" onClick={stopPropagation}>
                {children}
            </div>
        </div>,
        modalElement
    );
}

Modal.Title = ModalTitle;
Modal.Content = ModalContent;
Modal.Footer = ModalFooter;
