import { useState } from 'react';
import { useData } from '../context/DataContext';
import { S, AField, AInput, ATextarea, ASelect, Panel, ConfirmModal, EmptyState } from './shared';

const BLANK = {
  id: '', kind: 'open', name: '', email: '', wa: '', data: {}, status: 'new', notes: '',
};

const STATUS_LABELS = { new: 'Baru', in_progress: 'Diproses', closed: 'Selesai' };
const STATUS_COLORS = {
  new:         { bg: '#eff6ff', color: '#1d4ed8' },
  in_progress: { bg: '#fef9c3', color: '#854d0e' },
  closed:      { bg: '#f0fdf4', color: '#16a34a' },
};
const KIND_LABELS = { open: 'Open Trip', private: 'Private Trip', glamping: 'Glamping', corporate: 'Corporate' };

export default function AdminInquiries() {
  const { inquiries, setInquiries, deleteInquiry } = useData();
  const [panel, setPanel] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const openAdd  = () => { setDraft({ ...BLANK, id: `inq-${Date.now()}` }); setPanel({ mode: 'add' }); };
  const openEdit = (item) => { setDraft({ ...item }); setPanel({ mode: 'edit', id: item.id }); };
  const set = (key, val) => setDraft(d => ({ ...d, [key]: val }));

  const save = async () => {
    setSaving(true);
    if (panel.mode === 'add') {
      await setInquiries([draft, ...inquiries]);
    } else {
      await setInquiries(inquiries.map(i => i.id === panel.id ? draft : i));
    }
    setSaving(false);
    setPanel(null);
  };

  const confirmDelete = async () => {
    await deleteInquiry(deleteId);
    setDeleteId(null);
  };

  const filtered = filterStatus === 'all' ? inquiries : inquiries.filter(i => i.status === filterStatus);

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1100 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#111' }}>Inquiry</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>{inquiries.length} inquiry masuk</p>
        </div>
        <button onClick={openAdd} style={{ ...S.btn, background: '#252525', color: '#F3D543', padding: '10px 20px' }}>+ Tambah Inquiry</button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['all', 'new', 'in_progress', 'closed'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} style={{
            ...S.btn, padding: '6px 14px', fontSize: 12,
            background: filterStatus === s ? '#252525' : '#f3f4f6',
            color: filterStatus === s ? '#F3D543' : '#6b7280',
          }}>
            {s === 'all' ? `Semua (${inquiries.length})` : `${STATUS_LABELS[s]} (${inquiries.filter(i => i.status === s).length})`}
          </button>
        ))}
      </div>

      <div style={S.card}>
        {filtered.length === 0 ? (
          <EmptyState icon="📬" title="Belum ada inquiry" sub="Inquiry dari form publik akan muncul di sini." />
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={S.th}>Nama</th>
                <th style={S.th}>Jenis</th>
                <th style={S.th}>Kontak</th>
                <th style={S.th}>Status</th>
                <th style={S.th}>Tanggal</th>
                <th style={S.th}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(inq => {
                const sc = STATUS_COLORS[inq.status] || STATUS_COLORS.new;
                const tripLabel = inq.data?.tripId || inq.data?.privateDest || inq.data?.glampLoc || '';
                return (
                  <tr key={inq.id}>
                    <td style={S.td}>
                      <div style={{ fontWeight: 600 }}>{inq.name || '–'}</div>
                      {tripLabel && <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{tripLabel}</div>}
                      {inq.notes && <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2, fontStyle: 'italic' }}>📝 {inq.notes.slice(0, 40)}{inq.notes.length > 40 ? '…' : ''}</div>}
                    </td>
                    <td style={S.td}>
                      <span style={{ ...S.badge, background: '#f0f9ff', color: '#0369a1' }}>
                        {KIND_LABELS[inq.kind] || inq.kind}
                      </span>
                    </td>
                    <td style={S.td}>
                      <div style={{ fontSize: 13 }}>{inq.email || '–'}</div>
                      <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{inq.wa || '–'}</div>
                    </td>
                    <td style={S.td}>
                      <span style={{ ...S.badge, background: sc.bg, color: sc.color }}>
                        {STATUS_LABELS[inq.status] || inq.status}
                      </span>
                    </td>
                    <td style={S.td}>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>
                        {inq.createdAt
                          ? new Date(inq.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                          : '–'}
                      </div>
                    </td>
                    <td style={S.td}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => openEdit(inq)} style={{ ...S.btn, background: '#f0f9ff', color: '#0369a1', padding: '5px 12px' }}>Detail</button>
                        <button onClick={() => setDeleteId(inq.id)} style={{ ...S.btn, background: '#fef2f2', color: '#dc2626', padding: '5px 12px' }}>Hapus</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {panel && draft && (
        <Panel
          title={panel.mode === 'add' ? 'Tambah Inquiry' : 'Detail Inquiry'}
          onClose={() => setPanel(null)}
          onSave={save}
          saving={saving}
        >
          <div style={{ display: 'flex', gap: '4%', flexWrap: 'wrap' }}>
            <AField label="Nama" half><AInput value={draft.name} onChange={v => set('name', v)} placeholder="Nama customer" /></AField>
            <AField label="Jenis" half>
              <select style={{ ...S.input }} value={draft.kind} onChange={e => set('kind', e.target.value)}>
                <option value="open">Open Trip</option>
                <option value="private">Private Trip</option>
                <option value="glamping">Glamping</option>
                <option value="corporate">Corporate</option>
              </select>
            </AField>
          </div>
          <div style={{ display: 'flex', gap: '4%', flexWrap: 'wrap' }}>
            <AField label="Email" half><AInput value={draft.email} onChange={v => set('email', v)} placeholder="email@contoh.com" /></AField>
            <AField label="WhatsApp" half><AInput value={draft.wa} onChange={v => set('wa', v)} placeholder="+62 812…" /></AField>
          </div>
          <AField label="Status">
            <select style={{ ...S.input }} value={draft.status} onChange={e => set('status', e.target.value)}>
              <option value="new">Baru</option>
              <option value="in_progress">Diproses</option>
              <option value="closed">Selesai</option>
            </select>
          </AField>
          <AField label="Catatan internal" hint="Hanya terlihat di CMS, tidak dikirim ke customer.">
            <ATextarea value={draft.notes} onChange={v => set('notes', v)} rows={3} placeholder="Catatan follow-up, info tambahan, status terakhir…" />
          </AField>
          {draft.data && Object.keys(draft.data).length > 0 && (
            <AField label="Data lengkap dari form">
              <div style={{
                background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10,
                padding: '12px 14px', fontSize: 12, fontFamily: 'monospace',
                whiteSpace: 'pre-wrap', color: '#374151', maxHeight: 280, overflowY: 'auto',
              }}>
                {JSON.stringify(draft.data, null, 2)}
              </div>
            </AField>
          )}
        </Panel>
      )}

      {deleteId && (
        <ConfirmModal
          message={`Hapus inquiry dari "${inquiries.find(i => i.id === deleteId)?.name || deleteId}"? Aksi ini tidak bisa dibatalkan.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
