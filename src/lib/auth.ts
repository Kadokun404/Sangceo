// Sesi login GitHub. Disimpan di file lokal .sessions.json (di-gitignore), bukan di repo.
// Pemetaan login -> email utama GitHub disimpan di .claim-users.json untuk pengiriman
// sandi mailbox oleh runner lokal. Tidak ada data ini yang pernah masuk repo GitHub.
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { cookies } from "next/headers";

const ROOT = process.cwd();
const SESSIONS = path.join(ROOT, ".sessions.json");
const USERS = path.join(ROOT, ".claim-users.json");
const COOKIE = "sang_session";
const TTL_MS = 30 * 24 * 3600 * 1000;

type Session = { login: string; avatar: string; email: string; token: string; exp: number };

function loadJson<T>(file: string, fallback: T): T {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as T;
  } catch {
    return fallback;
  }
}

function saveJson(file: string, data: unknown) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), { mode: 0o600 });
}

export async function getSession(): Promise<Session | null> {
  const sid = (await cookies()).get(COOKIE)?.value;
  if (!sid) return null;
  const all = loadJson<Record<string, Session>>(SESSIONS, {});
  const s = all[sid];
  if (!s) return null;
  if (Date.now() > s.exp) {
    delete all[sid];
    saveJson(SESSIONS, all);
    return null;
  }
  return s;
}

export async function setSession(s: Omit<Session, "exp">): Promise<void> {
  const sid = crypto.randomBytes(24).toString("base64url");
  const all = loadJson<Record<string, Session>>(SESSIONS, {});
  all[sid] = { ...s, exp: Date.now() + TTL_MS };
  saveJson(SESSIONS, all);
  (await cookies()).set(COOKIE, sid, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: TTL_MS / 1000,
  });
}

export async function clearSession(): Promise<void> {
  const jar = await cookies();
  const sid = jar.get(COOKIE)?.value;
  if (sid) {
    const all = loadJson<Record<string, Session>>(SESSIONS, {});
    delete all[sid];
    saveJson(SESSIONS, all);
  }
  jar.delete(COOKIE);
}

// Dipakai runner lokal: email utama terverifikasi GitHub pemilik login.
export function claimUserEmail(login: string): string | null {
  const all = loadJson<Record<string, { email: string; updated: string }>>(USERS, {});
  return all[login]?.email ?? null;
}

export function saveClaimUser(login: string, email: string): void {
  const all = loadJson<Record<string, { email: string; updated: string }>>(USERS, {});
  all[login] = { email, updated: new Date().toISOString() };
  saveJson(USERS, all);
}
