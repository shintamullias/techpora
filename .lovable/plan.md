# Target: Ranking #1 "sewa laptop jakarta" & "rental laptop jakarta"

## Data lapangan (Semrush, market Indonesia)

| Keyword | Volume/bulan | Difficulty | Status kita |
|---|---|---|---|
| sewa laptop jakarta | **1.900** | 12/100 (very easy) | belum keindex |
| rental laptop jakarta | 170 | 12/100 (very easy) | belum keindex |
| sewa laptop | 5.400 | 14/100 (very easy) | bonus target |
| rental laptop | 1.300 | 14/100 (very easy) | bonus target |

**Kabar baik:** difficulty rendah semua — realistis buat kejar top 3 dalam 2–3 bulan.

**Kompetitor yang harus dilewatin (posisi 1–10 sekarang):**
arental.co.id, javarent.co.id, kanaprorent.com, sewalaptopjakarta.co.id, asani.co.id, nusarental.com, indotek.id, rentalan.id. Plus dua akun Instagram (@techtopia.id & @happytop_id) yang nangkring di top 3 — jadi profil Instagram juga penting.

**Domain kita:** baru, belum ada authority di mata Google. Ini bottleneck utama — bukan konten, tapi umur & sinyal kepercayaan.

---

## Strategi 3 lapis

### Lapis 1 — Bikin halaman yang layak nomor 1 (on-page, kerjaan kode)

Saat ini ada 8 halaman area (`/sewa-laptop-jakarta-selatan`, dst) tapi **belum ada halaman payung `/sewa-laptop-jakarta`** yang secara eksplisit menargetkan keyword utama. Kompetitor top semua punya halaman semacam ini.

1. **Buat `/sewa-laptop-jakarta`** — halaman hub Jakarta.
   - H1: "Sewa Laptop Jakarta — Harian, Mingguan, Bulanan"
   - Isi: intro kuat, list semua unit + harga, breakdown 5 area Jakarta (link ke area page yang sudah ada), tabel perbandingan harga vs kompetitor, testimoni, FAQ Jakarta-specific, CTA WA.
   - Sekitar 1.500–2.000 kata (kompetitor rata-rata segitu).
   - Full meta + JSON-LD (LocalBusiness + FAQPage + BreadcrumbList).

2. **Buat `/rental-laptop-jakarta`** — alias untuk keyword "rental" (masyarakat pakai dua istilah).
   - Konten mirip tapi bahasanya dibedakan (bukan copy-paste — Google deteksi duplicate).
   - Cross-link ke halaman "sewa laptop jakarta".

3. **Perkuat homepage untuk keyword utama.**
   - H1 homepage saat ini: cek dulu — kalau belum ada "Sewa Laptop Jakarta" verbatim di H1 atau meta, dimasukin.
   - Section pertama below hero: paragraf 150 kata yang jelas nyebut "sewa laptop jakarta", "rental laptop jakarta", area yang dilayani.

4. **Internal linking rapi.**
   - Semua area page link balik ke `/sewa-laptop-jakarta` (parent).
   - Homepage kasih section "Sewa Laptop per Wilayah Jakarta" yang link ke 5 area page + hub Jakarta.
   - Blog post relevan link ke hub Jakarta.

5. **Tambah konten blog Jakarta-specific.**
   - "Sewa laptop Jakarta: panduan lengkap harga & syarat 2026"
   - "Perbandingan sewa vs beli laptop untuk kerja di Jakarta"
   - "Tempat sewa laptop terpercaya Jakarta — apa yang harus dicek"
   - 3 artikel ini masing-masing 1.000+ kata, link ke halaman hub.

### Lapis 2 — Sinyal kepercayaan (off-page, kerjaan kamu di luar kode)

Domain baru ranking-nya lambat sampai Google percaya. Ini yang paling ngangkat:

1. **Google Business Profile.** Bikin listing "Techpora — Sewa Laptop Jakarta" di alamat Rawamangun. Ini bahkan bisa muncul di Google Maps pack di atas hasil organik. **Efeknya paling gede & paling cepat** untuk local search seperti "sewa laptop jakarta".
2. **Direktori bisnis Indonesia.** Daftar di: bukalapak (jasa), tokopedia (jasa sewa), OLX, jualo.com, Yellowpages.co.id. Backlink + NAP consistency (nama, alamat, phone sama di semua tempat).
3. **Instagram + TikTok bisnis.** Kompetitor top 3 di SERP itu akun IG — Google respect social presence. Post rutin 3x/minggu, cantumin link techpora.id di bio.
4. **Testimoni + review Google Maps.** Minta 20 klien pertama kasih review 5⭐ di Google Business. Ini sinyal kuat.
5. **Konten link-worthy.** Kalau bisa dapet mention dari blog mahasiswa UI/Binus/UMN atau artikel event organizer — impact besar.

### Lapis 3 — Technical + monitoring (kerjaan kode ringan)

1. **Search Console** — verifikasi & submit sitemap (kalau belum). Request indexing manual untuk `/sewa-laptop-jakarta` + `/rental-laptop-jakarta` setelah live.
2. **Update sitemap.xml** — tambah dua route baru.
3. **Schema markup di homepage:** tambah `LocalBusiness` JSON-LD dengan address, phone, hours, coordinates, aggregateRating (kalau ada rating dari review).
4. **Page speed** — pastikan gambar unit yang barusan ditambah tidak bikin LCP > 2.5s. Kalau iya, lazy-load atau kompres lebih agresif.

---

## Realistis: kapan bisa #1?

| Timeline | Yang bisa dicapai |
|---|---|
| Minggu 1–2 | Kerjaan kode selesai, semua halaman live & submit ke Search Console |
| Bulan 1 | Mulai keindex, ranking di posisi 30–50 |
| Bulan 2 | Naik ke halaman 2 (11–20) kalau Google Business + direktori aktif |
| Bulan 3–4 | Top 10 realistis, kalau kompetitor tidak agresif |
| Bulan 4–6 | Top 3 achievable — level ini biasanya ditentukan Google Business Profile + review count |

**Yang bikin gagal:** cuma ngerjain kode tanpa Google Business Profile & review Google Maps. Domain baru butuh sinyal eksternal, on-page saja tidak cukup.

---

## Deliverables kalau plan ini di-approve (kerjaan kode)

- ✅ Buat `src/routes/sewa-laptop-jakarta.tsx` (hub Jakarta, ~1.800 kata)
- ✅ Buat `src/routes/rental-laptop-jakarta.tsx` (varian keyword)
- ✅ Update `src/routes/index.tsx` — tighten H1 & intro untuk keyword utama, tambah section "wilayah Jakarta"
- ✅ Tambah `LocalBusiness` JSON-LD di homepage dengan koordinat + jam operasional
- ✅ Update sitemap dengan 2 route baru
- ✅ Tambah 3 blog post baru di `src/data/blog.ts` (draft outline; full copy user tulis atau minta aku tulis)
- ✅ Internal linking dari area page → hub Jakarta

**Yang harus kamu kerjain (di luar kode, tapi paling penting):**
- Bikin Google Business Profile — aku bisa pandu step-by-step
- Daftar 5 direktori bisnis Indonesia
- Post IG rutin
- Kumpulin review Google Maps

Setuju arah ini? Kalau ya, tinggal switch ke build mode dan aku mulai dari halaman hub `/sewa-laptop-jakarta` dulu (impact tertinggi).