<?php
    function checkAccess($user_id, $project_id) {
        global $mysqli;

        $check = $mysqli->prepare("SELECT * FROM users_projects WHERE user_id = UNHEX(?) AND project_id = UNHEX(?)");
        $check->bind_param("ss", $user_id, $project_id);
        $check->execute();

        $result = $check->get_result();
        $user_project = $result->fetch_assoc();

        return (bool)$user_project;
    }
?>