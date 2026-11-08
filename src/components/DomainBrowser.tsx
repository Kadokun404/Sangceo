"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { DomainEntry } from "@/lib/types";
import { SITE } from "@/config";
import { recordSummary } from "@/lib/types";

export default function DomainBrowser({
  domains,
  compact = false,
}: {
  domains: DomainEntry[];
  compact?: boolean;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return domains;
    return domains.filter(
      (d) =>
        d.subdomain.toLowerCase().includes(q) ||
        (d.owner || "").toLowerCase().includes(q) ||
        (d.description || "").toLowerCase().includes(q)
    );
  }, [domains, query]);

  const visible = compact ? filtered.slice(0, 8) : filtered;

  return (
    <div style={{ marginTop: compact ? 20 : 24 }}>
      {!compact && (
        <div className="field" style={{ maxWidth: 380, marginBottom: 12 }}>
          <label htmlFor="cari">Cari</label>
          <input
            id="cari"
            className="input"
            style={{ fontFamily: "var(--sans)" }}
            type="search"
            placeholder="Nama, pemilik, atau deskripsi"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      )}

      {visible.length === 0 ? (
        query ? (
          <div className="empty">
            Tidak ada hasil untuk &ldquo;{query}&rdquo;. Coba kata kunci lain, atau{" "}
            <Link href="/check">cek apakah namanya masih bebas</Link>.
          </div>
        ) : (
          <div className="empty">
            Belum ada subdomain yang diklaim. <Link href="/daftar">Jadilah yang pertama</Link>.
          </div>
        )
      ) : (
        <>
          <div className="table-scroll">
            <table className="registry">
              <thead>
                <tr>
                  <th>Subdomain</th>
                  <th>Pemilik</th>
                  <th>Deskripsi</th>
                  <th>Record</th>
                  <th>Repo</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((d) => (
                  <tr key={d.subdomain}>
                    <td>
                      {d.repo ? (
                        <a className="domain" href={`https://${d.subdomain}.${SITE.zone}`} target="_blank" rel="noopener noreferrer">
                          {d.subdomain}
                          <span className="zone">.{SITE.zone}</span>
                        </a>
                      ) : (
                        <span className="domain">
                          {d.subdomain}
                          <span className="zone">.{SITE.zone}</span>
                        </span>
                      )}
                    </td>
                    <td>{d.owner}</td>
                    <td className="muted">{d.description || "-"}</td>
                    <td>
                      {recordSummary(d.records).map((r) => (
                        <span key={r} className="tag" style={{ display: "inline-block", marginRight: 6, marginBottom: 4 }}>
                          {r}
                        </span>
                      ))}
                    </td>
                    <td>
                      {d.repo ? (
                        <a href={`https://${d.repo.replace(/^https?:\/\//, "")}`} target="_blank" rel="noopener noreferrer">
                          repo
                        </a>
                      ) : (
                        <span className="muted">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {compact && filtered.length > 8 && (
            <p className="small" style={{ marginTop: 12 }}>
              <Link href="/domains">Lihat semua {filtered.length} subdomain</Link>
            </p>
          )}
        </>
      )}
    </div>
  );
}
