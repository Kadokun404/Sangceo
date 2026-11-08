#!/usr/bin/env node
// Provisioning otomatis akun mailbox sang.ceo di ruang.email.
// Dipakai workflow mail-provision.yml setelah PR mailbox merge ke main.
// Usage: node scripts/mail-create.mjs <BEFORE_SHA> <AFTER_SHA>
// Env wajib: RUANG_OWNER_EMAIL (akun pemilik domain, mis. admin@sang.ceo)
//            RUANG_OWNER_PASS  (password akun pemilik domain)

import { execSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";

const BASE_URL = "https://ruang.email";
const DOMAIN = "sang.ceo";
const OWNER_EMAIL = process.env.RUANG_OWNER_EMAIL;
const OWNER_PASS = process.env.RUANG_OWNER_PASS;
const QUOTA_MB = 1024;

if (!OWNER_EMAIL || !OWNER_PASS) {
  console.error("Secrets RUANG_OWNER_EMAIL dan RUANG_OWNER_PASS wajib di-set di repo.");
  process.exit(1);
}

const [before, after] = process.argv.slice(2);
if (!before || !after) {
  console.error("Usage: node scripts/mail-create.mjs <BEFORE_SHA> <AFTER_SHA>");
  process.exit(1);
}

// Daftar file email yang benar-benar BARU di commit ini (edit tidak memicu pembuatan ulang).
let files;
if (/^0+$/.test(before)) {
  files = execSync(`git ls-tree -r --name-only ${after} data/emails`, { encoding: "utf8" })
    .split("\n")
    .filter(Boolean);
} else {
  files = execSync(`git diff --name-only --diff-filter=A ${before} ${after} -- data/emails`, {
    encoding: "utf8",
  })
    .split("\n")
    .filter(Boolean);
}

const mailboxFiles = files.filter((f) => {
  if (!f.endsWith(".json")) return false;
  try {
    const data = JSON.parse(execSync(`git show ${after}:${f}`, { encoding: "utf8" }));
    return data.type === "mailbox";
  } catch {
    return false;
  }
});

if (mailboxFiles.length === 0) {
  console.log("Tidak ada klaim mailbox baru di commit ini.");
  process.exit(0);
}

async function post(path, payload) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

function genPassword() {
  return crypto.randomBytes(12).toString("base64url");
}

const results = [];
let failed = 0;

for (const file of mailboxFiles) {
  const data = JSON.parse(execSync(`git show ${after}:${file}`, { encoding: "utf8" }));
  const { address, owner, contact } = data;
  const email = `${address}@${DOMAIN}`;
  const password = genPassword();
  const row = { email, owner, contact, status: "", detail: "" };

  try {
    const created = await post("/manage/api/create-user", {
      domain: DOMAIN,
      owner_pass: OWNER_PASS,
      username: address,
      password,
      name: owner,
      quota_mb: QUOTA_MB,
    });

    if (!created.success) {
      row.status = "gagal membuat akun";
      row.detail = JSON.stringify(created);
      failed++;
      results.push(row);
      continue;
    }
    row.status = "akun dibuat";

    const bodyText = [
      `Halo ${owner},`,
      ``,
      `Klaim mailbox kamu sudah aktif.`,
      ``,
      `Alamat   : ${email}`,
      `Sandi awal: ${password}`,
      ``,
      `Langkah pertama: masuk ke ${BASE_URL}/webmail dengan alamat di atas, lalu SEGERA ganti sandi dari pengaturan.`,
      ``,
      `Parameter koneksi aplikasi (Gmail, Apple Mail, Outlook):`,
      `- SMTP (kirim): mx1.ruang.email port 465 (SSL) atau 587 (STARTTLS)`,
      `- IMAP (terima): mx1.ruang.email port 993 (SSL)`,
      `- Username: alamat lengkap ${email}`,
      ``,
      `Peringatan keamanan: sandi ini dikirim ke kontak yang kamu tulis di PR. Jangan bagikan ke siapa pun.`,
    ].join("\n");

    const sent = await post("/api/webmail/send", {
      email: OWNER_EMAIL,
      password: OWNER_PASS,
      to: contact,
      subject: `Akun ${email} aktif`,
      from_name: `${DOMAIN} Registry`,
      body_text: bodyText,
    });

    row.status = sent.success ? "akun dibuat, sandi terkirim" : "akun dibuat, kirim sandi gagal";
    if (!sent.success) {
      row.detail = JSON.stringify(sent);
      failed++;
    }
  } catch (e) {
    row.status = "error jaringan/API";
    row.detail = String(e);
    failed++;
  }
  results.push(row);
}

// Ringkasan untuk GITHUB_STEP_SUMMARY: tanpa password, selalu.
let summary = "## Provisioning mailbox\n\n| Alamat | Pemilik | Status |\n|---|---|---|\n";
for (const r of results) {
  summary += `| \`${r.email}\` | ${r.owner} | ${r.status} |\n`;
}
console.log(summary);
if (process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
}

if (failed > 0) {
  console.error(`${failed} klaim gagal diproses. Periksa detail di log di atas.`);
  process.exit(1);
}
