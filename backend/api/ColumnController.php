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

            $columns = $mysqli->prepare("SELECT HEX(id) AS id, title, description, position FROM columns WHERE project_id = UNHEX(?) ORDER BY position");
            $columns->bind_param("s", $id);
            $columns->execute();

            $result = $columns->get_result();

            if($result->num_rows === 0) {
                $columns->close();
                sendResponse("NO_COLUMNS");
                return;
            }

            $data = ["columns" => []];
            while($row = $result->fetch_assoc()) {
                $data["columns"][] = $row;
            }
            $columns->close();

            http_response_code(200);
            echo json_encode($data);
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
    }
?>
