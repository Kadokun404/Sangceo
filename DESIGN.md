# DESIGN.md — sang.ceo

Arah desain ditetapkan dari referensi milik owner: "seperti is-a.ceo" (situs registry
subdomain bergaya editorial-dev yang bersih), plus permintaan fitur email gratis.
Identitas tetap milik sang.ceo sendiri, bukan salinan.

## Identitas

- Produk: registry subdomain + email gratis `sang.ceo`, diklaim lewat pull request GitHub.
- Audiens: developer dan pembuat project Indonesia yang butuh domain/email tanpa biaya.
- Kepribadian: lugas, terbuka, teknis-tapi-hangat. Bahasa Indonesia.

## Palet (2 warna inti + 1 aksen, alasan tertulis)

- Kertas hangat netral (light `#faf9f5`, dark `#131310`): alasan = mengikuti arah is-a.ceo,
  konten registry banyak teks/tabel sehingga netral hangat lebih nyaman dibaca daripada putih murni.
- Tinta (light `#191a17`, dark `#f2f1ea`): kontras teks utama, WCAG AA terpenuhi.
- Aksen hijau (light `#0f5c3f`, dark `#7fd3a0`): satu aksen, hanya pada CTA utama, link,
  dan status "tersedia". Alasan = is-a.ceo memakai hijau; hijau juga bermakna "berhasil/tersedia"
  yang relevan untuk fungsi cek nama.
- Status warna (ok/warn/err) hanya untuk umpan balik fungsional cek nama, bukan dekorasi.

## Tipografi (alasan tertulis)

- Sans dari stack sistem (-apple-system, Segoe, Roboto, dst): konten editorial dan tabel,
  tanpa biaya webfont, waktu muat cepat, sesuai karakter layanan publik yang ringan.
- Mono dari stack sistem (ui-monospace, SF Mono, dst): khusus untuk string domain,
  nilai record DNS, JSON, dan alamat email. Alasan fungsional: titik dan nilai record
  lebih mudah diverifikasi dalam huruf lebar tetap.

## Bentuk

- Radius 6/10/16 px (input/kartu/CTA utama), bukan pill di semua elemen.
- Border 1px sebagai pembeda permukaan; shadow hanya untuk elemen yang benar-benar
  melayang (dropdown), sisanya datar.
- Tanpa gradien, tanpa glow, tanpa grid dekoratif. Motif identitas: string domain
  `nama.sang.ceo` selalu tampil mono dengan akhiran zona redup, diulang di hero,
  generator, tabel, dan hasil cek.

## Dial

ENERGY 2 / RHYTHM 2 / MOTION 1

- MOTION 1: hanya hover/focus state dan umpan balik tombol copy. Tidak ada animasi loop.
- RHYTHM 2: hero mono besar, lalu tabel lebar, lalu langkah bernomor asimetris, lalu FAQ.
-ENERGY 2: tenang tapi punya satu titik fokus per layar (string domain / tombol klaim).
