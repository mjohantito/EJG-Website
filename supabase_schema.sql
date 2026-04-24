-- ============================================================
-- EH! JADI GA? — Supabase Schema
-- Run this entire file in: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Open Trips ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS open_trips (
  id           TEXT PRIMARY KEY,
  dest         TEXT,
  region       TEXT,
  month        TEXT,
  day          TEXT,
  start_date   TEXT,
  end_date     TEXT,
  duration     TEXT,
  price        TEXT,
  price_num    INTEGER,
  slots        INTEGER,
  total_slots  INTEGER,
  tag          TEXT,
  palette      TEXT,
  emoji        TEXT,
  cover        TEXT,
  description  TEXT,
  highlights   JSONB DEFAULT '[]',
  includes     JSONB DEFAULT '[]',
  gallery      JSONB DEFAULT '[]',
  sort_order   INTEGER DEFAULT 0
);

-- ── Open Trip Add-ons ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS open_trip_addons (
  id         TEXT PRIMARY KEY,
  label      TEXT,
  price      INTEGER,
  descr      TEXT,
  sort_order INTEGER DEFAULT 0
);

-- ── Private Destinations ────────────────────────────────────
CREATE TABLE IF NOT EXISTS private_destinations (
  id             TEXT PRIMARY KEY,
  name           TEXT,
  region         TEXT,
  sub            TEXT,
  emoji          TEXT,
  cover          TEXT,
  palette        TEXT,
  description    TEXT,
  highlights     JSONB DEFAULT '[]',
  durations      JSONB DEFAULT '[]',
  starting_price TEXT,
  price_per_pax  INTEGER,
  gallery        JSONB DEFAULT '[]',
  sort_order     INTEGER DEFAULT 0
);

-- ── Glampings ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS glampings (
  id              TEXT PRIMARY KEY,
  name            TEXT,
  location        TEXT,
  palette         TEXT,
  emoji           TEXT,
  cover           TEXT,
  tag             TEXT,
  price           TEXT,
  price_per_night INTEGER,
  unit            TEXT,
  cap             TEXT,
  availability    TEXT,
  closed_days     JSONB DEFAULT '[]',
  tagline         TEXT,
  description     TEXT,
  amenities       JSONB DEFAULT '[]',
  gallery         JSONB DEFAULT '[]',
  addons          JSONB DEFAULT '[]',
  sort_order      INTEGER DEFAULT 0
);

-- ── Special Events ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id          TEXT PRIMARY KEY,
  name        TEXT,
  subtitle    TEXT,
  date        TEXT,
  date_end    TEXT,
  year        INTEGER,
  venue       TEXT,
  emoji       TEXT,
  cover       TEXT,
  palette     TEXT,
  tag         TEXT,
  description TEXT,
  highlights  JSONB DEFAULT '[]',
  includes    JSONB DEFAULT '[]',
  tickets     JSONB DEFAULT '[]',
  sort_order  INTEGER DEFAULT 0
);

-- ── Site Settings ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT
);

INSERT INTO settings (key, value)
VALUES ('whatsapp', '6285117322207')
ON CONFLICT (key) DO NOTHING;

-- ── Inquiries ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS inquiries (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  kind       TEXT,   -- open | private | glamping | event | corporate
  name       TEXT,
  email      TEXT,
  wa         TEXT,
  data       JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── RLS: allow public inserts for inquiries, read-only for data ──
ALTER TABLE open_trips         ENABLE ROW LEVEL SECURITY;
ALTER TABLE open_trip_addons   ENABLE ROW LEVEL SECURITY;
ALTER TABLE private_destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE glampings          ENABLE ROW LEVEL SECURITY;
ALTER TABLE events             ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings           ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries          ENABLE ROW LEVEL SECURITY;

-- Public can read all content tables
CREATE POLICY "public read open_trips"          ON open_trips           FOR SELECT USING (true);
CREATE POLICY "public read open_trip_addons"    ON open_trip_addons     FOR SELECT USING (true);
CREATE POLICY "public read private_destinations" ON private_destinations FOR SELECT USING (true);
CREATE POLICY "public read glampings"           ON glampings            FOR SELECT USING (true);
CREATE POLICY "public read events"              ON events               FOR SELECT USING (true);
CREATE POLICY "public read settings"            ON settings             FOR SELECT USING (true);

-- Public can insert inquiries
CREATE POLICY "public insert inquiries" ON inquiries FOR INSERT WITH CHECK (true);

-- Anon can do full CRUD on content (CMS uses anon key from owner's browser)
CREATE POLICY "anon write open_trips"           ON open_trips           FOR ALL USING (true);
CREATE POLICY "anon write open_trip_addons"     ON open_trip_addons     FOR ALL USING (true);
CREATE POLICY "anon write private_destinations" ON private_destinations FOR ALL USING (true);
CREATE POLICY "anon write glampings"            ON glampings            FOR ALL USING (true);
CREATE POLICY "anon write events"               ON events               FOR ALL USING (true);
CREATE POLICY "anon write settings"             ON settings             FOR ALL USING (true);

-- ── Storage bucket ──────────────────────────────────────────
-- Run this separately after creating the bucket in Storage UI:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);
-- CREATE POLICY "public read media" ON storage.objects FOR SELECT USING (bucket_id = 'media');
-- CREATE POLICY "anon upload media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media');
-- CREATE POLICY "anon delete media" ON storage.objects FOR DELETE USING (bucket_id = 'media');
