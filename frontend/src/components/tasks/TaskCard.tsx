import { useProject } from "../../contexts/ProjectContext";
import { Task } from "../../types";

function TaskCard({ task }: { task: Task }) {
    const { labels } = useProject();
    const taskLabels = labels.filter((label) => task.labels?.includes(label.id));

    return (
        <div>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            {taskLabels &&
                taskLabels.map((label) => {
                    return <div key={label.id}>{label.title}</div>;
                })}
        </div>
    );
}

export default TaskCard;
