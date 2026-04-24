import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Footer from '../components/Footer';

function EventCard({ ev, onClick }) {
  return (
    <div className="ot-card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className={`ot-datestamp ph-${ev.palette || 'ink'}`} style={{ fontSize: 38, letterSpacing: 0 }}>
        {ev.emoji}
        {ev.tag && (
          <span style={{
            position: 'absolute', top: 10, right: 10,
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 9,
            background: 'var(--ejg-matahari)', color: 'var(--ejg-ink)',
            padding: '3px 8px', borderRadius: 999, letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>{ev.tag}</span>
        )}
      </div>
      <div className="ot-body">
        <span className="region">{ev.venue}</span>
        <div className="title">{ev.name}</div>
        <div className="meta">{ev.date} – {ev.dateEnd} · {ev.year}</div>
        <div className="foot">
          <span className="price">
            mulai Rp {(ev.tickets[0].price / 1_000_000).toFixed(1).replace('.0', '')}jt
            <small> / tiket</small>
          </span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: 'var(--ejg-ink)' }}>
            Detail →
          </span>
        </div>
      </div>
    </div>
  );
}

export default function EventsScreen() {
  const navigate = useNavigate();
  const { events } = useData();

  return (
    <>
      <div className="page-header">
        <span className="eyebrow">Special Event · EH! JADI GA?</span>
        <h1 style={{ marginTop: 6 }}>
          Event yang <span className="italic" style={{ fontStyle: 'italic', fontWeight: 500 }}>lebih</span> dari sekadar trip<span className="q-stamp">.</span>
        </h1>
        <p className="lead">Live music, midnight run, glamping party — momen yang susah diulang.</p>
      </div>

      <div style={{ padding: '0 20px 6px', fontSize: 13, color: 'var(--fg-3)', lineHeight: 1.45 }}>
        {events.length} event terjadwal. Tap untuk detail & beli tiket.
      </div>

      <div className="opentrip-list">
        {events.map(ev => (
          <EventCard key={ev.id} ev={ev} onClick={() => navigate(`/events/${ev.id}`)} />
        ))}
      </div>

      <div className="teaser kertas" style={{ marginTop: 8 }}>
        <span className="ey">PUNYA IDE EVENT?</span>
        <h3>Kita bisa bikin event custom buat grupmu.</h3>
        <p>Birthday trip, gathering komunitas, atau konser kecil di atas gunung — cerita dulu via WA.</p>
        <a
          className="btn btn-pri"
          href="https://wa.me/6285117322207"
          target="_blank"
          rel="noreferrer"
        >
          Ngobrol di WA →
        </a>
      </div>

      <Footer onNav={(name) => navigate(`/${name === 'home' ? '' : name}`)} />
    </>
  );
}
