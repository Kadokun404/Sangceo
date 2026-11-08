import { SITE } from "@/config";

export const metadata = { title: "Disclaimer · sang.ceo" };

export default function DisclaimerPage() {
  return (
    <section className="section">
      <div className="wrap" style={{ maxWidth: 720 }}>
        <h1>Disclaimer</h1>
        <p>
          {SITE.zone} adalah proyek komunitas yang dijalankan terbuka lewat repo registry.
          Layanan ini tidak berafiliasi dengan Vercel, Netlify, GitHub, Cloudflare, atau platform
          lain yang disebut sebagai tujuan record.
        </p>
        <p>
          Nama merek dan logo pihak ketiga tetap milik pemiliknya. Penyebutan platform di situs
          ini hanya untuk menjelaskan cara mengarahkan subdomain.
        </p>
        <p>
          Konten yang tampil di setiap subdomain sepenuhnya tanggung jawab pemiliknya, bukan
          pengelola zona.
        </p>
      </div>
    </section>
  );
}
