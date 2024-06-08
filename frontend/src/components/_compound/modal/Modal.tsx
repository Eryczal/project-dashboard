import "./Modal.css";
import { ModalProps } from "../../../types";
import ReactDOM from "react-dom";
import ModalTitle from "./ModalTitle";
import ModalContent from "./ModalContent";
import ModalFooter from "./ModalFooter";
import { useEffect, useRef } from "react";

export default function Modal({ onClose, children, className }: ModalProps) {
    const modalElement = document.getElementById("modal");
    const ref = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = ref.current;

        if (dialog) {
            dialog.showModal();

            const handleOutsideClick = (event: MouseEvent) => {
                if (dialog && event.target === dialog) {
                    dialog.close();
                    onClose(false);
                }
            };

            dialog.addEventListener("click", handleOutsideClick);

            return () => {
                dialog.removeEventListener("click", handleOutsideClick);
            };
        }
    }, []);

    const handleClose = (): void => {
        ref.current?.close();
        onClose(false);
    };

    if (!modalElement) {
        throw new Error("Cannot find modal element");
    }

    return ReactDOM.createPortal(
        <dialog className={`modal-container ${className || ""}`} ref={ref} onCancel={handleClose}>
            <div className="modal">{children}</div>
        </dialog>,
        modalElement
    );
}

Modal.Title = ModalTitle;
Modal.Content = ModalContent;
Modal.Footer = ModalFooter;
