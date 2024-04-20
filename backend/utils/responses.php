<?php
    $responses = [
        "ACCOUNT_CREATED" => ["code" => 201, "message" => "Pomyślnie utworzono konto, możesz się zalogować"],
        "ACCOUNT_EXISTS" => ["code" => 400, "message" => "Wybrany login jest już zajęty"],
        "DB_ERROR" => ["code" => 500, "message" => "Problem z bazą danych"],
        "INVALID_INPUT" => ["code" => 400, "message" => "Login lub hasło jest puste"],
        "LOGIN_SHORT" => ["code" => 400, "message" => "Login musi mieć minimum 5 znaków"],
        "LOGIN_LONG" => ["code" => 400, "message" => "Podany login jest zbyt długi"],
        "PASSWORD_SHORT" => ["code" => 400, "message" => "Hasło musi mieć minimum 8 znaków"],
        "PASSWORD_LONG" => ["code" => 400, "message" => "Hasło jest zbyt długie"]
    ];

    function sendResponse($response) {
        global $responses;

        if(isset($responses[$response])) {
            http_response_code($responses[$response]["code"]);
            echo json_encode(["message" => $responses[$response]["message"]]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Wystąpił nieznany błąd"]);
        }
    }
?>
