import { useState } from 'react';
import { useData } from '../context/DataContext';
import { uploadMedia } from '../lib/supabase';

function isOptimizable(url) {
  if (!url || typeof url !== 'string') return false;
  if (url.endsWith('.webp')) return false;
  if (url.endsWith('.svg') || url.endsWith('.gif')) return false;
  if (!url.includes('supabase.co/storage')) return false;
  return true;
}

function collectUrls(openTrips, glampings, privateDestinations, events, siteSettings) {
  const found = new Map();
  const add = (url, label) => {
    if (!isOptimizable(url)) return;
    if (!found.has(url)) found.set(url, []);
    found.get(url).push(label);
  };
  openTrips.forEach(t => {
    add(t.cover, `Open Trip: ${t.dest} (cover)`);
    (t.gallery || []).forEach((u, i) => add(u, `Open Trip: ${t.dest} (gallery ${i + 1})`));
  });
  glampings.forEach(g => {
    add(g.cover, `Glamping: ${g.name} (cover)`);
    (g.gallery || []).forEach((u, i) => add(u, `Glamping: ${g.name} (gallery ${i + 1})`));
  });
  privateDestinations.forEach(p => {
    add(p.cover, `Private: ${p.name} (cover)`);
    (p.gallery || []).forEach((u, i) => add(u, `Private: ${p.name} (gallery ${i + 1})`));
  });
  events.forEach(e => add(e.cover, `Event: ${e.name} (cover)`));
  Object.entries(siteSettings).forEach(([key, val]) => {
    if (typeof val === 'string' && isOptimizable(val)) add(val, `Setting: ${key}`);
  });
  return found;
}

function applyUrlMap(arr, urlMap) {
  return arr.map(item => ({
    ...item,
    ...(item.cover && urlMap[item.cover] ? { cover: urlMap[item.cover] } : {}),
    ...(item.gallery ? { gallery: item.gallery.map(u => urlMap[u] || u) } : {}),
  }));
}

const BTN = (extra = {}) => ({
  border: 'none', borderRadius: 10, cursor: 'pointer',
  fontFamily: 'inherit', fontSize: 14, fontWeight: 700,
  padding: '12px 24px', ...extra,
});

export default function OptimizeImages() {
  const {
    openTrips, glampings, privateDestinations, events, siteSettings,
    setOpenTrips, setGlampings, setPrivateDestinations, setEvents, updateSetting,
  } = useData();

  const [phase, setPhase] = useState('idle'); // idle | scanned | optimizing | done
  const [items, setItems] = useState([]);
  const [processed, setProcessed] = useState(0);
  const [urlMap, setUrlMap] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const scan = () => {
    const found = collectUrls(openTrips, glampings, privateDestinations, events, siteSettings);
    setItems(Array.from(found.entries()).map(([url, sources]) => ({ url, sources, status: 'pending' })));
    setUrlMap({});
    setSaved(false);
    setPhase('scanned');
  };

  const optimize = async () => {
    setPhase('optimizing');
    setProcessed(0);
    const map = {};
    const updated = items.map(i => ({ ...i }));

    for (let i = 0; i < updated.length; i++) {
      updated[i].status = 'processing';
      setItems([...updated]);
      try {
        const res = await fetch(updated[i].url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const blob = await res.blob();
        const filename = updated[i].url.split('/').pop().split('?')[0] || 'image.jpg';
        const file = new File([blob], filename, { type: blob.type });
        const newUrl = await uploadMedia(file, 'optimized');
        map[updated[i].url] = newUrl;
        updated[i].status = 'done';
        updated[i].newUrl = newUrl;
      } catch (err) {
        updated[i].status = 'error';
        updated[i].error = err.message;
      }
      setProcessed(i + 1);
      setItems([...updated]);
    }

    setUrlMap(map);
    setPhase('done');
  };

  const applyChanges = async () => {
    setSaving(true);
    await setOpenTrips(applyUrlMap(openTrips, urlMap));
    await setGlampings(applyUrlMap(glampings, urlMap));
    await setPrivateDestinations(applyUrlMap(privateDestinations, urlMap));
    await setEvents(applyUrlMap(events, urlMap));
    for (const [key, val] of Object.entries(siteSettings)) {
      if (typeof val === 'string' && urlMap[val]) await updateSetting(key, urlMap[val]);
    }
    setSaving(false);
    setSaved(true);
  };

  const doneCount = items.filter(i => i.status === 'done').length;
  const errorCount = items.filter(i => i.status === 'error').length;
  const pct = items.length ? Math.round((processed / items.length) * 100) : 0;
  const hasSuccesses = doneCount > 0;

  return (
    <div style={{ maxWidth: 700 }}>
      <h2 style={{ marginBottom: 6 }}>Optimize Images</h2>
      <p style={{ color: '#64748b', marginBottom: 28 }}>
        Compress dan convert gambar lama ke WebP supaya website lebih cepat. Proses ini tidak menghapus file lama.
      </p>

      {/* Action buttons */}
      {(phase === 'idle' || phase === 'scanned' || phase === 'done') && (
        <button onClick={scan} style={BTN({ background: '#1a1a2e', color: '#fff', marginBottom: 20 })}>
          {phase === 'idle' ? 'Scan gambar sekarang' : 'Scan ulang'}
        </button>
      )}

      {phase === 'scanned' && items.length > 0 && (
        <button onClick={optimize} style={BTN({ background: '#16a34a', color: '#fff', marginLeft: 10, marginBottom: 20 })}>
          Optimize {items.length} gambar →
        </button>
      )}

      {/* Scan result summary */}
      {phase === 'scanned' && (
        <div style={{ background: '#f1f5f9', borderRadius: 12, padding: '14px 18px', marginBottom: 20, fontSize: 14 }}>
          {items.length === 0
            ? 'Semua gambar sudah WebP — tidak ada yang perlu dioptimasi.'
            : <><strong>{items.length}</strong> gambar ditemukan yang belum WebP.</>}
        </div>
      )}

      {/* Progress bar */}
      {(phase === 'optimizing' || phase === 'done') && (
        <div style={{ background: '#f1f5f9', borderRadius: 12, padding: '16px 18px', marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
            <span>
              {phase === 'optimizing'
                ? `Memproses ${processed} / ${items.length}…`
                : `Selesai — ${doneCount} berhasil${errorCount ? `, ${errorCount} gagal` : ''}`}
            </span>
            <span style={{ fontWeight: 700, color: '#16a34a' }}>{pct}%</span>
          </div>
          <div style={{ height: 8, background: '#e2e8f0', borderRadius: 999 }}>
            <div style={{ height: '100%', background: '#16a34a', borderRadius: 999, width: `${pct}%`, transition: 'width 300ms ease' }} />
          </div>
        </div>
      )}

      {/* Apply changes button */}
      {phase === 'done' && hasSuccesses && !saved && (
        <button
          onClick={applyChanges}
          disabled={saving}
          style={BTN({ background: '#2563eb', color: '#fff', marginBottom: 20, opacity: saving ? 0.65 : 1, cursor: saving ? 'not-allowed' : 'pointer' })}
        >
          {saving ? 'Menyimpan…' : `Simpan — update ${doneCount} URL di database →`}
        </button>
      )}

      {saved && (
        <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#166534', fontWeight: 600, fontSize: 14 }}>
          Semua URL berhasil diupdate di database!
        </div>
      )}

      {/* Image list */}
      {items.length > 0 && (
        <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
          {items.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px', borderBottom: idx < items.length - 1 ? '1px solid #f1f5f9' : 'none', background: '#fff' }}>
              <div style={{ width: 18, textAlign: 'center', flexShrink: 0, fontSize: 15 }}>
                {item.status === 'pending'    && <span style={{ color: '#cbd5e1' }}>○</span>}
                {item.status === 'processing' && <span style={{ color: '#f59e0b' }}>◌</span>}
                {item.status === 'done'       && <span style={{ color: '#16a34a' }}>✓</span>}
                {item.status === 'error'      && <span style={{ color: '#dc2626' }}>✗</span>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, color: '#475569', marginBottom: 1 }}>{item.sources.join(' · ')}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.url.split('/').pop().split('?')[0]}
                </div>
                {item.error && <div style={{ fontSize: 11, color: '#dc2626', marginTop: 2 }}>{item.error}</div>}
              </div>
              {item.status === 'done' && (
                <div style={{ fontSize: 11, color: '#16a34a', flexShrink: 0 }}>WebP ✓</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
