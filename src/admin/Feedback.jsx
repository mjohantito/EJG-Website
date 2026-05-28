import { useData } from '../context/DataContext';
import { S, EmptyState } from './shared';

const CATEGORY_COLORS = {
  'Glamping':        { bg: '#f0fdf4', color: '#16a34a' },
  'Open Trip':       { bg: '#eff6ff', color: '#1d4ed8' },
  'Private Trip':    { bg: '#fdf4ff', color: '#7c3aed' },
  'Pelayanan & Tim': { bg: '#fff7ed', color: '#c2410c' },
  'Lainnya':         { bg: '#f3f4f6', color: '#6b7280' },
};

function Stars({ rating }) {
  return (
    <span style={{ letterSpacing: 1, fontSize: 15 }}>
      {[1,2,3,4,5].map(s => (
        <span key={s} style={{ color: s <= rating ? '#F3D543' : '#e5e7eb' }}>★</span>
      ))}
    </span>
  );
}

export default function AdminFeedback() {
  const { feedbacks } = useData();

  const avg = feedbacks.length
    ? (feedbacks.reduce((s, f) => s + (f.rating || 0), 0) / feedbacks.length).toFixed(1)
    : null;

  const countByRating = [5,4,3,2,1].map(r => ({
    r, count: feedbacks.filter(f => f.rating === r).length,
  }));

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#111' }}>Feedback</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>{feedbacks.length} total feedback dari pelanggan</p>
      </div>

      {/* Summary cards */}
      {feedbacks.length > 0 && (
        <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
          <div style={{ ...S.card, flex: '0 0 auto', minWidth: 160, textAlign: 'center', padding: '20px 24px' }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: '#111', letterSpacing: '-0.02em' }}>{avg}</div>
            <Stars rating={Math.round(avg)} />
            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>rata-rata rating</div>
          </div>
          <div style={{ ...S.card, flex: 1, minWidth: 200, padding: '16px 20px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Distribusi Rating</div>
            {countByRating.map(({ r, count }) => (
              <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: '#374151', width: 12, flexShrink: 0 }}>{r}</span>
                <span style={{ color: '#F3D543', fontSize: 13 }}>★</span>
                <div style={{ flex: 1, height: 6, background: '#f3f4f6', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 999, background: '#252525',
                    width: feedbacks.length ? `${(count / feedbacks.length) * 100}%` : '0%',
                    transition: 'width 400ms ease',
                  }} />
                </div>
                <span style={{ fontSize: 12, color: '#9ca3af', width: 20, textAlign: 'right' }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feedback table */}
      <div style={{ ...S.card, overflowX: 'auto' }}>
        {feedbacks.length === 0 ? (
          <EmptyState icon="💬" title="Belum ada feedback" sub="Feedback dari pelanggan akan muncul di sini." />
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
            <thead>
              <tr>
                <th style={S.th}>Tanggal</th>
                <th style={S.th}>Rating</th>
                <th style={S.th}>Kategori</th>
                <th style={S.th}>Feedback</th>
                <th style={S.th}>Nama</th>
                <th style={S.th}>Kontak</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map(f => {
                const catStyle = CATEGORY_COLORS[f.category] || CATEGORY_COLORS['Lainnya'];
                return (
                  <tr key={f.id}>
                    <td style={{ ...S.td, whiteSpace: 'nowrap', fontSize: 12, color: '#6b7280' }}>
                      {f.createdAt
                        ? <>
                            <div>{new Date(f.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                            <div style={{ fontSize: 11, color: '#9ca3af' }}>{new Date(f.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</div>
                          </>
                        : '–'}
                    </td>
                    <td style={{ ...S.td, whiteSpace: 'nowrap' }}>
                      <Stars rating={f.rating} />
                    </td>
                    <td style={S.td}>
                      {f.category
                        ? <span style={{ ...S.badge, background: catStyle.bg, color: catStyle.color, whiteSpace: 'nowrap' }}>{f.category}</span>
                        : <span style={{ color: '#d1d5db', fontSize: 12 }}>–</span>}
                    </td>
                    <td style={{ ...S.td, maxWidth: 340 }}>
                      <div style={{ fontSize: 13, color: '#111', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{f.message}</div>
                    </td>
                    <td style={{ ...S.td, fontSize: 13 }}>{f.name || <span style={{ color: '#d1d5db' }}>–</span>}</td>
                    <td style={{ ...S.td, fontSize: 12, color: '#6b7280', wordBreak: 'break-all' }}>{f.email || <span style={{ color: '#d1d5db' }}>–</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
