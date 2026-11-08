"use client";

import { useMemo, useState } from "react";
import { SITE, newFileUrl } from "@/config";
import CopyButton from "./CopyButton";
import QuickClaim from "./QuickClaim";

const PRESETS = [
  { id: "vercel", label: "Vercel", target: "cname.vercel-dns.com", fixed: true },
  { id: "netlify", label: "Netlify", target: "nama-situs-mu.netlify.app", fixed: false },
  { id: "github", label: "GitHub Pages", target: "username-mu.github.io", fixed: false },
  { id: "cloudflare", label: "Cloudflare Pages", target: "nama-proyek-mu.pages.dev", fixed: false },
  { id: "custom", label: "Lainnya", target: "", fixed: false },
];

const RECORD_TYPES = ["CNAME", "A", "AAAA", "TXT", "MX", "NS", "SRV", "CAA", "PTR"];
const NAME_RE = /^(\*\.)?([a-z0-9]([a-z0-9-]*[a-z0-9])?)(\.([a-z0-9]([a-z0-9-]*[a-z0-9])?))*$/;

export default function Generator() {
  const [subdomain, setSubdomain] = useState("");
  const [preset, setPreset] = useState("vercel");
  const [recordType, setRecordType] = useState("CNAME");
  const [target, setTarget] = useState(PRESETS[0].target);
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [description, setDescription] = useState("");

  const cleanSub = subdomain.trim().toLowerCase().replace(/\.$/, "");
  const validSub = cleanSub === "" || NAME_RE.test(cleanSub);

  const presetDef = PRESETS.find((p) => p.id === preset)!;

  function pickPreset(id: string) {
    setPreset(id);
    const p = PRESETS.find((x) => x.id === id)!;
    setRecordType("CNAME");
    setTarget(p.target);
  }

  const json = useMemo(() => {
    const records: Record<string, string> = {};
    const t = target.trim();
    if (recordType && t) records[recordType] = recordType === "A" || recordType === "AAAA" ? t : t.replace(/\.$/, "");
    const obj: Record<string, unknown> = {
      domain: SITE.zone,
      subdomain: cleanSub || "nama-mu",
      owner: owner.trim() || "username-github-mu",
    };
    if (repo.trim()) obj.repo = repo.trim().replace(/^https?:\/\//, "");
    if (description.trim()) obj.description = description.trim();
    obj.records = Object.keys(records).length ? records : {};
    return JSON.stringify(obj, null, 2);
  }, [cleanSub, owner, repo, description, recordType, target]);

  const filename = `domains/${cleanSub || "nama-mu"}.${SITE.zone}.json`;
  const ready = validSub && cleanSub !== "" && owner.trim() !== "" && target.trim() !== "";

  return (
    <div className="split">
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="field">
          <label htmlFor="sub">Subdomain</label>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <input
              id="sub"
              className="input"
              style={{ flex: 1, minWidth: 160 }}
              type="text"
              placeholder="nama-mu"
              value={subdomain}
              onChange={(e) => setSubdomain(e.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
            <span className="domain">
              .<span className="zone">{SITE.zone}</span>
            </span>
          </div>
          {!validSub ? (
            <p className="small" style={{ color: "var(--err)", marginTop: 6 }}>
              Pakai huruf kecil, angka, dan tanda hubung. Nama bertingkat boleh, misal{" "}
              <span className="mono">api.app</span> atau <span className="mono">*.app</span>.
            </p>
          ) : (
            <p className="small muted" style={{ marginTop: 6 }}>
              Satu subdomain per orang per keperluan. Turunan di atas namamu sendiri boleh.
            </p>
          )}
        </div>

        <div className="field">
          <label id="preset-label">Platform tujuan</label>
          <div className="preset-row" role="group" aria-labelledby="preset-label">
            {PRESETS.map((p) => (
              <button key={p.id} type="button" className="chip" aria-pressed={preset === p.id} onClick={() => pickPreset(p.id)}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label htmlFor="rtype">
            Tipe record<span className="hint">sesuaikan kalau platformmu tidak pakai CNAME</span>
          </label>
          <select id="rtype" className="select" value={recordType} onChange={(e) => setRecordType(e.target.value)}>
            {RECORD_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="target">
            {recordType === "A" || recordType === "AAAA" ? "Alamat IP" : "Nilai target"}
            {presetDef.fixed ? <span className="hint">otomatis untuk {presetDef.label}</span> : null}
          </label>
          <input
            id="target"
            className="input"
            type="text"
            placeholder={recordType === "A" ? "203.0.113.10" : "host-tujuan"}
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <div className="field">
          <label htmlFor="owner">Username GitHub</label>
          <input id="owner" className="input" type="text" placeholder="username-github-mu" value={owner} onChange={(e) => setOwner(e.target.value)} autoComplete="off" spellCheck={false} />
        </div>

        <div className="field">
          <label htmlFor="repo">
            Repo project<span className="hint">opsional, ditampilkan di tabel</span>
          </label>
          <input id="repo" className="input" type="text" placeholder="github.com/username-mu/repo" value={repo} onChange={(e) => setRepo(e.target.value)} autoComplete="off" spellCheck={false} />
        </div>

        <div className="field">
          <label htmlFor="desc">
            Deskripsi<span className="hint">opsional, satu kalimat</span>
          </label>
          <input id="desc" className="input" style={{ fontFamily: "var(--sans)" }} type="text" placeholder="Situs pribadi dan portfolio." value={description} onChange={(e) => setDescription(e.target.value)} />
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
              Isi subdomain, username GitHub, dan target untuk membuka editor GitHub dengan JSON ini.
            </span>
          )}
        </p>
        <QuickClaim body={ready ? { kind: "subdomain", subdomain: cleanSub, cname: recordType === "CNAME" ? target.trim() : undefined } : null} />
        <p className="small muted">
          Tombol di atas membuka halaman file baru di repo registry dengan isi JSON sudah
          terisi. Periksa sebentar, lalu buat pull request-nya.
        </p>
      </div>
    </div>
  );
}
