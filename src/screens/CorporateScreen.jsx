import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WHATSAPP } from '../data';
import Footer from '../components/Footer';

const SERVICES = [
  { emoji: '🏕️', title: 'Company Outing', desc: 'Satu hari atau dua hari penuh, destinasi pilihan, semua logistik kita urus.' },
  { emoji: '🤝', title: 'Team Building', desc: 'Program aktivitas kolaboratif di alam terbuka yang bikin tim makin solid.' },
  { emoji: '🌱', title: 'CSR Trip', desc: 'Kegiatan sosial-lingkungan yang berkesan — penanaman pohon, bersih pantai, beasiswa lokal.' },
  { emoji: '🎉', title: 'Annual Gathering', desc: 'Event tahunan perusahaan dengan konsep outdoor yang berbeda dari biasanya.' },
  { emoji: '🏆', title: 'Reward Trip', desc: 'Apresiasi untuk karyawan berprestasi — dari itinerary premium hingga private tour.' },
  { emoji: '💼', title: 'Offsite & Retreat', desc: 'Kerja dari alam. Workshop, brainstorming session, dan diskusi strategis di luar kantor.' },
];

const DESTINATIONS = [
  { emoji: '🌋', name: 'Bromo', note: 'Sunrise & jeep tour' },
  { emoji: '🏞️', name: 'Tumpak Sewu', note: 'Treking & air terjun' },
  { emoji: '🔥', name: 'Ijen', note: 'Blue fire experience' },
  { emoji: '🏕️', name: 'Jurang Senggani', note: 'Glamping premium' },
  { emoji: '🌄', name: 'Batu Highland', note: 'Dome & hill retreat' },
  { emoji: '✏️', name: 'Custom Route', note: 'Sesuai kebutuhan' },
];

const TESTIMONIES = [
  {
    quote: "Tim EH! JADI GA? super responsif. Dari brief sampai eksekusi semuanya lancar. Karyawan kami seneng banget, udah minta repeat lagi tahun depan.",
    name: "Rafi A.",
    role: "HR Manager · Perusahaan Teknologi",
  },
  {
    quote: "Kami minta itinerary CSR ke Bromo sekalian outing. Dikerjain rapi, budgetnya on point, dan guide-nya profesional banget. Recommended!",
    name: "Dewi S.",
    role: "Head of People · Startup Surabaya",
  },
  {
    quote: "Baru pertama kali pakai jasa trip organizer untuk corporate, tapi prosesnya gak ribet sama sekali. Cukup WA, semua langsung jalan.",
    name: "Bimo P.",
    role: "Direktur Operasional · Perusahaan Manufaktur",
  },
];

const CLIENT_LOGOS = [
  'Perusahaan A', 'Startup B', 'PT. C Group', 'Brand D', 'Yayasan E', 'PT. F Tbk.',
];

function ServiceCard({ emoji, title, desc }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid var(--border)', borderRadius: 18,
      padding: 18, display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <span style={{ fontSize: 28 }}>{emoji}</span>
      <div style={{
        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15,
        color: 'var(--ejg-ink)', letterSpacing: '-0.01em',
      }}>
        {title}
      </div>
      <div style={{ fontSize: 13, color: 'var(--fg-3)', lineHeight: 1.55 }}>{desc}</div>
    </div>
  );
}

function TestimonyCard({ quote, name, role }) {
  return (
    <div style={{
      background: 'var(--ejg-kertas-2)', border: '1px solid var(--border)',
      borderRadius: 18, padding: 20,
    }}>
      <p style={{
        fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.65,
        fontStyle: 'italic', marginBottom: 14,
      }}>
        "{quote}"
      </p>
      <div style={{
        fontFamily: 'var(--font-display)', fontWeight: 800,
        fontSize: 13, color: 'var(--ejg-ink)',
      }}>
        {name}
      </div>
      <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 2 }}>{role}</div>
    </div>
  );
}

export default function CorporateScreen() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', wa: '', email: '' });
  const [submitted, setSubmitted] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const canSubmit = form.name.trim().length > 1 && form.wa.trim().length > 5 && form.email.trim().length > 3;

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => navigate('/thanks', { state: { kind: 'corporate', ...form } }), 300);
  };

  return (
    <>
      {/* Hero */}
      <div className="page-header">
        <span className="eyebrow">Corporate · EH! JADI GA?</span>
        <h1 style={{ marginTop: 6 }}>
          Trip kantor yang<br />
          beneran <span className="italic" style={{ fontStyle: 'italic', fontWeight: 500 }}>diinget</span><span className="q-stamp">.</span>
        </h1>
        <p className="lead">
          Dari 10 orang sampai 500 orang — kita urus dari A sampai Z.
          Kamu fokus ke momen, logistik urusan kita.
        </p>
      </div>

      {/* Why us */}
      <div style={{ padding: '4px 20px 20px' }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13,
          color: 'var(--ejg-ink)', textTransform: 'uppercase', letterSpacing: '0.1em',
          marginBottom: 14,
        }}>
          Kenapa EH! JADI GA?
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { icon: '⚡', title: 'Respons cepat', desc: 'Quote & konsultasi dalam 1×24 jam via WhatsApp.' },
            { icon: '📍', title: 'Lokal & terpercaya', desc: 'Tim asli Jawa Timur — kita tahu destinasi ini dari dalam.' },
            { icon: '🎯', title: 'All-inclusive', desc: 'Transport, akomodasi, konsumsi, guide — satu paket, satu invoice.' },
            { icon: '📊', title: 'Budget transparan', desc: 'No hidden fee. RAB lengkap sebelum deal.' },
          ].map(item => (
            <div key={item.title} style={{
              display: 'flex', gap: 14, alignItems: 'flex-start',
              background: '#fff', border: '1px solid var(--border)',
              borderRadius: 14, padding: '14px 16px',
            }}>
              <span style={{ fontSize: 22, flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
              <div>
                <div style={{
                  fontFamily: 'var(--font-display)', fontWeight: 800,
                  fontSize: 14, color: 'var(--ejg-ink)', marginBottom: 3,
                }}>
                  {item.title}
                </div>
                <div style={{ fontSize: 13, color: 'var(--fg-3)', lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Services */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13,
          color: 'var(--ejg-ink)', textTransform: 'uppercase', letterSpacing: '0.1em',
          marginBottom: 14,
        }}>
          Yang bisa kita bantu
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {SERVICES.map(s => <ServiceCard key={s.title} {...s} />)}
        </div>
      </div>

      {/* Client logos */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13,
          color: 'var(--ejg-ink)', textTransform: 'uppercase', letterSpacing: '0.1em',
          marginBottom: 14,
        }}>
          Dipercaya oleh
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {CLIENT_LOGOS.map(name => (
            <div key={name} style={{
              background: 'var(--ejg-kertas-2)', border: '1px solid var(--border)',
              borderRadius: 12, padding: '12px 8px', textAlign: 'center',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11,
              color: 'var(--fg-3)', letterSpacing: '0.02em',
            }}>
              {name}
            </div>
          ))}
        </div>
      </div>

      {/* Gallery */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13,
          color: 'var(--ejg-ink)', textTransform: 'uppercase', letterSpacing: '0.1em',
          marginBottom: 14,
        }}>
          Galeri corporate trip
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { palette: 'ph-ink',    label: 'Bromo Company Outing' },
            { palette: 'ph-forest', label: 'Team Building Senggani' },
            { palette: 'ph-dusk',   label: 'Ijen Night Trek' },
            { palette: 'ph-warm',   label: 'Gathering Malang' },
          ].map(item => (
            <div
              key={item.label}
              className={item.palette}
              style={{
                borderRadius: 14, aspectRatio: '4/3',
                display: 'flex', alignItems: 'flex-end', padding: 10, overflow: 'hidden',
              }}
            >
              <span style={{
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 10,
                color: 'rgba(255,255,255,0.8)', letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Destinations */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13,
          color: 'var(--ejg-ink)', textTransform: 'uppercase', letterSpacing: '0.1em',
          marginBottom: 14,
        }}>
          Destinasi corporate
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {DESTINATIONS.map(d => (
            <div key={d.name} style={{
              background: '#fff', border: '1px solid var(--border)',
              borderRadius: 14, padding: 12, textAlign: 'center',
            }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{d.emoji}</div>
              <div style={{
                fontFamily: 'var(--font-display)', fontWeight: 800,
                fontSize: 13, color: 'var(--ejg-ink)', marginBottom: 3,
              }}>
                {d.name}
              </div>
              <div style={{ fontSize: 11, color: 'var(--fg-3)', lineHeight: 1.4 }}>{d.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonies */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13,
          color: 'var(--ejg-ink)', textTransform: 'uppercase', letterSpacing: '0.1em',
          marginBottom: 14,
        }}>
          Kata mereka
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {TESTIMONIES.map(t => <TestimonyCard key={t.name} {...t} />)}
        </div>
      </div>

      {/* Inquiry form */}
      <div style={{ padding: '0 20px 8px' }}>
        <div style={{
          background: 'var(--ejg-ink)', borderRadius: 24, padding: 24, color: '#F3D543',
        }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 11,
            letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.75,
            marginBottom: 8,
          }}>
            Mulai sekarang
          </div>
          <h3 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22,
            lineHeight: 1.1, letterSpacing: '-0.015em', color: '#fff', marginBottom: 6,
          }}>
            Tertarik? Tinggalkan kontakmu.
          </h3>
          <p style={{ fontSize: 13, lineHeight: 1.55, color: 'rgba(255,255,255,0.75)', marginBottom: 18 }}>
            Isi nama, WA, dan email — tim kami follow up dalam 1×24 jam untuk diskusi kebutuhan kamu.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="Nama lengkap"
              style={{
                background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.25)',
                borderRadius: 12, padding: '12px 14px', color: '#fff',
                fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none',
                width: '100%',
              }}
            />
            <input
              value={form.wa}
              onChange={e => set('wa', e.target.value)}
              placeholder="No. WhatsApp (+62 812…)"
              inputMode="tel"
              style={{
                background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.25)',
                borderRadius: 12, padding: '12px 14px', color: '#fff',
                fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none',
                width: '100%',
              }}
            />
            <input
              type="email"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              placeholder="Email"
              style={{
                background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.25)',
                borderRadius: 12, padding: '12px 14px', color: '#fff',
                fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none',
                width: '100%',
              }}
            />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit || submitted}
              style={{
                marginTop: 4,
                background: canSubmit ? 'var(--ejg-matahari)' : 'rgba(255,255,255,0.15)',
                color: canSubmit ? 'var(--ejg-ink)' : 'rgba(255,255,255,0.4)',
                border: 'none', borderRadius: 14, padding: '14px 20px',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15,
                cursor: canSubmit ? 'pointer' : 'default',
                transition: 'all 180ms ease',
                width: '100%',
              }}
            >
              {submitted ? 'Terkirim ✓' : 'Hubungi kami →'}
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: 14, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
            atau{' '}
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noreferrer"
              style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-display)', fontWeight: 700, textDecoration: 'underline' }}
            >
              chat langsung di WA
            </a>
          </div>
        </div>
      </div>

      <Footer onNav={(name) => navigate(`/${name === 'home' ? '' : name}`)} />
    </>
  );
}
