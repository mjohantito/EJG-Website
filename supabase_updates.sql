-- ============================================================
-- EH! JADI GA? — Supabase Updates
-- Run this in: Supabase Dashboard → SQL Editor → Run
-- ============================================================

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
