import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Icon from '../components/Icon';
import Footer from '../components/Footer';

function fmt(n) {
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1).replace('.0', '')} juta`;
  return `Rp ${(n / 1_000).toFixed(0)}rb`;
}

export default function TripDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { openTrips, openTripAddons } = useData();
  const trip = openTrips.find(t => t.id === id) || openTrips[0];
  const low = trip.slots <= 3;
  const pct = Math.round(((trip.totalSlots - trip.slots) / trip.totalSlots) * 100);

  return (
    <>
      {/* Hero */}
      <div className={`detail-hero ph-${trip.palette || 'ink'}`} style={trip.cover ? { backgroundImage: `url(${trip.cover})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
        {!trip.cover && <span className="emoji" style={{ fontSize: 100 }}>{trip.emoji}</span>}
        <span className="stamp-pill">OPEN TRIP · {trip.month} {trip.day}</span>
      </div>

      {/* Header */}
      <div className="page-header" style={{ paddingBottom: 0 }}>
        <span className="eyebrow">{trip.region}</span>
        <h1 style={{ marginTop: 4 }}>{trip.dest}</h1>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: 13, color: 'var(--fg-3)', marginTop: 10 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Icon name="calendar" className="ic ic-sm" />{trip.start} – {trip.end}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Icon name="clock" className="ic ic-sm" />{trip.duration}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Icon name="group" className="ic ic-sm" />Max {trip.totalSlots} orang
          </span>
        </div>
      </div>

      {/* Slots bar */}
      <div style={{ padding: '12px 20px 0' }}>
        <div className="slots">
          <div className={`bar${low ? ' low' : ''}`}>
            <span style={{ width: `${Math.max(10, pct)}%` }} />
          </div>
          <span className={`txt${low ? ' low' : ''}`}>
            {trip.slots} dari {trip.totalSlots} slot tersisa
          </span>
        </div>
      </div>

      {/* Description */}
      {trip.description && (
        <div style={{ padding: '20px 20px 0' }}>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.65 }}>{trip.description}</p>
        </div>
      )}

      {/* Gallery */}
      {trip.gallery && (
        <div style={{ padding: '20px 20px 0' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13, color: 'var(--ejg-ink)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
            Galeri
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {trip.gallery.map((url, i) => (
              <div key={i} className={`ph-${trip.palette || 'ink'}`} style={{ borderRadius: 14, aspectRatio: '4/3', position: 'relative', overflow: 'hidden' }}>
                {url?.startsWith('http') && <img src={url} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Highlights */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13,
          color: 'var(--ejg-ink)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12,
        }}>
          Yang bakal kita lakuin
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {trip.highlights.map((h, i) => (
            <div key={h} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13,
          color: 'var(--ejg-ink)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12,
        }}>
          Udah termasuk
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {trip.includes.map(item => (
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

      {/* Not included */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13,
          color: 'var(--ejg-ink)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8,
        }}>
          Belum termasuk
        </div>
        <p style={{ fontSize: 14, color: 'var(--fg-3)', lineHeight: 1.55 }}>
          Tiket pesawat ke kota start, pengeluaran pribadi, tip guide (optional).
        </p>
      </div>

      {/* Add-ons */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13, color: 'var(--ejg-ink)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
          Add-on tersedia
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {openTripAddons.map(addon => (
            <div key={addon.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--ejg-kertas-2)', borderRadius: 12, border: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: 'var(--ejg-ink)' }}>{addon.label}</div>
                <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 2 }}>{addon.desc}</div>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13, color: 'var(--ejg-ink)', flexShrink: 0, marginLeft: 12 }}>+{fmt(addon.price)}</div>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 8, fontSize: 12, color: 'var(--fg-3)' }}>Pilih add-on saat isi form booking.</p>
      </div>

      {/* Booking info */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13,
          color: 'var(--ejg-ink)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8,
        }}>
          Cara booking
        </div>
        <p style={{ fontSize: 14, color: 'var(--fg-3)', lineHeight: 1.55 }}>
          Tap tombol di bawah → isi form → tim kita konfirmasi via WA dalam 1×24 jam.
          DP 30% untuk hold slot, pelunasan H-7.
        </p>
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
              Rp {trip.price}
              <span style={{ fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: 11, color: 'rgba(243,213,67,0.6)', marginLeft: 4 }}>/orang</span>
            </div>
            {low && (
              <div style={{ fontSize: 10, color: '#ff7b63', fontFamily: 'var(--font-display)', fontWeight: 700, marginTop: 2 }}>
                ⚠ Hampir penuh
              </div>
            )}
          </div>
          <button
            className="btn btn-pri"
            style={{ background: 'var(--ejg-matahari)', color: 'var(--ejg-ink)', flexShrink: 0 }}
            onClick={() => navigate('/inquiry', { state: { kind: 'open', tripId: trip.id } })}
          >
            Booking →
          </button>
        </div>
      </div>

      {/* T&C note */}
      <div style={{ padding: '14px 20px 0' }}>
        <p style={{ fontSize: 12, color: 'var(--fg-3)', lineHeight: 1.6 }}>
          Dengan booking, kamu menyetujui{' '}
          <a href="/terms" style={{ color: 'var(--ejg-ink)', fontFamily: 'var(--font-display)', fontWeight: 700, textDecoration: 'underline' }}>
            Syarat & Ketentuan
          </a>{' '}yang berlaku.
        </p>
      </div>

      <Footer onNav={(name) => navigate(`/${name === 'home' ? '' : name}`)} />
    </>
  );
}
