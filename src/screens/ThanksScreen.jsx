import { useNavigate } from 'react-router-dom';
import { WHATSAPP } from '../data';
import Footer from '../components/Footer';
import Icon from '../components/Icon';

export default function ThanksScreen() {
  const navigate = useNavigate();

  return (
    <>
      <div className="about-hero" style={{ paddingTop: 40 }}>
        <span className="ey">Inquiry terkirim</span>
        <h1>Sip, udah masuk<span className="q-stamp">!</span></h1>
      </div>
      <div className="about-body">
        <p>
          Tim kita bakal WA kamu dalam <strong style={{ color: 'var(--ejg-ink)' }}>1x24 jam</strong> buat
          konfirmasi detail. Kalau udah lewat dari itu, chat aja lagi ke WA bawah ya.
        </p>
        <div className="pull">
          Makasih udah percaya sama <span className="hl">EH! JADI GA?</span> — see you on the road.
        </div>
      </div>
      <div style={{ padding: '10px 20px 30px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button className="btn btn-pri btn-block" onClick={() => navigate('/')}>
          Balik ke beranda
        </button>
        <a
          className="btn btn-wa btn-block"
          href={`https://wa.me/${WHATSAPP}`}
          target="_blank"
          rel="noreferrer"
        >
          <Icon name="wa" /> Chat langsung di WA
        </a>
      </div>
      <Footer onNav={(name) => navigate(`/${name === 'home' ? '' : name}`)} />
    </>
  );
}
