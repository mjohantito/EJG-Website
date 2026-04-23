import { useParams, useNavigate } from 'react-router-dom';
import { GLAMPINGS } from '../data';
import Icon from '../components/Icon';
import Footer from '../components/Footer';

export default function GlampDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const g = GLAMPINGS.find(x => x.id === id) || GLAMPINGS[0];

  return (
    <>
      {/* Hero */}
      <div className={`detail-hero ph-${g.palette || 'forest'}`}>
        <span className="emoji" style={{ fontSize: 100 }}>{g.emoji}</span>
        <span className="stamp-pill">GLAMPING</span>
      </div>

      {/* Header */}
      <div className="page-header" style={{ paddingBottom: 0 }}>
        <span className="eyebrow">{g.location}</span>
        <h1 style={{ marginTop: 4 }}>{g.name}</h1>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: 13, color: 'var(--fg-3)', marginTop: 10 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Icon name="group" className="ic ic-sm" />{g.cap}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Icon name="calendar" className="ic ic-sm" />{g.availability}
          </span>
        </div>
      </div>

      {/* Tagline */}
      <div style={{ padding: '16px 20px 0' }}>
        <p style={{ fontSize: 16, fontStyle: 'italic', color: 'var(--ejg-ink)', lineHeight: 1.5, fontFamily: 'var(--font-display)', fontWeight: 600 }}>
          "{g.tagline}"
        </p>
      </div>

      {/* Description */}
      <div style={{ padding: '16px 20px 0' }}>
        <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.65 }}>{g.description}</p>
      </div>

      {/* Amenities */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13,
          color: 'var(--ejg-ink)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12,
        }}>
          Fasilitas
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {g.amenities.map((a, i) => (
            <div key={a} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                width: 28, height: 28, borderRadius: 8,
                background: 'var(--ejg-matahari)', color: 'var(--ejg-ink)',
                display: 'grid', placeItems: 'center',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 12, flexShrink: 0,
              }}>{i + 1}</span>
              <span style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.4 }}>{a}</span>
            </div>
          ))}
        </div>
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
          Tap tombol di bawah → isi form → kita konfirmasi ketersediaan. DP 50% untuk reservasi.
        </p>
      </div>

      {/* Info note */}
      <div style={{ margin: '16px 20px 0', background: 'var(--ejg-kertas-2)', border: '1px dashed var(--border-strong)', borderRadius: 14, padding: 14, fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.5 }}>
        Tersedia add-on: BBQ set, sarapan ekstra, atau paket honeymoon. Cerita aja via WA.
      </div>

      {/* CTA */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{
          background: 'var(--ejg-ink)', borderRadius: 20, padding: '18px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 10, color: 'rgba(243,213,67,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>
              Mulai / {g.unit}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: '#F3D543', letterSpacing: '-0.02em' }}>
              Rp {g.price}
            </div>
          </div>
          <button
            className="btn btn-pri"
            style={{ background: 'var(--ejg-matahari)', color: 'var(--ejg-ink)', flexShrink: 0 }}
            onClick={() => navigate('/inquiry', { state: { kind: 'glamping', glampId: g.id } })}
          >
            Booking →
          </button>
        </div>
      </div>

      <Footer onNav={(name) => navigate(`/${name === 'home' ? '' : name}`)} />
    </>
  );
}
