import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Footer from '../components/Footer';

function formatRupiah(n) {
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1).replace('.0', '')} juta`;
  return `Rp ${(n / 1_000).toFixed(0)}rb`;
}

function Field({ label, hint, children }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
      {hint && <span className="hint">{hint}</span>}
    </div>
  );
}

function Stepper({ label, value, onChange, min = 1, max = 20 }) {
  return (
    <Field label={label}>
      <div className="stepper">
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}>−</button>
        <span className="v">{value}</span>
        <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}>+</button>
      </div>
    </Field>
  );
}

export default function EventInquiryScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { events, whatsapp } = useData();
  const ev = events.find(e => e.id === id) || events[0];

  const [form, setForm] = useState({
    name: '',
    wa: '',
    email: '',
    ticketId: ev.tickets[0].id,
    qty: 1,
    notes: '',
  });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const selectedTicket = ev.tickets.find(t => t.id === form.ticketId) || ev.tickets[0];
  const estimate = selectedTicket.price * form.qty;
  const canSubmit = form.name.trim().length > 1 && form.email.trim().length > 3 && form.wa.trim().length > 5;

  const handleSubmit = () => {
    const lines = [
      'Halo EH! JADI GA? 👋',
      '',
      `Saya mau beli tiket *${ev.name}*:`,
      '',
      `Nama: ${form.name}`,
      `WhatsApp: ${form.wa}`,
      `Email: ${form.email}`,
      `Tipe tiket: ${selectedTicket.label} — ${formatRupiah(selectedTicket.price)}/tiket`,
      `Jumlah: ${form.qty} tiket`,
      `Total estimasi: ${formatRupiah(estimate)}`,
      form.notes ? `Catatan: ${form.notes}` : '',
    ].filter(Boolean).join('\n');

    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(lines)}`, '_blank');
    navigate('/thanks', { state: { kind: 'event', eventId: ev.id, ...form } });
  };

  return (
    <>
      {/* Header */}
      <div className="page-header">
        <span className="eyebrow">Beli Tiket · {ev.name}</span>
        <h1 style={{ marginTop: 6 }}>
          Satu langkah lagi<span className="q-stamp">!</span>
        </h1>
        <p className="lead">Isi data di bawah. Tim kita konfirmasi via WA setelah pembayaran DP.</p>
      </div>

      {/* Event summary card */}
      <div style={{ margin: '0 20px 4px' }}>
        <div style={{
          background: 'var(--ejg-kertas-2)', border: '1px solid var(--border)',
          borderRadius: 16, padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div className={`ph-${ev.palette || 'ink'}`} style={{ width: 48, height: 48, borderRadius: 12, display: 'grid', placeItems: 'center', fontSize: 24, flexShrink: 0 }}>
            {ev.emoji}
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, color: 'var(--ejg-ink)' }}>{ev.name}</div>
            <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 2 }}>{ev.date} – {ev.dateEnd} {ev.year} · {ev.venue}</div>
          </div>
        </div>
      </div>

      <div className="form">
        {/* Personal info */}
        <Field label="Nama kamu">
          <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nama Kamu" />
        </Field>
        <Field label="No. WhatsApp" hint="Kita kirim konfirmasi tiket via WA.">
          <input value={form.wa} onChange={e => set('wa', e.target.value)} placeholder="+62 812…" inputMode="tel" />
        </Field>
        <Field label="Email" hint="Untuk invoice dan detail event.">
          <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="kamu@email.com" />
        </Field>

        {/* Ticket type */}
        <Field label="Tipe tiket">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 2 }}>
            {ev.tickets.map((ticket, i) => {
              const selected = form.ticketId === ticket.id;
              return (
                <label
                  key={ticket.id}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer',
                    padding: '14px 16px', borderRadius: 14,
                    background: selected ? 'var(--ejg-matahari)' : 'var(--ejg-kertas-2)',
                    border: `1.5px solid ${selected ? 'var(--ejg-ink)' : 'var(--border)'}`,
                    transition: 'all 160ms ease',
                  }}
                >
                  <input
                    type="radio"
                    name="ticketId"
                    value={ticket.id}
                    checked={selected}
                    onChange={() => set('ticketId', ticket.id)}
                    style={{ marginTop: 3, accentColor: 'var(--ejg-ink)', flexShrink: 0 }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, color: 'var(--ejg-ink)' }}>
                      {ticket.label}
                      {i === 0 && (
                        <span style={{ marginLeft: 8, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 9, background: 'var(--ejg-ink)', color: 'var(--ejg-matahari)', padding: '2px 7px', borderRadius: 999, letterSpacing: '0.06em', textTransform: 'uppercase', verticalAlign: 'middle' }}>
                          BEST VALUE
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--fg-2)', marginTop: 3, lineHeight: 1.4 }}>{ticket.desc}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, color: 'var(--ejg-ink)', marginTop: 6 }}>
                      {formatRupiah(ticket.price)} <span style={{ fontWeight: 400, fontSize: 11, color: 'var(--fg-3)' }}>/ tiket</span>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </Field>

        {/* Quantity */}
        <Stepper label="Jumlah tiket" value={form.qty} onChange={v => set('qty', v)} min={1} max={selectedTicket.slots} />

        {/* Estimate */}
        <div style={{
          background: 'var(--ejg-ink)', borderRadius: 14, padding: '14px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 10, color: 'rgba(243,213,67,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>
              Total tiket
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: '#F3D543', letterSpacing: '-0.02em' }}>
              {formatRupiah(estimate)}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
              {form.qty} tiket × {formatRupiah(selectedTicket.price)}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
              *DP 50% untuk konfirmasi seat
            </div>
          </div>
        </div>

        {/* Notes */}
        <Field label="Catatan (opsional)">
          <textarea
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
            placeholder="Ada request khusus? Dietary, kebutuhan aksesibilitas, atau info lain…"
          />
        </Field>

        <div style={{ background: 'var(--ejg-kertas-2)', border: '1px dashed var(--border-strong)', borderRadius: 14, padding: 14, fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.5 }}>
          <strong style={{ color: 'var(--ejg-ink)' }}>Alur pembelian:</strong> Kamu langsung chat ke WA kami → tim konfirmasi ketersediaan → kamu DP 50% → tiket confirmed.
        </div>

        <button
          type="button"
          className="btn btn-pri btn-block"
          disabled={!canSubmit}
          onClick={handleSubmit}
          style={{ opacity: canSubmit ? 1 : 0.45 }}
        >
          Kirim ke WhatsApp →
        </button>

        <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--fg-3)' }}>
          atau{' '}
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noreferrer"
            style={{ color: 'var(--ejg-ink)', fontFamily: 'var(--font-display)', fontWeight: 700, textDecoration: 'underline' }}
          >
            chat langsung di WA
          </a>
        </div>
      </div>

      <Footer onNav={(name) => navigate(`/${name === 'home' ? '' : name}`)} />
    </>
  );
}
