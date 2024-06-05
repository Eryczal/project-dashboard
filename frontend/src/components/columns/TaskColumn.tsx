import "./TaskColumn.css";
import { Column, Task } from "../../types";
import { MdAddCircleOutline, MdMoreVert } from "react-icons/md";
import { useEffect, useState } from "react";
import TaskModal from "../tasks/TaskModal";
import { getTasks } from "../../data/task";
import TaskCard from "../tasks/TaskCard";

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
            <div className="column">
                <header className="column-header">
                    <h2>{column.title}</h2>
                    <div className="column-buttons">
                        <MdAddCircleOutline onClick={openModal} />
                        <MdMoreVert />
                    </div>
                </header>
                {tasks ? (
                    tasks.map((task) => {
                        return <TaskCard task={task} key={task.id} />;
                    })
                ) : (
                    <div>Brak zadań</div>
                )}
            </div>
            {isOpen && <TaskModal onClose={closeModal} column={column} pos={tasks === null ? 0 : tasks.length} />}
        </>
    );
}

export default TaskColumn;
