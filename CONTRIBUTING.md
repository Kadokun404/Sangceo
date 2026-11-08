# Kontribusi: klaim subdomain & email di sang.ceo

Terima kasih mau ikut. Semua klaim masuk lewat pull request ke repo ini.

## Klaim subdomain

Buat file `domains/nama.sang.ceo.json`:

```json
{
  "domain": "sang.ceo",
  "subdomain": "nama-mu",
  "owner": "username-github-mu",
  "repo": "github.com/username-mu/repo",
  "description": "Situs pribadi dan portfolio.",
  "records": {
    "CNAME": "cname.vercel-dns.com"
  }
}
```

- Tipe record yang didukung: `A`, `AAAA`, `CNAME`, `TXT`, `MX`, `NS`, `SRV`, `CAA`, `PTR`.
- Satu `CNAME` per nama, dan tidak boleh menunjuk kembali ke namanya sendiri.
- Nama bertingkat (`api.app`) dan wildcard (`*.app`) di atas nama yang sudah kamu klaim
  ditulis dalam file sendiri, misal `domains/api.nama.sang.ceo.json`.

## Klaim email terusan

Buat file `emails/nama.json`:

```json
{
  "domain": "sang.ceo",
  "address": "nama",
  "owner": "username-github-mu",
  "forward": "email-pribadi@kamu.dev"
}
```

Rute penerusan dipasang pengelola setelah PR di-merge.

## Aturan singkat

1. Satu subdomain / alamat per orang per keperluan. Tidak ada penimbunan.
2. Label harus berupa nama, bukan kata umum (saya, the, and). Pakai username GitHub milikmu.
3. Tanpa malware, phishing, atau konten yang bisa membahayakan zona `sang.ceo`.
4. Perubahan besar (format baru, tipe record tambahan) diskusikan dulu lewat issue.

Kalau ragu, buka issue dulu sebelum PR.
