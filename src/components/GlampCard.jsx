export default function GlampCard({ g, onClick }) {
  return (
    <div className="gl-card" onClick={onClick}>
      <div className={`gl-photo ph-${g.palette || 'forest'}`}>
        <span className="emoji">{g.emoji}</span>
        {g.tag && <span className="tag">{g.tag}</span>}
      </div>
      <div className="gl-body">
        <span className="loc">{g.location}</span>
        <div className="title">{g.name}</div>
        <div className="tag-line">{g.tagline}</div>
        <div className="foot">
          <span className="price">
            Rp {g.price}<small> / {g.unit}</small>
          </span>
          <span className="cap">{g.cap}</span>
        </div>
      </div>
    </div>
  );
}
