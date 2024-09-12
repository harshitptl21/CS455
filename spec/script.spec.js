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

