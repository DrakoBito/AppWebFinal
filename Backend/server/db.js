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
            const sample3 = JSON.stringify([
            "https://images.unsplash.com/photo-1507146426996-ef05306b995a",
            "https://images.unsplash.com/photo-1525253086316-d0c936c814f8"
            ]);
            const sample4 = JSON.stringify([
            "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6",
            "https://images.unsplash.com/photo-1517849845537-4d257902454a"
            ]);
            const sample5 = JSON.stringify([
            "https://images.unsplash.com/photo-1543852786-1cf6624b9987",
            "https://images.unsplash.com/photo-1517331156700-3c241d2b4d83"
            ]);
            const sample6 = JSON.stringify([
            "https://images.unsplash.com/photo-1518717758536-85ae29035b6d",
            "https://images.unsplash.com/photo-1552053831-71594a27632d"
            ]);
            const sample7 = JSON.stringify([
            "https://images.unsplash.com/photo-1529778873920-4da4926a72c2",
            "https://images.unsplash.com/photo-1546015720-b8b30df5aa27"
            ]);

            // 2 originales
            db.run(
            `INSERT INTO pets (name, description, status, photos_json) VALUES (?,?,?,?)`,
            ["Luna", "Cariñosa y tranquila. Le encanta dormir cerca de personas.", "AVAILABLE", sample1]
            );
            db.run(
            `INSERT INTO pets (name, description, status, photos_json) VALUES (?,?,?,?)`,
            ["Max", "Juguetón y sociable. Ideal para hogar con espacio.", "AVAILABLE", sample2]
            );

            // +5 nuevas
            db.run(
            `INSERT INTO pets (name, description, status, photos_json) VALUES (?,?,?,?)`,
            ["Milo", "Curioso y tierno. Se adapta rápido y ama los paseos cortos.", "AVAILABLE", sample3]
            );
            db.run(
            `INSERT INTO pets (name, description, status, photos_json) VALUES (?,?,?,?)`,
            ["Nala", "Dulce y muy compañera. Perfecta para familia tranquila.", "AVAILABLE", sample4]
            );
            db.run(
            `INSERT INTO pets (name, description, status, photos_json) VALUES (?,?,?,?)`,
            ["Toby", "Energético y obediente. Le encantan los juguetes y aprender trucos.", "AVAILABLE", sample5]
            );
            db.run(
            `INSERT INTO pets (name, description, status, photos_json) VALUES (?,?,?,?)`,
            ["Kira", "Súper cariñosa. Busca mucho contacto y se porta excelente en casa.", "AVAILABLE", sample6]
            );
            db.run(
            `INSERT INTO pets (name, description, status, photos_json) VALUES (?,?,?,?)`,
            ["Simba", "Tranquilo y amigable. Ideal para departamento y rutinas estables.", "AVAILABLE", sample7]
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
