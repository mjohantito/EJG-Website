import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { S, AField, AInput, ATextarea, Panel, ConfirmModal, EmptyState } from './shared';

const toSlug = (str) =>
  str.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const extractFolderId = (input) => {
  const m = input.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  return m ? m[1] : input.trim();
};

const BLANK = { id: null, slug: '', title: '', description: '', drive_folder_id: '', active: true };

export default function AdminPhotoAlbums() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [panel, setPanel] = useState(null);
  const [draft, setDraft] = useState(null);
  const [driveUrl, setDriveUrl] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    supabase.from('photo_albums').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setAlbums(data); setLoading(false); });
  }, []);

  const openAdd = () => {
    setDraft({ ...BLANK });
    setDriveUrl('');
    setSaveError('');
    setPanel({ mode: 'add' });
  };

  const openEdit = (a) => {
    setDraft({ ...a });
    setDriveUrl(`https://drive.google.com/drive/folders/${a.drive_folder_id}`);
    setSaveError('');
    setPanel({ mode: 'edit', id: a.id });
  };

  const set = (k, v) => setDraft(d => ({ ...d, [k]: v }));

  const handleDriveUrl = (url) => {
    setDriveUrl(url);
    set('drive_folder_id', extractFolderId(url));
  };

  const handleTitleChange = (v) => {
    set('title', v);
    if (panel?.mode === 'add') set('slug', toSlug(v));
  };

  const save = async () => {
    if (!draft.title.trim()) { setSaveError('Judul album wajib diisi.'); return; }
    if (!draft.slug.trim())  { setSaveError('Slug wajib diisi.'); return; }
    if (!draft.drive_folder_id.trim()) { setSaveError('Google Drive URL wajib diisi.'); return; }

    setSaving(true);
    setSaveError('');
    const row = {
      slug: draft.slug,
      title: draft.title,
      description: draft.description || null,
      drive_folder_id: draft.drive_folder_id,
      active: draft.active,
    };
    if (panel.mode === 'add') {
      const { data, error } = await supabase.from('photo_albums').insert(row).select().single();
      if (error) { setSaveError(`Gagal simpan: ${error.message}`); setSaving(false); return; }
      if (data) setAlbums(p => [data, ...p]);
    } else {
      const { data, error } = await supabase.from('photo_albums').update(row).eq('id', panel.id).select().single();
      if (error) { setSaveError(`Gagal simpan: ${error.message}`); setSaving(false); return; }
      if (data) setAlbums(p => p.map(a => a.id === panel.id ? data : a));
    }
    setSaving(false);
    setPanel(null);
  };

  const confirmDelete = async () => {
    await supabase.from('photo_albums').delete().eq('id', deleteId);
    setAlbums(p => p.filter(a => a.id !== deleteId));
    setDeleteId(null);
  };

  const toggleActive = async (a) => {
    const { data } = await supabase.from('photo_albums').update({ active: !a.active }).eq('id', a.id).select().single();
    if (data) setAlbums(p => p.map(x => x.id === a.id ? data : x));
  };

  const copyLink = (slug) => {
    navigator.clipboard.writeText(`https://ehjadiga.com/photos/${slug}`);
    setCopied(slug);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1100 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#111', letterSpacing: '-0.02em' }}>Photo Albums</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>
            {albums.length} album · Link unik per group, feedback dulu sebelum lihat foto
          </p>
        </div>
        <button onClick={openAdd} style={{ ...S.btn, background: '#252525', color: '#F3D543', padding: '10px 20px' }}>
          + Buat Album
        </button>
      </div>

      <div style={S.card}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>Memuat…</div>
        ) : albums.length === 0 ? (
          <EmptyState icon="📷" title="Belum ada album" sub="Klik '+ Buat Album' untuk mulai." />
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={S.th}>Album</th>
                <th style={S.th}>Link grup</th>
                <th style={S.th}>Status</th>
                <th style={S.th}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {albums.map(a => (
                <tr key={a.id}>
                  <td style={S.td}>
                    <div style={{ fontWeight: 600, color: a.active ? '#111' : '#9ca3af' }}>{a.title}</div>
                    {a.description && (
                      <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{a.description}</div>
                    )}
                  </td>
                  <td style={S.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <code style={{ fontSize: 12, color: '#0369a1', background: '#f0f9ff', padding: '3px 8px', borderRadius: 6, whiteSpace: 'nowrap' }}>
                        /photos/{a.slug}
                      </code>
                      <button
                        onClick={() => copyLink(a.slug)}
                        style={{ ...S.btn, padding: '3px 9px', fontSize: 11, background: copied === a.slug ? '#f0fdf4' : '#f3f4f6', color: copied === a.slug ? '#16a34a' : '#6b7280', flexShrink: 0 }}
                      >
                        {copied === a.slug ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </td>
                  <td style={S.td}>
                    <span style={{ ...S.badge, background: a.active ? '#f0fdf4' : '#f3f4f6', color: a.active ? '#16a34a' : '#6b7280' }}>
                      {a.active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td style={S.td}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => toggleActive(a)}
                        style={{ ...S.btn, padding: '5px 12px', background: a.active ? '#f3f4f6' : '#f0fdf4', color: a.active ? '#6b7280' : '#16a34a' }}
                      >
                        {a.active ? 'Nonaktifkan' : 'Aktifkan'}
                      </button>
                      <button onClick={() => openEdit(a)} style={{ ...S.btn, background: '#f0f9ff', color: '#0369a1', padding: '5px 12px' }}>Edit</button>
                      <button onClick={() => setDeleteId(a.id)} style={{ ...S.btn, background: '#fef2f2', color: '#dc2626', padding: '5px 12px' }}>Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {panel && draft && (
        <Panel
          title={panel.mode === 'add' ? 'Buat Album Baru' : 'Edit Album'}
          onClose={() => setPanel(null)}
          onSave={save}
          saving={saving}
        >
          <AField label="Judul album">
            <AInput value={draft.title} onChange={handleTitleChange} placeholder="Bromo Trip – Januari 2025" />
          </AField>

          <AField label="Slug (URL)" hint={`Link yang dibagikan: ehjadiga.com/photos/${draft.slug || 'slug-kamu'}`}>
            <AInput value={draft.slug} onChange={v => set('slug', toSlug(v))} placeholder="bromo-jan-25" />
          </AField>

          <AField label="Deskripsi" hint="Opsional — ditampilkan sebagai subtitle di halaman foto.">
            <ATextarea value={draft.description || ''} onChange={v => set('description', v)} rows={2} placeholder="Open trip Bromo 24–25 Januari 2025" />
          </AField>

          <AField label="Google Drive folder URL" hint="Paste link share folder. Folder ID diekstrak otomatis.">
            <AInput
              value={driveUrl}
              onChange={handleDriveUrl}
              placeholder="https://drive.google.com/drive/folders/..."
            />
            {draft.drive_folder_id && (
              <div style={{ marginTop: 6, fontSize: 11, color: '#6b7280' }}>
                Folder ID:{' '}
                <code style={{ background: '#f3f4f6', padding: '1px 6px', borderRadius: 4, fontSize: 11 }}>
                  {draft.drive_folder_id}
                </code>
              </div>
            )}
          </AField>

          {saveError && (
            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#dc2626' }}>
              {saveError}
            </div>
          )}

          <AField label="Status">
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '10px 14px', background: draft.active ? '#f0fdf4' : '#f3f4f6', borderRadius: 10, border: `1.5px solid ${draft.active ? '#86efac' : '#e5e7eb'}` }}>
              <input
                type="checkbox"
                checked={draft.active}
                onChange={e => set('active', e.target.checked)}
                style={{ width: 16, height: 16, accentColor: '#16a34a' }}
              />
              <span style={{ fontSize: 13, fontWeight: 600, color: draft.active ? '#15803d' : '#6b7280' }}>
                {draft.active ? 'Aktif — link bisa diakses oleh group' : 'Nonaktif — link tidak bisa dibuka'}
              </span>
            </label>
          </AField>
        </Panel>
      )}

      {deleteId && (
        <ConfirmModal
          message={`Hapus album "${albums.find(a => a.id === deleteId)?.title}"? Aksi ini tidak bisa dibatalkan.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
