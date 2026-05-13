import { useState } from 'react';
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

function SubSection({ title, children }) {
  return (
    <div style={{ marginTop: 12, marginBottom: 4 }}>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: 'var(--ejg-ink)', marginBottom: 6 }}>
        {title}
      </div>
      {children}
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

function DamageTable() {
  const rows = [
    ['Kasur (Mattress)', 'Rp 600.000'],
    ['Bantal', 'Rp 50.000 / buah'],
    ['Selimut', 'Rp 100.000'],
    ['Sprai', 'Rp 100.000'],
    ['Lampu / Lighting Dekoratif', 'Rp 150.000 / buah'],
    ['Kursi', 'Rp 200.000 / buah'],
    ['Meja', 'Rp 250.000'],
    ['Peralatan Makan (Piring, Gelas, dll)', 'Rp 50.000 / buah'],
    ['Terpal / Kanvas Tenda (Sobek)', 'Rp 2.500.000'],
    ['Noda Permanen pada Fasilitas', 'Rp 300.000 – Rp 1.000.000 *'],
    ['Kerusakan lain di luar daftar', 'Sesuai nilai penggantian aktual'],
  ];
  return (
    <div style={{ overflowX: 'auto', marginTop: 10 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>
            {['Fasilitas / Item', 'Biaya Penggantian'].map(h => (
              <th key={h} style={{
                padding: '8px 12px', textAlign: 'left', background: 'var(--ejg-ink)',
                color: 'var(--ejg-matahari)', fontFamily: 'var(--font-display)',
                fontWeight: 700, fontSize: 11, letterSpacing: '0.05em',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([item, cost], i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'var(--ejg-kertas-2)' : '#fff' }}>
              <td style={{ padding: '8px 12px', color: 'var(--fg-2)', borderBottom: '1px solid var(--border)' }}>{item}</td>
              <td style={{ padding: '8px 12px', fontWeight: 600, color: 'var(--ejg-ink)', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{cost}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 8, lineHeight: 1.5 }}>
        *) Untuk kerusakan yang tidak tercantum, biaya ditetapkan berdasarkan nilai aktual barang setelah penilaian oleh Penyelenggara.
      </p>
    </div>
  );
}

function TripTerms() {
  return (
    <>
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
          <a href="mailto:halo@ehjadiga.com" style={{ color: 'var(--ejg-ink)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
            halo@ehjadiga.com
          </a>
          {' '}atau via WhatsApp.
        </p>
      </Section>
    </>
  );
}

function GlampingTerms() {
  return (
    <>
      <Section title="Pasal 1 – Reservasi dan Pembayaran">
        <ul style={{ paddingLeft: 18 }}>
          <Li>Pemesanan dianggap sah dan terkonfirmasi setelah Tamu melakukan pembayaran uang muka (DP) sebesar <strong>50%</strong> dari total harga yang disepakati.</Li>
          <Li>Sisa pembayaran 50% wajib dilunasi selambat-lambatnya <strong>pada saat check-in</strong> atau sebelum Tamu memasuki area glamping.</Li>
          <Li>Harga yang tertera pada halaman detail glamping telah mencakup fasilitas sebagaimana yang diinformasikan pada halaman tersebut.</Li>
          <Li>Harga <strong>tidak termasuk</strong> tiket masuk kawasan wisata dan/atau biaya aktivitas tambahan lainnya yang berlaku di lokasi.</Li>
          <Li>Konfirmasi pemesanan akan dikirimkan melalui WhatsApp dan/atau email yang didaftarkan saat pemesanan.</Li>
          <Li>Penyelenggara berhak membatalkan pemesanan apabila pembayaran DP tidak diterima dalam batas waktu yang ditentukan.</Li>
        </ul>
      </Section>

      <Section title="Pasal 2 – Pembatalan dan Reschedule">
        <SubSection title="A. Pembatalan oleh Tamu">
          <ul style={{ paddingLeft: 18 }}>
            <Li><strong>Lebih dari H-7:</strong> Refund 50% dari nilai DP yang telah dibayarkan.</Li>
            <Li><strong>H-7 s/d H-4:</strong> Refund 25% dari nilai DP yang telah dibayarkan.</Li>
            <Li><strong>H-3 dan seterusnya:</strong> Tidak ada pengembalian dana (No Refund).</Li>
            <Li><strong>No-Show:</strong> Tidak ada pengembalian dana dalam bentuk apapun.</Li>
          </ul>
        </SubSection>
        <SubSection title="B. Reschedule">
          <ul style={{ paddingLeft: 18 }}>
            <Li>Reschedule hanya dapat dilakukan maksimal <strong>2 kali</strong> per pemesanan.</Li>
            <Li>Pengajuan reschedule wajib dilakukan minimal <strong>H-5</strong> sebelum tanggal check-in.</Li>
            <Li>Reschedule yang diajukan kurang dari H-5 tidak dapat diproses dan dianggap pembatalan.</Li>
            <Li>Reschedule tunduk pada ketersediaan jadwal dan tidak menjamin tanggal yang diinginkan.</Li>
            <Li>Refund akan diproses dalam <strong>7–14 hari kerja</strong> setelah permohonan disetujui.</Li>
          </ul>
        </SubSection>
      </Section>

      <Section title="Pasal 3 – Check-in, Check-out, dan Denda Kerusakan">
        <SubSection title="A. Ketentuan Check-in dan Check-out">
          <ul style={{ paddingLeft: 18 }}>
            <Li>Waktu check-in: <strong>Pukul 14.00 WIB</strong></Li>
            <Li>Waktu check-out: <strong>Pukul 12.00 WIB</strong></Li>
            <Li>Early check-in / late check-out dikenakan biaya tambahan <strong>Rp50.000 per jam</strong>, subject to availability.</Li>
            <Li>Apabila Tamu belum meninggalkan fasilitas setelah pukul 16.00 WIB tanpa pemberitahuan, Penyelenggara berhak mengenakan biaya satu malam penuh.</Li>
          </ul>
        </SubSection>
        <SubSection title="B. Daftar Biaya Penggantian Kerusakan">
          <p style={{ marginBottom: 6 }}>Tamu bertanggung jawab penuh atas setiap kerusakan fasilitas selama masa menginap.</p>
          <DamageTable />
        </SubSection>
      </Section>

      <Section title="Pasal 4 – Kapasitas Tamu dan Ketentuan Hunian">
        <ul style={{ paddingLeft: 18 }}>
          <Li>Kapasitas maksimal tamu per unit mengikuti ketentuan pada halaman detail masing-masing unit. Kelebihan kapasitas tidak diperkenankan.</Li>
          <Li>Penyelenggara tidak menerima tamu berstatus pasangan bukan suami-istri dalam satu unit. Bukti pernikahan dapat diminta apabila diperlukan.</Li>
          <Li>Tamu berusia di bawah 15 tahun wajib disertai pendamping dewasa (18 tahun ke atas).</Li>
          <Li>Anak di bawah 7 tahun tidak dikenakan biaya, namun tetap dihitung dalam kapasitas unit.</Li>
          <Li>Penyelenggara berhak menolak atau meminta Tamu meninggalkan area glamping tanpa pengembalian dana apabila terbukti melanggar ketentuan ini.</Li>
        </ul>
      </Section>

      <Section title="Pasal 5 – Tata Tertib di Area Glamping">
        <SubSection title="A. Jam Tenang">
          <ul style={{ paddingLeft: 18 }}>
            <Li>Tamu wajib menjaga ketenangan pada <strong>Jam Tenang: 22.00 – 07.00 WIB</strong>.</Li>
            <Li>Keributan selama jam tenang dapat mengakibatkan peringatan atau pengeluaran dari area glamping.</Li>
          </ul>
        </SubSection>
        <SubSection title="B. Hewan Peliharaan">
          <ul style={{ paddingLeft: 18 }}>
            <Li>Hewan peliharaan diperbolehkan di area glamping namun <strong>tidak diizinkan masuk ke dalam unit tenda</strong>.</Li>
            <Li>Tamu bertanggung jawab penuh atas perilaku, kebersihan, dan keamanan hewan peliharaan.</Li>
            <Li>Kerusakan atau kotoran yang ditimbulkan hewan peliharaan menjadi tanggung jawab Tamu sepenuhnya.</Li>
          </ul>
        </SubSection>
        <SubSection title="C. Larangan">
          <ul style={{ paddingLeft: 18 }}>
            <Li>Dilarang keras membawa, menggunakan, atau mengedarkan narkoba dan/atau obat-obatan terlarang. Pelanggaran akan dilaporkan kepada pihak berwajib.</Li>
            <Li>Dilarang merokok di dalam unit tenda. Denda <strong>Rp500.000 per kejadian</strong> bagi pelanggar.</Li>
            <Li>Area merokok hanya di tempat yang telah ditentukan Penyelenggara.</Li>
          </ul>
        </SubSection>
        <SubSection title="D. Kerusakan dan Tanggung Jawab Fasilitas">
          <ul style={{ paddingLeft: 18 }}>
            <Li>Seluruh fasilitas merupakan aset Penyelenggara. Tamu wajib memperlakukan fasilitas dengan baik.</Li>
            <Li>Kerusakan wajib dilaporkan kepada staf sesegera mungkin setelah diketahui.</Li>
            <Li>Biaya penggantian kerusakan mengacu pada Pasal 3.B dokumen ini.</Li>
          </ul>
        </SubSection>
      </Section>

      <Section title="Pasal 6 – Batasan Tanggung Jawab">
        <ul style={{ paddingLeft: 18 }}>
          <Li>Penyelenggara tidak bertanggung jawab atas kehilangan, kerusakan, atau pencurian barang bawaan pribadi Tamu.</Li>
          <Li>Penyelenggara tidak bertanggung jawab atas kondisi cuaca atau kejadian alam (force majeure) seperti hujan lebat, banjir, gempa bumi, dan kebakaran hutan.</Li>
          <Li>Penyelenggara berhak menghentikan layanan atau memindahkan Tamu ke unit lain yang setara apabila terdapat kondisi keamanan yang mengharuskan hal tersebut, tanpa biaya tambahan.</Li>
        </ul>
      </Section>

      <Section title="Pasal 7 – Penyelesaian Keluhan dan Sengketa">
        <ul style={{ paddingLeft: 18 }}>
          <Li>Keluhan terkait layanan atau fasilitas wajib disampaikan kepada admin EH! JADI GA? <strong>maksimal 24 jam</strong> setelah kejadian.</Li>
          <Li>Penyelenggara mengutamakan penyelesaian sengketa melalui musyawarah untuk mufakat.</Li>
          <Li>Apabila tidak tercapai kesepakatan, penyelesaian dilaksanakan sesuai ketentuan hukum yang berlaku di Republik Indonesia.</Li>
        </ul>
        <p style={{ marginTop: 10 }}>
          Untuk pertanyaan, hubungi admin kami di{' '}
          <a href="mailto:halo@ehjadiga.com" style={{ color: 'var(--ejg-ink)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
            halo@ehjadiga.com
          </a>
          {' '}atau WhatsApp <strong>085117322207</strong>.
        </p>
      </Section>
    </>
  );
}

export default function TermsScreen() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('trip');

  return (
    <>
      <div className="page-header">
        <span className="eyebrow">Legal · EH! JADI GA?</span>
        <h1 style={{ marginTop: 6 }}>
          Syarat &amp; <span className="italic" style={{ fontStyle: 'italic', fontWeight: 500 }}>Ketentuan</span><span className="q-stamp">.</span>
        </h1>
      </div>

      {/* Tab switcher */}
      <div style={{ padding: '0 20px 20px', display: 'flex', gap: 8 }}>
        {[
          { id: 'trip',     label: 'Open & Private Trip' },
          { id: 'glamping', label: 'Glamping' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1, padding: '11px 8px', borderRadius: 12, cursor: 'pointer',
              border: tab === t.id ? '2px solid var(--ejg-ink)' : '1.5px solid var(--border)',
              background: tab === t.id ? 'var(--ejg-ink)' : 'transparent',
              color: tab === t.id ? 'var(--ejg-matahari)' : 'var(--fg-2)',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13,
              transition: 'all 140ms ease',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '0 20px 12px' }}>
        <div style={{
          background: 'var(--ejg-kertas-2)', border: '1px solid var(--border)',
          borderRadius: 14, padding: 14, fontSize: 13, color: 'var(--fg-3)', lineHeight: 1.6,
        }}>
          {tab === 'trip'
            ? 'Berlaku untuk semua layanan trip — open trip, private trip, dan corporate. Terakhir diperbarui: Januari 2025.'
            : 'Berlaku untuk seluruh pemesanan layanan glamping EH! JADI GA?. Versi 1.0 — berlaku sejak diterbitkan.'}
        </div>
      </div>

      {tab === 'trip' ? <TripTerms /> : <GlampingTerms />}

      <div style={{ padding: '0 20px 28px' }}>
        <button type="button" className="btn btn-sec btn-block" onClick={() => navigate(-1)}>
          ← Kembali
        </button>
      </div>

      <Footer onNav={(name) => navigate(`/${name === 'home' ? '' : name}`)} />
    </>
  );
}
