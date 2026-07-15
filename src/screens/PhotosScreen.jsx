import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Footer from '../components/Footer';

const FOLDER_ID = '146s1DdMRBPon8Z5PIFL0tcYYz6ty5j3F';
const FOLDER_URL = `https://drive.google.com/drive/folders/${FOLDER_ID}`;
const EMBED_URL  = `https://drive.google.com/embeddedfolderview?id=${FOLDER_ID}#grid`;

const RATING_LABELS = { 1: 'Sangat kecewa', 2: 'Kurang puas', 3: 'Cukup oke', 4: 'Puas banget', 5: 'Luar biasa!' };

function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 2,
            fontSize: 40, lineHeight: 1,
            color: star <= (hover || value) ? '#F3D543' : '#c8cdd6',
            filter: star <= (hover || value) ? 'drop-shadow(0 0 5px rgba(243,213,67,0.55))' : 'none',
            transition: 'color 80ms ease, filter 80ms ease',
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function PhotosScreen() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ name: '', rating: 0, message: '' });
  const [submitting, setSub]  = useState(false);
  const [done, setDone]       = useState(false);
  const [error, setError]     = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const canSubmit = form.rating > 0 && form.message.trim().length > 3 && !submitting;

  const handleSubmit = async () => {
    setSub(true);
    setError('');
    const { error: err } = await supabase.from('feedback').insert({
      name: form.name.trim() || null,
      rating: form.rating,
      message: form.message.trim(),
      category: 'Foto Trip',
    });
    setSub(false);
    if (err) { setError('Gagal mengirim feedback. Coba lagi ya.'); return; }
    setDone(true);
  };

  /* ── Photos view (after feedback submitted) ── */
  if (done) {
    return (
      <>
        <div className="page-header" style={{ paddingBottom: 0 }}>
          <span className="eyebrow">Foto Trip · EH! JADI GA?</span>
          <h1 style={{ marginTop: 6 }}>
            Makasih<span className="q-stamp">!</span>{' '}
            <span style={{ fontWeight: 400, fontSize: '0.65em', color: 'var(--fg-3)' }}>Ini foto-fotonya</span>
          </h1>
        </div>

        <div style={{ padding: '0 20px 14px', display: 'flex', gap: 10 }}>
          <a
            href={FOLDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-pri"
            style={{ flex: 1, textAlign: 'center', textDecoration: 'none', display: 'block' }}
          >
            Buka di Google Drive →
          </a>
        </div>

        <div style={{ padding: '0 20px 0' }}>
          <div style={{
            borderRadius: 18, overflow: 'hidden',
            border: '1.5px solid var(--border)',
            background: 'var(--ejg-kertas-2)',
          }}>
            <iframe
              src={EMBED_URL}
              style={{ width: '100%', height: '72vh', border: 'none', display: 'block' }}
              title="Foto Trip"
              allowFullScreen
            />
          </div>
          <p style={{ marginTop: 10, fontSize: 12, color: 'var(--fg-3)', textAlign: 'center' }}>
            Foto tidak tampil? Tap tombol di atas untuk buka langsung di Drive.
          </p>
        </div>

        <Footer onNav={(name) => navigate(`/${name === 'home' ? '' : name}`)} />
      </>
    );
  }

  /* ── Feedback gate ── */
  return (
    <>
      <div className="page-header">
        <span className="eyebrow">Foto Trip · Buka memori bersama EJG</span>
        <h1 style={{ marginTop: 6 }}>
          Mau lihat foto<br />
          <span className="italic" style={{ fontStyle: 'italic', fontWeight: 500 }}>trip</span>
          {' '}kamu<span className="q-stamp">?</span>
        </h1>
        <p className="lead">
          Kasih feedback dulu — cuma butuh 30 detik, terus foto langsung terbuka!
        </p>
      </div>

      {/* Progress hint */}
      <div style={{ padding: '0 20px 4px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1, height: 4, background: 'var(--ejg-fog)', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: '50%', background: 'var(--ejg-ink)', borderRadius: 999, transition: 'width 300ms ease' }} />
        </div>
        <span style={{ fontSize: 11, fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--fg-3)', whiteSpace: 'nowrap' }}>
          Langkah 1 dari 2
        </span>
      </div>

      <div className="form">
        {/* Star rating */}
        <div className="field">
          <label>
            Rating pengalaman kamu{' '}
            <span style={{ color: '#C23B2A' }}>*</span>
          </label>
          <StarRating value={form.rating} onChange={v => set('rating', v)} />
          {form.rating > 0 && (
            <span className="hint" style={{ marginTop: 6, fontWeight: 700, color: 'var(--ejg-ink)' }}>
              {RATING_LABELS[form.rating]}
            </span>
          )}
        </div>

        {/* Message */}
        <div className="field">
          <label>
            Cerita pengalamanmu{' '}
            <span style={{ color: '#C23B2A' }}>*</span>
          </label>
          <textarea
            value={form.message}
            onChange={e => set('message', e.target.value)}
            rows={4}
            placeholder="Momen favorit, yang bisa lebih baik, atau apapun yang mau kamu share…"
          />
        </div>

        {/* Name */}
        <div className="field">
          <label>
            Nama{' '}
            <span className="hint" style={{ marginLeft: 4 }}>(opsional)</span>
          </label>
          <input
            value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder="Nama kamu"
          />
        </div>

        {error && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fca5a5',
            borderRadius: 12, padding: '12px 16px', fontSize: 13, color: '#dc2626',
          }}>
            {error}
          </div>
        )}

        <button
          type="button"
          className="btn btn-pri btn-block"
          disabled={!canSubmit}
          onClick={handleSubmit}
          style={{ opacity: canSubmit ? 1 : 0.45 }}
        >
          {submitting ? 'Mengirim…' : 'Kirim & Lihat Foto →'}
        </button>

        <p style={{ fontSize: 12, color: 'var(--fg-3)', textAlign: 'center', margin: '4px 0 0' }}>
          Feedback kamu anonymous kalau nama dikosongkan.
        </p>
      </div>

      <Footer onNav={(name) => navigate(`/${name === 'home' ? '' : name}`)} />
    </>
  );
}
