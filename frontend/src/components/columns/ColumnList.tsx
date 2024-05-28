import { useEffect, useState } from "react";
import ColumnModal from "./ColumnModal";
import { Column } from "../../types";
import { getColumns } from "../../data/column";
import { useProject } from "../../contexts/ProjectContext";

function ColumnList() {
    const { project } = useProject();
    const [isOpen, setIsOpen] = useState<Boolean>(false);
    const [columns, setColumns] = useState<Column[]>();

    useEffect(() => {
        if (project) {
            const loadColumns = async () => {
                const columnData = await getColumns(project.id);

                if (!("message" in columnData)) {
                    setColumns(columnData);
                }
            };

            loadColumns().catch(console.error);
        }
    }, []);

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
