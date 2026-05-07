import { useState } from 'react';
import { useData } from '../context/DataContext';
import { S, AField, ATextarea, Panel, ConfirmModal, EmptyState } from './shared';
import InvoiceModal from './InvoiceModal';

const STATUS_OPTIONS = [
  { value: 'new',         label: 'New Inquiry' },
  { value: 'pending',     label: 'Pending' },
  { value: 'confirmed',   label: 'Confirmed' },
  { value: 'canceled',    label: 'Canceled' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'closed',      label: 'Closed' },
];

const STATUS_COLORS = {
  new:         { bg: '#eff6ff', color: '#1d4ed8' },
  pending:     { bg: '#fef9c3', color: '#854d0e' },
  confirmed:   { bg: '#f0fdf4', color: '#16a34a' },
  canceled:    { bg: '#fef2f2', color: '#dc2626' },
  in_progress: { bg: '#fff7ed', color: '#c2410c' },
  closed:      { bg: '#f3f4f6', color: '#6b7280' },
};

const KIND_LABELS = {
  open: 'Open Trip', private: 'Private Trip',
  glamping: 'Glamping', corporate: 'Corporate',
};

const FILTER_OPTIONS = [
  { value: 'all',       label: 'Semua' },
  { value: 'new',       label: 'New Inquiry' },
  { value: 'pending',   label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'canceled',  label: 'Canceled' },
];

/* ── helpers to extract meaningful data from inq.data ── */
function getDestLabel(inq, openTrips, privateDestinations, glampings) {
  const d = inq.data || {};
  if (inq.kind === 'open') {
    const t = openTrips.find(x => x.id === d.tripId);
    return t ? t.dest : d.tripId || '–';
  }
  if (inq.kind === 'private') {
    const p = privateDestinations.find(x => x.id === d.privateDest);
    return p ? p.name : d.privateDest || '–';
  }
  if (inq.kind === 'glamping') {
    const g = glampings.find(x => x.id === d.glampLoc);
    return g ? g.name : d.glampLoc || '–';
  }
  return d.tripDest || '–';
}

function getDepartureDate(inq, openTrips) {
  const d = inq.data || {};
  if (inq.kind === 'open') {
    const t = openTrips.find(x => x.id === d.tripId);
    return t ? `${t.start} – ${t.end}` : d.date || '–';
  }
  return d.date || '–';
}

function getDuration(inq, openTrips) {
  const d = inq.data || {};
  if (inq.kind === 'open') {
    const t = openTrips.find(x => x.id === d.tripId);
    return t ? t.duration : '–';
  }
  if (inq.kind === 'private') return d.privateDuration || '–';
  if (inq.kind === 'glamping') return d.nights ? `${d.nights} malam` : '–';
  return '–';
}

function getAddons(inq, openTrips, glampings) {
  const d = inq.data || {};
  if (!d.addons?.length) return '–';
  if (inq.kind === 'open') {
    const t = openTrips.find(x => x.id === d.tripId);
    return d.addons.map(id => t?.addons?.find(a => a.id === id)?.label || id).join(', ');
  }
  if (inq.kind === 'glamping') {
    const g = glampings.find(x => x.id === d.glampLoc);
    return d.addons.map(id => g?.addons?.find(a => a.id === id)?.label || id).join(', ');
  }
  return d.addons.join(', ');
}

function StatusBadge({ status }) {
  const sc = STATUS_COLORS[status] || STATUS_COLORS.new;
  const opt = STATUS_OPTIONS.find(o => o.value === status);
  return (
    <span style={{ ...S.badge, background: sc.bg, color: sc.color, whiteSpace: 'nowrap' }}>
      {opt?.label || status}
    </span>
  );
}

function Row({ label, value }) {
  if (!value || value === '–') return null;
  return (
    <div style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
      <div style={{ width: 130, fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', flexShrink: 0, paddingTop: 1 }}>{label}</div>
      <div style={{ fontSize: 13, color: '#111', flex: 1, wordBreak: 'break-word' }}>{value}</div>
    </div>
  );
}

export default function AdminInquiries() {
  const { inquiries, setInquiries, deleteInquiry, openTrips, privateDestinations, glampings } = useData();
  const [detail, setDetail]       = useState(null);
  const [invoiceInq, setInvoiceInq] = useState(null);
  const [deleteId, setDeleteId]   = useState(null);
  const [saving, setSaving]       = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const openDetail = (inq) => setDetail({ ...inq });
  const setField   = (key, val) => setDetail(d => ({ ...d, [key]: val }));

  const saveDetail = async () => {
    setSaving(true);
    await setInquiries(inquiries.map(i => i.id === detail.id ? detail : i));
    setSaving(false);
    setDetail(null);
  };

  const confirmDelete = async () => {
    await deleteInquiry(deleteId);
    setDeleteId(null);
  };

  const filtered = filterStatus === 'all'
    ? inquiries
    : inquiries.filter(i => i.status === filterStatus);

  const countFor = (s) => inquiries.filter(i => i.status === s).length;

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1200 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#111' }}>Inquiry</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>{inquiries.length} total inquiry</p>
        </div>
      </div>

      {/* Status filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {FILTER_OPTIONS.map(opt => {
          const count = opt.value === 'all' ? inquiries.length : countFor(opt.value);
          const active = filterStatus === opt.value;
          return (
            <button key={opt.value} onClick={() => setFilterStatus(opt.value)} style={{
              ...S.btn, padding: '6px 14px', fontSize: 12,
              background: active ? '#252525' : '#f3f4f6',
              color: active ? '#F3D543' : '#6b7280',
            }}>
              {opt.label} ({count})
            </button>
          );
        })}
      </div>

      <div style={{ ...S.card, overflowX: 'auto' }}>
        {filtered.length === 0 ? (
          <EmptyState icon="📬" title="Belum ada inquiry" sub="Inquiry dari form publik akan muncul di sini." />
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
            <thead>
              <tr>
                <th style={S.th}>Timestamp</th>
                <th style={S.th}>Status</th>
                <th style={S.th}>Kind</th>
                <th style={S.th}>Destination</th>
                <th style={S.th}>Meeting Point</th>
                <th style={S.th}>Departure</th>
                <th style={S.th}>Pax</th>
                <th style={S.th}>Name</th>
                <th style={S.th}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(inq => {
                const d = inq.data || {};
                const dest = getDestLabel(inq, openTrips, privateDestinations, glampings);
                const mp = inq.kind === 'glamping' ? '–' : (d.meetingPoint || '–');
                const departure = getDepartureDate(inq, openTrips);
                return (
                  <tr key={inq.id}>
                    <td style={{ ...S.td, whiteSpace: 'nowrap', fontSize: 12, color: '#6b7280' }}>
                      {inq.createdAt
                        ? <>
                            <div>{new Date(inq.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                            <div style={{ fontSize: 11, color: '#9ca3af' }}>{new Date(inq.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</div>
                          </>
                        : '–'}
                    </td>
                    <td style={S.td}><StatusBadge status={inq.status} /></td>
                    <td style={S.td}>
                      <span style={{ ...S.badge, background: '#f0f9ff', color: '#0369a1', whiteSpace: 'nowrap' }}>
                        {KIND_LABELS[inq.kind] || inq.kind}
                      </span>
                    </td>
                    <td style={{ ...S.td, maxWidth: 160 }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{dest}</div>
                    </td>
                    <td style={{ ...S.td, fontSize: 13, color: mp === '–' ? '#d1d5db' : '#374151' }}>{mp}</td>
                    <td style={{ ...S.td, fontSize: 12, whiteSpace: 'nowrap', color: '#374151' }}>{departure}</td>
                    <td style={{ ...S.td, fontSize: 13, fontWeight: 600 }}>{d.pax || '–'}</td>
                    <td style={S.td}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{inq.name || '–'}</div>
                      <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{inq.wa || ''}</div>
                    </td>
                    <td style={S.td}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => openDetail(inq)} style={{ ...S.btn, background: '#f0f9ff', color: '#0369a1', padding: '5px 12px' }}>Detail</button>
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

      {detail && (
        <Panel
          title="Detail Inquiry"
          onClose={() => setDetail(null)}
          onSave={saveDetail}
          saving={saving}
        >
          {/* Invoice button */}
          <div style={{ marginBottom: 16 }}>
            <button
              onClick={() => { setDetail(null); setInvoiceInq(detail); }}
              style={{ ...S.btn, background: '#252525', color: '#F3D543', padding: '10px 20px', width: '100%', fontSize: 13 }}
            >
              📄 Buat Invoice untuk Inquiry ini
            </button>
          </div>

          {/* Editable fields */}
          <AField label="Status">
            <select style={{ ...S.input }} value={detail.status} onChange={e => setField('status', e.target.value)}>
              {STATUS_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </AField>
          <AField label="Catatan internal" hint="Hanya terlihat di CMS.">
            <ATextarea value={detail.notes || ''} onChange={v => setField('notes', v)} rows={2} placeholder="Follow-up, info tambahan…" />
          </AField>

          {/* Read-only info */}
          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: '4px 16px', marginTop: 8 }}>
            <Row label="Timestamp"     value={detail.createdAt ? new Date(detail.createdAt).toLocaleString('id-ID') : '–'} />
            <Row label="Kind"          value={KIND_LABELS[detail.kind] || detail.kind} />
            <Row label="Name"          value={detail.name} />
            <Row label="Email"         value={detail.email} />
            <Row label="WhatsApp"      value={detail.wa} />
            <Row label="Destination"   value={getDestLabel(detail, openTrips, privateDestinations, glampings)} />
            <Row label="Meeting Point" value={detail.kind === 'glamping' ? null : (detail.data?.meetingPoint || null)} />
            <Row label="Departure"     value={getDepartureDate(detail, openTrips)} />
            <Row label="Pax"           value={detail.data?.pax != null ? String(detail.data.pax) : null} />
            <Row label="Duration"      value={getDuration(detail, openTrips)} />
            <Row label="Add-Ons"       value={getAddons(detail, openTrips, glampings)} />
            <Row label="Notes"         value={detail.data?.notes} />
            <Row label="Referral"      value={detail.data?.referralCode || detail.data?.appliedReferral?.code || null} />
          </div>
        </Panel>
      )}

      {invoiceInq && (
        <InvoiceModal inquiry={invoiceInq} onClose={() => setInvoiceInq(null)} />
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
