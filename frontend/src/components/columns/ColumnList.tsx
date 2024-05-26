import { useState } from "react";
import ColumnModal from "./ColumnModal";

function ColumnList() {
    const [isOpen, setIsOpen] = useState<Boolean>(false);

    const openModal = (): void => {
        setIsOpen(true);
    };

    const closeModal = (success: Boolean = false): void => {
        setIsOpen(false);
    };

    return (
        <>
            <button onClick={openModal}>Dodaj kolumnę</button>
            {isOpen && <ColumnModal onClose={closeModal} />}
        </>
    );
}

export default ColumnList;
