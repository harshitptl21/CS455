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
