<?php
    class ProjectController {
        public function projects() {
            if(!isset($_SESSION["user_id"])) {
                sendResponse("USER_NOT_LOGGED");
                return;
            }

            $projects = $this->getProjects($_SESSION["user_id"]);

            if($projects === false) {
                sendResponse("NO_PROJECTS");
                return;
            }

            http_response_code(200);
            echo json_encode($projects);
        }

        public function getProjects($uid) {
            global $mysqli;

            $projects = $mysqli->prepare("SELECT HEX(id) as id, date, title, description, publicity FROM projects WHERE user_id = UNHEX(?)");
            $projects->bind_param("s", $uid);
            $projects->execute();
            $result = $projects->get_result();

            if($result->num_rows === 0) {
                $projects->close();
                return false;
            }

            $data = ["projects" => []];
            while($row = $result->fetch_assoc()) {
                $data["projects"][] = $row;
            }
            $projects->close();
            
            return $data;
        }
    }
?>
