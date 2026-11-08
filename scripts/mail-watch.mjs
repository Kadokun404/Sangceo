#!/usr/bin/env node
// Runner lokal: memantau klaim mailbox baru di repo registry dan membuat akunnya
// di ruang.email menggunakan kredensial dari file .env.provision.local.
// Kredensial TIDAK disimpan di repo GitHub. Jalankan lewat cron, mis. tiap 5 menit:
//   cd /root/sang-ceo && git pull --ff-only && node scripts/mail-watch.mjs
// State pemrosesan ada di .state-mail.json (di-gitignore).

import { execSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const BASE_URL = "https://ruang.email";
const ZONE = "sang.ceo";
const QUOTA_MB = 1024;

// Repo GitHub tempat registry hidup, dibaca dari origin.
const REPO = (() => {
  const url = execSync("git remote get-url origin", { cwd: ROOT, encoding: "utf8" }).trim();
  return url.replace(/^https:\/\/github\.com\//, "").replace(/\.git$/, "").replace(/^[^@]+@github\.com:/, "");
})();

async function ghGet(pathname) {
  const res = await fetch(`https://api.github.com${pathname}`, {
    headers: { Accept: "application/vnd.github+json", "User-Agent": "sang-ceo-registry" },
  });
  return res.json();
}

// Penerima sandi: email publik akun GitHub pembuka PR; bila tidak ada, email author
// commit. Alamat noreply GitHub tidak bisa menerima surel, jadi tidak dipakai.
async function resolveRecipient(file) {
  const shas = execSync(`git log --diff-filter=A --format=%H -- data/emails/${file}`, {
    cwd: ROOT,
    encoding: "utf8",
  })
    .split("\n")
    .filter(Boolean);
  if (shas.length === 0) return { email: null, reason: "tidak ada commit yang menambahkan file" };
  const sha = shas[shas.length - 1];

  try {
    const prs = await ghGet(`/repos/${REPO}/commits/${sha}/pulls`);
    if (Array.isArray(prs) && prs.length > 0) {
      const user = await ghGet(`/users/${prs[0].user.login}`);
      if (user.email) return { email: user.email, via: `email publik GitHub @${prs[0].user.login}` };
    }
  } catch {
    // API GitHub gagal (mis. limit); lanjut ke email author commit.
  }

  const authorEmail = execSync(`git log --format=%ae -1 ${sha}`, { cwd: ROOT, encoding: "utf8" }).trim();
  if (/@users\.noreply\.github\.com$/.test(authorEmail)) {
    return {
      email: null,
      reason: "email GitHub pengklaim tidak publik dan commit memakai alamat noreply; minta pengklaim menampilkan email publik",
    };
  }
  return { email: authorEmail, via: "email author commit" };
}

function loadEnv(file) {
  if (!fs.existsSync(file)) return {};
  return Object.fromEntries(
    fs
      .readFileSync(file, "utf8")
      .split("\n")
      .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
      .map((l) => {
        const i = l.indexOf("=");
        return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
      })
  );
}

const env = { ...loadEnv(path.join(ROOT, ".env.provision.local")), ...process.env };
const OWNER_EMAIL = env.RUANG_OWNER_EMAIL;
const OWNER_PASS = env.RUANG_OWNER_PASS;

if (!OWNER_EMAIL || !OWNER_PASS) {
  console.error("Kredensial tidak ada: isi .env.provision.local (RUANG_OWNER_EMAIL, RUANG_OWNER_PASS).");
  process.exit(1);
}

const stateFile = path.join(ROOT, ".state-mail.json");
const state = fs.existsSync(stateFile) ? JSON.parse(fs.readFileSync(stateFile, "utf8")) : {};

const emailsDir = path.join(ROOT, "data/emails");
const files = fs.existsSync(emailsDir) ? fs.readdirSync(emailsDir).filter((f) => f.endsWith(".json")) : [];

const post = async (p, d) =>
  (
    await fetch(`${BASE_URL}${p}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(d),
    })
  ).json();

let dirty = false;

for (const file of files) {
  if (state[file]) continue;
  let data;
  try {
    data = JSON.parse(fs.readFileSync(path.join(emailsDir, file), "utf8"));
  } catch {
    continue; // file tidak valid, biarkan bot validasi yang menolaknya di PR
  }
  if (data.type !== "mailbox" || !data.address) continue;

  const email = `${data.address}@${ZONE}`;
  const recipient = await resolveRecipient(file);
  if (!recipient.email) {
    state[file] = `skip: ${recipient.reason}`;
    console.log(`${email}: ${state[file]}`);
    dirty = true;
    continue;
  }
  const password = crypto.randomBytes(12).toString("base64url");

  const created = await post("/manage/api/create-user", {
    domain: ZONE,
    owner_pass: OWNER_PASS,
    username: data.address,
    password,
    name: data.owner ?? data.address,
    quota_mb: QUOTA_MB,
  });

  if (!created.success) {
    const msg = JSON.stringify(created);
    // Akun sudah ada dianggap selesai (mis. dibuat manual lewat portal).
    if (/exist|ada|duplicate|sudah/i.test(msg)) {
      state[file] = "skip: akun sudah ada";
      console.log(`${email}: sudah ada, dilewati`);
      dirty = true;
      continue;
    }
    console.error(`${email}: gagal dibuat, dicoba lagi di sikap berikutnya: ${msg}`);
    continue; // tidak ditandai supaya dicoba ulang
  }

  const bodyText = [
    `Halo ${data.owner ?? "pengguna"},`,
    ``,
    `Klaim mailbox kamu sudah aktif.`,
    ``,
    `Alamat    : ${email}`,
    `Sandi awal: ${password}`,
    ``,
    `Langkah pertama: masuk ke ${BASE_URL}/webmail dengan alamat di atas, lalu SEGERA ganti sandi dari pengaturan.`,
    ``,
    `Sandi ini dikirim ke ${recipient.via}. Jangan bagikan ke siapa pun.`,
    ``,
    `Parameter koneksi aplikasi (Gmail, Apple Mail, Outlook):`,
    `- SMTP (kirim): mx1.ruang.email port 465 (SSL) atau 587 (STARTTLS)`,
    `- IMAP (terima): mx1.ruang.email port 993 (SSL)`,
    `- Username: ${email}`,
  ].join("\n");

  const sent = await post("/api/webmail/send", {
    email: OWNER_EMAIL,
    password: OWNER_PASS,
    to: recipient.email,
    subject: `Akun ${email} aktif`,
    from_name: `${ZONE} Registry`,
    body_text: bodyText,
  });

  state[file] = sent.success ? "done" : "dibuat, kirim sandi gagal";
  console.log(`${email}: ${state[file]}`);
  dirty = true;
}

if (dirty) fs.writeFileSync(stateFile, JSON.stringify(state, null, 2) + "\n");
