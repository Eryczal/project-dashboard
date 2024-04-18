<?php
    require_once "db/db.php";
    require_once "data.php";

    header("Access-Control-Allow-Origin: $domain");

    $request = $_SERVER["REQUEST_URI"];

    $req = str_replace($baseurl, "", $request);

    switch($req) {
        case "/register":
            require __DIR__ . "/api/register.php";
            break;

        default:
            http_response_code(404);
            break;
    }
?>
