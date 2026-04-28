-- ============================================================
-- EH! JADI GA? — Supabase Updates
-- Run this in: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- ── sort_order columns (needed for CMS ordering feature) ────
ALTER TABLE open_trips           ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
ALTER TABLE open_trip_addons     ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
ALTER TABLE private_destinations ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
ALTER TABLE glampings            ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
ALTER TABLE events               ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- ── RLS policies — allow anon full access (CMS auth is app-level) ──
ALTER TABLE open_trips           ENABLE ROW LEVEL SECURITY;
ALTER TABLE open_trip_addons     ENABLE ROW LEVEL SECURITY;
ALTER TABLE private_destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE glampings            ENABLE ROW LEVEL SECURITY;
ALTER TABLE events               ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon all open_trips"           ON open_trips;
DROP POLICY IF EXISTS "anon all open_trip_addons"     ON open_trip_addons;
DROP POLICY IF EXISTS "anon all private_destinations" ON private_destinations;
DROP POLICY IF EXISTS "anon all glampings"            ON glampings;
DROP POLICY IF EXISTS "anon all events"               ON events;

CREATE POLICY "anon all open_trips"           ON open_trips           FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon all open_trip_addons"     ON open_trip_addons     FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon all private_destinations" ON private_destinations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon all glampings"            ON glampings            FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon all events"               ON events               FOR ALL USING (true) WITH CHECK (true);

-- ── Grant privileges to anon role (needed for DELETE) ────────
GRANT SELECT, INSERT, UPDATE, DELETE ON open_trips           TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON open_trip_addons     TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON private_destinations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON glampings            TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON events               TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON referrals            TO anon;

-- ── not_included column for glampings ───────────────────────
ALTER TABLE glampings ADD COLUMN IF NOT EXISTS not_included JSONB DEFAULT '[]';

-- ── Add price_tiers column to glampings ─────────────────────
ALTER TABLE glampings
  ADD COLUMN IF NOT EXISTS price_tiers JSONB DEFAULT '[]';

-- ── Add price_tiers column to private_destinations ──────────
ALTER TABLE private_destinations
  ADD COLUMN IF NOT EXISTS price_tiers JSONB DEFAULT '[]';

-- ── Referral Codes table ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS referrals (
  id            TEXT PRIMARY KEY,
  code          TEXT UNIQUE NOT NULL,
  discount_type TEXT DEFAULT 'percent',   -- 'percent' or 'fixed'
  discount_value INTEGER DEFAULT 0,
  max_uses      INTEGER DEFAULT 1,        -- 0 = unlimited
  used_count    INTEGER DEFAULT 0,
  expires_at    TEXT,                     -- ISO date string YYYY-MM-DD, NULL = no expiry
  active        BOOLEAN DEFAULT true,
  description   TEXT DEFAULT ''
);

-- ── Add meeting_point_prices column to private_destinations ──
ALTER TABLE private_destinations
  ADD COLUMN IF NOT EXISTS meeting_point_prices JSONB DEFAULT '[]';

-- ── RLS for referrals ────────────────────────────────────────
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Public can read active referrals (needed for validation on inquiry form)
CREATE POLICY "public read referrals" ON referrals
  FOR SELECT USING (true);

-- Anon can update used_count (when a referral is claimed)
CREATE POLICY "anon update referrals" ON referrals
  FOR UPDATE USING (true);

-- Anon full CRUD for CMS
CREATE POLICY "anon write referrals" ON referrals
  FOR ALL USING (true);
