# Pavan Chauhan — Full-stack Portfolio

The existing portfolio design is retained, with a Node.js + Express API for projects, contact submissions, and an admin area.

## Run locally
1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env`; set a unique admin password and a random session secret of at least 32 characters.
4. Run `npm run dev`.
5. Open `http://localhost:3000`; admin is at `http://localhost:3000/admin`.

## Features
- `GET /api/projects`: public projects stored in `data/projects.json`.
- `POST /api/contact`: validates and stores messages locally in `data/messages.json`.
- Admin login, add/delete projects, view/delete messages.
- Rate limits for login/contact, Helmet headers, signed HttpOnly session cookie, input limits, and a contact honeypot.

## Deployment
This starter uses JSON files. For ephemeral hosting or multiple instances, migrate to a managed database. Use HTTPS and `NODE_ENV=production` for Secure session cookies. Keep `.env` private. GitHub Pages cannot run Express; deploy the Node app to a Node-capable host.

Contact messages are stored, not emailed automatically. Configure a trusted server-side email provider if notifications are needed.
