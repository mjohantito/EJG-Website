import { useNavigate } from 'react-router-dom';
import { UPCOMING_OPEN_TRIPS, GLAMPINGS } from '../data';
import OpenTripCard from '../components/OpenTripCard';
import GlampCard from '../components/GlampCard';
import Footer from '../components/Footer';
import Icon from '../components/Icon';

export default function HomeScreen() {
  const navigate = useNavigate();
  const highlightTrips = UPCOMING_OPEN_TRIPS.slice(0, 3);

  return (
    <>
      <div className="hero hero-stamp">
        <div className="tag-row">
          <span className="tag">Open trip</span>
          <span className="tag out">Private · Glamping · Corporate</span>
        </div>
        <h1>
          Eh<span className="q-stamp">?</span><br />
          <span className="italic">beneran </span>jadi ga<span className="q-stamp">?</span>
        </h1>
        <p className="lead">
          Trip & glamping untuk anak muda yang rencananya banyak, waktunya dikit.
          Kita urusin logistik, kamu fokus seru-seruan.
        </p>
        <div className="hero-cta">
          <button className="btn btn-pri" onClick={() => navigate('/trips')}>Liat trip →</button>
          <button className="btn btn-sec" onClick={() => navigate('/glamping')}>Glamping</button>
        </div>
      </div>

      <div className="quicklinks">
        <div className="ql" onClick={() => navigate('/trips')}>
          <Icon name="mountain" className="ic ic-lg" />
          <span className="label">Open trip</span>
          <span className="sub">Join sama orang seru-seruan, budget ramah.</span>
        </div>
        <div className="ql ink" onClick={() => navigate('/inquiry', { state: { kind: 'private' } })}>
          <Icon name="sparkle" className="ic ic-lg" />
          <span className="label">Private trip</span>
          <span className="sub">Rancang sendiri, grup sendiri.</span>
        </div>
        <div className="ql sun" onClick={() => navigate('/glamping')}>
          <Icon name="tent" className="ic ic-lg" />
          <span className="label">Glamping</span>
          <span className="sub">Tent beneran, tetep wangi.</span>
        </div>
        <div className="ql" onClick={() => navigate('/inquiry', { state: { kind: 'corporate' } })}>
          <Icon name="group" className="ic ic-lg" />
          <span className="label">Corporate</span>
          <span className="sub">Outing kantor, gathering, offsite.</span>
        </div>
      </div>

      <div className="sh">
        <div>
          <h2>Open trip yang<br />lagi buka<span className="q-stamp">?</span></h2>
          <div className="sh-sub">3 dari 5 keberangkatan bulan ini.</div>
        </div>
        <button className="more" onClick={() => navigate('/trips')}>Semua →</button>
      </div>

      <div className="opentrip-list">
        {highlightTrips.map(t => (
          <OpenTripCard key={t.id} trip={t} onClick={() => navigate(`/trips/${t.id}`)} />
        ))}
      </div>

      <div className="teaser">
        <span className="ey">PRIVATE TRIP</span>
        <h3>Grup kamu aja. Tanggal kamu sendiri.</h3>
        <p>Pilih destinasi, kasih tau jumlah orang dan range tanggal — kita rancang + quote dalam 1x24 jam.</p>
        <button className="btn btn-pri" onClick={() => navigate('/inquiry', { state: { kind: 'private' } })}>
          Mulai inquiry →
        </button>
        <span className="deco">🗺️</span>
      </div>

      <div className="sh">
        <div>
          <h2>Glamping<br /><span className="italic" style={{ fontStyle: 'italic', fontWeight: 500 }}>pilihan</span></h2>
          <div className="sh-sub">3 lokasi di Jawa Timur.</div>
        </div>
        <button className="more" onClick={() => navigate('/glamping')}>Semua →</button>
      </div>
      <div className="glamp-list">
        {GLAMPINGS.slice(0, 2).map(g => (
          <GlampCard key={g.id} g={g} onClick={() => navigate(`/glamping/${g.id}`)} />
        ))}
      </div>

      <div className="teaser kertas" style={{ marginTop: 18 }}>
        <span className="ey">CORPORATE</span>
        <h3>Outing kantor? Kita bantu dari A sampai Z.</h3>
        <p>Team offsite, gathering, retreat — logistik kita urus, kamu fokus ke momen.</p>
        <button className="btn btn-pri" onClick={() => navigate('/inquiry', { state: { kind: 'corporate' } })}>
          Ajukan RFP →
        </button>
        <span className="deco">👥</span>
      </div>

      <Footer onNav={(name) => navigate(`/${name === 'home' ? '' : name}`)} />
    </>
  );
}
