import "./ColumnBoard.css";
import { useEffect, useState } from "react";
import { Column } from "../../types";
import { getColumns } from "../../data/column";
import { useProject } from "../../contexts/ProjectContext";
import TaskColumn from "./TaskColumn";
import DummyColumn from "./DummyColumn";
import { DragDropContext, Draggable, DropResult, Droppable } from "@hello-pangea/dnd";

function ColumnBoard() {
    const { project } = useProject();
    const [columns, setColumns] = useState<Column[] | null>(null);
    const [reload, setReload] = useState<boolean>(false);

    const onDragEnd = (result: DropResult) => {
        const { type, destination, source } = result;

        if (!destination || !source || !columns) {
            return;
        }

        if (type === "column") {
            const newColumns: Column[] = [...columns];

            const element = newColumns[source.index];
            newColumns.splice(source.index, 1);
            newColumns.splice(destination.index, 0, element);

            newColumns.forEach((column, index) => {
                column.position = index;
            });

            setColumns(newColumns);
        } else if (type === "task") {
            if (destination?.droppableId === source?.droppableId) {
            }
        }
    };

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
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="all-columns" direction="horizontal" type="column">
                {(provided) => (
                    <div className="column-container" {...provided.droppableProps} ref={provided.innerRef}>
                        {columns &&
                            columns.map((column) => {
                                return (
                                    <Draggable draggableId={column.id} index={column.position} key={column.id}>
                                        {(provided) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="column">
                                                <TaskColumn column={column} />
                                            </div>
                                        )}
                                    </Draggable>
                                );
                            })}
                        {provided.placeholder}
                        <DummyColumn setReload={setReload} position={columns ? columns.length : 0} />
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}

export default ColumnBoard;
