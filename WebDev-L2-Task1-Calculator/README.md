# Calculator

**Oasis Infobyte Web Development & Designing Internship — Level 2, Task 1**

A browser-based calculator built with HTML5, CSS3 and vanilla JavaScript. No libraries and no `eval()`; the maths is handled by a small tokenizer and evaluator.

## Features
- Display with a live expression line and a result line
- Digits 0–9 and a decimal point (one per number)
- Add, subtract, multiply and divide
- Equals, Clear (C) and Backspace (⌫)
- Division by zero shows "Cannot divide by zero" instead of crashing
- Operator chaining: `5 + 3 × 2` evaluates to `11` (multiplication and division run before addition and subtraction), and you can keep operating on a result
- Floating-point clean-up (`0.1 + 0.2` shows `0.3`)
- Keyboard support: digits, `+ - * /`, `Enter`, `Backspace`, `Esc`
- CSS Grid button layout; event listeners on every button (no inline `onclick`)
- Responsive, with visible keyboard focus

## Run it
Open `index.html` in any modern browser.

## Files
| File | Purpose |
| --- | --- |
| `index.html` | Markup and button layout |
| `style.css` | Styling and CSS Grid |
| `script.js` | State, expression evaluation, event handling |

## How it works
Input is kept as a token list (`[5, '+', 3, '×', 2]`). Pressing `=` evaluates it in two passes: first `×` and `÷`, then `+` and `−`. Dividing by zero is caught in the first pass and surfaced as an error message.

## Screenshots
Add screenshots here before submitting (e.g. `screenshot.png`).
