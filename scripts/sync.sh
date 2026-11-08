#!/bin/sh
# Runner sinkronisasi lokal untuk registry sang.ceo.
PATH=/root/.nvm/versions/node/v22.22.2/bin:/usr/local/bin:/usr/bin:/bin
# Dipanggil cron tiap 5 menit. Semua kredensial dibaca dari file lokal
# .env.provision.local — tidak ada secret yang tersimpan di repo GitHub.

cd /root/sang-ceo || exit 1

# Tarik perubahan dari GitHub (database-nya). Kalau pull gagal (mis. remote belum
# di-set atau konflik), lewati sikap ini supaya tidak mengolah setengah data.
BEFORE=$(git rev-parse HEAD 2>/dev/null)
git pull --ff-only -q 2>/dev/null || exit 0
AFTER=$(git rev-parse HEAD 2>/dev/null)

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

# 3. Situs: rebuild hanya bila data registry berubah, lalu muat ulang service.
if [ -n "$BEFORE" ] && [ "$BEFORE" != "$AFTER" ] && git diff --name-only "$BEFORE" "$AFTER" | grep -q "^data/"; then
  node node_modules/next/dist/bin/next build >> site-build.log 2>&1 && systemctl restart sang-ceo
fi
