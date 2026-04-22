import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UPCOMING_OPEN_TRIPS, PRIVATE_DESTINATIONS } from '../data';
import OpenTripCard from '../components/OpenTripCard';
import Footer from '../components/Footer';

function PrivateConfigurator() {
  const navigate = useNavigate();
  const [dest, setDest] = useState('pronojiwo');
  const [dateMode, setDateMode] = useState('weekend');
  const [pax, setPax] = useState(4);
  const [nights, setNights] = useState(2);

  return (
    <div style={{ padding: '8px 0 20px' }}>
      <div className="page-header" style={{ paddingTop: 4, paddingBottom: 10 }}>
        <span className="eyebrow">Private trip</span>
        <p className="lead" style={{ marginTop: 6 }}>
          Pilih konfigurasi dasar, kita lanjut via form detail.
        </p>
      </div>

      <div style={{ padding: '0 20px 10px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, color: 'var(--ejg-ink)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        1. Destinasi
      </div>
      <div className="dest-grid">
        {PRIVATE_DESTINATIONS.map(d => (
          <button
            key={d.id}
            className={`dest-opt${dest === d.id ? ' on' : ''}`}
            onClick={() => setDest(d.id)}
          >
            <span className="em">{d.emoji}</span>
            <span className="name">{d.name}</span>
            <span className="sub">{d.sub}</span>
          </button>
        ))}
      </div>

      <div style={{ padding: '16px 20px 10px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, color: 'var(--ejg-ink)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        2. Tanggal
      </div>
      <div className="radio-row" style={{ padding: '0 20px 10px' }}>
        <button className={`radio-card${dateMode === 'weekend' ? ' on' : ''}`} onClick={() => setDateMode('weekend')}>
          <span className="k">Weekend terdekat</span>
          <span className="v">Sabtu–Minggu</span>
        </button>
        <button className={`radio-card${dateMode === 'custom' ? ' on' : ''}`} onClick={() => setDateMode('custom')}>
          <span className="k">Tanggal custom</span>
          <span className="v">Isi di form</span>
        </button>
      </div>

      <div style={{ padding: '16px 20px 10px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, color: 'var(--ejg-ink)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        3. Grup & Durasi
      </div>
      <div style={{ padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div className="field">
          <label>Jumlah orang</label>
          <div className="stepper">
            <button onClick={() => setPax(Math.max(2, pax - 1))}>−</button>
            <span className="v">{pax}</span>
            <button onClick={() => setPax(Math.min(30, pax + 1))}>+</button>
          </div>
        </div>
        <div className="field">
          <label>Malam</label>
          <div className="stepper">
            <button onClick={() => setNights(Math.max(1, nights - 1))}>−</button>
            <span className="v">{nights}</span>
            <button onClick={() => setNights(Math.min(10, nights + 1))}>+</button>
          </div>
        </div>
      </div>

      <div style={{ padding: '18px 20px 0' }}>
        <button
          className="btn btn-pri btn-block"
          onClick={() => navigate('/inquiry', { state: { kind: 'private', dest, pax, nights } })}
        >
          Lanjut ke form inquiry →
        </button>
      </div>
    </div>
  );
}

export default function TripsScreen() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('open');

  const grouped = {};
  UPCOMING_OPEN_TRIPS.forEach(t => {
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
            {UPCOMING_OPEN_TRIPS.length} keberangkatan terjadwal. Tap untuk detail & booking.
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

      {mode === 'private' && <PrivateConfigurator />}

      <Footer onNav={(name) => navigate(`/${name === 'home' ? '' : name}`)} />
    </>
  );
}
