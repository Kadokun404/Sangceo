#!/usr/bin/env node
// Membuat dnsconfig.js dari data/domains/*.json untuk DNSControl.
// Dipakai workflow dns-push.yml sebelum `dnscontrol push`. Zona disajikan di Cloudflare;
// registrar tidak diubah oleh registry ini (pakai NONE).
// Kredensial dibaca dari env: CLOUDFLARE_API_TOKEN dan CLOUDFLARE_ACCOUNT_ID.

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

let body = "";
for (const e of entries) {
  body += `  // ${e.subdomain} — ${e.owner}\n`;
  for (const [type, value] of Object.entries(e.records || {})) {
    const vals = Array.isArray(value) ? value : [value];
    for (const v of vals) {
      switch (type) {
        case "CNAME":
          body += `  CNAME("${esc(e.subdomain)}", "${esc(String(v).replace(/\.$/, ""))}"),\n`;
          break;
        case "A":
        case "AAAA":
        case "TXT":
        case "NS":
          body += `  ${type}("${esc(e.subdomain)}", "${esc(v)}"),\n`;
          break;
        case "MX": {
          const parts = String(v).trim().split(/\s+/);
          const prio = /^\d+$/.test(parts[0]) ? Number(parts.shift()) : 10;
          body += `  MX("${esc(e.subdomain)}", ${prio}, "${esc(parts.join(" "))}"),\n`;
          break;
        }
        default:
          body += `  // TODO: tipe ${type} belum dipetakan di gen-dnsconfig.mjs (nilai: ${esc(v)})\n`;
      }
    }
  }
}

// Nama relatif ("uji") dibiarkan DNSControl menggabungkan dengan zona.
const config = `// Dihasilkan oleh scripts/gen-dnsconfig.mjs dari data/domains/*.json. Jangan edit manual.
var REG_NONE = NewRegistrar("none");
var CF = NewDnsProvider("cloudflare");

D("${ZONE}", REG_NONE, CF,
  // Infrastruktur email zona (ruang.email)
  MX("@", 10, "mx1.ruang.email"),
  MX("@", 10, "mx3.ruang.email"),
  TXT("@", "v=spf1 mx a:mx1.ruang.email a:mx3.ruang.email ~all"),
${body}});
`;

fs.writeFileSync("dnsconfig.js", config);

fs.writeFileSync(
  "creds.json",
  JSON.stringify(
    {
      cloudflare: {
        TYPE: "CLOUDFLAREAPI",
        apitoken: "env:CLOUDFLARE_API_TOKEN",
        accountid: "env:CLOUDFLARE_ACCOUNT_ID",
      },
    },
    null,
    2
  )
);

console.log(`dnsconfig.js dibuat untuk ${entries.length} entri subdomain.`);
