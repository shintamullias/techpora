## Status Sekarang

- **200/500 artikel** sudah tergenerate di `src/content/blog/generated/`
- **Generator mati** (proses ke-restart bareng sandbox) — perlu di-resume
- Blog runtime & sitemap sudah auto-pickup file baru via `import.meta.glob`

## Rencana

### 1. Resume generator (300 artikel sisa)
- Jalankan ulang `bun scripts/generate-articles.ts --count 500 --resume` di background dengan `nohup + setsid` supaya tidak mati saat sandbox idle
- Estimasi: ~50 menit (rate ~6/menit)
- Saya polling tiap 60 detik sampai selesai atau timeout, lalu lapor

### 2. Wiring setelah 500 selesai
- **Sitemap**: sudah otomatis (via `src/routes/sitemap[.]xml.ts` + `import.meta.glob`) — cukup verifikasi jumlah URL naik ke ~550
- **robots.txt**: pastikan reference `Sitemap: https://techpora.id/sitemap.xml` ada
- **GSC auto-ping**: tambahkan server route `src/routes/api/public/ping-sitemap.ts` yang ping `https://www.google.com/ping?sitemap=...` + Bing, dipanggil manual atau via cron eksternal setelah deploy
- **IndexNow** (bonus): generate key file di `public/` + endpoint submit URL batch ke `api.indexnow.org` supaya Bing/Yandex ke-index cepat tanpa OAuth
- **Google Search Console Indexing API** (opsional): butuh service account JSON dari user — kalau mau, saya siapkan setelah user upload credential ke secrets

### 3. QA akhir
- Sample 3 artikel random → cek panjang, WA CTA, internal link
- Cek `/sitemap.xml` jumlah URL
- Cek build tidak error karena banyak file JSON

## Catatan Teknis

Untuk **auto-index tiap deploy** yang benar-benar hands-free, opsi paling stabil:
1. **IndexNow** (langsung jalan, no auth) — recommended dulu
2. **GSC Indexing API** — butuh user connect service account, hanya untuk JobPosting/BroadcastEvent secara resmi, tapi biasanya jalan untuk artikel juga

Konfirmasi: lanjut approve plan ini? Setelah approve saya resume generator dan lapor progres.