<?php
    require_once "utils/session.php";

    header("Content-Type: application/json");

    if(!isset($_POST["login"]) || !isset($_POST["password"])) {
        sendResponse("INVALID_INPUT");
    }

    $login = $_POST["login"];
    $pass = $_POST["password"];

    if(!userExists($login)) {
        sendResponse("INVALID_LOGIN");
        return;
    }

    $user = getUser($login);

    if(!password_verify($pass, $user["pass"])) {
        sendResponse("INVALID_PASSWORD");
        return;
    }

    regenerate_session($user["id"], true);

    sendResponse("LOGGED_IN");

    function getUser($name) {
        global $mysqli;

        $user = $mysqli->prepare("SELECT HEX(id) as id, pass, name, type, creation_date FROM users WHERE name = ?");
        $user->bind_param("s", $name);
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
