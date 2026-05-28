import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Footer from '../components/Footer';

const CATEGORIES = ['Glamping', 'Open Trip', 'Private Trip', 'Pelayanan & Tim', 'Lainnya'];

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
            fontSize: 36, lineHeight: 1,
            color: star <= (hover || value) ? '#F3D543' : '#c8cdd6',
            filter: star <= (hover || value) ? 'drop-shadow(0 0 4px rgba(243,213,67,0.5))' : 'none',
            textShadow: star <= (hover || value) ? 'none' : '0 1px 2px rgba(0,0,0,0.15)',
            transition: 'all 100ms ease',
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
}

const RATING_LABELS = { 1: 'Sangat kecewa', 2: 'Kurang puas', 3: 'Cukup oke', 4: 'Puas banget', 5: 'Luar biasa!' };

export default function FeedbackScreen() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', rating: 0, category: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const canSubmit = form.rating > 0 && form.message.trim().length > 3 && !submitting;

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    const { error: err } = await supabase.from('feedback').insert({
      name: form.name.trim() || null,
      email: form.email.trim() || null,
      rating: form.rating,
      category: form.category || null,
      message: form.message.trim(),
    });
    setSubmitting(false);
    if (err) { setError('Gagal mengirim feedback. Coba lagi ya.'); return; }
    setDone(true);
  };

  if (done) {
    return (
      <>
        <div className="page-header" style={{ textAlign: 'center', paddingBottom: 12 }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>🙏</div>
          <h1 style={{ marginTop: 0 }}>Makasih banget<span className="q-stamp">!</span></h1>
          <p className="lead">Feedback kamu beneran berarti buat kami. Kita terus improve berkat masukan kayak gini.</p>
        </div>
        <div style={{ padding: '0 20px 32px', display: 'flex', gap: 10, flexDirection: 'column' }}>
          <button className="btn btn-pri btn-block" onClick={() => navigate('/')}>Balik ke beranda →</button>
          <button className="btn btn-sec btn-block" onClick={() => { setDone(false); setForm({ name: '', email: '', rating: 0, category: '', message: '' }); }}>
            Kirim feedback lagi
          </button>
        </div>
        <Footer onNav={(name) => navigate(`/${name === 'home' ? '' : name}`)} />
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <span className="eyebrow">Feedback · Cerita pengalamanmu</span>
        <h1 style={{ marginTop: 6 }}>
          Gimana pengalaman<br />
          kamu bareng <span className="italic" style={{ fontStyle: 'italic', fontWeight: 500 }}>EJG</span><span className="q-stamp">?</span>
        </h1>
        <p className="lead">Jujur aja — baik buruknya, kita dengerin semua.</p>
      </div>

      <div className="form">
        {/* Star rating */}
        <div className="field">
          <label>Rating kamu <span style={{ color: '#C23B2A' }}>*</span></label>
          <StarRating value={form.rating} onChange={v => set('rating', v)} />
          {form.rating > 0 && (
            <span className="hint" style={{ marginTop: 6, fontWeight: 700, color: 'var(--ejg-ink)' }}>
              {RATING_LABELS[form.rating]}
            </span>
          )}
        </div>

        {/* Category */}
        <div className="field">
          <label>Kategori feedback</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => set('category', form.category === cat ? '' : cat)}
                style={{
                  padding: '8px 14px', borderRadius: 999, cursor: 'pointer', fontSize: 13,
                  border: form.category === cat ? '2px solid var(--ejg-ink)' : '1.5px solid var(--border)',
                  background: form.category === cat ? 'var(--ejg-ink)' : 'transparent',
                  color: form.category === cat ? 'var(--ejg-matahari)' : 'var(--fg-2)',
                  fontFamily: 'var(--font-display)', fontWeight: 700,
                  transition: 'all 140ms ease',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div className="field">
          <label>Cerita kamu <span style={{ color: '#C23B2A' }}>*</span></label>
          <textarea
            value={form.message}
            onChange={e => set('message', e.target.value)}
            rows={5}
            placeholder="Ceritain pengalamanmu — momen favorit, yang bisa lebih baik, atau apapun yang mau kamu share…"
          />
        </div>

        {/* Name */}
        <div className="field">
          <label>Nama <span className="hint" style={{ marginLeft: 4 }}>(opsional)</span></label>
          <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nama kamu" />
        </div>

        {/* Email / WA */}
        <div className="field">
          <label>Email atau WA <span className="hint" style={{ marginLeft: 4 }}>(opsional)</span></label>
          <input value={form.email} onChange={e => set('email', e.target.value)} placeholder="Biar kita bisa follow-up kalau perlu" />
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 12, padding: '12px 16px', fontSize: 13, color: '#dc2626' }}>
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
          {submitting ? 'Mengirim…' : 'Kirim feedback →'}
        </button>

        <p style={{ fontSize: 12, color: 'var(--fg-3)', textAlign: 'center', margin: '4px 0 0' }}>
          Feedback kamu anonymous kalau nama & kontak dikosongkan.
        </p>
      </div>

      <Footer onNav={(name) => navigate(`/${name === 'home' ? '' : name}`)} />
    </>
  );
}
