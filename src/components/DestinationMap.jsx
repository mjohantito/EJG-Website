import { useMemo } from 'react';

/* Destination pins with approximate geographic positions on a 580×270 SVG
   representing East Java (Jawa Timur). */
const PINS = [
  { id: 'bromo',   label: 'Bromo',        x: 385, y: 152, match: /bromo/i },
  { id: 'ijen',    label: 'Ijen',          x: 548, y: 178, match: /ijen/i },
  { id: 'sewu',    label: 'Tumpak Sewu',  x: 348, y: 200, match: /sewu|tumpak/i },
  { id: 'kelud',   label: 'Kelud',        x: 258, y: 156, match: /kelud/i },
  { id: 'semeru',  label: 'Semeru',        x: 365, y: 185, match: /semeru/i },
  { id: 'malang',  label: 'Malang',        x: 312, y: 168, match: /malang/i },
  { id: 'arjuno',  label: 'Arjuno',        x: 300, y: 144, match: /arjuno|welirang/i },
  { id: 'batu',    label: 'Batu',          x: 295, y: 158, match: /\bbatu\b/i },
  { id: 'pacitan', label: 'Pacitan',       x: 112, y: 208, match: /pacitan/i },
  { id: 'ranu',    label: 'Ranu Regulo',   x: 340, y: 182, match: /ranu/i },
  { id: 'meru',    label: 'Meru Betiri',   x: 435, y: 198, match: /meru betiri/i },
  { id: 'jember',  label: 'Jember',        x: 432, y: 185, match: /jember/i },
];

export function findPinId(destName) {
  if (!destName) return null;
  for (const pin of PINS) {
    if (pin.match.test(destName)) return pin.id;
  }
  return null;
}

/* Simplified East Java outline (SVG path, viewBox 580×270) */
const JAVA_PATH = `M 14,50 C 40,40 70,35 100,30 C 130,26 165,24 200,22
  C 228,22 255,26 280,28 C 305,30 318,30 330,32
  C 342,34 358,28 388,26 C 415,24 445,26 472,32
  C 498,38 520,48 538,70 C 550,86 558,106 562,128
  C 565,148 564,168 558,186 C 552,202 540,212 522,220
  C 508,228 490,232 468,230 C 445,228 420,230 395,232
  C 368,234 340,234 312,232 C 286,230 260,229 235,232
  C 212,234 188,238 162,242 C 138,246 112,250 88,252
  C 66,254 44,252 26,246 C 12,240 4,230 2,216
  C 0,202 2,184 4,166 C 6,150 8,132 10,114
  C 12,90 12,68 14,50 Z`;

const MADURA_PATH = `M 310,8 L 355,2 L 400,0 L 445,3 L 482,9
  L 510,18 L 508,28 L 480,22 L 445,16 L 400,12 L 355,14 L 315,18 Z`;

export default function DestinationMap({ trips, selected, onSelect }) {
  const tripsByPin = useMemo(() => {
    const map = {};
    for (const t of trips) {
      const id = findPinId(t.dest);
      if (id) {
        map[id] = (map[id] || 0) + 1;
      }
    }
    return map;
  }, [trips]);

  const activePins = PINS.filter(p => (tripsByPin[p.id] || 0) > 0);
  const selectedPin = PINS.find(p => p.id === selected);

  return (
    <div style={{ margin: '0 20px 4px', borderRadius: 16, overflow: 'hidden', border: '1.5px solid var(--border)', position: 'relative', background: '#c8e3f2' }}>
      <svg viewBox="0 0 580 270" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', display: 'block' }}>
        {/* Ocean */}
        <rect width="580" height="270" fill="#c8e3f2" />

        {/* Subtle wave texture */}
        <text x="60" y="255" fill="#b0cfe8" fontSize="7" fontFamily="system-ui" letterSpacing="4" fontWeight="500">~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~</text>

        {/* Madura island */}
        <path d={MADURA_PATH} fill="#ddd6c8" stroke="#c0b8a8" strokeWidth="0.8" />
        <text x="415" y="16" textAnchor="middle" fill="#a09888" fontSize="7" fontFamily="system-ui" fontWeight="600">Madura</text>

        {/* Main East Java island */}
        <path d={JAVA_PATH} fill="#ddd6c8" stroke="#c0b8a8" strokeWidth="1" />

        {/* Surabaya reference city */}
        <circle cx="294" cy="74" r="3" fill="#b0a898" />
        <text x="294" y="88" textAnchor="middle" fill="#a09888" fontSize="7.5" fontFamily="system-ui" fontWeight="600">Surabaya</text>

        {/* Map label */}
        <text x="22" y="264" fill="#90c0dc" fontSize="7.5" fontWeight="700" fontFamily="system-ui" letterSpacing="2.5">JAWA TIMUR</text>

        {/* Destination pins */}
        {activePins.map(pin => {
          const count = tripsByPin[pin.id];
          const active = selected === pin.id;
          return (
            <g key={pin.id} onClick={() => onSelect(active ? null : pin.id)} style={{ cursor: 'pointer' }}>
              {/* Selection glow ring */}
              {active && (
                <circle cx={pin.x} cy={pin.y} r={22}
                  fill="rgba(243,213,67,0.25)" stroke="#F3D543" strokeWidth="2" />
              )}
              {/* Pin body */}
              <circle cx={pin.x} cy={pin.y} r={13}
                fill={active ? '#F3D543' : '#252525'}
                style={{ filter: active ? 'none' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
              />
              {/* Trip count */}
              <text x={pin.x} y={pin.y + 4.5} textAnchor="middle"
                fill={active ? '#252525' : '#F3D543'}
                fontSize="10" fontWeight="800" fontFamily="system-ui" style={{ pointerEvents: 'none' }}>
                {count}
              </text>
              {/* Label */}
              <text x={pin.x} y={pin.y + 27} textAnchor="middle"
                fill={active ? '#252525' : '#4a4035'}
                fontSize="8.5" fontWeight={active ? 800 : 600} fontFamily="system-ui" style={{ pointerEvents: 'none' }}>
                {pin.label}
              </text>
              {/* Large invisible hit area */}
              <circle cx={pin.x} cy={pin.y} r={26} fill="transparent" />
            </g>
          );
        })}
      </svg>

      {/* Active filter badge */}
      {selectedPin && (
        <div
          onClick={() => onSelect(null)}
          style={{
            position: 'absolute', top: 10, right: 10,
            background: 'var(--ejg-ink)', color: 'var(--ejg-matahari)',
            borderRadius: 20, padding: '5px 14px',
            fontSize: 11, fontWeight: 800, cursor: 'pointer',
            fontFamily: 'var(--font-display)', letterSpacing: '0.02em',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}
        >
          {selectedPin.label} ×
        </div>
      )}

      {/* Hint text when no selection */}
      {!selectedPin && activePins.length > 0 && (
        <div style={{
          position: 'absolute', bottom: 10, right: 12,
          fontSize: 10, color: '#7ab8d8', fontFamily: 'var(--font-display)', fontWeight: 600,
        }}>
          Tap destinasi untuk filter
        </div>
      )}
    </div>
  );
}
