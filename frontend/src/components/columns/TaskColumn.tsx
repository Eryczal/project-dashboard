import "./TaskColumn.css";
import { Column, Task } from "../../types";
import { MdAddCircleOutline, MdMoreVert } from "react-icons/md";
import { useEffect, useState } from "react";
import TaskModal from "../tasks/TaskModal";
import { getTasks } from "../../data/task";
import TaskCard from "../tasks/TaskCard";
import { Draggable, Droppable } from "react-beautiful-dnd";

function TaskColumn({ column }: { column: Column }) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [reload, setReload] = useState<boolean>(true);
    const [tasks, setTasks] = useState<Task[] | null>(null);

    useEffect(() => {
        if (column) {
            const loadTasks = async () => {
                const taskData = await getTasks(column.id);

                if (taskData && !("message" in taskData)) {
                    setTasks(taskData.tasks);
                }

                setReload(false);
            };

            loadTasks().catch(console.error);
        }
    }, [reload]);

    const openModal = (): void => {
        setIsOpen(true);
    };

    const closeModal = (success: boolean = false): void => {
        setIsOpen(false);

        if (success) {
            setReload(true);
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
                        {tasks &&
                            tasks.map((task) => {
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
            {isOpen && <TaskModal onClose={closeModal} column={column} pos={tasks === null ? 0 : tasks.length} />}
        </>
    );
}

export default TaskColumn;
