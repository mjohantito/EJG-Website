export default function OpenTripCard({ trip, onClick }) {
  const low = trip.slots <= 3;
  const pct = Math.round(((trip.totalSlots - trip.slots) / trip.totalSlots) * 100);

  return (
    <div className="ot-card" onClick={onClick}>
      <div className={`ot-datestamp ph-${trip.palette || 'ink'}`} style={trip.cover ? { backgroundImage: `url(${trip.cover})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
        {!trip.cover && <><span className="m">{trip.month}</span><span className="d">{trip.day}</span><span className="dur">{trip.duration}</span></>}
        {trip.cover && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', borderRadius: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', padding: '10px 8px 8px' }}><span style={{ fontSize: 11, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1.2 }}>{trip.month} {trip.day}</span><span style={{ fontSize: 10, color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-display)' }}>{trip.duration}</span></div>}
        {trip.tag && <span className="ot-tag">{trip.tag}</span>}
      </div>
      <div className="ot-body">
        <span className="region">{trip.region}</span>
        <div className="title">{trip.dest}</div>
        <div className="meta">{trip.highlights.slice(0, 2).join(' · ')}</div>
        <div className="slots">
          <div className={`bar${low ? ' low' : ''}`}>
            <span style={{ width: `${Math.max(8, pct)}%` }} />
          </div>
          <span className={`txt${low ? ' low' : ''}`}>{trip.slots} slot left</span>
        </div>
        <div className="foot">
          <span className="price">
            Rp {trip.price}<small> / orang</small>
          </span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: 'var(--ejg-ink)' }}>
            Detail →
          </span>
        </div>
      </div>
    </div>
  );
}
