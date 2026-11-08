"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SITE } from "@/config";

export default function Checker({
  subdomains,
  addresses,
}: {
  subdomains: string[];
  addresses: string[];
}) {
  const [kind, setKind] = useState<"sub" | "mail">("sub");
  const [name, setName] = useState("");

  const clean = name.trim().toLowerCase().replace(/\.$/, "");

  const validation = useMemo(() => {
    if (kind === "sub") {
      const ok = /^(\*\.)?([a-z0-9]([a-z0-9-]*[a-z0-9])?)(\.([a-z0-9]([a-z0-9-]*[a-z0-9])?))*$/.test(clean);
      return clean === "" || ok;
    }
    const ok = /^[a-z0-9]([a-z0-9._-]*[a-z0-9])?$/.test(clean);
    return clean === "" || ok;
  }, [clean, kind]);

  const taken =
    kind === "sub" ? subdomains.includes(clean) : addresses.includes(clean);

  const display =
    kind === "sub" ? (
      <>
        {clean}
        <span className="zone">.{SITE.zone}</span>
      </>
    ) : (
      <>
        {clean}
        <span className="zone">@{SITE.zone}</span>
      </>
    );

  return (
    <div>
      <div className="preset-row" role="group" aria-label="Jenis nama yang dicek">
        <button type="button" className="chip" aria-pressed={kind === "sub"} onClick={() => setKind("sub")}>
          Subdomain
        </button>
        <button type="button" className="chip" aria-pressed={kind === "mail"} onClick={() => setKind("mail")}>
          Alamat email
        </button>
      </div>

      <div className="field" style={{ maxWidth: 440 }}>
        <label htmlFor="nama">Nama yang mau dicek</label>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <input
            id="nama"
            className="input"
            style={{ flex: 1, minWidth: 160 }}
            type="text"
            placeholder={kind === "sub" ? "nama-mu" : "halo"}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
          <span className="domain">{kind === "sub" ? `.${SITE.zone}` : `@${SITE.zone}`}</span>
        </div>
      </div>

      {clean === "" ? (
        <p className="small muted">Ketik nama yang mau kamu klaim, hasilnya muncul di sini.</p>
      ) : !validation ? (
        <div className="result">
          <p className="result-title" style={{ color: "var(--err)" }}>
            Format belum sesuai
          </p>
          <p className="small muted" style={{ margin: "4px 0 0" }}>
            {kind === "sub"
              ? "Pakai huruf kecil, angka, dan tanda hubung. Turunan seperti api.app juga boleh."
              : "Pakai huruf kecil, angka, titik, dan tanda hubung."}
          </p>
        </div>
      ) : taken ? (
        <div className="result result-taken">
          <p className="result-title">
            <span className="domain">{display}</span> sudah diambil
          </p>
          <p className="small muted" style={{ margin: "4px 0 0" }}>
            Coba nama lain, atau lihat pemiliknya di <Link href="/domains">daftar domain</Link>.
            Kalau itu namamu dan ingin menambah turunan, buka file-nya di repo registry.
          </p>
        </div>
      ) : (
        <div className="result result-ok">
          <p className="result-title">
            <span className="domain">{display}</span> masih bebas
          </p>
          <p className="small muted" style={{ margin: "4px 0 0" }}>
            Belum ada yang mengklaim di registry.{" "}
            <Link href={kind === "sub" ? "/daftar" : "/email"}>
              Klaim sekarang lewat pull request
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  );
}
