// Konfigurasi registry. Ganti lewat env saat deploy (Vercel: Project Settings > Environment Variables).
export const SITE = {
  name: "sang.ceo",
  title: "sang.ceo · subdomain & email gratis",
  description:
    "Subdomain dan alamat email gratis untuk project kamu. Diklaim lewat pull request di GitHub, aktif setelah merge.",
  zone: "sang.ceo",
  // Mailbox gratis di Ruang.Email terbatas per domain.
  mailboxSlots: 3,
  mail: {
    webmail: "https://ruang.email/webmail",
    portal: "https://ruang.email/manage",
    guide: "https://ruang.email/guide",
    provider: "ruang.email",
    imapHost: "mx1.ruang.email",
    smtpHost: "mx1.ruang.email",
  },
  // Repo registry. Default untuk development lokal; di produksi set NEXT_PUBLIC_REPO.
  repo: process.env.NEXT_PUBLIC_REPO || "owner/sang-ceo-registry",
  branch: process.env.NEXT_PUBLIC_REPO_BRANCH || "main",
};

export function repoUrl(): string {
  return `https://github.com/${SITE.repo}`;
}

export function newFileUrl(filename: string, value: string): string {
  return `https://github.com/${SITE.repo}/new/${SITE.branch}?filename=${encodeURIComponent(
    filename
  )}&value=${encodeURIComponent(value)}`;
}

export function fileUrl(filename: string): string {
  return `https://github.com/${SITE.repo}/blob/${SITE.branch}/${filename}`;
}
