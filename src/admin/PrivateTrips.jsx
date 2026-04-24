import { useState } from 'react';
import { useData } from '../context/DataContext';
import { S, AField, AInput, ATextarea, PaletteSelect, ListEditor, Panel, ConfirmModal, EmptyState } from './shared';

const BLANK = {
  id: '', name: '', region: '', sub: '', emoji: '', palette: 'ink',
  description: '', highlights: [], durations: ['2D1N', '3D2N'],
  startingPrice: '', pricePerPax: null, gallery: [],
};

export default function AdminPrivateTrips() {
  const { privateDestinations, setPrivateDestinations } = useData();
  const [panel, setPanel] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [draft, setDraft] = useState(null);

  const openAdd = () => { setDraft({ ...BLANK, durations: ['2D1N', '3D2N'], gallery: [], highlights: [] }); setPanel({ mode: 'add' }); };
  const openEdit = (item) => { setDraft({ ...item }); setPanel({ mode: 'edit', id: item.id }); };
  const set = (key, val) => setDraft(d => ({ ...d, [key]: val }));

  const save = () => {
    if (panel.mode === 'add') {
      setPrivateDestinations([...privateDestinations, draft]);
    } else {
      setPrivateDestinations(privateDestinations.map(d => d.id === panel.id ? draft : d));
    }
    setPanel(null);
  };

  const confirmDelete = () => {
    setPrivateDestinations(privateDestinations.filter(d => d.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1100 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#111', letterSpacing: '-0.02em' }}>Private Trip</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>{privateDestinations.length} destinasi tersedia</p>
        </div>
        <button onClick={openAdd} style={{ ...S.btn, background: '#252525', color: '#F3D543', padding: '10px 20px' }}>+ Tambah Destinasi</button>
      </div>

      <div style={S.card}>
        {privateDestinations.length === 0 ? (
          <EmptyState icon="🗺️" title="Belum ada destinasi" sub="Klik '+ Tambah Destinasi' untuk mulai." />
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={S.th}>Destinasi</th>
                <th style={S.th}>Region</th>
                <th style={S.th}>Subtitle</th>
                <th style={S.th}>Harga mulai</th>
                <th style={S.th}>Durasi</th>
                <th style={S.th}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {privateDestinations.map(d => (
                <tr key={d.id}>
                  <td style={S.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 20 }}>{d.emoji}</span>
                      <span style={{ fontWeight: 600 }}>{d.name}</span>
                    </div>
                  </td>
                  <td style={S.td}>{d.region}</td>
                  <td style={S.td}><span style={{ color: '#6b7280' }}>{d.sub}</span></td>
                  <td style={S.td}>{d.startingPrice === 'Sesuai itinerary' ? <em style={{ color: '#9ca3af', fontStyle: 'normal' }}>Custom</em> : `Rp ${d.startingPrice}`}</td>
                  <td style={S.td}>{d.durations.join(', ')}</td>
                  <td style={S.td}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => openEdit(d)} style={{ ...S.btn, background: '#f0f9ff', color: '#0369a1', padding: '5px 12px' }}>Edit</button>
                      <button onClick={() => setDeleteId(d.id)} style={{ ...S.btn, background: '#fef2f2', color: '#dc2626', padding: '5px 12px' }}>Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {panel && draft && (
        <Panel title={panel.mode === 'add' ? 'Tambah Destinasi' : 'Edit Destinasi'} onClose={() => setPanel(null)} onSave={save}>
          <div style={{ display: 'flex', gap: '4%', flexWrap: 'wrap' }}>
            <AField label="ID (unik)" half><AInput value={draft.id} onChange={v => set('id', v)} placeholder="pronojiwo" /></AField>
            <AField label="Emoji" half><AInput value={draft.emoji} onChange={v => set('emoji', v)} placeholder="💧" /></AField>
          </div>
          <AField label="Nama destinasi"><AInput value={draft.name} onChange={v => set('name', v)} placeholder="Pronojiwo" /></AField>
          <AField label="Region"><AInput value={draft.region} onChange={v => set('region', v)} placeholder="Lumajang, Jawa Timur" /></AField>
          <AField label="Subtitle"><AInput value={draft.sub} onChange={v => set('sub', v)} placeholder="Tumpak Sewu, Goa Tetes, Kapas Biru" /></AField>
          <AField label="Palette warna"><PaletteSelect value={draft.palette} onChange={v => set('palette', v)} /></AField>
          <AField label="Deskripsi"><ATextarea value={draft.description} onChange={v => set('description', v)} rows={3} /></AField>
          <AField label="Highlights"><ListEditor items={draft.highlights || []} onChange={v => set('highlights', v)} placeholder="Tumpak Sewu dari dasar" /></AField>
          <AField label="Pilihan durasi">
            <ListEditor items={draft.durations || []} onChange={v => set('durations', v)} placeholder="2D1N" />
          </AField>
          <div style={{ display: 'flex', gap: '4%', flexWrap: 'wrap' }}>
            <AField label="Harga tampil" half hint="Contoh: 1.8jt atau 'Sesuai itinerary'">
              <AInput value={draft.startingPrice} onChange={v => set('startingPrice', v)} placeholder="1.8jt" />
            </AField>
            <AField label="Harga per pax (angka)" half hint="Kosongkan jika custom">
              <AInput value={draft.pricePerPax ?? ''} onChange={v => set('pricePerPax', v === '' ? null : Number(v))} type="number" placeholder="1800000" />
            </AField>
          </div>
          <AField label="Galeri (label foto)"><ListEditor items={draft.gallery || []} onChange={v => set('gallery', v)} placeholder="Tumpak Sewu dari dasar" /></AField>
        </Panel>
      )}

      {deleteId && (
        <ConfirmModal
          message={`Hapus destinasi "${privateDestinations.find(d => d.id === deleteId)?.name}"?`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
