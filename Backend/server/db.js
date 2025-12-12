import sqlite3 from "sqlite3";

export const db = new sqlite3.Database("./pets.db");

export function initDb() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS pets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        status TEXT NOT NULL CHECK(status IN ('AVAILABLE','RESERVED','ADOPTED')),
        photos_json TEXT NOT NULL DEFAULT '[]',
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS adoption_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pet_id INTEGER NOT NULL,
        email TEXT NOT NULL,
        full_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        home_type TEXT NOT NULL,
        has_yard INTEGER NOT NULL CHECK(has_yard IN (0,1)),
        notes TEXT NOT NULL DEFAULT '',
        status TEXT NOT NULL CHECK(status IN ('PENDING','APPROVED','REJECTED','CANCELLED')) DEFAULT 'PENDING',
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY(pet_id) REFERENCES pets(id)
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS adoptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pet_id INTEGER NOT NULL,
        request_id INTEGER NOT NULL,
        adopter_email TEXT NOT NULL,
        adopter_name TEXT NOT NULL,
        adopter_phone TEXT NOT NULL,
        adoption_date TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY(pet_id) REFERENCES pets(id),
        FOREIGN KEY(request_id) REFERENCES adoption_requests(id)
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS followups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        adoption_id INTEGER NOT NULL,
        notes TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY(adoption_id) REFERENCES adoptions(id)
      );
    `);

    // Seed: si no hay mascotas, crea 2 de ejemplo
    db.get(`SELECT COUNT(*) as c FROM pets`, (err, row) => {
      if (err) return;
      if (row.c === 0) {
        const sample1 = JSON.stringify([
          "https://images.unsplash.com/photo-1548199973-03cce0bbc87b",
          "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8"
        ]);
        const sample2 = JSON.stringify([
          "https://images.unsplash.com/photo-1518791841217-8f162f1e1131",
          "https://images.unsplash.com/photo-1511044568932-338cba0ad803"
        ]);
        db.run(
          `INSERT INTO pets (name, description, status, photos_json) VALUES (?,?,?,?)`,
          ["Luna", "Cariñosa y tranquila. Le encanta dormir cerca de personas.", "AVAILABLE", sample1]
        );
        db.run(
          `INSERT INTO pets (name, description, status, photos_json) VALUES (?,?,?,?)`,
          ["Max", "Juguetón y sociable. Ideal para hogar con espacio.", "AVAILABLE", sample2]
        );
      }
    });
  });
}

export function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

export function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

export function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}
