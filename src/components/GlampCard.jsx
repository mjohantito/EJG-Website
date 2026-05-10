function cheapestTentPrice(tiers) {
  if (!tiers?.length) return null;
  const prices = tiers.flatMap(t => [t.priceWeekday, t.priceWeekend].filter(p => p && p > 0));
  if (!prices.length) return null;
  const cheapest = Math.min(...prices);
  if (cheapest >= 1_000_000) return `Rp ${(cheapest / 1_000_000).toFixed(1).replace('.0', '')} juta`;
  return `Rp ${(cheapest / 1_000).toFixed(0)}rb`;
}

export default function GlampCard({ g, onClick }) {
  const tentPrice = cheapestTentPrice(g.priceTiers);
  return (
    <div className="gl-card" onClick={onClick}>
      <div className={`gl-photo ph-${g.palette || 'forest'}`} style={g.cover ? { backgroundImage: `url(${g.cover})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
        {!g.cover && <span className="emoji">{g.emoji}</span>}
        {g.tag && <span className="tag">{g.tag}</span>}
      </div>
      <div className="gl-body">
        <span className="loc">{g.location}</span>
        <div className="title">{g.name}</div>
        <div className="tag-line">{g.tagline}</div>
        <div className="foot">
          <span className="price">
            {tentPrice
              ? <><small style={{ fontWeight: 500 }}>mulai</small> {tentPrice}<small> / {g.unit}</small></>
              : <>{`Rp ${g.price}`}<small> / {g.unit}</small></>
            }
          </span>
          <span className="cap">{g.cap}</span>
        </div>
      </div>
    </div>
  );
}
