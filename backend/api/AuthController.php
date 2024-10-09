<?php
    require_once "utils/session.php";
    
    class AuthController {
        public function register() {
            if(!isset($_POST["login"]) || !isset($_POST["password"])) {
                sendResponse("INVALID_INPUT");
            }
            
            $login = $_POST["login"];
            $pass = $_POST["password"];

            if(mb_strlen($login, "utf-8") < 5) {
                sendResponse("LOGIN_SHORT");
                return;
            }
        
            if(mb_strlen($login, "utf-8") > 50) {
                sendResponse("LOGIN_LONG");
                return;
            }
        
            if(mb_strlen($pass, "utf-8") < 8) {
                sendResponse("PASSWORD_SHORT");
                return;
            }
        
            if(mb_strlen($pass, "utf-8") > 60) {
                sendResponse("PASSWORD_LONG");
                return;
            }
        
            if($this->userExists($login)) {
                sendResponse("ACCOUNT_EXISTS");
                return;
            }
        
            if($this->createUser($login, $pass)) {
                sendResponse("ACCOUNT_CREATED");
            } else {
                sendResponse("DB_ERROR");
            }
        }

        public function login() {
            if(!isset($_POST["login"]) || !isset($_POST["password"])) {
                sendResponse("INVALID_INPUT");
                return;
            }

            $login = $_POST["login"];
            $pass = $_POST["password"];

            if(!$this->userExists($login)) {
                sendResponse("INVALID_LOGIN");
                return;
            }

            $user = $this->getUser($login, "name");

            if(!password_verify($pass, $user["pass"])) {
                sendResponse("INVALID_PASSWORD");
                return;
            }

            regenerate_session($user["id"], true);

            sendResponse("LOGGED_IN");
        }

        public function me() {
            if(isset($_SESSION["user_id"])) {
                $user = $this->getUser($_SESSION["user_id"], "id");
    
                http_response_code(200);
                echo json_encode([
                    "user" => [
                        "id" => $user["id"],
                        "name" => $user["name"],
                        "type" => $user["type"],
                        "theme" => $user["theme"],
                        "creation_date" => $user["creation_date"],
                    ]
                ]);
            } else {
                sendResponse("USER_NOT_LOGGED");
            }
        }

        public function createUser($name, $password) {
            global $mysqli;
    
            $hash_pass = password_hash($password, PASSWORD_DEFAULT);
    
            $user = $mysqli->prepare("INSERT INTO users (id, name, pass, type, theme, creation_date) VALUES ((UNHEX(REPLACE(UUID(), \"-\",\"\"))), ?, ?, 'free', 'Light', CURDATE())");
            $user->bind_param("ss", $name, $hash_pass);
    
            $created = $user->execute();
    
            $user->close();
            return $created;
        } 

        public function userExists($name) {
            global $mysqli;
    
            $check = $mysqli->prepare("SELECT * FROM users WHERE name = ?");
            $check->bind_param("s", $name);
            $check->execute();
            $result = $check->get_result();
    
            $exists = $result->num_rows > 0;
    
            $check->close();
            return $exists;
        }

        public function getUser($value, $type) {
            global $mysqli;
    
            $user = $mysqli->prepare("SELECT HEX(id) as id, pass, name, type, theme, creation_date FROM users WHERE " . ($type === "id" ? "id = UNHEX(?)" : "name = ?"));
            $user->bind_param("s", $value);
            $user->execute();
            $result = $user->get_result();
    
            if($result->num_rows !== 1) {
                $user->close();
                return false;
            }
    
            $data = $result->fetch_assoc();
            $user->close();
            
            return $data;
        }
    }
?>
