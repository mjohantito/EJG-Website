function cheapestPerPax(tiers) {
  if (!tiers?.length) return null;
  const highest = [...tiers].sort((a, b) => b.minPax - a.minPax)[0];
  const n = Math.round(highest.price / highest.minPax);
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1).replace('.0', '')} juta`;
  return `Rp ${(n / 1_000).toFixed(0)}rb`;
}

export default function GlampCard({ g, onClick }) {
  const perPax = cheapestPerPax(g.priceTiers);
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
            {perPax ?? `Rp ${g.price}`}<small> / pax / {g.unit}</small>
          </span>
          <span className="cap">{g.cap}</span>
        </div>
      </div>
    </div>
  );
}
