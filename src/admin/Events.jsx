import { useState } from 'react';
import { useData } from '../context/DataContext';
import { S, AField, AInput, ATextarea, PaletteSelect, ListEditor, ImageField, GalleryEditor, Panel, ConfirmModal, EmptyState } from './shared';

const BLANK_TICKET = { id: '', label: '', price: 0, desc: '', slots: 10 };

const BLANK = {
  id: '', name: '', subtitle: '', date: '', dateEnd: '', year: '2026',
  venue: '', emoji: '', cover: '', palette: 'ink', tag: 'OPEN',
  description: '', highlights: [], includes: [],
  tickets: [{ ...BLANK_TICKET }],
};

function TicketEditor({ tickets, onChange }) {
  const update = (i, key, val) => {
    const next = [...tickets];
    next[i] = { ...next[i], [key]: ['price', 'slots'].includes(key) ? Number(val) : val };
    onChange(next);
  };
  const remove = (i) => onChange(tickets.filter((_, j) => j !== i));
  const add = () => onChange([...tickets, { ...BLANK_TICKET, id: `ticket-${Date.now()}` }]);

  return (
    <div>
      {tickets.map((t, i) => (
        <div key={i} style={{ border: '1.5px solid #e5e7eb', borderRadius: 12, padding: '14px 16px', marginBottom: 10 }}>
          <div style={{ fontWeight: 700, fontSize: 12, color: '#6b7280', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tiket #{i + 1}</div>
          <div style={{ display: 'flex', gap: '3%', flexWrap: 'wrap' }}>
            <div style={{ width: '48%' }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: 4 }}>Label</label>
              <input style={{ ...S.input, fontSize: 13 }} value={t.label} onChange={e => update(i, 'label', e.target.value)} placeholder="Early Bird" />
            </div>
            <div style={{ width: '48%' }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: 4 }}>Harga (Rp)</label>
              <input style={{ ...S.input, fontSize: 13 }} type="number" value={t.price} onChange={e => update(i, 'price', e.target.value)} />
            </div>
          </div>
          <div style={{ marginTop: 8, display: 'flex', gap: '3%', flexWrap: 'wrap' }}>
            <div style={{ width: '72%' }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: 4 }}>Deskripsi</label>
              <input style={{ ...S.input, fontSize: 13 }} value={t.desc} onChange={e => update(i, 'desc', e.target.value)} placeholder="Akses semua kegiatan…" />
            </div>
            <div style={{ width: '23%' }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: 4 }}>Slot</label>
              <input style={{ ...S.input, fontSize: 13 }} type="number" value={t.slots} onChange={e => update(i, 'slots', e.target.value)} />
            </div>
          </div>
          {tickets.length > 1 && (
            <button type="button" onClick={() => remove(i)} style={{ ...S.btn, background: '#fef2f2', color: '#dc2626', padding: '4px 10px', fontSize: 11, marginTop: 8 }}>Hapus tiket ini</button>
          )}
        </div>
      ))}
      <button type="button" onClick={add} style={{ ...S.btn, background: '#f0f9ff', color: '#0369a1', fontSize: 12 }}>+ Tambah tipe tiket</button>
    </div>
  );
}

export default function AdminEvents() {
  const { events, setEvents, deleteEvent } = useData();
  const [panel, setPanel] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);

  const openAdd = () => { setDraft({ ...BLANK, highlights: [], includes: [], tickets: [{ ...BLANK_TICKET }] }); setPanel({ mode: 'add' }); };
  const openEdit = (item) => { setDraft({ ...item }); setPanel({ mode: 'edit', id: item.id }); };
  const set = (key, val) => setDraft(d => ({ ...d, [key]: val }));

  const save = async () => {
    setSaving(true);
    if (panel.mode === 'add') {
      await setEvents([...events, draft]);
    } else {
      await setEvents(events.map(e => e.id === panel.id ? draft : e));
    }
    setSaving(false);
    setPanel(null);
  };

  const confirmDelete = async () => {
    await deleteEvent(deleteId);
    setDeleteId(null);
  };

  const totalSlots = (ev) => ev.tickets.reduce((s, t) => s + t.slots, 0);
  const lowestPrice = (ev) => Math.min(...ev.tickets.map(t => t.price));

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1100 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#111' }}>Special Events</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>{events.length} event terjadwal</p>
        </div>
        <button onClick={openAdd} style={{ ...S.btn, background: '#252525', color: '#F3D543', padding: '10px 20px' }}>+ Tambah Event</button>
      </div>

      <div style={S.card}>
        {events.length === 0 ? (
          <EmptyState icon="🎉" title="Belum ada event" sub="Klik '+ Tambah Event' untuk mulai." />
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={S.th}>Event</th>
                <th style={S.th}>Tanggal</th>
                <th style={S.th}>Venue</th>
                <th style={S.th}>Tiket</th>
                <th style={S.th}>Harga mulai</th>
                <th style={S.th}>Tag</th>
                <th style={S.th}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {events.map(ev => (
                <tr key={ev.id}>
                  <td style={S.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {ev.cover
                        ? <img src={ev.cover} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                        : <span style={{ fontSize: 20 }}>{ev.emoji}</span>
                      }
                      <div>
                        <div style={{ fontWeight: 600 }}>{ev.name}</div>
                        <div style={{ fontSize: 12, color: '#9ca3af' }}>{ev.subtitle}</div>
                      </div>
                    </div>
                  </td>
                  <td style={S.td}>{ev.date} – {ev.dateEnd} {ev.year}</td>
                  <td style={S.td}>{ev.venue}</td>
                  <td style={S.td}>
                    <span style={{ ...S.badge, background: '#f0f9ff', color: '#0369a1' }}>
                      {ev.tickets.length} tipe · {totalSlots(ev)} slot
                    </span>
                  </td>
                  <td style={S.td}>Rp {(lowestPrice(ev) / 1000).toFixed(0)}rb</td>
                  <td style={S.td}>
                    {ev.tag && <span style={{ ...S.badge, background: '#fef9c3', color: '#854d0e' }}>{ev.tag}</span>}
                  </td>
                  <td style={S.td}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => openEdit(ev)} style={{ ...S.btn, background: '#f0f9ff', color: '#0369a1', padding: '5px 12px' }}>Edit</button>
                      <button onClick={() => setDeleteId(ev.id)} style={{ ...S.btn, background: '#fef2f2', color: '#dc2626', padding: '5px 12px' }}>Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {panel && draft && (
        <Panel title={panel.mode === 'add' ? 'Tambah Event' : 'Edit Event'} onClose={() => setPanel(null)} onSave={save} saving={saving}>
          <div style={{ display: 'flex', gap: '4%', flexWrap: 'wrap' }}>
            <AField label="ID (unik)" half><AInput value={draft.id} onChange={v => set('id', v)} placeholder="ev-bromo-nyeve" /></AField>
            <AField label="Emoji (fallback)" half><AInput value={draft.emoji} onChange={v => set('emoji', v)} placeholder="🌌" /></AField>
          </div>
          <AField label="Cover foto" hint="Upload atau paste URL gambar.">
            <ImageField value={draft.cover} onChange={v => set('cover', v)} folder="covers" />
          </AField>
          <AField label="Nama event"><AInput value={draft.name} onChange={v => set('name', v)} placeholder="Bromo Solstice Night" /></AField>
          <AField label="Subtitle"><AInput value={draft.subtitle} onChange={v => set('subtitle', v)} placeholder="Satu malam penuh bintang sebelum sunrise paling epic." /></AField>
          <AField label="Venue / lokasi"><AInput value={draft.venue} onChange={v => set('venue', v)} placeholder="Bromo, Jawa Timur" /></AField>
          <div style={{ display: 'flex', gap: '3%', flexWrap: 'wrap' }}>
            <AField label="Tanggal mulai" style={{ width: '31%' }}>
              <AInput value={draft.date} onChange={v => set('date', v)} placeholder="21 Jun" />
            </AField>
            <AField label="Tanggal selesai" style={{ width: '31%' }}>
              <AInput value={draft.dateEnd} onChange={v => set('dateEnd', v)} placeholder="22 Jun" />
            </AField>
            <AField label="Tahun" style={{ width: '31%' }}>
              <AInput value={draft.year} onChange={v => set('year', v)} placeholder="2026" />
            </AField>
          </div>
          <div style={{ display: 'flex', gap: '4%', flexWrap: 'wrap' }}>
            <AField label="Tag" half><AInput value={draft.tag} onChange={v => set('tag', v)} placeholder="OPEN" /></AField>
            <AField label="Palette warna" half><PaletteSelect value={draft.palette} onChange={v => set('palette', v)} /></AField>
          </div>
          <AField label="Deskripsi"><ATextarea value={draft.description} onChange={v => set('description', v)} rows={4} /></AField>
          <AField label="Highlights"><ListEditor items={draft.highlights || []} onChange={v => set('highlights', v)} placeholder="Campfire di Lautan Pasir" /></AField>
          <AField label="Termasuk (includes)"><ListEditor items={draft.includes || []} onChange={v => set('includes', v)} placeholder="Transport AC Surabaya–Bromo PP" /></AField>
          <AField label="Cover gallery (opsional)" hint="Foto tambahan untuk halaman detail event.">
            <GalleryEditor items={draft.gallery || []} onChange={v => set('gallery', v)} folder="gallery" />
          </AField>
          <AField label="Tipe tiket"><TicketEditor tickets={draft.tickets || []} onChange={v => set('tickets', v)} /></AField>
        </Panel>
      )}

      {deleteId && (
        <ConfirmModal
          message={`Hapus event "${events.find(e => e.id === deleteId)?.name}"?`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
