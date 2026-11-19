// Shared by the login and register pages.
(() => {
  'use strict';

  const form = document.getElementById('auth-form');
  const message = document.getElementById('message');
  const mode = form.dataset.mode; // "login" or "register"

  function show(text, type = 'error') {
    message.textContent = text;
    message.className = `message message--${type}`;
  }

  function checkNewPassword(password) {
    if (password.length < 8) return 'Password must be at least 8 characters.';
    if (!/\d/.test(password)) return 'Password must include at least one number.';
    return null;
  }

  async function send(url, body) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    let data = {};
    try { data = await res.json(); } catch { /* non-JSON response */ }
    return { ok: res.ok, data };
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = form.querySelector('#email').value.trim();
    const password = form.querySelector('#password').value;

    if (!email || !password) return show('Enter your email and password.');
    if (mode === 'register') {
      const problem = checkNewPassword(password);
      if (problem) return show(problem);
    }

    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    try {
      const { ok, data } = await send(`/api/${mode}`, { email, password });
      if (!ok) return show(data.error || 'Something went wrong. Please try again.');
      window.location.href = mode === 'login' ? '/dashboard' : '/login.html?registered=1';
    } catch {
      show('Cannot reach the server. Is it running?');
    } finally {
      button.disabled = false;
    }
  });

  if (mode === 'login' && new URLSearchParams(window.location.search).has('registered')) {
    show('Account created. Log in below.', 'success');
  }
})();
