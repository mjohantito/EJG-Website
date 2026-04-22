// EH! JADI GA? — App shell / navigation

const App = () => {
  const [screen, setScreen] = React.useState("home");
  const [activeTab, setActiveTab] = React.useState("home");
  const [currentTrip, setCurrentTrip] = React.useState(null);

  const openTrip = (trip) => {
    setCurrentTrip(trip);
    setScreen("detail");
  };
  const goHome = () => { setScreen("home"); setActiveTab("home"); };
  const onTabChange = (id) => {
    setActiveTab(id);
    if (id === "home") setScreen("home");
    else if (id === "explore") setScreen("explore");
    else if (id === "booking") setScreen("home"); // demo
    else if (id === "saved") setScreen("home");
    else if (id === "me") setScreen("home");
  };

  const hasTabs = ["home", "explore", "glamping"].includes(screen);

  return (
    <>
      {screen === "home" && <HomeScreen onNav={(n) => setScreen(n)} onOpenTrip={openTrip} />}
      {screen === "explore" && <ExploreScreen onBack={goHome} onOpenTrip={openTrip} />}
      {screen === "glamping" && <GlampingScreen onBack={goHome} />}
      {screen === "detail" && currentTrip && <TripDetailScreen trip={currentTrip} onBack={() => setScreen("home")} onBook={() => setScreen("booking")} />}
      {screen === "booking" && <BookingScreen trip={currentTrip} onBack={() => setScreen("detail")} onSubmit={() => setScreen("confirm")} />}
      {screen === "confirm" && <ConfirmationScreen onDone={goHome} />}
      {hasTabs && <BottomTabs active={activeTab} onChange={onTabChange} />}
    </>
  );
};

// Helper to render the same app several times in different states for the overview
const ScreenPreview = ({ initialState, label }) => {
  const [screen, setScreen] = React.useState(initialState.screen);
  const [trip, setTrip] = React.useState(initialState.trip || null);

  const openTrip = (t) => { setTrip(t); setScreen("detail"); };
  const goHome = () => setScreen("home");

  return (
    <div>
      <div className="phone">
        <div className="notch"></div>
        <div className="statusbar">
          <span>9:41</span>
          <span>●●●● 📶 100%</span>
        </div>
        <div className="screen">
          {screen === "home" && <HomeScreen onNav={setScreen} onOpenTrip={openTrip} />}
          {screen === "explore" && <ExploreScreen onBack={goHome} onOpenTrip={openTrip} />}
          {screen === "glamping" && <GlampingScreen onBack={goHome} />}
          {screen === "detail" && trip && <TripDetailScreen trip={trip} onBack={goHome} onBook={() => setScreen("booking")} />}
          {screen === "booking" && <BookingScreen trip={trip} onBack={() => setScreen("detail")} onSubmit={() => setScreen("confirm")} />}
          {screen === "confirm" && <ConfirmationScreen onDone={goHome} />}
          {["home","explore","glamping"].includes(screen) && <BottomTabs active={screen === "home" ? "home" : screen === "explore" ? "explore" : "home"} onChange={(id)=>{ if(id==="home") setScreen("home"); else if(id==="explore") setScreen("explore");}} />}
        </div>
      </div>
      <div className="phone-label">{label}</div>
    </div>
  );
};

const Root = () => (
  <div className="stage">
    <div className="stage-header">
      <img className="mark" src="../../assets/ejg-mark-primary.svg" alt="" />
      <span className="brand">EH! JADI GA<span className="q">?</span></span>
      <span className="sub">Website UI Kit · mobile web · click through the flow</span>
    </div>

    <div className="phone-row">
      <ScreenPreview initialState={{ screen: "home" }} label="01 · Home" />
      <ScreenPreview initialState={{ screen: "explore" }} label="02 · Explore" />
      <ScreenPreview initialState={{ screen: "detail", trip: TRIPS[0] }} label="03 · Trip detail" />
      <ScreenPreview initialState={{ screen: "booking", trip: TRIPS[0] }} label="04 · Booking" />
      <ScreenPreview initialState={{ screen: "confirm" }} label="05 · Confirmation" />
      <ScreenPreview initialState={{ screen: "glamping" }} label="06 · Glamping" />
    </div>
  </div>
);

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
