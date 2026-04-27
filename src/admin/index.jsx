import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Login';
import Layout from './Layout';
import Dashboard from './Dashboard';
import OpenTrips from './OpenTrips';
import PrivateTrips from './PrivateTrips';
import Glamping from './Glamping';
import Events from './Events';
import Referrals from './Referrals';
import Settings from './Settings';

export default function AdminApp() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('ejg_admin_session') === '1');

  if (!authed) {
    return <Login onAuth={() => setAuthed(true)} />;
  }

  return (
    <Layout>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="open-trips" element={<OpenTrips />} />
        <Route path="private" element={<PrivateTrips />} />
        <Route path="glamping" element={<Glamping />} />
        <Route path="events" element={<Events />} />
        <Route path="referrals" element={<Referrals />} />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </Layout>
  );
}
