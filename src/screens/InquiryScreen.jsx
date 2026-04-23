import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UPCOMING_OPEN_TRIPS, PRIVATE_DESTINATIONS, GLAMPINGS, WHATSAPP } from '../data';
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

const BUDGET_OPTIONS = [
  'Di bawah Rp 5 juta',
  'Rp 5–10 juta',
  'Rp 10–25 juta',
  'Rp 25–50 juta',
  'Di atas Rp 50 juta',
  'Belum tahu / fleksibel',
];

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

/* ── Open / Private trip fields ── */
function TripFields({ kind, state, set }) {
  const selectedTrip = UPCOMING_OPEN_TRIPS.find(t => t.id === state.tripId);
  const avail = selectedTrip ? selectedTrip.slots : null;
  const low = avail !== null && avail <= 3;

  return (
    <>
      <Field label="Nama lengkap">
        <input value={state.name} onChange={e => set('name', e.target.value)} placeholder="Manuel Johan" />
      </Field>
      <Field label="Email" hint="Konfirmasi akan dikirim ke email ini.">
        <input type="email" value={state.email} onChange={e => set('email', e.target.value)} placeholder="kamu@email.com" />
      </Field>
      <Field label="No. WhatsApp" hint="Kita bales via WA biar cepet.">
        <input value={state.wa} onChange={e => set('wa', e.target.value)} placeholder="+62 812…" inputMode="tel" />
      </Field>

      {kind === 'open' ? (
        <Field label="Pilih trip">
          <select value={state.tripId} onChange={e => set('tripId', e.target.value)}>
            {UPCOMING_OPEN_TRIPS.map(t => (
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
      ) : (
        <Field label="Destinasi">
          <select value={state.privateDest} onChange={e => set('privateDest', e.target.value)}>
            {PRIVATE_DESTINATIONS.map(d => (
              <option key={d.id} value={d.id}>{d.emoji} {d.name} — {d.sub}</option>
            ))}
          </select>
        </Field>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Stepper label="Jumlah tamu" value={state.pax} onChange={v => set('pax', v)} min={1} max={50} />
        <Field label="Tanggal">
          <input
            type="date"
            value={state.date}
            min={TODAY}
            onChange={e => set('date', e.target.value)}
          />
        </Field>
      </div>

      <Field label="Catatan / request">
        <textarea
          value={state.notes}
          onChange={e => set('notes', e.target.value)}
          placeholder="Ada hal spesifik yang perlu kami tahu? Dietary, aksesibilitas, request khusus…"
        />
      </Field>
    </>
  );
}

/* ── Corporate fields ── */
function CorporateFields({ state, set }) {
  return (
    <>
      <Field label="Nama lengkap">
        <input value={state.name} onChange={e => set('name', e.target.value)} placeholder="Budi Santoso" />
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
        <textarea
          value={state.notes}
          onChange={e => set('notes', e.target.value)}
          placeholder="Ceritain lebih detail tentang kebutuhan acara kamu — akomodasi, transportasi, kegiatan khusus, dll."
        />
      </Field>
    </>
  );
}

/* ── Glamping fields ── */
function GlampingFields({ state, set }) {
  const rule = GLAMP_AVAIL[state.glampLoc];
  const avStatus = dateAvailability(state.date, state.glampLoc);

  return (
    <>
      <Field label="Nama lengkap">
        <input value={state.name} onChange={e => set('name', e.target.value)} placeholder="Manuel Johan" />
      </Field>
      <Field label="Email">
        <input type="email" value={state.email} onChange={e => set('email', e.target.value)} placeholder="kamu@email.com" />
      </Field>
      <Field label="No. WhatsApp" hint="Kita bales via WA biar cepet.">
        <input value={state.wa} onChange={e => set('wa', e.target.value)} placeholder="+62 812…" inputMode="tel" />
      </Field>

      <Field label="Lokasi glamping">
        <select value={state.glampLoc} onChange={e => { set('glampLoc', e.target.value); set('date', ''); }}>
          {GLAMPINGS.map(g => (
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

      <Stepper label="Jumlah tamu" value={state.pax} onChange={v => set('pax', v)} min={1} max={20} />

      <Field label="Tanggal check-in">
        <input
          type="date"
          value={state.date}
          min={TODAY}
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

      <Field label="Catatan / request">
        <textarea
          value={state.notes}
          onChange={e => set('notes', e.target.value)}
          placeholder="Ada request makanan, butuh add-on BBQ, atau hal lain yang perlu kami siapkan?"
        />
      </Field>
    </>
  );
}

/* ── Main screen ── */
export default function InquiryScreen({ onSubmit }) {
  const location = useLocation();
  const navigate = useNavigate();
  const ctx = location.state || {};

  const [kind, setKind] = useState(
    ['open', 'private', 'glamping'].includes(ctx.kind) ? ctx.kind : 'open'
  );
  const [form, setForm] = useState({
    name: '',
    email: '',
    wa: '',
    pax: ctx.pax || 1,
    date: '',
    notes: '',
    // open trip
    tripId: ctx.tripId || UPCOMING_OPEN_TRIPS[0].id,
    // private trip
    privateDest: ctx.dest || PRIVATE_DESTINATIONS[0].id,
    // corporate
    jobTitle: '',
    company: '',
    companyAddress: '',
    budget: '',
    tripDest: '',
    tripPurpose: '',
    // glamping
    glampLoc: ctx.glampId || GLAMPINGS[0].id,
  });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const glampDateStatus = dateAvailability(form.date, form.glampLoc);

  const canSubmit = (() => {
    const base = form.name.trim().length > 1 && form.email.trim().length > 3 && form.wa.trim().length > 5;
    if (!base) return false;
    if (kind === 'glamping') return glampDateStatus !== 'unavailable';
    return true;
  })();

  const handleSubmit = () => {
    const payload = { kind, ...form };
    if (onSubmit) {
      onSubmit(payload);
    } else {
      navigate('/thanks', { state: payload });
    }
  };

  const submitLabel = 'Kirim inquiry →';

  return (
    <>
      <div className="page-header">
        <span className="eyebrow">Inquiry · Respons 1×24 jam</span>
        <h1 style={{ marginTop: 6 }}>
          Kita <span className="italic" style={{ fontStyle: 'italic', fontWeight: 500 }}>bales</span> dalam 24 jam<span className="q-stamp">.</span>
        </h1>
        <p className="lead">Isi form ini. Tim kita konfirmasi langsung via WhatsApp.</p>
      </div>

      <div style={{ padding: '0 20px 14px' }}>
        <label className="eyebrow" style={{ display: 'block', marginBottom: 8 }}>Jenis inquiry</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { id: 'open',     label: 'Open trip' },
            { id: 'private',  label: 'Private trip' },
            { id: 'glamping', label: 'Glamping' },
          ].map(k => (
            <button
              key={k.id}
              type="button"
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
        {(kind === 'open' || kind === 'private') && (
          <TripFields kind={kind} state={form} set={set} />
        )}
        {kind === 'glamping' && (
          <GlampingFields state={form} set={set} />
        )}

        <div style={{ background: 'var(--ejg-kertas-2)', border: '1px dashed var(--border-strong)', borderRadius: 14, padding: 14, fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.5 }}>
          <strong style={{ color: 'var(--ejg-ink)' }}>Fyi:</strong> kita cuma butuh info dasar dulu.
          Detail lanjutan bisa ngobrol santai via WA setelah ini.
        </div>

        <button
          type="button"
          className="btn btn-pri btn-block"
          disabled={!canSubmit}
          onClick={handleSubmit}
          style={{ opacity: canSubmit ? 1 : 0.45 }}
        >
          {submitLabel}
        </button>

        <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--fg-3)' }}>
          atau{' '}
          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noreferrer"
            style={{ color: 'var(--ejg-ink)', fontFamily: 'var(--font-display)', fontWeight: 700, textDecoration: 'underline' }}
          >
            chat langsung di WA
          </a>
        </div>
      </div>

      <Footer onNav={(name) => navigate(`/${name === 'home' ? '' : name}`)} />
    </>
  );
}
