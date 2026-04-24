import { useParams, useNavigate } from 'react-router-dom';
import { SPECIAL_EVENTS } from '../data';
import Icon from '../components/Icon';
import Footer from '../components/Footer';

function fmt(n) {
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1).replace('.0', '')} juta`;
  return `Rp ${(n / 1_000).toFixed(0)}rb`;
}

export default function EventDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const ev = SPECIAL_EVENTS.find(e => e.id === id) || SPECIAL_EVENTS[0];

  const lowestPrice = Math.min(...ev.tickets.map(t => t.price));

  return (
    <>
      {/* Hero */}
      <div className={`detail-hero ph-${ev.palette || 'ink'}`}>
        <span className="emoji" style={{ fontSize: 100 }}>{ev.emoji}</span>
        <span className="stamp-pill">SPECIAL EVENT · {ev.date} {ev.year}</span>
      </div>

      {/* Header */}
      <div className="page-header" style={{ paddingBottom: 0 }}>
        <span className="eyebrow">{ev.venue}</span>
        <h1 style={{ marginTop: 4 }}>{ev.name}</h1>
        <p style={{ marginTop: 6, fontSize: 15, color: 'var(--fg-2)', fontStyle: 'italic', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
          {ev.subtitle}
        </p>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: 13, color: 'var(--fg-3)', marginTop: 12 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Icon name="calendar" className="ic ic-sm" />{ev.date} – {ev.dateEnd} {ev.year}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Icon name="mountain" className="ic ic-sm" />{ev.venue}
          </span>
        </div>
        {ev.tag && (
          <div style={{ marginTop: 12 }}>
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 10,
              background: 'var(--ejg-matahari)', color: 'var(--ejg-ink)',
              padding: '4px 12px', borderRadius: 999, letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>{ev.tag}</span>
          </div>
        )}
      </div>

      {/* Description */}
      <div style={{ padding: '20px 20px 0' }}>
        <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.65 }}>{ev.description}</p>
      </div>

      {/* Highlights */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13, color: 'var(--ejg-ink)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
          Yang bakal terjadi
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {ev.highlights.map((h, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                width: 28, height: 28, borderRadius: 8,
                background: 'var(--ejg-matahari)', color: 'var(--ejg-ink)',
                display: 'grid', placeItems: 'center',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 12, flexShrink: 0,
              }}>{i + 1}</span>
              <span style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.4 }}>{h}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Includes */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13, color: 'var(--ejg-ink)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
          Udah termasuk
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {ev.includes.map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                width: 20, height: 20, borderRadius: '50%',
                background: '#3E7A35', color: '#fff',
                display: 'grid', placeItems: 'center', flexShrink: 0,
              }}>
                <Icon name="check" className="ic ic-sm" style={{ width: 12, height: 12 }} />
              </span>
              <span style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.4 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tickets */}
      <div style={{ padding: '24px 20px 0' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13, color: 'var(--ejg-ink)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
          Pilihan tiket
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ev.tickets.map((ticket, i) => (
            <div key={ticket.id} style={{
              background: i === 0 ? 'var(--ejg-matahari)' : 'var(--ejg-kertas-2)',
              border: `1.5px solid ${i === 0 ? 'var(--ejg-matahari)' : 'var(--border)'}`,
              borderRadius: 16, padding: '16px 18px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, color: 'var(--ejg-ink)' }}>
                    {ticket.label}
                    {i === 0 && (
                      <span style={{ marginLeft: 8, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 9, background: 'var(--ejg-ink)', color: 'var(--ejg-matahari)', padding: '2px 7px', borderRadius: 999, letterSpacing: '0.06em', textTransform: 'uppercase', verticalAlign: 'middle' }}>
                        BEST VALUE
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--fg-2)', marginTop: 4, lineHeight: 1.4 }}>{ticket.desc}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--ejg-ink)', letterSpacing: '-0.02em' }}>
                    {fmt(ticket.price)}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>{ticket.slots} slot</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info note */}
      <div style={{ margin: '20px 20px 0', background: 'var(--ejg-kertas-2)', border: '1px dashed var(--border-strong)', borderRadius: 14, padding: 14, fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.5 }}>
        <strong style={{ color: 'var(--ejg-ink)' }}>Cara beli tiket:</strong> Tap tombol di bawah → pilih tipe tiket → isi data → tim kita konfirmasi via WA. DP 50% untuk reservasi seat.
      </div>

      {/* CTA */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{
          background: 'var(--ejg-ink)', borderRadius: 20, padding: '18px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 10, color: 'rgba(243,213,67,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>
              Mulai dari
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: '#F3D543', letterSpacing: '-0.02em' }}>
              {fmt(lowestPrice)}
              <span style={{ fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: 11, color: 'rgba(243,213,67,0.6)', marginLeft: 4 }}>/tiket</span>
            </div>
          </div>
          <button
            className="btn btn-pri"
            style={{ background: 'var(--ejg-matahari)', color: 'var(--ejg-ink)', flexShrink: 0 }}
            onClick={() => navigate(`/events/${ev.id}/inquiry`)}
          >
            Beli tiket →
          </button>
        </div>
      </div>

      <Footer onNav={(name) => navigate(`/${name === 'home' ? '' : name}`)} />
    </>
  );
}
