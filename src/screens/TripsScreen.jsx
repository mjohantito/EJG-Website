import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext';
import OpenTripCard from '../components/OpenTripCard';
import Footer from '../components/Footer';

function PrivateDestCard({ dest, onClick }) {
  return (
    <div className="ot-card" onClick={onClick}>
      <div
        className={`ot-datestamp ph-${dest.palette || 'ink'}`}
        style={dest.cover ? { backgroundImage: `url(${dest.cover})`, backgroundSize: 'cover', backgroundPosition: 'center', fontSize: 38, letterSpacing: 0 } : { fontSize: 38, letterSpacing: 0 }}
      >
        {!dest.cover && dest.emoji}
      </div>
      <div className="ot-body">
        <span className="region">{dest.region}</span>
        <div className="title">{dest.name}</div>
        <div className="meta">{dest.sub}</div>
        <div className="foot">
          <span className="price">
            {dest.startingPrice === 'Sesuai itinerary'
              ? <em style={{ fontStyle: 'normal', fontSize: 13 }}>Custom quote</em>
              : <>mulai Rp {dest.startingPrice}<small> / orang</small></>
            }
          </span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: 'var(--ejg-ink)' }}>
            Lihat →
          </span>
        </div>
      </div>
    </div>
  );
}

export default function TripsScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { openTrips, privateDestinations } = useData();
  const [mode, setMode] = useState(location.state?.tab === 'private' ? 'private' : 'open');

  const grouped = {};
  openTrips.forEach(t => {
    const key = `${t.month} 2025`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(t);
  });

  return (
    <>
      <div className="page-header">
        <span className="eyebrow">Trips · EH! JADI GA?</span>
        <h1 style={{ marginTop: 6 }}>
          Mau <span className="italic" style={{ fontStyle: 'italic', fontWeight: 500 }}>lari</span> ke mana<span className="q-stamp">?</span>
        </h1>
        <p className="lead">Join open trip bareng atau rancang private trip kamu sendiri.</p>
      </div>

      <div className="segmented">
        <button className={mode === 'open' ? 'on' : ''} onClick={() => setMode('open')}>Open trip</button>
        <button className={mode === 'private' ? 'on' : ''} onClick={() => setMode('private')}>Private trip</button>
      </div>

      {mode === 'open' && (
        <>
          <div style={{ padding: '0 20px 6px', fontSize: 13, color: 'var(--fg-3)', lineHeight: 1.45 }}>
            {openTrips.length} keberangkatan terjadwal. Tap untuk detail & booking.
          </div>
          {Object.entries(grouped).map(([mo, trips]) => (
            <div key={mo}>
              <div className="month-sep">{mo}</div>
              <div className="opentrip-list">
                {trips.map(t => (
                  <OpenTripCard key={t.id} trip={t} onClick={() => navigate(`/trips/${t.id}`)} />
                ))}
              </div>
            </div>
          ))}
          <div className="teaser kertas" style={{ marginTop: 8 }}>
            <span className="ey">GA NEMU TANGGAL CLICK?</span>
            <h3>Bikin private trip aja.</h3>
            <p>Tentuin destinasi, tanggal, dan jumlah orang. Quote dikirim dalam 1x24 jam.</p>
            <button className="btn btn-pri" onClick={() => setMode('private')}>Coba private →</button>
          </div>
        </>
      )}

      {mode === 'private' && (
        <>
          <div style={{ padding: '0 20px 10px', fontSize: 13, color: 'var(--fg-3)', lineHeight: 1.45 }}>
            Pilih destinasi. Tanggal & jumlah orang diskusi bareng via form.
          </div>
          <div className="opentrip-list">
            {privateDestinations.map(d => (
              <PrivateDestCard key={d.id} dest={d} onClick={() => navigate(`/trips/private/${d.id}`)} />
            ))}
          </div>
        </>
      )}

      <Footer onNav={(name) => navigate(`/${name === 'home' ? '' : name}`)} />
    </>
  );
}
