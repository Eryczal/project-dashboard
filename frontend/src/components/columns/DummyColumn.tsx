import { Dispatch, SetStateAction, useState } from "react";
import ColumnModal from "./ColumnModal";
import "./DummyColumn.css";
import { MdAddCircleOutline } from "react-icons/md";

function DummyColumn({ setReload }: { setReload: Dispatch<SetStateAction<boolean>> }) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const openModal = (): void => {
        setIsOpen(true);
    };

    const closeModal = (success: boolean = false): void => {
        setIsOpen(false);

        if (success) {
            setReload(true);
        }
    };

    return (
        <>
            <div className="column dummy-column" onClick={openModal}>
                <div className="dummy-column-buttons">
                    <MdAddCircleOutline />
                    <p>Dodaj kolumnę</p>
                </div>
            </div>
            {isOpen && <ColumnModal onClose={closeModal} />}
        </>
    );
}

export default DummyColumn;
