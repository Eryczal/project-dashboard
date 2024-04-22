<?php
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
?>
