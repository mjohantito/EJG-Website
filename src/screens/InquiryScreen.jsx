import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useData, lookupTier } from '../context/DataContext';
import { submitInquiry } from '../lib/submitInquiry';
import Footer from '../components/Footer';

/* ── Glamping availability rules ── */
const GLAMP_AVAIL = {
  'gl-senggani': { label: 'Buka setiap hari', closedDays: [] },
  'gl-batu':     { label: 'Buka setiap hari', closedDays: [] },
  'gl-tete':     { label: 'Buka setiap hari kecuali Rabu', closedDays: [3] },
};

function dateAvailability(dateStr, glampId) {
  if (!dateStr) return null;
  const rule = GLAMP_AVAIL[glampId];
  if (!rule || rule.closedDays.length === 0) return 'available';
  const [y, m, d] = dateStr.split('-').map(Number);
  const day = new Date(y, m - 1, d).getDay();
  return rule.closedDays.includes(day) ? 'unavailable' : 'available';
}

const TODAY = new Date().toISOString().split('T')[0];
const MAX_DATE = (() => {
  const d = new Date();
  d.setMonth(d.getMonth() + 10);
  return d.toISOString().split('T')[0];
})();

const BUDGET_OPTIONS = [
  'Di bawah Rp 5 juta',
  'Rp 5–10 juta',
  'Rp 10–25 juta',
  'Rp 25–50 juta',
  'Di atas Rp 50 juta',
  'Belum tahu / fleksibel',
];

const DURATION_MULTIPLIER = { '2D1N': 1, '3D2N': 1.5, '4D3N': 2 };

function formatRupiah(amount) {
  if (amount >= 1_000_000) return `Rp ${(amount / 1_000_000).toFixed(1).replace('.0', '')} juta`;
  return `Rp ${(amount / 1_000).toFixed(0)} ribu`;
}

function applyDiscount(total, referral) {
  if (!referral) return total;
  if (referral.discountType === 'percent') {
    return Math.round(total * (1 - referral.discountValue / 100));
  }
  return Math.max(0, total - referral.discountValue);
}

/* ── Shared field components ── */
function Field({ label, hint, children }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
      {hint && <span className="hint">{hint}</span>}
    </div>
  );
}

function Stepper({ label, value, onChange, min = 1, max = 100 }) {
  return (
    <Field label={label}>
      <div className="stepper">
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}>−</button>
        <span className="v">{value}</span>
        <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}>+</button>
      </div>
    </Field>
  );
}

/* ── Referral code field ── */
function ReferralField({ onApply, applied, onRemove }) {
  const [code, setCode] = useState('');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  const check = async () => {
    if (!code.trim()) return;
    setChecking(true);
    setError('');
    const result = await onApply(code);
    if (!result.valid) setError(result.error);
    setChecking(false);
  };

  if (applied) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: 14, padding: '12px 16px',
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13, color: '#15803d' }}>
            🎟 Kode {applied.code} berhasil!
          </div>
          <div style={{ fontSize: 12, color: '#16a34a', marginTop: 2 }}>
            Diskon {applied.discountType === 'percent' ? `${applied.discountValue}%` : formatRupiah(applied.discountValue)} diterapkan
          </div>
        </div>
        <button type="button" onClick={onRemove}
          style={{ background: 'none', border: 'none', color: '#16a34a', fontSize: 18, cursor: 'pointer', padding: '0 4px' }}>×</button>
      </div>
    );
  }

  return (
    <Field label="Kode referral (opsional)">
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={code}
          onChange={e => { setCode(e.target.value.toUpperCase()); setError(''); }}
          placeholder="KODE123"
          style={{ flex: 1, textTransform: 'uppercase', letterSpacing: '0.08em' }}
        />
        <button
          type="button"
          className="btn btn-sec"
          onClick={check}
          disabled={checking || !code.trim()}
          style={{ flexShrink: 0, padding: '12px 18px', fontSize: 14, opacity: !code.trim() ? 0.4 : 1 }}
        >
          {checking ? '…' : 'Cek'}
        </button>
      </div>
      {error && (
        <span style={{ fontSize: 12, color: '#dc2626', marginTop: 4, display: 'block' }}>{error}</span>
      )}
    </Field>
  );
}

/* ── Estimate box ── */
function EstimateBox({ total, discountedTotal, referral, detail }) {
  const hasDiscount = referral && discountedTotal < total;
  return (
    <div style={{
      background: 'var(--ejg-ink)', borderRadius: 14, padding: '14px 16px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 10, color: 'rgba(243,213,67,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>
          Estimasi total
        </div>
        {hasDiscount && (
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, color: 'rgba(243,213,67,0.5)', textDecoration: 'line-through', marginBottom: 2 }}>
            {formatRupiah(total)}
          </div>
        )}
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: '#F3D543', letterSpacing: '-0.02em' }}>
          {formatRupiah(hasDiscount ? discountedTotal : total)}
        </div>
        {hasDiscount && (
          <div style={{ fontSize: 10, color: '#86efac', marginTop: 2 }}>
            Hemat {referral.discountType === 'percent' ? `${referral.discountValue}%` : formatRupiah(total - discountedTotal)} dengan kode {referral.code}
          </div>
        )}
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{detail}</div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>*estimasi, final dikonfirmasi via WA</div>
      </div>
    </div>
  );
}

/* ── Open trip fields ── */
const MEETING_POINTS_BASE = ['Kediri', 'Surabaya', 'Malang'];

function AddonCheckboxes({ addons, selected, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {addons.map(addon => {
        const checked = selected.includes(addon.id);
        return (
          <label key={addon.id} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '10px 14px', background: 'var(--ejg-kertas-2)', borderRadius: 12, border: `1.5px solid ${checked ? 'var(--ejg-ink)' : 'var(--border)'}` }}>
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onChange(checked ? selected.filter(id => id !== addon.id) : [...selected, addon.id])}
              style={{ width: 18, height: 18, accentColor: 'var(--ejg-ink)', flexShrink: 0 }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: 'var(--ejg-ink)' }}>{addon.label}</div>
              <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 1 }}>{addon.desc}</div>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 12, color: 'var(--fg-2)', flexShrink: 0 }}>
              +{formatRupiah(addon.price)}
            </span>
          </label>
        );
      })}
    </div>
  );
}

function OpenTripFields({ state, set, openTrips, openTripAddons }) {
  const selectedTrip = openTrips.find(t => t.id === state.tripId);
  const avail = selectedTrip ? selectedTrip.slots : null;
  const low = avail !== null && avail <= 3;
  const addonsTotal = (state.addons || []).reduce((sum, id) => {
    const a = openTripAddons.find(x => x.id === id);
    return sum + (a ? a.price : 0);
  }, 0);
  const baseTotal = selectedTrip?.priceNum ? selectedTrip.priceNum * state.pax : 0;
  const estimate = baseTotal + addonsTotal || null;

  return (
    <>
      <Field label="Nama kamu">
        <input value={state.name} onChange={e => set('name', e.target.value)} placeholder="Nama Kamu" />
      </Field>
      <Field label="No. WhatsApp" hint="Kita bales via WA biar cepet.">
        <input value={state.wa} onChange={e => set('wa', e.target.value)} placeholder="+62 812…" inputMode="tel" />
      </Field>
      <Field label="Email" hint="Konfirmasi akan dikirim ke email ini.">
        <input type="email" value={state.email} onChange={e => set('email', e.target.value)} placeholder="kamu@email.com" />
      </Field>
      <Field label="Pilih trip">
        <select value={state.tripId} onChange={e => set('tripId', e.target.value)}>
          {openTrips.map(t => (
            <option key={t.id} value={t.id}>{t.dest} · {t.start} – {t.end}</option>
          ))}
        </select>
        {avail !== null && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <div style={{ flex: 1, height: 4, background: 'var(--ejg-fog)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 999,
                background: low ? '#C23B2A' : 'var(--ejg-ink)',
                width: `${Math.max(8, ((selectedTrip.totalSlots - avail) / selectedTrip.totalSlots) * 100)}%`,
              }} />
            </div>
            <span style={{ fontSize: 11, fontFamily: 'var(--font-display)', fontWeight: 700, color: low ? '#C23B2A' : 'var(--fg-3)', letterSpacing: '0.05em' }}>
              {avail} slot tersisa
            </span>
          </div>
        )}
      </Field>
      <Stepper label="Jumlah tamu" value={state.pax} onChange={v => set('pax', v)} min={1} max={50} />
      <Field label="Add-on (opsional)">
        <AddonCheckboxes addons={openTripAddons} selected={state.addons || []} onChange={v => set('addons', v)} />
      </Field>
      {estimate > 0 && (
        <EstimateBox
          total={estimate}
          discountedTotal={applyDiscount(estimate, state.appliedReferral)}
          referral={state.appliedReferral}
          detail={`${state.pax} org × Rp ${selectedTrip.price}${addonsTotal > 0 ? ` + add-on ${formatRupiah(addonsTotal)}` : ''}`}
        />
      )}
      <Field label="Catatan / request">
        <textarea value={state.notes} onChange={e => set('notes', e.target.value)}
          placeholder="Ada hal spesifik yang perlu kami tahu? Dietary, aksesibilitas, request khusus…" />
      </Field>
    </>
  );
}

/* ── Private trip fields ── */
function PrivateFields({ state, set, privateDestinations }) {
  const dest = privateDestinations.find(d => d.id === state.privateDest) || privateDestinations[0];
  const meetingPoints = state.privateDest === 'ijen'
    ? [...MEETING_POINTS_BASE, 'Banyuwangi']
    : MEETING_POINTS_BASE;

  const multiplier = DURATION_MULTIPLIER[state.privateDuration];

  // Tiered pricing: total for group, then show per-pax
  const tier = dest?.priceTiers?.length ? lookupTier(dest.priceTiers, state.pax) : null;
  const totalFromTier = tier && multiplier ? Math.round(tier.price * multiplier) : null;
  const totalFromPerPax = dest?.pricePerPax && multiplier ? dest.pricePerPax * state.pax * multiplier : null;
  const baseTotal = totalFromTier ?? totalFromPerPax;
  const perPax = baseTotal && state.pax > 0 ? Math.round(baseTotal / state.pax) : null;

  const handleDestChange = (newDestId) => {
    set('privateDest', newDestId);
    const newDest = privateDestinations.find(d => d.id === newDestId);
    if (newDest) set('privateDuration', newDest.durations[0]);
    if (newDestId !== 'ijen' && state.meetingPoint === 'Banyuwangi') {
      set('meetingPoint', 'Kediri');
    }
  };

  return (
    <>
      <Field label="Nama kamu">
        <input value={state.name} onChange={e => set('name', e.target.value)} placeholder="Nama Kamu" />
      </Field>
      <Field label="No. WhatsApp" hint="Kita bales via WA biar cepet.">
        <input value={state.wa} onChange={e => set('wa', e.target.value)} placeholder="+62 812…" inputMode="tel" />
      </Field>
      <Field label="Email" hint="Konfirmasi akan dikirim ke email ini.">
        <input type="email" value={state.email} onChange={e => set('email', e.target.value)} placeholder="kamu@email.com" />
      </Field>
      <Field label="Destinasi">
        <select value={state.privateDest} onChange={e => handleDestChange(e.target.value)}>
          {privateDestinations.map(d => (
            <option key={d.id} value={d.id}>{d.emoji} {d.name} — {d.sub}</option>
          ))}
        </select>
      </Field>
      <Field label="Durasi trip">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 2 }}>
          {dest.durations.map(dur => (
            <button key={dur} type="button" onClick={() => set('privateDuration', dur)} style={{
              padding: '9px 18px', borderRadius: 999,
              border: state.privateDuration === dur ? '2px solid var(--ejg-ink)' : '1.5px solid var(--border)',
              background: state.privateDuration === dur ? 'var(--ejg-matahari)' : '#fff',
              color: 'var(--ejg-ink)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13,
              cursor: 'pointer', transition: 'all 140ms ease',
            }}>{dur}</button>
          ))}
        </div>
      </Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Stepper label="Jumlah tamu" value={state.pax} onChange={v => set('pax', v)} min={1} max={50} />
        <Field label="Meeting point">
          <select value={state.meetingPoint} onChange={e => set('meetingPoint', e.target.value)}>
            {meetingPoints.map(mp => <option key={mp} value={mp}>{mp}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Tanggal (opsional)">
        <input type="date" value={state.date} min={TODAY} onChange={e => set('date', e.target.value)} />
      </Field>
      {baseTotal && (
        <EstimateBox
          total={baseTotal}
          discountedTotal={applyDiscount(baseTotal, state.appliedReferral)}
          referral={state.appliedReferral}
          detail={perPax ? `≈ ${formatRupiah(perPax)}/pax · ${state.pax} orang · ${state.privateDuration}` : `${state.pax} orang · ${state.privateDuration}`}
        />
      )}
      <Field label="Catatan / request">
        <textarea value={state.notes} onChange={e => set('notes', e.target.value)}
          placeholder="Ada hal spesifik yang perlu kami tahu? Dietary, aksesibilitas, request khusus…" />
      </Field>
    </>
  );
}

/* ── Corporate fields ── */
function CorporateFields({ state, set }) {
  return (
    <>
      <Field label="Nama kamu">
        <input value={state.name} onChange={e => set('name', e.target.value)} placeholder="Nama Kamu" />
      </Field>
      <Field label="Jabatan / posisi">
        <input value={state.jobTitle} onChange={e => set('jobTitle', e.target.value)} placeholder="HR Manager" />
      </Field>
      <Field label="Perusahaan / organisasi">
        <input value={state.company} onChange={e => set('company', e.target.value)} placeholder="PT Maju Bersama" />
      </Field>
      <Field label="Email">
        <input type="email" value={state.email} onChange={e => set('email', e.target.value)} placeholder="budi@perusahaan.com" />
      </Field>
      <Field label="No. WhatsApp" hint="Kita follow up via WA.">
        <input value={state.wa} onChange={e => set('wa', e.target.value)} placeholder="+62 812…" inputMode="tel" />
      </Field>
      <Field label="Alamat perusahaan">
        <input value={state.companyAddress} onChange={e => set('companyAddress', e.target.value)} placeholder="Jl. Sudirman No. 1, Jakarta" />
      </Field>
      <Field label="Budget range">
        <select value={state.budget} onChange={e => set('budget', e.target.value)}>
          <option value="">Pilih range budget…</option>
          {BUDGET_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </Field>
      <Field label="Destinasi trip">
        <input value={state.tripDest} onChange={e => set('tripDest', e.target.value)} placeholder="Bromo, Ijen, Tumpak Sewu…" />
      </Field>
      <Field label="Tujuan / tema trip">
        <input value={state.tripPurpose} onChange={e => set('tripPurpose', e.target.value)} placeholder="Team building, annual gathering, reward trip…" />
      </Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Field label="Tanggal">
          <input type="date" value={state.date} min={TODAY} onChange={e => set('date', e.target.value)} />
        </Field>
        <Stepper label="Jumlah peserta" value={state.pax} onChange={v => set('pax', v)} min={1} max={500} />
      </div>
      <Field label="Catatan tambahan">
        <textarea value={state.notes} onChange={e => set('notes', e.target.value)}
          placeholder="Ceritain lebih detail tentang kebutuhan acara kamu — akomodasi, transportasi, kegiatan khusus, dll." />
      </Field>
    </>
  );
}

/* ── Glamping fields ── */
function GlampingFields({ state, set, glampings }) {
  const rule = GLAMP_AVAIL[state.glampLoc];
  const avStatus = dateAvailability(state.date, state.glampLoc);
  const glamp = glampings.find(g => g.id === state.glampLoc);

  const sortedTiers = glamp?.priceTiers?.length
    ? [...glamp.priceTiers].sort((a, b) => a.minPax - b.minPax)
    : [];
  const hasTiers = sortedTiers.length > 0;

  const addonsTotal = glamp?.addons ? (state.addons || []).reduce((sum, id) => {
    const a = glamp.addons.find(x => x.id === id);
    return sum + (a ? a.price : 0);
  }, 0) : 0;

  // Price from selected tier or fallback to pricePerNight
  const activeTier = hasTiers ? lookupTier(glamp.priceTiers, state.pax) : null;
  const pricePerNight = activeTier ? activeTier.price : (glamp?.pricePerNight ?? 0);
  const baseTotal = pricePerNight * state.nights;
  const estimate = baseTotal > 0 ? baseTotal + addonsTotal : null;
  const perPax = estimate && state.pax > 0 ? Math.round(estimate / state.pax) : null;

  const handleLocChange = (newId) => {
    const newGlamp = glampings.find(g => g.id === newId);
    const tiers = newGlamp?.priceTiers?.length
      ? [...newGlamp.priceTiers].sort((a, b) => a.minPax - b.minPax)
      : [];
    set('glampLoc', newId);
    set('pax', tiers.length ? tiers[0].minPax : 1);
    set('date', '');
    set('addons', []);
  };

  return (
    <>
      <Field label="Nama kamu">
        <input value={state.name} onChange={e => set('name', e.target.value)} placeholder="Nama Kamu" />
      </Field>
      <Field label="No. WhatsApp" hint="Kita bales via WA biar cepet.">
        <input value={state.wa} onChange={e => set('wa', e.target.value)} placeholder="+62 812…" inputMode="tel" />
      </Field>
      <Field label="Email">
        <input type="email" value={state.email} onChange={e => set('email', e.target.value)} placeholder="kamu@email.com" />
      </Field>
      <Field label="Lokasi glamping">
        <select value={state.glampLoc} onChange={e => handleLocChange(e.target.value)}>
          {glampings.map(g => (
            <option key={g.id} value={g.id}>{g.emoji} {g.name} — {g.location.split(',')[0]}</option>
          ))}
        </select>
        {rule && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 12, color: 'var(--fg-3)' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: rule.closedDays.length ? '#C23B2A' : '#3E7A35', flexShrink: 0, display: 'inline-block' }} />
            {rule.label}
          </div>
        )}
      </Field>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {hasTiers ? (
          <Field label="Jumlah tamu">
            <select value={state.pax} onChange={e => set('pax', Number(e.target.value))}>
              {sortedTiers.map(tier => (
                <option key={tier.minPax} value={tier.minPax}>
                  {tier.minPax} orang
                </option>
              ))}
            </select>
          </Field>
        ) : (
          <Stepper label="Jumlah tamu" value={state.pax} onChange={v => set('pax', v)} min={1} max={20} />
        )}
        <Stepper label="Jumlah malam" value={state.nights} onChange={v => set('nights', v)} min={1} max={3} />
      </div>

      <Field label="Tanggal check-in">
        <input type="date" value={state.date} min={TODAY} max={MAX_DATE}
          onChange={e => set('date', e.target.value)}
          style={{ borderColor: avStatus === 'unavailable' ? '#C23B2A' : undefined }}
        />
        {avStatus === 'available' && state.date && (
          <div style={{ marginTop: 6, fontSize: 12, color: '#3E7A35', fontFamily: 'var(--font-display)', fontWeight: 700, display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3E7A35', display: 'inline-block' }} />
            Tanggal tersedia
          </div>
        )}
        {avStatus === 'unavailable' && (
          <div style={{ marginTop: 6, fontSize: 12, color: '#C23B2A', fontFamily: 'var(--font-display)', fontWeight: 700, display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#C23B2A', display: 'inline-block' }} />
            Tidak tersedia — lokasi ini tutup setiap Rabu. Pilih tanggal lain.
          </div>
        )}
      </Field>

      {glamp?.addons?.length > 0 && (
        <Field label="Add-on (opsional)">
          <AddonCheckboxes addons={glamp.addons} selected={state.addons || []} onChange={v => set('addons', v)} />
        </Field>
      )}
      {estimate > 0 && (
        <EstimateBox
          total={estimate}
          discountedTotal={applyDiscount(estimate, state.appliedReferral)}
          referral={state.appliedReferral}
          detail={perPax
            ? `≈ ${formatRupiah(perPax)}/pax · ${state.nights} malam${addonsTotal > 0 ? ` + add-on ${formatRupiah(addonsTotal)}` : ''}`
            : `${state.nights} malam${addonsTotal > 0 ? ` + add-on ${formatRupiah(addonsTotal)}` : ''}`
          }
        />
      )}
      <Field label="Catatan / request">
        <textarea value={state.notes} onChange={e => set('notes', e.target.value)}
          placeholder="Ada request makanan atau hal lain yang perlu kami siapkan?" />
      </Field>
    </>
  );
}

/* ── Main screen ── */
export default function InquiryScreen({ onSubmit }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { openTrips, openTripAddons, privateDestinations, glampings, validateReferral, useReferral } = useData();
  const ctx = location.state || {};

  const [kind, setKind] = useState(
    ['open', 'private', 'glamping'].includes(ctx.kind) ? ctx.kind : 'open'
  );

  const initialPrivateDest = ctx.dest || privateDestinations[0]?.id;
  const initialDestData = privateDestinations.find(d => d.id === initialPrivateDest) || privateDestinations[0];

  const [form, setForm] = useState({
    name: '', email: '', wa: '',
    pax: ctx.pax || 1,
    date: '', notes: '',
    tripId: ctx.tripId || openTrips[0]?.id,
    privateDest: initialPrivateDest,
    privateDuration: ctx.duration || initialDestData?.durations[0],
    meetingPoint: 'Surabaya',
    glampLoc: ctx.glampId || glampings[0]?.id,
    nights: 1,
    addons: [],
    appliedReferral: null,
  });

  const [submitting, setSubmitting] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleApplyReferral = async (code) => {
    const result = await validateReferral(code);
    if (result.valid) {
      set('appliedReferral', result.referral);
    }
    return result;
  };

  const glampDateStatus = dateAvailability(form.date, form.glampLoc);

  const canSubmit = (() => {
    const base = form.name.trim().length > 1 && form.email.trim().length > 3 && form.wa.trim().length > 5;
    if (!base) return false;
    if (kind === 'glamping') return glampDateStatus !== 'unavailable';
    return true;
  })();

  const handleSubmit = async () => {
    setSubmitting(true);
    const referralCode = form.appliedReferral?.code;
    await submitInquiry(kind, { ...form, referralCode });
    if (form.appliedReferral) {
      await useReferral(form.appliedReferral.id, form.appliedReferral.usedCount);
    }
    setSubmitting(false);
    const payload = { kind, ...form };
    if (onSubmit) {
      onSubmit(payload);
    } else {
      navigate('/thanks', { state: payload });
    }
  };

  return (
    <>
      <div className="page-header">
        <span className="eyebrow">Inquiry · Langkah pertama ke petualanganmu</span>
        <h1 style={{ marginTop: 6 }}>
          Kamu selangkah lebih dekat<span className="q-stamp">.</span>
        </h1>
        <p className="lead">Isi form ini — tim kita balas dalam hitungan jam, bukan hari.</p>
      </div>

      <div style={{ padding: '0 20px 14px' }}>
        <label className="eyebrow" style={{ display: 'block', marginBottom: 8 }}>Jenis inquiry</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { id: 'open',     label: 'Open trip' },
            { id: 'private',  label: 'Private trip' },
            { id: 'glamping', label: 'Glamping' },
          ].map(k => (
            <button key={k.id} type="button"
              className={`radio-card${kind === k.id ? ' on' : ''}`}
              onClick={() => setKind(k.id)}
              style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '12px 8px' }}
            >
              <span className="k">{k.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="form">
        {kind === 'open'     && <OpenTripFields state={form} set={set} openTrips={openTrips} openTripAddons={openTripAddons} />}
        {kind === 'private'  && <PrivateFields state={form} set={set} privateDestinations={privateDestinations} />}
        {kind === 'glamping' && <GlampingFields state={form} set={set} glampings={glampings} />}

        {kind !== 'corporate' && (
          <ReferralField
            onApply={handleApplyReferral}
            applied={form.appliedReferral}
            onRemove={() => set('appliedReferral', null)}
          />
        )}

        <div style={{ background: 'var(--ejg-kertas-2)', border: '1px dashed var(--border-strong)', borderRadius: 14, padding: 14, fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.5 }}>
          <strong style={{ color: 'var(--ejg-ink)' }}>Fyi:</strong> kita cuma butuh info dasar dulu.
          Detail lanjutan bisa ngobrol santai via WA setelah ini.
        </div>

        <button type="button" className="btn btn-pri btn-block"
          disabled={!canSubmit || submitting}
          onClick={handleSubmit}
          style={{ opacity: canSubmit && !submitting ? 1 : 0.45 }}
        >
          {submitting ? 'Mengirim…' : 'Kirim inquiry →'}
        </button>
      </div>

      <Footer onNav={(name) => navigate(`/${name === 'home' ? '' : name}`)} />
    </>
  );
}
