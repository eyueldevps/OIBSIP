'use strict';

const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');

const PORT = process.env.PORT || 3000;
const SALT_ROUNDS = 10;
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Compared against when an email is unknown, so response time doesn't reveal which emails exist.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', SALT_ROUNDS);

// ---------- Tiny JSON "database" ----------
function readUsers() {
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

function writeUsers(users) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// ---------- Validation ----------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateNewAccount(email, password) {
  if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
    return 'Email and password are required.';
  }
  if (!EMAIL_RE.test(email.trim())) return 'Enter a valid email address.';
  if (password.length < 8) return 'Password must be at least 8 characters.';
  if (!/\d/.test(password)) return 'Password must include at least one number.';
  if (password.length > 72) return 'Password must be 72 characters or fewer.';
  return null;
}

// ---------- App ----------
const app = express();
app.use(express.json({ limit: '10kb' }));

app.use(session({
  name: 'sid',
  secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 1000 // 1 hour
  }
}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.redirect(req.session.userId ? '/dashboard' : '/login.html');
});

// Protected page: only sent to logged-in users
app.get('/dashboard', (req, res) => {
  if (!req.session.userId) return res.redirect('/login.html');
  res.set('Cache-Control', 'no-store');
  res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const problem = validateNewAccount(email, password);
    if (problem) return res.status(400).json({ error: problem });

    const cleanEmail = email.trim().toLowerCase();
    const users = readUsers();
    if (users.some((u) => u.email === cleanEmail)) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    users.push({
      id: crypto.randomUUID(),
      email: cleanEmail,
      passwordHash,
      createdAt: new Date().toISOString()
    });
    writeUsers(users);
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
      return res.status(400).json({ error: 'Enter your email and password.' });
    }

    const user = readUsers().find((u) => u.email === email.trim().toLowerCase());
    const match = await bcrypt.compare(password, user ? user.passwordHash : DUMMY_HASH);

    // One message for both cases: never reveal which field was wrong
    if (!user || !match) return res.status(401).json({ error: 'Incorrect email or password.' });

    req.session.regenerate((err) => {
      if (err) return res.status(500).json({ error: 'Something went wrong. Please try again.' });
      req.session.userId = user.id;
      req.session.save(() => res.json({ ok: true }));
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('sid');
    res.json({ ok: true });
  });
});

app.get('/api/me', (req, res) => {
  const user = req.session.userId && readUsers().find((u) => u.id === req.session.userId);
  if (!user) return res.status(401).json({ error: 'Not logged in.' });
  res.set('Cache-Control', 'no-store');
  res.json({ email: user.email, createdAt: user.createdAt });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
