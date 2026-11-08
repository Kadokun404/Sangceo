# sang.ceo

Registry subdomain dan email gratis untuk zona **sang.ceo**. Dibangun dengan Next.js
(App Router, TypeScript). Sistemnya sengaja sederhana: **repo GitHub ini adalah
database-nya**. Satu klaim = satu file JSON, masuk lewat pull request.

```
sang-ceo/
├── data/
│   ├── domains/        # satu file per subdomain: nama.sang.ceo.json
│   └── emails/         # satu file per alamat mailbox: nama.json
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
  Akun pemilik domain di ruang.email adalah akun yang dipakai workflow provisioning.
  Simpan kredensialnya sebagai secret repo: `RUANG_OWNER_EMAIL` (mis. `admin@sang.ceo`)
  dan `RUANG_OWNER_PASS`. Password jangan pernah ditulis di file atau chat mana pun.
- Setelah itu semua otomatis lewat workflow:
  - `validate-pr.yml`: bot memeriksa format klaim, memberi komentar pratinjau, dan menutup
    PR otomatis saat validasi gagal. Tidak butuh secret.
- **Provisioning mailbox berjalan lokal, bukan di GitHub** supaya password akun pemilik
  domain tidak pernah menyentuh repo. Di mesin pengelola:

  ```
  # .env.provision.local (di-gitignore)
  RUANG_OWNER_EMAIL=nauval@sang.ceo
  RUANG_OWNER_PASS=********
  ```

  Cron tiap 5 menit:

  ```cron
  */5 * * * * cd /root/sang-ceo && git pull --ff-only && node scripts/mail-watch.mjs >> mail-watch.log 2>&1
  ```

  `mail-watch.mjs` membuat akun via API `create-user`, mengacak sandi, lalu mengirimnya ke
  `contact` pengklaim via API `send`. Progres dicatat di `.state-mail.json`; file yang gagal
  dicoba ulang di sikap berikutnya.
- `scripts/mail-delete.mjs` untuk menghapus akun bermasalah (pelanggaran / permintaan hapus).
  Jatah gratis 3 akun; bila penuh, ajukan tambahan kapasitas ke admin ruang.email.

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
