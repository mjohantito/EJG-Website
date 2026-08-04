import { useNavigate } from 'react-router-dom';

/* ── Deterministic decoration data (Math.sin avoids random re-renders) ── */
const h = (n) => (((Math.sin(n) * 43758.5453) % 1) + 1) / 2;

const SNOW = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x:       h(i * 3.1)  * 100,
  size:    h(i * 7.3)  * 7   + 3,
  delay:   h(i * 13.7) * 14,
  dur:     h(i * 5.9)  * 9   + 10,
  drift:   (h(i * 11.1) - 0.5) * 80,
  opacity: h(i * 17.3) * 0.45 + 0.25,
}));

const STARS = Array.from({ length: 90 }, (_, i) => ({
  id: i,
  x:     h(i * 31.1) * 100,
  y:     h(i * 19.3) * 65,
  r:     h(i * 13.7) * 1.6 + 0.6,
  delay: h(i * 7.1)  * 5,
  dur:   h(i * 23.9) * 3   + 2,
}));

const ORNAMENTS = [
  { x: '3%',  len: 80,  r: 15, fill: '#b71c1c', shine: '#ef9a9a', cap: '#888', delay: '0s',   dur: '3.4s' },
  { x: '14%', len: 58,  r: 12, fill: '#1b5e20', shine: '#a5d6a7', cap: '#777', delay: '0.6s', dur: '4.2s' },
  { x: '26%', len: 108, r: 18, fill: '#c8a800', shine: '#fff9c4', cap: '#999', delay: '0.2s', dur: '3.7s' },
  { x: '40%', len: 68,  r: 13, fill: '#7b0000', shine: '#ef9a9a', cap: '#888', delay: '1.0s', dur: '4.5s' },
  { x: '55%', len: 92,  r: 16, fill: '#c8a800', shine: '#fff9c4', cap: '#999', delay: '0.4s', dur: '3.9s' },
  { x: '67%', len: 62,  r: 11, fill: '#1a4a1a', shine: '#a5d6a7', cap: '#777', delay: '0.8s', dur: '3.5s' },
  { x: '79%', len: 98,  r: 17, fill: '#b71c1c', shine: '#ffcdd2', cap: '#888', delay: '0.1s', dur: '4.4s' },
  { x: '91%', len: 52,  r: 13, fill: '#c8a800', shine: '#fff9c4', cap: '#999', delay: '0.7s', dur: '3.8s' },
];

const LIGHTS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  color: ['#ff3030', '#f3d543', '#3ddc84', '#ff3030', '#fff', '#f3d543'][i % 6],
  delay: i * 0.18,
}));

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&display=swap');

  @keyframes sway {
    from { transform: rotate(-6deg); }
    to   { transform: rotate(6deg);  }
  }
  @keyframes fall {
    0%   { transform: translateY(-20px) translateX(0);    opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 1; }
    100% { transform: translateY(105vh) translateX(var(--drift)); opacity: 0; }
  }
  @keyframes twinkle {
    0%, 100% { opacity: 0.15; transform: scale(0.7); }
    50%       { opacity: 1;    transform: scale(1.2); }
  }
  @keyframes glow {
    0%, 100% { opacity: 0.4; }
    50%       { opacity: 1;   }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position:  400px 0; }
  }
  @keyframes breathe {
    0%, 100% { letter-spacing: 0.08em; opacity: 0.85; }
    50%       { letter-spacing: 0.14em; opacity: 1;    }
  }
  @keyframes pulse-ring {
    0%   { transform: scale(0.9); opacity: 0.7; }
    100% { transform: scale(1.4); opacity: 0;   }
  }
`;

function Ornament({ x, len, r, fill, shine, cap, delay, dur }) {
  const cx = r + 4;
  const cy = len + r;
  const totalH = len + r * 2 + 8;
  return (
    <div style={{
      position: 'absolute', top: 0, left: x,
      transformOrigin: 'top center',
      animation: `sway ${dur} ease-in-out ${delay} infinite alternate`,
    }}>
      <svg width={cx * 2} height={totalH} overflow="visible" style={{ display: 'block' }}>
        {/* String */}
        <line x1={cx} y1={0} x2={cx} y2={len - r * 0.3}
          stroke="rgba(255,255,255,0.28)" strokeWidth="1.2" />
        {/* Cap */}
        <rect x={cx - r * 0.22} y={len - r * 0.5} width={r * 0.44} height={r * 0.6} rx="2" fill={cap} />
        <rect x={cx - r * 0.36} y={len - r * 0.15} width={r * 0.72} height={r * 0.3} rx="2" fill={cap} />
        {/* Bauble body */}
        <circle cx={cx} cy={cy} r={r} fill={fill} />
        {/* Shine highlight */}
        <ellipse cx={cx - r * 0.28} cy={cy - r * 0.3} rx={r * 0.22} ry={r * 0.15} fill={shine} opacity="0.7" />
        <ellipse cx={cx - r * 0.18} cy={cy - r * 0.42} rx={r * 0.08} ry={r * 0.06} fill="#fff" opacity="0.6" />
      </svg>
    </div>
  );
}

export default function JoyToTheWoodsScreen() {
  const navigate = useNavigate();

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'radial-gradient(ellipse at 50% 30%, #0d2b0d 0%, #04100a 55%, #010805 100%)',
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'sans-serif',
    }}>
      <style>{CSS}</style>

      {/* Stars */}
      {STARS.map(s => (
        <div key={s.id} style={{
          position: 'absolute',
          left: `${s.x}%`, top: `${s.y}%`,
          width: s.r * 2, height: s.r * 2,
          borderRadius: '50%',
          background: '#fff',
          animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
        }} />
      ))}

      {/* Fairy lights string */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 28, overflow: 'visible' }}>
        {/* String */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 28 }} preserveAspectRatio="none">
          <path d="M0,8 Q50,20 100,10 Q150,2 200,14 Q250,22 300,8 Q350,0 400,12 Q450,22 500,8 Q600,0 700,14 Q800,22 900,8 Q1000,0 1100,12 Q1200,22 1300,8 Q1400,0 1500,12"
            fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        </svg>
        {LIGHTS.map((l, i) => (
          <div key={l.id} style={{
            position: 'absolute',
            left: `${(i / (LIGHTS.length - 1)) * 96 + 2}%`,
            top: 8 + Math.sin(i * 0.9) * 6,
            width: 8, height: 12,
            borderRadius: '50% 50% 60% 60%',
            background: l.color,
            boxShadow: `0 0 6px 2px ${l.color}88, 0 0 12px 3px ${l.color}44`,
            animation: `glow ${1.8 + h(i * 5.3) * 1.4}s ease-in-out ${l.delay}s infinite`,
          }} />
        ))}
      </div>

      {/* Hanging ornaments */}
      {ORNAMENTS.map((o, i) => <Ornament key={i} {...o} />)}

      {/* Falling snow */}
      {SNOW.map(s => (
        <div key={s.id} style={{
          position: 'absolute',
          left: `${s.x}%`, top: -12,
          width: s.size, height: s.size,
          borderRadius: '50%',
          background: '#fff',
          opacity: s.opacity,
          '--drift': `${s.drift}px`,
          animation: `fall ${s.dur}s linear ${s.delay}s infinite`,
          pointerEvents: 'none',
        }} />
      ))}

      {/* Main content */}
      <div style={{
        position: 'relative', zIndex: 10,
        textAlign: 'center', padding: '0 24px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0,
      }}>
        {/* Holly / star accent */}
        <div style={{ fontSize: 36, marginBottom: 12, filter: 'drop-shadow(0 0 12px #c8a80088)' }}>✦</div>

        {/* JOY TO THE */}
        <div style={{
          fontFamily: '"Cinzel Decorative", serif',
          fontWeight: 400,
          fontSize: 'clamp(14px, 3.8vw, 22px)',
          letterSpacing: '0.38em',
          color: 'rgba(255,255,255,0.72)',
          textTransform: 'uppercase',
          marginBottom: 4,
        }}>
          Joy to the
        </div>

        {/* WOODS */}
        <div style={{
          fontFamily: '"Cinzel Decorative", serif',
          fontWeight: 900,
          fontSize: 'clamp(52px, 14vw, 108px)',
          letterSpacing: '-0.01em',
          lineHeight: 1,
          background: 'linear-gradient(160deg, #f9e97e 0%, #c8a800 38%, #f3d543 60%, #fff9c4 80%, #c8a800 100%)',
          backgroundSize: '400px 100%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation: 'shimmer 4s linear infinite',
          filter: 'drop-shadow(0 0 24px rgba(200,168,0,0.45))',
          marginBottom: 20,
        }}>
          WOODS
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 40, height: 1, background: 'linear-gradient(to right, transparent, rgba(200,168,0,0.6))' }} />
          <div style={{ fontSize: 14, color: 'rgba(200,168,0,0.8)' }}>✦</div>
          <div style={{ width: 40, height: 1, background: 'linear-gradient(to left, transparent, rgba(200,168,0,0.6))' }} />
        </div>

        {/* COMING SOON */}
        <div style={{
          fontFamily: '"Cinzel Decorative", serif',
          fontWeight: 400,
          fontSize: 'clamp(11px, 2.8vw, 16px)',
          letterSpacing: '0.55em',
          color: 'rgba(255,255,255,0.5)',
          textTransform: 'uppercase',
          animation: 'breathe 4s ease-in-out infinite',
        }}>
          Coming Soon
        </div>

        {/* Pulse ring below */}
        <div style={{ position: 'relative', width: 6, height: 6, marginTop: 24 }}>
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: '1.5px solid rgba(200,168,0,0.6)',
            animation: 'pulse-ring 2.4s ease-out 0s infinite',
          }} />
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: '1.5px solid rgba(200,168,0,0.4)',
            animation: 'pulse-ring 2.4s ease-out 1.2s infinite',
          }} />
          <div style={{ position: 'absolute', inset: 1, borderRadius: '50%', background: 'rgba(200,168,0,0.8)' }} />
        </div>
      </div>

      {/* Pine tree silhouette at bottom */}
      <svg
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%', height: 'clamp(100px, 18vw, 220px)', display: 'block' }}
      >
        <defs>
          <linearGradient id="treeFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#071407" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#010805" stopOpacity="1" />
          </linearGradient>
        </defs>
        {/* Back row (lighter) */}
        <g fill="#091a09" opacity="0.8">
          <polygon points="80,120 120,20 160,120" />
          <polygon points="90,130 120,50 150,130" />
          <polygon points="230,130 280,10 330,130" />
          <polygon points="245,150 280,55 315,150" />
          <polygon points="420,140 460,35 500,140" />
          <polygon points="435,155 460,65 485,155" />
          <polygon points="600,125 645,15 690,125" />
          <polygon points="614,145 645,50 676,145" />
          <polygon points="780,135 820,25 860,135" />
          <polygon points="793,155 820,58 847,155" />
          <polygon points="950,120 995,10 1040,120" />
          <polygon points="963,145 995,42 1027,145" />
          <polygon points="1130,130 1170,20 1210,130" />
          <polygon points="1143,152 1170,52 1197,152" />
          <polygon points="1300,125 1345,15 1390,125" />
          <polygon points="1313,148 1345,48 1377,148" />
        </g>
        {/* Front row (darker) */}
        <g fill="#040e04">
          <polygon points="0,190 55,60 110,190" />
          <polygon points="10,220 55,95 100,220" />
          <polygon points="160,185 225,45 290,185" />
          <polygon points="172,220 225,82 278,220" />
          <polygon points="350,195 405,55 460,195" />
          <polygon points="362,220 405,90 448,220" />
          <polygon points="530,188 588,48 646,188" />
          <polygon points="543,220 588,82 633,220" />
          <polygon points="710,192 768,52 826,192" />
          <polygon points="722,220 768,87 814,220" />
          <polygon points="880,186 940,42 1000,186" />
          <polygon points="893,220 940,78 987,220" />
          <polygon points="1060,190 1118,55 1176,190" />
          <polygon points="1072,220 1118,90 1164,220" />
          <polygon points="1240,188 1300,48 1360,188" />
          <polygon points="1252,220 1300,84 1348,220" />
          <polygon points="1400,195 1440,70 1480,195" />
          <polygon points="1410,220 1440,105 1470,220" />
        </g>
        {/* Ground fill */}
        <rect x="0" y="185" width="1440" height="35" fill="#040e04" />
        <rect x="0" y="200" width="1440" height="20" fill={`url(#treeFade)`} />
      </svg>
    </div>
  );
}
