"use client";

import { useMemo, useState } from "react";
import { SITE, newFileUrl } from "@/config";
import CopyButton from "./CopyButton";

type Mode = "mailbox" | "forward";

export default function EmailGenerator() {
  const [mode, setMode] = useState<Mode>("mailbox");
  const [address, setAddress] = useState("");
  const [forward, setForward] = useState("");
  const [owner, setOwner] = useState("");

  const cleanAddr = address.trim().toLowerCase();
  const validAddr = /^[a-z0-9]([a-z0-9._-]*[a-z0-9])?$/.test(cleanAddr);
  const validFwd = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forward.trim());

  const json = useMemo(() => {
    const base = {
      domain: SITE.zone,
      address: cleanAddr || "nama-mu",
      type: mode,
      owner: owner.trim() || "username-github-mu",
    };
    const obj =
      mode === "forward"
        ? { ...base, forward: forward.trim() || "email-pribadi@kamu.dev" }
        : base;
    return JSON.stringify(obj, null, 2);
  }, [mode, cleanAddr, owner, forward]);

  const filename = `emails/${cleanAddr || "nama-mu"}.json`;
  const ready = validAddr && cleanAddr !== "" && owner.trim() !== "" && (mode === "mailbox" || validFwd);

  return (
    <div className="split">
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="field">
          <label id="mode-label">Jenis email</label>
          <div className="preset-row" role="group" aria-labelledby="mode-label">
            <button type="button" className="chip" aria-pressed={mode === "mailbox"} onClick={() => setMode("mailbox")}>
              Akun mailbox (ruang.email)
            </button>
            <button type="button" className="chip" aria-pressed={mode === "forward"} onClick={() => setMode("forward")}>
              Terusan saja
            </button>
          </div>
        </div>

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
          ) : mode === "mailbox" ? (
            <p className="small muted" style={{ marginTop: 6 }}>
              Jatah mailbox gratis terbatas ({SITE.mailboxSlots} akun), jadi pilih nama yang
              benar-benar akan kamu pakai.
            </p>
          ) : null}
        </div>

        {mode === "forward" && (
          <div className="field">
            <label htmlFor="fwd">Diteruskan ke</label>
            <input id="fwd" className="input" type="email" placeholder="email-pribadi@kamu.dev" value={forward} onChange={(e) => setForward(e.target.value)} autoComplete="off" spellCheck={false} />
            <p className="small muted" style={{ marginTop: 6 }}>
              Surel yang masuk diteruskan ke alamat ini.
            </p>
          </div>
        )}

        <div className="field">
          <label htmlFor="eowner">Username GitHub</label>
          <input id="eowner" className="input" type="text" placeholder="username-github-mu" value={owner} onChange={(e) => setOwner(e.target.value)} autoComplete="off" spellCheck={false} />
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
              Isi nama alamat{mode === "forward" ? ", email tujuan," : ""} dan username GitHub untuk
              membuka editor GitHub.
            </span>
          )}
        </p>
        <p className="small muted">
          {mode === "mailbox"
            ? "Setelah PR di-merge, pengelola membuat akunnya di portal ruang.email dan mengirim sandi awal lewat surel. Jangan pernah menaruh password di repo."
            : "Setelah PR di-merge, rute penerusan dipasang oleh pengelola, lalu alamatmu mulai menerima surel."}
        </p>
      </div>
    </div>
  );
}
