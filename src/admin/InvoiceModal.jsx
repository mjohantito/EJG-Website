import { useState } from 'react';
import { useData } from '../context/DataContext';
import { S, AField, AInput, ATextarea } from './shared';
import { isPeakDay } from '../lib/holidays';

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
    const nights = d.nights || 1;
    const tentTier = d.tentType ? g?.priceTiers?.find(t => t.id === d.tentType) : g?.priceTiers?.[0];
    const peak = isPeakDay(d.date);
    const wkdPrice = tentTier?.priceWeekday ?? 0;
    const peakPrice = tentTier?.priceWeekend ?? 0;
    const pricePerNight = tentTier
      ? (peak ? peakPrice : wkdPrice)
      : (g?.pricePerNight ?? 0);
    const singleTentCap = tentTier?.capacity ?? 4;
    const singleTentMax = tentTier?.maxCapacity ?? 6;
    const tentCount = pax > singleTentMax ? 2 : 1;
    const extraBeds = tentCount === 1
      ? Math.max(0, pax - singleTentCap)
      : Math.max(0, pax - singleTentCap * 2);
    const glampTotal = pricePerNight * tentCount * nights;
    const tentDesc = tentTier?.name ? ` · ${tentTier.name}` : '';
    const tentCountLabel = tentCount > 1 ? ` · ${tentCount} tenda` : '';
    const rateLabel = d.date ? (peak ? 'Peak' : 'Weekday') : 'Weekday*';
    const priceHint = (tentTier && wkdPrice > 0 && peakPrice > 0 && wkdPrice !== peakPrice && !d.date)
      ? `  —  wkd: ${fmtRp(wkdPrice)} / peak: ${fmtRp(peakPrice)}`
      : '';
    items.push(mk({ id: 'main', name: g ? `Glamping — ${g.name}` : 'Glamping', desc: `${pax} orang${tentDesc}${tentCountLabel} · ${nights} malam · ${rateLabel}${priceHint}`, qty: 1, unitPrice: glampTotal, total: glampTotal }));
    if (extraBeds > 0 && tentTier?.extraBedPrice) {
      const ebTotal = extraBeds * tentTier.extraBedPrice * nights;
      items.push(mk({ id: 'extra-bed', name: 'Extra Bed', desc: `${extraBeds} extra bed × ${nights} malam`, qty: extraBeds, unitPrice: tentTier.extraBedPrice * nights, total: ebTotal }));
    }
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

  const tdL = `style="font-size:13px;color:rgba(37,37,37,.6);padding:7px 0;border-bottom:1px dashed #EEEAE2"`;
  const tdR = `style="font-size:13px;color:rgba(37,37,37,.6);padding:7px 0;border-bottom:1px dashed #EEEAE2;text-align:right"`;

  return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Invoice EJG-${esc(inv.num)}</title>
<style>
body{margin:0;padding:0;background:#F0ECE4;font-family:Arial,Helvetica,sans-serif;color:#252525}
a{color:inherit;text-decoration:none}
@media print{body{background:#fff}}
</style>
</head>
<body>
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F0ECE4;padding:40px 20px">
<tr><td align="center">
<table width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%">

  <!-- Header -->
  <tr><td style="background:#252525;border-radius:16px 16px 0 0;padding:24px 36px">
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td>
        <table cellpadding="0" cellspacing="0"><tr>
          <td style="vertical-align:middle;padding-right:12px">
            ${st.logo_url
              ? `<img src="${esc(st.logo_url)}" alt="Logo" height="42" style="display:block;height:42px;width:auto;border-radius:8px">`
              : `<div style="width:42px;height:42px;background:#F3D543;border-radius:10px;font-size:13px;font-weight:800;color:#252525;text-align:center;line-height:42px">EJG</div>`}
          </td>
          <td style="vertical-align:middle">
            <div style="font-size:15px;font-weight:700;color:#fff;letter-spacing:-0.3px">EH! JADI GA?</div>
            <div style="font-size:10px;color:rgba(255,255,255,.45);margin-top:1px">Travel &amp; Glamping</div>
          </td>
        </tr></table>
      </td>
      <td align="right" style="vertical-align:middle">
        <span style="background:#F3D543;color:#252525;font-size:11px;font-weight:700;padding:6px 14px;border-radius:20px;letter-spacing:.5px">INVOICE</span>
      </td>
    </tr></table>
  </td></tr>

  <!-- Card body -->
  <tr><td style="background:#fff;padding:36px">

    <!-- Invoice meta -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;padding-bottom:24px;border-bottom:1.5px solid #EEEAE2"><tr>
      <td style="vertical-align:top">
        <div style="font-size:10px;color:rgba(37,37,37,.4);font-weight:500;text-transform:uppercase;letter-spacing:.8px;margin-bottom:4px">Nomor Invoice</div>
        <div style="font-size:22px;font-weight:800;color:#252525;letter-spacing:-.5px">EJG-${esc(inv.num)}</div>
      </td>
      <td style="vertical-align:top;text-align:right">
        <div style="margin-bottom:10px">
          <div style="font-size:10px;color:rgba(37,37,37,.4);font-weight:500;text-transform:uppercase;letter-spacing:.8px;margin-bottom:4px">Tanggal Invoice</div>
          <div style="font-size:14px;font-weight:600;color:#252525">${esc(inv.date)}</div>
        </div>
        <div>
          <div style="font-size:10px;color:rgba(37,37,37,.4);font-weight:500;text-transform:uppercase;letter-spacing:.8px;margin-bottom:4px">Batas Pembayaran</div>
          <div style="font-size:14px;font-weight:600;color:#D63A2F">${esc(inv.due)}</div>
        </div>
      </td>
    </tr></table>

    <!-- Bill To / Detail Booking -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px"><tr>
      <td width="48%" style="vertical-align:top;background:#F7F5F0;border-radius:12px;padding:16px 18px">
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:rgba(37,37,37,.35);margin-bottom:10px">Bill To</div>
        <div style="font-size:15px;font-weight:700;color:#252525;margin-bottom:6px">${esc(inv.customerName)}</div>
        <div style="font-size:11px;color:rgba(37,37,37,.5);margin-bottom:2px">Telepon</div>
        <div style="font-size:13px;font-weight:600;color:#252525;margin-bottom:4px">${esc(inv.customerPhone)}</div>
        <div style="font-size:11px;color:rgba(37,37,37,.5);margin-bottom:2px">Email</div>
        <div style="font-size:13px;font-weight:600;color:#252525">${esc(inv.customerEmail)}</div>
      </td>
      <td width="4%"></td>
      <td width="48%" style="vertical-align:top;background:#F7F5F0;border-radius:12px;padding:16px 18px">
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:rgba(37,37,37,.35);margin-bottom:10px">Detail Booking</div>
        <div style="font-size:11px;color:rgba(37,37,37,.5);margin-bottom:2px">Jenis Trip</div>
        <div style="font-size:13px;font-weight:600;color:#252525;margin-bottom:4px">${esc(inv.tripType)}</div>
        <div style="font-size:11px;color:rgba(37,37,37,.5);margin-bottom:2px">Tanggal</div>
        <div style="font-size:13px;font-weight:600;color:#252525;margin-bottom:4px">${esc(inv.tripDate)}</div>
        <div style="font-size:11px;color:rgba(37,37,37,.5);margin-bottom:2px">Jumlah Orang</div>
        <div style="font-size:13px;font-weight:600;color:#252525;margin-bottom:4px">${esc(inv.paxCount)}</div>
        <div style="font-size:11px;color:rgba(37,37,37,.5);margin-bottom:2px">Booking ID</div>
        <div style="font-size:13px;font-weight:600;color:#252525">${esc(inv.bookingId)}</div>
      </td>
    </tr></table>

    <!-- Items table -->
    <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:rgba(37,37,37,.35);margin-bottom:10px">Rincian Biaya</div>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:16px">
      <thead>
        <tr style="background:#252525">
          <th style="padding:10px 14px;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.7px;color:rgba(255,255,255,.55);text-align:left;border-radius:8px 0 0 8px;width:44%">Item</th>
          <th style="padding:10px 14px;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.7px;color:rgba(255,255,255,.55);text-align:left">Qty</th>
          <th style="padding:10px 14px;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.7px;color:rgba(255,255,255,.55);text-align:left">Harga Satuan</th>
          <th style="padding:10px 14px;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.7px;color:rgba(255,255,255,.55);text-align:right;border-radius:0 8px 8px 0">Total</th>
        </tr>
      </thead>
      <tbody>
        ${inv.items.map(it => `
        <tr style="border-bottom:1px solid #EEEAE2">
          <td style="padding:12px 14px;font-size:13px;color:#252525;vertical-align:top">
            <div style="font-weight:600;margin-bottom:2px">${esc(it.name)}</div>
            ${it.desc ? `<div style="font-size:11px;color:rgba(37,37,37,.45)">${esc(it.desc)}</div>` : ''}
          </td>
          <td style="padding:12px 14px;font-size:13px;color:#252525;vertical-align:top">${esc(it.qty)}</td>
          <td style="padding:12px 14px;font-size:13px;color:#252525;vertical-align:top">${fmtRp(it.unitPrice)}</td>
          <td style="padding:12px 14px;font-size:13px;color:#252525;vertical-align:top;text-align:right;font-weight:600">${fmtRp(it.total)}</td>
        </tr>`).join('')}
      </tbody>
    </table>

    <!-- Totals -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px">
      <tr><td width="50%"></td><td width="50%">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td ${tdL}>Subtotal</td>
            <td ${tdR}>${fmtRp(subtotal)}</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:rgba(37,37,37,.6);padding:7px 0">DP yang sudah dibayar</td>
            <td style="font-size:13px;padding:7px 0;text-align:right;${inv.deposit > 0 ? 'color:#2B8A3E;font-weight:600' : 'color:rgba(37,37,37,.6)'}">${inv.deposit > 0 ? `− ${fmtRp(inv.deposit)}` : '−'}</td>
          </tr>
          <tr>
            <td colspan="2" style="padding-top:10px">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#252525;border-radius:12px"><tr>
                <td style="padding:16px 18px;font-size:12px;color:rgba(255,255,255,.55);font-weight:500;vertical-align:middle">Total Tagihan</td>
                <td style="padding:16px 18px;font-size:22px;font-weight:800;color:#F3D543;letter-spacing:-.5px;text-align:right;vertical-align:middle">${fmtRp(total)}</td>
              </tr></table>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>

    <!-- Divider -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0"><tr><td style="height:1px;background:#EEEAE2;font-size:0">&nbsp;</td></tr></table>

    <!-- Payment info -->
    <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:rgba(37,37,37,.35);margin-bottom:12px">Informasi Pembayaran</div>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px"><tr>
      <td width="48%" style="vertical-align:top;border:1.5px solid #EEEAE2;border-radius:12px;padding:14px 16px">
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:rgba(37,37,37,.35);margin-bottom:8px">Transfer Bank</div>
        <div style="font-size:13px;font-weight:700;color:#252525">${esc(st.bank_name)}</div>
        <div style="font-size:11px;color:rgba(37,37,37,.45);margin-top:3px">No. Rek: ${esc(st.bank_account)}</div>
        <div style="font-size:11px;color:rgba(37,37,37,.45);margin-top:2px">a/n ${esc(st.bank_holder)}</div>
      </td>
      <td width="4%"></td>
      <td width="48%" style="vertical-align:top;border:1.5px solid #EEEAE2;border-radius:12px;padding:14px 16px">
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:rgba(37,37,37,.35);margin-bottom:8px">Konfirmasi Pembayaran</div>
        <div style="font-size:13px;font-weight:700;color:#252525">WhatsApp</div>
        <div style="font-size:11px;color:rgba(37,37,37,.45);margin-top:3px">${esc(st.whatsapp)}</div>
        <div style="font-size:11px;color:rgba(37,37,37,.45);margin-top:4px">${esc(st.company_email)}</div>
      </td>
    </tr></table>

    <!-- Notes -->
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="background:#FFFBEA;border-left:3px solid #F3D543;border-radius:0 8px 8px 0;padding:14px 16px;font-size:12px;color:rgba(37,37,37,.65);line-height:1.7">
        <strong style="color:#252525">Catatan:</strong> ${esc(inv.notes)}
      </td>
    </tr></table>

  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#252525;border-radius:0 0 16px 16px;padding:20px 36px">
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="vertical-align:middle">
        <div style="font-size:11px;color:rgba(255,255,255,.4)">Diterbitkan oleh</div>
        <div style="font-size:13px;font-weight:700;color:#fff;margin-top:2px">${esc(inv.issuerName)}</div>
      </td>
      <td style="vertical-align:middle;text-align:right">
        <a href="mailto:${esc(st.company_email)}" style="display:block;font-size:11px;color:rgba(255,255,255,.55)">${esc(st.company_email)}</a>
        <a href="https://wa.me/${esc(st.whatsapp)}" style="display:block;font-size:11px;color:rgba(255,255,255,.55);margin-top:2px">wa.me/${esc(st.whatsapp)}</a>
        <a href="https://instagram.com/${esc(st.instagram)}" style="display:block;font-size:11px;color:rgba(255,255,255,.55);margin-top:2px">@${esc(st.instagram)}</a>
      </td>
    </tr></table>
  </td></tr>

</table>
</td></tr></table>
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
  const { openTrips, glampings, privateDestinations, siteSettings, updateInquiry } = useData();

  // Glamping price recalc helpers
  const gData = inq.kind === 'glamping' ? glampings.find(x => x.id === inq.data?.glampLoc) : null;
  const tentTierForCalc = gData
    ? (inq.data?.tentType ? gData.priceTiers?.find(t => t.id === inq.data.tentType) || gData.priceTiers?.[0] : gData.priceTiers?.[0])
    : null;
  const nightsForCalc = Number(inq.data?.nights || 1);

  const [inv, setInv] = useState(() => {
    const saved = inq.data?._invoice;
    if (saved) return saved;
    return {
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
    };
  });

  const [sending, setSending]         = useState(false);
  const [sent, setSent]               = useState(false);
  const [sendError, setSendError]     = useState('');
  const [savingInv, setSavingInv]     = useState(false);
  const [savedInv, setSavedInv]       = useState(false);
  const [glampCheckIn, setGlampCheckIn] = useState(inq.data?._invoice ? (inq.data._invoice._glampCheckIn || '') : (inq.data?.date || ''));

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

  const handleGlampCheckIn = (newDate) => {
    setGlampCheckIn(newDate);
    if (!tentTierForCalc) return;
    const peak = isPeakDay(newDate);
    const wkd = tentTierForCalc.priceWeekday ?? 0;
    const pk = tentTierForCalc.priceWeekend ?? 0;
    const newPricePerNight = newDate ? (peak ? pk : wkd) : wkd;
    const pax = Number(inq.data?.pax || 1);
    const singleTentMax = tentTierForCalc.maxCapacity ?? 6;
    const tentCount = pax > singleTentMax ? 2 : 1;
    const newTotal = newPricePerNight * tentCount * nightsForCalc;
    const rateLabel = newDate ? (peak ? 'Peak' : 'Weekday') : 'Weekday*';
    const tentDesc = tentTierForCalc.name ? ` · ${tentTierForCalc.name}` : '';
    const tentCountLabel = tentCount > 1 ? ` · ${tentCount} tenda` : '';
    setInv(p => ({
      ...p,
      items: p.items.map(item =>
        item.id === 'main'
          ? { ...item, unitPrice: newTotal, total: newTotal, desc: `${pax} orang${tentDesc}${tentCountLabel} · ${nightsForCalc} malam · ${rateLabel}` }
          : item
      ),
    }));
  };

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
      setSendError('VITE_EMAIL_WORKER_URL belum dikonfigurasi di .env.');
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

  const handleSaveInvoice = async () => {
    setSavingInv(true);
    await updateInquiry({
      ...inq,
      data: { ...inq.data, _invoice: { ...inv, subtotal, total, _glampCheckIn: glampCheckIn } },
    });
    setSavingInv(false);
    setSavedInv(true);
    setTimeout(() => setSavedInv(false), 2500);
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
            onClick={handleSaveInvoice}
            disabled={savingInv}
            style={{ ...S.btn, background: savedInv ? '#f0fdf4' : '#e0e7ff', color: savedInv ? '#16a34a' : '#3730a3', padding: '8px 16px', fontSize: 13 }}
          >
            {savingInv ? 'Menyimpan…' : savedInv ? '✓ Tersimpan' : '💾 Simpan Invoice'}
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
          {inq.kind === 'glamping' && (
            <AField
              label="Tanggal check-in (kalkulasi tarif)"
              hint={glampCheckIn
                ? (isPeakDay(glampCheckIn) ? '⭐ Peak — harga weekend/libur/H-1 diterapkan.' : '📆 Weekday — harga weekday diterapkan.')
                : 'Pilih tanggal untuk otomatis sesuaikan harga weekday / peak.'}
            >
              <AInput type="date" value={glampCheckIn} onChange={handleGlampCheckIn} />
            </AField>
          )}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
              <thead>
                <tr>
                  <th style={{ ...S.th, width: '28%' }}>Item</th>
                  <th style={{ ...S.th, width: '22%' }}>Deskripsi</th>
                  <th style={{ ...S.th, width: 65 }}>Qty</th>
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
                        style={{ ...S.input, fontSize: 13, textAlign: 'center', padding: '6px 2px' }}
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
