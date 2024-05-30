import "./TaskColumn.css";
import { Column } from "../../types";
import { MdAddCircleOutline, MdMoreVert } from "react-icons/md";

function TaskColumn({ column }: { column: Column }) {
    return (
        <div className="column">
            <header className="column-header">
                <h2>{column.title}</h2>
                <div className="column-buttons">
                    <MdAddCircleOutline />
                    <MdMoreVert />
                </div>
            </header>
        </div>
    );
}

export default TaskColumn;
