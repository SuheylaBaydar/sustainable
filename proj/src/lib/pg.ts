import { Pool } from "pg";
import crypto from "node:crypto";

/**
 * PostgreSQL veri katmanı.
 * Bağlantı için ortam değişkeni gerekir:  DATABASE_URL
 *   örn: postgresql://kullanici:sifre@localhost:5432/sustainable
 * Barındırılan (Supabase/Neon/Render) DB için SSL gerekiyorsa: DATABASE_SSL=true
 */

const globalForPg = globalThis as unknown as {
  __pgPool?: Pool;
  __pgSchemaReady?: Promise<void>;
};

function getPool(): Pool {
  if (!globalForPg.__pgPool) {
    globalForPg.__pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ...(process.env.DATABASE_SSL === "true"
        ? { ssl: { rejectUnauthorized: false } }
        : {}),
    });
  }
  return globalForPg.__pgPool;
}

/* ----------------------------- Şifre hashleme ----------------------------- */
// Şifre veritabanına ASLA düz metin yazılmaz; scrypt ile hashlenir: "salt:hash"
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = (stored ?? "").split(":");
  if (!salt || !hash) return false;
  const computed = crypto.scryptSync(password, salt, 64).toString("hex");
  const a = Buffer.from(hash, "hex");
  const b = Buffer.from(computed, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/* -------------------------------- Şema kurulum ---------------------------- */
// İlk sorguda tablolar ve varsayılan admin kullanıcısı bir kez oluşturulur.
async function ensureSchema(): Promise<void> {
  if (globalForPg.__pgSchemaReady) return globalForPg.__pgSchemaReady;

  globalForPg.__pgSchemaReady = (async () => {
    const pool = getPool();

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id          SERIAL PRIMARY KEY,
        username    TEXT NOT NULL UNIQUE,
        password    TEXT NOT NULL,
        name        TEXT,
        email       TEXT,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id          SERIAL PRIMARY KEY,
        name        TEXT NOT NULL,
        description TEXT,
        price       NUMERIC(12,2),
        image_url   TEXT,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id          SERIAL PRIMARY KEY,
        name        TEXT,
        surname     TEXT,
        email       TEXT,
        city        TEXT,
        message     TEXT,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id          SERIAL PRIMARY KEY,
        name        TEXT,
        surname     TEXT,
        email       TEXT,
        appt_date   DATE,
        appt_time   TEXT,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    // Varsayılan admin: admin / admin123 (şifre hashlenerek yazılır).
    // Daha önce düz metin veya hatalı hash ile oluşmuş admin kaydı varsa otomatik düzeltilir.
    const existing = await pool.query(
      "SELECT id, password FROM users WHERE username = $1",
      ["admin"]
    );
    if (existing.rowCount === 0) {
      await pool.query(
        "INSERT INTO users (username, password, name, email) VALUES ($1, $2, $3, $4)",
        ["admin", hashPassword("admin123"), "Admin", "admin@example.com"]
      );
    } else {
      const currentPassword = existing.rows[0]?.password ?? "";
      const looksHashed = typeof currentPassword === "string" && currentPassword.includes(":");
      const acceptsDefault = looksHashed ? verifyPassword("admin123", currentPassword) : currentPassword === "admin123";
      if (!looksHashed || !acceptsDefault) {
        await pool.query(
          "UPDATE users SET password = $1, name = COALESCE(name, $2), email = COALESCE(email, $3) WHERE username = $4",
          [hashPassword("admin123"), "Admin", "admin@example.com", "admin"]
        );
      }
    }
  })();

  return globalForPg.__pgSchemaReady;
}

/* ---------------------------------- Tipler -------------------------------- */
export interface PublicUser {
  id: string;
  username?: string;
  name: string | null;
  email: string | null;
}

/* --------------------------------- Users ---------------------------------- */
export async function verifyUser(
  username: string,
  password: string
): Promise<PublicUser | null> {
  await ensureSchema();
  const pool = getPool();
  const login = username.trim().toLowerCase();
  const { rows } = await pool.query(
    "SELECT * FROM users WHERE lower(username) = $1 OR lower(coalesce(email, '')) = $1",
    [login]
  );
  const row = rows[0];
  if (!row) return null;
  if (!verifyPassword(password, row.password)) return null;
  return { id: String(row.id), username: row.username, name: row.name, email: row.email };
}

export async function createUser(
  username: string,
  password: string,
  name?: string,
  email?: string
): Promise<PublicUser> {
  await ensureSchema();
  const pool = getPool();
  const { rows } = await pool.query(
    `INSERT INTO users (username, password, name, email)
     VALUES ($1, $2, $3, $4)
     RETURNING id, username, name, email`,
    [username, hashPassword(password), name ?? null, email ?? null]
  );
  const r = rows[0];
  return { id: String(r.id), username: r.username, name: r.name, email: r.email };
}

export async function getUserById(id: string | number): Promise<PublicUser | null> {
  await ensureSchema();
  const pool = getPool();
  const { rows } = await pool.query(
    "SELECT id, username, name, email FROM users WHERE id = $1",
    [id]
  );
  const r = rows[0];
  if (!r) return null;
  return { id: String(r.id), username: r.username, name: r.name, email: r.email };
}

export async function userExists(username: string, email?: string) {
  await ensureSchema();
  const pool = getPool();
  const { rows } = await pool.query(
    "SELECT id FROM users WHERE lower(username) = lower($1) OR (email IS NOT NULL AND $2 <> '' AND lower(email) = lower($2))",
    [username, email ?? ""]
  );
  return rows.length > 0;
}

export async function listUsers() {
  await ensureSchema();
  const pool = getPool();
  const { rows } = await pool.query(
    "SELECT id, username, name, email, created_at FROM users ORDER BY id ASC"
  );
  return rows;
}

export async function deleteUser(id: string | number) {
  await ensureSchema();
  const pool = getPool();
  const { rowCount } = await pool.query("DELETE FROM users WHERE id = $1", [id]);
  return rowCount ?? 0;
}

/* -------------------------------- Products -------------------------------- */
export async function listProducts() {
  await ensureSchema();
  const pool = getPool();
  const { rows } = await pool.query(
    "SELECT id, name, description, price, image_url, created_at FROM products ORDER BY id DESC"
  );
  return rows;
}

export async function createProduct(p: {
  name: string;
  description?: string;
  price?: number | null;
  image_url?: string;
}) {
  await ensureSchema();
  const pool = getPool();
  const { rows } = await pool.query(
    `INSERT INTO products (name, description, price, image_url)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, description, price, image_url, created_at`,
    [p.name, p.description ?? null, p.price ?? null, p.image_url ?? null]
  );
  return rows[0];
}

export async function deleteProduct(id: string | number) {
  await ensureSchema();
  const pool = getPool();
  const { rowCount } = await pool.query("DELETE FROM products WHERE id = $1", [id]);
  return rowCount ?? 0;
}

/* -------------------------------- Messages -------------------------------- */
export async function createMessage(m: {
  name?: string;
  surname?: string;
  email?: string;
  city?: string;
  message?: string;
}) {
  await ensureSchema();
  const pool = getPool();
  const { rows } = await pool.query(
    `INSERT INTO messages (name, surname, email, city, message)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, surname, email, city, message, created_at`,
    [m.name ?? null, m.surname ?? null, m.email ?? null, m.city ?? null, m.message ?? null]
  );
  return rows[0];
}

export async function listMessages() {
  await ensureSchema();
  const pool = getPool();
  const { rows } = await pool.query(
    "SELECT id, name, surname, email, city, message, created_at FROM messages ORDER BY id DESC"
  );
  return rows;
}

/* ------------------------------ Appointments ------------------------------ */
export async function createAppointment(a: {
  name?: string;
  surname?: string;
  email?: string;
  date?: string;
  time?: string;
}) {
  await ensureSchema();
  const pool = getPool();
  const { rows } = await pool.query(
    `INSERT INTO appointments (name, surname, email, appt_date, appt_time)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, surname, email, appt_date, appt_time, created_at`,
    [
      a.name ?? null,
      a.surname ?? null,
      a.email ?? null,
      a.date || null,
      a.time ?? null,
    ]
  );
  return rows[0];
}

export async function listAppointments() {
  await ensureSchema();
  const pool = getPool();
  const { rows } = await pool.query(
    "SELECT id, name, surname, email, appt_date, appt_time, created_at FROM appointments ORDER BY id DESC"
  );
  return rows;
}

export { getPool, ensureSchema };
export default getPool;
