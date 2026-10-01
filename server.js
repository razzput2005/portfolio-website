require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const crypto = require("node:crypto");
const fs = require("node:fs/promises");
const path = require("node:path");

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, "data");
const PROJECTS_FILE = path.join(DATA_DIR, "projects.json");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");
const COOKIE_NAME = "portfolio_admin";
const SESSION_TTL = 8 * 60 * 60 * 1000;

if (!process.env.ADMIN_PASSWORD || !process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
  console.warn("Set ADMIN_PASSWORD and a SESSION_SECRET (32+ chars) in .env before enabling admin login.");
}

app.disable("x-powered-by");
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: false, limit: "10kb" }));

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 8, standardHeaders: "draft-7", legacyHeaders: false });
const contactLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 5, standardHeaders: "draft-7", legacyHeaders: false });

async function readJson(file, fallback) {
  try { return JSON.parse(await fs.readFile(file, "utf8")); }
  catch (error) { if (error.code === "ENOENT") return fallback; throw error; }
}
async function writeJson(file, value) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(file, JSON.stringify(value, null, 2) + "\n", { mode: 0o600 });
}
function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}
function sign(value) {
  return crypto.createHmac("sha256", process.env.SESSION_SECRET || "missing-secret").update(value).digest("base64url");
}
function makeSession(username) {
  const payload = Buffer.from(JSON.stringify({ username, exp: Date.now() + SESSION_TTL })).toString("base64url");
  return payload + "." + sign(payload);
}
function requireAdmin(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token || !process.env.SESSION_SECRET) return res.status(401).json({ error: "Please sign in." });
  const [payload, signature] = token.split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload))) return res.status(401).json({ error: "Session expired. Sign in again." });
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!session.exp || session.exp < Date.now() || session.username !== process.env.ADMIN_USERNAME) return res.status(401).json({ error: "Session expired. Sign in again." });
    req.admin = session;
    next();
  } catch { return res.status(401).json({ error: "Invalid session." }); }
}
// Minimal cookie parser for the single signed admin cookie.
app.use((req, _res, next) => {
  req.cookies = Object.fromEntries((req.headers.cookie || "").split(";").filter(Boolean).map(part => {
    const index = part.indexOf("=");
    return [part.slice(0, index).trim(), decodeURIComponent(part.slice(index + 1).trim())];
  }));
  next();
});

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.get("/api/projects", async (_req, res, next) => {
  try { res.json(await readJson(PROJECTS_FILE, [])); } catch (error) { next(error); }
});
app.post("/api/contact", contactLimiter, async (req, res, next) => {
  try {
    const { name, email, subject, message, website } = req.body || {};
    if (website) return res.status(200).json({ message: "Thanks, your message was received." });
    if (![name, email, subject, message].every(value => typeof value === "string" && value.trim())) return res.status(400).json({ error: "Please complete every field." });
    if (name.length > 100 || email.length > 254 || subject.length > 160 || message.length > 5000 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: "Please check your details and try again." });
    const messages = await readJson(MESSAGES_FILE, []);
    messages.unshift({ id: crypto.randomUUID(), name: name.trim(), email: email.trim(), subject: subject.trim(), message: message.trim(), createdAt: new Date().toISOString(), status: "new" });
    await writeJson(MESSAGES_FILE, messages.slice(0, 500));
    res.status(201).json({ message: "Thank you! Your message has been sent." });
  } catch (error) { next(error); }
});
app.post("/api/admin/login", authLimiter, (req, res) => {
  const { username, password } = req.body || {};
  if (!process.env.ADMIN_PASSWORD || !process.env.SESSION_SECRET || !safeEqual(username || "", process.env.ADMIN_USERNAME || "admin") || !safeEqual(password || "", process.env.ADMIN_PASSWORD)) {
    return res.status(401).json({ error: "Incorrect username or password." });
  }
  res.setHeader("Set-Cookie", COOKIE_NAME + "=" + encodeURIComponent(makeSession(process.env.ADMIN_USERNAME || "admin")) + "; HttpOnly; SameSite=Strict; Path=/; Max-Age=" + Math.floor(SESSION_TTL / 1000) + (process.env.NODE_ENV === "production" ? "; Secure" : ""));
  res.json({ message: "Signed in." });
});
app.post("/api/admin/logout", (_req, res) => {
  res.setHeader("Set-Cookie", COOKIE_NAME + "=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0" + (process.env.NODE_ENV === "production" ? "; Secure" : ""));
  res.json({ message: "Signed out." });
});
app.get("/api/admin/me", requireAdmin, (_req, res) => res.json({ authenticated: true }));
app.get("/api/admin/messages", requireAdmin, async (_req, res, next) => {
  try { res.json(await readJson(MESSAGES_FILE, [])); } catch (error) { next(error); }
});
app.delete("/api/admin/messages/:id", requireAdmin, async (req, res, next) => {
  try {
    const messages = await readJson(MESSAGES_FILE, []);
    await writeJson(MESSAGES_FILE, messages.filter(item => item.id !== req.params.id));
    res.json({ message: "Message deleted." });
  } catch (error) { next(error); }
});
app.post("/api/admin/projects", requireAdmin, async (req, res, next) => {
  try {
    const { title, description, category, badge, technologies, date, image, demo, code } = req.body || {};
    if (![title, description, category, badge].every(v => typeof v === "string" && v.trim()) || !Array.isArray(technologies) || !technologies.length) return res.status(400).json({ error: "Title, description, category, badge, and technologies are required." });
    if ([title, description, category, badge, image, demo, code].some(v => typeof v === "string" && v.length > 1000)) return res.status(400).json({ error: "A field is too long." });
    const projects = await readJson(PROJECTS_FILE, []);
    const project = { id: crypto.randomUUID(), title: title.trim(), description: description.trim(), category: category.trim(), badge: badge.trim(), technologies: technologies.map(v => String(v).trim()).filter(Boolean).slice(0, 10), date: String(date || new Date().getFullYear()), image: String(image || ""), demo: String(demo || "#"), code: String(code || "#") };
    projects.unshift(project);
    await writeJson(PROJECTS_FILE, projects);
    res.status(201).json(project);
  } catch (error) { next(error); }
});
app.delete("/api/admin/projects/:id", requireAdmin, async (req, res, next) => {
  try {
    const projects = await readJson(PROJECTS_FILE, []);
    await writeJson(PROJECTS_FILE, projects.filter(item => item.id !== req.params.id));
    res.json({ message: "Project removed." });
  } catch (error) { next(error); }
});

app.use(express.static(path.join(ROOT, "Portfolio")));
app.get("/admin", (_req, res) => res.sendFile(path.join(ROOT, "Portfolio", "admin.html")));
app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: "Something went wrong. Please try again later." });
});
app.listen(PORT, () => console.log("Portfolio server running at http://localhost:" + PORT));
