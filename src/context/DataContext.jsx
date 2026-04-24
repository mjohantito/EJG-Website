import { createContext, useContext, useState } from 'react';
import {
  UPCOMING_OPEN_TRIPS as D_OPEN_TRIPS,
  OPEN_TRIP_ADDONS as D_OPEN_ADDONS,
  PRIVATE_DESTINATIONS as D_PRIVATE,
  GLAMPINGS as D_GLAMPINGS,
  SPECIAL_EVENTS as D_EVENTS,
  WHATSAPP as D_WHATSAPP,
} from '../data';

const K = {
  openTrips:    'ejg_cms_open_trips',
  openAddons:   'ejg_cms_open_addons',
  private:      'ejg_cms_private',
  glampings:    'ejg_cms_glampings',
  events:       'ejg_cms_events',
  whatsapp:     'ejg_cms_whatsapp',
};

function read(key, fallback) {
  try {
    const s = localStorage.getItem(key);
    return s !== null ? JSON.parse(s) : fallback;
  } catch { return fallback; }
}

function write(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [openTrips, _setOpenTrips]             = useState(() => read(K.openTrips,  D_OPEN_TRIPS));
  const [openTripAddons, _setOpenTripAddons]   = useState(() => read(K.openAddons, D_OPEN_ADDONS));
  const [privateDestinations, _setPrivate]     = useState(() => read(K.private,    D_PRIVATE));
  const [glampings, _setGlampings]             = useState(() => read(K.glampings,  D_GLAMPINGS));
  const [events, _setEvents]                   = useState(() => read(K.events,     D_EVENTS));
  const [whatsapp, _setWhatsapp]               = useState(() => read(K.whatsapp,   D_WHATSAPP));

  const setOpenTrips         = v => { _setOpenTrips(v);         write(K.openTrips,  v); };
  const setOpenTripAddons    = v => { _setOpenTripAddons(v);    write(K.openAddons, v); };
  const setPrivateDestinations = v => { _setPrivate(v);         write(K.private,    v); };
  const setGlampings         = v => { _setGlampings(v);         write(K.glampings,  v); };
  const setEvents            = v => { _setEvents(v);            write(K.events,     v); };
  const setWhatsapp          = v => { _setWhatsapp(v);          write(K.whatsapp,   v); };

  const resetAll = () => {
    Object.values(K).forEach(k => localStorage.removeItem(k));
    _setOpenTrips(D_OPEN_TRIPS);
    _setOpenTripAddons(D_OPEN_ADDONS);
    _setPrivate(D_PRIVATE);
    _setGlampings(D_GLAMPINGS);
    _setEvents(D_EVENTS);
    _setWhatsapp(D_WHATSAPP);
  };

  return (
    <DataContext.Provider value={{
      openTrips, setOpenTrips,
      openTripAddons, setOpenTripAddons,
      privateDestinations, setPrivateDestinations,
      glampings, setGlampings,
      events, setEvents,
      whatsapp, setWhatsapp,
      resetAll,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
