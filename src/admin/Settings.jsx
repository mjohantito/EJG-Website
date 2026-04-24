import { useState } from 'react';
import { useData } from '../context/DataContext';
import { S, AField, AInput } from './shared';

const BLANK_ADDON = { id: '', label: '', price: 0, desc: '' };

function AddonTable({ addons, onChange }) {
  const update = (i, key, val) => {
    const next = [...addons];
    next[i] = { ...next[i], [key]: key === 'price' ? Number(val) : val };
    onChange(next);
  };
  const remove = (i) => onChange(addons.filter((_, j) => j !== i));
  const add = () => onChange([...addons, { ...BLANK_ADDON, id: `addon-${Date.now()}` }]);

  return (
    <div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 12 }}>
        <thead>
          <tr>
            <th style={S.th}>Label</th>
            <th style={S.th}>Harga (Rp)</th>
            <th style={S.th}>Deskripsi</th>
            <th style={S.th}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {addons.map((a, i) => (
            <tr key={i}>
              <td style={S.td}>
                <input style={{ ...S.input, padding: '6px 10px', fontSize: 13 }} value={a.label} onChange={e => update(i, 'label', e.target.value)} placeholder="Single Supplement" />
              </td>
              <td style={S.td}>
                <input style={{ ...S.input, padding: '6px 10px', fontSize: 13, width: 110 }} type="number" value={a.price} onChange={e => update(i, 'price', e.target.value)} />
              </td>
              <td style={S.td}>
                <input style={{ ...S.input, padding: '6px 10px', fontSize: 13 }} value={a.desc} onChange={e => update(i, 'desc', e.target.value)} placeholder="Deskripsi…" />
              </td>
              <td style={S.td}>
                <button onClick={() => remove(i)} style={{ ...S.btn, background: '#fef2f2', color: '#dc2626', padding: '5px 10px' }}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={add} style={{ ...S.btn, background: '#f0f9ff', color: '#0369a1', fontSize: 12 }}>+ Tambah add-on</button>
    </div>
  );
}

export default function AdminSettings() {
  const { whatsapp, setWhatsapp, openTripAddons, setOpenTripAddons, resetAll } = useData();
  const [waInput, setWaInput] = useState(whatsapp);
  const [addons, setAddons] = useState(openTripAddons);
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const save = () => {
    setWhatsapp(waInput);
    setOpenTripAddons(addons);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    resetAll();
    window.location.reload();
  };

  return (
    <div style={{ padding: '32px 36px', maxWidth: 800 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#111', letterSpacing: '-0.02em' }}>Settings</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>Konfigurasi kontak, add-on, dan data global.</p>
      </div>

      {/* WhatsApp */}
      <div style={{ ...S.card, marginBottom: 20 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#111' }}>Nomor WhatsApp</h3>
        <AField label="Nomor WA aktif" hint="Gunakan format internasional tanpa + (contoh: 6285117322207)">
          <AInput value={waInput} onChange={setWaInput} placeholder="6285117322207" />
        </AField>
      </div>

      {/* Open trip add-ons */}
      <div style={{ ...S.card, marginBottom: 20 }}>
        <h3 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 700, color: '#111' }}>Add-on Open Trip</h3>
        <p style={{ margin: '0 0 16px', fontSize: 13, color: '#6b7280' }}>Add-on ini muncul di halaman detail trip dan form inquiry open trip.</p>
        <AddonTable addons={addons} onChange={setAddons} />
      </div>

      {/* Save button */}
      <button
        onClick={save}
        style={{ ...S.btn, background: '#252525', color: '#F3D543', padding: '12px 28px', fontSize: 14 }}
      >
        {saved ? '✓ Tersimpan!' : 'Simpan pengaturan'}
      </button>

      {/* Danger zone */}
      <div style={{ ...S.card, marginTop: 40, borderColor: '#fca5a5' }}>
        <h3 style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 700, color: '#dc2626' }}>Danger Zone</h3>
        <p style={{ margin: '0 0 16px', fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>
          Reset semua data CMS ke nilai default dari <code style={{ background: '#f3f4f6', padding: '1px 5px', borderRadius: 4 }}>data.js</code>.
          Aksi ini tidak bisa dibatalkan dan akan menghapus semua perubahan yang belum di-export.
        </p>
        {!confirmReset ? (
          <button onClick={() => setConfirmReset(true)} style={{ ...S.btn, background: '#fef2f2', color: '#dc2626', padding: '10px 20px' }}>
            Reset ke default…
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: '#dc2626', fontWeight: 600 }}>Yakin? Semua perubahan CMS akan hilang.</span>
            <button onClick={handleReset} style={{ ...S.btn, background: '#dc2626', color: '#fff', padding: '8px 16px' }}>Ya, reset sekarang</button>
            <button onClick={() => setConfirmReset(false)} style={{ ...S.btn, background: '#f3f4f6', color: '#374151', padding: '8px 16px' }}>Batal</button>
          </div>
        )}
      </div>

      {/* How to publish */}
      <div style={{ ...S.card, marginTop: 20, background: '#f0fdf4', borderColor: '#bbf7d0' }}>
        <h3 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 700, color: '#15803d' }}>ℹ️ Cara mempublish perubahan</h3>
        <p style={{ margin: 0, fontSize: 13, color: '#166534', lineHeight: 1.7 }}>
          Semua perubahan yang kamu buat di CMS ini tersimpan di browser ini (localStorage). Pengunjung website lain
          belum melihat perubahanmu sampai kamu deploy ulang. Untuk mempermanenkan: hubungi developer dan minta mereka
          update <code style={{ background: '#dcfce7', padding: '1px 5px', borderRadius: 4 }}>src/data.js</code> sesuai
          data terbaru dari CMS ini.
        </p>
      </div>
    </div>
  );
}
