# sang.ceo

Registry subdomain dan email gratis untuk zona **sang.ceo**. Dibangun dengan Next.js
(App Router, TypeScript). Sistemnya sengaja sederhana: **repo GitHub ini adalah
database-nya**. Satu klaim = satu file JSON, masuk lewat pull request.

```
sang-ceo/
├── data/
│   ├── domains/        # satu file per subdomain: nama.sang.ceo.json
│   └── emails/         # satu file per alamat: nama.json
├── src/
│   ├── app/            # halaman: beranda, /domains, /check, /daftar, /email, legal
│   ├── components/     # Generator, EmailGenerator, Checker, DomainBrowser, tema
│   ├── config.ts       # SITE.zone, repo registry (env NEXT_PUBLIC_REPO)
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

- **DNS**: zona `sang.ceo` di Cloudflare. Saat PR merge, pasang record-nya
  (bisa otomatis dengan [DNSControl](https://dnscontrol.org) + action seperti
  `dnscontrol-actions`, atau manual lewat dashboard).
- **Email**: aktifkan Cloudflare Email Routing untuk zona, lalu tambahkan rute
  penerusan `alamat@sang.ceo` ke email pemilik setelah PR merge.

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
