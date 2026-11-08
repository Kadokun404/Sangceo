import fs from "node:fs";
import path from "node:path";
import { getSession } from "@/lib/auth";
import { SITE } from "@/config";
import Link from "next/link";

export const dynamic = "force-dynamic";

const PESAN: Record<string, string> = {
  state: "Sesi login kedaluwarsa atau tidak cocok. Coba lagi.",
  token: "GitHub menolak pertukaran token. Coba lagi beberapa saat.",
  user: "Gagal mengambil profil GitHub kamu. Coba lagi.",
};

type Klaim = { kind: string; nama: string; file: string };

export default async function KlaimkuPage({ searchParams }: { searchParams: Promise<{ gagal?: string }> }) {
  const { gagal } = await searchParams;
  const session = await getSession();

  if (!session) {
    return (
      <main className="wrap section">
        <h1>Klaimku</h1>
        <p className="small muted" style={{ maxWidth: 560 }}>
          Masuk dengan GitHub untuk melihat klaim milikmu dan mengklaim subdomain atau email
          baru sekali klik.
        </p>
        {gagal && PESAN[gagal] && (
          <p className="panel small" style={{ borderColor: "var(--warn)", marginTop: 16 }}>
            {PESAN[gagal]}
          </p>
        )}
        <p style={{ marginTop: 20 }}>
          <a className="btn" href="/api/auth/github?back=/klaimku">
            Masuk dengan GitHub
          </a>
        </p>
      </main>
    );
  }

  const klaim: Klaim[] = [];
  const dirs: Array<[string, string]> = [
    ["data/domains", "subdomain"],
    ["data/emails", "email"],
  ];
  for (const [dir, kind] of dirs) {
    try {
      for (const f of fs.readdirSync(path.join(process.cwd(), dir))) {
        if (!f.endsWith(".json")) continue;
        const json = JSON.parse(fs.readFileSync(path.join(process.cwd(), dir, f), "utf8")) as { owner?: string };
        if (json.owner === session.login) klaim.push({ kind, nama: f.replace(/\.json$/, ""), file: `${dir}/${f}` });
      }
    } catch {
      // direktori belum ada
    }
  }

  return (
    <main className="wrap section">
      <h1>
        Halo, <span className="mono">{session.login}</span>
      </h1>
      <p className="small muted" style={{ marginTop: 8 }}>
        Email untuk pengiriman sandi mailbox: <span className="mono">{session.email || "tidak tersedia"}</span>
        {session.email && <span className="small muted"> (terverifikasi GitHub)</span>}
      </p>

      <h2 style={{ marginTop: 32 }}>Klaim terdaftar</h2>
      {klaim.length === 0 ? (
        <p className="small muted">
          Belum ada. Mulai dari{" "}
          <Link href="/domains">daftar domain</Link> atau <Link href="/email">email</Link>.
        </p>
      ) : (
        <ul style={{ marginTop: 12 }}>
          {klaim.map((k) => (
            <li key={k.file}>
              <span className="mono">{k.nama}</span>{" "}
              <span className="small muted">({k.kind})</span>{" "}
              <a className="small" href={`https://github.com/${SITE.repo}/blob/main/${k.file}`} target="_blank" rel="noopener noreferrer">
                file di repo
              </a>
            </li>
          ))}
        </ul>
      )}

      <div className="panel" style={{ marginTop: 32 }}>
        <h2 style={{ marginTop: 0 }}>Klaim baru, sekali klik</h2>
        <p className="small muted">
          Situs akan membuatkan fork, commit file klaim, dan membuka pull request dari akun
          GitHub-mu. Kamu tinggal memantau PR-nya.
        </p>
        <p className="small muted">
          Buka <Link href="/email">halaman email</Link> atau <Link href="/domains">daftar domain</Link>{" "}
          untuk mengklaim lewat generator; saat sudah login, tombol <em>Buat PR otomatis</em> aktif.
        </p>
      </div>

      <p className="small" style={{ marginTop: 24 }}>
        <a href="/api/auth/logout">Keluar</a>
      </p>
    </main>
  );
}
