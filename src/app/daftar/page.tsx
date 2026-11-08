import Link from "next/link";
import { SITE, repoUrl, fileUrl } from "@/config";
import Generator from "@/components/Generator";

export const metadata = {
  title: "Cara klaim · sang.ceo",
  description: "Klaim subdomain gratis di sang.ceo lewat pull request: generator JSON, langkah, dan aturannya.",
};

export default function DaftarPage() {
  return (
    <>
      <section className="section">
        <div className="wrap">
          <h1>Klaim subdomainmu</h1>
          <p className="muted" style={{ maxWidth: "62ch" }}>
            Isi generator di bawah, buka editor GitHub dengan isi sudah terisi, lalu buat pull
            request. Setelah merge, record dipasang dan{" "}
            <span className="domain">
              namamu<span className="zone">.{SITE.zone}</span>
            </span>{" "}
            milikmu.
          </p>
        </div>
      </section>

      <section className="section" style={{ borderTop: "none", paddingTop: 0 }}>
        <div className="wrap">
          <Generator />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2>Langkah lengkapnya</h2>
          <ol className="steps" style={{ marginTop: 24 }}>
            <li>
              <h3>Fork repo registry</h3>
              <p>
                Buka <a href={repoUrl()} target="_blank" rel="noopener noreferrer">{SITE.repo}</a> lalu
                fork ke akunmu. Semua perubahan lewat pull request supaya riwayatnya terbuka.
              </p>
            </li>
            <li>
              <h3>Tambah file JSON</h3>
              <p>
                Buat file baru bernama <span className="mono">domains/nama-mu.{SITE.zone}.json</span>.
                Format lengkap dan contohnya ada di{" "}
                <a href={fileUrl("CONTRIBUTING.md")} target="_blank" rel="noopener noreferrer">
                  CONTRIBUTING.md
                </a>
                .
              </p>
            </li>
            <li>
              <h3>Buka pull request</h3>
              <p>
                Judulnya cukup nama yang kamu minta, misal{" "}
                <span className="mono">klaim nama-mu.{SITE.zone}</span>. Cek komentar bot untuk
                pratinjau perubahan DNS-nya.
              </p>
            </li>
            <li>
              <h3>Arahkan platformmu</h3>
              <p>
                Selama menunggu merge, siapkan projectmu: tambahkan{" "}
                <span className="mono">namamu.{SITE.zone}</span> sebagai custom domain di Vercel,
                Netlify, GitHub Pages, atau platform yang kamu pakai.
              </p>
            </li>
            <li>
              <h3>Selesai setelah merge</h3>
              <p>
                Record didorong ke zona DNS otomatis, dan{" "}
                <Link href="/domains">daftar domain</Link> memuat namamu pada rebuild berikutnya.
              </p>
            </li>
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2>Aturannya, ringkas</h2>
          <ul style={{ color: "var(--muted)", paddingLeft: 20, marginTop: 16 }}>
            <li style={{ marginBottom: 8 }}>
              Satu subdomain per orang per keperluan. Turunan (<span className="mono">api.nama-mu.{SITE.zone}</span>)
              dan wildcard (<span className="mono">*.nama-mu.{SITE.zone}</span>) di atas nama yang
              sudah kamu klaim tidak dihitung.
            </li>
            <li style={{ marginBottom: 8 }}>
              Label harus berupa nama, bukan kata umum seperti <span className="mono">saya</span> atau{" "}
              <span className="mono">the</span>. Pakai username GitHub yang menjadi pemilik record.
            </li>
            <li style={{ marginBottom: 8 }}>
              Satu CNAME per nama, dan tidak boleh menunjuk kembali ke namanya sendiri.
            </li>
            <li style={{ marginBottom: 8 }}>
              Tanpa malware, phishing, atau konten yang bisa membuat seluruh zona {SITE.zone} ditandai
              blokir oleh penyedia.
            </li>
            <li>
              Aturan teknis lengkap ada di{" "}
              <a href={repoUrl()} target="_blank" rel="noopener noreferrer">
                repo registry
              </a>
              . Laporan penyalahgunaan lewat halaman{" "}
              <Link href="/abuse">penyalahgunaan</Link>.
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
