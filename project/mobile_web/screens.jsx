// EH! JADI GA? — mobile web screens

const HomeScreen = ({ onNav, onOpenTrip, onOpenGlamp }) => {
  const highlightTrips = UPCOMING_OPEN_TRIPS.slice(0, 3);
  return (
    <>
      <div className="hero hero-stamp">
        <div className="tag-row">
          <span className="tag">Open trip</span>
          <span className="tag out">Private · Glamping · Corporate</span>
        </div>
        <h1>
          Eh<span className="q-stamp">?</span><br/>
          <span className="italic">beneran </span>jadi ga<span className="q-stamp">?</span>
        </h1>
        <p className="lead">Trip & glamping untuk anak muda yang rencananya banyak, waktunya dikit. Kita urusin logistik, kamu fokus seru-seruan.</p>
        <div className="hero-cta">
          <button className="btn btn-pri" onClick={() => onNav("trips")}>Liat trip →</button>
          <button className="btn btn-sec" onClick={() => onNav("glamping")}>Glamping</button>
        </div>
      </div>

      <div className="quicklinks">
        <div className="ql" onClick={() => onNav("trips")}>
          <Icon name="mountain" className="ic ic-lg" />
          <span className="label">Open trip</span>
          <span className="sub">Join sama orang seru-seruan, budget ramah.</span>
        </div>
        <div className="ql ink" onClick={() => onNav("inquiry")}>
          <Icon name="sparkle" className="ic ic-lg" />
          <span className="label">Private trip</span>
          <span className="sub">Rancang sendiri, grup sendiri.</span>
        </div>
        <div className="ql sun" onClick={() => onNav("glamping")}>
          <Icon name="tent" className="ic ic-lg" />
          <span className="label">Glamping</span>
          <span className="sub">Tent beneran, tetep wangi.</span>
        </div>
        <div className="ql" onClick={() => onNav("inquiry")}>
          <Icon name="group" className="ic ic-lg" />
          <span className="label">Corporate</span>
          <span className="sub">Outing kantor, gathering, offsite.</span>
        </div>
      </div>

      <div className="sh">
        <div>
          <h2>Open trip yang<br/>lagi buka<span className="q-stamp">?</span></h2>
          <div className="sh-sub">3 dari 5 keberangkatan bulan ini.</div>
        </div>
        <button className="more" onClick={() => onNav("trips")}>Semua →</button>
      </div>

      <div className="opentrip-list">
        {highlightTrips.map(t => <OpenTripCard key={t.id} trip={t} onClick={() => onOpenTrip(t.id)} />)}
      </div>

      <div className="teaser">
        <span className="ey">PRIVATE TRIP</span>
        <h3>Grup kamu aja. Tanggal kamu sendiri.</h3>
        <p>Pilih destinasi, kasih tau jumlah orang dan range tanggal — kita rancang + quote dalam 1x24 jam.</p>
        <button className="btn btn-pri" onClick={() => onNav("inquiry")}>Mulai inquiry →</button>
        <span className="deco">🗺️</span>
      </div>

      <div className="sh">
        <div>
          <h2>Glamping<br/><span className="italic" style={{fontFamily:"var(--font-display)", fontStyle:"italic", fontWeight: 500}}>pilihan</span></h2>
          <div className="sh-sub">3 lokasi di Jawa Timur.</div>
        </div>
        <button className="more" onClick={() => onNav("glamping")}>Semua →</button>
      </div>
      <div className="glamp-list">
        {GLAMPINGS.slice(0,2).map(g => <GlampCard key={g.id} g={g} onClick={() => onOpenGlamp(g.id)} />)}
      </div>

      <div className="teaser kertas" style={{marginTop: 18}}>
        <span className="ey">CORPORATE</span>
        <h3>Outing kantor? Kita bantu dari A sampai Z.</h3>
        <p>Team offsite, gathering, retreat — logistik kita urus, kamu fokus ke momen.</p>
        <button className="btn btn-pri" onClick={() => onNav("inquiry")}>Ajukan RFP →</button>
        <span className="deco">👥</span>
      </div>

      <Footer onNav={onNav} />
    </>
  );
};

const TripsScreen = ({ onBack, onOpenTrip, onNav }) => {
  const [mode, setMode] = React.useState("open");
  // Group open trips by month
  const grouped = {};
  UPCOMING_OPEN_TRIPS.forEach(t => {
    const key = t.month + " 2025";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(t);
  });

  return (
    <>
      <div className="page-header">
        <span className="eyebrow">Trips · EH! JADI GA?</span>
        <h1 style={{marginTop: 6}}>Mau <span className="italic" style={{fontStyle: "italic", fontWeight: 500}}>lari</span> ke mana<span className="q-stamp">?</span></h1>
        <p className="lead">Join open trip bareng atau rancang private trip kamu sendiri.</p>
      </div>

      <div className="segmented">
        <button className={mode === "open" ? "on" : ""} onClick={() => setMode("open")}>Open trip</button>
        <button className={mode === "private" ? "on" : ""} onClick={() => setMode("private")}>Private trip</button>
      </div>

      {mode === "open" && (
        <>
          <div style={{padding: "0 20px 6px", fontSize: 13, color: "var(--fg-3)", lineHeight: 1.45}}>
            {UPCOMING_OPEN_TRIPS.length} keberangkatan terjadwal. Tap untuk detail & booking.
          </div>
          {Object.entries(grouped).map(([mo, trips]) => (
            <React.Fragment key={mo}>
              <div className="month-sep">{mo}</div>
              <div className="opentrip-list">
                {trips.map(t => <OpenTripCard key={t.id} trip={t} onClick={() => onOpenTrip(t.id)} />)}
              </div>
            </React.Fragment>
          ))}
          <div className="teaser kertas" style={{marginTop: 8}}>
            <span className="ey">GA NEMU TANGGAL CLICK?</span>
            <h3>Bikin private trip aja.</h3>
            <p>Tentuin destinasi, tanggal, dan jumlah orang. Quote dikirim dalam 1x24 jam.</p>
            <button className="btn btn-pri" onClick={() => setMode("private")}>Coba private →</button>
          </div>
        </>
      )}

      {mode === "private" && <PrivateConfigurator onSubmit={() => onNav("inquiry", { kind: "private" })} />}

      <Footer onNav={onNav} />
    </>
  );
};

const PrivateConfigurator = ({ onSubmit }) => {
  const [dest, setDest] = React.useState("pronojiwo");
  const [dateMode, setDateMode] = React.useState("weekend");
  const [pax, setPax] = React.useState(4);
  const [nights, setNights] = React.useState(2);

  return (
    <div style={{padding: "8px 0 20px"}}>
      <div className="page-header" style={{paddingTop: 4, paddingBottom: 10}}>
        <span className="eyebrow">Private trip</span>
        <p className="lead" style={{marginTop: 6}}>Pilih konfigurasi dasar, kita lanjut via form detail.</p>
      </div>

      <div style={{padding: "0 20px 10px", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 14, color: "var(--ejg-ink)", textTransform: "uppercase", letterSpacing: "0.1em"}}>
        1. Destinasi
      </div>
      <div className="dest-grid">
        {PRIVATE_DESTINATIONS.map(d => (
          <button key={d.id} className={`dest-opt ${dest === d.id ? "on" : ""}`} onClick={() => setDest(d.id)}>
            <span className="em">{d.emoji}</span>
            <span className="name">{d.name}</span>
            <span className="sub">{d.sub}</span>
          </button>
        ))}
      </div>

      <div style={{padding: "16px 20px 10px", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 14, color: "var(--ejg-ink)", textTransform: "uppercase", letterSpacing: "0.1em"}}>
        2. Tanggal
      </div>
      <div className="radio-row" style={{padding: "0 20px 10px"}}>
        <button className={`radio-card ${dateMode === "weekend" ? "on":""}`} onClick={() => setDateMode("weekend")}>
          <span className="k">Weekend terdekat</span>
          <span className="v">Sabtu–Minggu</span>
        </button>
        <button className={`radio-card ${dateMode === "custom" ? "on":""}`} onClick={() => setDateMode("custom")}>
          <span className="k">Tanggal custom</span>
          <span className="v">Isi di form</span>
        </button>
      </div>

      <div style={{padding: "16px 20px 10px", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 14, color: "var(--ejg-ink)", textTransform: "uppercase", letterSpacing: "0.1em"}}>
        3. Grup & Durasi
      </div>
      <div style={{padding: "0 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10}}>
        <div className="field">
          <label>Jumlah orang</label>
          <div className="stepper">
            <button onClick={() => setPax(Math.max(2, pax-1))}>−</button>
            <span className="v">{pax}</span>
            <button onClick={() => setPax(Math.min(30, pax+1))}>+</button>
          </div>
        </div>
        <div className="field">
          <label>Malam</label>
          <div className="stepper">
            <button onClick={() => setNights(Math.max(1, nights-1))}>−</button>
            <span className="v">{nights}</span>
            <button onClick={() => setNights(Math.min(10, nights+1))}>+</button>
          </div>
        </div>
      </div>

      <div style={{padding: "18px 20px 0"}}>
        <button className="btn btn-pri btn-block" onClick={onSubmit}>Lanjut ke form inquiry →</button>
      </div>
    </div>
  );
};

const TripDetailScreen = ({ tripId, onBack, onInquiry, onNav }) => {
  const trip = UPCOMING_OPEN_TRIPS.find(t => t.id === tripId) || UPCOMING_OPEN_TRIPS[0];
  const low = trip.slots <= 3;

  return (
    <>
      <div className={`detail-hero ph-${trip.palette || "ink"}`}>
        <button className="back-btn" onClick={onBack}><Icon name="arrowLeft" className="ic" /></button>
        <button className="save-btn"><Icon name="heart" className="ic" /></button>
        <span className="emoji" style={{fontSize: 100}}>{trip.emoji}</span>
        <span className="stamp-pill">OPEN TRIP · {trip.month} {trip.day}</span>
      </div>
      <div className="detail-sheet">
        <span className="region">{trip.region}</span>
        <h1 style={{marginTop: 8}}>{trip.dest}</h1>

        <div className="meta-row">
          <span><Icon name="calendar" className="ic ic-sm" />{trip.start} – {trip.end}</span>
          <span><Icon name="clock" className="ic ic-sm" />{trip.duration}</span>
          <span><Icon name="group" className="ic ic-sm" />Max {trip.totalSlots}</span>
        </div>

        <div style={{padding: "4px 0 10px"}}>
          <div className="slots">
            <div className={`bar ${low ? "low":""}`}><span style={{width: `${Math.max(10, ((trip.totalSlots-trip.slots)/trip.totalSlots)*100)}%`}}/></div>
            <span className={`txt ${low ? "low":""}`}>{trip.slots} dari {trip.totalSlots} slot tersisa</span>
          </div>
        </div>

        <div className="section desc">
          <h4>Yang bakal kita lakuin</h4>
          <ul className="bullets">
            {trip.highlights.map(h => (
              <li key={h}><span className="check"><Icon name="check" className="ic ic-sm" /></span>{h}</li>
            ))}
          </ul>
        </div>

        <div className="section">
          <h4>Udah termasuk</h4>
          <ul className="bullets">
            {trip.includes.map(i => (
              <li key={i}><span className="check"><Icon name="check" className="ic ic-sm" /></span>{i}</li>
            ))}
          </ul>
        </div>

        <div className="section">
          <h4>Belum termasuk</h4>
          <p>Tiket pesawat ke kota start, pengeluaran pribadi, tip guide (optional).</p>
        </div>

        <div className="section">
          <h4>Cara booking</h4>
          <p>Tap "Tanya & Booking" → isi form → tim kita konfirmasi via WA dalam 1x24 jam. DP 30% untuk hold slot, pelunasan H-7.</p>
        </div>
      </div>

      <div className="cta-bar">
        <div className="price">
          <span className="small">Mulai {low && "· hampir penuh"}</span>
          <span className="num">Rp {trip.price}</span>
        </div>
        <button className="btn btn-pri" onClick={() => onInquiry({ kind: "open", tripId: trip.id })}>Tanya & Booking</button>
      </div>
    </>
  );
};

const GlampingScreen = ({ onNav, onOpenGlamp }) => (
  <>
    <div className="page-header">
      <span className="eyebrow">Glamping · EH! JADI GA?</span>
      <h1 style={{marginTop: 6}}>Kemah<span className="q-stamp">?</span><br/>Tetep <span className="italic" style={{fontStyle:"italic", fontWeight: 500}}>wangi</span>.</h1>
      <p className="lead">3 lokasi di Jawa Timur. Bisa di-add ke private trip kamu juga.</p>
    </div>
    <div className="glamp-list">
      {GLAMPINGS.map(g => <GlampCard key={g.id} g={g} onClick={() => onOpenGlamp(g.id)} />)}
    </div>
    <div className="teaser" style={{marginTop: 18}}>
      <span className="ey">COMBINE</span>
      <h3>Trip + glamping dalam satu paket.</h3>
      <p>Banyak yang pesan private trip ke Tumpak Sewu / Kelud sekalian nginep di Jurang Senggani.</p>
      <button className="btn btn-pri" onClick={() => onNav("inquiry")}>Bikin paket custom →</button>
      <span className="deco">🏕️</span>
    </div>
    <Footer onNav={onNav} />
  </>
);

const GlampDetailScreen = ({ glampId, onBack, onInquiry }) => {
  const g = GLAMPINGS.find(x => x.id === glampId) || GLAMPINGS[0];
  return (
    <>
      <div className={`detail-hero ph-${g.palette || "forest"}`}>
        <button className="back-btn" onClick={onBack}><Icon name="arrowLeft" className="ic" /></button>
        <button className="save-btn"><Icon name="heart" className="ic" /></button>
        <span className="emoji" style={{fontSize: 100}}>{g.emoji}</span>
        <span className="stamp-pill">GLAMPING</span>
      </div>
      <div className="detail-sheet">
        <span className="region">{g.location}</span>
        <h1 style={{marginTop: 8}}>{g.name}</h1>

        <div className="meta-row">
          <span><Icon name="group" className="ic ic-sm" />{g.cap}</span>
          <span><Icon name="calendar" className="ic ic-sm" />{g.availability}</span>
          <span><Icon name="pin" className="ic ic-sm" />{g.location.split(",")[0]}</span>
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
              <li key={a}><span className="check"><Icon name="check" className="ic ic-sm" /></span>{a}</li>
            ))}
          </ul>
        </div>

        <div className="section">
          <h4>Cara booking</h4>
          <p>Tap "Tanya & Booking" → isi form → kita konfirmasi ketersediaan. DP 50% untuk reservasi.</p>
        </div>
      </div>

      <div className="cta-bar">
        <div className="price">
          <span className="small">Mulai / {g.unit}</span>
          <span className="num">Rp {g.price}</span>
        </div>
        <button className="btn btn-pri" onClick={() => onInquiry({ kind: "glamping", glampId: g.id })}>Tanya & Booking</button>
      </div>
    </>
  );
};

const InquiryScreen = ({ context, onBack, onSubmit, onNav }) => {
  const initialKind = context?.kind || "open";
  const [kind, setKind] = React.useState(initialKind);
  const [name, setName] = React.useState("");
  const [wa, setWa] = React.useState("");
  const [pax, setPax] = React.useState(2);
  const [date, setDate] = React.useState("");
  const [dest, setDest] = React.useState(context?.tripId || context?.glampId || PRIVATE_DESTINATIONS[0].id);
  const [note, setNote] = React.useState("");

  const placeholderNotes = {
    open: "Ada pertanyaan spesifik? Misal: ada extension ke kota terdekat, atau request dietary.",
    private: "Kasih tau pengen apa aja — tipe akomodasi, hal yang pengen dilakuin, budget range.",
    glamping: "Pengen tanggal mana? Ada request makanan atau butuh add-on (jeep, guide, BBQ)?",
    corporate: "Jumlah peserta, rentang tanggal, objective acara, kota asal, dan budget range.",
  };

  const canSubmit = name.trim().length > 1 && wa.trim().length > 5;

  return (
    <>
      <div className="page-header">
        <span className="eyebrow">Inquiry · 1x24 jam response</span>
        <h1 style={{marginTop: 6}}>Kita <span className="italic" style={{fontStyle:"italic", fontWeight: 500}}>bales</span> dalam 24 jam<span className="q-stamp">.</span></h1>
        <p className="lead">Isi form ini. Tim kita konfirmasi langsung via WhatsApp.</p>
      </div>

      <div style={{padding: "0 20px 14px"}}>
        <label className="eyebrow" style={{display: "block", marginBottom: 8}}>Jenis inquiry</label>
        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8}}>
          {[
            { id: "open", name: "Open trip" },
            { id: "private", name: "Private trip" },
            { id: "glamping", name: "Glamping" },
            { id: "corporate", name: "Corporate" },
          ].map(k => (
            <button key={k.id} className={`radio-card ${kind === k.id ? "on":""}`} onClick={() => setKind(k.id)} style={{alignItems: "center", justifyContent: "center", textAlign: "center", padding: "12px 8px"}}>
              <span className="k">{k.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="form">
        <div className="field">
          <label>Nama kamu</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Manuel Johan" />
        </div>

        <div className="field">
          <label>No. WhatsApp</label>
          <input value={wa} onChange={e => setWa(e.target.value)} placeholder="+62 812…" inputMode="tel" />
          <span className="hint">Kita bales via WA biar cepet.</span>
        </div>

        {(kind === "open" || kind === "private") && (
          <div className="field">
            <label>Destinasi</label>
            <select value={dest} onChange={e => setDest(e.target.value)}>
              {kind === "open"
                ? UPCOMING_OPEN_TRIPS.map(t => <option key={t.id} value={t.id}>{t.dest} · {t.start}</option>)
                : PRIVATE_DESTINATIONS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)
              }
            </select>
          </div>
        )}

        {kind === "glamping" && (
          <div className="field">
            <label>Lokasi glamping</label>
            <select value={dest} onChange={e => setDest(e.target.value)}>
              {GLAMPINGS.map(g => <option key={g.id} value={g.id}>{g.name} · {g.location.split(",")[0]}</option>)}
            </select>
          </div>
        )}

        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10}}>
          <div className="field">
            <label>Jumlah orang</label>
            <div className="stepper">
              <button onClick={() => setPax(Math.max(1, pax-1))}>−</button>
              <span className="v">{pax}</span>
              <button onClick={() => setPax(pax+1)}>+</button>
            </div>
          </div>
          <div className="field">
            <label>Tanggal pengen</label>
            <input type="text" value={date} onChange={e => setDate(e.target.value)} placeholder={kind === "open" ? "Sesuai jadwal" : "14–15 Jun"} />
          </div>
        </div>

        <div className="field">
          <label>Request / catatan</label>
          <textarea value={note} onChange={e => setNote(e.target.value)} placeholder={placeholderNotes[kind]} />
        </div>

        <div style={{background: "var(--ejg-kertas-2)", border: "1px dashed var(--border-strong)", borderRadius: 14, padding: 14, fontSize: 13, color: "var(--fg-2)", lineHeight: 1.5}}>
          <strong style={{color: "var(--ejg-ink)"}}>Fyi:</strong> kita cuma butuh info dasar. Detail (akomodasi, makanan, budget) bisa ngobrol santai via WA setelah ini.
        </div>

        <button className="btn btn-pri btn-block" disabled={!canSubmit} onClick={() => onSubmit({ kind, name, wa, pax, date, dest, note })} style={{opacity: canSubmit ? 1 : 0.45}}>
          Kirim inquiry →
        </button>

        <div style={{textAlign: "center", fontSize: 12, color: "var(--fg-3)"}}>
          atau <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" style={{color: "var(--ejg-ink)", fontFamily: "var(--font-display)", fontWeight: 700, textDecoration: "underline"}}>chat langsung di WA</a>
        </div>
      </div>

      <Footer onNav={onNav} />
    </>
  );
};

const AboutScreen = ({ onNav }) => (
  <>
    <div className="about-hero">
      <span className="ey">Tentang kami</span>
      <h1>Rencana <span className="italic" style={{fontStyle:"italic", fontWeight: 500}}>banyak</span>,<br/>eksekusi <span className="q-stamp">?</span></h1>
    </div>
    <div className="about-body">
      <p>EH! JADI GA? lahir dari frustasi generasi muda yang punya rencana tapi tidak tahu harus mulai dari mana.</p>
      <div className="pull">
        Perjalanan yang baik bukan soal <span className="hl">mewah</span> — tapi soal siapa yang kamu ajak dan momen apa yang kamu ciptakan bareng.
      </div>
      <p>Didirikan oleh anak muda yang percaya bahwa trip terbaik terjadi ketika logistik udah ga bikin pusing. Jadi kita urusin sisanya — kamu fokus sama temen, sama view, sama momen.</p>
    </div>

    <div className="stat-row">
      <div className="stat"><div className="n">120+</div><div className="l">Trip terselenggara</div></div>
      <div className="stat"><div className="n">4.9</div><div className="l">Rating rata-rata</div></div>
      <div className="stat"><div className="n">1x24h</div><div className="l">Respons inquiry</div></div>
    </div>

    <div style={{padding: "4px 20px 8px", fontFamily: "var(--font-display)", fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--fg-3)"}}>
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

    <div className="teaser" style={{marginTop: 18}}>
      <span className="ey">GA CUMA BACA DONG</span>
      <h3>Yuk jalan bareng.</h3>
      <p>Pilih open trip terdekat, atau rancang private trip kamu sendiri.</p>
      <div style={{display: "flex", gap: 8, flexWrap: "wrap"}}>
        <button className="btn btn-pri" onClick={() => onNav("trips")}>Liat trip</button>
        <button className="btn" style={{background: "transparent", color: "#F3D543", border: "1.5px solid #F3D543"}} onClick={() => onNav("inquiry")}>Inquiry</button>
      </div>
      <span className="deco">✌️</span>
    </div>

    <Footer onNav={onNav} />
  </>
);

const ThanksScreen = ({ ctx, onDone, onNav }) => (
  <>
    <div className="about-hero" style={{paddingTop: 40}}>
      <span className="ey">Inquiry terkirim</span>
      <h1>Sip, udah masuk<span className="q-stamp">!</span></h1>
    </div>
    <div className="about-body">
      <p>Tim kita bakal WA kamu dalam <strong style={{color:"var(--ejg-ink)"}}>1x24 jam</strong> buat konfirmasi detail. Kalau udah lewat dari itu, chat aja lagi ke WA bawah ya.</p>
      <div className="pull">
        Makasih udah percaya sama <span className="hl">EH! JADI GA?</span> — see you on the road.
      </div>
    </div>
    <div style={{padding: "10px 20px 30px", display: "flex", flexDirection: "column", gap: 10}}>
      <button className="btn btn-pri btn-block" onClick={onDone}>Balik ke beranda</button>
      <a className="btn btn-wa btn-block" href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer">
        <Icon name="wa" /> Chat langsung di WA
      </a>
    </div>
    <Footer onNav={onNav} />
  </>
);

Object.assign(window, {
  HomeScreen, TripsScreen, TripDetailScreen,
  GlampingScreen, GlampDetailScreen,
  InquiryScreen, AboutScreen, ThanksScreen,
});
