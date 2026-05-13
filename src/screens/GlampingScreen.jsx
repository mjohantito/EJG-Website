import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import GlampCard from '../components/GlampCard';
import Footer from '../components/Footer';

export default function GlampingScreen() {
  const navigate = useNavigate();
  const { glampings } = useData();
  const [filter, setFilter] = useState('Semua');

  const cities = ['Semua', ...new Set(glampings.map(g => g.location.split(',')[0].trim()))];
  const filtered = filter === 'Semua'
    ? glampings
    : glampings.filter(g => g.location.split(',')[0].trim() === filter);

  return (
    <>
      <div className="page-header">
        <span className="eyebrow">Glamping · EH! JADI GA?</span>
        <h1 style={{ marginTop: 6 }}>
          Outdoor yang<br />
          beneran <span className="italic" style={{ fontStyle: 'italic', fontWeight: 500 }}>nyaman</span><span className="q-stamp">.</span>
        </h1>
        <p className="lead">{filtered.length} lokasi{filter !== 'Semua' ? ` di ${filter}` : ' di Jawa Timur'}. Bisa di-add ke private trip kamu juga.</p>
      </div>

      <div style={{ padding: '0 20px 16px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {cities.map(city => (
          <button
            key={city}
            onClick={() => setFilter(city)}
            style={{
              padding: '8px 16px', borderRadius: 999, cursor: 'pointer',
              border: filter === city ? '2px solid var(--ejg-ink)' : '1.5px solid var(--border)',
              background: filter === city ? 'var(--ejg-ink)' : 'transparent',
              color: filter === city ? 'var(--ejg-matahari)' : 'var(--fg-2)',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
              transition: 'all 140ms ease',
            }}
          >
            {city}
          </button>
        ))}
      </div>

      <div className="glamp-list">
        {filtered.map(g => (
          <GlampCard key={g.id} g={g} onClick={() => navigate(`/glamping/${g.id}`)} />
        ))}
      </div>

      <div className="teaser" style={{ marginTop: 18 }}>
        <span className="ey">COMBINE</span>
        <h3>Trip + glamping dalam satu paket.</h3>
        <p>
          Banyak yang pesan private trip ke Tumpak Sewu / Kelud sekalian
          nginep di Jurang Senggani.
        </p>
        <button
          className="btn btn-pri"
          onClick={() => navigate('/inquiry', { state: { kind: 'glamping' } })}
        >
          Bikin paket custom →
        </button>
        <span className="deco">🏕️</span>
      </div>

      <Footer onNav={(name) => navigate(`/${name === 'home' ? '' : name}`)} />
    </>
  );
}
