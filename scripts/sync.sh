#!/bin/sh
# Runner sinkronisasi lokal untuk registry sang.ceo.
# Dipanggil cron tiap 5 menit. Semua kredensial dibaca dari file lokal
# .env.provision.local — tidak ada secret yang tersimpan di repo GitHub.

cd /root/sang-ceo || exit 1

# Tarik perubahan dari GitHub (database-nya). Kalau pull gagal (mis. remote belum
# di-set atau konflik), lewati sikap ini supaya tidak mengolah setengah data.
git pull --ff-only -q 2>/dev/null || exit 0

# Muat kredensial lokal.
set -a
. ./.env.provision.local 2>/dev/null
set +a

# 1. Mailbox: buat akun baru + kirim sandi ke pengklaim.
node scripts/mail-watch.mjs >> mail-watch.log 2>&1

# 2. DNS: regenerasi dnsconfig dan push ke Cloudflare bila tool + token tersedia.
if [ -n "$CLOUDFLARE_API_TOKEN" ] && command -v dnscontrol >/dev/null 2>&1; then
  node scripts/gen-dnsconfig.mjs > /dev/null 2>&1 && dnscontrol push >> dns-push.log 2>&1
fi
