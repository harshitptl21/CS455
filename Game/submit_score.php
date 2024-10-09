<?php
header('Content-Type: application/json');

try {
    $pdo = new PDO('sqlite:puzzle_game.db');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $data = json_decode(file_get_contents('php://input'), true);
    $username = $data['username'];
    $score = $data['score'];

    $query = 'INSERT INTO scores (username, score) VALUES (:username, :score)';
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':username', $username);
    $stmt->bindParam(':score', $score);
    $stmt->execute();

    echo json_encode(['message' => 'Score added successfully!']);

} catch (PDOException $e) {
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
