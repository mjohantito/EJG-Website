import { useParams, useNavigate } from 'react-router-dom';
import { GLAMPINGS } from '../data';
import Icon from '../components/Icon';

export default function GlampDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const g = GLAMPINGS.find(x => x.id === id) || GLAMPINGS[0];

  return (
    <>
      <div className={`detail-hero ph-${g.palette || 'forest'}`}>
        <button className="back-btn" onClick={() => navigate(-1)} aria-label="Kembali">
          <Icon name="arrowLeft" />
        </button>
        <button className="save-btn" aria-label="Simpan">
          <Icon name="heart" />
        </button>
        <span className="emoji" style={{ fontSize: 100 }}>{g.emoji}</span>
        <span className="stamp-pill">GLAMPING</span>
      </div>

      <div className="detail-sheet">
        <span className="region">{g.location}</span>
        <h1 style={{ marginTop: 8 }}>{g.name}</h1>

        <div className="meta-row">
          <span><Icon name="group" className="ic ic-sm" />{g.cap}</span>
          <span><Icon name="calendar" className="ic ic-sm" />{g.availability}</span>
          <span><Icon name="pin" className="ic ic-sm" />{g.location.split(',')[0]}</span>
        </div>

        <div className="section">
          <div className="tag-line">"{g.tagline}"</div>
        </div>

        <div className="section desc">
          <h4>Intinya apa sih?</h4>
          <p>{g.description}</p>
        </div>

        <div className="section">
          <h4>Fasilitas</h4>
          <ul className="bullets">
            {g.amenities.map(a => (
              <li key={a}>
                <span className="check"><Icon name="check" className="ic ic-sm" /></span>
                {a}
              </li>
            ))}
          </ul>
        </div>

        <div className="section">
          <h4>Cara booking</h4>
          <p>
            Tap "Tanya &amp; Booking" → isi form → kita konfirmasi ketersediaan.
            DP 50% untuk reservasi.
          </p>
        </div>
      </div>

      <div className="cta-bar">
        <div className="price">
          <span className="small">Mulai / {g.unit}</span>
          <span className="num">Rp {g.price}</span>
        </div>
        <button
          className="btn btn-pri"
          onClick={() => navigate('/inquiry', { state: { kind: 'glamping', glampId: g.id } })}
        >
          Tanya &amp; Booking
        </button>
      </div>
    </>
  );
}
