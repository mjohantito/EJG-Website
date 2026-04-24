import Brand from './Brand';
import Icon from './Icon';

const NAV_ITEMS = [
  { key: 'trips',     label: 'Open Trip' },
  { key: 'glamping',  label: 'Glamping' },
  { key: 'events',    label: 'Events' },
  { key: 'about',     label: 'About' },
  { key: 'corporate', label: 'Corporate' },
];

export default function TopBar({ onHome, onMenu, onNav, activeNav, backLabel, onBack }) {
  return (
    <div className="topbar">
      {backLabel != null ? (
        <>
          <button className="iconbtn" onClick={onBack} aria-label="Kembali">
            <Icon name="arrowLeft" />
          </button>
          <span className="back">{backLabel}</span>
          <div style={{ width: 38 }} />
        </>
      ) : (
        <>
          <Brand onClick={onHome} />
          <nav className="desktop-nav" aria-label="Navigasi utama">
            {NAV_ITEMS.map(item => (
              <button
                key={item.key}
                className={`desktop-nav-link${activeNav === item.key ? ' on' : ''}`}
                onClick={() => onNav?.(item.key)}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="right">
            <button className="iconbtn pri topbar-hamburger" aria-label="Menu" onClick={onMenu}>
              <Icon name="menu" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
