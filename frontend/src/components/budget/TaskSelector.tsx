import "./TaskSelector.css";
import { ChangeEvent, useEffect, useState } from "react";
import { useProject } from "../../contexts/ProjectContext";
import { ModalProps, Task } from "../../types";
import Modal from "../_compound/modal/Modal";
import { getProjectTasks } from "../../data/task";
import SelectableTask from "./SelectableTask";

function TaskSelector({ onClose, handleTask, selectedTask = "" }: ModalProps & { handleTask: (task: Task) => void; selectedTask: string }) {
    const { project } = useProject();
    const [tasks, setTasks] = useState<Task[] | null>([]);
    const [page, setPage] = useState<number>(0);
    const [search, setSearch] = useState<string>("");
    const [selected, setSelected] = useState<string>(selectedTask);

    if (!project) {
        return <></>;
    }

    useEffect(() => {
        const loadTasks = async () => {
            const taskData = await getProjectTasks(project.id, { limit: 6, page: page, search: search, sort: "desc" });

            if (taskData && !("message" in taskData)) {
                setTasks(taskData.tasks);
            } else {
                setTasks(null);
            }
        };

        loadTasks().catch(console.error);
    }, []);

    const closeModal = (success: boolean = false): void => {
        onClose(success);
    };

    const confirmTask = () => {
        const task = tasks?.find((t) => t.id === selected);

        if (task) {
            handleTask(task);
        }
    };

    const handleSearch = (event: ChangeEvent<HTMLInputElement>): void => {
        setSearch(event.target.value);
    };

    return (
        <Modal onClose={closeModal}>
            <Modal.Title>
                <h1>Połącz zadanie</h1>
            </Modal.Title>
            <Modal.Content>
                {tasks === null ? (
                    <div>Brak zadań w projekcie.</div>
                ) : (
                    <input type="text" onChange={handleSearch} value={search} placeholder="Wyszukaj zadanie po tytule" />
                )}
                <div className="selectable-container">
                    {tasks !== null &&
                        tasks.map((task: Task) => {
                            return (
                                <div
                                    onClick={() => setSelected(task.id)}
                                    className={task.id === selected ? "task-selectable-selected task-selectable-container" : "task-selectable-container"}
                                    key={task.id}
                                >
                                    <SelectableTask task={task} />
                                </div>
                            );
                        })}
                </div>
            </Modal.Content>
            <Modal.Footer>
                <button onClick={() => closeModal(false)}>Anuluj</button>
                {tasks !== null && <button onClick={confirmTask}>Wybierz zadanie</button>}
            </Modal.Footer>
        </Modal>
    );
}

export default TaskSelector;
