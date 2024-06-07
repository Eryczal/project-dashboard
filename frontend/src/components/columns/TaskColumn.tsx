import "./TaskColumn.css";
import { Column } from "../../types";
import { MdAddCircleOutline, MdMoreVert } from "react-icons/md";
import { useState } from "react";
import TaskModal from "../tasks/TaskModal";
import TaskCard from "../tasks/TaskCard";
import { Draggable, Droppable } from "@hello-pangea/dnd";

function TaskColumn({ column, updateTasks }: { column: Column; updateTasks: (columnId: string) => void }) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const openModal = (): void => {
        setIsOpen(true);
    };

    const closeModal = (success: boolean = false): void => {
        setIsOpen(false);

        if (success) {
            updateTasks(column.id);
        }
    };

    return (
        <>
            <header className="column-header">
                <h2>{column.title}</h2>
                <div className="column-buttons">
                    <MdAddCircleOutline onClick={openModal} />
                    <MdMoreVert />
                </div>
            </header>
            <Droppable droppableId={column.id} type="task">
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} style={{ height: "100%" }}>
                        {column.tasks &&
                            column.tasks.map((task) => {
                                return (
                                    <Draggable draggableId={task.id} index={task.position} key={task.id}>
                                        {(provided) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                <TaskCard task={task} />
                                            </div>
                                        )}
                                    </Draggable>
                                );
                            })}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
            {isOpen && <TaskModal onClose={closeModal} column={column} pos={column.tasks === undefined || column.tasks === null ? 0 : column.tasks.length} />}
        </>
    );
}

export default TaskColumn;
