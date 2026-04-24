import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { S } from './shared';

function StatCard({ icon, label, value, sub, onClick, color = '#252525' }) {
  return (
    <div
      onClick={onClick}
      style={{
        ...S.card, cursor: onClick ? 'pointer' : 'default',
        display: 'flex', alignItems: 'center', gap: 18,
        transition: 'box-shadow 140ms ease',
      }}
      onMouseEnter={e => { if (onClick) e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; }}
    >
      <div style={{ width: 52, height: 52, borderRadius: 14, background: color + '18', display: 'grid', placeItems: 'center', fontSize: 24, flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 800, color, letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginTop: 3 }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { openTrips, privateDestinations, glampings, events, whatsapp } = useData();

  const totalTicketSlots = events.reduce((sum, ev) => sum + ev.tickets.reduce((s, t) => s + t.slots, 0), 0);
  const lowSlotTrips = openTrips.filter(t => t.slots <= 3);

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1100 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#111', letterSpacing: '-0.03em' }}>Dashboard</h1>
        <p style={{ margin: '6px 0 0', fontSize: 14, color: '#6b7280' }}>Selamat datang kembali. Kelola semua konten website dari sini.</p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        <StatCard icon="🗓️" label="Open Trips" value={openTrips.length} sub={`${lowSlotTrips.length} hampir penuh`} onClick={() => navigate('/admin/open-trips')} color="#252525" />
        <StatCard icon="🗺️" label="Private Dest." value={privateDestinations.length} sub="destinasi tersedia" onClick={() => navigate('/admin/private')} color="#3b2d5e" />
        <StatCard icon="🏕️" label="Glamping" value={glampings.length} sub="lokasi aktif" onClick={() => navigate('/admin/glamping')} color="#1d4729" />
        <StatCard icon="🎉" label="Special Events" value={events.length} sub={`${totalTicketSlots} total slot tiket`} onClick={() => navigate('/admin/events')} color="#7c3a0e" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Recent open trips */}
        <div style={S.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#111' }}>Open Trips Terjadwal</h3>
            <button onClick={() => navigate('/admin/open-trips')} style={{ ...S.btn, background: '#f3f4f6', color: '#374151', padding: '6px 12px', fontSize: 12 }}>Kelola →</button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={S.th}>Destinasi</th>
                <th style={S.th}>Tanggal</th>
                <th style={S.th}>Slot</th>
              </tr>
            </thead>
            <tbody>
              {openTrips.map(t => (
                <tr key={t.id}>
                  <td style={S.td}>{t.emoji} {t.dest}</td>
                  <td style={S.td}>{t.start}</td>
                  <td style={S.td}>
                    <span style={{
                      ...S.badge,
                      background: t.slots <= 3 ? '#fef2f2' : '#f0fdf4',
                      color: t.slots <= 3 ? '#dc2626' : '#16a34a',
                    }}>
                      {t.slots}/{t.totalSlots}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Events */}
        <div style={S.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#111' }}>Special Events</h3>
            <button onClick={() => navigate('/admin/events')} style={{ ...S.btn, background: '#f3f4f6', color: '#374151', padding: '6px 12px', fontSize: 12 }}>Kelola →</button>
          </div>
          {events.length === 0 ? (
            <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>Belum ada event.</p>
          ) : events.map(ev => (
            <div key={ev.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20 }}>{ev.emoji}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>{ev.name}</div>
                  <div style={{ fontSize: 12, color: '#9ca3af' }}>{ev.date} – {ev.dateEnd} {ev.year}</div>
                </div>
              </div>
              <span style={{ ...S.badge, background: '#fef9c3', color: '#854d0e' }}>{ev.tag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* WhatsApp status */}
      <div style={{ ...S.card, marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 24 }}>💬</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>WhatsApp aktif</div>
            <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>{whatsapp}</div>
          </div>
        </div>
        <button onClick={() => navigate('/admin/settings')} style={{ ...S.btn, background: '#f3f4f6', color: '#374151', fontSize: 12 }}>Edit →</button>
      </div>
    </div>
  );
}
