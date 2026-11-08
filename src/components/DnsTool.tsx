"use client";

import { useState } from "react";
import { SITE } from "@/config";

type DohAnswer = { name: string; type: number; data: string };
type DohResponse = { Status: number; Answer?: DohAnswer[] };

const TYPES = ["A", "AAAA", "CNAME", "TXT", "MX", "NS"];

export default function DnsTool({ defaultName = "" }: { defaultName?: string }) {
  const [fqdn, setFqdn] = useState(defaultName);
  const [type, setType] = useState("A");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [answer, setAnswer] = useState<DohAnswer[]>([]);
  const [statusCode, setStatusCode] = useState<number | null>(null);

  async function lookup(e: React.FormEvent) {
    e.preventDefault();
    const name = fqdn.trim().replace(/\.$/, "");
    if (!name) return;
    setState("loading");
    try {
      const res = await fetch(
        `https://dns.google/resolve?name=${encodeURIComponent(name)}.${SITE.zone}&type=${type}`
      );
      if (!res.ok) throw new Error(String(res.status));
      const data: DohResponse = await res.json();
      setAnswer(data.Answer || []);
      setStatusCode(data.Status);
      setState("done");
    } catch {
      setState("error");
    }
  }

  return (
    <div style={{ marginTop: 24 }}>
      <h2>Cek propagasi DNS</h2>
      <p className="muted small" style={{ maxWidth: "62ch" }}>
        Setelah PR merge, pastikan recordmu sudah tersebar: ketik subdomainnya (tanpa zona),
        pilih tipe record, dan hasilnya diambil langsung dari resolver DNS Google.
      </p>
      <form onSubmit={lookup} style={{ marginTop: 16 }}>
        <div className="field" style={{ maxWidth: 480 }}>
          <label htmlFor="dns-name">Subdomain</label>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <input
              id="dns-name"
              className="input"
              style={{ flex: 1, minWidth: 160 }}
              type="text"
              placeholder="nama-mu"
              value={fqdn}
              onChange={(e) => setFqdn(e.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
            <span className="domain">.sang.ceo</span>
          </div>
        </div>
        <div className="preset-row" role="group" aria-label="Tipe record">
          {TYPES.map((t) => (
            <button key={t} type="button" className="chip" aria-pressed={type === t} onClick={() => setType(t)}>
              {t}
            </button>
          ))}
        </div>
        <button type="submit" className="btn btn-ghost" disabled={state === "loading"}>
          {state === "loading" ? "Memeriksa..." : "Periksa record"}
        </button>
      </form>

      {state === "loading" && <p className="small muted">Menanyakan ke resolver Google...</p>}

      {state === "error" && (
        <div className="result">
          <p className="result-title" style={{ color: "var(--err)" }}>
            Pemeriksaan gagal
          </p>
          <p className="small muted" style={{ margin: "4px 0 0" }}>
            Koneksi ke resolver DNS Google bermasalah. Coba lagi, atau cek manual di{" "}
            <a href={`https://dns.google/query?name=${encodeURIComponent(fqdn)}.${SITE.zone}`} target="_blank" rel="noopener noreferrer">
              dns.google
            </a>
            .
          </p>
        </div>
      )}

      {state === "done" && (
        <div className="result" style={{ marginTop: 12 }}>
          {statusCode !== 0 ? (
            <p className="result-title" style={{ color: "var(--warn)" }}>
              Belum ada jawaban (status {statusCode})
            </p>
          ) : answer.length === 0 ? (
            <p className="result-title" style={{ color: "var(--warn)" }}>
              Domain menjawab, tapi belum ada record {type}
            </p>
          ) : (
            <>
              <p className="result-title" style={{ color: "var(--ok)" }}>
                Record {type} ditemukan
              </p>
              <div className="codeblock" style={{ marginTop: 8 }}>
                <pre>{answer.map((a) => a.data).join("\n")}</pre>
              </div>
            </>
          )}
          <p className="small muted" style={{ margin: "8px 0 0" }}>
            Record baru biasanya menyebar dalam hitungan menit. Kalau masih kosong beberapa
            lama setelah merge, laporkan di repo registry.
          </p>
        </div>
      )}
    </div>
  );
}
