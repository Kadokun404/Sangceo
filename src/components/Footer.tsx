import Link from "next/link";
import { SITE, repoUrl } from "@/config";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap row">
        <span className="mono">{SITE.zone}</span>
        <span>Registry terbuka, dikelola lewat {SITE.repo} di GitHub.</span>
        <span style={{ marginLeft: "auto", display: "flex", gap: 16, flexWrap: "wrap" }}>
          <Link href="/terms">Ketentuan</Link>
          <Link href="/privacy">Privasi</Link>
          <Link href="/disclaimer">Disclaimer</Link>
          <Link href="/abuse">Penyalahgunaan</Link>
          <a href={repoUrl()} target="_blank" rel="noopener noreferrer">
            Repo
          </a>
        </span>
      </div>
    </footer>
  );
}
