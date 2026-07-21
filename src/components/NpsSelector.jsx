export default function NpsSelector({ value, onChange }) {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(11, 1fr)', gap: 4 }}>
        {Array.from({ length: 11 }, (_, i) => {
          const selected = value === i;
          const isDetractor = i <= 6;
          const isPassive   = i === 7 || i === 8;
          const zoneColor   = isDetractor ? '#dc2626' : isPassive ? '#d97706' : '#16a34a';
          const zoneBg      = isDetractor ? '#fef2f2' : isPassive ? '#fffbeb' : '#f0fdf4';
          return (
            <button
              key={i}
              type="button"
              onClick={() => onChange(selected ? null : i)}
              style={{
                height: 40, borderRadius: 10, border: 'none',
                background: selected ? zoneColor : zoneBg,
                color: selected ? '#fff' : zoneColor,
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13,
                cursor: 'pointer', transition: 'all 100ms ease',
                outline: selected ? `2px solid ${zoneColor}` : 'none',
                outlineOffset: 1,
              }}
            >
              {i}
            </button>
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: 'var(--fg-3)' }}>
        <span>0 = Tidak mungkin</span>
        <span>10 = Pasti rekomendasiin!</span>
      </div>
      {value !== null && value !== undefined && (
        <div style={{ marginTop: 6, fontSize: 12, fontFamily: 'var(--font-display)', fontWeight: 700,
          color: value <= 6 ? '#dc2626' : value <= 8 ? '#d97706' : '#16a34a' }}>
          {value <= 6 ? 'Detractor — kita perlu banyak improve nih'
            : value <= 8 ? 'Passive — masih ada ruang untuk jadi lebih baik'
            : 'Promoter — makasih udah percaya sama EJG!'}
        </div>
      )}
    </div>
  );
}
