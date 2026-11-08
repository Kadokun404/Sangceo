# sang.ceo

Registry subdomain dan email gratis untuk zona **sang.ceo**. Dibangun dengan Next.js
(App Router, TypeScript). Sistemnya sengaja sederhana: **repo GitHub ini adalah
database-nya**. Satu klaim = satu file JSON, masuk lewat pull request.

```
sang-ceo/
├── data/
│   ├── domains/        # satu file per subdomain: nama.sang.ceo.json
│   └── emails/         # satu file per alamat: nama.json (mailbox / forward)
├── scripts/
│   ├── validate.mjs    # validasi klaim, dipakai workflow validate-pr.yml
│   └── gen-dnsconfig.mjs # hasilkan dnsconfig.js untuk DNSControl
├── .github/workflows/  # validasi PR + push DNS otomatis
├── src/
│   ├── app/            # halaman: beranda, /domains, /check, /daftar, /email, legal
│   ├── components/     # Generator, EmailGenerator, Checker, DnsTool, tema
│   ├── config.ts       # SITE.zone, repo registry, endpoint ruang.email (env)
│   └── lib/registry.ts # membaca data/*.json saat build
└── DESIGN.md           # arah desain situs
```

## Cara kerja sistem

1. Orang fork repo, tambah `domains/nama.sang.ceo.json` (atau `emails/nama.json`), buka PR.
   Generator di situs membuat JSON dan tombolnya membuka editor GitHub dengan isi terisi
   (`?filename=...&value=...`).
2. PR di-review dan di-merge.
3. Vercel mendeploy ulang otomatis dari GitHub, jadi halaman daftar langsung memuat nama baru.

## Yang perlu diatur di sisi pengelola (sekali saja)

- **DNS**: zona `sang.ceo` di Cloudflare. Buat API token Cloudflare dengan izin edit
  zona, simpan sebagai secret `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` di repo.
  Workflow `dns-push.yml` otomatis mem-push semua record saat PR merge: jalurnya
  `scripts/gen-dnsconfig.mjs` (membaca `data/domains/*.json` menjadi `dnsconfig.js`)
  lalu DNSControl.
- **Email mailbox**: daftarkan zona `sang.ceo` di [ruang.email](https://ruang.email/register),
  pasang 5 record wajibnya (2 MX, SPF, DKIM, DMARC) di Cloudflare, lalu verifikasi.
  Akun pemilik domain di ruang.email adalah pintu masuk [portal kelola](https://ruang.email/manage)
  tempat akun mailbox dibuat. SOP per klaim mailbox:
  1. PR `emails/nama.json` dengan `type: "mailbox"` di-merge.
  2. Buat akun di portal kelola, isikan kuota 10 GB.
  3. Kirim sandi awal ke pengklaim (via surel dari PR/issue, bukan lewat repo).
  4. Pengklaim ganti sandi dari webmail.
  Jatah gratis 3 akun; bila penuh, ajukan tambahan kapasitas ke admin ruang.email
  atau arahkan pengklaim ke mode terusan.
- **Email terusan**: aktifkan Cloudflare Email Routing untuk zona, lalu tambahkan rute
  `alamat@sang.ceo` ke email pemilik setelah PR merge.

## Konfigurasi

Set env sebelum deploy:

```
NEXT_PUBLIC_REPO=username/nama-repo-registry
NEXT_PUBLIC_REPO_BRANCH=main   # opsional, default main
```

## Menjalankan lokal

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build produksi
```

Halaman daftar dan cek nama dibaca saat build (statis), jadi tidak butuh API apa pun.
