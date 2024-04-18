<?php
    $host = "localhost";
    $user = "project-dashboard";
    $pass = "dbpass123";
    $db = "project-dashboard";

    $mysqli = new mysqli($host, $user, $pass, $db);

    if($mysqli -> connect_errno) {
        echo "Błąd w połączeniu z bazą danych: " . $mysqli -> connect_error;
        exit();
    }
?>
