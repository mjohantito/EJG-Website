import { WHATSAPP } from '../data';
import Icon from './Icon';

const NAV_ITEMS = [
  { id: 'home',      label: 'Beranda' },
  { id: 'trips',     label: 'Trips',       badge: 'Open & Private' },
  { id: 'glamping',  label: 'Glamping',    badge: '3 lokasi' },
  { id: 'corporate', label: 'Corporate' },
  { id: 'events',    label: 'Special Event', badge: 'NEW' },
  { id: 'inquiry',   label: 'Inquiry' },
  { id: 'about',     label: 'Tentang kami' },
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
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {item.label}
                {item.badge && (
                  <span style={{
                    fontSize: 10, fontFamily: 'var(--font-display)', fontWeight: 700,
                    background: 'var(--ejg-matahari)', color: 'var(--ejg-ink)',
                    padding: '2px 8px', borderRadius: 999, letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}>
                    {item.badge}
                  </span>
                )}
              </span>
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
