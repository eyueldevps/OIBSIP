// To-Do App: vanilla JS, state kept in an array and saved to localStorage.
(() => {
  'use strict';

  const STORAGE_KEY = 'oibsip-todo-tasks';

  const form = document.getElementById('task-form');
  const input = document.getElementById('task-input');
  const errorEl = document.getElementById('form-error');
  const pendingList = document.getElementById('pending-list');
  const completedList = document.getElementById('completed-list');
  const pendingCount = document.getElementById('pending-count');
  const completedCount = document.getElementById('completed-count');

  let tasks = loadTasks();
  let editingId = null;

  // ---------- Storage ----------
  function loadTasks() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      /* storage unavailable: the app still works for this session */
    }
  }

  // ---------- Helpers ----------
  const formatTime = (ts) =>
    new Date(ts).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });

  const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  function makeButton(label, action, extraClass = '') {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `btn ${extraClass}`.trim();
    b.dataset.action = action;
    b.textContent = label;
    return b;
  }

  // ---------- Rendering ----------
  function createItem(task) {
    const li = document.createElement('li');
    li.className = 'task' + (task.done ? ' task--done' : '');
    li.dataset.id = task.id;

    const check = document.createElement('input');
    check.type = 'checkbox';
    check.className = 'task__check';
    check.checked = task.done;
    check.dataset.action = 'toggle';
    check.setAttribute('aria-label', `${task.done ? 'Mark as pending' : 'Mark complete'}: ${task.text}`);

    const body = document.createElement('div');
    if (editingId === task.id) {
      const edit = document.createElement('input');
      edit.type = 'text';
      edit.className = 'task__edit';
      edit.value = task.text;
      edit.maxLength = 120;
      edit.dataset.role = 'edit-input';
      edit.setAttribute('aria-label', 'Edit task text');
      body.append(edit);
    } else {
      const text = document.createElement('span');
      text.className = 'task__text';
      text.textContent = task.text;
      body.append(text);
    }

    const meta = document.createElement('small');
    meta.className = 'task__meta';
    meta.textContent = `Added ${formatTime(task.createdAt)}` +
      (task.done && task.completedAt ? `. Completed ${formatTime(task.completedAt)}` : '');
    body.append(meta);

    const actions = document.createElement('div');
    actions.className = 'task__actions';
    if (editingId === task.id) {
      actions.append(makeButton('Save', 'save'), makeButton('Cancel', 'cancel'));
    } else {
      actions.append(makeButton('Edit', 'edit'), makeButton('Delete', 'delete', 'btn--danger'));
    }

    li.append(check, body, actions);
    return li;
  }

  function fillList(list, items, emptyMessage) {
    list.replaceChildren();
    if (items.length === 0) {
      const empty = document.createElement('li');
      empty.className = 'empty';
      empty.textContent = emptyMessage;
      list.append(empty);
      return;
    }
    items.forEach((task) => list.append(createItem(task)));
  }

  function render() {
    const pending = tasks.filter((t) => !t.done);
    const completed = tasks
      .filter((t) => t.done)
      .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));

    pendingCount.textContent = `${pending.length} pending`;
    completedCount.textContent = `${completed.length} completed`;

    fillList(pendingList, pending, 'Nothing pending. Add a task above to get started.');
    fillList(completedList, completed, 'No completed tasks yet. Finish one and it will show up here.');

    if (editingId) {
      const editField = document.querySelector('[data-role="edit-input"]');
      if (editField) { editField.focus(); editField.select(); }
    }
  }

  function commit() {
    saveTasks();
    render();
  }

  // ---------- Actions ----------
  function addTask(text) {
    tasks.unshift({ id: newId(), text, done: false, createdAt: Date.now(), completedAt: null });
    commit();
  }

  function toggleTask(id) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    task.done = !task.done;
    task.completedAt = task.done ? Date.now() : null;
    if (editingId === id) editingId = null;
    commit();
  }

  function deleteTask(id) {
    tasks = tasks.filter((t) => t.id !== id);
    if (editingId === id) editingId = null;
    commit();
  }

  function saveEdit(id, li) {
    const field = li.querySelector('[data-role="edit-input"]');
    const text = field ? field.value.trim() : '';
    if (!text) { field.focus(); return; }      // keep editing until there is text
    const task = tasks.find((t) => t.id === id);
    if (task) task.text = text;
    editingId = null;
    commit();
  }

  // ---------- Events ----------
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) {
      errorEl.textContent = 'Type a task before adding it.';
      input.focus();
      return;
    }
    errorEl.textContent = '';
    addTask(text);
    input.value = '';
    input.focus();
  });

  input.addEventListener('input', () => { errorEl.textContent = ''; });

  [pendingList, completedList].forEach((list) => {
    list.addEventListener('click', (e) => {
      const target = e.target.closest('button[data-action]');
      const li = e.target.closest('.task');
      if (!target || !li) return;
      const id = li.dataset.id;
      switch (target.dataset.action) {
        case 'edit':   editingId = id; render(); break;
        case 'cancel': editingId = null; render(); break;
        case 'save':   saveEdit(id, li); break;
        case 'delete': deleteTask(id); break;
      }
    });

    list.addEventListener('change', (e) => {
      if (e.target.dataset.action !== 'toggle') return;
      toggleTask(e.target.closest('.task').dataset.id);
    });

    list.addEventListener('keydown', (e) => {
      if (e.target.dataset.role !== 'edit-input') return;
      const li = e.target.closest('.task');
      if (e.key === 'Enter') { e.preventDefault(); saveEdit(li.dataset.id, li); }
      if (e.key === 'Escape') { editingId = null; render(); }
    });
  });

  render();
})();
