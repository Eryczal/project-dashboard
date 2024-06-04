<?php
    require_once "utils/project.php";

    class LabelController {
        public function getLabels($id) {
            global $mysqli;

            if(!isset($_SESSION["user_id"])) {
                sendResponse("USER_NOT_LOGGED");
                return;
            }

            if(!checkAccess($_SESSION["user_id"], $id)) {
                sendResponse("PROJECT_ACCESS");
                return;
            }

            $labels = $mysqli->prepare("SELECT HEX(id) AS id, title, description, color FROM labels WHERE project_id = UNHEX(?)");
            $labels->bind_param("s", $id);
            $labels->execute();

            $result = $labels->get_result();

            if($result->num_rows === 0) {
                $labels->close();
                sendResponse("NO_LABELS");
                return;
            }

            $data = ["labels" => []];
            while($row = $result->fetch_assoc()) {
                $data["labels"][] = $row;
            }
            $labels->close();

            http_response_code(200);
            echo json_encode($data);
        }

        public function addLabel($id) {
            global $mysqli;

            if(!isset($_SESSION["user_id"])) {
                sendResponse("USER_NOT_LOGGED");
                return;
            }

            if(!checkAccess($_SESSION["user_id"], $id)) {
                sendResponse("PROJECT_ACCESS");
                return;
            }

            if(!isset($_POST["title"]) || !isset($_POST["description"]) || !isset($_POST["color"]) || strlen($_POST["title"] < 5)) {
                sendResponse("INVALID_DATA");
                return;
            }

            $title = $_POST["title"];
            $desc = $_POST["description"];
            $color = $_POST["color"];

            $label = $this->createLabel($id, $title, $desc, $color);

            if(!$label) {
                sendResponse("LABEL_ERROR");
                return;
            }

            sendResponse("LABEL_CREATED");
            return;
        }

        public function createLabel($id, $title, $desc, $color) {
            global $mysqli;

            $mysqli->autocommit(FALSE);

            $label = $mysqli->prepare("INSERT INTO labels (id, project_id, title, description, color) VALUES (UNHEX(REPLACE(UUID(), \"-\",\"\")), UNHEX(?), ?, ?, ?)");
            $label->bind_param("ssss", $id, $title, $desc, $color);
            $created = $label->execute();

            if (!$created) {
                $mysqli->rollback();
                return false;
            }

            $mysqli->commit();
    
            $label->close();

            return $created;
        }
    }
?>
