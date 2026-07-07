
## Diagnosis singkat

`site:techpora.id` masih kosong + domain baru < 1 minggu. Ini **normal**, bukan bug. Google belum sempat crawl domain baru. Semua fondasi SEO teknis sudah beres (sitemap live, Search Console terverifikasi, meta tag benar, canonical benar).

**Ekspektasi realistis:**
- Homepage keindex: 3–14 hari sejak submit ke Search Console
- Halaman lain (blog, area) keindex: 1–4 minggu
- Muncul di halaman 1 untuk keyword kompetitif (misal "sewa laptop jakarta"): 3–6 bulan + butuh backlink

## Langkah percepatan (yang bisa langsung dilakukan hari ini)

### A. Aksi manual di Google Search Console (kamu login sebagai Shinta)

Tidak perlu ubah kode. Ini yang paling efektif.

1. **Request Indexing manual untuk halaman prioritas** — buka Search Console → URL Inspection → paste URL → klik "Request Indexing". Lakukan untuk 5–8 URL berikut satu per satu:
   - `https://techpora.id/`
   - `https://techpora.id/blog`
   - `https://techpora.id/sewa-macbook`
   - `https://techpora.id/sewa-laptop-jakarta-selatan`
   - `https://techpora.id/sewa-laptop-jakarta-pusat`
   - `https://techpora.id/sewa-laptop-jakarta-timur`
   - `https://techpora.id/sewa-laptop-jakarta-barat`
   - 1–2 artikel blog paling penting

2. **Cek status sitemap** di Search Console → Sitemaps. Pastikan status "Success" dan "Discovered URLs" nunjukin angka > 0 (biasanya 40-an halaman untuk Techpora).

3. **Cek "Coverage / Pages"** — kalau ada URL yang "Discovered - currently not indexed", biarkan; itu antrian normal.

### B. Sinyal eksternal (opsional tapi mempercepat)

Google menemukan situs baru lewat link dari situs lain yang sudah dipercaya. Yang bisa dilakukan cepat:

1. **Update bio Instagram @sewalaptopjakarta.co** — ganti link di bio dari yang lama ke `https://techpora.id`. IG bio link dihitung Google.
2. **Post 1 story/reels Instagram** yang mention `techpora.id`.
3. **Google Business Profile** — kalau belum, daftarkan bisnis di Google Maps dengan nama "Techpora.id" + link website. Ini sinyal lokal Jakarta yang kuat.
4. **Marketplace/direktori lokal** — daftarkan techpora.id di beberapa direktori sewa Indonesia (opsional).

### C. Perbaikan kecil di kode yang bisa aku kerjakan sekarang (kalau kamu setuju)

Bukan penyebab "ga muncul di Google", tapi meningkatkan kualitas sinyal ke Google:

1. **Generate `og-image.jpg`** untuk homepage. Sekarang JSON-LD di `src/routes/index.tsx` merujuk `${SITE_URL}/og-image.jpg` tapi file-nya belum ada di `public/`. Kalau ada, share link Techpora di WhatsApp/IG akan tampil preview gambar → orang lebih sering klik → sinyal positif.
2. **Tambah internal link dari homepage ke blog** yang lebih menonjol (sekarang cuma link kecil di nav). Membantu Google discover artikel blog lebih cepat via crawl homepage.
3. **Tambah breadcrumbs JSON-LD** di halaman blog & area — bantu Google memahami struktur situs.

Total ~15 menit kerja.

## Yang TIDAK perlu dilakukan

- **Jangan** submit terus-menerus ke sitemap yang sama — sekali cukup.
- **Jangan** pakai jasa "backlink cepat" murah — Google akan menghukum, malah tambah lama.
- **Jangan** ubah domain lagi — konsistensi domain justru bagus buat indexing.
- **Jangan** panik kalau minggu depan masih belum keindex — normal untuk domain baru.

## Pilihan langkah berikutnya

Kasih tau aku mau yang mana:

- **"Kerjain bagian C aja"** → aku bikin og-image, tambah internal linking, breadcrumbs JSON-LD.
- **"Bantu aku jalanin bagian A"** → aku pandu step-by-step buka Google Search Console untuk request indexing.
- **"Udah cukup info, aku tunggu Google aja dulu"** → tidak ada perubahan kode, tunggu 1–2 minggu lalu cek `site:techpora.id` lagi.
