#!/usr/bin/env node
// Membuat dnsconfig.js dari data/domains/*.json untuk DNSControl.
// Dipakai scripts/sync.sh sebelum `dnscontrol push`. Zona disajikan di Cloudflare;
// registrar tidak diubah oleh registry ini (pakai NONE).
// Kredensial dibaca dari env: CLOUDFLARE_API_TOKEN dan CLOUDFLARE_ACCOUNT_ID,
// lalu ditulis ke creds.json (hanya di server, di-gitignore).

import fs from "node:fs";
import path from "node:path";

const ZONE = "sang.ceo";
const dir = "data/domains";

function esc(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

const entries = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")))
  .filter((e) => e.domain === ZONE);

// Semua record dikumpulkan tanpa koma di ujung; koma disisipkan antar baris
// saat dirakit, supaya tidak pernah ada koma menggantung.
const lines = [
  "  // Infrastruktur email zona (ruang.email)",
  '  MX("@", 10, "mx1.ruang.email.")',
  '  MX("@", 10, "mx3.ruang.email.")',
  '  TXT("@", "v=spf1 mx a:mx1.ruang.email a:mx3.ruang.email ~all")',
];

for (const e of entries) {
  lines.push(`  // ${e.subdomain} - ${e.owner}`);
  for (const [type, value] of Object.entries(e.records || {})) {
    const vals = Array.isArray(value) ? value : [value];
    for (const v of vals) {
      switch (type) {
        case "CNAME":
          lines.push(`  CNAME("${esc(e.subdomain)}", "${esc(String(v).replace(/\.$/, "") + ".")}")`);
          break;
        case "A":
        case "AAAA":
        case "TXT":
        case "NS":
          lines.push(`  ${type}("${esc(e.subdomain)}", "${esc(v)}")`);
          break;
        case "MX": {
          const parts = String(v).trim().split(/\s+/);
          const prio = /^\d+$/.test(parts[0]) ? Number(parts.shift()) : 10;
          const target = parts.join(" ").replace(/\.$/, "") + ".";
          lines.push(`  MX("${esc(e.subdomain)}", ${prio}, "${esc(target)}")`);
          break;
        }
        default:
          lines.push(`  // TODO: tipe ${type} belum dipetakan di gen-dnsconfig.mjs (nilai: ${esc(v)})`);
      }
    }
  }
}

// Nama relatif ("uji") dibiarkan DNSControl menggabungkan dengan zona.
// NO_PURGE: record yang tidak dideklarasikan di repo (DKIM, DMARC, verifikasi lain)
// tidak pernah dihapus. Registry hanya menambah/mengubah apa yang ada di data/domains.
const config = `// Dihasilkan oleh scripts/gen-dnsconfig.mjs dari data/domains/*.json. Jangan edit manual.
var REG_NONE = NewRegistrar("none");
var CF = NewDnsProvider("cloudflare");

D("${ZONE}", REG_NONE, DnsProvider(CF), NO_PURGE,
${lines.join(",\n")});
`;

fs.writeFileSync("dnsconfig.js", config);
fs.chmodSync("creds.json", 0o600);

// dnscontrol tidak mengembangkan sintaks "env:" di creds.json, jadi nilainya
// ditulis literal saat generate. File ini hanya ada di server dan di-gitignore.
fs.writeFileSync(
  "creds.json",
  JSON.stringify(
    {
      cloudflare: {
        TYPE: "CLOUDFLAREAPI",
        apitoken: process.env.CLOUDFLARE_API_TOKEN || "",
        accountid: process.env.CLOUDFLARE_ACCOUNT_ID || "",
      },
    },
    null,
    2
  ),
);

console.log(`dnsconfig.js dibuat untuk ${entries.length} entri subdomain.`);
