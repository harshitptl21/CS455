<?php
header('Content-Type: application/json');

try {
    $pdo = new PDO('sqlite:puzzle_game.db');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $query = "CREATE TABLE IF NOT EXISTS scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        score INTEGER NOT NULL
    )";
    $pdo->exec($query);

    $query = 'SELECT username, score FROM scores ORDER BY score ASC';
    $stmt = $pdo->query($query);
    $scores = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($scores);

} catch (PDOException $e) {
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
