import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Icon from '../components/Icon';

export default function AboutScreen() {
  const navigate = useNavigate();

  return (
    <>
      <div className="about-hero">
        <span className="ey">Tentang kami</span>
        <h1>
          Rencana <span className="italic" style={{ fontStyle: 'italic', fontWeight: 500 }}>banyak</span>,<br />
          eksekusi <span className="q-stamp">?</span>
        </h1>
      </div>

      <div className="about-body">
        <p>
          EH! JADI GA? lahir dari frustasi generasi muda yang punya rencana tapi
          tidak tahu harus mulai dari mana.
        </p>
        <div className="pull">
          Perjalanan yang baik bukan soal <span className="hl">mewah</span> — tapi soal
          siapa yang kamu ajak dan momen apa yang kamu ciptakan bareng.
        </div>
        <p>
          Didirikan oleh anak muda yang percaya bahwa trip terbaik terjadi ketika logistik
          udah ga bikin pusing. Jadi kita urusin sisanya — kamu fokus sama temen, sama view,
          sama momen.
        </p>
        <p>
          Fresh perspective. Energi yang tidak pernah kehabisan. Tahu apa yang benar-benar
          bikin berkesan.
        </p>
      </div>

      <div className="stat-row">
        <div className="stat">
          <div className="n">120+</div>
          <div className="l">Trip terselenggara</div>
        </div>
        <div className="stat">
          <div className="n">4.9</div>
          <div className="l">Rating rata-rata</div>
        </div>
        <div className="stat">
          <div className="n">1x24h</div>
          <div className="l">Respons inquiry</div>
        </div>
      </div>

      <div style={{ padding: '4px 20px 8px', fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>
        Yang kita pegang
      </div>
      <div className="value-card">
        <div className="k">Fresh perspective</div>
        <div className="v">Kita anak muda — kita ngerti pengennya lu jalan yang kaya gimana.</div>
      </div>
      <div className="value-card">
        <div className="k">Energi yang ga habis</div>
        <div className="v">Dari planning sampai check-out, kita jaga vibes biar seru terus.</div>
      </div>
      <div className="value-card">
        <div className="k">Tau apa yang berkesan</div>
        <div className="v">Bukan cuma tiket dan hotel — kita kurasi momen yang bikin trip jadi cerita.</div>
      </div>

      <div className="teaser" style={{ marginTop: 18 }}>
        <span className="ey">GA CUMA BACA DONG</span>
        <h3>Yuk jalan bareng.</h3>
        <p>Pilih open trip terdekat, atau rancang private trip kamu sendiri.</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn btn-pri" onClick={() => navigate('/trips')}>Liat trip</button>
          <button
            className="btn"
            style={{ background: 'transparent', color: '#F3D543', border: '1.5px solid #F3D543' }}
            onClick={() => navigate('/inquiry')}
          >
            Inquiry
          </button>
        </div>
        <span className="deco">✌️</span>
      </div>

      <Footer onNav={(name) => navigate(`/${name === 'home' ? '' : name}`)} />
    </>
  );
}
