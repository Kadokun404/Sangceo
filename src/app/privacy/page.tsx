import { SITE } from "@/config";

export const metadata = { title: "Privasi · sang.ceo" };

export default function PrivacyPage() {
  return (
    <section className="section">
      <div className="wrap" style={{ maxWidth: 720 }}>
        <h1>Privasi</h1>
        <h2 style={{ marginTop: 24 }}>Data yang tampil publik</h2>
        <p>
          Setiap klaim disimpan sebagai file JSON di repo registry yang terbuka. Isinya: nama
          subdomain atau alamat email, username GitHub pemilik, deskripsi bila kamu mengisinya,
          nilai record DNS, dan untuk email, alamat tujuan penerusan.
        </p>
        <p className="small muted">
          Karena repo-nya publik, jangan menaruh informasi pribadi di deskripsi. Untuk klaim
          email, alamat tujuan penerusan dan kontak penerima sandi awal ikut terlihat di file
          tersebut. Sandi akun mailbox tidak pernah disimpan di repo: dibuat otomatis saat
          provisioning dan dikirim langsung ke kontakmu.
        </p>
        <h2 style={{ marginTop: 24 }}>Data yang tidak kami kumpulkan</h2>
        <p>
          Situs ini tidak memasang analitik, tidak membuat akun, dan tidak menyimpan cookie
          selain satu preferensi tema terang/gelap di penyimpanan lokal perambanmu.
        </p>
        <h2 style={{ marginTop: 24 }}>Surel yang diteruskan</h2>
        <p>
          Surel yang masuk ke alamat {SITE.zone} diteruskan oleh layanan routing email ke alamat
          pribadimu. Pengelola tidak membaca atau menyimpan salinan isi surel.
        </p>
        <h2 style={{ marginTop: 24 }}>Penghapusan</h2>
        <p>
          Ingin namamu dihapus? Buka pull request yang menghapus file klaimmu, atau laporkan lewat
          halaman penyalahgunaan. Setelah merge, record ikut dicabut.
        </p>
      </div>
    </section>
  );
}
