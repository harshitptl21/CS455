describe('loadScores', function() {
    beforeEach(function() {
        spyOn(window, 'fetch').and.returnValue(Promise.resolve({
            json: () => Promise.resolve([
                { username: 'Tester', score: 120 },
                { username: 'Alice', score: 110 },
                { username: 'Bob', score: 130 }
            ])
        }));

        const scoreList = document.createElement('ul');
        scoreList.id = 'score-list';
        document.body.appendChild(scoreList);

        const userScore = document.createElement('ul');
        userScore.id = 'user-score';
        document.body.appendChild(userScore);

        username = 'Tester';
    });

    afterEach(function() {
        document.body.innerHTML = '';
    });

    it('should fetch and display the top 10 scores', function(done) {
        loadScores();

        setTimeout(function() {
            const scoreList = document.getElementById('score-list');
            expect(scoreList.children.length).toBe(3);

            const userScore = document.getElementById('user-score');
            expect(userScore.children.length).toBe(1);

            expect(scoreList.children[0].textContent).toBe('Tester: 120 seconds');
            expect(scoreList.children[1].textContent).toBe('Alice: 110 seconds');
            expect(scoreList.children[2].textContent).toBe('Bob: 130 seconds');
            expect(userScore.children[0].textContent).toBe('Tester: 120 seconds');
            done();
        }, 0);
    });
});
