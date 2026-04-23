import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PRIVATE_DESTINATIONS } from '../data';
import Footer from '../components/Footer';

export default function PrivateTripDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dest = PRIVATE_DESTINATIONS.find(d => d.id === id);

  const [selectedDuration, setSelectedDuration] = useState(
    dest ? dest.durations[0] : null
  );

  if (!dest) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--fg-3)' }}>
        Destinasi tidak ditemukan.
      </div>
    );
  }

  const handleInquiry = () => {
    navigate('/inquiry', { state: { kind: 'private', dest: dest.id, duration: selectedDuration } });
  };

  return (
    <>
      {/* Hero */}
      <div className={`detail-hero ph-${dest.palette || 'ink'}`}>
        <span className="emoji">{dest.emoji}</span>
        {dest.startingPrice !== 'Sesuai itinerary' && (
          <div className="stamp-pill">mulai Rp {dest.startingPrice} / orang</div>
        )}
        {dest.startingPrice === 'Sesuai itinerary' && (
          <div className="stamp-pill">Custom quote</div>
        )}
      </div>

      {/* Header */}
      <div className="page-header" style={{ paddingBottom: 0 }}>
        <span className="eyebrow">{dest.region}</span>
        <h1 style={{ marginTop: 4 }}>{dest.name}</h1>
        <p className="lead" style={{ marginTop: 8 }}>{dest.description}</p>
      </div>

      {/* Highlights */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13,
          color: 'var(--ejg-ink)', textTransform: 'uppercase', letterSpacing: '0.1em',
          marginBottom: 12,
        }}>
          Highlights
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {dest.highlights.map((h, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                width: 28, height: 28, borderRadius: 8,
                background: 'var(--ejg-matahari)', color: 'var(--ejg-ink)',
                display: 'grid', placeItems: 'center',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 12,
                flexShrink: 0,
              }}>
                {i + 1}
              </span>
              <span style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.4 }}>{h}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Duration selector */}
      <div style={{ padding: '24px 20px 0' }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13,
          color: 'var(--ejg-ink)', textTransform: 'uppercase', letterSpacing: '0.1em',
          marginBottom: 12,
        }}>
          Durasi trip
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {dest.durations.map(dur => (
            <button
              key={dur}
              type="button"
              onClick={() => setSelectedDuration(dur)}
              style={{
                padding: '10px 20px',
                borderRadius: 999,
                border: selectedDuration === dur
                  ? '2px solid var(--ejg-ink)'
                  : '1.5px solid var(--border)',
                background: selectedDuration === dur ? 'var(--ejg-matahari)' : '#fff',
                color: 'var(--ejg-ink)',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 14,
                cursor: 'pointer',
                transition: 'all 160ms ease',
              }}
            >
              {dur}
            </button>
          ))}
        </div>
        <p style={{ marginTop: 10, fontSize: 12, color: 'var(--fg-3)', lineHeight: 1.5 }}>
          Tanggal & jumlah peserta bisa diisi di form inquiry setelah ini.
        </p>
      </div>

      {/* Info note */}
      <div style={{ margin: '20px 20px 0', background: 'var(--ejg-kertas-2)', border: '1px dashed var(--border-strong)', borderRadius: 14, padding: 14, fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.5 }}>
        <strong style={{ color: 'var(--ejg-ink)' }}>Cara kerja:</strong> Kita kirim quote detail setelah diskusi singkat via WA. Gak ada commitment dulu — ngobrol santai aja.
      </div>

      {/* CTA */}
      <div style={{ padding: '20px 20px 0' }}>
        <button
          type="button"
          className="btn btn-pri btn-block"
          onClick={handleInquiry}
        >
          Mulai inquiry →
        </button>
      </div>

      <Footer onNav={(name) => navigate(`/${name === 'home' ? '' : name}`)} />
    </>
  );
}
