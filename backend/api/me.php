<?php
    require_once "utils/session.php";
    
    header("Content-Type: application/json");

    $user = getUser($_SESSION["user_id"]);

    http_response_code(200);
    echo json_encode([
        "user" => [
            "id" => $user["id"],
            "name" => $user["name"],
            "type" => $user["type"],
            "creation_date" => $user["creation_date"],
        ]
    ]);

    function getUser($id) {
        global $mysqli;

        $user = $mysqli->prepare("SELECT HEX(id) as id, pass, name, type, creation_date FROM users WHERE id = UNHEX(?)");
        $user->bind_param("s", $id);
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

?>
