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

    it("should set the canvas width and height based on puzzle dimensions", function() {
        expect(canvas.width).toBe(puzzle_width);
        expect(canvas.height).toBe(puzzle_height);
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
