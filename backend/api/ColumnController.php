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

            $columns = $mysqli->prepare("SELECT HEX(id) AS id, title, description FROM columns WHERE project_id = UNHEX(?)");
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

            if(!isset($_POST["title"]) || !isset($_POST["description"])) {
                sendResponse("INVALID_DATA");
            }

            $title = $_POST["title"];
            $desc = $_POST["description"];

            $column = $this->createColumn($id, $title, $desc);

            if(!$column) {
                sendResponse("COLUMN_ERROR");
                return;
            }

            sendResponse("COLUMN_CREATED");
            return;
        }

        public function createColumn($id, $title, $desc) {
            global $mysqli;

            $mysqli->autocommit(FALSE);

            $column = $mysqli->prepare("INSERT INTO columns (id, project_id, title, description) VALUES (UNHEX(REPLACE(UUID(), \"-\",\"\")), UNHEX(?), ?, ?)");
            $column->bind_param("sss", $id, $title, $desc);
            $created = $column->execute();

            if (!$created) {
                $mysqli->rollback();
            }

            $mysqli->commit();
    
            $column->close();

            return $created;
        }
    }
?>
