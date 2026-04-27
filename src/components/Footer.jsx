import { WHATSAPP } from '../data';

export default function Footer({ onNav }) {
  return (
    <div className="site-foot">
      <div className="brand">
        <img src="/ejg-mark-primary.svg" alt="" /> EH! JADI GA?
      </div>
      <p style={{ fontSize: 13, opacity: 0.7, lineHeight: 1.5, maxWidth: 300 }}>
        Buat jiwa muda yang lebih milih jalan daripada diem.
      </p>
      <div className="row">
        <div>
          <h5>Jelajah</h5>
          <ul>
            <li><a onClick={() => onNav('trips')}>Trips</a></li>
            <li><a onClick={() => onNav('glamping')}>Glamping</a></li>
            <li><a onClick={() => onNav('corporate')}>Corporate</a></li>
            <li><a onClick={() => onNav('events')}>Special Event</a></li>
            <li><a onClick={() => onNav('about')}>Tentang Kami</a></li>
            <li><a onClick={() => onNav('inquiry')}>Inquiry</a></li>
            <li><a href="/terms" style={{ color: 'var(--ejg-kertas)', textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14 }}>Syarat & Ketentuan</a></li>
          </ul>
        </div>
        <div>
          <h5>Kontak</h5>
          <ul>
            <li>
              <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/ehjadiga" target="_blank" rel="noreferrer">
                @ehjadiga
              </a>
            </li>
            <li>
              <a href="mailto:halo@ehjadiga.com">halo@ehjadiga.com</a>
            </li>
            <li>Surabaya, Jawa Timur</li>
          </ul>
        </div>
      </div>
      <div className="fine">
        © {new Date().getFullYear()} EH! JADI GA? · Made with koffie &amp; anxiety.
      </div>
    </div>
  );
}
