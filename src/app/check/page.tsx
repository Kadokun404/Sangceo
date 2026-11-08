import { getTakenNames } from "@/lib/registry";
import { repoUrl } from "@/config";
import Checker from "@/components/Checker";
import DnsTool from "@/components/DnsTool";

export const dynamic = "force-static";

export const metadata = {
  title: "Cek nama · sang.ceo",
  description: "Cek apakah subdomain atau alamat email di sang.ceo masih bebas diklaim.",
};

export default function CheckPage() {
  const { subdomains, addresses } = getTakenNames();

  return (
    <section className="section">
      <div className="wrap">
        <h1>Cek nama</h1>
        <p className="muted" style={{ maxWidth: "60ch" }}>
          Data diambil dari repo registry saat situs ini dibangun. Nama yang muncul di{" "}
          <a href={`${repoUrl()}/pulls`} target="_blank" rel="noopener noreferrer">
            pull request terbuka
          </a>{" "}
          tapi belum merge belum terhitung di sini.
        </p>
        <div style={{ marginTop: 24 }}>
          <Checker subdomains={subdomains} addresses={addresses} />
        <DnsTool />
        </div>
      </div>
    </section>
  );
}