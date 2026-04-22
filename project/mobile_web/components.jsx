// EH! JADI GA? — mobile web components

const Icon = ({ name, className = "ic" }) => {
  const paths = {
    search:   <><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></>,
    menu:     <><path d="M4 6h16M4 12h16M4 18h10"/></>,
    close:    <><path d="M18 6 6 18M6 6l12 12"/></>,
    arrowLeft:<><path d="m14 18-6-6 6-6"/></>,
    arrowRight:<><path d="m10 6 6 6-6 6"/></>,
    calendar: <><path d="M8 2v4M16 2v4M3 9h18M5 5h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/></>,
    heart:    <><path d="M20.84 4.6a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.07a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></>,
    pin:      <><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 0 0-8 8c0 5 8 12 8 12s8-7 8-12a8 8 0 0 0-8-8z"/></>,
    clock:    <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    group:    <><circle cx="9" cy="7" r="4"/><circle cx="17" cy="10" r="3"/><path d="M2 22a7 7 0 0 1 14 0M14 22a5 5 0 0 1 9 0"/></>,
    check:    <><path d="m5 13 4 4L19 7"/></>,
    mountain: <><path d="m8 3 4 8 5-5 5 15H2z"/></>,
    tent:     <><path d="M12 3 4 21h16z"/><path d="M12 3v18"/><path d="m9 21 3-5 3 5"/></>,
    flame:    <><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></>,
    wa:       <><path d="M3 21l1.65-4.8A8 8 0 1 1 7.5 19.5L3 21z"/><path d="M8.5 11.5c.5 1.5 1.5 2.5 3 3 .5.17 1 0 1.3-.3l.7-.7c.3-.3.7-.3 1 0l1.2.8c.3.2.4.6.2 1-.6 1-2 1.5-3 1.3-3-.5-5.2-3-5.6-5.5-.1-1 .3-2 1.3-2.5.4-.2.8-.1 1 .2l.8 1.2c.2.3.2.7 0 1l-.7.7c-.3.3-.4.8-.3 1.3z"/></>,
    instagram:<><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></>,
    mail:     <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
    sparkle:  <><path d="M12 3v4M12 17v4M5 12H1M23 12h-4M6 6l3 3M15 15l3 3M6 18l3-3M15 9l3-3"/></>,
  };
  return <svg className={className} viewBox="0 0 24 24">{paths[name] || null}</svg>;
};

const Brand = ({ onClick }) => (
  <button className="brand" onClick={onClick}>
    <img src="../assets/ejg-mark-primary.svg" alt="" />
    <span className="name">EH! JADI GA<span className="q-stamp">?</span></span>
  </button>
);

const TopBar = ({ onHome, onMenu, backLabel, onBack }) => (
  <div className="topbar">
    {backLabel ? (
      <>
        <button className="iconbtn" onClick={onBack} aria-label="Kembali"><Icon name="arrowLeft" /></button>
        <span className="back">{backLabel}</span>
        <div style={{width:38}}/>
      </>
    ) : (
      <>
        <Brand onClick={onHome} />
        <div className="right">
          <button className="iconbtn pri" aria-label="Menu" onClick={onMenu}><Icon name="menu" /></button>
        </div>
      </>
    )}
  </div>
);

const Drawer = ({ open, onClose, onNav, active }) => {
  if (!open) return null;
  const items = [
    { id: "home", label: "Beranda" },
    { id: "trips", label: "Trips" },
    { id: "glamping", label: "Glamping" },
    { id: "inquiry", label: "Inquiry" },
    { id: "about", label: "Tentang kami" },
  ];
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div className="drawer">
        <div className="top">
          <div className="brand"><img src="../assets/ejg-mark-primary.svg" /> <span>EH! JADI GA?</span></div>
          <button className="iconbtn" onClick={onClose}><Icon name="close" /></button>
        </div>
        <nav className="nav">
          {items.map(i => (
            <a key={i.id} className={active === i.id ? "on" : ""} onClick={() => { onNav(i.id); onClose(); }}>
              {i.label}
              <Icon name="arrowRight" className="ic ic-sm" />
            </a>
          ))}
        </nav>
        <a className="wa-btn" href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer">
          <Icon name="wa" /> Chat di WhatsApp
        </a>
        <div className="foot">Jam operasional · Senin–Jumat · 09.00–18.00 WIB</div>
      </div>
    </>
  );
};

const OpenTripCard = ({ trip, onClick }) => {
  const low = trip.slots <= 3;
  const pct = Math.round(((trip.totalSlots - trip.slots) / trip.totalSlots) * 100);
  return (
    <div className="ot-card" onClick={onClick}>
      <div className={`ot-datestamp ph-${trip.palette || "ink"}`} style={{background: undefined}}>
        <span className="m">{trip.month}</span>
        <span className="d">{trip.day}</span>
        <span className="dur">{trip.duration}</span>
        {trip.tag && <span className="ot-tag">{trip.tag}</span>}
      </div>
      <div className="ot-body">
        <span className="region">{trip.region}</span>
        <div className="title">{trip.dest}</div>
        <div className="meta">{trip.highlights.slice(0,2).join(" · ")}</div>
        <div className="slots">
          <div className={`bar ${low ? "low":""}`}><span style={{width: `${Math.max(8, pct)}%`}}/></div>
          <span className={`txt ${low ? "low":""}`}>{trip.slots} slot left</span>
        </div>
        <div className="foot">
          <span className="price">Rp {trip.price}<small> / orang</small></span>
          <span style={{fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--ejg-ink)"}}>Detail →</span>
        </div>
      </div>
    </div>
  );
};

const GlampCard = ({ g, onClick }) => (
  <div className="gl-card" onClick={onClick}>
    <div className={`gl-photo ph-${g.palette || "forest"}`}>
      <span className="emoji">{g.emoji}</span>
      {g.tag && <span className="tag">{g.tag}</span>}
    </div>
    <div className="gl-body">
      <span className="loc">{g.location}</span>
      <div className="title">{g.name}</div>
      <div className="tag-line">{g.tagline}</div>
      <div className="foot">
        <span className="price">Rp {g.price}<small> / {g.unit}</small></span>
        <span className="cap">{g.cap}</span>
      </div>
    </div>
  </div>
);

const Footer = ({ onNav }) => (
  <div className="site-foot">
    <div className="brand"><img src="../assets/ejg-mark-primary.svg" /> EH! JADI GA?</div>
    <p style={{fontSize: 13, opacity: 0.7, lineHeight: 1.5, maxWidth: 300}}>
      Trip & glamping buat yang pengen jalan tanpa harus mikirin logistik.
    </p>
    <div className="row">
      <div>
        <h5>Jelajah</h5>
        <ul>
          <li><a onClick={() => onNav("trips")}>Trips</a></li>
          <li><a onClick={() => onNav("glamping")}>Glamping</a></li>
          <li><a onClick={() => onNav("inquiry")}>Inquiry</a></li>
          <li><a onClick={() => onNav("about")}>Tentang</a></li>
        </ul>
      </div>
      <div>
        <h5>Kontak</h5>
        <ul>
          <li><a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer">WhatsApp</a></li>
          <li><a>@ehjadiga</a></li>
          <li><a>halo@ehjadiga.id</a></li>
          <li><a>Malang, Jawa Timur</a></li>
        </ul>
      </div>
    </div>
    <div className="fine">© {new Date().getFullYear()} EH! JADI GA? · Made with koffie & anxiety · Semua destinasi bisa berubah sesuai cuaca.</div>
  </div>
);

const WAFab = ({ message }) => {
  const href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message || "Halo EJG! Mau tanya tentang trip nih.")}`;
  return (
    <a className="wa-fab" href={href} target="_blank" rel="noreferrer" aria-label="Chat WhatsApp">
      <span className="pulse"></span>
      <Icon name="wa" className="ic ic-lg" />
    </a>
  );
};

const Toast = ({ message, onDone }) => {
  React.useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, []);
  return <div className="toast">{message}</div>;
};

Object.assign(window, { Icon, Brand, TopBar, Drawer, OpenTripCard, GlampCard, Footer, WAFab, Toast });
