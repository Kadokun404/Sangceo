"use client";

import { useEffect, useState } from "react";

type Status = { pr?: string; error?: string } | null;

// Klaim sekali klik: hanya aktif kalau pengguna sudah login via GitHub.
// Situs membuatkan fork, commit file klaim, dan membuka PR dari akun pengguna.
export default function QuickClaim({ body }: { body: Record<string, unknown> | null }) {
  const [login, setLogin] = useState<string | null | undefined>(undefined);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setLogin(d.login || null))
      .catch(() => setLogin(null));
  }, []);

  if (login === undefined) return null;

  if (login === null) {
    return (
      <p className="small muted" style={{ marginTop: 12 }}>
        Atau{" "}
        <a href={`/api/auth/github?back=${encodeURIComponent(typeof window !== "undefined" ? window.location.pathname : "/")}`}>
          masuk dengan GitHub
        </a>{" "}
        untuk klaim sekali klik tanpa buka editor.
      </p>
    );
  }

  async function kirim() {
    if (!body || busy) return;
    setBusy(true);
    setStatus(null);
    try {
      const res = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setStatus(await res.json());
    } catch {
      setStatus({ error: "jaringan bermasalah, coba lagi" });
    } finally {
      setBusy(false);
    }
  }

  if (status?.pr) {
    return (
      <p style={{ marginTop: 12 }}>
        <a className="btn" href={status.pr} target="_blank" rel="noopener noreferrer">
          Pull request sudah dibuat, buka di GitHub
        </a>
      </p>
    );
  }

  return (
    <div style={{ marginTop: 12 }}>
      <button type="button" className="btn" disabled={!body || busy} onClick={kirim}>
        {busy ? "Membuat PR..." : "Buat PR otomatis"}
      </button>
      {status?.error && (
        <p className="small" style={{ color: "var(--warn)", marginTop: 8 }}>
          {status.error}
        </p>
      )}
      {!body && (
        <p className="small muted" style={{ marginTop: 8 }}>
          Lengkapi form dulu, lalu tombol ini akan membuat PR dari akunmu.
        </p>
      )}
    </div>
  );
}
