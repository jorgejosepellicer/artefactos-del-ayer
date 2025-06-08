<?php
// registrarUsuario.php

header('Content-Type: application/json');

try {
    // Conexión PDO a MySQL (ajusta con tus datos)
    $host = 'localhost';
    $db   = 'mydb';
    $user = 'root';
    $pass = 'root';
    $charset = 'utf8mb4';

    $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
    $pdo = new PDO($dsn, $user, $pass, [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    // Obtener datos JSON del cuerpo de la petición
    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($data['password'])) {
        http_response_code(400);
        echo json_encode(['error' => 'La contraseña es obligatoria']);
        exit;
    }

    // Extraemos la contraseña y otros datos
    $password = $data['password'];
    unset($data['password']); // para no guardarla así

    // Encriptar contraseña con bcrypt (password_hash usa bcrypt por defecto)
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    // Preparar sentencia insert, asumiendo que tu tabla tiene columnas según $data + password
    $columns = array_keys($data);
    $columns[] = 'password';

    $placeholders = array_fill(0, count($columns), '?');

    $sql = "INSERT INTO usuarios (" . implode(',', $columns) . ") VALUES (" . implode(',', $placeholders) . ")";

    $stmt = $pdo->prepare($sql);

    // Valores a insertar (datos + hashedPassword)
    $values = array_values($data);
    $values[] = $hashedPassword;

    $stmt->execute($values);

    // Obtener el id insertado
    $id_usuario = $pdo->lastInsertId();

    // Devolver datos sin password
    http_response_code(201);
    echo json_encode(array_merge(['id_usuario' => $id_usuario], $data));

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error registrando usuario', 'details' => $e->getMessage()]);
}
