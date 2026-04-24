/* ── Shared admin UI components ── */

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
  const update = (i, val) => { const n = [...items]; n[i] = val; onChange(n); };
  const remove = (i) => onChange(items.filter((_, j) => j !== i));
  const add    = () => onChange([...items, '']);
  return (
    <div>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
          <input
            style={{ ...S.input, flex: 1 }}
            value={item}
            onChange={e => update(i, e.target.value)}
            placeholder={placeholder}
          />
          <button
            type="button"
            onClick={() => remove(i)}
            style={{ ...S.btn, background: '#fee2e2', color: '#dc2626', padding: '0 10px', flexShrink: 0 }}
          >×</button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        style={{ ...S.btn, background: '#f0f9ff', color: '#0369a1', fontSize: 12, marginTop: 2 }}
      >+ Tambah item</button>
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

export function EmptyState({ icon, title, sub }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontWeight: 700, fontSize: 15, color: '#6b7280', marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13 }}>{sub}</div>
    </div>
  );
}
