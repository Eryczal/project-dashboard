import "./ColumnBoard.css";
import { useEffect, useState } from "react";
import { Column } from "../../types";
import { getColumns, moveColumn } from "../../data/column";
import { useProject } from "../../contexts/ProjectContext";
import TaskColumn from "./TaskColumn";
import DummyColumn from "./DummyColumn";
import { DragDropContext, Draggable, DropResult, Droppable } from "@hello-pangea/dnd";
import { getTasks } from "../../data/task";

function ColumnBoard() {
    const { project } = useProject();
    const [columns, setColumns] = useState<Column[] | null>(null);
    const [reload, setReload] = useState<boolean>(false);
    const [reloadColumnId, setReloadColumnId] = useState<string | null>(null);

    const onDragEnd = async (result: DropResult) => {
        const { type, destination, source } = result;

        if (!project || !destination || !source || !columns) {
            return;
        }

        if (type === "column") {
            const newColumns: Column[] = JSON.parse(JSON.stringify(columns));
            const oldColumns: Column[] = JSON.parse(JSON.stringify(columns));

            const element = newColumns[source.index];
            newColumns.splice(source.index, 1);
            newColumns.splice(destination.index, 0, element);

            newColumns.forEach((column, index) => {
                column.position = index;
            });

            setColumns(newColumns);

            const movedColumn = await moveColumn(element.id, project.id, source.index, destination.index);

            if (movedColumn.code !== 200) {
                setColumns(oldColumns);
            }
        } else if (type === "task") {
            if (destination.droppableId === source.droppableId) {
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

                console.log(columns);

                setReload(false);
            };

            loadColumns().catch(console.error);
        }
    }, [project, reload]);

    useEffect(() => {
        if (reloadColumnId !== null) {
            const loadTasks = async () => {
                const taskData = await getTasks(reloadColumnId);

                if (taskData && !("message" in taskData)) {
                    setColumns((prevColumns) => {
                        return (
                            prevColumns?.map((column) => {
                                return column.id === reloadColumnId ? { ...column, tasks: taskData.tasks } : column;
                            }) || null
                        );
                    });
                }

                setReloadColumnId(null);
            };

            loadTasks().catch(console.error);
        }
    }, [reloadColumnId]);

    const updateTasks = (columnId: string) => {
        setReloadColumnId(columnId);
    };

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
                                                <TaskColumn column={column} updateTasks={updateTasks} />
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
