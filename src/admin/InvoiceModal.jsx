import { useState } from 'react';
import { useData } from '../context/DataContext';
import { S, AField, AInput, ATextarea } from './shared';

const KIND_LABELS = { open: 'Open Trip', private: 'Private Trip', glamping: 'Glamping', corporate: 'Corporate' };
const EMAIL_WORKER_URL = import.meta.env.VITE_EMAIL_WORKER_URL;

function fmtRp(n) {
  return 'Rp' + Number(n || 0).toLocaleString('id-ID');
}

function todayStr() {
  return new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
}

function dueDateStr(days = 7) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
}

function autoNum() {
  const n = new Date();
  return `${n.getFullYear()}${String(n.getMonth() + 1).padStart(2, '0')}${String(n.getDate()).padStart(2, '0')}`;
}

function getDepartureDate(inq, openTrips) {
  const d = inq.data || {};
  if (inq.kind === 'open') {
    const t = openTrips.find(x => x.id === d.tripId);
    return t ? `${t.start} – ${t.end}` : d.date || '';
  }
  return d.date || '';
}

function buildItems(inq, openTrips, glampings, privateDestinations) {
  const d = inq.data || {};
  const pax = Number(d.pax || 1);
  const mk = (overrides) => ({ id: `i-${Date.now()}-${Math.random().toString(36).slice(2)}`, name: '', desc: '', qty: 1, unitPrice: 0, total: 0, ...overrides });
  const items = [];

  if (inq.kind === 'open') {
    const trip = openTrips.find(t => t.id === d.tripId);
    if (trip) {
      const price = trip.priceNum || 0;
      items.push(mk({ id: 'main', name: `Open Trip ${trip.dest}`, desc: `${trip.start} – ${trip.end}`, qty: pax, unitPrice: price, total: price * pax }));
      (d.addons || []).forEach(id => {
        const a = trip.addons?.find(x => x.id === id);
        if (a) {
          const qty = a.pricingType === 'per_guest' ? pax : 1;
          items.push(mk({ id: `ao-${id}`, name: `Add-on: ${a.label}`, desc: a.desc || '', qty, unitPrice: a.price, total: a.price * qty }));
        }
      });
    }
  } else if (inq.kind === 'glamping') {
    const g = glampings.find(x => x.id === d.glampLoc);
    items.push(mk({ id: 'main', name: g ? `Glamping — ${g.name}` : 'Glamping', desc: `${pax} orang · ${d.nights || 1} malam` }));
    if (g) {
      (d.addons || []).forEach(id => {
        const a = g.addons?.find(x => x.id === id);
        if (a) {
          const qty = a.pricingType === 'per_guest' ? pax : 1;
          items.push(mk({ id: `ao-${id}`, name: `Add-on: ${a.label}`, desc: a.desc || '', qty, unitPrice: a.price, total: a.price * qty }));
        }
      });
    }
  } else if (inq.kind === 'private') {
    const dest = privateDestinations.find(x => x.id === d.privateDest);
    items.push(mk({ id: 'main', name: `Private Trip${dest ? ` — ${dest.name}` : ''}`, desc: `${pax} orang · ${d.privateDuration || ''}` }));
  } else {
    items.push(mk({ id: 'main' }));
  }

  return items;
}

/* ── HTML generator for print & email ─────────────────────────────────────── */

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function generateHtml(inv, st = {}) {
  const subtotal = inv.items.reduce((s, i) => s + (i.total || 0), 0);
  const total = Math.max(0, subtotal - (inv.deposit || 0));

  return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Invoice EJG-${esc(inv.num)}</title>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#F0ECE4;font-family:'Plus Jakarta Sans',sans-serif;padding:40px 20px;color:#252525}
.wrapper{max-width:680px;margin:0 auto}
.top-strip{background:#252525;border-radius:16px 16px 0 0;padding:28px 40px;display:flex;align-items:center;justify-content:space-between}
.brand{display:flex;align-items:center;gap:12px}
.brand-mark{width:42px;height:42px;background:#F3D543;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:#252525;letter-spacing:-0.5px}
.brand-name{font-size:15px;font-weight:700;color:#fff;letter-spacing:-0.3px}
.brand-sub{font-size:10px;color:rgba(255,255,255,.45);font-weight:400;margin-top:1px}
.invoice-badge{background:#F3D543;color:#252525;font-size:11px;font-weight:700;padding:6px 14px;border-radius:20px;letter-spacing:.5px;text-transform:uppercase}
.card{background:#fff;padding:40px}
.meta-row{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;padding-bottom:28px;border-bottom:1.5px solid #EEEAE2}
.meta-label{font-size:10px;color:rgba(37,37,37,.4);font-weight:500;text-transform:uppercase;letter-spacing:.8px;margin-bottom:4px}
.meta-value{font-size:14px;font-weight:600;color:#252525}
.invoice-num{font-size:22px;font-weight:800;color:#252525;letter-spacing:-.5px}
.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:32px}
.info-box{background:#F7F5F0;border-radius:12px;padding:18px 20px}
.info-box-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:rgba(37,37,37,.35);margin-bottom:10px}
.info-row{margin-bottom:4px}
.info-row .key{font-size:11px;color:rgba(37,37,37,.5)}
.info-row .val{font-size:13px;font-weight:600;color:#252525}
.items-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:rgba(37,37,37,.35);margin-bottom:12px}
table.items{width:100%;border-collapse:collapse;margin-bottom:24px}
table.items thead th{background:#252525;color:rgba(255,255,255,.55);font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.7px;padding:10px 14px;text-align:left}
table.items thead th:first-child{border-radius:8px 0 0 8px}
table.items thead th:last-child{border-radius:0 8px 8px 0;text-align:right}
table.items tbody tr{border-bottom:1px solid #EEEAE2}
table.items tbody tr:last-child{border-bottom:none}
table.items tbody td{padding:14px;font-size:13px;color:#252525;vertical-align:top}
table.items tbody td:last-child{text-align:right;font-weight:600}
.item-name{font-weight:600;margin-bottom:2px}
.item-desc{font-size:11px;color:rgba(37,37,37,.45)}
.totals-row{display:flex;justify-content:space-between;padding:7px 0;font-size:13px;color:rgba(37,37,37,.6);border-bottom:1px dashed #EEEAE2}
.totals-row:last-of-type{border-bottom:none}
.totals-final{display:flex;justify-content:space-between;align-items:center;background:#252525;border-radius:12px;padding:18px 20px;margin-top:12px}
.totals-final .label{font-size:12px;color:rgba(255,255,255,.55);font-weight:500}
.totals-final .amount{font-size:24px;font-weight:800;color:#F3D543;letter-spacing:-.5px}
.section-divider{height:1.5px;background:#EEEAE2;margin:32px 0}
.payment-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:28px}
.payment-box{border:1.5px solid #EEEAE2;border-radius:12px;padding:16px 18px}
.payment-box-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:rgba(37,37,37,.35);margin-bottom:8px}
.payment-val{font-size:13px;font-weight:700;color:#252525}
.payment-sub{font-size:11px;color:rgba(37,37,37,.45);margin-top:2px}
.notes{background:#FFFBEA;border-left:3px solid #F3D543;border-radius:0 8px 8px 0;padding:14px 16px;font-size:12px;color:rgba(37,37,37,.65);line-height:1.7}
.notes strong{color:#252525}
.footer-strip{background:#252525;border-radius:0 0 16px 16px;padding:22px 40px;display:flex;justify-content:space-between;align-items:center}
.footer-issued{font-size:11px;color:rgba(255,255,255,.4)}
.footer-issued strong{color:#fff;display:block;font-size:13px;margin-top:2px}
.footer-contact{text-align:right}
.footer-contact a{display:block;font-size:11px;color:rgba(255,255,255,.55);text-decoration:none}
@media print{body{background:#fff;padding:0}.wrapper{max-width:100%}}
</style>
</head>
<body>
<div class="wrapper">
<div class="top-strip">
  <div class="brand">
    <div class="brand-mark">EJG</div>
    <div>
      <div class="brand-name">EH! JADI GA?</div>
      <div class="brand-sub">Travel &amp; Glamping</div>
    </div>
  </div>
  <div class="invoice-badge">Invoice</div>
</div>
<div class="card">
  <div class="meta-row">
    <div>
      <div class="meta-label">Nomor Invoice</div>
      <div class="invoice-num">EJG-${esc(inv.num)}</div>
    </div>
    <div style="text-align:right">
      <div style="margin-bottom:12px">
        <div class="meta-label">Tanggal Invoice</div>
        <div class="meta-value">${esc(inv.date)}</div>
      </div>
      <div>
        <div class="meta-label">Batas Pembayaran</div>
        <div class="meta-value" style="color:#D63A2F">${esc(inv.due)}</div>
      </div>
    </div>
  </div>
  <div class="info-grid">
    <div class="info-box">
      <div class="info-box-label">Bill To</div>
      <div class="info-row"><div class="val" style="font-size:15px;font-weight:700">${esc(inv.customerName)}</div></div>
      <div class="info-row" style="margin-top:6px"><div class="key">Telepon</div><div class="val">${esc(inv.customerPhone)}</div></div>
      <div class="info-row"><div class="key">Email</div><div class="val">${esc(inv.customerEmail)}</div></div>
    </div>
    <div class="info-box">
      <div class="info-box-label">Detail Booking</div>
      <div class="info-row"><div class="key">Jenis Trip</div><div class="val">${esc(inv.tripType)}</div></div>
      <div class="info-row"><div class="key">Tanggal</div><div class="val">${esc(inv.tripDate)}</div></div>
      <div class="info-row"><div class="key">Jumlah Orang</div><div class="val">${esc(inv.paxCount)}</div></div>
      <div class="info-row"><div class="key">Booking ID</div><div class="val">${esc(inv.bookingId)}</div></div>
    </div>
  </div>
  <div class="items-label">Rincian Biaya</div>
  <table class="items">
    <thead><tr>
      <th style="width:45%">Item</th>
      <th>Qty</th>
      <th>Harga Satuan</th>
      <th>Total</th>
    </tr></thead>
    <tbody>
      ${inv.items.map(it => `
      <tr>
        <td>
          <div class="item-name">${esc(it.name)}</div>
          ${it.desc ? `<div class="item-desc">${esc(it.desc)}</div>` : ''}
        </td>
        <td>${esc(it.qty)}</td>
        <td>${fmtRp(it.unitPrice)}</td>
        <td>${fmtRp(it.total)}</td>
      </tr>`).join('')}
    </tbody>
  </table>
  <div style="display:flex;justify-content:flex-end">
    <div style="width:280px">
      <div class="totals-row"><span>Subtotal</span><span>${fmtRp(subtotal)}</span></div>
      <div class="totals-row ${inv.deposit > 0 ? 'deposit' : ''}">
        <span>DP yang sudah dibayar</span>
        <span style="${inv.deposit > 0 ? 'color:#2B8A3E;font-weight:600' : ''}">${inv.deposit > 0 ? `− ${fmtRp(inv.deposit)}` : '−'}</span>
      </div>
      <div class="totals-final">
        <div class="label">Total Tagihan</div>
        <div class="amount">${fmtRp(total)}</div>
      </div>
    </div>
  </div>
  <div class="section-divider"></div>
  <div class="items-label" style="margin-bottom:14px">Informasi Pembayaran</div>
  <div class="payment-grid">
    <div class="payment-box">
      <div class="payment-box-label">Transfer Bank</div>
      <div class="payment-val">${esc(st.bank_name)}</div>
      <div class="payment-sub">No. Rek: ${esc(st.bank_account)}</div>
      <div class="payment-sub">a/n ${esc(st.bank_holder)}</div>
    </div>
    <div class="payment-box">
      <div class="payment-box-label">Konfirmasi Pembayaran</div>
      <div class="payment-val">WhatsApp</div>
      <div class="payment-sub">${esc(st.whatsapp)}</div>
      <div class="payment-sub" style="margin-top:6px">${esc(st.company_email)}</div>
    </div>
  </div>
  <div class="notes">
    <strong>Catatan:</strong> ${esc(inv.notes)}
  </div>
</div>
<div class="footer-strip">
  <div class="footer-issued">
    Diterbitkan oleh
    <strong>${esc(inv.issuerName)}</strong>
  </div>
  <div class="footer-contact">
    <a href="mailto:${esc(st.company_email)}">${esc(st.company_email)}</a>
    <a href="https://wa.me/${esc(st.whatsapp)}">wa.me/${esc(st.whatsapp)}</a>
    <a href="https://instagram.com/${esc(st.instagram)}">@${esc(st.instagram)}</a>
  </div>
</div>
</div>
</body>
</html>`;
}

/* ── Section wrapper ───────────────────────────────────────────────────────── */

function Section({ title, children }) {
  return (
    <div style={{ ...S.card, marginBottom: 16 }}>
      <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: '#111', letterSpacing: '-0.01em' }}>{title}</h3>
      {children}
    </div>
  );
}

/* ── Main component ────────────────────────────────────────────────────────── */

export default function InvoiceModal({ inquiry: inq, onClose }) {
  const { openTrips, glampings, privateDestinations, siteSettings } = useData();

  const [inv, setInv] = useState(() => ({
    num: autoNum(),
    date: todayStr(),
    due: dueDateStr(7),
    customerName: inq.name || '',
    customerPhone: inq.wa || '',
    customerEmail: inq.email || '',
    tripType: KIND_LABELS[inq.kind] || '',
    tripDate: getDepartureDate(inq, openTrips),
    paxCount: `${inq.data?.pax || 1} orang`,
    bookingId: `#EJG-${(inq.id || '').slice(-8).toUpperCase()}`,
    items: buildItems(inq, openTrips, glampings, privateDestinations),
    deposit: 0,
    notes: 'Mohon konfirmasi pembayaran via WhatsApp dengan mengirimkan bukti transfer. Invoice ini berlaku sebagai bukti pemesanan resmi. Pembayaran setelah batas waktu dapat menyebabkan pembatalan booking.',
    issuerName: siteSettings?.issuer_name || '',
  }));

  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);
  const [sendError, setSendError] = useState('');

  const setF = (k, v) => setInv(p => ({ ...p, [k]: v }));

  const updateItem = (id, key, raw) => {
    setInv(p => ({
      ...p,
      items: p.items.map(item => {
        if (item.id !== id) return item;
        const val = (key === 'qty' || key === 'unitPrice') ? Number(raw) : raw;
        const up = { ...item, [key]: val };
        if (key === 'qty' || key === 'unitPrice') up.total = up.qty * up.unitPrice;
        return up;
      }),
    }));
  };

  const addItem = () => setInv(p => ({
    ...p,
    items: [...p.items, { id: `i-${Date.now()}`, name: '', desc: '', qty: 1, unitPrice: 0, total: 0 }],
  }));

  const removeItem = (id) => setInv(p => ({ ...p, items: p.items.filter(i => i.id !== id) }));

  const subtotal = inv.items.reduce((s, i) => s + (i.total || 0), 0);
  const total = Math.max(0, subtotal - (inv.deposit || 0));

  const handlePrint = () => {
    const html = generateHtml({ ...inv, subtotal, total }, siteSettings);
    const w = window.open('', '_blank');
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 600);
  };

  const handleSendEmail = async () => {
    if (!EMAIL_WORKER_URL) {
      setSendError('VITE_EMAIL_WORKER_URL belum dikonfigurasi di .env — tambahkan URL Cloudflare Worker kamu.');
      return;
    }
    setSending(true); setSendError(''); setSent(false);
    try {
      const html = generateHtml({ ...inv, subtotal, total }, siteSettings);
      const res = await fetch(EMAIL_WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: inv.customerEmail,
          subject: `Invoice #EJG-${inv.num} — EH! JADI GA?`,
          html,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSent(true);
    } catch (e) {
      setSendError(e.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: '#f3f4f6', overflowY: 'auto' }}>

      {/* Sticky toolbar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: '#fff', borderBottom: '1px solid #e5e7eb',
        padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}>
        <button onClick={onClose} style={{ ...S.btn, background: '#f3f4f6', color: '#374151', padding: '8px 14px', fontSize: 13 }}>
          ← Kembali
        </button>
        <span style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>Invoice EJG-{inv.num}</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handlePrint} style={{ ...S.btn, background: '#f3f4f6', color: '#374151', padding: '8px 16px', fontSize: 13 }}>
            🖨 Pratinjau &amp; Print
          </button>
          <button
            onClick={handleSendEmail}
            disabled={sending || !inv.customerEmail}
            style={{ ...S.btn, background: sent ? '#f0fdf4' : '#252525', color: sent ? '#16a34a' : '#F3D543', padding: '8px 16px', fontSize: 13, opacity: !inv.customerEmail ? 0.4 : 1 }}
          >
            {sending ? 'Mengirim…' : sent ? '✓ Invoice Terkirim' : `✉ Kirim ke ${inv.customerEmail || '(isi email dulu)'}`}
          </button>
        </div>
      </div>

      {sendError && (
        <div style={{ maxWidth: 760, margin: '16px auto 0', padding: '0 20px' }}>
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#dc2626' }}>
            {sendError}
          </div>
        </div>
      )}

      {/* Form body */}
      <div style={{ maxWidth: 760, margin: '24px auto', padding: '0 20px 60px' }}>

        {/* Invoice Info */}
        <Section title="Info Invoice">
          <div style={{ display: 'flex', gap: '4%', flexWrap: 'wrap' }}>
            <AField label="Nomor Invoice" half hint="Akan tampil sebagai EJG-[nomor]">
              <AInput value={inv.num} onChange={v => setF('num', v)} placeholder="20250507001" />
            </AField>
            <AField label="Tanggal Invoice" half>
              <AInput value={inv.date} onChange={v => setF('date', v)} placeholder="07 Mei 2025" />
            </AField>
          </div>
          <AField label="Batas Pembayaran (Due Date)">
            <AInput value={inv.due} onChange={v => setF('due', v)} placeholder="14 Mei 2025" />
          </AField>
        </Section>

        {/* Customer */}
        <Section title="Pelanggan (Bill To)">
          <AField label="Nama">
            <AInput value={inv.customerName} onChange={v => setF('customerName', v)} placeholder="Nama pelanggan" />
          </AField>
          <div style={{ display: 'flex', gap: '4%', flexWrap: 'wrap' }}>
            <AField label="No. WhatsApp" half>
              <AInput value={inv.customerPhone} onChange={v => setF('customerPhone', v)} placeholder="+62 812…" />
            </AField>
            <AField label="Email" half hint="Invoice akan dikirim ke sini">
              <AInput value={inv.customerEmail} onChange={v => setF('customerEmail', v)} placeholder="pelanggan@email.com" />
            </AField>
          </div>
        </Section>

        {/* Booking Details */}
        <Section title="Detail Booking">
          <div style={{ display: 'flex', gap: '4%', flexWrap: 'wrap' }}>
            <AField label="Jenis Trip" half>
              <AInput value={inv.tripType} onChange={v => setF('tripType', v)} placeholder="Glamping / Open Trip" />
            </AField>
            <AField label="Tanggal Trip/Check-in" half>
              <AInput value={inv.tripDate} onChange={v => setF('tripDate', v)} placeholder="24 Mei 2025" />
            </AField>
          </div>
          <div style={{ display: 'flex', gap: '4%', flexWrap: 'wrap' }}>
            <AField label="Jumlah Orang" half>
              <AInput value={inv.paxCount} onChange={v => setF('paxCount', v)} placeholder="2 orang" />
            </AField>
            <AField label="Booking ID" half>
              <AInput value={inv.bookingId} onChange={v => setF('bookingId', v)} placeholder="#EJG-G001" />
            </AField>
          </div>
        </Section>

        {/* Line Items */}
        <Section title="Rincian Biaya">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
              <thead>
                <tr>
                  <th style={{ ...S.th, width: '30%' }}>Item</th>
                  <th style={S.th}>Deskripsi</th>
                  <th style={{ ...S.th, width: 60 }}>Qty</th>
                  <th style={{ ...S.th, width: 120 }}>Harga/unit (Rp)</th>
                  <th style={{ ...S.th, width: 110 }}>Total</th>
                  <th style={{ ...S.th, width: 40 }}></th>
                </tr>
              </thead>
              <tbody>
                {inv.items.map(item => (
                  <tr key={item.id}>
                    <td style={S.td}>
                      <input
                        style={{ ...S.input, fontSize: 13 }}
                        value={item.name}
                        onChange={e => updateItem(item.id, 'name', e.target.value)}
                        placeholder="Nama item"
                      />
                    </td>
                    <td style={S.td}>
                      <input
                        style={{ ...S.input, fontSize: 12 }}
                        value={item.desc}
                        onChange={e => updateItem(item.id, 'desc', e.target.value)}
                        placeholder="Deskripsi"
                      />
                    </td>
                    <td style={S.td}>
                      <input
                        style={{ ...S.input, fontSize: 13, textAlign: 'center' }}
                        type="number" min={1}
                        value={item.qty}
                        onChange={e => updateItem(item.id, 'qty', e.target.value)}
                      />
                    </td>
                    <td style={S.td}>
                      <input
                        style={{ ...S.input, fontSize: 13 }}
                        type="number" min={0}
                        value={item.unitPrice}
                        onChange={e => updateItem(item.id, 'unitPrice', e.target.value)}
                      />
                    </td>
                    <td style={{ ...S.td, fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap' }}>
                      {fmtRp(item.total)}
                    </td>
                    <td style={S.td}>
                      <button
                        onClick={() => removeItem(item.id)}
                        style={{ ...S.btn, background: '#fef2f2', color: '#dc2626', padding: '4px 8px', fontSize: 13 }}
                      >×</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={addItem} style={{ ...S.btn, background: '#f0f9ff', color: '#0369a1', fontSize: 12, marginTop: 12 }}>
            + Tambah baris
          </button>

          {/* Totals summary */}
          <div style={{ marginTop: 20, borderTop: '1.5px solid #e5e7eb', paddingTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#6b7280', marginBottom: 8 }}>
              <span>Subtotal</span><span style={{ fontWeight: 600 }}>{fmtRp(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: '#6b7280', flexShrink: 0 }}>DP sudah dibayar (Rp)</span>
              <input
                type="number" min={0}
                value={inv.deposit}
                onChange={e => setF('deposit', Number(e.target.value))}
                style={{ ...S.input, width: 160, fontSize: 13 }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', background: '#252525', borderRadius: 10, padding: '14px 18px' }}>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Total Tagihan</span>
              <span style={{ fontWeight: 800, fontSize: 20, color: '#F3D543', letterSpacing: '-0.03em' }}>{fmtRp(total)}</span>
            </div>
          </div>
        </Section>

        {/* Notes */}
        <Section title="Catatan Invoice">
          <ATextarea value={inv.notes} onChange={v => setF('notes', v)} rows={3} />
        </Section>

        {/* Footer / Issuer */}
        <Section title="Diterbitkan Oleh">
          <AField label="Nama & Posisi">
            <AInput value={inv.issuerName} onChange={v => setF('issuerName', v)} placeholder="Nama — Tour Manager" />
          </AField>
        </Section>

        {/* Payment info (read-only from settings) */}
        <div style={{ ...S.card, background: '#f9fafb', borderColor: '#e5e7eb' }}>
          <h3 style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 700, color: '#6b7280' }}>
            Info Pembayaran (dari Settings — read only)
          </h3>
          <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.8 }}>
            <div><strong>{siteSettings?.bank_name || '—'}</strong> · {siteSettings?.bank_account || '—'} a/n {siteSettings?.bank_holder || '—'}</div>
            <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>
              Edit di Settings → Info Pembayaran
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
