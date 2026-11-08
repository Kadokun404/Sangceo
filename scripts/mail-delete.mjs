#!/usr/bin/env node
// Hapus akun mailbox sang.ceo di ruang.email (pelanggaran aturan / permintaan hapus).
// Usage: node scripts/mail-delete.mjs <email-lengkap>
// Kredensial dibaca dari .env.provision.local di root repo (lokal saja).

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const BASE_URL = "https://ruang.email";
const ZONE = "sang.ceo";

const env = Object.fromEntries(
  fs
    .readFileSync(path.join(ROOT, ".env.provision.local"), "utf8")
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()])
);
const OWNER_EMAIL = env.RUANG_OWNER_EMAIL;
const OWNER_PASS = env.RUANG_OWNER_PASS;

if (!OWNER_EMAIL || !OWNER_PASS) {
  console.error("Kredensial tidak ada di .env.provision.local.");
  process.exit(1);
}

const target = process.argv[2];
if (!target || !target.endsWith(`@${ZONE}`)) {
  console.error(`Usage: node scripts/mail-delete.mjs <email>@${ZONE}`);
  process.exit(1);
}

const res = await fetch(`${BASE_URL}/manage/api/delete-user`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ domain: ZONE, owner_pass: OWNER_PASS, email: target }),
});
const out = await res.json();

if (out.success) {
  console.log(`Akun ${target} dihapus. Jangan lupa hapus juga file klaimnya dari data/emails via PR.`);
} else {
  console.error(`Gagal menghapus ${target}:`, JSON.stringify(out));
  process.exit(1);
}
