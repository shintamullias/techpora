## Ringkasan

Audit + generate 500 artikel SEO baru untuk menang di **"sewa laptop jakarta"** & **"rental laptop jakarta"**, plus semua turunannya (harian, mingguan, bulanan, murah, free ongkir, per area, per unit). Semua CTA ke WhatsApp. Auto-submit sitemap ke Google Search Console tiap deploy.

## Yang akan aku bangun

### 1. Audit cepat (before-touch)
- Cek keyword existing di homepage & pilar `/sewa-laptop-jakarta`, `/rental-laptop-jakarta` (via Semrush).
- Cek keyword variasi: harian/mingguan/bulanan/murah — pastikan tiap grup punya cluster artikel penopang.
- Cek `robots.txt`, sitemap, meta, internal linking dari hasil audit.
- Output: daftar quick-fix + peta 500 artikel (dimensi keyword × area × unit × modifier).

### 2. Matriks 500 artikel (anti-duplikat)

Kombinasi dimensi (semua slug di-hash & di-dedupe supaya unik):

```text
[intent]        sewa / rental
[unit]          laptop / macbook / thinkpad / vivobook / redmibook / acer
[durasi]        harian / mingguan / bulanan / tahunan / 3-hari / seminggu
[modifier]      murah / terjangkau / free-ongkir / ready-stock / bergaransi
                / bisa-antar / tanpa-dp / paling-hemat / 24-jam
[area]          jakarta / jaksel / jaktim / jakbar / jakut / jakpus
                / bekasi / depok / tangerang / bsd / bintaro / pik / kelapa-gading
                / rawamangun / kuningan / sudirman / thamrin
[use-case]      mahasiswa / freelancer / event / kantor / meeting / editing
                / gaming / design / kuliah-online / wfh / bootcamp
```

Total kombinasi > 5.000. Aku ambil **500 slug pertama** yang paling relevan untuk cluster utama (prioritas: intent × durasi × area, lalu intent × unit × area, lalu use-case × durasi).

Struktur artikel per volume (mix biar tidak spam):
- 30% **pendek** (400–600 kata) — 3–4 paragraf pendek, 1 list, 1 CTA WA.
- 50% **sedang** (900–1.200 kata) — H2 (kenapa, harga, unit, area, cara sewa), FAQ 3 item, 2 CTA WA.
- 20% **panjang** (1.800–2.500 kata) — H2 lengkap + tabel harga + FAQ 6 item + testimoni + 3 CTA WA + internal link block.

### 3. Pipeline generate (sekali jalan, hasil di-commit)

`scripts/generate-articles.ts` (dijalankan lokal via `bun` sekali; tidak ada AI call saat runtime app):

1. Baca matriks slug (deterministic, hash-based, dedup).
2. Untuk tiap slug, pilih template panjang (30/50/20) + persona penulis (rotasi 6 gaya) + variasi struktur H2 (rotasi 8 pola).
3. Panggil **Lovable AI (`openai/gpt-5.5`)** dengan prompt yang menyertakan: keyword utama, LSI, area, unit, durasi, style guidelines Bahasa Indonesia natural, aturan anti-spam (larangan paragraf identik, wajib variasi opening).
4. Hasil disimpan sebagai `src/content/blog/{slug}.mdx` + frontmatter (title, description ≤160, date, category, keywords, readMinutes, hero image key).
5. Concurrency dibatasi (5 paralel) + retry + resume-from-last supaya bisa lanjut kalau kena rate-limit.
6. Estimasi biaya: ±500 request `gpt-5.5` (aku tampilkan estimasi kredit sebelum menjalankan; kamu confirm dulu sebelum aku jalankan generate).

### 4. Blog runtime
- Loader `src/data/blog.ts` di-refactor untuk read dari file MDX/JSON generated (bukan hardcoded array).
- Route `/blog/$slug` sudah ada → tinggal support konten baru + section CTA WA yang di-inject otomatis (nomor `6282177984041`, message prefilled ke keyword artikel + area).
- 3 CTA WA per artikel (atas, tengah, bawah) — button + sticky mobile bar.
- Internal linking otomatis: tiap artikel link ke 3 artikel sibling (same area / same durasi) + pilar `/sewa-laptop-jakarta`.

### 5. Sitemap + auto-index GSC
- `src/routes/sitemap[.]xml.ts` sudah ada → 500 URL baru otomatis masuk (loader baca dari `posts`).
- **Auto-submit tiap deploy** via Search Console API menggunakan connector Google Search Console yang sudah tersedia:
  - Server route `/api/public/gsc-ping` (protected by shared secret) → PUT sitemap.
  - GitHub-less: aku tambah note supaya kamu klik "Publish" → aku sediakan tombol/manual trigger di dashboard settings? **Alternatif lebih simpel**: aku tambah script `bun run gsc:submit` yang bisa dijalankan tiap kali publish (aku dokumentasikan di README).
- Selain sitemap, aku pakai **URL Inspection API** untuk cek status batch (rate-limited jadi cek sampling 20 URL random per run).
- `robots.txt` diperbarui: `Sitemap: https://techpora.id/sitemap.xml`.

### 6. Bagian teknis lain
- Schema `Article` + `BreadcrumbList` di tiap post (sudah ada — dipertahankan).
- Meta description tiap post ≤ 160 char (validator di script).
- H1 unik per artikel; title ≤ 60 char (validator).
- Hero image: rotasi 8 image existing (bukan generate 500 image baru — biar hemat).
- Prefetch WA link + `rel="noopener"`.

## Yang tidak aku lakukan (biar ekspektasi jelas)
- Tidak generate 500 gambar unik (mahal & tidak perlu untuk SEO).
- Tidak pakai Google Indexing API resmi (Google larang untuk konten non-JobPosting — bisa kena manual action). Fokus sitemap resmi.
- Tidak menjanjikan indexing < 24 jam — Google butuh 1–14 hari; aku hanya bisa memaksimalkan sinyalnya.

## Urutan eksekusi (aku minta konfirmasi sebelum langkah 3)

1. **Audit + fix quick-win** (meta, internal link, robots, sitemap ping infra). ~cepat.
2. **Bangun pipeline + generate 5 artikel dummy** untuk sample review kualitas. Kamu approve → lanjut.
3. **Generate 500 artikel** (butuh confirm karena konsumsi kredit AI besar).
4. **Wire ke blog + sitemap + GSC submit**.
5. **Verify**: build success, `/sitemap.xml` berisi 500+ URL, sample artikel render + CTA WA jalan.

## Yang butuh dari kamu

- **Connect Google Search Console connector** (kalau belum). Aku akan trigger flow-nya di build mode.
- Konfirmasi lanjut ke step 3 setelah lihat sample 5 artikel.

Aku mulai dari audit + infrastruktur dulu, lalu berhenti dan minta review 5 sample sebelum bakar kredit untuk 500 artikel.