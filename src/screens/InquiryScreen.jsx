import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UPCOMING_OPEN_TRIPS, PRIVATE_DESTINATIONS, GLAMPINGS } from '../data';
import Footer from '../components/Footer';

const PLACEHOLDER_NOTES = {
  open:      'Ada pertanyaan spesifik? Misal: ada extension ke kota terdekat, atau request dietary.',
  private:   'Kasih tau pengen apa aja — tipe akomodasi, hal yang pengen dilakuin, budget range.',
  glamping:  'Pengen tanggal mana? Ada request makanan atau butuh add-on (jeep, guide, BBQ)?',
  corporate: 'Jumlah peserta, rentang tanggal, objective acara, kota asal, dan budget range.',
};

export default function InquiryScreen({ onSubmit }) {
  const location = useLocation();
  const navigate = useNavigate();
  const ctx = location.state || {};

  const [kind, setKind] = useState(ctx.kind || 'open');
  const [name, setName] = useState('');
  const [wa, setWa] = useState('');
  const [pax, setPax] = useState(ctx.pax || 2);
  const [date, setDate] = useState('');
  const [dest, setDest] = useState(ctx.tripId || ctx.glampId || PRIVATE_DESTINATIONS[0].id);
  const [note, setNote] = useState('');

  const canSubmit = name.trim().length > 1 && wa.trim().length > 5;

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({ kind, name, wa, pax, date, dest, note });
    } else {
      navigate('/thanks', { state: { kind, name, wa, pax, date, dest, note } });
    }
  };

  return (
    <>
      <div className="page-header">
        <span className="eyebrow">Inquiry · 1x24 jam response</span>
        <h1 style={{ marginTop: 6 }}>
          Kita <span className="italic" style={{ fontStyle: 'italic', fontWeight: 500 }}>bales</span> dalam 24 jam<span className="q-stamp">.</span>
        </h1>
        <p className="lead">Isi form ini. Tim kita konfirmasi langsung via WhatsApp.</p>
      </div>

      <div style={{ padding: '0 20px 14px' }}>
        <label className="eyebrow" style={{ display: 'block', marginBottom: 8 }}>Jenis inquiry</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { id: 'open',      name: 'Open trip' },
            { id: 'private',   name: 'Private trip' },
            { id: 'glamping',  name: 'Glamping' },
            { id: 'corporate', name: 'Corporate' },
          ].map(k => (
            <button
              key={k.id}
              className={`radio-card${kind === k.id ? ' on' : ''}`}
              onClick={() => setKind(k.id)}
              style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '12px 8px' }}
            >
              <span className="k">{k.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="form">
        <div className="field">
          <label>Nama kamu</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Manuel Johan"
          />
        </div>

        <div className="field">
          <label>No. WhatsApp</label>
          <input
            value={wa}
            onChange={e => setWa(e.target.value)}
            placeholder="+62 812…"
            inputMode="tel"
          />
          <span className="hint">Kita bales via WA biar cepet.</span>
        </div>

        {(kind === 'open' || kind === 'private') && (
          <div className="field">
            <label>Destinasi</label>
            <select value={dest} onChange={e => setDest(e.target.value)}>
              {kind === 'open'
                ? UPCOMING_OPEN_TRIPS.map(t => (
                    <option key={t.id} value={t.id}>{t.dest} · {t.start}</option>
                  ))
                : PRIVATE_DESTINATIONS.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))
              }
            </select>
          </div>
        )}

        {kind === 'glamping' && (
          <div className="field">
            <label>Lokasi glamping</label>
            <select value={dest} onChange={e => setDest(e.target.value)}>
              {GLAMPINGS.map(g => (
                <option key={g.id} value={g.id}>{g.name} · {g.location.split(',')[0]}</option>
              ))}
            </select>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div className="field">
            <label>Jumlah orang</label>
            <div className="stepper">
              <button onClick={() => setPax(Math.max(1, pax - 1))}>−</button>
              <span className="v">{pax}</span>
              <button onClick={() => setPax(pax + 1)}>+</button>
            </div>
          </div>
          <div className="field">
            <label>Tanggal pengen</label>
            <input
              type="text"
              value={date}
              onChange={e => setDate(e.target.value)}
              placeholder={kind === 'open' ? 'Sesuai jadwal' : '14–15 Jun'}
            />
          </div>
        </div>

        <div className="field">
          <label>Request / catatan</label>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder={PLACEHOLDER_NOTES[kind]}
          />
        </div>

        <div style={{ background: 'var(--ejg-kertas-2)', border: '1px dashed var(--border-strong)', borderRadius: 14, padding: 14, fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.5 }}>
          <strong style={{ color: 'var(--ejg-ink)' }}>Fyi:</strong> kita cuma butuh info dasar. Detail (akomodasi, makanan, budget) bisa ngobrol santai via WA setelah ini.
        </div>

        <button
          className="btn btn-pri btn-block"
          disabled={!canSubmit}
          onClick={handleSubmit}
          style={{ opacity: canSubmit ? 1 : 0.45 }}
        >
          Kirim inquiry →
        </button>

        <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--fg-3)' }}>
          atau{' '}
          <a
            href={`https://wa.me/6285117322207`}
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
