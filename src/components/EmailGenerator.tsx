"use client";

import { useMemo, useState } from "react";
import { SITE, newFileUrl } from "@/config";
import CopyButton from "./CopyButton";

export default function EmailGenerator() {
  const [address, setAddress] = useState("");
  const [owner, setOwner] = useState("");

  const cleanAddr = address.trim().toLowerCase();
  const validAddr = /^[a-z0-9]([a-z0-9._-]*[a-z0-9])?$/.test(cleanAddr);

  const json = useMemo(
    () =>
      JSON.stringify(
        {
          domain: SITE.zone,
          address: cleanAddr || "nama-mu",
          type: "mailbox",
          owner: owner.trim() || "username-github-mu",
        },
        null,
        2
      ),
    [cleanAddr, owner]
  );

  const filename = `emails/${cleanAddr || "nama-mu"}.json`;
  const ready = validAddr && cleanAddr !== "" && owner.trim() !== "";

  return (
    <div className="split">
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="field">
          <label htmlFor="addr">Nama alamat</label>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <input id="addr" className="input" style={{ flex: 1, minWidth: 160 }} type="text" placeholder="halo" value={address} onChange={(e) => setAddress(e.target.value)} autoComplete="off" spellCheck={false} />
            <span className="domain">
              @<span className="zone">{SITE.zone}</span>
            </span>
          </div>
          {!validAddr ? (
            <p className="small" style={{ color: "var(--err)", marginTop: 6 }}>
              Pakai huruf kecil, angka, titik, dan tanda hubung.
            </p>
          ) : (
            <p className="small muted" style={{ marginTop: 6 }}>
              Jatah mailbox gratis terbatas ({SITE.mailboxSlots} akun), jadi pilih nama yang
              benar-benar akan kamu pakai.
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="eowner">Username GitHub</label>
          <input id="eowner" className="input" type="text" placeholder="username-github-mu" value={owner} onChange={(e) => setOwner(e.target.value)} autoComplete="off" spellCheck={false} />
          <p className="small muted" style={{ marginTop: 6 }}>
            Sandi awal dikirim ke email akun GitHub ini setelah PR merge. Pastikan emailmu
            bisa menerima surel: tampilkan publik di profil, atau commit memakai email asli.
          </p>
        </div>
      </form>

      <div>
        <div className="code-head">
          <span className="fname">{filename}</span>
          <CopyButton text={json} label="Copy JSON" />
        </div>
        <div className="codeblock">
          <pre>{json}</pre>
        </div>
        <p style={{ marginTop: 16 }}>
          {ready ? (
            <a className="btn btn-primary" href={newFileUrl(filename, json)} target="_blank" rel="noopener noreferrer">
              Buka GitHub, filenya sudah terisi
            </a>
          ) : (
            <span className="small muted">
              Isi nama alamat dan username GitHub untuk membuka editor GitHub.
            </span>
          )}
        </p>
        <p className="small muted">
          Setelah PR di-merge, akunmu dibuat otomatis di ruang.email dan sandi awal dikirim
          ke email akun GitHub yang membuka PR. Ganti sandi segera setelah masuk.
        </p>
      </div>
    </div>
  );
}
