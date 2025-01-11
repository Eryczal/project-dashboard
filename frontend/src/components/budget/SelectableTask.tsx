import "./SelectableTask.css";
import { useProject } from "../../contexts/ProjectContext";
import { Task } from "../../types";
import { MdAccessTime, MdCalendarMonth } from "react-icons/md";
function SelectableTask({ task }: { task: Task }) {
    const { labels } = useProject();
    const taskLabels = labels.filter((label) => task.labels?.includes(label.id));

    const displayDuration = (duration: number): string => {
        const parsedDuration: number = duration >= 24 ? Math.floor(duration / 24) : duration;
        const durationFormat: string = duration >= 24 ? "d." : "g.";

        return `${parsedDuration} ${durationFormat}`;
    };

    const displayDeadline = (deadline: string): string => deadline.split("-").reverse().join(".");

    return (
        <div className="task-container task-selectable">
            <div className="task">
                <div className="task-header">
                    <h3>{task.title}</h3>
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
                <div className="duration-giga-container">
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
        </div>
    );
}

export default SelectableTask;
