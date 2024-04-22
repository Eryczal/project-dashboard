<?php
    header("Content-Type: application/json");

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

    if(userExists($login)) {
        sendResponse("ACCOUNT_EXISTS");
        return;
    }

    if(createUser($login, $pass)) {
        sendResponse("ACCOUNT_CREATED");
    } else {
        sendResponse("DB_ERROR");
    }

    function userExists($name) {
        global $mysqli;

        $check = $mysqli->prepare("SELECT * FROM users WHERE name = ?");
        $check->bind_param("s", $name);
        $check->execute();
        $result = $check->get_result();

        $exists = $result->num_rows > 0;

        $check->close();
        return $exists;
    }

    function createUser($name, $password) {
        global $mysqli;

        $hash_pass = password_hash($password, PASSWORD_DEFAULT);

        $user = $mysqli->prepare("INSERT INTO users (id, name, pass, type, creation_date) VALUES ((UNHEX(REPLACE(UUID(), \"-\",\"\"))), ?, ?, 'free', CURDATE())");
        $user->bind_param("ss", $name, $hash_pass);

        $created = $user->execute();

        $user->close();
        return $created;
    } 
?>
