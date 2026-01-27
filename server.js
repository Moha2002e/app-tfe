
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'db.json');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Initialisation de la DB si elle n'existe pas
const initDB = async () => {
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.writeFile(DB_PATH, JSON.stringify({ users: [] }));
  }
};

// Endpoints API
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const db = JSON.parse(await fs.readFile(DB_PATH, 'utf-8'));
  const user = db.users.find(u => u.email === email && u.password === password);
  if (user) {
    res.json({ success: true, user: { email: user.email, state: user.state } });
  } else {
    res.status(401).json({ success: false, message: 'Identifiants incorrects' });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  const { email, password } = req.body;
  const db = JSON.parse(await fs.readFile(DB_PATH, 'utf-8'));
  if (db.users.find(u => u.email === email)) {
    return res.status(400).json({ success: false, message: 'Email déjà utilisé' });
  }
  const newUser = { 
    email, 
    password, 
    state: { stressLevel: 3, tasks: [], tfe: { milestones: [], notes: "" }, courses: [] } 
  };
  db.users.push(newUser);
  await fs.writeFile(DB_PATH, JSON.stringify(db));
  res.json({ success: true, user: { email: newUser.email, state: newUser.state } });
});

app.post('/api/sync', async (req, res) => {
  const { email, state } = req.body;
  const db = JSON.parse(await fs.readFile(DB_PATH, 'utf-8'));
  const userIndex = db.users.findIndex(u => u.email === email);
  if (userIndex !== -1) {
    db.users[userIndex].state = state;
    await fs.writeFile(DB_PATH, JSON.stringify(db));
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false });
  }
});

// Servir l'index.html pour toutes les autres routes (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

initDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
