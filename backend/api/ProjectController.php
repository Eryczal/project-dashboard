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

        public function addProject() {
            if(!isset($_SESSION["user_id"])) {
                sendResponse("USER_NOT_LOGGED");
                return;
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

            $mysqli->autocommit(FALSE);

            $uuid = $mysqli->query("SELECT UNHEX(REPLACE(UUID(), '-', ''))")->fetch_row()[0];

            $project = $mysqli->prepare("INSERT INTO projects (id, date, title, description, publicity) VALUES (?, CURDATE(), 'project', 'project', 2)");
            $project->bind_param("s", $uuid);
            $created = $project->execute();

            if (!$created) {
                $mysqli->rollback();
            }

            $userProject = $mysqli->prepare("INSERT INTO users_projects (id, user_id, project_id, role) VALUES (UNHEX(REPLACE(UUID(), \"-\",\"\")), UNHEX(?), ?, 'admin')");
            $userProject->bind_param("ss", $_SESSION["user_id"], $uuid);

            $userProjectCreated = $userProject->execute();

            if(!$userProjectCreated) {
                $mysqli->rollback();
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

            $check = $mysqli->prepare("SELECT * FROM users_projects WHERE user_id = UNHEX(?) AND project_id = UNHEX(?)");
            $check->bind_param("ss", $_SESSION["user_id"], $id);
            $check->execute();

            $result = $check->get_result();
            $user_project = $result->fetch_assoc();

            if(!$user_project) {
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
