import { useState } from 'react';
import { useData } from '../context/DataContext';
import { S, AField, AInput, ATextarea, PaletteSelect, ListEditor, ImageField, GalleryEditor, PriceTierEditor, ReorderButtons, Panel, ConfirmModal, EmptyState } from './shared';

const BLANK = {
  id: '', name: '', region: '', sub: '', emoji: '', cover: '', palette: 'ink',
  description: '', highlights: [], durations: ['2D1N', '3D2N'],
  startingPrice: '', pricePerPax: null, gallery: [], priceTiers: [],
};

export default function AdminPrivateTrips() {
  const { privateDestinations, setPrivateDestinations, deletePrivateDestination } = useData();
  const [panel, setPanel] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);

  const openAdd = () => { setDraft({ ...BLANK, durations: ['2D1N', '3D2N'], gallery: [], highlights: [] }); setPanel({ mode: 'add' }); };
  const openEdit = (item) => { setDraft({ ...item }); setPanel({ mode: 'edit', id: item.id }); };
  const set = (key, val) => setDraft(d => ({ ...d, [key]: val }));

  const save = async () => {
    setSaving(true);
    if (panel.mode === 'add') {
      await setPrivateDestinations([...privateDestinations, draft]);
    } else {
      await setPrivateDestinations(privateDestinations.map(d => d.id === panel.id ? draft : d));
    }
    setSaving(false);
    setPanel(null);
  };

  const confirmDelete = async () => {
    await deletePrivateDestination(deleteId);
    setDeleteId(null);
  };

  const reorder = async (idx, dir) => {
    const j = idx + dir;
    if (j < 0 || j >= privateDestinations.length) return;
    const next = [...privateDestinations];
    [next[idx], next[j]] = [next[j], next[idx]];
    await setPrivateDestinations(next);
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
              {privateDestinations.map((d, idx) => (
                <tr key={d.id}>
                  <td style={S.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {d.cover
                        ? <img src={d.cover} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                        : <span style={{ fontSize: 20 }}>{d.emoji}</span>
                      }
                      <span style={{ fontWeight: 600 }}>{d.name}</span>
                    </div>
                  </td>
                  <td style={S.td}>{d.region}</td>
                  <td style={S.td}><span style={{ color: '#6b7280' }}>{d.sub}</span></td>
                  <td style={S.td}>{d.startingPrice === 'Sesuai itinerary' ? <em style={{ color: '#9ca3af', fontStyle: 'normal' }}>Custom</em> : `Rp ${d.startingPrice}`}</td>
                  <td style={S.td}>{d.durations.join(', ')}</td>
                  <td style={S.td}>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <ReorderButtons index={idx} total={privateDestinations.length} onMove={dir => reorder(idx, dir)} />
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
        <Panel title={panel.mode === 'add' ? 'Tambah Destinasi' : 'Edit Destinasi'} onClose={() => setPanel(null)} onSave={save} saving={saving}>
          <div style={{ display: 'flex', gap: '4%', flexWrap: 'wrap' }}>
            <AField label="ID (unik)" half><AInput value={draft.id} onChange={v => set('id', v)} placeholder="pronojiwo" /></AField>
            <AField label="Emoji (fallback)" half><AInput value={draft.emoji} onChange={v => set('emoji', v)} placeholder="💧" /></AField>
          </div>
          <AField label="Cover foto" hint="Upload atau paste URL gambar.">
            <ImageField value={draft.cover} onChange={v => set('cover', v)} folder="covers" />
          </AField>
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
            <AField label="Harga per pax fallback" half hint="Dipakai jika price tiers kosong">
              <AInput value={draft.pricePerPax ?? ''} onChange={v => set('pricePerPax', v === '' ? null : Number(v))} type="number" placeholder="1800000" />
            </AField>
          </div>
          <AField label="Harga per jumlah tamu (price tiers)" hint="Total harga untuk durasi dasar (2D1N). Durasi lain dikali multiplier otomatis.">
            <PriceTierEditor tiers={draft.priceTiers || []} onChange={v => set('priceTiers', v)} unit="trip" />
          </AField>
          <AField label="Galeri foto" hint="Upload atau paste URL.">
            <GalleryEditor items={draft.gallery || []} onChange={v => set('gallery', v)} folder="gallery" />
          </AField>
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
