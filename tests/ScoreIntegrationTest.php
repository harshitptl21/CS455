<?php

use PHPUnit\Framework\TestCase;

class ScoreIntegrationTest extends TestCase
{
    private $pdo;
    private $dbFile = 'Game/puzzle_game.db';

    protected function setUp(): void
    {
        $this->pdo = new PDO('sqlite:' . $this->dbFile);
        $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $query = "CREATE TABLE IF NOT EXISTS scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            score INTEGER NOT NULL
        )";
        $this->pdo->exec($query);
    }

    protected function tearDown(): void
    {
        $this->pdo = null;
        unlink($this->dbFile);
    }

    public function testInsertScore()
    {
        $data = [
            'username' => 'testuser',
            'score' => 100
        ];

        $ch = curl_init('http://localhost:8000/Game/submit_score.php');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        
        $response = curl_exec($ch);
        curl_close($ch);
        
        $responseData = json_decode($response, true);
        $this->assertEquals('Score added successfully!', $responseData['message']);

        $query = 'SELECT * FROM scores WHERE username = :username';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':username', $data['username']);
        $stmt->execute();
        
        $scoreData = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->assertNotFalse($scoreData);
        $this->assertEquals($data['username'], $scoreData['username']);
        $this->assertEquals($data['score'], $scoreData['score']);
    }
}
