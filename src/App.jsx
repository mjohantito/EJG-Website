import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import TopBar from './components/TopBar';
import Drawer from './components/Drawer';
import WAFab from './components/WAFab';
import Toast from './components/Toast';

import HomeScreen from './screens/HomeScreen';
import TripsScreen from './screens/TripsScreen';
import TripDetailScreen from './screens/TripDetailScreen';
import PrivateTripDetailScreen from './screens/PrivateTripDetailScreen';
import GlampingScreen from './screens/GlampingScreen';
import GlampDetailScreen from './screens/GlampDetailScreen';
import InquiryScreen from './screens/InquiryScreen';
import AboutScreen from './screens/AboutScreen';
import ThanksScreen from './screens/ThanksScreen';
import CorporateScreen from './screens/CorporateScreen';
import TermsScreen from './screens/TermsScreen';
import EventsScreen from './screens/EventsScreen';
import EventDetailScreen from './screens/EventDetailScreen';
import EventInquiryScreen from './screens/EventInquiryScreen';

function getBackLabel(pathname) {
  if (/^\/trips\/private\/.+/.test(pathname)) return 'Private trip';
  if (/^\/trips\/.+/.test(pathname)) return 'Trip detail';
  if (/^\/glamping\/.+/.test(pathname)) return 'Glamping';
  if (/^\/events\/.+\/inquiry$/.test(pathname)) return 'Event detail';
  if (/^\/events\/.+/.test(pathname)) return 'Special Event';
  if (pathname === '/inquiry') return 'Inquiry';
  if (pathname === '/thanks') return '';
  if (pathname === '/terms') return 'Syarat & Ketentuan';
  return null;
}

function getActiveNav(pathname) {
  if (pathname === '/') return 'home';
  if (pathname.startsWith('/trips')) return 'trips';
  if (pathname.startsWith('/glamping')) return 'glamping';
  if (pathname === '/corporate') return 'corporate';
  if (pathname === '/inquiry' || pathname === '/thanks') return 'inquiry';
  if (pathname === '/about') return 'about';
  if (pathname.startsWith('/events')) return 'events';
  return 'home';
}

const NAV_ROUTES = {
  home:      '/',
  trips:     '/trips',
  glamping:  '/glamping',
  corporate: '/corporate',
  inquiry:   '/inquiry',
  about:     '/about',
  events:    '/events',
};

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const { pathname } = location;
  const backLabel = getBackLabel(pathname);
  const activeNav = getActiveNav(pathname);
  const showFab = pathname !== '/inquiry' && pathname !== '/thanks' && !/^\/events\/.+\/inquiry$/.test(pathname);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  const handleNavFromDrawer = (name) => {
    navigate(NAV_ROUTES[name] || '/');
  };

  const handleSubmitInquiry = (payload) => {
    navigate('/thanks', { state: payload });
    setToast('Inquiry terkirim! Cek WA ya.');
  };

  return (
    <div className="app playful">
      <TopBar
        onHome={() => navigate('/')}
        onMenu={() => setDrawerOpen(true)}
        backLabel={backLabel}
        onBack={() => navigate(-1)}
      />

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onNav={handleNavFromDrawer}
        active={activeNav}
      />

      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/trips" element={<TripsScreen />} />
        <Route path="/trips/private/:id" element={<PrivateTripDetailScreen />} />
        <Route path="/trips/:id" element={<TripDetailScreen />} />
        <Route path="/glamping" element={<GlampingScreen />} />
        <Route path="/glamping/:id" element={<GlampDetailScreen />} />
        <Route path="/corporate" element={<CorporateScreen />} />
        <Route path="/inquiry" element={<InquiryScreen onSubmit={handleSubmitInquiry} />} />
        <Route path="/about" element={<AboutScreen />} />
        <Route path="/thanks" element={<ThanksScreen />} />
        <Route path="/terms" element={<TermsScreen />} />
        <Route path="/events" element={<EventsScreen />} />
        <Route path="/events/:id" element={<EventDetailScreen />} />
        <Route path="/events/:id/inquiry" element={<EventInquiryScreen />} />
      </Routes>

      {showFab && <WAFab />}

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
