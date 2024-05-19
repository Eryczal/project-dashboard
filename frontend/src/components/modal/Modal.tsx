import { ReactNode, useState } from "react";
import ReactDOM from "react-dom";
import ModalTitle from "./ModalTitle";
import ModalContent from "./ModalContent";
import ModalFooter from "./ModalFooter";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(isOpen);
    const modalElement = document.getElementById("modal");

    const handleClose = (): void => {
        setIsModalOpen(false);
        onClose();
    };

    if (!modalElement) {
        throw new Error("Cannot find modal element");
    }

    return ReactDOM.createPortal(
        isModalOpen && (
            <div className="modal-overlay">
                <div className="modal">{children}</div>
            </div>
        ),
        modalElement
    );
}

Modal.Title = ModalTitle;
Modal.Content = ModalContent;
Modal.Footer = ModalFooter;
