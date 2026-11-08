#!/usr/bin/env node
// Hapus akun mailbox sang.ceo di ruang.email (untuk pelanggaran aturan atau permintaan hapus).
// Usage: node scripts/mail-delete.mjs <email-lengkap>
// Env wajib: RUANG_OWNER_PASS

import { execSync } from "node:child_process";

const BASE_URL = "https://ruang.email";
const DOMAIN = "sang.ceo";
const OWNER_EMAIL = process.env.RUANG_OWNER_EMAIL;
const OWNER_PASS = process.env.RUANG_OWNER_PASS;

if (!OWNER_EMAIL || !OWNER_PASS) {
  console.error("Secrets RUANG_OWNER_EMAIL dan RUANG_OWNER_PASS wajib di-set di repo.");
  process.exit(1);
}

const target = process.argv[2];
if (!target || !target.endsWith(`@${DOMAIN}`)) {
  console.error(`Usage: node scripts/mail-delete.mjs <email>@${DOMAIN}`);
  process.exit(1);
}

const res = await fetch(`${BASE_URL}/manage/api/delete-user`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ domain: DOMAIN, owner_pass: OWNER_PASS, email: target }),
});
const out = await res.json();

if (out.success) {
  console.log(`Akun ${target} dihapus. Jangan lupa hapus juga file klaimnya dari data/emails via PR.`);
} else {
  console.error(`Gagal menghapus ${target}:`, JSON.stringify(out));
  process.exit(1);
}
