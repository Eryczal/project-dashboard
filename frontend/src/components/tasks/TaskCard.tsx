import "./TaskCard.css";
import { useProject } from "../../contexts/ProjectContext";
import { Task } from "../../types";

function TaskCard({ task }: { task: Task }) {
    const { labels } = useProject();
    const taskLabels = labels.filter((label) => task.labels?.includes(label.id));

    return (
        <div className="task-container">
            <div className="task">
                <h3>{task.title}</h3>
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
            </div>
        </div>
    );
}

export default TaskCard;
