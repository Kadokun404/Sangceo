// Tipe dan fungsi murni yang dipakai bersama oleh server dan client component.
// Fungsi baca file ada di registry.ts (server-only), jangan diimpor dari sini.

export type DomainEntry = {
  domain: string;
  subdomain: string;
  owner: string;
  repo?: string;
  description?: string;
  records: Record<string, string | string[]>;
};

export type EmailEntry = {
  domain: string;
  address: string;
  owner: string;
  forward: string;
};

export function recordSummary(records: DomainEntry["records"]): string[] {
  return Object.entries(records).map(([type, value]) => {
    const target = Array.isArray(value) ? value.join(", ") : value;
    return `${type} ${target}`;
  });
}
