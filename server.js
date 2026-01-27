
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'db.json');
const DIST_PATH = path.join(__dirname, 'dist');

const app = express();
app.use(cors());
app.use(express.json());

// Initialisation de la DB
const initDB = async () => {
  try {
    if (!existsSync(DB_PATH)) {
      console.log('Database file not found, creating a new one...');
      await fs.writeFile(DB_PATH, JSON.stringify({ users: [] }, null, 2));
    } else {
      console.log('Database file loaded.');
    }
  } catch (err) {
    console.error('Failed to init DB:', err);
  }
};

// Endpoints API
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = JSON.parse(await fs.readFile(DB_PATH, 'utf-8'));
    const user = db.users.find(u => u.email === email && u.password === password);
    if (user) {
      res.json({ success: true, user: { email: user.email, state: user.state } });
    } else {
      res.status(401).json({ success: false, message: 'Identifiants incorrects' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = JSON.parse(await fs.readFile(DB_PATH, 'utf-8'));
    if (db.users.find(u => u.email === email)) {
      return res.status(400).json({ success: false, message: 'Email déjà utilisé' });
    }
    const newUser = { 
      email, 
      password, 
      state: { stressLevel: 3, tasks: [], tfe: { title: "", subject: "", milestones: [], notes: "" }, courses: [] } 
    };
    db.users.push(newUser);
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
    res.json({ success: true, user: { email: newUser.email, state: newUser.state } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur lors de l\'inscription' });
  }
});

app.post('/api/sync', async (req, res) => {
  try {
    const { email, state } = req.body;
    const db = JSON.parse(await fs.readFile(DB_PATH, 'utf-8'));
    const userIndex = db.users.findIndex(u => u.email === email);
    if (userIndex !== -1) {
      db.users[userIndex].state = state;
      await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false });
    }
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// Servir les fichiers statiques de Vite (après le build)
if (existsSync(DIST_PATH)) {
  app.use(express.static(DIST_PATH));
  app.get('*', (req, res) => {
    res.sendFile(path.join(DIST_PATH, 'index.html'));
  });
} else {
  console.warn('WARNING: "dist" folder not found. Please run "npm run build" first.');
  app.get('*', (req, res) => {
    res.status(404).send('Application not built. Please run npm run build.');
  });
}

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`>>> ZenStudent is running on port ${PORT}`);
    console.log(`>>> Working directory: ${__dirname}`);
  });
});
