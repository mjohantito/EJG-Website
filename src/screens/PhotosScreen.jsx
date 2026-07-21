import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Footer from '../components/Footer';
import NpsSelector from '../components/NpsSelector';

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
        >★</button>
      ))}
    </div>
  );
}

export default function PhotosScreen() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [album, setAlbum]       = useState(null);
  const [albumLoading, setAlbumLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [form, setForm]         = useState({ name: '', instagram: '', rating: 0, message: '', nps: null });
  const [submitting, setSub]    = useState(false);
  const [done, setDone]         = useState(false);
  const [error, setError]       = useState('');

  useEffect(() => {
    supabase.from('photo_albums').select('*').eq('slug', slug).single()
      .then(({ data, error: err }) => {
        if (err || !data) setNotFound(true);
        else setAlbum(data);
        setAlbumLoading(false);
      });
  }, [slug]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const canSubmit = form.rating > 0 && form.message.trim().length > 3 && !submitting;

  const handleSubmit = async () => {
    setSub(true);
    setError('');
    const instagram = form.instagram.trim().replace(/^@/, '');
    const messageBody = instagram
      ? `${form.message.trim()}\n\n— Instagram: @${instagram}`
      : form.message.trim();
    const { error: err } = await supabase.from('feedback').insert({
      name: form.name.trim() || null,
      rating: form.rating,
      message: messageBody,
      category: `Foto: ${album?.title || slug}`,
      nps_score: form.nps ?? null,
    });
    setSub(false);
    if (err) { setError('Gagal mengirim. Coba lagi ya.'); return; }
    setDone(true);
  };

  /* ── Loading state ── */
  if (albumLoading) {
    return (
      <div style={{ padding: 60, textAlign: 'center', color: 'var(--fg-3)' }}>
        Memuat…
      </div>
    );
  }

  /* ── Not found / inactive ── */
  if (notFound || !album?.active) {
    return (
      <>
        <div className="page-header" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>📷</div>
          <h1 style={{ marginTop: 0 }}>Album tidak ditemukan</h1>
          <p className="lead">Link ini tidak aktif atau sudah kedaluwarsa. Hubungi tim EJG untuk info lebih lanjut.</p>
        </div>
        <div style={{ padding: '0 20px 32px' }}>
          <button className="btn btn-pri btn-block" onClick={() => navigate('/')}>Balik ke beranda →</button>
        </div>
        <Footer onNav={(name) => navigate(`/${name === 'home' ? '' : name}`)} />
      </>
    );
  }

  const folderId  = album.drive_folder_id;
  const folderUrl = `https://drive.google.com/drive/folders/${folderId}`;
  const embedUrl  = `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`;

  /* ── Photos revealed (post-feedback) ── */
  if (done) {
    return (
      <>
        <div className="page-header" style={{ paddingBottom: 0 }}>
          <span className="eyebrow">Foto · {album.title}</span>
          <h1 style={{ marginTop: 6 }}>
            Makasih<span className="q-stamp">!</span>{' '}
            <span style={{ fontWeight: 400, fontSize: '0.65em', color: 'var(--fg-3)' }}>Ini foto-fotonya</span>
          </h1>
          {album.description && (
            <p className="lead" style={{ marginTop: 6 }}>{album.description}</p>
          )}
        </div>

        <div style={{ padding: '0 20px 14px' }}>
          <a
            href={folderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-pri btn-block"
            style={{ textAlign: 'center', textDecoration: 'none', display: 'block' }}
          >
            Buka di Google Drive →
          </a>
        </div>

        <div style={{ padding: '0 20px 0' }}>
          <div style={{ borderRadius: 18, overflow: 'hidden', border: '1.5px solid var(--border)', background: 'var(--ejg-kertas-2)' }}>
            <iframe
              src={embedUrl}
              style={{ width: '100%', height: '72vh', border: 'none', display: 'block' }}
              title={album.title}
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
        <span className="eyebrow">Foto · {album.title}</span>
        <h1 style={{ marginTop: 6 }}>
          Mau lihat foto<br />
          <span className="italic" style={{ fontStyle: 'italic', fontWeight: 500 }}>trip</span>
          {' '}kamu<span className="q-stamp">?</span>
        </h1>
        <p className="lead">
          {album.description
            ? album.description
            : 'Kasih feedback dulu — cuma butuh 30 detik, terus foto langsung terbuka!'}
        </p>
      </div>

      {/* Progress hint */}
      <div style={{ padding: '0 20px 4px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1, height: 4, background: 'var(--ejg-fog)', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: '50%', background: 'var(--ejg-ink)', borderRadius: 999 }} />
        </div>
        <span style={{ fontSize: 11, fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--fg-3)', whiteSpace: 'nowrap' }}>
          Langkah 1 dari 2
        </span>
      </div>

      <div className="form">
        <div className="field">
          <label>Rating pengalaman kamu <span style={{ color: '#C23B2A' }}>*</span></label>
          <StarRating value={form.rating} onChange={v => set('rating', v)} />
          {form.rating > 0 && (
            <span className="hint" style={{ marginTop: 6, fontWeight: 700, color: 'var(--ejg-ink)' }}>
              {RATING_LABELS[form.rating]}
            </span>
          )}
        </div>

        <div className="field">
          <label>Seberapa besar kemungkinan kamu rekomendasiin EJG ke teman atau keluarga?</label>
          <NpsSelector value={form.nps} onChange={v => set('nps', v)} />
        </div>

        <div className="field">
          <label>Cerita pengalamanmu <span style={{ color: '#C23B2A' }}>*</span></label>
          <textarea
            value={form.message}
            onChange={e => set('message', e.target.value)}
            rows={4}
            placeholder="Momen favorit, yang bisa lebih baik, atau apapun yang mau kamu share…"
          />
        </div>

        <div className="field">
          <label>Nama <span className="hint" style={{ marginLeft: 4 }}>(opsional)</span></label>
          <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nama kamu" />
        </div>

        <div className="field">
          <label>
            Instagram{' '}
            <span className="hint" style={{ marginLeft: 4 }}>(opsional — biar kita bisa tag kamu!)</span>
          </label>
          <div style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
              fontSize: 14, color: 'var(--fg-3)', fontFamily: 'var(--font-display)', fontWeight: 700,
              pointerEvents: 'none', userSelect: 'none',
            }}>@</span>
            <input
              value={form.instagram}
              onChange={e => set('instagram', e.target.value.replace(/^@/, ''))}
              placeholder="username"
              style={{ paddingLeft: 28 }}
            />
          </div>
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
