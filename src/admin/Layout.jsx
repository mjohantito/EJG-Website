import { useNavigate, useLocation } from 'react-router-dom';
import { S } from './shared';

const NAV = [
  { path: '/admin',              label: 'Dashboard',       icon: '📊' },
  { path: '/admin/open-trips',   label: 'Open Trips',      icon: '🗓️' },
  { path: '/admin/private',      label: 'Private Trip',    icon: '🗺️' },
  { path: '/admin/glamping',     label: 'Glamping',        icon: '🏕️' },
  { path: '/admin/events',       label: 'Special Event',   icon: '🎉' },
  { path: '/admin/settings',     label: 'Settings',        icon: '⚙️' },
];

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const logout = () => {
    sessionStorage.removeItem('ejg_admin_session');
    navigate('/admin');
    window.location.reload();
  };

  const isActive = (path) =>
    path === '/admin' ? pathname === '/admin' : pathname.startsWith(path);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={S.sidebar}>
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/ejg-mark-primary.svg" alt="" style={{ width: 28, filter: 'brightness(0) invert(1)' }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 13, color: '#fff', letterSpacing: '-0.01em' }}>EH! JADI GA?</div>
              <div style={{ fontSize: 10, color: '#9ca3af', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 1 }}>CMS</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
          {NAV.map(item => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  width: '100%', padding: '10px 12px', marginBottom: 2,
                  borderRadius: 8, border: 'none', cursor: 'pointer', textAlign: 'left',
                  background: active ? '#F3D543' : 'transparent',
                  color: active ? '#1a1a2e' : '#cbd5e1',
                  fontFamily: 'inherit', fontSize: 13, fontWeight: active ? 700 : 500,
                  transition: 'all 140ms ease',
                }}
              >
                <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: '12px 10px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <a
            href="/"
            target="_blank"
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, color: '#9ca3af', fontSize: 13, textDecoration: 'none', marginBottom: 4 }}
          >
            <span>↗</span> Lihat website
          </a>
          <button
            onClick={logout}
            style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent', color: '#f87171', fontFamily: 'inherit', fontSize: 13, textAlign: 'left' }}
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={S.content}>
        {children}
      </div>
    </div>
  );
}
