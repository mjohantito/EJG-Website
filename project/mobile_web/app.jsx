// EH! JADI GA? — mobile web app shell

const { useState, useEffect } = React;

const App = () => {
  // Persist nav across refresh
  const [route, setRoute] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ejg_route") || '{"name":"home"}'); }
    catch { return { name: "home" }; }
  });
  const [drawer, setDrawer] = useState(false);
  const [toast, setToast] = useState(null);

  // TWEAKS
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "accentPalette": "Ink + Sun",
    "playful": true,
    "roundedness": "Bubbly (22px)",
    "showWAFab": true
  }/*EDITMODE-END*/;
  const [tweaks, setTweaks] = useState(TWEAK_DEFAULTS);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    localStorage.setItem("ejg_route", JSON.stringify(route));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [route]);

  // Apply tweaks at :root
  useEffect(() => {
    const r = document.documentElement;
    const palettes = {
      "Ink + Sun":    { ink: "#252525", sun: "#F3D543" },
      "Ink + Cream":  { ink: "#252525", sun: "#F5E8C7" },
      "Forest + Sun": { ink: "#2B3A2B", sun: "#F3D543" },
      "Clay + Sun":   { ink: "#4A2D20", sun: "#E8B84C" },
    };
    const p = palettes[tweaks.accentPalette] || palettes["Ink + Sun"];
    r.style.setProperty("--ejg-ink", p.ink);
    r.style.setProperty("--ejg-matahari", p.sun);

    const rad = { "Soft (14px)": 14, "Bubbly (22px)": 22, "Sharp (8px)": 8 }[tweaks.roundedness] || 22;
    r.style.setProperty("--ra-2", `${rad}px`);
  }, [tweaks]);

  // Edit mode wiring
  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === "__activate_edit_mode") setEditMode(true);
      if (e.data?.type === "__deactivate_edit_mode") setEditMode(false);
    };
    window.addEventListener("message", handler);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", handler);
  }, []);

  const setTweak = (key, val) => {
    const next = { ...tweaks, [key]: val };
    setTweaks(next);
    window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { [key]: val } }, "*");
  };

  // NAVIGATION
  const go = (name, ctx) => setRoute({ name, ctx: ctx || null });
  const back = () => setRoute(r => r.prev ? r.prev : { name: "home" });

  const handleNav = (name, ctx) => go(name, ctx);
  const onOpenTrip = (id) => setRoute({ name: "trip", tripId: id, prev: route });
  const onOpenGlamp = (id) => setRoute({ name: "glamp", glampId: id, prev: route });
  const onInquiry = (ctx) => setRoute({ name: "inquiry", ctx, prev: route });
  const onSubmitInquiry = (payload) => {
    setRoute({ name: "thanks", ctx: payload });
    setToast("Inquiry terkirim! Cek WA ya.");
  };

  // Back label for detail screens
  let topBarBack = null;
  if (["trip", "glamp", "inquiry", "thanks"].includes(route.name)) {
    const labels = { trip: "Trip detail", glamp: "Glamping", inquiry: "Inquiry", thanks: "" };
    topBarBack = labels[route.name];
  }

  // Determine active nav for drawer highlight
  const activeNav = {
    home: "home", trips: "trips", trip: "trips",
    glamping: "glamping", glamp: "glamping",
    inquiry: "inquiry", thanks: "inquiry", about: "about",
  }[route.name] || "home";

  const appClass = `app${tweaks.playful ? " playful" : ""}`;

  return (
    <div className={appClass} data-screen-label={`EJG Mobile — ${route.name}`}>
      <TopBar
        onHome={() => go("home")}
        onMenu={() => setDrawer(true)}
        backLabel={topBarBack}
        onBack={() => back()}
      />

      <Drawer open={drawer} onClose={() => setDrawer(false)} onNav={handleNav} active={activeNav} />

      {route.name === "home" && (
        <HomeScreen onNav={handleNav} onOpenTrip={onOpenTrip} onOpenGlamp={onOpenGlamp} />
      )}
      {route.name === "trips" && (
        <TripsScreen onBack={() => go("home")} onOpenTrip={onOpenTrip} onNav={handleNav} />
      )}
      {route.name === "trip" && (
        <TripDetailScreen tripId={route.tripId} onBack={back} onInquiry={onInquiry} onNav={handleNav} />
      )}
      {route.name === "glamping" && (
        <GlampingScreen onNav={handleNav} onOpenGlamp={onOpenGlamp} />
      )}
      {route.name === "glamp" && (
        <GlampDetailScreen glampId={route.glampId} onBack={back} onInquiry={onInquiry} />
      )}
      {route.name === "inquiry" && (
        <InquiryScreen context={route.ctx} onBack={back} onSubmit={onSubmitInquiry} onNav={handleNav} />
      )}
      {route.name === "thanks" && (
        <ThanksScreen ctx={route.ctx} onDone={() => go("home")} onNav={handleNav} />
      )}
      {route.name === "about" && (
        <AboutScreen onNav={handleNav} />
      )}

      {tweaks.showWAFab && route.name !== "inquiry" && route.name !== "thanks" && (
        <WAFab message={
          route.name === "trip" ? `Halo EJG! Mau nanya trip ${UPCOMING_OPEN_TRIPS.find(t=>t.id===route.tripId)?.dest} nih.`
          : route.name === "glamp" ? `Halo EJG! Mau nanya glamping ${GLAMPINGS.find(g=>g.id===route.glampId)?.name} nih.`
          : undefined
        }/>
      )}

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      {/* Tweaks panel (shown when host toolbar toggle is on) */}
      <div className={`tweaks-panel ${editMode ? "on" : ""}`}>
        <div className="t-title">Tweaks</div>
        <div className="t-row">
          <label>Palette</label>
          <select value={tweaks.accentPalette} onChange={e => setTweak("accentPalette", e.target.value)}>
            <option>Ink + Sun</option>
            <option>Ink + Cream</option>
            <option>Forest + Sun</option>
            <option>Clay + Sun</option>
          </select>
        </div>
        <div className="t-row">
          <label>Radius</label>
          <select value={tweaks.roundedness} onChange={e => setTweak("roundedness", e.target.value)}>
            <option>Sharp (8px)</option>
            <option>Soft (14px)</option>
            <option>Bubbly (22px)</option>
          </select>
        </div>
        <div className="t-row">
          <label>Playful rotations</label>
          <button className={`switch ${tweaks.playful ? "on" : ""}`} onClick={() => setTweak("playful", !tweaks.playful)} />
        </div>
        <div className="t-row">
          <label>WhatsApp FAB</label>
          <button className={`switch ${tweaks.showWAFab ? "on" : ""}`} onClick={() => setTweak("showWAFab", !tweaks.showWAFab)} />
        </div>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
