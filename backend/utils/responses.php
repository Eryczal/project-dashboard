<?php
    $responses = [
        "ACCOUNT_CREATED" => ["code" => 201, "message" => "Pomyślnie utworzono konto, możesz się zalogować"],
        "ACCOUNT_EXISTS" => ["code" => 400, "message" => "Wybrany login jest już zajęty"],
        "DB_ERROR" => ["code" => 500, "message" => "Problem z bazą danych"],
        "NOT_FOUND" => ["code" => 404, "message" => "Podany URL nie został znaleziony"],
        "INVALID_INPUT" => ["code" => 400, "message" => "Login lub hasło jest puste"],
        "LOGIN_SHORT" => ["code" => 400, "message" => "Login musi mieć minimum 5 znaków"],
        "LOGIN_LONG" => ["code" => 400, "message" => "Podany login jest zbyt długi"],
        "PASSWORD_SHORT" => ["code" => 400, "message" => "Hasło musi mieć minimum 8 znaków"],
        "PASSWORD_LONG" => ["code" => 400, "message" => "Hasło jest zbyt długie"],
        "INVALID_LOGIN" => ["code" => 400, "message" => "Login lub hasło jest niepoprawne"],
        "INVALID_PASSWORD" => ["code" => 400, "message" => "Login lub hasło jest niepoprawne"],
        "LOGGED_IN" => ["code" => 200, "message" => "Pomyślnie zalogowano"],
        "NO_PROJECTS" => ["code" => 204],
        "NO_COLUMNS" => ["code" => 204],
        "NO_TASKS" => ["code" => 204],
        "NO_LABELS" => ["code" => 204],
        "USER_NOT_LOGGED" => ["code" => 401, "message" => "Użytkownik nie jest zalogowany"],
        "PROJECT_ERROR" => ["code" => 500, "message" => "Projekt nie został utworzony"],
        "PROJECT_CREATED" => ["code" => 201, "message" => "Projekt został utworzony"],
        "PROJECT_NOT_FOUND" => ["code" => 404, "message" => "Nie znaleziono projektu"],
        "PROJECT_ACCESS" => ["code" => 401, "message" => "Brak dostępu"],
        "INVALID_DATA" => ["code" => 400, "message" => "Wprowadzone dane są niepoprawne"],
        "COLUMN_ERROR" => ["code" => 500, "message" => "Kolumna nie została utworzona"],
        "COLUMN_CREATED" => ["code" => 201, "message" => "Kolumna została utworzona"],
        "TASK_ERROR" => ["code" => 500, "message" => "Zadanie nie zostało utworzone"],
        "TASK_CREATED" => ["code" => 201, "message" => "Zadanie zostało utworzone"],
        "LABEL_ERROR" => ["code" => 500, "message" => "Etykieta nie została utworzona"],
        "LABEL_CREATED" => ["code" => 201, "message" => "Etykieta została utworzona"],
        "COLUMN_MOVED" => ["code" => 200, "message" => "Kolumna została przeniesiona"],
        "TASK_MOVED" => ["code" => 200, "message" => "Zadanie zostało przeniesione"],
    ];

    function sendResponse($response) {
        global $responses;

        if(isset($responses[$response])) {
            http_response_code($responses[$response]["code"]);

            if(isset($responses[$response]["message"])) {
                echo json_encode(["message" => $responses[$response]["message"]]);
            }
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Wystąpił nieznany błąd"]);
        }
    }
?>
