const puzzle_difficulty = 3;

var timer;
var canvas;
var stage;
var img;
var pieces;
var puzzle_width;
var puzzle_height;
var piece_width;
var piece_height;
var current_piece;
var current_drop_piece;
var mouse;

var username;
var score;

function init() {
    img = new Image();
    img.src = "Game/images/Dog.jpg";
    img.addEventListener('load', setupPuzzle, false);
}

function setupPuzzle() {
    piece_width = Math.floor(img.width / puzzle_difficulty);
    piece_height = Math.floor(img.height / puzzle_difficulty);
    puzzle_width = piece_width * puzzle_difficulty;
    puzzle_height = piece_height * puzzle_difficulty;

    setCanvas();
    createPuzzlePieces();
    drawInitialPuzzle();
    initTouchEvents();
}

function setCanvas() {
    canvas = document.getElementById('myCanvas');
    stage = canvas.getContext('2d');
    canvas.width = puzzle_width;
    canvas.height = puzzle_height;
    canvas.style.border = "1px solid black";
}

function createPuzzlePieces() {
    pieces = [];
    let xPos = 0;
    let yPos = 0;

    for (let i = 0; i < puzzle_difficulty * puzzle_difficulty; i++) {
        pieces.push({ sx: xPos, sy: yPos, xPos, yPos });
        xPos += piece_width;
        if (xPos >= puzzle_width) {
            xPos = 0;
            yPos += piece_height;
        }
    }
}

function drawInitialPuzzle() {
    stage.drawImage(img, 0, 0, puzzle_width, puzzle_height, 0, 0, puzzle_width, puzzle_height);
    createTitle("Click or Touch Anywhere To Start");

    canvas.addEventListener('mousedown', shuffleAndStartPuzzle, false);
    canvas.addEventListener('touchstart', shuffleAndStartPuzzle, false);
}

function createTitle(msg) {
    stage.fillStyle = "#000000";
    stage.globalAlpha = 0.5;
    stage.fillRect(100, puzzle_height - 100, puzzle_width - 200, 40);
    stage.fillStyle = "#FFFFFF";
    stage.globalAlpha = 1;
    stage.textAlign = "center";
    stage.textBaseline = "middle";
    stage.font = "20px Arial";
    stage.fillText(msg, puzzle_width / 2, puzzle_height - 80);
}

function initTouchEvents() {
    canvas.addEventListener('touchstart', handlePieceMove, false);
    canvas.addEventListener('touchmove', handlePieceMove, false);
    canvas.addEventListener('touchend', handlePieceMove, false);
}

function shuffleAndStartPuzzle(e) {
    e.preventDefault();
    shufflePieces();
    drawShuffledPuzzle();
    canvas.removeEventListener('mousedown', shuffleAndStartPuzzle);
    canvas.removeEventListener('touchstart', shuffleAndStartPuzzle);
    canvas.addEventListener('mousedown', handlePieceMove, false);
    canvas.addEventListener('touchstart', handlePieceMove, false);
    startTimer();
}

function startTimer() {
    var timeLeft = 60;
    timer = setInterval(() => {
        timeLeft--;
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        document.getElementById('timer').textContent =
            (minutes < 10 ? '0' : '') + minutes + ':' +
            (seconds < 10 ? '0' : '') + seconds;
        score = 60-timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            alert("Time's up! You Lose!");
            gameOver();
        }
    }, 1000);
}

function shufflePieces() {
    pieces = pieces.sort(() => Math.random() - 0.5);
    let xPos = 0;
    let yPos = 0;
    pieces.forEach(piece => {
        piece.xPos = xPos;
        piece.yPos = yPos;

        xPos += piece_width;
        if (xPos >= puzzle_width) {
            xPos = 0;
            yPos += piece_height;
        }
    });
}

function drawShuffledPuzzle() {
    stage.clearRect(0, 0, puzzle_width, puzzle_height);

    pieces.forEach(piece => {
        stage.drawImage(img, piece.sx, piece.sy, piece_width, piece_height, piece.xPos, piece.yPos, piece_width, piece_height);
        stage.strokeRect(piece.xPos, piece.yPos, piece_width, piece_height);
    });
}

function handlePieceMove(e) {
    e.preventDefault();
    updatePosition(e);

    if (!current_piece) {
        current_piece = getPieceAtPosition();
        if (current_piece) {
            startDragging();
        }
    } else {
        updateDragging();
    }
}

function startDragging() {
    stage.clearRect(current_piece.xPos, current_piece.yPos, piece_width, piece_height);
    stage.save();
    stage.globalAlpha = 0.9;
    stage.drawImage(img, current_piece.sx, current_piece.sy, piece_width, piece_height, mouse.x - piece_width / 2, mouse.y - piece_height / 2, piece_width, piece_height);
    stage.restore();

    document.onmousemove = updateDragging;
    document.onmouseup = dropPiece;
    document.ontouchmove = updateDragging;
    document.ontouchend = dropPiece;
}

function getPieceAtPosition() {
    return pieces.find(piece => (
        mouse.x >= piece.xPos &&
        mouse.x < piece.xPos + piece_width &&
        mouse.y >= piece.yPos &&
        mouse.y < piece.yPos + piece_height
    )) || null;
}

function updateDragging(e) {
    updatePosition(e);

    current_drop_piece = null;
    stage.clearRect(0, 0, puzzle_width, puzzle_height);

    pieces.forEach(piece => {
        if (piece !== current_piece) {
            stage.drawImage(img, piece.sx, piece.sy, piece_width, piece_height, piece.xPos, piece.yPos, piece_width, piece_height);
            stage.strokeRect(piece.xPos, piece.yPos, piece_width, piece_height);
        }

        if (!current_drop_piece &&
            mouse.x >= piece.xPos && mouse.x < piece.xPos + piece_width &&
            mouse.y >= piece.yPos && mouse.y < piece.yPos + piece_height) {
            current_drop_piece = piece;
            stage.save();
            stage.globalAlpha = 0.4;
            stage.fillStyle = '#009900';
            stage.fillRect(piece.xPos, piece.yPos, piece_width, piece_height);
            stage.restore();
        }
    });

    stage.save();
    stage.globalAlpha = 0.6;
    stage.drawImage(img, current_piece.sx, current_piece.sy, piece_width, piece_height, mouse.x - piece_width / 2, mouse.y - piece_height / 2, piece_width, piece_height);
    stage.restore();
    stage.strokeRect(mouse.x - piece_width / 2, mouse.y - piece_height / 2, piece_width, piece_height);
}

function updatePosition(e) {
    if (e.touches) {
        let touch = e.touches[0];
        mouse = {
            x: touch.pageX - canvas.offsetLeft,
            y: touch.pageY - canvas.offsetTop
        };
    } else {
        mouse = {
            x: e.offsetX || e.layerX,
            y: e.offsetY || e.layerY,
        };
    }
}

function dropPiece() {
    document.onmousemove = null;
    document.onmouseup = null;
    document.ontouchmove = null;
    document.ontouchend = null;

    if (current_drop_piece) {
        let temp = { xPos: current_piece.xPos, yPos: current_piece.yPos };
        current_piece.xPos = current_drop_piece.xPos;
        current_piece.yPos = current_drop_piece.yPos;
        current_drop_piece.xPos = temp.xPos;
        current_drop_piece.yPos = temp.yPos;
    }
    current_piece = null;
    resetPuzzleAndCheckWin();
}

function resetPuzzleAndCheckWin() {
    stage.clearRect(0, 0, puzzle_width, puzzle_height);
    let gameWin = true;
    pieces.forEach(piece => {
        stage.drawImage(img, piece.sx, piece.sy, piece_width, piece_height, piece.xPos, piece.yPos, piece_width, piece_height);
        stage.strokeRect(piece.xPos, piece.yPos, piece_width, piece_height);
        if (piece.xPos !== piece.sx || piece.yPos !== piece.sy) {
            gameWin = false;
        }
    });
    if (gameWin) {
        setTimeout(() => {
            alert("You Win! Solved in "+score+" seconds");
            gameOver();
        }, 100);
    }
}

function gameOver() {
    clearInterval(timer);
    document.getElementById('timer').textContent = "01:00"
    canvas.removeEventListener('mousedown', handlePieceMove);
    canvas.removeEventListener('touchstart', handlePieceMove);
    submitScore();
    storeUserName();
}

function storeUserName() {
    username = document.getElementById("username").value;
    if(username.trim() != ''){
        document.querySelector('.timer-container').style.filter = 'none';
        document.querySelector('.score-table').style.filter = 'none';
        document.querySelector('.puzzleFrame').style.filter = 'none';
        loadScores();
        init();
    } else{
        storeUserName();
    }
}

function loadScores() {
    fetch('Game/get_scores.php')
        .then(response => response.json())
        .then(data => {
            const scoreList = document.getElementById('score-list');
            const userScore = document.getElementById('user-score')
            userScore.innerHTML = '';
            scoreList.innerHTML = '';

            data.slice(0, 10).forEach(score => {
                const listItem = document.createElement('li');
                listItem.textContent = `${score.username}: ${score.score}`+" seconds";
                scoreList.appendChild(listItem);
            });
            data.forEach(score => {
                if(`${score.username}` == username){
                    const listItem = document.createElement('li');
                    listItem.textContent = `${score.username}: ${score.score}`+" seconds";
                    userScore.appendChild(listItem);
                }
            });
        })
        .catch(error => {
            console.error('Error loading scores:', error);
        });
}
