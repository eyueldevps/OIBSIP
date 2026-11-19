(() => {
  'use strict';

  const emailEl = document.getElementById('user-email');
  const createdEl = document.getElementById('user-created');

  async function loadUser() {
    const res = await fetch('/api/me');
    if (res.status === 401) { window.location.href = '/login.html'; return; }
    const user = await res.json();
    emailEl.textContent = user.email;
    createdEl.textContent = new Date(user.createdAt).toLocaleDateString([], { dateStyle: 'long' });
  }

  document.getElementById('logout').addEventListener('click', async () => {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/login.html';
  });

  loadUser().catch(() => { emailEl.textContent = 'Could not load your details.'; });
})();
