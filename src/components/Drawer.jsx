import { WHATSAPP } from '../data';
import Icon from './Icon';

const NAV_ITEMS = [
  { id: 'home',     label: 'Beranda' },
  { id: 'trips',    label: 'Trips' },
  { id: 'glamping', label: 'Glamping' },
  { id: 'inquiry',  label: 'Inquiry' },
  { id: 'about',    label: 'Tentang kami' },
];

export default function Drawer({ open, onClose, onNav, active }) {
  if (!open) return null;

  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div className="drawer">
        <div className="top">
          <div className="brand">
            <img src="/ejg-mark-primary.svg" alt="" />
            <span>EH! JADI GA?</span>
          </div>
          <button className="iconbtn" onClick={onClose} aria-label="Tutup menu">
            <Icon name="close" />
          </button>
        </div>
        <nav className="nav">
          {NAV_ITEMS.map(item => (
            <a
              key={item.id}
              className={active === item.id ? 'on' : ''}
              onClick={() => { onNav(item.id); onClose(); }}
            >
              {item.label}
              <Icon name="arrowRight" className="ic ic-sm" />
            </a>
          ))}
        </nav>
        <a
          className="wa-btn"
          href={`https://wa.me/${WHATSAPP}`}
          target="_blank"
          rel="noreferrer"
        >
          <Icon name="wa" /> Chat di WhatsApp
        </a>
        <div className="foot">Jam operasional · Senin–Jumat · 09.00–18.00 WIB</div>
      </div>
    </>
  );
}
