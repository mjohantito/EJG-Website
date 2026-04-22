import Brand from './Brand';
import Icon from './Icon';

export default function TopBar({ onHome, onMenu, backLabel, onBack }) {
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
          <div className="right">
            <button className="iconbtn pri" aria-label="Menu" onClick={onMenu}>
              <Icon name="menu" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
