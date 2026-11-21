-- Sustainable - PostgreSQL şema referansı
-- Uygulama bu tabloları ilk çalıştığında otomatik oluşturur.
-- İsterseniz elle de oluşturabilirsiniz.

CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  username    TEXT NOT NULL UNIQUE,
  password    TEXT NOT NULL,          -- scrypt: "salt:hash"
  name        TEXT,
  email       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT,
  price       NUMERIC(12,2),
  image_url   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id          SERIAL PRIMARY KEY,
  name        TEXT,
  surname     TEXT,
  email       TEXT,
  city        TEXT,
  message     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS appointments (
  id          SERIAL PRIMARY KEY,
  name        TEXT,
  surname     TEXT,
  email       TEXT,
  appt_date   DATE,
  appt_time   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
