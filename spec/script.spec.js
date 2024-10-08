describe('init', function(){

    beforeEach(function() {
        img = jasmine.createSpyObj('img', ['addEventListener']);
        setupPuzzle = jasmine.createSpy('setupPuzzle');
        spyOn(window, 'Image').and.returnValue(img);
        window.setupPuzzle = setupPuzzle;
        init();
    });

    it('should create a new Image object', function() {
        expect(window.Image).toHaveBeenCalled();
    });

    it('should set the src attribute to the correct image path', function() {
        expect(img.src).toBe("Game/images/Dog.jpg");
    });

    it('should add a load event listener to the image', function() {
        expect(img.addEventListener).toHaveBeenCalledWith('load', jasmine.any(Function), false);
    });

    it('should call setupPuzzle when the image load event fires', function() {
        const loadEventHandler = img.addEventListener.calls.mostRecent().args[1];
        loadEventHandler();
        expect(setupPuzzle).toHaveBeenCalled();
    });
});

describe("setupPuzzle", function() {

    beforeEach(function() {
        window.img = { width: 900, height: 565 };
        spyOn(window, "setCanvas").and.callFake(() => {});
        spyOn(window, "createPuzzlePieces").and.callFake(() => {});
        spyOn(window, "drawInitialPuzzle").and.callFake(() => {});
        spyOn(window, "initTouchEvents").and.callFake(() => {});
    });

    afterEach(function() {
        window.img = undefined;
        setCanvas.and.callThrough(); 
        createPuzzlePieces.and.callThrough(); 
        drawInitialPuzzle.and.callThrough();
        initTouchEvents.and.callThrough();
    });

    it("should calculate the correct piece width and height", function() {
        setupPuzzle();
        expect(piece_width).toBe(Math.floor(window.img.width / puzzle_difficulty));
        expect(piece_height).toBe(Math.floor(window.img.height / puzzle_difficulty));
    });

    it("should set the correct puzzle width and height", function() {
        setupPuzzle();
        expect(puzzle_width).toBe(piece_width * puzzle_difficulty);
        expect(puzzle_height).toBe(piece_height * puzzle_difficulty);
    });

    it("should call setCanvas", function() {
        setupPuzzle();
        expect(setCanvas).toHaveBeenCalled();
    });

    it("should call createPuzzlePieces", function() {
        setupPuzzle();
        expect(createPuzzlePieces).toHaveBeenCalled();
    });

    it("should call drawInitialPuzzle", function() {
        setupPuzzle();
        expect(drawInitialPuzzle).toHaveBeenCalled();
    });

    it("should call initTouchEvents", function() {
        setupPuzzle();
        expect(initTouchEvents).toHaveBeenCalled();
    });
});

describe("setCanvas", function() {

    beforeEach(function() {
        canvas = document.createElement('canvas');
        canvas.setAttribute('id', 'myCanvas');
        stage = jasmine.createSpyObj('CanvasRenderingContext2D', ['fillRect', 'clearRect', 'drawImage']);
        spyOn(document, 'getElementById').and.returnValue(canvas);
        spyOn(canvas, 'getContext').and.returnValue(stage);
        setCanvas();
    });

    afterEach(function() {
        document.getElementById.and.callThrough();
        canvas.getContext.and.callThrough();
        if (document.getElementById('myCanvas')) {
            document.body.removeChild(canvas);
        }
        canvas = null;
        stage = null;
    });

    it("should retrieve the canvas element by its ID", function() {
        expect(document.getElementById).toHaveBeenCalledWith('myCanvas');
    });

    it("should apply a black border to the canvas", function() {
        expect(canvas.style.border).toBe("1px solid black");
    });

    it("should retrieve the 2D drawing context", function() {
        expect(stage).toBe(canvas.getContext('2d'));
    });
});

describe("createTitle", function() {
    let stage;

    beforeEach(function() {
        stage = jasmine.createSpyObj('CanvasRenderingContext2D', ['fillRect', 'fillStyle', 'globalAlpha', 'textAlign', 'textBaseline', 'font', 'fillText']);
        window.stage = stage;
        window.puzzle_width = 900;
        window.puzzle_height = 565;
    });

    it("should set the correct text properties", function() {
        createTitle("Test Message");
        expect(stage.fillStyle).toBe("#FFFFFF");
        expect(stage.globalAlpha).toBe(1);
        expect(stage.textAlign).toBe("center");
        expect(stage.textBaseline).toBe("middle");
        expect(stage.font).toBe("20px Arial");
    });

    it("should render the message text in the center of the canvas", function() {
        createTitle("Test Message");
        expect(stage.fillText).toHaveBeenCalledWith("Test Message", puzzle_width / 2, puzzle_height - 80);
    });

    afterEach(function() {
        window.stage = undefined;
        window.puzzle_width = undefined;
        window.puzzle_height = undefined;
    });
});

describe("initTouchEvents", function() {
    let canvas;

    beforeEach(function() {
        canvas = document.createElement('canvas');
        canvas.setAttribute('id', 'myCanvas');
        spyOn(canvas, 'addEventListener');
        window.canvas = canvas;
    });

    it("should add a touchstart event listener to the canvas", function() {
        initTouchEvents();
        expect(canvas.addEventListener).toHaveBeenCalledWith('touchstart', jasmine.any(Function), false);
    });

    it("should add a touchmove event listener to the canvas", function() {
        initTouchEvents();
        expect(canvas.addEventListener).toHaveBeenCalledWith('touchmove', jasmine.any(Function), false);
    });

    it("should add a touchend event listener to the canvas", function() {
        initTouchEvents();
        expect(canvas.addEventListener).toHaveBeenCalledWith('touchend', jasmine.any(Function), false);
    });

    afterEach(function() {
        window.canvas = undefined;
    });
});

describe("updatePosition", function() {
    let canvas, mouseEvent, touchEvent;

    beforeEach(function() {
        canvas = document.createElement('canvas');
        canvas.setAttribute('id', 'myCanvas');
        document.body.appendChild(canvas);
        window.canvas = canvas;
    });

    it("should update mouse position using touch coordinates for a touch event", function() {
        spyOnProperty(canvas, 'offsetLeft', 'get').and.returnValue(10);
        spyOnProperty(canvas, 'offsetTop', 'get').and.returnValue(20);
        touchEvent = {
            touches: [{ pageX: 100, pageY: 200 }]
        };

        updatePosition(touchEvent);
        expect(window.mouse).toEqual({ x: 90, y: 180 });
    });

    afterEach(function() {
        document.body.removeChild(canvas);
        window.mouse = undefined;
    });
});

describe("getPieceAtPosition", function() {
    let piece1, piece2, piece3;

    beforeEach(function() {
        window.piece_width = 100;
        window.piece_height = 100;

        piece1 = { xPos: 0, yPos: 0 };    // Top-left corner
        piece2 = { xPos: 100, yPos: 0 };  // Top-right
        piece3 = { xPos: 0, yPos: 100 };  // Bottom-left

        window.pieces = [piece1, piece2, piece3];
    });

    it("should return the correct piece when the mouse is within the bounds of piece1", function() {
        window.mouse = { x: 50, y: 50 };  // Inside piece1
        const result = getPieceAtPosition();
        expect(result).toBe(piece1);
    });

    it("should return the correct piece when the mouse is within the bounds of piece2", function() {
        window.mouse = { x: 150, y: 50 }; // Inside piece2
        const result = getPieceAtPosition();
        expect(result).toBe(piece2);
    });

    it("should return the correct piece when the mouse is within the bounds of piece3", function() {
        window.mouse = { x: 50, y: 150 }; // Inside piece3
        const result = getPieceAtPosition();
        expect(result).toBe(piece3);
    });

    it("should return null when the mouse is outside the bounds of all pieces", function() {
        window.mouse = { x: 300, y: 300 }; // Outside all pieces
        const result = getPieceAtPosition();
        expect(result).toBeNull();
    });
});

describe("shuffleAndStartPuzzle", function() {
    let e, canvas;

    beforeEach(function() {
        e = {
            preventDefault: jasmine.createSpy('preventDefault')
        };

        canvas = {
            addEventListener: jasmine.createSpy('addEventListener'),
            removeEventListener: jasmine.createSpy('removeEventListener')
        };

        spyOn(window, 'shufflePieces');
        spyOn(window, 'drawShuffledPuzzle');
        spyOn(window, 'startTimer');
        spyOn(window, 'handlePieceMove');

        window.canvas = canvas;
    });

    afterEach(function() {
        e.preventDefault.and.callThrough();
        canvas.addEventListener.and.callThrough();
        canvas.removeEventListener.and.callThrough();
        shufflePieces.calls.reset();
        drawShuffledPuzzle.calls.reset();
        startTimer.calls.reset();
        handlePieceMove.calls.reset();
    });

    it("should prevent the default action of the event", function() {
        shuffleAndStartPuzzle(e);
        expect(e.preventDefault).toHaveBeenCalled();
    });

    it("should shuffle the pieces and draw the shuffled puzzle", function() {
        shuffleAndStartPuzzle(e);
        expect(shufflePieces).toHaveBeenCalled();
        expect(drawShuffledPuzzle).toHaveBeenCalled();
    });

    it("should manage event listeners correctly", function() {
        shuffleAndStartPuzzle(e);
        expect(canvas.removeEventListener).toHaveBeenCalledWith('mousedown', shuffleAndStartPuzzle);
        expect(canvas.removeEventListener).toHaveBeenCalledWith('touchstart', shuffleAndStartPuzzle);
        expect(canvas.addEventListener).toHaveBeenCalledWith('mousedown', handlePieceMove, false);
        expect(canvas.addEventListener).toHaveBeenCalledWith('touchstart', handlePieceMove, false);
    });

    it("should start the timer", function() {
        shuffleAndStartPuzzle(e);
        expect(startTimer).toHaveBeenCalled();
    });
});

describe("startTimer", function() {
    let timer;

    beforeEach(function() {
        const mockElement = {
            textContent: ''
        };
        spyOn(document, 'getElementById').and.returnValue(mockElement);

        spyOn(window, 'setInterval').and.callFake((callback, interval) => {
            timer = { callback, interval };
            callback();
            return timer;
        });

        spyOn(window, 'clearInterval');
        spyOn(window, 'alert');
        spyOn(window, 'gameOver');
    });

    afterEach(function() {
        document.getElementById.and.callThrough();
        clearInterval.calls.reset();
        alert.calls.reset();
        gameOver.calls.reset();
    });

    it("should initialize a timer that updates the timer display", function() {
        startTimer();
        timer.callback();
        const timerElement = document.getElementById('timer');
        expect(timerElement.textContent).toBe('00:58');
    });
});

describe("shufflePieces", function() {
    let originalPieces, shuffledPieces;

    beforeEach(function() {
        pieces = [
            { sx: 0, sy: 0, xPos: 0, yPos: 0 },
            { sx: 50, sy: 50, xPos: 0, yPos: 0 },
            { sx: 100, sy: 100, xPos: 0, yPos: 0 },
            { sx: 150, sy: 150, xPos: 0, yPos: 0 }
        ];

        originalPieces = JSON.parse(JSON.stringify(pieces));
    });

    afterEach(function() {
        pieces = null;
        originalPieces = null;
        shuffledPieces = null;
    });

    it("should shuffle the pieces array", function() {
        shufflePieces();
        expect(pieces).not.toEqual(originalPieces);
    });
});

describe("dropPiece", function() {
    let current_piece, current_drop_piece, resetPuzzleAndCheckWin;

    beforeEach(function() {
        document.onmousemove = jasmine.createSpy('onmousemove');
        document.onmouseup = jasmine.createSpy('onmouseup');
        document.ontouchmove = jasmine.createSpy('ontouchmove');
        document.ontouchend = jasmine.createSpy('ontouchend');
        
        current_piece = { xPos: 10, yPos: 20 };
        current_drop_piece = { xPos: 30, yPos: 40 };
        
        resetPuzzleAndCheckWin = jasmine.createSpy('resetPuzzleAndCheckWin');
        window.resetPuzzleAndCheckWin = resetPuzzleAndCheckWin;
    });

    afterEach(function() {
        document.onmousemove = null;
        document.onmouseup = null;
        document.ontouchmove = null;
        document.ontouchend = null;
        current_piece = null;
        current_drop_piece = null;
        resetPuzzleAndCheckWin = null;
    });

    it("should set global event handlers to null", function() {
        dropPiece();
        expect(document.onmousemove).toBeNull();
        expect(document.onmouseup).toBeNull();
        expect(document.ontouchmove).toBeNull();
        expect(document.ontouchend).toBeNull();
    });

    it("should call resetPuzzleAndCheckWin", function() {
        dropPiece();
        expect(resetPuzzleAndCheckWin).toHaveBeenCalled();
    });
});

describe("createPuzzlePieces", function() {
    let puzzle_difficulty, piece_width, piece_height, puzzle_width, puzzle_height, pieces;

    beforeEach(function() {
        puzzle_difficulty = 3;
        piece_width = 100;
        piece_height = 100;
        puzzle_width = 300;
        puzzle_height = 300;
        pieces = [];
    });

    afterEach(function() {
        puzzle_difficulty = null;
        piece_width = null;
        piece_height = null;
        puzzle_width = null;
        puzzle_height = null;
        pieces = [];
    });

    it("should create correct number of puzzle pieces", function() {
        createPuzzlePieces();
        expect(9).toBe(puzzle_difficulty * puzzle_difficulty);
    });

    it("should assign correct xPos and yPos for each piece", function() {
        createPuzzlePieces();

        for (let i = 0; i < pieces.length; i++) {
            const row = Math.floor(i / puzzle_difficulty);
            const col = i % puzzle_difficulty;
            const expectedXPos = col * piece_width;
            const expectedYPos = row * piece_height;

            expect(pieces[i].xPos).toBe(expectedXPos);
            expect(pieces[i].yPos).toBe(expectedYPos);
        }
    });

    it("should reset xPos and increment yPos after each row is filled", function() {
        createPuzzlePieces();

        for (let i = 0; i < pieces.length; i++) {
            const piece = pieces[i];
            if (i % puzzle_difficulty === 0 && i !== 0) {
                expect(piece.xPos).toBe(0);
                expect(piece.yPos).toBe(pieces[i - 1].yPos + piece_height);
            }
        }
    });
});

describe("drawInitialPuzzle", function() {
    let stage, img, canvas;

    beforeEach(function() {
        stage = {
            drawImage: jasmine.createSpy('drawImage')
        };

        img = {};

        canvas = {
            addEventListener: jasmine.createSpy('addEventListener')
        };
        spyOn(window, 'createTitle');
        spyOn(window, 'drawInitialPuzzle').and.callThrough();

        window.stage = stage;
        window.img = img;
        window.canvas = canvas;
    });

    afterEach(function() {
        stage.drawImage.and.callThrough();
        canvas.addEventListener.and.callThrough();
        createTitle.calls.reset();
    });

    it("should draw the initial image on the canvas", function() {
        drawInitialPuzzle();
        expect(stage.drawImage).toHaveBeenCalledWith(img, 0, 0, puzzle_width, puzzle_height, 0, 0, puzzle_width, puzzle_height);
    });

    it("should create the title with the correct text", function() {
        drawInitialPuzzle();
        expect(createTitle).toHaveBeenCalledWith("Click or Touch Anywhere To Start");
    });

    it("should add event listeners to the canvas", function() {
        drawInitialPuzzle();
        expect(canvas.addEventListener).toHaveBeenCalledWith('mousedown', shuffleAndStartPuzzle, false);
        expect(canvas.addEventListener).toHaveBeenCalledWith('touchstart', shuffleAndStartPuzzle, false);
    });
});

describe('drawShuffledPuzzle', function() {
    let stage;
    let pieces;
    let img;
    let puzzle_width;
    let puzzle_height;
    let piece_width;
    let piece_height;

    beforeEach(function() {
        stage = {
            clearRect: jasmine.createSpy('clearRect'),
            drawImage: jasmine.createSpy('drawImage'),
            strokeRect: jasmine.createSpy('strokeRect')
        };
        
        pieces = [
            { sx: 0, sy: 0, xPos: 10, yPos: 10 },
            { sx: 100, sy: 0, xPos: 110, yPos: 10 },
        ];
        
        img = new Image();
        puzzle_width = 300;
        puzzle_height = 300; 
        piece_width = 100;
        piece_height = 100; 
    });

    it('should clear the canvas and draw each puzzle piece', function() {
        window.stage = stage;
        window.pieces = pieces;
        window.img = img;
        window.puzzle_width = puzzle_width;
        window.puzzle_height = puzzle_height;
        window.piece_width = piece_width;
        window.piece_height = piece_height;

        drawShuffledPuzzle();

        expect(stage.clearRect).toHaveBeenCalledWith(0, 0, puzzle_width, puzzle_height);
        
        pieces.forEach(piece => {
            expect(stage.drawImage).toHaveBeenCalledWith(
                img,
                piece.sx,
                piece.sy,
                piece_width,
                piece_height,
                piece.xPos,
                piece.yPos,
                piece_width,
                piece_height
            );
            expect(stage.strokeRect).toHaveBeenCalledWith(
                piece.xPos,
                piece.yPos,
                piece_width,
                piece_height
            );
        });
    });
});

describe('resetPuzzleAndCheckWin', function() {
    let stage;
    let img;
    let pieces;
    let score;

    beforeEach(function() {
        stage = {
            clearRect: jasmine.createSpy('clearRect'),
            drawImage: jasmine.createSpy('drawImage'),
            strokeRect: jasmine.createSpy('strokeRect')
        };

        img = new Image(); 
        pieces = [
            { sx: 0, sy: 0, xPos: 0, yPos: 0 },
            { sx: 50, sy: 0, xPos: 50, yPos: 0 },
            { sx: 100, sy: 0, xPos: 100, yPos: 0 }
        ];

        score = 30;
        window.stage = stage;
        window.img = img;
        window.pieces = pieces;
        window.puzzle_width = 300; 
        window.puzzle_height = 150;
        window.piece_width = 50;
        window.piece_height = 50; 
    });

    it('should clear the canvas and draw the pieces', function() {
        resetPuzzleAndCheckWin();

        expect(stage.clearRect).toHaveBeenCalledWith(0, 0, 300, 150);

        pieces.forEach(piece => {
            expect(stage.drawImage).toHaveBeenCalledWith(img, piece.sx, piece.sy, 50, 50, piece.xPos, piece.yPos, 50, 50);
            expect(stage.strokeRect).toHaveBeenCalledWith(piece.xPos, piece.yPos, 50, 50);
        });
    });
});

describe('storeUserName', function() {
    var loadScoresSpy, initSpy;

    beforeEach(function() {
        var body = document.querySelector('body');
        body.innerHTML = `
            <input id="username" type="text">
            <div class="timer-container" style="filter: blur(5px);"></div>
            <div class="score-table" style="filter: blur(5px);"></div>
            <div class="puzzleFrame" style="filter: blur(5px);"></div>
        `;
        loadScoresSpy = spyOn(window, 'loadScores').and.callFake(function() {});
        initSpy = spyOn(window, 'init').and.callFake(function() {});
    });

    it('should remove blur filter and call loadScores and init when username is valid', function() {
        document.getElementById('username').value = 'ValidUser';

        storeUserName();
        expect(document.querySelector('.timer-container').style.filter).toBe('none');
        expect(document.querySelector('.score-table').style.filter).toBe('none');
        expect(document.querySelector('.puzzleFrame').style.filter).toBe('none');

        expect(loadScoresSpy).toHaveBeenCalled();
        expect(initSpy).toHaveBeenCalled();
    });
});

describe('loadScores', function() {
    var mockResponse;

    beforeEach(function() {
        var body = document.querySelector('body');
        body.innerHTML = `
            <ul id="score-list"></ul>
            <ul id="user-score"></ul>
        `;

        mockResponse = [
            { username: 'User1', score: 120 },
            { username: 'User2', score: 150 },
            { username: 'User3', score: 100 },
            { username: 'ValidUser', score: 90 }
        ];

        spyOn(window, 'fetch').and.returnValue(Promise.resolve({
            json: function() {
                return Promise.resolve(mockResponse);
            }
        }));

        username = 'ValidUser';
    });

    it('should fetch scores and populate the score list and user score', function(done) {
       
        loadScores();

        setTimeout(function() {
            expect(window.fetch).toHaveBeenCalledWith('Game/get_scores.php');

            const scoreListItems = document.querySelectorAll('#score-list li');
            expect(scoreListItems.length).toBe(4); 
            expect(scoreListItems[0].textContent).toBe('User1: 120 seconds');
            expect(scoreListItems[1].textContent).toBe('User2: 150 seconds');
            expect(scoreListItems[2].textContent).toBe('User3: 100 seconds');
            expect(scoreListItems[3].textContent).toBe('ValidUser: 90 seconds');

            const userScoreItems = document.querySelectorAll('#user-score li');
            expect(userScoreItems.length).toBe(1);
            expect(userScoreItems[0].textContent).toBe('ValidUser: 90 seconds');

            done();
        }, 0);
    });

    it('should handle errors in the fetch call', function(done) {
        window.fetch.and.returnValue(Promise.reject('Fetch error'));

        spyOn(console, 'error');
        loadScores();

        setTimeout(function() {
            expect(console.error).toHaveBeenCalledWith('Error loading scores:', 'Fetch error');

            done();
        }, 0);
    });
});

describe('submitScore', function() {
    let fetchSpy, loadScoresSpy;

    beforeEach(function() {
        var body = document.querySelector('body');
        body.innerHTML = `
            <input id="username" type="text" value="ValidUser">
        `;

        window.score = 100; 
        loadScoresSpy = spyOn(window, 'loadScores').and.callFake(function() {});

        fetchSpy = spyOn(window, 'fetch').and.returnValue(Promise.resolve({
            json: function() {
                return Promise.resolve({ success: true });
            }
        }));
    });

    it('should submit score when username and score are valid', function(done) {
        submitScore();
        setTimeout(function() {
            expect(fetchSpy).toHaveBeenCalledWith('Game/submit_score.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: 'ValidUser', score: 100 })
            });
            expect(loadScoresSpy).toHaveBeenCalled();

            done();
        }, 0);
    });

    it('should not submit score if username or score is missing and should show an alert', function() {
        window.score = null;
        spyOn(window, 'alert');

        submitScore();
        expect(fetchSpy).not.toHaveBeenCalled();

        expect(window.alert).toHaveBeenCalledWith('Please enter a username and have a valid score.');
    });

    it('should handle fetch errors by logging them', function(done) {
        fetchSpy.and.returnValue(Promise.reject('Fetch error'));
        spyOn(console, 'error');

        submitScore();
        setTimeout(function() {
            expect(console.error).toHaveBeenCalledWith('Error submitting score:', 'Fetch error');

            done();
        }, 0);
    });
});
