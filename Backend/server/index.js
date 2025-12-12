import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { initDb, all, get, run } from "./db.js";

dotenv.config();
initDb();

const app = express();

// IMPORTANTE: CORS y JSON deben estar ANTES de las rutas
app.use(cors());
app.use(express.json()); // ← Asegúrate que esté aquí

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "change-me";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@org.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";


function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

function authAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing token" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded?.isAdmin) return res.status(403).json({ error: "Forbidden" });
    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// --- HEALTH
app.get("/api/health", (req, res) => res.json({ ok: true }));

// --- PUBLIC: LIST AVAILABLE
app.get("/api/pets", async (req, res) => {
  const status = req.query.status || "AVAILABLE";
  if (status !== "AVAILABLE") {
    // público: solo available
    return res.json([]);
  }
  const pets = await all(
    `SELECT id, name, description, status, photos_json, created_at FROM pets WHERE status='AVAILABLE' ORDER BY id DESC`
  );
  const mapped = pets.map(p => ({ ...p, photos: JSON.parse(p.photos_json) }));
  res.json(mapped);
});

// --- PUBLIC: PET DETAIL (si NO está available, no se muestra detalle)
app.get("/api/pets/:id", async (req, res) => {
  const id = Number(req.params.id);
  const pet = await get(`SELECT * FROM pets WHERE id=?`, [id]);
  if (!pet) return res.status(404).json({ error: "Not found" });
  if (pet.status !== "AVAILABLE") return res.status(404).json({ error: "Not found" });

  res.json({ ...pet, photos: JSON.parse(pet.photos_json) });
});

// --- PUBLIC: RESERVE
app.post("/api/pets/:id/reserve", async (req, res) => {
  const id = Number(req.params.id);
  const pet = await get(`SELECT * FROM pets WHERE id=?`, [id]);
  if (!pet) return res.status(404).json({ error: "Pet not found" });
  if (pet.status !== "AVAILABLE") return res.status(400).json({ error: "Pet not available" });

  const {
    email,
    fullName,
    phone,
    homeType,
    hasYard,
    notes = ""
  } = req.body || {};

  if (!email || !fullName || !phone || !homeType || typeof hasYard !== "boolean") {
    return res.status(400).json({ error: "Missing required fields" });
  }

  await run(
    `INSERT INTO adoption_requests (pet_id, email, full_name, phone, home_type, has_yard, notes, status)
     VALUES (?,?,?,?,?,?,?, 'PENDING')`,
    [id, email.trim(), fullName.trim(), phone.trim(), homeType.trim(), hasYard ? 1 : 0, String(notes)]
  );

  await run(`UPDATE pets SET status='RESERVED' WHERE id=?`, [id]);

  res.json({ ok: true, message: "Reservation created. Admin will contact you." });
});

// --- ADMIN: LOGIN
app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "Missing credentials" });

  // Para simplicidad: usuario admin fijo desde .env
  if (String(email).trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Hash virtual (para no guardar en DB). Comparación directa simple:
  // Si quieres más “formal”: guarda hash en env. Aquí: directo.
  if (String(password) !== String(ADMIN_PASSWORD)) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = signToken({ isAdmin: true, email: ADMIN_EMAIL });
  res.json({ token });
});

// --- ADMIN: LIST ALL PETS
app.get("/api/admin/pets", authAdmin, async (req, res) => {
  const pets = await all(`SELECT * FROM pets ORDER BY id DESC`);
  res.json(pets.map(p => ({ ...p, photos: JSON.parse(p.photos_json) })));
});

// --- ADMIN: CREATE PET
app.post("/api/admin/pets", authAdmin, async (req, res) => {
  console.log('Request body received:', req.body); // Debug
  
  const { name, description, status = "AVAILABLE", photos = [] } = req.body || {};
  
  // Validación de campos requeridos
  if (!name || !description) {
    return res.status(400).json({ 
      error: "Missing required fields: name and description are required" 
    });
  }
  
  if (!["AVAILABLE", "RESERVED", "ADOPTED"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }
  
  if (!Array.isArray(photos)) {
    return res.status(400).json({ error: "photos must be array" });
  }

  const photos_json = JSON.stringify(photos.map(String));
  
  try {
    const r = await run(
      `INSERT INTO pets (name, description, status, photos_json) VALUES (?,?,?,?)`,
      [name.trim(), description.trim(), status, photos_json]
    );
    
    const pet = await get(`SELECT * FROM pets WHERE id=?`, [r.lastID]);
    res.json({ ...pet, photos: JSON.parse(pet.photos_json) });
  } catch (error) {
    console.error('Error creating pet:', error);
    res.status(500).json({ error: "Database error" });
  }
});

// --- ADMIN: DELETE PET
app.delete("/api/admin/pets/:id", authAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const pet = await get(`SELECT * FROM pets WHERE id=?`, [id]);
  if (!pet) return res.status(404).json({ error: "Not found" });

  await run(`DELETE FROM pets WHERE id=?`, [id]);
  // Limpieza simple (opcional): requests y adoptions quedan huérfanas si existieran.
  res.json({ ok: true });
});

// --- ADMIN: UPDATE PET STATUS
app.patch("/api/admin/pets/:id", authAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body || {};
  if (!["AVAILABLE", "RESERVED", "ADOPTED"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }
  await run(`UPDATE pets SET status=? WHERE id=?`, [status, id]);
  const pet = await get(`SELECT * FROM pets WHERE id=?`, [id]);
  if (!pet) return res.status(404).json({ error: "Not found" });
  res.json({ ...pet, photos: JSON.parse(pet.photos_json) });
});

// --- ADMIN: LIST REQUESTS
app.get("/api/admin/requests", authAdmin, async (req, res) => {
  const status = req.query.status;
  const where = status ? `WHERE r.status=?` : "";
  const params = status ? [status] : [];
  const rows = await all(
    `
    SELECT r.*, p.name as pet_name
    FROM adoption_requests r
    JOIN pets p ON p.id = r.pet_id
    ${where}
    ORDER BY r.id DESC
    `,
    params
  );
  res.json(rows);
});

// --- ADMIN: APPROVE REQUEST => ADOPTED + create adoption
app.post("/api/admin/requests/:id/approve", authAdmin, async (req, res) => {
  const requestId = Number(req.params.id);
  const reqRow = await get(`SELECT * FROM adoption_requests WHERE id=?`, [requestId]);
  if (!reqRow) return res.status(404).json({ error: "Request not found" });
  if (reqRow.status !== "PENDING") return res.status(400).json({ error: "Not pending" });

  await run(`UPDATE adoption_requests SET status='APPROVED' WHERE id=?`, [requestId]);
  await run(`UPDATE pets SET status='ADOPTED' WHERE id=?`, [reqRow.pet_id]);

  const r = await run(
    `INSERT INTO adoptions (pet_id, request_id, adopter_email, adopter_name, adopter_phone)
     VALUES (?,?,?,?,?)`,
    [reqRow.pet_id, requestId, reqRow.email, reqRow.full_name, reqRow.phone]
  );

  res.json({ ok: true, adoptionId: r.lastID });
});

// --- ADMIN: REJECT REQUEST => pet back to AVAILABLE (si estaba RESERVED)
app.post("/api/admin/requests/:id/reject", authAdmin, async (req, res) => {
  const requestId = Number(req.params.id);
  const reqRow = await get(`SELECT * FROM adoption_requests WHERE id=?`, [requestId]);
  if (!reqRow) return res.status(404).json({ error: "Request not found" });
  if (reqRow.status !== "PENDING") return res.status(400).json({ error: "Not pending" });

  await run(`UPDATE adoption_requests SET status='REJECTED' WHERE id=?`, [requestId]);

  // Simplificación: libera mascota
  await run(`UPDATE pets SET status='AVAILABLE' WHERE id=?`, [reqRow.pet_id]);

  res.json({ ok: true });
});

// --- ADMIN: LIST ADOPTIONS
app.get("/api/admin/adoptions", authAdmin, async (req, res) => {
  const rows = await all(`
    SELECT a.*, p.name as pet_name
    FROM adoptions a
    JOIN pets p ON p.id = a.pet_id
    ORDER BY a.id DESC
  `);
  res.json(rows);
});

// --- ADMIN: FOLLOWUPS
app.get("/api/admin/adoptions/:id/followups", authAdmin, async (req, res) => {
  const adoptionId = Number(req.params.id);
  const rows = await all(
    `SELECT * FROM followups WHERE adoption_id=? ORDER BY id DESC`,
    [adoptionId]
  );
  res.json(rows);
});

app.post("/api/admin/adoptions/:id/followups", authAdmin, async (req, res) => {
  const adoptionId = Number(req.params.id);
  const { notes } = req.body || {};
  if (!notes) return res.status(400).json({ error: "Missing notes" });

  const adoption = await get(`SELECT * FROM adoptions WHERE id=?`, [adoptionId]);
  if (!adoption) return res.status(404).json({ error: "Adoption not found" });

  const r = await run(
    `INSERT INTO followups (adoption_id, notes) VALUES (?,?)`,
    [adoptionId, String(notes)]
  );
  const row = await get(`SELECT * FROM followups WHERE id=?`, [r.lastID]);
  res.json(row);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
