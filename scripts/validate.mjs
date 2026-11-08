#!/usr/bin/env node
// Validasi file klaim di pull request. Dipakai workflow validate-pr.yml.
// Keluar: exit 1 kalau ada file salah, dan mencetak ringkasan untuk komentar bot.

import { execSync } from "node:child_process";
import fs from "node:fs";

const BASE = process.argv[2]; // contoh: origin/main
const ZONE = "sang.ceo";

const changed = execSync(`git diff --name-only --diff-filter=ACM ${BASE}...HEAD`, {
  encoding: "utf8",
})
  .split("\n")
  .filter((f) => f.startsWith("data/") && f.endsWith(".json"));

const NAME_RE = /^([a-z0-9]([a-z0-9-]*[a-z0-9])?)(\.([a-z0-9]([a-z0-9-]*[a-z0-9])?))*$/;
const EMAIL_RE = /^[a-z0-9]([a-z0-9._-]*[a-z0-9])?$/;
const ADDR_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Nama yang sudah ada di main, untuk cek duplikat lintas file.
const existing = {
  sub: new Set(
    execSync(`git ls-tree -r --name-only ${BASE} -- data/domains`, { encoding: "utf8" })
      .split("\n")
      .filter(Boolean)
      .map((f) => f.split("/").pop().replace(`.${ZONE}.json`, "").replace(".json", ""))
  ),
  mail: new Set(
    execSync(`git ls-tree -r --name-only ${BASE} -- data/emails`, { encoding: "utf8" })
      .split("\n")
      .filter(Boolean)
      .map((f) => f.split("/").pop().replace(".json", ""))
  ),
};

const errors = [];
const previews = [];

for (const file of changed) {
  const rel = file;
  let data;
  try {
    data = JSON.parse(fs.readFileSync(rel, "utf8"));
  } catch (e) {
    errors.push(`\`${rel}\`: bukan JSON valid (${e.message})`);
    continue;
  }

  if (rel.startsWith("data/domains/")) {
    const { domain, subdomain, owner, records } = data;
    if (domain !== ZONE) errors.push(`\`${rel}\`: \`domain\` harus \`${ZONE}\``);
    if (!subdomain || !NAME_RE.test(subdomain))
      errors.push(`\`${rel}\`: \`subdomain\` tidak valid (huruf kecil, angka, tanda hubung)`);
    if (!owner) errors.push(`\`${rel}\`: \`owner\` (username GitHub) wajib`);
    if (!records || typeof records !== "object" || Object.keys(records).length === 0)
      errors.push(`\`${rel}\`: \`records\` wajib berisi minimal satu record`);
    if (subdomain && existing.sub.has(subdomain) && !rel.endsWith(`/${subdomain}.${ZONE}.json`))
      errors.push(`\`${rel}\`: subdomain \`${subdomain}\` sudah diklaim orang lain`);
    if (subdomain && records?.CNAME && NAME_RE.test(subdomain)) {
      if (typeof records.CNAME !== "string")
        errors.push(`\`${rel}\`: CNAME harus berupa string tunggal`);
      if (String(records.CNAME).toLowerCase().startsWith(`${subdomain}.${ZONE}`))
        errors.push(`\`${rel}\`: CNAME tidak boleh menunjuk ke namanya sendiri`);
    }
    if (!errors.some((e) => e.startsWith(`\`${rel}\``))) {
      const rec = Object.entries(records || {})
        .map(([t, v]) => `${t} ${Array.isArray(v) ? v.join(", ") : v}`)
        .join(" · ");
      previews.push(`| \`${subdomain}.${ZONE}\` | ${owner} | ${data.description || "-"} | ${rec} |`);
    }
  } else if (rel.startsWith("data/emails/")) {
    const { domain, address, owner, type, forward } = data;
    if (domain !== ZONE) errors.push(`\`${rel}\`: \`domain\` harus \`${ZONE}\``);
    if (!address || !EMAIL_RE.test(address))
      errors.push(`\`${rel}\`: \`address\` tidak valid (huruf kecil, angka, titik, tanda hubung)`);
    if (!owner) errors.push(`\`${rel}\`: \`owner\` (username GitHub) wajib`);
    if (type !== "mailbox" && type !== "forward")
      errors.push(`\`${rel}\`: \`type\` harus \`mailbox\` atau \`forward\``);
    if (type === "forward" && (!forward || !ADDR_RE.test(forward)))
      errors.push(`\`${rel}\`: \`forward\` harus berupa alamat email yang valid`);
    if (address && existing.mail.has(address) && !rel.endsWith(`/${address}.json`))
      errors.push(`\`${rel}\`: alamat \`${address}\` sudah diklaim orang lain`);
    if (!errors.some((e) => e.startsWith(`\`${rel}\``))) {
      previews.push(
        `| \`${address}@${ZONE}\` | ${owner} | ${type === "mailbox" ? "mailbox" : `terusan ke \`${forward}\``} |`
      );
    }
  }
}

if (previews.length > 0) {
  const isMail = previews[0].includes("@");
  console.log(
    isMail
      ? "### Pratinjau klaim email\n\n| Alamat | Pemilik | Jenis |\n|---|---|---|\n" +
          previews.join("\n")
      : "### Pratinjau klaim subdomain\n\n| Subdomain | Pemilik | Deskripsi | Record |\n|---|---|---|---|\n" +
          previews.join("\n")
  );
}

if (errors.length > 0) {
  console.error("### Perlu diperbaiki\n\n" + errors.map((e) => `- ${e}`).join("\n"));
  process.exit(1);
}
console.log("Semua file klaim lolos validasi.");
