# OIBSIP: Oasis Infobyte Internship Projects

**Intern:** Eyuel Dereje
**Track:** Web Development & Designing
**Level:** 2 (4 tasks)
**Internship period:** November 2026
**LinkedIn:** [linkedin.com/in/eyuel-dereje](https://www.linkedin.com/in/eyuel-dereje)

This repository holds all my submissions for the Oasis Infobyte Student Internship Program (OIBSIP).

## Projects

| # | Project | Tech | Status |
|---|---------|------|--------|
| 1 | [Calculator](./WebDev-L2-Task1-Calculator) | HTML, CSS, JavaScript | Done |
| 2 | [Tribute Page](./WebDev-L2-Task2-TributePage) | HTML, CSS | Done |
| 3 | [To-Do App](./WebDev-L2-Task3-TodoApp) | HTML, CSS, JavaScript | Done |
| 4 | [Login System](./WebDev-L2-Task4-LoginSystem) | Node.js, Express, bcrypt, HTML, CSS, JavaScript | Done |

## Task summaries

### 1. Calculator
A browser-based calculator written without `eval()`. It supports chained operations with correct precedence (`5 + 3 × 2 = 11`), decimals, backspace and clear, keyboard input, and a friendly error for division by zero. The button layout uses CSS Grid.

### 2. Tribute Page
A responsive tribute to Cristiano Ronaldo and his 23-year career with Portugal. It has an original biography, a timeline of key moments, a styled quote block, multiple background colours and a serif and sans-serif font pairing. The photo is credited to its photographer under CC BY-SA 4.0.

### 3. To-Do App
A task manager with pending and completed lists. You can add, complete, edit inline and delete tasks, with live counters, empty-state messages, timestamps, and persistence across page refreshes using `localStorage`.

### 4. Login System
A full-stack authentication system built with Node.js and Express. It supports registration, login and a protected dashboard. Passwords must be at least 8 characters with one number, duplicate accounts are blocked, and wrong credentials show one generic error. Passwords are hashed with bcrypt, sessions are kept on the server, and the dashboard redirects to login when opened without a session.

## How to run
**Tasks 1 to 3** are self-contained. Open the project folder and double-click `index.html` in any modern browser. No installs are needed.

**Task 4** needs [Node.js](https://nodejs.org) 18 or newer:
```bash
cd WebDev-L2-Task4-LoginSystem
npm install
npm start
```
Then open http://localhost:3000.

## Repository structure
```
OIBSIP/
├── WebDev-L2-Task1-Calculator/
├── WebDev-L2-Task2-TributePage/
├── WebDev-L2-Task3-TodoApp/
└── WebDev-L2-Task4-LoginSystem/
```

Built as part of the #oasisinfobyte internship.
