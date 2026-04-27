import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  UPCOMING_OPEN_TRIPS as D_OPEN_TRIPS,
  OPEN_TRIP_ADDONS as D_OPEN_ADDONS,
  PRIVATE_DESTINATIONS as D_PRIVATE,
  GLAMPINGS as D_GLAMPINGS,
  SPECIAL_EVENTS as D_EVENTS,
  WHATSAPP as D_WHATSAPP,
} from '../data';

export function lookupTier(tiers, pax) {
  if (!tiers || tiers.length === 0) return null;
  const sorted = [...tiers].sort((a, b) => a.minPax - b.minPax);
  let result = sorted[0];
  for (const tier of sorted) {
    if (tier.minPax <= pax) result = tier;
  }
  return result;
}

const DataContext = createContext(null);

/* Map DB row → JS shape (snake_case → camelCase) */
function rowToTrip(r) {
  return {
    id: r.id, dest: r.dest, region: r.region, month: r.month,
    day: r.day, start: r.start_date, end: r.end_date, duration: r.duration,
    price: r.price, priceNum: r.price_num, slots: r.slots, totalSlots: r.total_slots,
    tag: r.tag, palette: r.palette, emoji: r.emoji, cover: r.cover,
    description: r.description,
    highlights: r.highlights || [], includes: r.includes || [], gallery: r.gallery || [],
  };
}
function rowToAddon(r) {
  return { id: r.id, label: r.label, price: r.price, desc: r.descr };
}
function rowToPrivate(r) {
  return {
    id: r.id, name: r.name, region: r.region, sub: r.sub,
    emoji: r.emoji, cover: r.cover, palette: r.palette, description: r.description,
    highlights: r.highlights || [], durations: r.durations || [],
    startingPrice: r.starting_price, pricePerPax: r.price_per_pax,
    gallery: r.gallery || [], priceTiers: r.price_tiers || [],
  };
}
function rowToGlamping(r) {
  return {
    id: r.id, name: r.name, location: r.location, palette: r.palette,
    emoji: r.emoji, cover: r.cover, tag: r.tag, price: r.price,
    pricePerNight: r.price_per_night, unit: r.unit, cap: r.cap,
    availability: r.availability, closedDays: r.closed_days || [],
    tagline: r.tagline, description: r.description,
    amenities: r.amenities || [], notIncluded: r.not_included || [],
    gallery: r.gallery || [], addons: r.addons || [],
    priceTiers: r.price_tiers || [],
  };
}
function rowToReferral(r) {
  return {
    id: r.id, code: r.code, discountType: r.discount_type,
    discountValue: r.discount_value, maxUses: r.max_uses,
    usedCount: r.used_count, expiresAt: r.expires_at,
    active: r.active, description: r.description,
  };
}
function rowToEvent(r) {
  return {
    id: r.id, name: r.name, subtitle: r.subtitle, date: r.date,
    dateEnd: r.date_end, year: r.year, venue: r.venue,
    emoji: r.emoji, cover: r.cover, palette: r.palette, tag: r.tag,
    description: r.description,
    highlights: r.highlights || [], includes: r.includes || [], tickets: r.tickets || [],
  };
}

/* Map JS shape → DB row (camelCase → snake_case) */
export function tripToRow(t) {
  return {
    id: t.id, dest: t.dest, region: t.region, month: t.month,
    day: t.day, start_date: t.start, end_date: t.end, duration: t.duration,
    price: t.price, price_num: t.priceNum, slots: t.slots, total_slots: t.totalSlots,
    tag: t.tag || null, palette: t.palette, emoji: t.emoji, cover: t.cover || null,
    description: t.description,
    highlights: t.highlights || [], includes: t.includes || [], gallery: t.gallery || [],
  };
}
export function addonToRow(a) {
  return { id: a.id, label: a.label, price: a.price, descr: a.desc };
}
export function privateToRow(p) {
  return {
    id: p.id, name: p.name, region: p.region, sub: p.sub,
    emoji: p.emoji, cover: p.cover || null, palette: p.palette,
    description: p.description,
    highlights: p.highlights || [], durations: p.durations || [],
    starting_price: p.startingPrice, price_per_pax: p.pricePerPax,
    gallery: p.gallery || [], price_tiers: p.priceTiers || [],
  };
}
export function glampingToRow(g) {
  return {
    id: g.id, name: g.name, location: g.location, palette: g.palette,
    emoji: g.emoji, cover: g.cover || null, tag: g.tag || null,
    price: g.price, price_per_night: g.pricePerNight, unit: g.unit,
    cap: g.cap, availability: g.availability,
    closed_days: g.closedDays || [],
    tagline: g.tagline, description: g.description,
    amenities: g.amenities || [], not_included: g.notIncluded || [],
    gallery: g.gallery || [], addons: g.addons || [],
    price_tiers: g.priceTiers || [],
  };
}
export function referralToRow(r) {
  return {
    id: r.id, code: r.code, discount_type: r.discountType,
    discount_value: r.discountValue, max_uses: r.maxUses,
    used_count: r.usedCount, expires_at: r.expiresAt || null,
    active: r.active, description: r.description || '',
  };
}
export function eventToRow(e) {
  return {
    id: e.id, name: e.name, subtitle: e.subtitle, date: e.date,
    date_end: e.dateEnd, year: e.year, venue: e.venue,
    emoji: e.emoji, cover: e.cover || null, palette: e.palette, tag: e.tag || null,
    description: e.description,
    highlights: e.highlights || [], includes: e.includes || [], tickets: e.tickets || [],
  };
}

export function DataProvider({ children }) {
  const [openTrips, setOpenTripsState]                     = useState(D_OPEN_TRIPS);
  const [openTripAddons, setOpenTripAddonsState]           = useState(D_OPEN_ADDONS);
  const [privateDestinations, setPrivateDestinationsState] = useState(D_PRIVATE);
  const [glampings, setGlampingsState]                     = useState(D_GLAMPINGS);
  const [events, setEventsState]                           = useState(D_EVENTS);
  const [whatsapp, setWhatsappState]                       = useState(D_WHATSAPP);
  const [referrals, setReferralsState]                     = useState([]);
  const [loading, setLoading]                              = useState(true);

  useEffect(() => {
    async function load() {
      const [trips, addons, priv, glamp, evs, settings, refs] = await Promise.all([
        supabase.from('open_trips').select('*').order('sort_order'),
        supabase.from('open_trip_addons').select('*').order('sort_order'),
        supabase.from('private_destinations').select('*').order('sort_order'),
        supabase.from('glampings').select('*').order('sort_order'),
        supabase.from('events').select('*').order('sort_order'),
        supabase.from('settings').select('*'),
        supabase.from('referrals').select('*').order('id'),
      ]);

      if (trips.data?.length)    setOpenTripsState(trips.data.map(rowToTrip));
      if (addons.data?.length)   setOpenTripAddonsState(addons.data.map(rowToAddon));
      if (priv.data?.length)     setPrivateDestinationsState(priv.data.map(rowToPrivate));
      if (glamp.data?.length)    setGlampingsState(glamp.data.map(rowToGlamping));
      if (evs.data?.length)      setEventsState(evs.data.map(rowToEvent));
      if (refs.data?.length)     setReferralsState(refs.data.map(rowToReferral));
      const waSetting = settings.data?.find(s => s.key === 'whatsapp');
      if (waSetting)             setWhatsappState(waSetting.value);

      setLoading(false);
    }
    load();
  }, []);

  /* CMS setters — write to Supabase then update local state */
  const setOpenTrips = async (items) => {
    setOpenTripsState(items);
    for (let i = 0; i < items.length; i++) {
      await supabase.from('open_trips').upsert({ ...tripToRow(items[i]), sort_order: i });
    }
  };
  const setOpenTripAddons = async (items) => {
    setOpenTripAddonsState(items);
    for (let i = 0; i < items.length; i++) {
      await supabase.from('open_trip_addons').upsert({ ...addonToRow(items[i]), sort_order: i });
    }
  };
  const setPrivateDestinations = async (items) => {
    setPrivateDestinationsState(items);
    for (let i = 0; i < items.length; i++) {
      await supabase.from('private_destinations').upsert({ ...privateToRow(items[i]), sort_order: i });
    }
  };
  const setGlampings = async (items) => {
    setGlampingsState(items);
    for (let i = 0; i < items.length; i++) {
      await supabase.from('glampings').upsert({ ...glampingToRow(items[i]), sort_order: i });
    }
  };
  const setEvents = async (items) => {
    setEventsState(items);
    for (let i = 0; i < items.length; i++) {
      await supabase.from('events').upsert({ ...eventToRow(items[i]), sort_order: i });
    }
  };
  const setWhatsapp = async (val) => {
    setWhatsappState(val);
    await supabase.from('settings').upsert({ key: 'whatsapp', value: val });
  };

  const setReferrals = async (items) => {
    setReferralsState(items);
    for (const item of items) {
      await supabase.from('referrals').upsert(referralToRow(item));
    }
  };
  const deleteReferral = async (id) => {
    await supabase.from('referrals').delete().eq('id', id);
    setReferralsState(p => p.filter(x => x.id !== id));
  };
  const validateReferral = async (code) => {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase.from('referrals')
      .select('*').eq('code', code.toUpperCase().trim()).single();
    if (!data) return { valid: false, error: 'Kode tidak ditemukan' };
    if (!data.active) return { valid: false, error: 'Kode sudah tidak aktif' };
    if (data.expires_at && data.expires_at < today) return { valid: false, error: 'Kode sudah kedaluwarsa' };
    if (data.max_uses > 0 && data.used_count >= data.max_uses) return { valid: false, error: 'Kode sudah habis digunakan' };
    return { valid: true, referral: rowToReferral(data) };
  };
  const useReferral = async (id, currentCount) => {
    await supabase.from('referrals').update({ used_count: currentCount + 1 }).eq('id', id);
    setReferralsState(p => p.map(r => r.id === id ? { ...r, usedCount: currentCount + 1 } : r));
  };

  const deleteOpenTrip         = async (id) => { await supabase.from('open_trips').delete().eq('id', id); setOpenTripsState(p => p.filter(x => x.id !== id)); };
  const deleteOpenTripAddon    = async (id) => { await supabase.from('open_trip_addons').delete().eq('id', id); setOpenTripAddonsState(p => p.filter(x => x.id !== id)); };
  const deletePrivateDestination = async (id) => { await supabase.from('private_destinations').delete().eq('id', id); setPrivateDestinationsState(p => p.filter(x => x.id !== id)); };
  const deleteGlamping         = async (id) => { await supabase.from('glampings').delete().eq('id', id); setGlampingsState(p => p.filter(x => x.id !== id)); };
  const deleteEvent            = async (id) => { await supabase.from('events').delete().eq('id', id); setEventsState(p => p.filter(x => x.id !== id)); };

  const resetAll = async () => {
    await Promise.all([
      supabase.from('open_trips').delete().neq('id', ''),
      supabase.from('open_trip_addons').delete().neq('id', ''),
      supabase.from('private_destinations').delete().neq('id', ''),
      supabase.from('glampings').delete().neq('id', ''),
      supabase.from('events').delete().neq('id', ''),
    ]);
    await supabase.from('settings').upsert({ key: 'whatsapp', value: D_WHATSAPP });
    setOpenTripsState(D_OPEN_TRIPS);
    setOpenTripAddonsState(D_OPEN_ADDONS);
    setPrivateDestinationsState(D_PRIVATE);
    setGlampingsState(D_GLAMPINGS);
    setEventsState(D_EVENTS);
    setWhatsappState(D_WHATSAPP);
    await setOpenTrips(D_OPEN_TRIPS);
    await setOpenTripAddons(D_OPEN_ADDONS);
    await setPrivateDestinations(D_PRIVATE);
    await setGlampings(D_GLAMPINGS);
    await setEvents(D_EVENTS);
  };

  return (
    <DataContext.Provider value={{
      loading,
      openTrips, setOpenTrips, deleteOpenTrip,
      openTripAddons, setOpenTripAddons, deleteOpenTripAddon,
      privateDestinations, setPrivateDestinations, deletePrivateDestination,
      glampings, setGlampings, deleteGlamping,
      events, setEvents, deleteEvent,
      whatsapp, setWhatsapp,
      referrals, setReferrals, deleteReferral, validateReferral, useReferral,
      resetAll,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
