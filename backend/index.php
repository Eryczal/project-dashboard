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
    header("Content-Type: application/json");

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
                //sendResponse()
            }
            break;

        case "/projects":
            $projectController = new ProjectController();

            if(method_exists($projectController, $method)) {
                $projectController->$method();
            } else {

            }
            break;
            
        case "/project/add":
            $projectController = new ProjectController();
            $projectController->addProject();
            break;

        default:
            http_response_code(404);
            break;
    }
?>
