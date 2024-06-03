import "./ColumnBoard.css";
import { useEffect, useState } from "react";
import { Column } from "../../types";
import { getColumns } from "../../data/column";
import { useProject } from "../../contexts/ProjectContext";
import TaskColumn from "./TaskColumn";
import DummyColumn from "./DummyColumn";

function ColumnBoard() {
    const { project } = useProject();
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

    return (
        <>
            <div className="column-container">
                {columns &&
                    columns.map((column) => {
                        return <TaskColumn column={column} key={column.id} />;
                    })}
                <DummyColumn setReload={setReload} />
            </div>
        </>
    );
}

export default ColumnBoard;
