# CS455

- Group Member:
  - Aakash Yadav (210010)
  - Harshit Patel (210424)
- Deployed Game: [Play](https://harshitptl21.github.io/CS455/)

## Assignment 1: Develop a Game
A puzzle game, in which an image is split into 9 parts and the user has to assemble it to form the original image.
- [Problem Statement](https://github.com/harshitptl21/CS455/blob/main/Problem_Statements/Assignment_1.pdf)
- Task/Planning (Details and task assignment is in the [Issues (label:Assignment 1)](https://github.com/harshitptl21/CS455/issues?q=is%3Aissue+label%3A%22Assignment+1%22)
  - Add HTML and CSS file
  - Add game functionalities

## Assignment 2: Code Quality
- [Problem Statement](https://github.com/harshitptl21/CS455/blob/main/Problem_Statements/Assignment_2.pdf)
- Task/Planning (Details and task assignment is in the [Issues (label:Assignment 2)](https://github.com/harshitptl21/CS455/issues?q=is%3Aissue+label%3A%22Assignment+2%22)
  - Add Code Quality Metrics
    - **ESLint:** Lints and enforces coding standards for JavaScript.
    - **eslint-plugin-complexity:** Checks code complexity.
    - **Stylelint:** Lints and enforces coding standards for CSS.
    - **HTMLHint:** Lints and enforces coding standards for HTML.
    - **JSCPD:** Detects code duplication across the Game codebase.
  - Refactor Code
  - Add Unit Tests
  - Continuous Integration
- Running Locally
  - Install dependencies:
    - npm install
  - Run Code Quality Checkers:
    - For JavaScript and Code Complexity: npm run lint:js
    - For CSS: npm run lint:css
    - For HTML: npm run lint:html
    - For Duplication: npm run check:duplication
  - Unit Test
    - Run: npm run test
    - [Report](https://harshitptl21.github.io/CS455/coverage/Chrome%20Headless%20128.0.0.0%20(Linux%20x86_64)/index.html)

## Assignment 3: Conversion to client-server architecture
- [Problem Statement](https://github.com/harshitptl21/CS455/blob/main/Problem_Statements/Assignment_3.pdf)
- Task/Planning (Details and task assignment is in the [Issues (label:Assignment 3)](https://github.com/harshitptl21/CS455/issues?q=is%3Aissue+label%3A%22Assignment+3%22)
- [Report](https://harshitptl21.github.io/CS455/coverage/Chrome%20Headless%20129.0.0.0%20(Linux%20x86_64)/index.html)
- [Architecture & test pyramid diagrams](https://github.com/harshitptl21/CS455/tree/main/Diagrams)
- Client-Server Architecture diagram:
  - ![Client-Server Architecture diagram](https://github.com/harshitptl21/CS455/blob/main/Diagrams/architecture.png)
- Game Logic diagram:
  - ![Game logic diagram](https://github.com/harshitptl21/CS455/blob/main/Diagrams/game.png)
- Testing Pyramid diagram:
  - ![Testing diagram](https://github.com/harshitptl21/CS455/blob/main/Diagrams/testing%20pyramid.jpg)
- ### Components:
  - UI (HTML & CSS):
    - [index.html](https://github.com/harshitptl21/CS455/blob/main/index.html): Sets up the main structure of the game including the timer, score tables, canvas, and input fields for the username.
    - [style.css](https://github.com/harshitptl21/CS455/blob/main/Game/style.css): Styles the game, including blurred elements until a username is entered, and the layout for the canvas, score table, and other UI elements.
  - Game Logic:
    - [script.js](https://github.com/harshitptl21/CS455/blob/main/Game/script.js): Core logic of the puzzle game, including setting up the puzzle, handling events (drag, drop, timer), and shuffling pieces.
  - Backend:
    - [get_scores.php](https://github.com/harshitptl21/CS455/blob/main/Game/get_scores.php): Retrieve scores from the database and sends them to the frontend for display in the score tables.
    - [submit_score.php](https://github.com/harshitptl21/CS455/blob/main/Game/submit_score.php): Submits the user's score and username to the database once the game ends.
- ### Workflows:
  - User Interactions:
    - User enters their name in the input field.
    - The game starts when the user clicks or touches the canvas.
    - The game logic starts, shuffling the puzzle and initiating the timer.
    - The player moves pieces using mouse or touch events.
  - Game State:
    - Canvas: Displays the puzzle pieces and updates their positions as the user drags and drops them.
    - Timer: Counts down and triggers the game over if time runs out.
  - Database Interactions:
    - Submit Scores: After the game ends, the submit_score.php sends the user's score to the backend and stores it in puzzle_game.db
    - Fetch Scores: On page load, get_scores.php fetches the scores from the database to display in the score tables.
- ### Testing:
  - **karma (jasmine)**: For Javascript testing
  - **phpunit**: For php testing
  - Unit test: Tested game logic.
  - Integration test: Tested frontend-server and server-database integration
  - End to End test: Manually tested UI 
