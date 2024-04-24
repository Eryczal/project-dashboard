<?php
    if(session_status() == PHP_SESSION_NONE) {
        session_start();
    }

    require_once "db/db.php";
    require_once "utils/responses.php";
    require_once "data.php";

    spl_autoload_register(function ($class_name) {
        include __DIR__ . "/api/" . $class_name . ".php";
    });

    header("Access-Control-Allow-Origin: $domain");
    header('Access-Control-Allow-Credentials: true');

    $request = $_SERVER["REQUEST_URI"];

    $req = str_replace($baseurl, "", $request);
    $method = ltrim($req, "/");

    switch($req) {
        case "/register":
        case "/login":
        case "/me":
            $authController = new AuthController();
            if(method_exists($authController, $method)) {
                $authController->$method();
            } else {
            }
            break;

            break;

        default:
            http_response_code(404);
            break;
    }
?>
