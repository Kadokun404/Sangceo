import { SITE, repoUrl } from "@/config";

export const metadata = { title: "Laporan penyalahgunaan · sang.ceo" };

export default function AbusePage() {
  return (
    <section className="section">
      <div className="wrap" style={{ maxWidth: 720 }}>
        <h1>Laporan penyalahgunaan</h1>
        <p>
          Kalau ada subdomain di {SITE.zone} yang dipakai untuk phishing, malware, penipuan, atau
          konten melanggar hukum, laporkan lewat issue di repo registry:
        </p>
        <p>
          <a href={`${repoUrl()}/issues/new`} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            Buat issue laporan
          </a>
        </p>
        <p className="small muted">
          Sertakan alamat lengkap subdomain dan bukti singkat. Sengaja tidak ada alamat email
          khusus supaya semua laporan tercatat dan bisa ditindaklanjuti di tempat yang sama.
        </p>
        <h2 style={{ marginTop: 24 }}>Yang terjadi setelah laporan</h2>
        <p>
          Record bisa dinonaktifkan sementara selama pemeriksaan. Kalau terbukti melanggar, file
          klaim dihapus dari registry dan nama tidak diberikan lagi ke orang yang sama.
        </p>
      </div>
    </section>
  );
}
