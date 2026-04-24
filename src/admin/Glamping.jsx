import { useState } from 'react';
import { useData } from '../context/DataContext';
import { S, AField, AInput, ATextarea, ASelect, PaletteSelect, ListEditor, ImageField, GalleryEditor, Panel, ConfirmModal, EmptyState } from './shared';

const BLANK_ADDON = { id: '', label: '', price: 0, desc: '' };

const BLANK = {
  id: '', name: '', location: '', palette: 'forest', emoji: '', cover: '', tag: '',
  price: '', pricePerNight: 0, unit: 'malam', cap: '', availability: 'Buka setiap hari',
  closedDays: [], tagline: '', description: '', amenities: [], gallery: [], addons: [],
};

function AddonEditor({ addons, onChange }) {
  const update = (i, key, val) => {
    const next = [...addons];
    next[i] = { ...next[i], [key]: key === 'price' ? Number(val) : val };
    onChange(next);
  };
  const remove = (i) => onChange(addons.filter((_, j) => j !== i));
  const add = () => onChange([...addons, { ...BLANK_ADDON, id: `addon-${Date.now()}` }]);

  return (
    <div>
      {addons.map((a, i) => (
        <div key={i} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: '12px 14px', marginBottom: 10 }}>
          <div style={{ display: 'flex', gap: '3%', flexWrap: 'wrap' }}>
            <div style={{ width: '48%' }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: 4 }}>Label</label>
              <input style={{ ...S.input, fontSize: 13 }} value={a.label} onChange={e => update(i, 'label', e.target.value)} placeholder="BBQ Set" />
            </div>
            <div style={{ width: '48%' }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: 4 }}>Harga (Rp)</label>
              <input style={{ ...S.input, fontSize: 13 }} type="number" value={a.price} onChange={e => update(i, 'price', e.target.value)} />
            </div>
          </div>
          <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
            <input style={{ ...S.input, fontSize: 13, flex: 1 }} value={a.desc} onChange={e => update(i, 'desc', e.target.value)} placeholder="Deskripsi singkat…" />
            <button type="button" onClick={() => remove(i)} style={{ ...S.btn, background: '#fef2f2', color: '#dc2626', padding: '0 10px', flexShrink: 0 }}>×</button>
          </div>
        </div>
      ))}
      <button type="button" onClick={add} style={{ ...S.btn, background: '#f0f9ff', color: '#0369a1', fontSize: 12 }}>+ Tambah add-on</button>
    </div>
  );
}

export default function AdminGlamping() {
  const { glampings, setGlampings, deleteGlamping } = useData();
  const [panel, setPanel] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);

  const openAdd = () => { setDraft({ ...BLANK, amenities: [], gallery: [], addons: [], closedDays: [] }); setPanel({ mode: 'add' }); };
  const openEdit = (item) => { setDraft({ ...item }); setPanel({ mode: 'edit', id: item.id }); };
  const set = (key, val) => setDraft(d => ({ ...d, [key]: val }));

  const save = async () => {
    setSaving(true);
    if (panel.mode === 'add') {
      await setGlampings([...glampings, draft]);
    } else {
      await setGlampings(glampings.map(g => g.id === panel.id ? draft : g));
    }
    setSaving(false);
    setPanel(null);
  };

  const confirmDelete = async () => {
    await deleteGlamping(deleteId);
    setDeleteId(null);
  };

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1100 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#111' }}>Glamping</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>{glampings.length} lokasi terdaftar</p>
        </div>
        <button onClick={openAdd} style={{ ...S.btn, background: '#252525', color: '#F3D543', padding: '10px 20px' }}>+ Tambah Lokasi</button>
      </div>

      <div style={S.card}>
        {glampings.length === 0 ? (
          <EmptyState icon="🏕️" title="Belum ada lokasi glamping" sub="Klik '+ Tambah Lokasi' untuk mulai." />
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={S.th}>Nama</th>
                <th style={S.th}>Lokasi</th>
                <th style={S.th}>Harga/malam</th>
                <th style={S.th}>Kapasitas</th>
                <th style={S.th}>Ketersediaan</th>
                <th style={S.th}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {glampings.map(g => (
                <tr key={g.id}>
                  <td style={S.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {g.cover
                        ? <img src={g.cover} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                        : <span style={{ fontSize: 20 }}>{g.emoji}</span>
                      }
                      <div>
                        <div style={{ fontWeight: 600 }}>{g.name}</div>
                        {g.tag && <span style={{ ...S.badge, background: '#fef9c3', color: '#854d0e' }}>{g.tag}</span>}
                      </div>
                    </div>
                  </td>
                  <td style={S.td}>{g.location}</td>
                  <td style={S.td}>Rp {g.price}</td>
                  <td style={S.td}>{g.cap}</td>
                  <td style={S.td}>
                    <span style={{ ...S.badge, background: g.closedDays?.length ? '#fef2f2' : '#f0fdf4', color: g.closedDays?.length ? '#dc2626' : '#16a34a' }}>
                      {g.availability}
                    </span>
                  </td>
                  <td style={S.td}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => openEdit(g)} style={{ ...S.btn, background: '#f0f9ff', color: '#0369a1', padding: '5px 12px' }}>Edit</button>
                      <button onClick={() => setDeleteId(g.id)} style={{ ...S.btn, background: '#fef2f2', color: '#dc2626', padding: '5px 12px' }}>Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {panel && draft && (
        <Panel title={panel.mode === 'add' ? 'Tambah Lokasi Glamping' : 'Edit Lokasi Glamping'} onClose={() => setPanel(null)} onSave={save} saving={saving}>
          <div style={{ display: 'flex', gap: '4%', flexWrap: 'wrap' }}>
            <AField label="ID (unik)" half><AInput value={draft.id} onChange={v => set('id', v)} placeholder="gl-senggani" /></AField>
            <AField label="Emoji (fallback)" half><AInput value={draft.emoji} onChange={v => set('emoji', v)} placeholder="🏕️" /></AField>
          </div>
          <AField label="Cover foto" hint="Upload atau paste URL gambar.">
            <ImageField value={draft.cover} onChange={v => set('cover', v)} folder="covers" />
          </AField>
          <AField label="Nama lokasi"><AInput value={draft.name} onChange={v => set('name', v)} placeholder="Jurang Senggani" /></AField>
          <AField label="Lokasi"><AInput value={draft.location} onChange={v => set('location', v)} placeholder="Tulungagung, Jawa Timur" /></AField>
          <div style={{ display: 'flex', gap: '4%', flexWrap: 'wrap' }}>
            <AField label="Harga tampil" half><AInput value={draft.price} onChange={v => set('price', v)} placeholder="650K" /></AField>
            <AField label="Harga angka" half><AInput value={draft.pricePerNight} onChange={v => set('pricePerNight', v)} type="number" /></AField>
          </div>
          <div style={{ display: 'flex', gap: '4%', flexWrap: 'wrap' }}>
            <AField label="Kapasitas" half><AInput value={draft.cap} onChange={v => set('cap', v)} placeholder="2–4 org / tent" /></AField>
            <AField label="Tag (opsional)" half><AInput value={draft.tag} onChange={v => set('tag', v)} placeholder="SIGNATURE" /></AField>
          </div>
          <AField label="Ketersediaan"><AInput value={draft.availability} onChange={v => set('availability', v)} placeholder="Buka setiap hari" /></AField>
          <AField label="Hari tutup (nomor hari, 0=Minggu)" hint="Kosongkan jika buka setiap hari. Contoh: 3 untuk Rabu.">
            <AInput
              value={draft.closedDays?.join(',') ?? ''}
              onChange={v => set('closedDays', v ? v.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n)) : [])}
              placeholder="3"
            />
          </AField>
          <AField label="Palette warna"><PaletteSelect value={draft.palette} onChange={v => set('palette', v)} /></AField>
          <AField label="Tagline"><AInput value={draft.tagline} onChange={v => set('tagline', v)} placeholder="Kemah, tapi tetap nyaman." /></AField>
          <AField label="Deskripsi"><ATextarea value={draft.description} onChange={v => set('description', v)} rows={3} /></AField>
          <AField label="Fasilitas (amenities)"><ListEditor items={draft.amenities || []} onChange={v => set('amenities', v)} placeholder="Tempat tidur queen" /></AField>
          <AField label="Galeri foto" hint="Upload atau paste URL.">
            <GalleryEditor items={draft.gallery || []} onChange={v => set('gallery', v)} folder="gallery" />
          </AField>
          <AField label="Add-on"><AddonEditor addons={draft.addons || []} onChange={v => set('addons', v)} /></AField>
        </Panel>
      )}

      {deleteId && (
        <ConfirmModal
          message={`Hapus lokasi glamping "${glampings.find(g => g.id === deleteId)?.name}"?`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
