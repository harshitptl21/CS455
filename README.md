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
  - Run Unit Test
    - npm run test
