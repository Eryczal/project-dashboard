import "./TaskCard.css";
import { useProject } from "../../contexts/ProjectContext";
import { Task, TaskColumnModal } from "../../types";
import { MdAccessTime, MdCalendarMonth, MdMoreVert } from "react-icons/md";
import { useState } from "react";
import Menu from "../_compound/menu/Menu";
import RemoveTaskModal from "./RemoveTaskModal";
import EditTaskModal from "./EditTaskModal";

function TaskCard({ task, updateTasks }: { task: Task; updateTasks: () => void }) {
    const { labels } = useProject();
    const taskLabels = labels.filter((label) => task.labels?.includes(label.id));
    const [isOpen, setIsOpen] = useState<TaskColumnModal>("none");
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    const displayDuration = (duration: number): string => {
        const parsedDuration: number = duration >= 24 ? Math.floor(duration / 24) : duration;
        const durationFormat: string = duration >= 24 ? "d." : "g.";

        return `${parsedDuration} ${durationFormat}`;
    };

    const displayDeadline = (deadline: string): string => deadline.split("-").reverse().join(".");

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const openModal = (type: TaskColumnModal) => {
        setIsMenuOpen(false);
        setIsOpen(type);
    };

    const closeModal = (success: TaskColumnModal = "none") => {
        setIsOpen("none");

        if (success === "edit" || success === "delete") {
            updateTasks();
        }
    };

    return (
        <>
            <div className={`task-container${isMenuOpen ? " task-menu-open" : ""}`}>
                <div className="task">
                    <div className="task-header">
                        <h3>{task.title}</h3>
                        <MdMoreVert onClick={toggleMenu} />
                        {isMenuOpen && (
                            <Menu>
                                <Menu.item action={() => openModal("edit")}>
                                    <div>Edytuj zadanie</div>
                                </Menu.item>
                                <Menu.item action={() => openModal("delete")}>
                                    <div className={"color-danger"}>Usuń zadanie</div>
                                </Menu.item>
                            </Menu>
                        )}
                    </div>
                    <p>{task.description}</p>

                    <div className="label-container">
                        {taskLabels &&
                            taskLabels.map((label) => {
                                return (
                                    <div key={label.id} className="label">
                                        {label.title}
                                    </div>
                                );
                            })}
                    </div>
                    <div className="duration-container">
                        <div className="task-duration">
                            <MdAccessTime />
                            {displayDuration(task.duration)}
                        </div>
                        <div className="task-deadline">
                            <MdCalendarMonth />
                            {displayDeadline(task.deadline)}
                        </div>
                    </div>
                </div>
            </div>
            {isOpen === "delete" && <RemoveTaskModal onClose={closeModal} task={task} />}
            {isOpen === "edit" && <EditTaskModal onClose={closeModal} task={task} />}
        </>
    );
}

export default TaskCard;
