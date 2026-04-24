/**
 * EH! JADI GA? — Inquiry Handler
 *
 * HOW TO DEPLOY:
 * 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1pQJiRDZP0b5umPz4CFX5MxvQix1pe_Nsw4O9a_ZhTUw
 * 2. Click Extensions → Apps Script
 * 3. Paste this entire file (replacing any existing code)
 * 4. Click Deploy → New deployment
 *    - Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Click Deploy, copy the web app URL
 * 6. Paste that URL into your .env.local as:
 *    VITE_GOOGLE_SHEET_SCRIPT_URL=https://script.google.com/macros/s/YOUR_ID/exec
 * 7. Redeploy your site (Vercel / netlify) to pick up the new env var.
 *
 * The sheet will auto-create tabs per inquiry type (Open Trip, Private Trip, etc.)
 * and send a notification email to halo@ehjadiga.com on every submission.
 */

const NOTIFICATION_EMAIL = 'halo@ehjadiga.com';
const SHEET_ID = '1pQJiRDZP0b5umPz4CFX5MxvQix1pe_Nsw4O9a_ZhTUw';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    handleInquiry(data);
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handleInquiry(data) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const kind = data.kind || 'unknown';
  const tabName = {
    open:      'Open Trip',
    private:   'Private Trip',
    glamping:  'Glamping',
    event:     'Special Event',
    corporate: 'Corporate',
  }[kind] || 'Lainnya';

  // Get or create the sheet tab
  let sheet = ss.getSheetByName(tabName);
  if (!sheet) {
    sheet = ss.insertSheet(tabName);
    const headers = getHeaders(kind);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#252525').setFontColor('#F3D543');
    sheet.setFrozenRows(1);
  }

  // Build row
  const row = buildRow(kind, data);
  sheet.appendRow(row);
  sheet.autoResizeColumns(1, row.length);

  // Send email notification
  sendEmail(kind, data);
}

function getHeaders(kind) {
  const base = ['Timestamp', 'Nama', 'WhatsApp', 'Email'];
  const extra = {
    open:      ['Trip ID', 'Jumlah Orang', 'Add-on', 'Catatan'],
    private:   ['Destinasi', 'Durasi', 'Jumlah Orang', 'Meeting Point', 'Tanggal', 'Catatan'],
    glamping:  ['Lokasi', 'Jumlah Orang', 'Jumlah Malam', 'Check-in', 'Add-on', 'Catatan'],
    event:     ['Event', 'Tipe Tiket', 'Jumlah Tiket', 'Total Estimasi', 'Catatan'],
    corporate: ['Jabatan', 'Perusahaan', 'Alamat', 'Budget', 'Destinasi', 'Tujuan Trip', 'Tanggal', 'Peserta', 'Catatan'],
  };
  return [...base, ...(extra[kind] || ['Data'])];
}

function buildRow(kind, d) {
  const ts = d.timestamp || new Date().toISOString();
  const base = [ts, d.name || '', d.wa || '', d.email || ''];

  if (kind === 'open') {
    return [...base, d.tripId || '', d.pax || '', (d.addons || []).join(', '), d.notes || ''];
  }
  if (kind === 'private') {
    return [...base, d.privateDest || '', d.privateDuration || '', d.pax || '', d.meetingPoint || '', d.date || '', d.notes || ''];
  }
  if (kind === 'glamping') {
    return [...base, d.glampLoc || '', d.pax || '', d.nights || '', d.date || '', (d.addons || []).join(', '), d.notes || ''];
  }
  if (kind === 'event') {
    return [...base, d.eventName || d.eventId || '', d.ticketLabel || d.ticketId || '', d.qty || '', d.estimate || '', d.notes || ''];
  }
  if (kind === 'corporate') {
    return [...base, d.jobTitle || '', d.company || '', d.companyAddress || '', d.budget || '', d.tripDest || '', d.tripPurpose || '', d.date || '', d.pax || '', d.notes || ''];
  }
  return [...base, JSON.stringify(d)];
}

function sendEmail(kind, d) {
  const kindLabel = {
    open:      'Open Trip',
    private:   'Private Trip',
    glamping:  'Glamping',
    event:     'Special Event',
    corporate: 'Corporate',
  }[kind] || kind;

  const subject = `[EJG] Inquiry baru: ${kindLabel} — ${d.name || '(tanpa nama)'}`;

  const rows = Object.entries(d)
    .filter(([k]) => !['kind', 'timestamp'].includes(k))
    .map(([k, v]) => `<tr><td style="padding:6px 12px;font-weight:600;color:#555;white-space:nowrap">${k}</td><td style="padding:6px 12px;color:#111">${Array.isArray(v) ? v.join(', ') : v}</td></tr>`)
    .join('');

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#252525;padding:20px 24px;border-radius:12px 12px 0 0">
        <h2 style="color:#F3D543;margin:0;font-size:18px">EH! JADI GA? — Inquiry Baru</h2>
        <p style="color:rgba(255,255,255,0.6);margin:6px 0 0;font-size:13px">${kindLabel}</p>
      </div>
      <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
        ${rows}
      </table>
      <p style="font-size:11px;color:#9ca3af;margin-top:12px;text-align:center">
        Dikirim otomatis dari website EH! JADI GA? • ${new Date().toLocaleString('id-ID')}
      </p>
    </div>
  `;

  GmailApp.sendEmail(NOTIFICATION_EMAIL, subject, '', { htmlBody: html });
}
