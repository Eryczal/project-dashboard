import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./GenericDialog.module.css";
import { GenericDialogProps } from "../../../../types";

export default function GenericDialog({ isOpen, onClose, children }: GenericDialogProps) {
    const dialogRef = useRef<HTMLDialogElement | null>(null);

    const handleClickOutside = useCallback(
        (e: React.MouseEvent<HTMLDialogElement> | MouseEvent) => {
            if (e.target === dialogRef.current) {
                onClose();
            }
        },
        [onClose]
    );

    useEffect(() => {
        const dialog = dialogRef.current;

        if (!dialog) {
            return;
        }

        dialog.showModal();
        dialog.addEventListener("click", handleClickOutside);

        return () => {
            dialog.removeEventListener("click", handleClickOutside);
            dialog.close();
        };
    }, [handleClickOutside]);

    const dialog = (
        <dialog ref={dialogRef} className={styles.dialog} onClick={handleClickOutside}>
            <div>{children}</div>
        </dialog>
    );

    return isOpen ? createPortal(dialog, document.body) : null;
}
