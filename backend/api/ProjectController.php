<?php
    require_once "utils/project.php";

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

        public function addProject() {
            if(!isset($_SESSION["user_id"])) {
                sendResponse("USER_NOT_LOGGED");
                return;
            }

            if(!isset($_POST["title"]) || !isset($_POST["publicity"]) || strlen($_POST["title"] < 5)) {
                sendResponse("INVALID_DATA");
                return;
            }

            if(!isset($_POST["description"])) {
                $_POST["description"] = "";
            }

            $project = $this->createProject();

            if(!$project) {
                sendResponse("PROJECT_ERROR");
                return;
            }

            sendResponse("PROJECT_CREATED");
            return;
        }

        public function createProject() {
            global $mysqli;

            $title = $_POST["title"];
            $desc = $_POST["description"];
            $pub = $_POST["publicity"];

            $mysqli->autocommit(FALSE);

            $uuid = $mysqli->query("SELECT UNHEX(REPLACE(UUID(), '-', ''))")->fetch_row()[0];

            $project = $mysqli->prepare("INSERT INTO projects (id, date, title, description, publicity) VALUES (?, CURDATE(), ?, ?, ?)");
            $project->bind_param("sssi", $uuid, $title, $desc, $pub);
            $created = $project->execute();

            if (!$created) {
                $mysqli->rollback();
                return false;
            }

            $userProject = $mysqli->prepare("INSERT INTO users_projects (id, user_id, project_id, role) VALUES (UNHEX(REPLACE(UUID(), \"-\",\"\")), UNHEX(?), ?, 'admin')");
            $userProject->bind_param("ss", $_SESSION["user_id"], $uuid);

            $userProjectCreated = $userProject->execute();

            if(!$userProjectCreated) {
                $mysqli->rollback();
                return false;
            }

            $mysqli->commit();
    
            $project->close();
            $userProject->close();

            return $created && $userProjectCreated;
        }

        public function getProject($id) {
            global $mysqli;

            if(!isset($_SESSION["user_id"])) {
                sendResponse("USER_NOT_LOGGED");
                return;
            }

            $project = $mysqli->prepare("SELECT HEX(id) AS id, date, title, description, publicity FROM projects WHERE id = UNHEX(?)");
            $project->bind_param("s", $id);
            $project->execute();
            
            $result = $project->get_result();
            $data = $result->fetch_assoc();

            if(!$data) {
                sendResponse("PROJECT_NOT_FOUND");
                return;
            }


            if(!checkAccess($_SESSION["user_id"], $id)) {
                sendResponse("PROJECT_ACCESS");
                return;
            }

            http_response_code(200);
            echo json_encode($data);
        }

        public function getProjects($uid) {
            global $mysqli;

            $projects = $mysqli->prepare("
                SELECT HEX(p.id) as id, p.date, p.title, p.description, p.publicity 
                FROM projects p
                INNER JOIN users_projects up ON p.id = up.project_id
                WHERE up.user_id = UNHEX(?)
            ");
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
