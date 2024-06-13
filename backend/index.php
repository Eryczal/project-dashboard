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
    $parts = explode("/", $req);

    http_response_code(404);

    switch($parts[1]) {
        case "register":
        case "login":
        case "me":
            $authController = new AuthController();

            if(method_exists($authController, $method)) {
                $authController->$method();
            } else {
                //sendResponse()
            }
            break;

        case "projects":
            $projectController = new ProjectController();

            if(method_exists($projectController, $method)) {
                $projectController->$method();
            } else {

            }
            break;
            
        case "project":
            $projectController = new ProjectController();

            if($parts[2] === "add") {
                $projectController->addProject();
            } else if(isset($parts[3])) {
                if($parts[3] === "columns") {
                    $projectController->getColumns($parts[2]);
                }
            } else {
                $projectController->getProject($parts[2]);
            }
            break;

        case "columns":
            $columnController = new ColumnController();
            $columnController->getColumns($parts[2]);
            break;

        case "column":
            $columnController = new ColumnController();

            if(isset($parts[3])) {
                if($parts[2] === "add") {
                    $columnController->addColumn($parts[3]);
                } else if($parts[2] === "move") {
                    $columnController->moveColumn($parts[3]);
                } else if($parts[2] === "update") {
                    $columnController->updateColumn($parts[3]);
                } else if($parts[2] === "delete") {
                    $columnController->deleteColumn($parts[3]);
                }
            }
            break;

        case "tasks":
            $taskController = new TaskController();
            $taskController->getTasks($parts[2]);
            break;

        case "task":
            $taskController = new TaskController();

            if(isset($parts[3])) {
                if($parts[2] === "add") {
                    $taskController->addTask($parts[3]);
                } else if($parts[2] === "move") {
                    $taskController->moveTask($parts[3]);
                } else if($parts[2] === "movetocolumn") {
                    $taskController->moveToColumn($parts[3]);
                } else if($parts[2] === "update") {
                    $taskController->updateTask($parts[3]);
                } else if($parts[2] === "delete") {
                    $taskController->deleteTask($parts[3]);
                }
            }
            break;

        case "labels":
            $labelController = new LabelController();
            $labelController->getLabels($parts[2]);
            break;

        case "label":
            $labelController = new LabelController();

            if($parts[2] === "add") {
                if(isset($parts[3])) {
                    $labelController->addLabel($parts[3]);
                }
            }
            break;
    }

    if(http_response_code() === 404) {
        sendResponse("NOT_FOUND");
    }
?>
