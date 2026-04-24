import { useState } from 'react';

const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS || 'ejgadmin2025';

export default function AdminLogin({ onAuth }) {
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (pass === ADMIN_PASS) {
      sessionStorage.setItem('ejg_admin_session', '1');
      onAuth();
    } else {
      setError(true);
      setPass('');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#f4f5f7',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: '#fff', borderRadius: 20, padding: '40px 44px',
        width: 400, boxShadow: '0 8px 40px rgba(0,0,0,0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <img src="/ejg-mark-primary.svg" alt="" style={{ width: 36 }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, color: '#1a1a2e', letterSpacing: '-0.02em' }}>EH! JADI GA?</div>
            <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 1 }}>Content Management System</div>
          </div>
        </div>

        <form onSubmit={submit}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
            Password admin
          </label>
          <div style={{ position: 'relative', marginBottom: 8 }}>
            <input
              type={show ? 'text' : 'password'}
              value={pass}
              onChange={e => { setPass(e.target.value); setError(false); }}
              placeholder="Masukkan password…"
              autoFocus
              style={{
                width: '100%', padding: '11px 44px 11px 14px',
                borderRadius: 10, border: `1.5px solid ${error ? '#ef4444' : '#d1d5db'}`,
                fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
              }}
            />
            <button
              type="button"
              onClick={() => setShow(s => !s)}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 12 }}
            >
              {show ? 'Sembunyikan' : 'Tampilkan'}
            </button>
          </div>

          {error && (
            <p style={{ margin: '0 0 12px', fontSize: 13, color: '#ef4444' }}>Password salah. Coba lagi.</p>
          )}

          <button
            type="submit"
            style={{
              width: '100%', padding: '12px', borderRadius: 10, border: 'none',
              background: '#252525', color: '#F3D543', fontSize: 14, fontWeight: 700,
              cursor: 'pointer', marginTop: 8, fontFamily: 'inherit',
            }}
          >
            Masuk ke CMS →
          </button>
        </form>

        <p style={{ marginTop: 24, fontSize: 12, color: '#d1d5db', textAlign: 'center', lineHeight: 1.5 }}>
          Password diatur via <code style={{ background: '#f3f4f6', padding: '1px 5px', borderRadius: 4 }}>VITE_ADMIN_PASS</code> di <code style={{ background: '#f3f4f6', padding: '1px 5px', borderRadius: 4 }}>.env.local</code>
        </p>
      </div>
    </div>
  );
}
