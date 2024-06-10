<?php
    require_once "utils/project.php";

    class ColumnController {
        public function getColumns($id) {
            global $mysqli;

            if(!isset($_SESSION["user_id"])) {
                sendResponse("USER_NOT_LOGGED");
                return;
            }

            if(!checkAccess($_SESSION["user_id"], $id)) {
                sendResponse("PROJECT_ACCESS");
                return;
            }

            try {
                $mysqli->autocommit(false);

                $columnsStmt = $mysqli->prepare("
                    SELECT HEX(id) AS id, title, description, position 
                    FROM columns 
                    WHERE project_id = UNHEX(?) 
                    ORDER BY position
                ");

                $columnsStmt->bind_param("s", $id);
                $columnsStmt->execute();
                $columnsResult = $columnsStmt->get_result();
                $columns = [];

                if($columnsResult->num_rows === 0) {
                    $columnsStmt->close();
                    sendResponse("NO_COLUMNS");
                    return;
                }

                $data = ["columns" => []];

                while($column = $columnsResult->fetch_assoc()) {
                    $columnId = $column["id"];
                    $tasks = [];

                    $tasksStmt = $mysqli->prepare("
                        SELECT
                            HEX(t.id) AS id,
                            t.title,
                            t.description,
                            t.position,
                            COALESCE(GROUP_CONCAT(HEX(l.id) ORDER BY l.id SEPARATOR ','), '') AS labels
                        FROM 
                            tasks t
                        LEFT JOIN
                            tasks_labels tl ON t.id = tl.task_id
                        LEFT JOIN
                            labels l ON tl.label_id = l.id
                        WHERE
                            t.column_id = UNHEX(?)
                        GROUP BY
                            t.id
                        ORDER BY
                            t.position
                    ");

                    $tasksStmt->bind_param("s", $columnId);
                    $tasksStmt->execute();
                    $tasksResult = $tasksStmt->get_result();

                    while($task = $tasksResult->fetch_assoc()) {
                        $tasks[] = $task;
                    }

                    $column["tasks"] = $tasks;
                    $data["columns"][] = $column;

                    $tasksStmt->close();
                }

                $mysqli->commit();
    
                http_response_code(200);
                echo json_encode($data);
            } catch(Exception $e) {
                $mysqli->rollback();
                sendResponse("DB_ERROR");
                return;
            }
        }

        public function addColumn($id) {
            global $mysqli;

            if(!isset($_SESSION["user_id"])) {
                sendResponse("USER_NOT_LOGGED");
                return;
            }

            if(!checkAccess($_SESSION["user_id"], $id)) {
                sendResponse("PROJECT_ACCESS");
                return;
            }

            if(!isset($_POST["title"]) || !isset($_POST["description"]) || !isset($_POST["position"]) || strlen($_POST["title"] < 5)) {
                sendResponse("INVALID_DATA");
                return;
            }

            $title = $_POST["title"];
            $desc = $_POST["description"];
            $position = $_POST["position"];

            $column = $this->createColumn($id, $title, $desc, $position);

            if(!$column) {
                sendResponse("COLUMN_ERROR");
                return;
            }

            sendResponse("COLUMN_CREATED");
            return;
        }

        public function createColumn($id, $title, $desc, $position) {
            global $mysqli;

            $mysqli->autocommit(false);

            $column = $mysqli->prepare("INSERT INTO columns (id, project_id, title, description, position) VALUES (UNHEX(REPLACE(UUID(), \"-\",\"\")), UNHEX(?), ?, ?, ?)");
            $column->bind_param("sssi", $id, $title, $desc, $position);
            $created = $column->execute();

            if (!$created) {
                $mysqli->rollback();
                return false;
            }

            $mysqli->commit();
    
            $column->close();

            return $created;
        }

        public function moveColumn($id) {
            global $mysqli;

            if(!isset($_SESSION["user_id"])) {
                sendResponse("USER_NOT_LOGGED");
                return;
            }

            if(!isset($_POST["project_id"]) || !isset($_POST["from"]) || !isset($_POST["to"])) {
                sendResponse("INVALID_DATA");
                return;
            }

            $project_id = $_POST["project_id"];
            $from = (int) $_POST["from"];
            $to = (int) $_POST["to"];

            if(!checkAccess($_SESSION["user_id"], $project_id)) {
                sendResponse("PROJECT_ACCESS");
                return;
            }

            $mysqli->autocommit(false);

            if($from === $to) {
                return;
            }

            try {
                if($from > $to) {
                    $query = "UPDATE columns SET position = position + 1 WHERE project_id = UNHEX(?) AND position >= ? AND position < ?";
                } else {
                    $query = "UPDATE columns SET position = position - 1 WHERE project_id = UNHEX(?) AND position > ? AND position <= ?";
                }

                $stmt = $mysqli->prepare($query);
                if($from > $to) {
                    $stmt->bind_param("sii", $project_id, $to, $from);
                } else {
                    $stmt->bind_param("sii", $project_id, $from, $to);
                }
                
                if(!$stmt->execute()) {
                    throw new Exception("Error updating positions");
                }

                $query = "UPDATE columns SET position = ? WHERE id = UNHEX(?)";
                $stmt = $mysqli->prepare($query);
                $stmt->bind_param("is", $to, $id);

                if(!$stmt->execute()) {
                    throw new Exception("Error updating position");
                }

                $mysqli->commit();
                sendResponse("COLUMN_MOVED");
                $stmt->close();
                return;
            } catch (Exception $e) {
                $mysqli->rollback();
                sendResponse("DB_ERROR");
                return;
            }
        }

        public function deleteColumn($id) {
            global $mysqli;

            if(!isset($_SESSION["user_id"])) {
                sendResponse("USER_NOT_LOGGED");
                return;
            }

            // if(!checkAccess($_SESSION["user_id"], $project_id)) {
            //     sendResponse("PROJECT_ACCESS");
            //     return;
            // }

            $mysqli->autocommit(false);

            try {
                $deleteTasksLabels = $mysqli->prepare("
                    DELETE tl FROM tasks_labels tl
                    JOIN tasks t ON tl.task_id = t.id
                    WHERE t.column_id = UNHEX(?)
                ");
                $deleteTasksLabels->bind_param("s", $id);

                if (!$deleteTasksLabels->execute()) {
                    throw new Exception("Error deleting tasks-labels");
                }

                $deleteTasks = $mysqli->prepare("
                    DELETE FROM tasks
                    WHERE column_id = UNHEX(?)
                ");
                $deleteTasks->bind_param("s", $id);

                if (!$deleteTasks->execute()) {
                    throw new Exception("Error deleting tasks");
                }

                $deleteColumn = $mysqli->prepare("
                    DELETE FROM columns
                    WHERE id = UNHEX(?)
                ");
                $deleteColumn->bind_param("s", $id);

                if (!$deleteColumn->execute()) {
                    throw new Exception("Error deleting column");
                }

                $mysqli->commit();
                sendResponse("COLUMN_DELETED");
            } catch (Exception $e) {
                $mysqli->rollback();
                sendResponse("DB_ERROR");
            } finally {
                if (isset($deleteTasksLabels)) $deleteTasksLabels->close();
                if (isset($deleteTasks)) $deleteTasks->close();
                if (isset($deleteColumn)) $deleteColumn->close();
            }
        }
    }
?>
