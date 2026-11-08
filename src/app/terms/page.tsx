import { SITE } from "@/config";

export const metadata = { title: "Ketentuan layanan · sang.ceo" };

export default function TermsPage() {
  return (
    <section className="section">
      <div className="wrap" style={{ maxWidth: 720 }}>
        <h1>Ketentuan layanan</h1>
        <p className="muted">Berlaku untuk semua subdomain dan alamat email di bawah zona {SITE.zone}.</p>
        <h2 style={{ marginTop: 32 }}>Yang kamu dapat</h2>
        <p>
          Satu subdomain atau alamat email gratis, dipasang dan dirawat tanpa biaya, selama
          aturannya dipenuhi. Tidak ada janji uptime, tidak ada SLA, dan tidak ada dukungan
          berbayar.
        </p>
        <h2 style={{ marginTop: 24 }}>Yang tidak boleh</h2>
        <p>
          Malware, phishing, penipuan, penyebaran konten yang melanggar hukum, penimbunan nama
          untuk diperdagangkan, serta pemakaian yang bisa membuat seluruh zona {SITE.zone}
          ditandai blokir oleh penyedia DNS atau email.
        </p>
        <h2 style={{ marginTop: 24 }}>Perubahan dan pencabutan</h2>
        <p>
          Pengelola bisa menolak pull request, menonaktifkan record, atau mencabut nama yang
          melanggar aturan. Keputusan diambil lewat riwayat repo registry supaya bisa ditelusuri.
        </p>
        <h2 style={{ marginTop: 24 }}>Batas tanggung jawab</h2>
        <p>
          Layanan diberikan apa adanya. Pengelola tidak bertanggung jawab atas kerugian yang
          timbul dari pemakaian atau tidak tersedianya record dan rute email.
        </p>
      </div>
    </section>
  );
}
