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
            $labels = isset($_POST["labels"]) ? $_POST["labels"] : [];
            $position = $_POST["position"];

            $mysqli->autocommit(false);

            $uuid = $mysqli->query("SELECT UNHEX(REPLACE(UUID(), '-', ''))")->fetch_row()[0];

            $task = $mysqli->prepare("INSERT INTO tasks (id, column_id, title, description, position) VALUES (?, UNHEX(?), ?, ?, ?)");
            $task->bind_param("ssssi", $uuid, $id, $title, $desc, $position);
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
    }
?>
