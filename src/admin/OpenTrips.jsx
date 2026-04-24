import { useState } from 'react';
import { useData } from '../context/DataContext';
import { S, AField, AInput, ATextarea, ASelect, PaletteSelect, ListEditor, Panel, ConfirmModal, EmptyState } from './shared';

const BLANK = {
  id: '', dest: '', region: '', month: '', day: '', start: '', end: '', duration: '2D1N',
  price: '', priceNum: 0, slots: 10, totalSlots: 12, tag: '', palette: 'ink', emoji: '',
  description: '', highlights: [], includes: [], gallery: [],
};

export default function AdminOpenTrips() {
  const { openTrips, setOpenTrips } = useData();
  const [panel, setPanel] = useState(null); // null | { mode: 'add'|'edit', item }
  const [deleteId, setDeleteId] = useState(null);
  const [draft, setDraft] = useState(null);

  const openAdd = () => { setDraft({ ...BLANK }); setPanel({ mode: 'add' }); };
  const openEdit = (item) => { setDraft({ ...item }); setPanel({ mode: 'edit', id: item.id }); };
  const set = (key, val) => setDraft(d => ({ ...d, [key]: val }));

  const save = () => {
    if (panel.mode === 'add') {
      setOpenTrips([...openTrips, draft]);
    } else {
      setOpenTrips(openTrips.map(t => t.id === panel.id ? draft : t));
    }
    setPanel(null);
  };

  const confirmDelete = () => {
    setOpenTrips(openTrips.filter(t => t.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1100 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#111', letterSpacing: '-0.02em' }}>Open Trips</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>{openTrips.length} keberangkatan terjadwal</p>
        </div>
        <button onClick={openAdd} style={{ ...S.btn, background: '#252525', color: '#F3D543', padding: '10px 20px' }}>+ Tambah Trip</button>
      </div>

      <div style={S.card}>
        {openTrips.length === 0 ? (
          <EmptyState icon="🗓️" title="Belum ada open trip" sub="Klik '+ Tambah Trip' untuk mulai." />
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={S.th}>Trip</th>
                <th style={S.th}>Tanggal</th>
                <th style={S.th}>Durasi</th>
                <th style={S.th}>Harga</th>
                <th style={S.th}>Slot</th>
                <th style={S.th}>Tag</th>
                <th style={S.th}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {openTrips.map(t => (
                <tr key={t.id}>
                  <td style={S.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 20 }}>{t.emoji}</span>
                      <div>
                        <div style={{ fontWeight: 600 }}>{t.dest}</div>
                        <div style={{ fontSize: 12, color: '#9ca3af' }}>{t.region}</div>
                      </div>
                    </div>
                  </td>
                  <td style={S.td}>{t.start} – {t.end}</td>
                  <td style={S.td}>{t.duration}</td>
                  <td style={S.td}>Rp {t.price}</td>
                  <td style={S.td}>
                    <span style={{ ...S.badge, background: t.slots <= 3 ? '#fef2f2' : '#f0fdf4', color: t.slots <= 3 ? '#dc2626' : '#16a34a' }}>
                      {t.slots}/{t.totalSlots}
                    </span>
                  </td>
                  <td style={S.td}>
                    {t.tag && <span style={{ ...S.badge, background: '#fef9c3', color: '#854d0e' }}>{t.tag}</span>}
                  </td>
                  <td style={S.td}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => openEdit(t)} style={{ ...S.btn, background: '#f0f9ff', color: '#0369a1', padding: '5px 12px' }}>Edit</button>
                      <button onClick={() => setDeleteId(t.id)} style={{ ...S.btn, background: '#fef2f2', color: '#dc2626', padding: '5px 12px' }}>Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {panel && draft && (
        <Panel title={panel.mode === 'add' ? 'Tambah Open Trip' : 'Edit Open Trip'} onClose={() => setPanel(null)} onSave={save}>
          <div style={{ display: 'flex', gap: '4%', flexWrap: 'wrap' }}>
            <AField label="ID (unik)" half><AInput value={draft.id} onChange={v => set('id', v)} placeholder="ot-bromo-jun" /></AField>
            <AField label="Emoji" half><AInput value={draft.emoji} onChange={v => set('emoji', v)} placeholder="🌋" /></AField>
          </div>
          <AField label="Nama destinasi"><AInput value={draft.dest} onChange={v => set('dest', v)} placeholder="Bromo Sunrise" /></AField>
          <AField label="Region"><AInput value={draft.region} onChange={v => set('region', v)} placeholder="Jawa Timur" /></AField>
          <div style={{ display: 'flex', gap: '4%', flexWrap: 'wrap' }}>
            <AField label="Bulan" half><AInput value={draft.month} onChange={v => set('month', v)} placeholder="MEI" /></AField>
            <AField label="Tanggal (angka)" half><AInput value={draft.day} onChange={v => set('day', v)} placeholder="24" /></AField>
          </div>
          <div style={{ display: 'flex', gap: '4%', flexWrap: 'wrap' }}>
            <AField label="Tanggal mulai" half><AInput value={draft.start} onChange={v => set('start', v)} placeholder="24 Mei" /></AField>
            <AField label="Tanggal selesai" half><AInput value={draft.end} onChange={v => set('end', v)} placeholder="25 Mei" /></AField>
          </div>
          <div style={{ display: 'flex', gap: '4%', flexWrap: 'wrap' }}>
            <AField label="Durasi" half><AInput value={draft.duration} onChange={v => set('duration', v)} placeholder="2D1N" /></AField>
            <AField label="Harga tampil" half><AInput value={draft.price} onChange={v => set('price', v)} placeholder="850K" /></AField>
          </div>
          <div style={{ display: 'flex', gap: '4%', flexWrap: 'wrap' }}>
            <AField label="Harga (angka)" half><AInput value={draft.priceNum} onChange={v => set('priceNum', v)} type="number" /></AField>
            <AField label="Tag (opsional)" half><AInput value={draft.tag} onChange={v => set('tag', v)} placeholder="LAST SLOTS" /></AField>
          </div>
          <div style={{ display: 'flex', gap: '4%', flexWrap: 'wrap' }}>
            <AField label="Slot tersisa" half><AInput value={draft.slots} onChange={v => set('slots', v)} type="number" /></AField>
            <AField label="Total slot" half><AInput value={draft.totalSlots} onChange={v => set('totalSlots', v)} type="number" /></AField>
          </div>
          <AField label="Palette warna"><PaletteSelect value={draft.palette} onChange={v => set('palette', v)} /></AField>
          <AField label="Deskripsi"><ATextarea value={draft.description} onChange={v => set('description', v)} rows={4} /></AField>
          <AField label="Highlights"><ListEditor items={draft.highlights} onChange={v => set('highlights', v)} placeholder="Sunrise Penanjakan" /></AField>
          <AField label="Termasuk (includes)"><ListEditor items={draft.includes} onChange={v => set('includes', v)} placeholder="Transport AC" /></AField>
          <AField label="Galeri (label foto)"><ListEditor items={draft.gallery} onChange={v => set('gallery', v)} placeholder="Sunrise dari puncak" /></AField>
        </Panel>
      )}

      {deleteId && (
        <ConfirmModal
          message={`Hapus trip "${openTrips.find(t => t.id === deleteId)?.dest}"? Aksi ini tidak bisa dibatalkan.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
