import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import TopBar from './components/TopBar';
import Drawer from './components/Drawer';
import WAFab from './components/WAFab';
import Toast from './components/Toast';

import HomeScreen from './screens/HomeScreen';
import TripsScreen from './screens/TripsScreen';
import TripDetailScreen from './screens/TripDetailScreen';
import GlampingScreen from './screens/GlampingScreen';
import GlampDetailScreen from './screens/GlampDetailScreen';
import InquiryScreen from './screens/InquiryScreen';
import AboutScreen from './screens/AboutScreen';
import ThanksScreen from './screens/ThanksScreen';

function getBackLabel(pathname) {
  if (/^\/trips\/.+/.test(pathname)) return 'Trip detail';
  if (/^\/glamping\/.+/.test(pathname)) return 'Glamping';
  if (pathname === '/inquiry') return 'Inquiry';
  if (pathname === '/thanks') return '';
  return null;
}

function getActiveNav(pathname) {
  if (pathname === '/') return 'home';
  if (pathname.startsWith('/trips')) return 'trips';
  if (pathname.startsWith('/glamping')) return 'glamping';
  if (pathname === '/inquiry' || pathname === '/thanks') return 'inquiry';
  if (pathname === '/about') return 'about';
  return 'home';
}

const NAV_ROUTES = {
  home:     '/',
  trips:    '/trips',
  glamping: '/glamping',
  inquiry:  '/inquiry',
  about:    '/about',
};

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const { pathname } = location;
  const backLabel = getBackLabel(pathname);
  const activeNav = getActiveNav(pathname);
  const showFab = pathname !== '/inquiry' && pathname !== '/thanks';

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
        <Route path="/trips/:id" element={<TripDetailScreen />} />
        <Route path="/glamping" element={<GlampingScreen />} />
        <Route path="/glamping/:id" element={<GlampDetailScreen />} />
        <Route path="/inquiry" element={<InquiryScreen onSubmit={handleSubmitInquiry} />} />
        <Route path="/about" element={<AboutScreen />} />
        <Route path="/thanks" element={<ThanksScreen />} />
      </Routes>

      {showFab && <WAFab />}

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
