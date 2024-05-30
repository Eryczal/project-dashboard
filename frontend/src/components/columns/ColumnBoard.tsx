import "./ColumnBoard.css";
import { useEffect, useState } from "react";
import ColumnModal from "./ColumnModal";
import { Column } from "../../types";
import { getColumns } from "../../data/column";
import { useProject } from "../../contexts/ProjectContext";
import TaskColumn from "./TaskColumn";

function ColumnBoard() {
    const { project } = useProject();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [columns, setColumns] = useState<Column[] | null>(null);
    const [reload, setReload] = useState<boolean>(false);

    useEffect(() => {
        if (project) {
            const loadColumns = async () => {
                const columnData = await getColumns(project.id);

                if (columnData && !("message" in columnData)) {
                    setColumns(columnData.columns);
                }

                setReload(false);
            };

            loadColumns().catch(console.error);
        }
    }, [project, reload]);

    const openModal = (): void => {
        setIsOpen(true);
    };

    const closeModal = (success: boolean = false): void => {
        setIsOpen(false);

        if (success) {
            setReload(true);
        }
    };

    if (!columns) {
        return <></>;
    }

    return (
        <>
            <div className="column-container">
                {columns.map((column) => {
                    return <TaskColumn column={column} key={column.id} />;
                })}
            </div>
            <button onClick={openModal}>Dodaj kolumnę</button>
            {isOpen && <ColumnModal onClose={closeModal} />}
        </>
    );
}

export default ColumnBoard;
