// Individual screen components

const HomeScreen = ({ onNav, onOpenTrip }) => {
  const [cat, setCat] = React.useState("Semua");
  return (
    <>
      <TopBar />
      <div className="hero">
        <h1>Mau ke mana<br/>weekend ini<span className="q">?</span></h1>
        <p className="lead">Trip & glamping yang bisa di-split sama grup, tanpa ribet.</p>
        <div className="search">
          <Icon name="search" className="ic" />
          <input placeholder="Cari Bromo, Komodo, Dieng…" />
        </div>
      </div>

      <div className="cat-row">
        {["Semua", "Open trip", "Private trip", "Glamping", "Corporate"].map(c => (
          <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Chip>
        ))}
      </div>

      <SectionHeader title='Trip pilihan <span class="q">minggu ini</span>' sub="Kurasi dari tim, biar kamu ga overthinking." more="Liat semua" onMore={() => onNav("explore")} />
      <div className="scroll-h">
        {TRIPS.map(t => <TripCard key={t.id} trip={t} onClick={() => onOpenTrip(t)} />)}
      </div>

      <FeatureBanner
        eyebrow="GLAMPING"
        title="Kemah tapi tetep wangi."
        body="Tent beneran, kasur empuk, shower air panas. Bisa di-add ke private trip kamu."
        cta="Liat glamping"
        deco="⛺"
        onClick={() => onNav("glamping")}
      />

      <SectionHeader title="Baru dari glamping" sub="4 lokasi pilihan." more="Semua" onMore={() => onNav("glamping")} />
      <div style={{display:"flex", flexDirection:"column", gap:"10px", padding:"0 20px 8px"}}>
        {GLAMPS.slice(0,2).map(g => <GlampCard key={g.id} g={g} />)}
      </div>

      <FeatureBanner
        tone="tanah"
        eyebrow="CORPORATE"
        title="Outing kantor? Kita bantu rancang dari A sampai Z."
        body="Team offsite, gathering, retreat — kita urus logistik, kamu fokus ke vibes."
        cta="Ajukan RFP"
        deco="👥"
      />
      <div style={{height: "20px"}} />
    </>
  );
};

const ExploreScreen = ({ onBack, onOpenTrip }) => {
  const [filter, setFilter] = React.useState("Semua");
  return (
    <>
      <TopBarBack title="Jelajah trip" onBack={onBack} />
      <div className="hero" style={{padding: "10px 20px 14px"}}>
        <div className="search">
          <Icon name="search" className="ic" />
          <input placeholder="Cari destinasi…" />
        </div>
      </div>
      <div className="cat-row" style={{paddingBottom: "14px"}}>
        {["Semua", "Open trip", "Private trip", "Glamping", "Weekend", "Gunung", "Pantai"].map(c => (
          <Chip key={c} active={filter === c} onClick={() => setFilter(c)}>{c}</Chip>
        ))}
      </div>
      <div style={{display:"flex", flexDirection:"column", gap:"14px", padding:"0 20px 20px"}}>
        {TRIPS.map(t => <TripCard key={t.id} trip={t} full onClick={() => onOpenTrip(t)} />)}
      </div>
    </>
  );
};

const TripDetailScreen = ({ trip, onBack, onBook }) => (
  <>
    <div className="detail-hero">
      <button className="back-btn" onClick={onBack}><Icon name="arrowLeft" className="ic" /></button>
      <button className="save-btn"><Icon name="heart" className="ic" /></button>
      <span className="emoji">{trip.emoji}</span>
    </div>
    <div className="detail-sheet">
      <span className="dest">{trip.region.toUpperCase()} · {trip.kind.toUpperCase()}</span>
      <h1>{trip.title}</h1>
      <div className="meta-row">
        <span><Icon name="calendar" className="ic ic-sm" />{trip.date}</span>
        <span><Icon name="clock" className="ic ic-sm" />{trip.duration}</span>
        <span><Icon name="group" className="ic ic-sm" />Max 12</span>
        <span><Icon name="pin" className="ic ic-sm" />{trip.region}</span>
      </div>

      <div className="section">
        <h4>Intinya apa sih?</h4>
        <p>{trip.description || "Trip 3 hari 2 malam keliling spot terbaik. Semua logistik udah dipikirin, kamu tinggal datang."}</p>
      </div>

      <div className="section">
        <h4>Itinerary</h4>
        {(trip.itinerary || [
          { day: 1, title: "Hari 1", desc: "Jemput, perjalanan, check-in." },
          { day: 2, title: "Hari 2", desc: "Eksplorasi utama, sunrise, foto." },
          { day: 3, title: "Hari 3", desc: "Spot terakhir, lunch, antar pulang." },
        ]).map(d => (
          <div className="itinerary-day" key={d.day}>
            <div className="bullet">D{d.day}</div>
            <div className="dcontent">
              <div className="dtitle">{d.title}</div>
              <div className="ddesc">{d.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="section">
        <h4>Udah termasuk</h4>
        <ul className="incl-list">
          {(trip.includes || ["Transport", "Penginapan", "Makan utama", "Guide", "Asuransi"]).map(i => (
            <li key={i}><span className="check"><Icon name="check" className="ic ic-sm" /></span>{i}</li>
          ))}
        </ul>
      </div>

      <div className="section">
        <h4>Belum termasuk</h4>
        <p style={{fontSize: "13px", color: "var(--fg-3)"}}>Tiket pesawat, pengeluaran pribadi, tip guide.</p>
      </div>
    </div>
    <BottomCTA priceLabel={`Mulai · ${trip.slots || "Slot tersedia"}`} price={`${trip.price} / orang`} ctaLabel="Pesan sekarang" onCta={onBook} />
  </>
);

const GlampingScreen = ({ onBack }) => (
  <>
    <TopBarBack title="Glamping" onBack={onBack} />
    <div className="hero" style={{padding: "10px 20px 14px"}}>
      <p className="lead" style={{marginBottom: "12px"}}>4 lokasi, semua bisa di-add ke private trip kamu.</p>
      <div className="search">
        <Icon name="pin" className="ic" />
        <input placeholder="Lokasi atau nama tenda…" />
      </div>
    </div>
    <div style={{display:"flex", flexDirection:"column", gap:"12px", padding:"4px 20px 20px"}}>
      {GLAMPS.map(g => <GlampCard key={g.id} g={g} />)}
    </div>
  </>
);

const BookingScreen = ({ trip, onBack, onSubmit }) => {
  const [pax, setPax] = React.useState(2);
  const pricePerPax = 850000;
  const total = pax * pricePerPax;
  const fmt = n => "Rp " + n.toLocaleString("id-ID");
  return (
    <>
      <TopBarBack title="Booking" onBack={onBack} />
      <div className="form">
        <div style={{background: "#fff", padding: "14px 16px", borderRadius: "14px", border: "1px solid var(--border)"}}>
          <div style={{fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "14px", color: "var(--ejg-ink)"}}>{trip?.title || "Sunrise Bromo & Savana Teletubbies"}</div>
          <div style={{fontSize: "12px", color: "var(--fg-3)", marginTop: "2px"}}>{trip?.date || "17 Mei"} · {trip?.duration || "3H2M"}</div>
        </div>

        <div className="field">
          <label>Jumlah peserta</label>
          <div className="stepper">
            <button onClick={() => setPax(Math.max(1, pax-1))} disabled={pax<=1}>−</button>
            <span className="v">{pax} orang</span>
            <button onClick={() => setPax(Math.min(12, pax+1))}>+</button>
          </div>
          <span className="hint">Max 12 orang per open trip.</span>
        </div>

        <div className="field">
          <label>Nama lengkap</label>
          <input defaultValue="Manuel Johan Tito" />
        </div>

        <div className="field">
          <label>No. WhatsApp</label>
          <input defaultValue="+62 812 3456 7890" />
          <span className="hint">Kita kabari H-3 via WA ya.</span>
        </div>

        <div className="field">
          <label>Email</label>
          <input defaultValue="manuel@example.com" />
        </div>

        <div style={{background: "#fff", padding: "14px 16px", borderRadius: "14px", border: "1px solid var(--border)"}}>
          <div className="row-between"><span className="k">Harga × {pax}</span><span>{fmt(total)}</span></div>
          <div className="row-between"><span className="k">Biaya admin</span><span>Gratis</span></div>
          <div className="row-between total"><span>Total</span><span className="v">{fmt(total)}</span></div>
          <div style={{fontSize: "12px", color: "var(--fg-3)", marginTop: "4px"}}>DP 30% dulu aja — sisanya H-7.</div>
        </div>
      </div>
      <div className="cta-bar">
        <Button variant="pri" block onClick={onSubmit}>Lanjut ke pembayaran →</Button>
      </div>
    </>
  );
};

const ConfirmationScreen = ({ onDone }) => (
  <>
    <TopBarBack title="" onBack={onDone} />
    <div className="confirm">
      <div className="big-emoji">🙌</div>
      <h1>Sip, booking udah masuk<span className="q">!</span></h1>
      <p>Tim kita bakal WA kamu dalam 15 menit buat konfirmasi pembayaran DP 30%.</p>
      <div className="booking-ref">EJG-250517-7A2K</div>
      <div className="actions">
        <Button variant="pri" block onClick={onDone}>Oke, balik ke home</Button>
        <Button variant="sec" block>Chat CS di WhatsApp</Button>
      </div>
      <p style={{fontSize: "12px", marginTop: "8px"}}>Belum bayar? Tenang, slot kamu di-hold 24 jam.</p>
    </div>
  </>
);

Object.assign(window, { HomeScreen, ExploreScreen, TripDetailScreen, GlampingScreen, BookingScreen, ConfirmationScreen });
