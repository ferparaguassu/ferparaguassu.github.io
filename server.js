const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'data', 'db.json');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'fernando2026';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ---- Simple JSON-file "database" with basic write-lock to avoid race conditions ----
let writeQueue = Promise.resolve();

function readDB() {
  if (!fs.existsSync(DB_FILE)) {
    const initial = { gifts: defaultGifts(), selections: [] };
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
    return initial;
  }
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}

function writeDB(data) {
  writeQueue = writeQueue.then(() => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  });
  return writeQueue;
}

function defaultGifts() {
  return [
    { id:1, name:"Copos de Vidro Americano", description:"Jogo de Copos Amazon Nadir", category:"Cozinha" },
    { id:2, name:"Pote de Vidro Marinex", description:"Marinex 500 ml", category:"Cozinha" },
    { id:3, name:"Pano de Prato", description:"Kit de panos de prato", category:"Cozinha" },
    { id:4, name:"Jogo de Colheres de Silicone", description:"2 colheres de silicone", category:"Cozinha" },
    { id:5, name:"Abridor de Latas e Garrafas", description:"Abridor Inox 3 em 1", category:"Cozinha" },
    { id:6, name:"Ralador", description:"Inox 4 faces multiuso", category:"Cozinha" },
    { id:7, name:"Travessa de Vidro Marinex", description:"Refrataria retangular 2L", category:"Cozinha" },
    { id:8, name:"Forma para Bolo Pequena", description:"Forma retangular pequena", category:"Cozinha" },
    { id:9, name:"Assadeira de Vidro", description:"Refrataria vai ao forno", category:"Cozinha" },
    { id:10, name:"Medidor Culinario", description:"Medidor culinario de vidro", category:"Cozinha" },
    { id:11, name:"Porta-Temperos", description:"Conjunto com 5 potes e suporte", category:"Cozinha" },
    { id:12, name:"Espatulas", description:"Silicone antiaderente, 3 pecas", category:"Cozinha" },
    { id:13, name:"Luvas T\u00e9rmicas", description:"Silicone para forno, kit 2 pe\u00e7as", category:"Cozinha" },
    { id:14, name:"Descanso de Panela", description:"Silicone antiderrapante, kit 4 unidades", category:"Cozinha" },
    { id:15, name:"Porta Frios", description:"Porta Frios duplo de vidro", category:"Cozinha" },
    { id:16, name:"Tapete para Banheiro", description:"Antiderrapante, conjunto 3 pe\u00e7as", category:"Banheiro" },
    { id:17, name:"Lixeira para Banheiro", description:"Inox com pedal 3L", category:"Banheiro" },
    { id:18, name:"Saboneteira", description:"Design moderno com drenagem", category:"Banheiro" },
    { id:19, name:"Porta-Escovas de Dente", description:"Suporte duplo organizador", category:"Banheiro" },
    { id:20, name:"Cesto para Roupas", description:"Cesto de plastico ou bambu 40L", category:"Banheiro" },
    { id:21, name:"Kit de Banheiro", description:"A\u00e7o inox, conjunto completo", category:"Banheiro" },
    { id:22, name:"Difusor de Aromas", description:"Com varetas 300ml", category:"Decora\u00e7\u00e3o" },
    { id:23, name:"Porta-Papel Higi\u00eanico", description:"Suporte a\u00e7o inox adesivo", category:"Banheiro" },
  ];
}

// ---- API routes ----

// Get all gifts plus which ones are claimed
app.get('/api/gifts', (req, res) => {
  const db = readDB();
  const claimedIds = new Set(db.selections.map(s => s.giftId));
  const gifts = db.gifts.map(g => ({ ...g, claimed: claimedIds.has(g.id) }));
  res.json(gifts);
});

// Guest login: check if this email already has a selection
app.post('/api/login', (req, res) => {
  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Email invalido' });
  }
  const db = readDB();
  const existing = db.selections.find(s => s.guestEmail.toLowerCase() === email.toLowerCase());
  res.json({ existingSelection: existing || null });
});

// Claim a gift
app.post('/api/select', async (req, res) => {
  const { giftId, guestName, guestEmail } = req.body;

  if (!giftId || !guestName || !guestEmail) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) {
    return res.status(400).json({ error: 'Email invalido' });
  }

  const db = readDB();

  const alreadySelected = db.selections.find(
    s => s.guestEmail.toLowerCase() === guestEmail.toLowerCase()
  );
  if (alreadySelected) {
    return res.status(409).json({ error: 'Voce ja selecionou um presente', selection: alreadySelected });
  }

  const giftTaken = db.selections.find(s => s.giftId === giftId);
  if (giftTaken) {
    return res.status(409).json({ error: 'Este presente ja foi selecionado por outro convidado' });
  }

  const gift = db.gifts.find(g => g.id === giftId);
  if (!gift) {
    return res.status(404).json({ error: 'Presente nao encontrado' });
  }

  const selection = {
    id: Date.now(),
    giftId: gift.id,
    giftName: gift.name,
    guestName,
    guestEmail,
    date: new Date().toLocaleDateString('pt-BR'),
    imageUrl: gift.imageUrl
  };

  db.selections.push(selection);
  await writeDB(db);

  res.json({ selection });
});

// ---- Admin routes (simple password check via header) ----

function requireAdmin(req, res, next) {
  const password = req.headers['x-admin-password'];
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Senha incorreta' });
  }
  next();
}

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Senha incorreta' });
  }
  res.json({ ok: true });
});

app.get('/api/admin/selections', requireAdmin, (req, res) => {
  const db = readDB();
  res.json(db.selections);
});

app.delete('/api/admin/selections/:id', requireAdmin, async (req, res) => {
  const db = readDB();
  const id = Number(req.params.id);
  db.selections = db.selections.filter(s => s.id !== id);
  await writeDB(db);
  res.json({ ok: true });
});

app.post('/api/admin/gifts', requireAdmin, async (req, res) => {
  const { name, description, category, imageUrl } = req.body;
  if (!name) return res.status(400).json({ error: 'Nome obrigatorio' });

  const db = readDB();
  const newGift = {
    id: Math.max(0, ...db.gifts.map(g => g.id)) + 1,
    name,
    description: description || '',
    category: category || '',
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=400&h=400&fit=crop'
  };
  db.gifts.push(newGift);
  await writeDB(db);
  res.json(newGift);
});

app.delete('/api/admin/gifts/:id', requireAdmin, async (req, res) => {
  const db = readDB();
  const id = Number(req.params.id);
  const hasSelection = db.selections.some(s => s.giftId === id);
  if (hasSelection) {
    return res.status(409).json({ error: 'Presente ja selecionado, nao pode ser deletado' });
  }
  db.gifts = db.gifts.filter(g => g.id !== id);
  await writeDB(db);
  res.json({ ok: true });
});

// Fallback to index.html for any non-API route (single page app)
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Not found' });
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
