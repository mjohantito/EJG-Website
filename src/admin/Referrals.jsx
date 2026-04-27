import { useState } from 'react';
import { useData } from '../context/DataContext';
import { S, AField, AInput, ATextarea, ASelect, Panel, ConfirmModal, EmptyState } from './shared';

const BLANK = {
  id: '', code: '', discountType: 'percent', discountValue: 0,
  maxUses: 1, usedCount: 0, expiresAt: '', active: true, description: '',
};

function fmtDiscount(r) {
  if (r.discountType === 'percent') return `${r.discountValue}%`;
  return `Rp ${r.discountValue.toLocaleString('id-ID')}`;
}

export default function AdminReferrals() {
  const { referrals, setReferrals, deleteReferral } = useData();
  const [panel, setPanel] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);

  const openAdd  = () => { setDraft({ ...BLANK, id: `ref-${Date.now()}` }); setPanel({ mode: 'add' }); };
  const openEdit = (item) => { setDraft({ ...item }); setPanel({ mode: 'edit', id: item.id }); };
  const set = (key, val) => setDraft(d => ({ ...d, [key]: val }));

  const save = async () => {
    setSaving(true);
    const normalized = { ...draft, code: draft.code.toUpperCase().trim() };
    if (panel.mode === 'add') {
      await setReferrals([...referrals, normalized]);
    } else {
      await setReferrals(referrals.map(r => r.id === panel.id ? normalized : r));
    }
    setSaving(false);
    setPanel(null);
  };

  const confirmDelete = async () => {
    await deleteReferral(deleteId);
    setDeleteId(null);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1100 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#111' }}>Referral Codes</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>{referrals.length} kode aktif / tersimpan</p>
        </div>
        <button onClick={openAdd} style={{ ...S.btn, background: '#252525', color: '#F3D543', padding: '10px 20px' }}>+ Tambah Kode</button>
      </div>

      <div style={S.card}>
        {referrals.length === 0 ? (
          <EmptyState icon="🎟️" title="Belum ada kode referral" sub="Klik '+ Tambah Kode' untuk membuat kode pertama." />
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={S.th}>Kode</th>
                <th style={S.th}>Diskon</th>
                <th style={S.th}>Pemakaian</th>
                <th style={S.th}>Berlaku sampai</th>
                <th style={S.th}>Status</th>
                <th style={S.th}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map(r => {
                const expired = r.expiresAt && r.expiresAt < today;
                const maxed = r.maxUses > 0 && r.usedCount >= r.maxUses;
                const effectivelyActive = r.active && !expired && !maxed;
                return (
                  <tr key={r.id}>
                    <td style={S.td}>
                      <code style={{ background: '#f3f4f6', padding: '2px 8px', borderRadius: 6, fontWeight: 700, letterSpacing: '0.08em', fontSize: 13 }}>
                        {r.code}
                      </code>
                      {r.description && <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 3 }}>{r.description}</div>}
                    </td>
                    <td style={S.td}>
                      <span style={{ fontWeight: 700, color: '#16a34a' }}>{fmtDiscount(r)}</span>
                    </td>
                    <td style={S.td}>
                      <span style={{ fontFamily: 'monospace' }}>{r.usedCount}</span>
                      <span style={{ color: '#9ca3af' }}> / {r.maxUses === 0 ? '∞' : r.maxUses}</span>
                    </td>
                    <td style={S.td}>{r.expiresAt || <span style={{ color: '#9ca3af' }}>Tidak ada batas</span>}</td>
                    <td style={S.td}>
                      <span style={{
                        ...S.badge,
                        background: effectivelyActive ? '#f0fdf4' : '#fef2f2',
                        color: effectivelyActive ? '#16a34a' : '#dc2626',
                      }}>
                        {effectivelyActive ? 'Aktif' : expired ? 'Kedaluwarsa' : maxed ? 'Habis' : 'Nonaktif'}
                      </span>
                    </td>
                    <td style={S.td}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => openEdit(r)} style={{ ...S.btn, background: '#f0f9ff', color: '#0369a1', padding: '5px 12px' }}>Edit</button>
                        <button onClick={() => setDeleteId(r.id)} style={{ ...S.btn, background: '#fef2f2', color: '#dc2626', padding: '5px 12px' }}>Hapus</button>
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
        <Panel title={panel.mode === 'add' ? 'Tambah Kode Referral' : 'Edit Kode Referral'} onClose={() => setPanel(null)} onSave={save} saving={saving}>
          <AField label="Kode referral" hint="Akan otomatis diubah ke huruf kapital.">
            <AInput value={draft.code} onChange={v => set('code', v.toUpperCase())} placeholder="FRIENDS20" />
          </AField>
          <AField label="Deskripsi (internal)">
            <AInput value={draft.description} onChange={v => set('description', v)} placeholder="Untuk komunitas hiking Surabaya" />
          </AField>
          <div style={{ display: 'flex', gap: '4%', flexWrap: 'wrap' }}>
            <AField label="Tipe diskon" half>
              <ASelect value={draft.discountType} onChange={v => set('discountType', v)}
                options={[{ value: 'percent', label: 'Persen (%)' }, { value: 'fixed', label: 'Nominal (Rp)' }]} />
            </AField>
            <AField label="Nilai diskon" half>
              <AInput value={draft.discountValue} onChange={v => set('discountValue', Number(v))} type="number" placeholder={draft.discountType === 'percent' ? '10' : '50000'} />
            </AField>
          </div>
          <div style={{ display: 'flex', gap: '4%', flexWrap: 'wrap' }}>
            <AField label="Maks. pemakaian" half hint="0 = tidak terbatas">
              <AInput value={draft.maxUses} onChange={v => set('maxUses', Number(v))} type="number" placeholder="1" />
            </AField>
            <AField label="Berlaku sampai" half hint="Kosongkan = tidak ada batas waktu">
              <AInput value={draft.expiresAt} onChange={v => set('expiresAt', v)} type="date" />
            </AField>
          </div>
          <AField label="Status">
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 4 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={draft.active} onChange={e => set('active', e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: '#252525' }} />
                <span style={{ fontSize: 14, color: '#374151' }}>Aktif (bisa dipakai user)</span>
              </label>
            </div>
          </AField>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#15803d', lineHeight: 1.5 }}>
            Kode dipakai: <strong>{draft.usedCount}</strong> kali dari maks. <strong>{draft.maxUses === 0 ? '∞' : draft.maxUses}</strong>
          </div>
        </Panel>
      )}

      {deleteId && (
        <ConfirmModal
          message={`Hapus kode referral "${referrals.find(r => r.id === deleteId)?.code}"?`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
