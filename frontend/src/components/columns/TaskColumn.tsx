import { Column } from "../../types";

function TaskColumn({ column }: { column: Column }) {
    return <>{column.title}</>;
}

export default TaskColumn;
