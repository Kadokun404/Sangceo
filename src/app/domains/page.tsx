import Link from "next/link";
import { getDomains } from "@/lib/registry";
import DomainBrowser from "@/components/DomainBrowser";

export const dynamic = "force-static";

export const metadata = {
  title: "Daftar domain · sang.ceo",
  description: "Semua subdomain yang sudah diklaim di sang.ceo, lengkap dengan pemilik dan record-nya.",
};

export default function DomainsPage() {
  const domains = getDomains();

  return (
    <section className="section">
      <div className="wrap-wide">
        <h1>Daftar domain</h1>
        <p className="muted" style={{ maxWidth: "60ch" }}>
          {domains.length > 0
            ? `${domains.length} subdomain terdaftar. Klik nama untuk membuka situsnya, data diambil langsung dari repo registry.`
            : "Semua subdomain yang diklaim akan muncul di sini begitu PR-nya di-merge."}
        </p>
        <DomainBrowser domains={domains} />
        <p className="small muted" style={{ marginTop: 24 }}>
          Ingin namamu muncul di sini?{" "}
          <Link href="/daftar">Ikuti cara klaim</Link> atau{" "}
          <Link href="/check">cek dulu ketersediaannya</Link>.
        </p>
      </div>
    </section>
  );
}
