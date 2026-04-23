import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

function Section({ title, children }) {
  return (
    <div style={{ padding: '0 20px', marginBottom: 24 }}>
      <h3 style={{
        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16,
        color: 'var(--ejg-ink)', marginBottom: 10, letterSpacing: '-0.01em',
      }}>
        {title}
      </h3>
      <div style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.7 }}>
        {children}
      </div>
    </div>
  );
}

function Li({ children }) {
  return (
    <li style={{ marginBottom: 6, paddingLeft: 4 }}>
      {children}
    </li>
  );
}

export default function TermsScreen() {
  const navigate = useNavigate();

  return (
    <>
      <div className="page-header">
        <span className="eyebrow">Legal · EH! JADI GA?</span>
        <h1 style={{ marginTop: 6 }}>
          Syarat &amp; <span className="italic" style={{ fontStyle: 'italic', fontWeight: 500 }}>Ketentuan</span><span className="q-stamp">.</span>
        </h1>
        <p className="lead">Berlaku untuk semua layanan EH! JADI GA? — open trip, private trip, glamping, dan corporate.</p>
      </div>

      <div style={{ padding: '0 20px 12px' }}>
        <div style={{
          background: 'var(--ejg-kertas-2)', border: '1px solid var(--border)',
          borderRadius: 14, padding: 14, fontSize: 13, color: 'var(--fg-3)', lineHeight: 1.6,
        }}>
          Terakhir diperbarui: Januari 2025
        </div>
      </div>

      <Section title="1. Pendaftaran & Konfirmasi">
        <p>Pemesanan dianggap sah setelah peserta menerima konfirmasi resmi dari tim EH! JADI GA? via WhatsApp atau email. Slot tidak dijamin sebelum konfirmasi diterima.</p>
      </Section>

      <Section title="2. Pembayaran">
        <ul style={{ paddingLeft: 18 }}>
          <Li>DP sebesar 30% dari total biaya wajib dibayarkan untuk mengamankan slot.</Li>
          <Li>Pelunasan dilakukan paling lambat H-7 keberangkatan.</Li>
          <Li>Pembayaran dapat dilakukan via transfer bank atau metode yang disepakati.</Li>
          <Li>Bukti pembayaran wajib dikirimkan ke nomor WhatsApp kami.</Li>
        </ul>
      </Section>

      <Section title="3. Pembatalan oleh Peserta">
        <ul style={{ paddingLeft: 18 }}>
          <Li><strong>H-14 atau lebih:</strong> Refund penuh (dikurangi biaya transfer).</Li>
          <Li><strong>H-7 hingga H-13:</strong> Refund 50% dari DP yang sudah dibayarkan.</Li>
          <Li><strong>H-1 hingga H-6:</strong> DP tidak dapat direfund.</Li>
          <Li><strong>Tidak hadir tanpa pemberitahuan:</strong> Tidak ada refund.</Li>
        </ul>
        <p style={{ marginTop: 10 }}>Penggantian peserta ke orang lain diperbolehkan dengan pemberitahuan minimal 48 jam sebelum keberangkatan.</p>
      </Section>

      <Section title="4. Pembatalan oleh EH! JADI GA?">
        <p>Kami berhak membatalkan atau menunda trip karena kondisi cuaca ekstrem, force majeure, atau jumlah peserta minimum tidak terpenuhi. Dalam hal ini, peserta berhak atas refund penuh atau pemindahan ke jadwal lain.</p>
      </Section>

      <Section title="5. Kesehatan & Keselamatan">
        <ul style={{ paddingLeft: 18 }}>
          <Li>Peserta wajib dalam kondisi fisik yang sehat saat mengikuti trip.</Li>
          <Li>Informasikan kondisi medis atau alergi yang relevan sebelum keberangkatan.</Li>
          <Li>EH! JADI GA? tidak bertanggung jawab atas kondisi kesehatan yang tidak diberitahukan sebelumnya.</Li>
          <Li>Peserta disarankan memiliki asuransi perjalanan pribadi.</Li>
        </ul>
      </Section>

      <Section title="6. Itinerary & Perubahan">
        <p>Itinerary dapat berubah sewaktu-waktu berdasarkan kondisi cuaca, keamanan, atau faktor eksternal lain di luar kendali kami. Kami akan memberitahu perubahan signifikan sesegera mungkin via WhatsApp.</p>
      </Section>

      <Section title="7. Barang Bawaan & Kehilangan">
        <p>EH! JADI GA? tidak bertanggung jawab atas kehilangan, kerusakan, atau pencurian barang bawaan peserta selama trip berlangsung. Peserta bertanggung jawab penuh atas barang pribadi masing-masing.</p>
      </Section>

      <Section title="8. Dokumentasi & Konten">
        <p>Foto/video yang diambil selama trip oleh tim kami dapat digunakan untuk keperluan promosi di media sosial dan website EH! JADI GA?. Jika kamu keberatan, informasikan kepada guide sebelum trip dimulai.</p>
      </Section>

      <Section title="9. Kode Etik Peserta">
        <p>Peserta diharapkan menjaga sikap saling menghormati terhadap sesama peserta, guide, dan masyarakat lokal. Perilaku yang mengganggu atau membahayakan orang lain dapat mengakibatkan pengeluaran dari trip tanpa refund.</p>
      </Section>

      <Section title="10. Kontak & Pertanyaan">
        <p>
          Untuk pertanyaan seputar syarat & ketentuan ini, hubungi kami di{' '}
          <a
            href="mailto:halo@ehjadiga.com"
            style={{ color: 'var(--ejg-ink)', fontFamily: 'var(--font-display)', fontWeight: 700 }}
          >
            halo@ehjadiga.com
          </a>
          {' '}atau via WhatsApp.
        </p>
      </Section>

      <div style={{ padding: '0 20px 28px' }}>
        <button
          type="button"
          className="btn btn-sec btn-block"
          onClick={() => navigate(-1)}
        >
          ← Kembali
        </button>
      </div>

      <Footer onNav={(name) => navigate(`/${name === 'home' ? '' : name}`)} />
    </>
  );
}
