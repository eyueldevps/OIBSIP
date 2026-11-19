# Login Authentication System

**Oasis Infobyte Web Development & Designing Internship: Level 2, Task 4**

A full-stack authentication system built with Node.js and Express. Users can register, log in, see a protected dashboard and log out. Passwords are hashed with bcrypt and sessions are kept on the server.

## Tech stack
- Node.js and Express
- `express-session` for server-side sessions (HTTP-only cookie)
- `bcryptjs` for password hashing (the bcrypt algorithm, pure JavaScript, no native build step)
- A JSON file (`data/users.json`) as a simple user store
- HTML, CSS and vanilla JavaScript on the front end

## Features
- Registration with email and password
- Password rules: at least 8 characters and at least 1 number (checked in the browser and again on the server)
- Duplicate email check with a clear error
- Login with a single generic error ("Incorrect email or password.") so it never reveals which field was wrong
- Protected `/dashboard`: visiting it without a session redirects to the login page
- Logout button that destroys the session and returns to login
- Passwords are never stored in plain text, only as bcrypt hashes
- Empty form submissions are blocked on both pages

## Run it
You need Node.js 18 or newer.

```bash
npm install
npm start
```

Then open http://localhost:3000.

## Try it
1. Register at `/register.html` with a password such as `testing123`.
2. Log in, and you land on the dashboard.
3. Log out, then try opening `http://localhost:3000/dashboard` directly. You are sent back to the login page.

## Project structure
```
WebDev-L2-Task4-LoginSystem/
├── server.js          Express app, routes, validation, sessions
├── package.json
├── public/            Pages and scripts served to everyone
│   ├── login.html
│   ├── register.html
│   ├── auth.js
│   ├── dashboard.js
│   └── style.css
└── views/
    └── dashboard.html Only sent to logged-in users
```

## Security notes
- Hashing: bcrypt with a per-password salt (cost 10).
- Login compares against a dummy hash when the email is unknown, so timing doesn't reveal which emails exist.
- Session ID is regenerated on login, and the cookie is `HttpOnly` and `SameSite=Lax`.
- Set `SESSION_SECRET` (and `NODE_ENV=production` behind HTTPS) when deploying. Without it a random secret is created at each start, so sessions reset when the server restarts.
- Sessions use the default in-memory store and the user store is a JSON file. That's fine for a learning project. A production app would use a real database and a persistent session store, plus rate limiting on login.

## Screenshots
Add `screenshot.png` here before submitting.
