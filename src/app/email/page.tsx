import Link from "next/link";
import { SITE, repoUrl } from "@/config";
import EmailGenerator from "@/components/EmailGenerator";

export const metadata = {
  title: "Email gratis · sang.ceo",
  description: "Akun email asli nama@sang.ceo (IMAP, SMTP, webmail via ruang.email) atau alamat terusan gratis. Diklaim lewat pull request.",
};

export default function EmailPage() {
  return (
    <>
      <section className="section">
        <div className="wrap">
          <h1>
            Email <span className="domain">nama<span className="zone">@{SITE.zone}</span></span>
          </h1>
          <p className="muted" style={{ maxWidth: "62ch" }}>
            Dua pilihan, klaimnya sama-sama lewat pull request ke repo registry. Bedanya cuma
            satu: apakah kamu butuh kotak masuk sendiri atau cukup meneruskan.
          </p>
          <div className="split" style={{ marginTop: 24 }}>
            <div className="card">
              <h3>Akun mailbox penuh</h3>
              <p className="muted small" style={{ marginTop: 0 }}>
                Email sungguhan yang berdiri sendiri: login webmail, terima-kirim lewat aplikasi
                (Gmail, Apple Mail, Outlook) via IMAP/SMTP, kuota 10 GB per akun.
              </p>
              <p className="small" style={{ marginBottom: 0 }}>
                Infrastrukturnya dijalankan lewat{" "}
                <a href={SITE.mail.guide} target="_blank" rel="noopener noreferrer">
                  ruang.email
                </a>
                , jadi SPF, DKIM, dan DMARC zona {SITE.zone} sudah terpasang sejak awal.{" "}
                <span className="tag">{SITE.mailboxSlots} akun gratis</span>{" "}
                jatah per domain, jadi diprioritaskan untuk proyek yang aktif dipakai.
              </p>
            </div>
            <div className="card">
              <h3>Terusan saja</h3>
              <p className="muted small" style={{ marginTop: 0 }}>
                Alamat <span className="domain">nama<span className="zone">@{SITE.zone}</span></span> yang
                meneruskan semua surel ke email pribadimu. Ringan, tanpa login tambahan, dan
                pas untuk alamat per-keperluan seperti{" "}
                <span className="mono">noreply@{SITE.zone}</span>.
              </p>
              <p className="small" style={{ marginBottom: 0 }}>
                Hanya menerima dan meneruskan, tidak bisa mengirim. Tidak memakan jatah
                mailbox, jadi jumlahnya longgar.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2>Generator alamat email</h2>
          <p className="muted" style={{ maxWidth: "60ch" }}>
            Sama seperti subdomain: satu file JSON bernama{" "}
            <span className="mono">emails/nama-mu.json</span> di repo registry. Pilih jenisnya
            di generator.
          </p>
          <div style={{ marginTop: 24 }}>
            <EmailGenerator />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2>Parameter koneksi untuk akun mailbox</h2>
          <p className="muted" style={{ maxWidth: "60ch" }}>
            Berlaku setelah akunmu aktif. Panduan integrasi lengkap dengan contoh kode ada di{" "}
            <a href={SITE.mail.guide} target="_blank" rel="noopener noreferrer">
              panduan ruang.email
            </a>
            .
          </p>
          <div className="table-scroll" style={{ marginTop: 20 }}>
            <table className="registry">
              <thead>
                <tr>
                  <th>Koneksi</th>
                  <th>Server</th>
                  <th>Port</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Webmail</td>
                  <td colSpan={2}>
                    <a href={SITE.mail.webmail} target="_blank" rel="noopener noreferrer">
                      {SITE.mail.webmail.replace("https://", "")}
                    </a>{" "}
                    <span className="muted small">login pakai alamat lengkap</span>
                  </td>
                </tr>
                <tr>
                  <td>SMTP (kirim)</td>
                  <td><span className="mono">{SITE.mail.smtpHost}</span></td>
                  <td><span className="mono">465</span> SSL/TLS atau <span className="mono">587</span> STARTTLS</td>
                </tr>
                <tr>
                  <td>IMAP (terima)</td>
                  <td><span className="mono">{SITE.mail.imapHost}</span></td>
                  <td><span className="mono">993</span> SSL/TLS</td>
                </tr>
                <tr>
                  <td>POP3S (opsional)</td>
                  <td><span className="mono">{SITE.mail.imapHost}</span></td>
                  <td><span className="mono">995</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="small muted" style={{ marginTop: 12 }}>
            Username untuk semua koneksi adalah alamat lengkapnya, misal{" "}
            <span className="mono">halo@{SITE.zone}</span>. Sandi awal dikirim pengelola ke
            kontakmu setelah PR merge, lalu segera ganti dari pengaturan webmail.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2>Alurnya</h2>
          <ol className="steps" style={{ marginTop: 24 }}>
            <li>
              <h3>Fork repo registry</h3>
              <p>
                Repo yang sama dengan subdomain:{" "}
                <a href={repoUrl()} target="_blank" rel="noopener noreferrer">
                  {SITE.repo}
                </a>
                .
              </p>
            </li>
            <li>
              <h3>Tambah file <span className="mono">emails/nama-mu.json</span></h3>
              <p>
                Pakai generator di atas: pilih mailbox atau terusan, isi alamat dan data
                yang diminta.
              </p>
            </li>
            <li>
              <h3>Buka pull request</h3>
              <p>
                Misal berjudul <span className="mono">klaim halo@{SITE.zone}</span>. Bot akan
                memeriksa format filenya otomatis di PR.
              </p>
            </li>
            <li>
              <h3>Aktif setelah merge</h3>
              <p>
                Untuk mailbox: pengelola membuat akun di{" "}
                <a href={SITE.mail.portal} target="_blank" rel="noopener noreferrer">
                  portal kelola
                </a>{" "}
                dan mengirim sandi awal. Untuk terusan: rute dipasang pada email routing zona.
                Keduanya tanpa konfigurasi tambahan dari sisi kamu.
              </p>
            </li>
          </ol>
          <div className="panel small muted" style={{ marginTop: 16 }}>
            Butuh lebih dari {SITE.mailboxSlots} mailbox aktif, atau ingin domain sendiri di
            ruang.email? Pengelola bisa mengajukan penambahan kapasitas ke admin ruang.email,
            atau kamu mendaftarkan domain milikmu sendiri di sana langsung.
          </div>
          <p className="small muted" style={{ marginTop: 8 }}>
            Pertanyaan teknis soal rute email bisa kamu sampaikan lewat issue di repo registry.
          </p>
        </div>
      </section>
    </>
  );
}
