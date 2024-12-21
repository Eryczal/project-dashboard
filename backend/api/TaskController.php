<?php
    require_once "utils/project.php";

    class TaskController {
        public function addTask($id) {
            if(!isset($_SESSION["user_id"])) {
                sendResponse("USER_NOT_LOGGED");
                return;
            }

            if(!isset($_POST["title"]) || !isset($_POST["position"]) || strlen($_POST["title"] < 5)) {
                sendResponse("INVALID_DATA");
                return;
            }

            if(!isset($_POST["description"])) {
                $_POST["description"] = "";
            }

            $task = $this->createTask($id);

            if(!$task) {
                sendResponse("TASK_ERROR");
                return;
            }

            sendResponse("TASK_CREATED");
            return;
        }

        public function createTask($id) {
            global $mysqli;

            $title = $_POST["title"];
            $desc = $_POST["description"];
            $duration = $_POST["duration"];
            $deadline = $_POST["deadline"];
            $labels = isset($_POST["labels"]) ? $_POST["labels"] : [];
            $position = $_POST["position"];

            $mysqli->autocommit(false);

            $uuid = $mysqli->query("SELECT UNHEX(REPLACE(UUID(), '-', ''))")->fetch_row()[0];

            $task = $mysqli->prepare("INSERT INTO tasks (id, column_id, title, description, duration, deadline, position) VALUES (?, UNHEX(?), ?, ?, ?, ?, ?)");
            $task->bind_param("ssssisi", $uuid, $id, $title, $desc, $duration, $deadline, $position);
            $created = $task->execute();

            if (!$created) {
                $mysqli->rollback();
                return false;
            }

            $taskLabel = $mysqli->prepare("INSERT INTO tasks_labels (id, task_id, label_id) VALUES (UNHEX(REPLACE(UUID(), \"-\",\"\")), ?, UNHEX(?))");
            $taskLabel->bind_param("ss", $uuid, $labelId);

            $taskLabelCreated = true;

            foreach($labels as $labelId) {
                if(!$taskLabel->execute()) {
                    $taskLabelCreated = false;
                    $mysqli->rollback();
                    break;
                }
            }

            if(!$taskLabelCreated) {
                $mysqli->rollback();
                return false;
            }

            $mysqli->commit();
    
            $task->close();
            $taskLabel->close();

            return $created && $taskLabelCreated;
        }

        public function getTasks($id) {
            global $mysqli;

            if(!isset($_SESSION["user_id"])) {
                sendResponse("USER_NOT_LOGGED");
                return;
            }

            // if(!checkAccess($_SESSION["user_id"], $id)) {
            //     sendResponse("PROJECT_ACCESS");
            //     return;
            // }

            $tasks = $mysqli->prepare("
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

            if ($tasks === false) {
                $tasks->close();
                sendResponse("DB_ERROR");
                return;
            }

            $tasks->bind_param("s", $id);
            $tasks->execute();

            $result = $tasks->get_result();

            if ($result === false) {
                $tasks->close();
                sendResponse("DB_ERROR");
                return;
            }

            if($result->num_rows === 0) {
                $tasks->close();
                sendResponse("NO_TASKS");
                return;
            }

            $data = ["tasks" => []];
            while($row = $result->fetch_assoc()) {
                $row["labels"] = $row["labels"] ? explode(",", $row["labels"]) : [];
                $data["tasks"][] = $row;
            }
            $tasks->close();

            http_response_code(200);
            echo json_encode($data);
        }

        public function moveTask($id) {
            global $mysqli;

            if(!isset($_SESSION["user_id"])) {
                sendResponse("USER_NOT_LOGGED");
                return;
            }

            if(!isset($_POST["column_id"]) || !isset($_POST["from"]) || !isset($_POST["to"])) {
                sendResponse("INVALID_DATA");
                return;
            }

            $column_id = $_POST["column_id"];
            $from = (int) $_POST["from"];
            $to = (int) $_POST["to"];

            // if(!checkAccess($_SESSION["user_id"], $project_id)) {
            //     sendResponse("PROJECT_ACCESS");
            //     return;
            // }

            $mysqli->autocommit(false);

            if($from === $to) {
                return;
            }

            try {
                if($from > $to) {
                    $query = "UPDATE tasks SET position = position + 1 WHERE column_id = UNHEX(?) AND position >= ? AND position < ?";
                } else {
                    $query = "UPDATE tasks SET position = position - 1 WHERE column_id = UNHEX(?) AND position > ? AND position <= ?";
                }

                $stmt = $mysqli->prepare($query);
                if($from > $to) {
                    $stmt->bind_param("sii", $column_id, $to, $from);
                } else {
                    $stmt->bind_param("sii", $column_id, $from, $to);
                }
                
                if(!$stmt->execute()) {
                    throw new Exception("Error updating positions");
                }

                $query = "UPDATE tasks SET position = ? WHERE id = UNHEX(?)";
                $stmt = $mysqli->prepare($query);
                $stmt->bind_param("is", $to, $id);

                if(!$stmt->execute()) {
                    throw new Exception("Error updating position");
                }

                $mysqli->commit();
                sendResponse("TASK_MOVED");
                $stmt->close();
                return;
            } catch (Exception $e) {
                $mysqli->rollback();
                sendResponse("DB_ERROR");
                return;
            }
        }

        public function moveToColumn($id) {
            global $mysqli;

            if(!isset($_SESSION["user_id"])) {
                sendResponse("USER_NOT_LOGGED");
                return;
            }

            if(!isset($_POST["source_id"]) || !isset($_POST["destination_id"]) || !isset($_POST["source_index"]) || !isset($_POST["destination_index"])) {
                sendResponse("INVALID_DATA");
                return;
            }

            $source_id = $_POST["source_id"];
            $destination_id = $_POST["destination_id"];
            $source_index = (int) $_POST["source_index"];
            $destination_index = (int) $_POST["destination_index"];

            $mysqli->autocommit(false);

            try {
                $sourceQuery = "UPDATE tasks SET position = position - 1 WHERE column_id = UNHEX(?) AND position > ?";
                $destinationQuery = "UPDATE tasks SET position = position + 1 WHERE column_id = UNHEX(?) AND position >= ?";

                $stmt = $mysqli->prepare($sourceQuery);
                $stmt->bind_param("si", $source_id, $source_index);
                
                if(!$stmt->execute()) {
                    throw new Exception("Error updating positions");
                }

                $stmt = $mysqli->prepare($destinationQuery);
                $stmt->bind_param("si", $destination_id, $destination_index);
                
                if(!$stmt->execute()) {
                    throw new Exception("Error updating positions");
                }

                $query = "UPDATE tasks SET position = ?, column_id = UNHEX(?) WHERE id = UNHEX(?)";
                $stmt = $mysqli->prepare($query);
                $stmt->bind_param("iss", $destination_index, $destination_id, $id);

                if(!$stmt->execute()) {
                    throw new Exception("Error updating position");
                }

                $mysqli->commit();
                sendResponse("TASK_MOVED");
                $stmt->close();
                return;
            } catch (Exception $e) {
                $mysqli->rollback();
                sendResponse("DB_ERROR");
                return;
            }
        }

        public function updateTask($id) {
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
                $updates = [];
                $params = [];
                $types = "";
    
                if(isset($_POST["title"])) {
                    $updates[] = "title = ?";
                    $params[] = $_POST["title"];
                    $types .= "s";
                }
    
                if(isset($_POST["description"])) {
                    $updates[] = "description = ?";
                    $params[] = $_POST["description"];
                    $types .= "s";
                }
    
                if(!empty($updates)) {
                    $params[] = $id;
                    $types .= "s";
        
                    $query = "UPDATE tasks SET " . implode(', ', $updates) . " WHERE id = UNHEX(?)";
                    $editTask = $mysqli->prepare($query);
                    $editTask->bind_param($types, ...$params);
        
                    if (!$editTask->execute()) {
                        throw new Exception("Error updating task");
                    }
                }

                if(isset($_POST["labelsRemove"])) {
                    $labelsToRemove = json_decode($_POST["labelsRemove"], true);

                    if(json_last_error() !== JSON_ERROR_NONE) {
                        throw new Exception("JSON error");
                    }

                    if(!empty($labelsToRemove)) {
                        $deleteLabels = $mysqli->prepare("DELETE FROM tasks_labels WHERE task_id = UNHEX(?) AND label_id = UNHEX(?)");

                        foreach($labelsToRemove as $label_id) {
                            $deleteLabels->bind_param("ss", $id, $label_id);
                            
                            if(!$deleteLabels->execute()) {
                                throw new Exception("Error deleting labels");
                            }
                        }
                    }
                }

                if(isset($_POST["labelsAdd"])) {
                    $labelsToAdd = json_decode($_POST["labelsAdd"], true);

                    if(json_last_error() !== JSON_ERROR_NONE) {
                        throw new Exception("JSON error");
                    }

                    if(!empty($labelsToAdd)) {
                        $addLabels = $mysqli->prepare("INSERT INTO tasks_labels (id, task_id, label_id) VALUES (UNHEX(REPLACE(UUID(), \"-\",\"\")), UNHEX(?), UNHEX(?))");
    
                        foreach($labelsToAdd as $label_id) {
                            $addLabels->bind_param("ss", $id, $label_id);
    
                            if(!$addLabels->execute()) {
                                throw new Exception("Error adding labels");
                            }
                        }
                    }
                }

                $mysqli->commit();
                sendResponse("TASK_UPDATED");
            } catch(Exception $e) {
                $mysqli->rollback();
                sendResponse("DB_ERROR");
            } finally {
                if(isset($editTask)) $editTask->close();
                if(isset($deleteLabels)) $deleteLabels->close();
                if(isset($addLabels)) $addLabels->close();
            }
        }

        public function deleteTask($id) {
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
                    DELETE FROM tasks_labels
                    WHERE task_id = UNHEX(?)
                ");
                $deleteTasksLabels->bind_param("s", $id);

                if (!$deleteTasksLabels->execute()) {
                    throw new Exception("Error deleting tasks-labels");
                }

                $deleteTask = $mysqli->prepare("
                    DELETE FROM tasks
                    WHERE id = UNHEX(?)
                ");
                $deleteTask->bind_param("s", $id);

                if (!$deleteTask->execute()) {
                    throw new Exception("Error deleting task");
                }

                $mysqli->commit();
                sendResponse("TASK_DELETED");
            } catch (Exception $e) {
                $mysqli->rollback();
                sendResponse("DB_ERROR");
            } finally {
                if (isset($deleteTasksLabels)) $deleteTasksLabels->close();
                if (isset($deleteTask)) $deleteTask->close();
            }
        }
    }
?>
