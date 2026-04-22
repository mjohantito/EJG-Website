import { useParams, useNavigate } from 'react-router-dom';
import { UPCOMING_OPEN_TRIPS } from '../data';
import Icon from '../components/Icon';

export default function TripDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const trip = UPCOMING_OPEN_TRIPS.find(t => t.id === id) || UPCOMING_OPEN_TRIPS[0];
  const low = trip.slots <= 3;

  return (
    <>
      <div className={`detail-hero ph-${trip.palette || 'ink'}`}>
        <button className="back-btn" onClick={() => navigate(-1)} aria-label="Kembali">
          <Icon name="arrowLeft" />
        </button>
        <button className="save-btn" aria-label="Simpan">
          <Icon name="heart" />
        </button>
        <span className="emoji" style={{ fontSize: 100 }}>{trip.emoji}</span>
        <span className="stamp-pill">OPEN TRIP · {trip.month} {trip.day}</span>
      </div>

      <div className="detail-sheet">
        <span className="region">{trip.region}</span>
        <h1 style={{ marginTop: 8 }}>{trip.dest}</h1>

        <div className="meta-row">
          <span><Icon name="calendar" className="ic ic-sm" />{trip.start} – {trip.end}</span>
          <span><Icon name="clock" className="ic ic-sm" />{trip.duration}</span>
          <span><Icon name="group" className="ic ic-sm" />Max {trip.totalSlots}</span>
        </div>

        <div style={{ padding: '4px 0 10px' }}>
          <div className="slots">
            <div className={`bar${low ? ' low' : ''}`}>
              <span style={{ width: `${Math.max(10, ((trip.totalSlots - trip.slots) / trip.totalSlots) * 100)}%` }} />
            </div>
            <span className={`txt${low ? ' low' : ''}`}>
              {trip.slots} dari {trip.totalSlots} slot tersisa
            </span>
          </div>
        </div>

        <div className="section desc">
          <h4>Yang bakal kita lakuin</h4>
          <ul className="bullets">
            {trip.highlights.map(h => (
              <li key={h}>
                <span className="check"><Icon name="check" className="ic ic-sm" /></span>
                {h}
              </li>
            ))}
          </ul>
        </div>

        <div className="section">
          <h4>Udah termasuk</h4>
          <ul className="bullets">
            {trip.includes.map(item => (
              <li key={item}>
                <span className="check"><Icon name="check" className="ic ic-sm" /></span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="section">
          <h4>Belum termasuk</h4>
          <p>Tiket pesawat ke kota start, pengeluaran pribadi, tip guide (optional).</p>
        </div>

        <div className="section">
          <h4>Cara booking</h4>
          <p>
            Tap "Tanya &amp; Booking" → isi form → tim kita konfirmasi via WA dalam 1x24 jam.
            DP 30% untuk hold slot, pelunasan H-7.
          </p>
        </div>
      </div>

      <div className="cta-bar">
        <div className="price">
          <span className="small">Mulai {low && '· hampir penuh'}</span>
          <span className="num">Rp {trip.price}</span>
        </div>
        <button
          className="btn btn-pri"
          onClick={() => navigate('/inquiry', { state: { kind: 'open', tripId: trip.id } })}
        >
          Tanya &amp; Booking
        </button>
      </div>
    </>
  );
}
