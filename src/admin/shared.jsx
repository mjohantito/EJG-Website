/* ── Shared admin UI components ── */
import { useState } from 'react';
import { uploadMedia } from '../lib/supabase';

export const S = {
  sidebar: { width: 220, background: '#1a1a2e', color: '#e2e2e2', height: '100vh', position: 'fixed', left: 0, top: 0, display: 'flex', flexDirection: 'column', zIndex: 100 },
  content: { marginLeft: 220, minHeight: '100vh', background: '#f4f5f7' },
  card:    { background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: '20px 24px' },
  th:      { padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' },
  td:      { padding: '12px 14px', fontSize: 14, color: '#374151', borderBottom: '1px solid #f3f4f6', verticalAlign: 'middle' },
  btn:     { padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600 },
  input:   { width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' },
  label:   { display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5, letterSpacing: '0.02em' },
  badge:   { fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, letterSpacing: '0.06em', textTransform: 'uppercase' },
};

export function AField({ label, hint, children, half }) {
  return (
    <div style={{ marginBottom: 16, width: half ? '48%' : '100%' }}>
      <label style={S.label}>{label}</label>
      {children}
      {hint && <span style={{ fontSize: 11, color: '#9ca3af', marginTop: 4, display: 'block' }}>{hint}</span>}
    </div>
  );
}

export function AInput({ value, onChange, placeholder, type = 'text', ...rest }) {
  return (
    <input
      style={S.input}
      type={type}
      value={value ?? ''}
      onChange={e => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
      placeholder={placeholder}
      {...rest}
    />
  );
}

export function ATextarea({ value, onChange, placeholder, rows = 4 }) {
  return (
    <textarea
      style={{ ...S.input, resize: 'vertical', lineHeight: 1.5 }}
      rows={rows}
      value={value ?? ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}

export function ASelect({ value, onChange, options }) {
  return (
    <select
      style={{ ...S.input, background: '#fff' }}
      value={value ?? ''}
      onChange={e => onChange(e.target.value)}
    >
      {options.map(o => (
        <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
      ))}
    </select>
  );
}

const PALETTES = ['ink', 'dusk', 'forest', 'warm', 'sky'];
const PALETTE_COLORS = { ink: '#252525', dusk: '#3b2d5e', forest: '#1d4729', warm: '#7c3a0e', sky: '#0d4f7c' };

export function PaletteSelect({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {PALETTES.map(p => (
        <button
          key={p}
          type="button"
          title={p}
          onClick={() => onChange(p)}
          style={{
            width: 36, height: 36, borderRadius: 8,
            background: PALETTE_COLORS[p],
            border: value === p ? '3px solid #F3D543' : '3px solid transparent',
            cursor: 'pointer', outline: 'none',
            boxShadow: value === p ? '0 0 0 2px #252525' : 'none',
            transition: 'all 120ms ease',
          }}
        />
      ))}
    </div>
  );
}

export function ListEditor({ items = [], onChange, placeholder = 'Item…' }) {
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const update = (i, val) => { const n = [...items]; n[i] = val; onChange(n); };
  const remove = (i) => onChange(items.filter((_, j) => j !== i));
  const add    = () => onChange([...items, '']);
  return (
    <div>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6, alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, flexShrink: 0 }}>
            <button type="button" onClick={() => move(i, -1)} disabled={i === 0}
              style={{ ...S.btn, padding: '1px 6px', fontSize: 10, background: '#f3f4f6', color: '#6b7280', opacity: i === 0 ? 0.3 : 1, lineHeight: '14px' }}>↑</button>
            <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1}
              style={{ ...S.btn, padding: '1px 6px', fontSize: 10, background: '#f3f4f6', color: '#6b7280', opacity: i === items.length - 1 ? 0.3 : 1, lineHeight: '14px' }}>↓</button>
          </div>
          <input
            style={{ ...S.input, flex: 1 }}
            value={item}
            onChange={e => update(i, e.target.value)}
            placeholder={placeholder}
          />
          <button type="button" onClick={() => remove(i)}
            style={{ ...S.btn, background: '#fee2e2', color: '#dc2626', padding: '0 10px', flexShrink: 0 }}>×</button>
        </div>
      ))}
      <button type="button" onClick={add}
        style={{ ...S.btn, background: '#f0f9ff', color: '#0369a1', fontSize: 12, marginTop: 2 }}>+ Tambah item</button>
    </div>
  );
}

export function Panel({ title, onClose, onSave, saving, children }) {
  return (
    <>
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 200 }}
      />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 480,
        background: '#fff', zIndex: 201, display: 'flex', flexDirection: 'column',
        boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
      }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111' }}>{title}</h3>
          <button onClick={onClose} style={{ ...S.btn, background: 'none', padding: '4px 8px', fontSize: 18, color: '#6b7280' }}>×</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {children}
        </div>
        <div style={{ padding: '16px 24px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: 10, justifyContent: 'flex-end', flexShrink: 0 }}>
          <button onClick={onClose} style={{ ...S.btn, background: '#f3f4f6', color: '#374151' }}>Batal</button>
          <button onClick={onSave} disabled={saving} style={{ ...S.btn, background: '#252525', color: '#F3D543', opacity: saving ? 0.6 : 1 }}>
            {saving ? 'Menyimpan…' : 'Simpan'}
          </button>
        </div>
      </div>
    </>
  );
}

export function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <>
      <div onClick={onCancel} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 300 }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        background: '#fff', borderRadius: 16, padding: '28px 32px', zIndex: 301,
        width: 360, boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      }}>
        <p style={{ margin: '0 0 20px', fontSize: 15, color: '#374151', lineHeight: 1.5 }}>{message}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{ ...S.btn, background: '#f3f4f6', color: '#374151' }}>Batal</button>
          <button onClick={onConfirm} style={{ ...S.btn, background: '#dc2626', color: '#fff' }}>Hapus</button>
        </div>
      </div>
    </>
  );
}

/* ── Image upload field (Supabase Storage or paste URL) ── */
export function ImageField({ value, onChange, folder = 'covers', label = 'Cover image' }) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setErr('');
    try {
      const url = await uploadMedia(file, folder);
      onChange(url);
    } catch (ex) {
      setErr('Upload gagal: ' + ex.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {value && (
        <div style={{ marginBottom: 10, position: 'relative', display: 'inline-block' }}>
          <img src={value} alt="preview" style={{ width: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e7eb', display: 'block' }} />
          <button
            type="button"
            onClick={() => onChange('')}
            style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: 6, padding: '2px 8px', cursor: 'pointer', fontSize: 13 }}
          >×</button>
        </div>
      )}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <label style={{ ...S.btn, background: '#f0f9ff', color: '#0369a1', cursor: 'pointer', display: 'inline-block', padding: '8px 14px', flexShrink: 0 }}>
          {uploading ? 'Mengupload…' : '↑ Upload'}
          <input type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} disabled={uploading} />
        </label>
        <span style={{ fontSize: 12, color: '#9ca3af' }}>atau</span>
        <input
          style={{ ...S.input, flex: 1 }}
          value={value ?? ''}
          onChange={e => onChange(e.target.value)}
          placeholder="Paste URL gambar…"
        />
      </div>
      {err && <p style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{err}</p>}
    </div>
  );
}

/* ── Gallery editor: array of image URLs ── */
export function GalleryEditor({ items = [], onChange, folder = 'gallery' }) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadMedia(file, folder);
      onChange([...items, url]);
    } catch {}
    finally { setUploading(false); }
  };

  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const remove = (i) => onChange(items.filter((_, j) => j !== i));
  const updateUrl = (i, val) => { const n = [...items]; n[i] = val; onChange(n); };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 10 }}>
        {items.map((url, i) => (
          <div key={i} style={{ position: 'relative' }}>
            {url ? (
              <img src={url} alt="" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e7eb' }} />
            ) : (
              <div style={{ width: '100%', aspectRatio: '4/3', background: '#f3f4f6', borderRadius: 8, border: '1px solid #e5e7eb', display: 'grid', placeItems: 'center', fontSize: 11, color: '#9ca3af' }}>No image</div>
            )}
            <button type="button" onClick={() => remove(i)}
              style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.55)', color: '#fff', border: 'none', borderRadius: 4, width: 22, height: 22, cursor: 'pointer', fontSize: 13, lineHeight: 1, display: 'grid', placeItems: 'center' }}>×</button>
            <div style={{ position: 'absolute', top: 4, left: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0}
                style={{ background: 'rgba(0,0,0,0.55)', color: '#fff', border: 'none', borderRadius: 4, width: 22, height: 18, cursor: 'pointer', fontSize: 10, display: 'grid', placeItems: 'center', opacity: i === 0 ? 0.3 : 1 }}>↑</button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1}
                style={{ background: 'rgba(0,0,0,0.55)', color: '#fff', border: 'none', borderRadius: 4, width: 22, height: 18, cursor: 'pointer', fontSize: 10, display: 'grid', placeItems: 'center', opacity: i === items.length - 1 ? 0.3 : 1 }}>↓</button>
            </div>
            <input
              style={{ ...S.input, fontSize: 10, padding: '4px 6px', marginTop: 4 }}
              value={url}
              onChange={e => updateUrl(i, e.target.value)}
              placeholder="URL…"
            />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <label style={{ ...S.btn, background: '#f0f9ff', color: '#0369a1', cursor: 'pointer', display: 'inline-block', padding: '8px 14px' }}>
          {uploading ? 'Mengupload…' : '↑ Upload foto'}
          <input type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} disabled={uploading} />
        </label>
        <button
          type="button"
          onClick={() => onChange([...items, ''])}
          style={{ ...S.btn, background: '#f3f4f6', color: '#374151' }}
        >+ URL</button>
      </div>
    </div>
  );
}

/* ── Price Tier Editor: [{ minPax, price }] total price per group size ── */
export function PriceTierEditor({ tiers = [], onChange, unit = 'malam' }) {
  const add    = () => onChange([...tiers, { minPax: 1, price: 0 }]);
  const remove = (i) => onChange(tiers.filter((_, j) => j !== i));
  const update = (i, key, val) => {
    const next = [...tiers];
    next[i] = { ...next[i], [key]: Number(val) };
    onChange(next);
  };
  return (
    <div>
      {tiers.length === 0 && (
        <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 8 }}>
          Belum ada tier. Jika kosong, harga dihitung dari field "Harga per {unit}" di atas.
        </p>
      )}
      {tiers.map((tier, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
          <div style={{ width: '40%' }}>
            <label style={{ ...S.label, fontSize: 10 }}>Min tamu</label>
            <input style={{ ...S.input, fontSize: 13 }} type="number" min={1} value={tier.minPax}
              onChange={e => update(i, 'minPax', e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ ...S.label, fontSize: 10 }}>Total harga (Rp) / {unit}</label>
            <input style={{ ...S.input, fontSize: 13 }} type="number" min={0} value={tier.price}
              onChange={e => update(i, 'price', e.target.value)} />
          </div>
          <button type="button" onClick={() => remove(i)}
            style={{ ...S.btn, background: '#fee2e2', color: '#dc2626', padding: '0 10px', marginTop: 16, flexShrink: 0 }}>×</button>
        </div>
      ))}
      <button type="button" onClick={add}
        style={{ ...S.btn, background: '#f0fdf4', color: '#16a34a', fontSize: 12 }}>+ Tambah tier</button>
      {tiers.length > 0 && (
        <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 8, lineHeight: 1.5 }}>
          Sistem otomatis pilih tier tertinggi yang ≤ jumlah tamu. Harga tampil ke user sebagai "per pax" (total ÷ tamu).
        </p>
      )}
    </div>
  );
}

export function ReorderButtons({ index, total, onMove }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      <button type="button" onClick={() => onMove(-1)} disabled={index === 0}
        style={{ ...S.btn, padding: '4px 7px', fontSize: 11, background: '#f3f4f6', color: '#6b7280', opacity: index === 0 ? 0.3 : 1 }}>↑</button>
      <button type="button" onClick={() => onMove(1)} disabled={index === total - 1}
        style={{ ...S.btn, padding: '4px 7px', fontSize: 11, background: '#f3f4f6', color: '#6b7280', opacity: index === total - 1 ? 0.3 : 1 }}>↓</button>
    </div>
  );
}

export function EmptyState({ icon, title, sub }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontWeight: 700, fontSize: 15, color: '#6b7280', marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13 }}>{sub}</div>
    </div>
  );
}
