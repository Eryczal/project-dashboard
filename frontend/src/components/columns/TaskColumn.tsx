import "./TaskColumn.css";
import { Column, TaskColumnModal } from "../../types";
import { MdAddCircleOutline, MdMoreVert } from "react-icons/md";
import { useState } from "react";
import TaskModal from "../tasks/TaskModal";
import TaskCard from "../tasks/TaskCard";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import Menu from "../_compound/menu/Menu";
import RemoveColumnModal from "./RemoveColumnModal";
import EditColumnModal from "./EditColumnModal";

function TaskColumn({ column, updateTasks, updateColumns }: { column: Column; updateTasks: (columnId: string) => void; updateColumns: () => void }) {
    const [isOpen, setIsOpen] = useState<TaskColumnModal>("none");
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    const openModal = (type: TaskColumnModal): void => {
        setIsMenuOpen(false);
        setIsOpen(type);
    };

    const closeModal = (success: TaskColumnModal = "none"): void => {
        setIsOpen("none");

        if (success === "task") {
            updateTasks(column.id);
        } else {
            updateColumns();
        }
    };

    const toggleMenu = (): void => {
        setIsMenuOpen((prev) => !prev);
    };

    const updateColumnTasks = () => {
        updateTasks(column.id);
    };

    return (
        <>
            <header className="column-header">
                <div></div>
                <div className="column-title">
                    <h2>{column.title}</h2>
                    <p>{column.description}</p>
                </div>
                <div className="column-buttons">
                    <MdAddCircleOutline onClick={() => openModal("task")} />
                    <MdMoreVert onClick={toggleMenu} />
                    {isMenuOpen && (
                        <Menu>
                            <Menu.item action={() => openModal("edit")}>
                                <div>Edytuj kolumnę</div>
                            </Menu.item>
                            <Menu.item action={() => openModal("delete")}>
                                <div className={"color-danger"}>Usuń kolumnę</div>
                            </Menu.item>
                        </Menu>
                    )}
                </div>
            </header>
            <Droppable droppableId={column.id} type="task">
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`column-dragging-over${snapshot.isDraggingOver ? " column-dragging-over-active" : ""}`}
                    >
                        {column.tasks &&
                            column.tasks.map((task) => {
                                return (
                                    <Draggable draggableId={task.id} index={task.position} key={task.id}>
                                        {(provided, snapshot) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                <div className={`task-dragging${snapshot.isDragging ? " task-dragging-active" : ""}`}>
                                                    <TaskCard task={task} updateTasks={updateColumnTasks} />
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                );
                            })}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
            {isOpen === "task" && (
                <TaskModal onClose={closeModal} column={column} pos={column.tasks === undefined || column.tasks === null ? 0 : column.tasks.length} />
            )}
            {isOpen === "edit" && <EditColumnModal onClose={closeModal} column={column} />}
            {isOpen === "delete" && <RemoveColumnModal onClose={closeModal} column={column} />}
        </>
    );
}

export default TaskColumn;
