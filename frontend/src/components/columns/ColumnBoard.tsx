import "./ColumnBoard.css";
import { useEffect, useState } from "react";
import { Column, Task } from "../../types";
import { getColumns, moveColumn } from "../../data/column";
import { useProject } from "../../contexts/ProjectContext";
import TaskColumn from "./TaskColumn";
import DummyColumn from "./DummyColumn";
import { DragDropContext, Draggable, DropResult, Droppable } from "@hello-pangea/dnd";
import { getTasks, moveTask, moveTaskToColumn } from "../../data/task";

function ColumnBoard() {
    const { project } = useProject();
    const [columns, setColumns] = useState<Column[] | null>(null);
    const [reload, setReload] = useState<boolean>(true);
    const [reloadColumnId, setReloadColumnId] = useState<string | null>(null);
    const [isColumnMoveable, setIsColumnMoveable] = useState<boolean>(true);
    const [isTaskMoveable, setIsTaskMoveable] = useState<boolean>(true);

    const onDragEnd = async (result: DropResult) => {
        const { type, destination, source } = result;

        if (!project || !destination || !source || !columns) {
            return;
        }

        if (type === "column") {
            if (!isColumnMoveable) {
                return;
            }

            if (source.index === destination.index) {
                return;
            }

            setIsColumnMoveable(false);

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

            setIsColumnMoveable(true);
        } else if (type === "task") {
            if (!isTaskMoveable) {
                return;
            }

            setIsTaskMoveable(false);

            if (destination.droppableId === source.droppableId) {
                const column: Column | undefined = columns.find((c) => c.id === destination.droppableId);

                if (!column) {
                    return;
                }

                if (source.index === destination.index) {
                    setIsTaskMoveable(true);
                    return;
                }

                const newTasks: Task[] = JSON.parse(JSON.stringify(column.tasks));
                const oldTasks: Task[] = JSON.parse(JSON.stringify(column.tasks));

                const element: Task = newTasks[source.index];
                newTasks.splice(source.index, 1);
                newTasks.splice(destination.index, 0, element);

                newTasks.forEach((task, index) => {
                    task.position = index;
                });

                updateColumnTasks(destination.droppableId, newTasks);

                const movedTask = await moveTask(element.id, column.id, source.index, destination.index);

                if (movedTask.code !== 200) {
                    updateColumnTasks(destination.droppableId, oldTasks);
                }

                setIsTaskMoveable(true);
            } else {
                const sourceColumn: Column | undefined = columns.find((c) => c.id === source.droppableId);
                const destinationColumn: Column | undefined = columns.find((c) => c.id === destination.droppableId);

                if (!sourceColumn || !destinationColumn) {
                    return;
                }

                const sourceNewTasks: Task[] = JSON.parse(JSON.stringify(sourceColumn.tasks));
                const sourceOldTasks: Task[] = JSON.parse(JSON.stringify(sourceColumn.tasks));
                const destinationNewTasks: Task[] = JSON.parse(JSON.stringify(destinationColumn.tasks));
                const destinationOldTasks: Task[] = JSON.parse(JSON.stringify(destinationColumn.tasks));

                const element: Task = sourceNewTasks.splice(source.index, 1)[0];

                sourceNewTasks.forEach((task, index) => {
                    task.position = index;
                });

                updateColumnTasks(source.droppableId, sourceNewTasks);

                destinationNewTasks.splice(destination.index, 0, element);

                destinationNewTasks.forEach((task, index) => {
                    task.position = index;
                });

                updateColumnTasks(destination.droppableId, destinationNewTasks);

                const movedTask = await moveTaskToColumn({
                    id: element.id,
                    sourceColumnId: sourceColumn.id,
                    destinationColumnId: destinationColumn.id,
                    sourceIndex: source.index,
                    destinationIndex: destination.index,
                });

                if (movedTask.code !== 200) {
                    updateColumnTasks(source.droppableId, sourceOldTasks);
                    updateColumnTasks(destination.droppableId, destinationOldTasks);
                }

                setIsTaskMoveable(true);
            }
        }
    };

    useEffect(() => {
        if (project && reload) {
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

    useEffect(() => {
        if (reloadColumnId !== null) {
            const loadTasks = async () => {
                const taskData = await getTasks(reloadColumnId);

                if (taskData && !("message" in taskData)) {
                    updateColumnTasks(reloadColumnId, taskData.tasks);
                } else {
                    updateColumnTasks(reloadColumnId, []);
                }

                setReloadColumnId(null);
            };

            loadTasks().catch(console.error);
        }
    }, [reloadColumnId]);

    const updateColumnTasks = (columndId: string, tasks: Task[]) => {
        setColumns((prevColumns) => {
            return (
                prevColumns?.map((column) => {
                    return column.id === columndId ? { ...column, tasks: tasks } : column;
                }) || null
            );
        });
    };

    const updateColumns = () => {
        setReload(true);
    };

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
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className={`column${snapshot.isDragging ? " column-dragging" : ""}`}
                                            >
                                                <TaskColumn column={column} updateTasks={updateTasks} updateColumns={updateColumns} />
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
