export default function OpenTripCard({ trip, onClick }) {
  const low = trip.slots <= 3;
  const pct = Math.round(((trip.totalSlots - trip.slots) / trip.totalSlots) * 100);

  return (
    <div className="ot-card" onClick={onClick}>
      <div className={`ot-datestamp ph-${trip.palette || 'ink'}`}>
        <span className="m">{trip.month}</span>
        <span className="d">{trip.day}</span>
        <span className="dur">{trip.duration}</span>
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
