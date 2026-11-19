// Calculator logic - no eval(). Expression is stored as tokens and
// evaluated with standard operator precedence (× and ÷ before + and −).
(() => {
  'use strict';

  const MAX_DIGITS = 15;
  const exprEl = document.getElementById('expression');
  const resultEl = document.getElementById('result');

  let tokens = [];          // e.g. [5, '+', 3, '×']
  let current = '';         // number currently being typed
  let justEvaluated = false;
  let lastExpression = '';
  let errorMessage = '';

  const isOperator = (t) => typeof t === 'string';
  const show = (t) => (isOperator(t) ? t : String(t));

  function resetState() {
    tokens = [];
    current = '';
    justEvaluated = false;
    lastExpression = '';
    errorMessage = '';
  }

  function startFresh() {
    if (errorMessage || justEvaluated) resetState();
  }

  function inputDigit(d) {
    startFresh();
    if (current.replace('.', '').length >= MAX_DIGITS) return;
    if (current === '0') {
      if (d === '0') return;
      current = d;
    } else {
      current += d;
    }
  }

  function inputDecimal() {
    startFresh();
    if (current.includes('.')) return;
    current = current === '' ? '0.' : current + '.';
  }

  function inputOperator(op) {
    if (errorMessage) return;
    if (current !== '') {
      tokens.push(parseFloat(current), op);
      current = '';
    } else if (tokens.length === 0) {
      return;                                   // nothing to operate on
    } else if (isOperator(tokens[tokens.length - 1])) {
      tokens[tokens.length - 1] = op;           // swap operator
    } else {
      tokens.push(op);                          // chain from previous result
    }
    justEvaluated = false;
  }

  function evaluate(list) {
    // Pass 1: × and ÷
    const reduced = [list[0]];
    for (let i = 1; i < list.length; i += 2) {
      const op = list[i];
      const next = list[i + 1];
      if (op === '×') {
        reduced[reduced.length - 1] *= next;
      } else if (op === '÷') {
        if (next === 0) return null;
        reduced[reduced.length - 1] /= next;
      } else {
        reduced.push(op, next);
      }
    }
    // Pass 2: + and −
    let total = reduced[0];
    for (let i = 1; i < reduced.length; i += 2) {
      total = reduced[i] === '+' ? total + reduced[i + 1] : total - reduced[i + 1];
    }
    return parseFloat(total.toPrecision(12));   // trims 0.1 + 0.2 float noise
  }

  function calculate() {
    if (errorMessage) return;
    const list = [...tokens];
    if (current !== '') list.push(parseFloat(current));
    if (list.length && isOperator(list[list.length - 1])) list.pop();
    if (list.length < 3) return;                // need at least "a op b"

    const result = evaluate(list);
    if (result === null) {
      resetState();
      errorMessage = 'Cannot divide by zero';
      return;
    }
    lastExpression = list.map(show).join(' ') + ' =';
    tokens = [result];
    current = '';
    justEvaluated = true;
  }

  function backspace() {
    if (errorMessage || justEvaluated) { resetState(); return; }
    if (current !== '') {
      current = current.slice(0, -1);
    } else if (tokens.length && isOperator(tokens[tokens.length - 1])) {
      tokens.pop();
      current = String(tokens.pop());           // reopen the previous number
    }
  }

  function render() {
    let expression = tokens.map(show).join(' ');
    if (current !== '') expression += (expression ? ' ' : '') + current;
    exprEl.textContent = justEvaluated ? lastExpression : expression;

    let main;
    if (errorMessage) {
      main = errorMessage;
    } else if (current !== '') {
      main = current;
    } else if (tokens.length === 0) {
      main = '0';
    } else {
      const last = tokens[tokens.length - 1];
      main = show(isOperator(last) ? tokens[tokens.length - 2] : last);
    }
    resultEl.textContent = main;
    resultEl.classList.toggle('is-error', Boolean(errorMessage));
    resultEl.classList.toggle('is-long', !errorMessage && main.length > 10);
  }

  function handle(action, value) {
    switch (action) {
      case 'digit':     inputDigit(value); break;
      case 'decimal':   inputDecimal(); break;
      case 'operator':  inputOperator(value); break;
      case 'equals':    calculate(); break;
      case 'clear':     resetState(); break;
      case 'backspace': backspace(); break;
    }
    render();
  }

  // Event listeners on every button (no inline onclick)
  document.querySelectorAll('.key').forEach((button) => {
    button.addEventListener('click', () => {
      handle(button.dataset.action, button.dataset.value);
    });
  });

  // Keyboard support
  const OP_KEYS = { '+': '+', '-': '−', '*': '×', '/': '÷' };
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (/^[0-9]$/.test(e.key)) handle('digit', e.key);
    else if (e.key === '.') handle('decimal');
    else if (OP_KEYS[e.key]) { e.preventDefault(); handle('operator', OP_KEYS[e.key]); }
    else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); handle('equals'); }
    else if (e.key === 'Backspace') handle('backspace');
    else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') handle('clear');
  });

  render();
})();
