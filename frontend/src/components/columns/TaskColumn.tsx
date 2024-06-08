import "./TaskColumn.css";
import { Column, TaskColumnModal } from "../../types";
import { MdAddCircleOutline, MdMoreVert } from "react-icons/md";
import { useState } from "react";
import TaskModal from "../tasks/TaskModal";
import TaskCard from "../tasks/TaskCard";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import Menu from "../_compound/menu/Menu";

function TaskColumn({ column, updateTasks }: { column: Column; updateTasks: (columnId: string) => void }) {
    const [isOpen, setIsOpen] = useState<TaskColumnModal>("none");
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    const openModal = (type: TaskColumnModal): void => {
        setIsOpen(type);
    };

    const closeModal = (success: boolean = false): void => {
        setIsOpen("none");

        if (success) {
            updateTasks(column.id);
        }
    };

    const toggleMenu = (): void => {
        setIsMenuOpen((prev) => !prev);
    };

    return (
        <>
            <header className="column-header">
                <h2>{column.title}</h2>
                <div className="column-buttons">
                    <MdAddCircleOutline onClick={() => openModal("task")} />
                    <MdMoreVert onClick={toggleMenu} />
                    {isMenuOpen && (
                        <Menu>
                            <Menu.item action={() => openModal("edit")}>
                                <div>Edytuj kolumnę</div>
                            </Menu.item>
                            <Menu.item>
                                <div>Usuń kolumnę</div>
                            </Menu.item>
                        </Menu>
                    )}
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
            {isOpen === "task" && (
                <TaskModal onClose={closeModal} column={column} pos={column.tasks === undefined || column.tasks === null ? 0 : column.tasks.length} />
            )}
        </>
    );
}

export default TaskColumn;
