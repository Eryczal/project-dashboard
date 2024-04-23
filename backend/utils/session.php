<?php
    function regenerate_session($uid, $reload = false)
    {
        if(!isset($_SESSION["nonce"]) || $reload) {
            $_SESSION["nonce"] = bin2hex(openssl_random_pseudo_bytes(32));
        }

        if(!isset($_SESSION["IPaddress"]) || $reload) {
            $_SESSION["IPaddress"] = $_SERVER["REMOTE_ADDR"];
        }

        if(!isset($_SESSION["userAgent"]) || $reload) {
            $_SESSION["userAgent"] = $_SERVER["HTTP_USER_AGENT"];
        }

        $_SESSION["user_id"] = $uid;

        $_SESSION["OBSOLETE"] = true;
        $_SESSION["EXPIRES"] = time() + 60;

        session_regenerate_id(false);

        $newSession = session_id();
        session_write_close();

        session_id($newSession);
        session_start();

        unset($_SESSION["OBSOLETE"]);
        unset($_SESSION["EXPIRES"]);
    }

    function check_session()
    {
        try{
            if($_SESSION["OBSOLETE"] && ($_SESSION["EXPIRES"] < time())) {
                throw new Exception("Attempt to use expired session.");
            }

            if(!is_numeric($_SESSION["user_id"])) {
                throw new Exception("No session started.");
            }

            if($_SESSION["IPaddress"] != $_SERVER["REMOTE_ADDR"]) {
                throw new Exception("IP Address mixmatch (possible session hijacking attempt).");
            }

            if($_SESSION["userAgent"] != $_SERVER["HTTP_USER_AGENT"]) {
                throw new Exception("Useragent mixmatch (possible session hijacking attempt).");
            }

            if(!$_SESSION["OBSOLETE"] && mt_rand(1, 100) == 1)
            {
                $regenerateSession();
            }

            return true;

        }catch(Exception $e){
            return false;
        }
    }
?>
