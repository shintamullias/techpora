
## Yang akan dikerjakan (point 1, 2, 4)

### 1. Sitemap & robots.txt (untuk Google Search Console)
- Buat `src/routes/sitemap[.]xml.ts` (server route, otomatis sinkron):
  - Base URL: `https://techpora.id`
  - Entries statis: `/`, `/blog`
  - Entries dinamis: loop semua `posts` dari `src/data/blog.ts` → `/blog/{slug}` dengan `lastmod` dari `post.date`
- Buat `public/robots.txt`:
  ```
  User-agent: *
  Allow: /

  Sitemap: https://techpora.id/sitemap.xml
  ```
- Update `SITE_URL` di `src/routes/index.tsx`, `src/routes/blog.index.tsx`, `src/routes/blog.$slug.tsx` dari `techpora.id` → `https://techpora.id` (canonical, og:url, JSON-LD).

### 2. Custom domain techpora.id
- Publish dulu ke Lovable URL (custom domain butuh project ter-publish).
- Setelah publish, kamu connect domain di **Project Settings → Domains → Connect Domain**, masukkan `techpora.id`.
- Di registrar (tempat beli domain), tambahkan DNS:
  - A record `@` → `185.158.133.1`
  - A record `www` → `185.158.133.1`
  - TXT record `_lovable` → value yang diberi Lovable saat setup
- Tunggu propagasi (bisa beberapa menit s/d 72 jam). SSL otomatis.

### 4. Analytics (GA4)
- Scaffold GA4 script di `src/routes/__root.tsx` (di head), pakai `process.env.VITE_GA_ID` agar bisa ditoggle.
- **Butuh GA4 Measurement ID (G-XXXXXXX) dari kamu** — buat dulu di https://analytics.google.com lalu kasih ke aku. Tanpa ID, scriptnya tidak akan loaded (no-op).
- Kalau mau pakai Meta Pixel juga, kasih Pixel ID-nya.

### Setelah deploy: daftar ke Google Search Console
Aku bisa otomatisin verifikasi GSC pakai connector Google Search Console (verify meta-tag + submit sitemap). Tinggal bilang aja setelah domain aktif.

---

## Jawaban pertanyaan kamu: "kalau udah jalan masih bisa ganti domain ga?"

**Bisa**, tapi:
- **Di Lovable**: ganti/tambah custom domain kapan saja dari Project Settings → Domains. Konten & data tetap.
- **Di Google Search Console**: domain dianggap **property baru**. Jadi:
  - Harus tambah property baru untuk domain barunya
  - Harus verifikasi ulang
  - Submit sitemap ulang
  - Riwayat indexing & data analytics property lama **tidak otomatis pindah**
  - Untuk pertahankan SEO ranking → setup **301 redirect** dari domain lama ke baru + gunakan fitur **"Change of Address"** di GSC
- **GA4**: tinggal update domain di setting property, datanya tetap nyambung (selama Measurement ID sama).

**Rekomendasi**: pakai `techpora.id` dari awal sebelum daftarin ke GSC, biar nggak perlu migrasi.

---

## Catatan teknis
- Frontend changes (sitemap, robots, GA script) butuh klik **Update** di Publish dialog setelah aku edit.
- Sitemap akan auto-update setiap kali kamu tambah artikel blog baru — nggak perlu maintain manual.
