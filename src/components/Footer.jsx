import { WHATSAPP } from '../data';

export default function Footer({ onNav }) {
  return (
    <div className="site-foot">
      <div className="brand">
        <img src="/ejg-mark-primary.svg" alt="" /> EH! JADI GA?
      </div>
      <p style={{ fontSize: 13, opacity: 0.7, lineHeight: 1.5, maxWidth: 300 }}>
        Trip & glamping buat yang pengen jalan tanpa harus mikirin logistik.
      </p>
      <div className="row">
        <div>
          <h5>Jelajah</h5>
          <ul>
            <li><a onClick={() => onNav('trips')}>Trips</a></li>
            <li><a onClick={() => onNav('glamping')}>Glamping</a></li>
            <li><a onClick={() => onNav('inquiry')}>Inquiry</a></li>
            <li><a onClick={() => onNav('about')}>Tentang</a></li>
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
            <li><a>@ehjadiga</a></li>
            <li><a>halo@ehjadiga.id</a></li>
            <li><a>Malang, Jawa Timur</a></li>
          </ul>
        </div>
      </div>
      <div className="fine">
        © {new Date().getFullYear()} EH! JADI GA? · Made with koffie &amp; anxiety · Semua destinasi bisa berubah sesuai cuaca.
      </div>
    </div>
  );
}
