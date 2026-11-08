import Link from "next/link";
import { SITE, repoUrl } from "@/config";
import { getDomains, getEmails } from "@/lib/registry";
import DomainBrowser from "@/components/DomainBrowser";

export const dynamic = "force-static";

export default function Home() {
  const domains = getDomains();
  const emails = getEmails();

  return (
    <>
      {/* Hero: satu titik fokus, string domain */}
      <section className="section">
        <div className="wrap">
          <h1 className="hero-domain">
            namamu<span className="zone">.{SITE.zone}</span>
          </h1>
          <p style={{ maxWidth: "56ch", marginTop: 16 }}>
            Subdomain dan alamat email gratis untuk project kamu: website pribadi, portfolio,
            atau eksperimen akhir pekan. Diklaim lewat pull request di GitHub, aktif setelah
            merge, dan tetap gratis selamanya.
          </p>
          <p style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
            <Link href="/daftar" className="btn btn-primary">
              Klaim subdomainmu
            </Link>
            <Link href="/domains" className="btn btn-ghost">
              Lihat yang sudah diklaim
            </Link>
          </p>
          <div className="stats" style={{ marginTop: 40 }}>
            <div className="stat">
              <div className="num">{domains.length}</div>
              <div className="lbl">subdomain terdaftar</div>
            </div>
            <div className="stat">
              <div className="num">{emails.length}</div>
              <div className="lbl">alamat email aktif</div>
            </div>
            <div className="stat">
              <div className="num">Rp0</div>
              <div className="lbl">biaya, sekarang dan nanti</div>
            </div>
          </div>
        </div>
      </section>

      {/* Dua layanan: komposisi split, bukan grid kartu seragam */}
      <section className="section">
        <div className="wrap">
          <h2>Dua layanan, satu cara klaim</h2>
          <p className="muted" style={{ maxWidth: "60ch" }}>
            Keduanya diklaim lewat pull request ke repo registry. Bedanya hanya file yang
            kamu buat dan yang diatur setelah merge.
          </p>
          <div className="split" style={{ marginTop: 24 }}>
            <div className="card">
              <h3>Subdomain DNS</h3>
              <p className="muted small" style={{ marginTop: 0 }}>
                Arahkan <span className="domain">namamu<span className="zone">.{SITE.zone}</span></span>{" "}
                ke mana pun project kamu tinggal: Vercel, Netlify, GitHub Pages, Cloudflare
                Pages, VPS, atau server sendiri.
              </p>
              <p className="small" style={{ marginBottom: 0 }}>
                Tipe record: <span className="mono">A, AAAA, CNAME, TXT, MX, NS, SRV, CAA, PTR</span>.
                Nama bertingkat (<span className="mono">_acme-challenge.app</span>) dan wildcard
                (<span className="mono">*.app</span>) di atas nama yang sudah kamu klaim juga bisa.
              </p>
            </div>
            <div className="card">
              <h3>Email gratis: mailbox atau terusan</h3>
              <p className="muted small" style={{ marginTop: 0 }}>
                Butuh email sungguhan? Dapatkan akun{" "}
                <span className="domain">nama<span className="zone">@{SITE.zone}</span></span>{" "}
                dengan webmail, IMAP, dan SMTP lewat ruang.email, kuota 10 GB per akun.
              </p>
              <p className="small" style={{ marginBottom: 0 }}>
                Kalau cukup menerima, pilih mode terusan: surel masuk diteruskan ke email
                pribadimu, tanpa login tambahan. Keduanya diklaim lewat pull request.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform: tabel nilai target, bukan deretan kartu */}
      <section className="section">
        <div className="wrap">
          <h2>Sudah ada preset untuk platform umum</h2>
          <p className="muted" style={{ maxWidth: "60ch" }}>
            Pilih platform di generator, nilai record terisi otomatis. Kalau platformmu tidak
            ada di daftar, isi targetnya sendiri.
          </p>
          <div className="table-scroll" style={{ marginTop: 20 }}>
            <table className="registry">
              <thead>
                <tr>
                  <th>Platform</th>
                  <th>Nilai record CNAME</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Vercel</td>
                  <td><span className="mono">cname.vercel-dns.com</span></td>
                </tr>
                <tr>
                  <td>Netlify</td>
                  <td><span className="mono">nama-situs.netlify.app</span></td>
                </tr>
                <tr>
                  <td>GitHub Pages</td>
                  <td><span className="mono">username.github.io</span></td>
                </tr>
                <tr>
                  <td>Cloudflare Pages</td>
                  <td><span className="mono">nama-proyek.pages.dev</span></td>
                </tr>
                <tr>
                  <td>Lainnya / VPS</td>
                  <td>Alamat host atau IP milikmu sendiri</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Cara kerja: alur asli 4 langkah */}
      <section className="section">
        <div className="wrap">
          <h2>Cara klaimnya</h2>
          <ol className="steps" style={{ marginTop: 24 }}>
            <li>
              <h3>Fork repo registry</h3>
              <p>
                Semua data tinggal di <a href={repoUrl()} target="_blank" rel="noopener noreferrer">{SITE.repo}</a>,
                jadi klaim dan perubahannya terbuka untuk siapa saja.
              </p>
            </li>
            <li>
              <h3>Buat file JSON dari generator</h3>
              <p>
                Isi form di halaman <Link href="/daftar">cara klaim</Link>, salin JSON-nya atau
                langsung buka editor GitHub dengan isi sudah terisi.
              </p>
            </li>
            <li>
              <h3>Buka pull request</h3>
              <p>
                Satu file per nama: <span className="mono">domains/nama.{SITE.zone}.json</span> untuk
                subdomain, <span className="mono">emails/nama.json</span> untuk email.
              </p>
            </li>
            <li>
              <h3>Tunggu merge, selesai</h3>
              <p>
                Setelah merge, perubahan DNS didorong otomatis dan halaman ini dibangun ulang
                dengan nama barumu di daftar.
              </p>
            </li>
          </ol>
        </div>
      </section>

      {/* Daftar terakhir + FAQ */}
      <section className="section">
        <div className="wrap">
          <h2>Baru saja diklaim</h2>
          {domains.length === 0 ? (
            <div className="empty" style={{ marginTop: 20 }}>
              Belum ada subdomain yang diklaim.{" "}
              <Link href="/daftar">Jadilah yang pertama</Link>.
            </div>
          ) : (
            <DomainBrowser domains={domains} compact />
          )}
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2>Pertanyaan yang sering muncul</h2>
          <div style={{ marginTop: 16 }}>
            <details className="faq">
              <summary>Benar gratis? Di mana tangkapannya?</summary>
              <div className="a">
                Gratis, tanpa langganan dan tanpa kartu kredit. Kamu hanya butuh akun GitHub
                untuk membuka pull request.
              </div>
            </details>
            <details className="faq">
              <summary>Berapa lama sampai aktif?</summary>
              <div className="a">
                Mulai dari saat PR di-merge. Penyebaran DNS biasanya butuh beberapa menit,
                dan tabel di halaman daftar langsung memuat nama baru saat situs dibangun ulang.
              </div>
            </details>
            <details className="faq">
              <summary>Subdomainnya boleh dipakai untuk apa saja?</summary>
              <div className="a">
                Untuk apa pun milikmu yang legal: situs pribadi, portfolio, dokumentasi, proyek
                open source. Malware, phishing, dan konten yang bisa menggugurkan seluruh zona
                tidak diizinkan. Aturan lengkap ada di repo.
              </div>
            </details>
            <details className="faq">
              <summary>Bisa punya lebih dari satu?</summary>
              <div className="a">
                Satu subdomain per orang per keperluan, biar tidak ada penimbunan nama. Kalau
                kamu sudah mengklaim <span className="mono">nama.{SITE.zone}</span>, kamu masih bisa
                menambahkan turunannya seperti <span className="mono">api.nama.{SITE.zone}</span> atau
                wildcard <span className="mono">*.nama.{SITE.zone}</span>.
              </div>
            </details>
            <details className="faq">
              <summary>Emailnya bisa dipakai mengirim?</summary>
              <div className="a">
                Akun mailbox <span className="mono">nama@{SITE.zone}</span> bisa: kirim dan terima
                lewat webmail atau aplikasi apa pun via SMTP dan IMAP. Mode terusan tidak:
                alamatnya hanya menerima dan meneruskan surel ke email pribadimu.
              </div>
            </details>
            <details className="faq">
              <summary>Kenapa mailbox gratisnya terbatas jumlahnya?</summary>
              <div className="a">
                Infrastruktur mailbox dijalankan di ruang.email dengan {SITE.mailboxSlots} akun
                gratis per domain, jadi slotnya diprioritaskan untuk proyek yang aktif dipakai.
                Untuk alamat tambahan, pakai mode terusan yang tidak memakan slot, atau
                daftarkan domainmu sendiri di ruang.email.
              </div>
            </details>
          </div>
        </div>
      </section>
    </>
  );
}
