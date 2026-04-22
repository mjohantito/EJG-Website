// EH! JADI GA? — Shared UI Kit Components

const Icon = ({ name, className = "ic" }) => {
  const paths = {
    search:   <><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></>,
    menu:     <><path d="M4 6h16M4 12h16M4 18h10"/></>,
    home:     <><path d="M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/></>,
    explore:  <><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></>,
    calendar: <><path d="M8 2v4M16 2v4M3 9h18M5 5h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/></>,
    heart:    <><path d="M20.84 4.6a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.07a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></>,
    user:     <><circle cx="12" cy="8" r="4"/><path d="M4 22a8 8 0 0 1 16 0"/></>,
    arrowLeft:<><path d="m14 18-6-6 6-6"/></>,
    check:    <><path d="m5 13 4 4L19 7"/></>,
    group:    <><circle cx="9" cy="7" r="4"/><circle cx="17" cy="10" r="3"/><path d="M2 22a7 7 0 0 1 14 0M14 22a5 5 0 0 1 9 0"/></>,
    moon:     <><path d="M21 12.5A9 9 0 1 1 11.5 3a7 7 0 0 0 9.5 9.5z"/></>,
    pin:      <><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 0 0-8 8c0 5 8 12 8 12s8-7 8-12a8 8 0 0 0-8-8z"/></>,
    clock:    <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    van:      <><path d="M3 7h13l5 5v5h-2a3 3 0 0 1-6 0H9a3 3 0 0 1-6 0z"/></>,
    utensils: <><path d="M4 3v7a3 3 0 0 0 3 3v8M7 3v7M11 3v18M18 3v18M18 13c-2 0-3-2-3-4V3h3"/></>,
    bed:      <><path d="M3 18v-6a4 4 0 0 1 4-4h14v10M3 18h18M7 14h4M21 14H11"/></>,
  };
  return <svg className={className} viewBox="0 0 24 24">{paths[name] || null}</svg>;
};

const Brand = ({ big }) => (
  <span className="tb-brand">
    <img src="../../assets/ejg-mark-primary.svg" alt="" />
    <span className="name" style={big ? { fontSize: "18px" } : null}>EH! JADI GA<span className="q">?</span></span>
  </span>
);

const TopBar = ({ onMenu }) => (
  <div className="topbar">
    <Brand />
    <div className="tb-right">
      <button className="iconbtn" aria-label="Cari"><Icon name="search" /></button>
      <button className="iconbtn pri" aria-label="Menu" onClick={onMenu}><Icon name="menu" /></button>
    </div>
  </div>
);

const TopBarBack = ({ title, onBack }) => (
  <div className="topbar back">
    <button className="iconbtn" onClick={onBack} aria-label="Kembali"><Icon name="arrowLeft" /></button>
    <span className="tb-title">{title}</span>
  </div>
);

const BottomTabs = ({ active, onChange }) => {
  const tabs = [
    { id: "home", name: "Home", icon: "home" },
    { id: "explore", name: "Jelajah", icon: "explore" },
    { id: "booking", name: "Booking", icon: "calendar" },
    { id: "saved", name: "Simpan", icon: "heart" },
    { id: "me", name: "Akun", icon: "user" },
  ];
  return (
    <nav className="tabs">
      {tabs.map(t => (
        <div key={t.id} className={`tab ${active === t.id ? "on" : ""}`} onClick={() => onChange(t.id)}>
          <Icon name={t.icon} />
          {t.name}
        </div>
      ))}
    </nav>
  );
};

const Chip = ({ children, active, onClick }) => (
  <span className={`chip ${active ? "on" : ""}`} onClick={onClick}>{children}</span>
);

const Button = ({ variant = "pri", block, children, ...rest }) => (
  <button className={`btn btn-${variant} ${block ? "btn-block" : ""}`} {...rest}>{children}</button>
);

const SectionHeader = ({ title, sub, more, onMore }) => (
  <div className="sh">
    <div>
      <h2 dangerouslySetInnerHTML={{ __html: title }} />
      {sub && <div className="sh-sub">{sub}</div>}
    </div>
    {more && <span className="more" onClick={onMore}>{more}</span>}
  </div>
);

const TripCard = ({ trip, full, onClick }) => (
  <div className={`trip-card ${full ? "full" : ""}`} onClick={onClick}>
    <div className={`trip-photo ${trip.palette || ""}`}>
      <span className="ph-emoji">{trip.emoji}</span>
      {trip.tag && <span className="pill abs-top">{trip.tag}</span>}
      <span className="pill abs-bot">{trip.duration} · {trip.date}</span>
    </div>
    <div className="trip-body">
      <span className="dest">{trip.region} · {trip.kind}</span>
      <div className="title">{trip.title}</div>
      <div className="meta">{trip.meta}</div>
      <div className="foot">
        <span className="price">Rp {trip.price}<small> / orang</small></span>
        <span style={{fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "13px", color: "var(--ejg-ink)"}}>Liat →</span>
      </div>
    </div>
  </div>
);

const GlampCard = ({ g, onClick }) => (
  <div className="glamp-card" onClick={onClick}>
    <div className="g-photo">{g.emoji}</div>
    <div className="g-body">
      <div className="title">{g.title}</div>
      <div className="loc">{g.location}</div>
      <div className="foot">
        <span className="price">Rp {g.price}<small> / malam</small></span>
        <span className="badge-soft tanah">Glamping</span>
      </div>
    </div>
  </div>
);

const FeatureBanner = ({ tone = "forest", eyebrow, title, body, cta, deco, onClick }) => (
  <div className={`feature-banner ${tone === "tanah" ? "tanah" : ""}`}>
    <span className="deco">{deco}</span>
    <div className="ey">{eyebrow}</div>
    <h3>{title}</h3>
    <p>{body}</p>
    <button className="btn" onClick={onClick}>{cta} →</button>
  </div>
);

const BottomCTA = ({ priceLabel, price, ctaLabel, onCta }) => (
  <div className="cta-bar">
    <div className="price">
      <span className="small">{priceLabel}</span>
      <span className="num">Rp {price}</span>
    </div>
    <Button variant="pri" onClick={onCta}>{ctaLabel}</Button>
  </div>
);

Object.assign(window, {
  Icon, Brand, TopBar, TopBarBack, BottomTabs, Chip, Button, SectionHeader,
  TripCard, GlampCard, FeatureBanner, BottomCTA,
});
