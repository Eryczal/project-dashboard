<?php
    if(session_status() == PHP_SESSION_NONE) {
        session_start();
    }

    require_once "db/db.php";
    require_once "utils/responses.php";
    require_once "utils/api.php";
    require_once "data.php";

    header("Access-Control-Allow-Origin: $domain");
    header('Access-Control-Allow-Credentials: true');

    $request = $_SERVER["REQUEST_URI"];

    $req = str_replace($baseurl, "", $request);

    switch($req) {
        case "/register":
            require __DIR__ . "/api/register.php";
            break;

        case "/login":
            require __DIR__ . "/api/login.php";
            break;

        case "/me":
            require __DIR__ . "/api/me.php";
            break;

        default:
            http_response_code(404);
            break;
    }
?>
