import { useNavigate } from 'react-router-dom';
import { GLAMPINGS } from '../data';
import GlampCard from '../components/GlampCard';
import Footer from '../components/Footer';

export default function GlampingScreen() {
  const navigate = useNavigate();

  return (
    <>
      <div className="page-header">
        <span className="eyebrow">Glamping · EH! JADI GA?</span>
        <h1 style={{ marginTop: 6 }}>
          Kemah<span className="q-stamp">?</span><br />
          Tetep <span className="italic" style={{ fontStyle: 'italic', fontWeight: 500 }}>wangi</span>.
        </h1>
        <p className="lead">3 lokasi di Jawa Timur. Bisa di-add ke private trip kamu juga.</p>
      </div>

      <div className="glamp-list">
        {GLAMPINGS.map(g => (
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
