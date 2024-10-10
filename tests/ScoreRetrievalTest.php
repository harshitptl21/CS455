<?php

use PHPUnit\Framework\TestCase;

class ScoreRetrievalTest extends TestCase
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
        $this->insertSampleScores();
    }

    protected function tearDown(): void
    {
        $this->pdo = null;
        unlink($this->dbFile);
    }

    private function insertSampleScores()
    {
        $sampleScores = [
            ['username' => 'user1', 'score' => 150],
            ['username' => 'user2', 'score' => 100],
            ['username' => 'user3', 'score' => 200],
        ];

        foreach ($sampleScores as $data) {
            $query = 'INSERT INTO scores (username, score) VALUES (:username, :score)';
            $stmt = $this->pdo->prepare($query);
            $stmt->bindParam(':username', $data['username']);
            $stmt->bindParam(':score', $data['score']);
            $stmt->execute();
        }
    }

    public function testRetrieveScores()
    {
        $ch = curl_init('http://localhost:8000/Game/get_scores.php');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        
        $response = curl_exec($ch);
        curl_close($ch);
        
        $scores = json_decode($response, true);
        
        $this->assertIsArray($scores);
        $this->assertCount(3, $scores);

        $this->assertEquals('user2', $scores[0]['username']);
        $this->assertEquals(100, $scores[0]['score']);
        $this->assertEquals('user1', $scores[1]['username']);
        $this->assertEquals(150, $scores[1]['score']);
        $this->assertEquals('user3', $scores[2]['username']);
        $this->assertEquals(200, $scores[2]['score']);
    }
}
