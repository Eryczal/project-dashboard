import "./TaskColumn.css";
import { Column } from "../../types";
import { MdAddCircleOutline, MdMoreVert } from "react-icons/md";
import { useState } from "react";
import TaskModal from "../tasks/TaskModal";

function TaskColumn({ column }: { column: Column }) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const openModal = (): void => {
        setIsOpen(true);
    };

    const closeModal = (success: boolean = false): void => {
        setIsOpen(false);

        if (success) {
            // setReload(true);
        }
    };

    return (
        <>
            <div className="column">
                <header className="column-header">
                    <h2>{column.title}</h2>
                    <div className="column-buttons">
                        <MdAddCircleOutline onClick={openModal} />
                        <MdMoreVert />
                    </div>
                </header>
            </div>
            {isOpen && <TaskModal onClose={closeModal} column={column} />}
        </>
    );
}

export default TaskColumn;
