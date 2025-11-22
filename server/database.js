const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

async function database() {
  const db = await open({
    filename: "./inventory.db",
    driver: sqlite3.Database,
  });

  // Create tables if not exists
  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      unit TEXT,
      category TEXT,
      brand TEXT,
      stock INTEGER NOT NULL,
      status TEXT,
      image TEXT
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS inventory_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      productId INTEGER,
      oldStock INTEGER,
      newStock INTEGER,
      changedBy TEXT,
      timestamp TEXT,
      FOREIGN KEY(productId) REFERENCES products(id)
    );
  `);

  return db;
}

module.exports = database;
