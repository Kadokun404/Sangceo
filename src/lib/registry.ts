import fs from "node:fs";
import path from "node:path";
import type { DomainEntry, EmailEntry } from "./types";

// Registry dibaca langsung dari file JSON di repo ini. Repo adalah database-nya:
// PR merge = data baru = Vercel rebuild otomatis, dan daftar di situs ikut bertambah.
// Server-only: jangan diimpor dari client component, pakai src/lib/types.ts.

function readJsonDir(dir: string): string[] {
  const full = path.join(process.cwd(), dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".json"))
    .sort((a, b) => a.localeCompare(b))
    .map((f) => fs.readFileSync(path.join(full, f), "utf8"));
}

export function getDomains(): DomainEntry[] {
  return readJsonDir("data/domains")
    .map((raw) => {
      try {
        return JSON.parse(raw) as DomainEntry;
      } catch {
        return null;
      }
    })
    .filter((e): e is DomainEntry => e !== null && typeof e.subdomain === "string")
    .sort((a, b) => a.subdomain.localeCompare(b.subdomain));
}

export function getEmails(): EmailEntry[] {
  return readJsonDir("data/emails")
    .map((raw) => {
      try {
        return JSON.parse(raw) as EmailEntry;
      } catch {
        return null;
      }
    })
    .filter((e): e is EmailEntry => e !== null && typeof e.address === "string")
    .sort((a, b) => a.address.localeCompare(b.address));
}

export function getTakenNames(): { subdomains: string[]; addresses: string[] } {
  return {
    subdomains: getDomains().map((d) => d.subdomain.toLowerCase()),
    addresses: getEmails().map((e) => e.address.toLowerCase()),
  };
}
