# Autofeed harian: 6 Instagram + 2 TikTok + 5 Threads sewa laptop

Tujuan: setiap hari 1 feed (gambar 1080×1350) di tiap akun, gaya clean & profesional dengan kiblat feeds **@transgo.id**: produk besar di tengah, judul tebal miring dua warna, logo kiri atas, baris 4 ikon keunggulan, tombol WhatsApp di bawah. Satu sesi menyiapkan feeds untuk **BESOK** (6 akun).

## Akun, brand, jam tayang (WIB) — lihat brands.json
| Akun | Brand (tema) | Kota | Jam |
|---|---|---|---|
| @sewalaptopjogjaa | LAPTORA (kuning-hitam) | Jogja | 08:00 |
| @sewalaptopdepokk | LAPTORA | Depok | 09:00 |
| @sewalaptopbogor | RENTOP (oranye-hitam-krem) | Bogor | 10:00 |
| @sewalaptopbekasii | RENTOP | Bekasi | 11:00 |
| @sewalaptopbandungg | RENTOP | Bandung | 12:00 |
| @sewalaptopjakarta.co | Techpora (biru-navy) | Jakarta | 17:00 |

## Fakta yang BOLEH dipakai (keputusan pemilik 14 Nov 2026)
- WhatsApp semua akun: **0821-7798-4041** (https://wa.me/6282177984041). Wajib ada di caption (jadwal.py menolak jika tidak ada).
- Harga = harga website techpora.id, sama untuk semua brand (brands.json > harga): HP 14s 79rb/450rb/1,4jt; ThinkPad 100rb/650rb/1,5jt; VivoBook & RedmiBook 135rb/850rb/2jt; Acer Aspire 5 175rb/1,1jt/3jt; MacBook Air M1, MacBook Pro M1, MacBook Neo 250rb/1,5jt/4,5jt (harian/mingguan/bulanan).
- Keunggulan: tanpa deposit; unit dicek, dibersihkan, siap pakai (Office & OS terupdate); antar ke lokasi (Jakarta, Bekasi, Depok, Tangerang; untuk Bogor/Bandung/Jogja tulis "antar atau ambil, detail ongkir lewat WA"); harian–mingguan–bulanan; bisa perorangan, satu unit pun dilayani; untuk event 20–50+ unit seragam diantar & disiapkan di venue; fast response WhatsApp.
- Gratis ongkir HANYA untuk Jakarta dengan sewa minimal mingguan (pakai hanya di akun Jakarta, selalu dengan syaratnya).
- Rating 4.9/5 & 128+ ulasan, serta testimoni Sinta P. (Event Organizer) dan Budi H. HANYA untuk akun Techpora Jakarta.
- DILARANG mengarang: harga lain, promo/diskon, testimoni, jumlah pelanggan, unit yang tidak ada (tidak ada laptop gaming), janji waktu antar di luar daftar ini. Jangan menyebut TransGo atau pesaing.


## TikTok (foto 9:16) — brands.json > tiktok
| Akun | Brand | Desain diambil dari IG | Jam |
|---|---|---|---|
| @sewalaptopbogorr | RENTOP Bogor | @sewalaptopbogor | 15:00 |
| @sewalaptopjakartaa | Techpora Jakarta | @sewalaptopjakarta.co | 16:00 |
- Pakai PNG desain IG hari itu dari akun sumber; `tiktok.py` mengubahnya jadi JPG 1080×1920 (TikTok menolak PNG).
- Caption TikTok BEDA dari caption IG: pendek (250–500 karakter), kalimat pembuka yang memancing (pertanyaan/situasi relatable), poin singkat (✔), harga dari daftar fakta, "Chat WA 0821-7798-4041", 4–5 hashtag termasuk 2 hashtag kota + #fyp.
- `python3 tiktok.py --akun <u> --png out/<tgl>/<akunIG>.png --caption out/<tgl>/tt_<u>.txt --tanggal <besok> --go`

## Threads (percakapan) — brands.json > threads
| Akun | Brand | Kota | Jam |
|---|---|---|---|
| @sewalaptopbogor | RENTOP | Bogor | 10:30 |
| @sewalaptopbekasii | RENTOP | Bekasi | 11:30 |
| @sewalaptopbandungg | RENTOP | Bandung | 12:30 |
| @sewalaptopcikarang | RENTOP | Cikarang | 13:00 |
| @renttop.id | RENTOP | Jakarta | 17:30 |
Tujuannya MEMANCING OBROLAN, bukan iklan. Format per akun: 1 postingan utama + 2 balasan berantai (file `out/<tgl>/threads.json`, lihat contoh).
- Utama (maks 480 karakter): pertanyaan terbuka/relatable yang gampang dijawab: polling A/B/C, "tim X atau tim Y?", "pernah nggak…", "jujur aja…", cerita singkat, opini ringan yang tidak menyinggung. Bahasa santai (gue/aku/kalian boleh), maks 1 emoji. Tanpa hashtag & link.
- Balasan 1: insight/tips berguna yang memperkaya diskusi (bukan jualan).
- Balasan 2 (terakhir): sambungkan ke layanan secara halus + harga dari daftar fakta + "WA 0821-7798-4041" (WA hanya di sini).
- Topik tiap akun BERBEDA dan relevan dengan kotanya (kampus, kawasan industri, kantor, event). Jangan ulang topik 14 hari terakhir (`python3 riwayat.py`). Hindari politik, SARA, dan topik sensitif.
- Bank ide (variasikan): umur laptop & perawatan; beli vs sewa; momen laptop ngadat; onboarding karyawan; skripsi & sidang; WFH vs WFO; laptop pinjaman; persiapan event/seminar; baterai & charger; aplikasi wajib kerja/kuliah; MacBook vs Windows untuk kerja; backup file; tips presentasi; ujian online; kerja di kafe.
- `python3 threads.py out/<tgl>/threads.json --tanggal <besok> --go`

## Layout yang tersedia (engine.html)
`hero` (kota + stiker harga) · `produk` (1 unit + paket harian/mingguan/bulanan) · `pricelist` (tabel 8 laptop otomatis) · `persona` (mahasiswa/freelancer/kantor) · `siapkerja` (panel samping) · `hariini` (latar gelap, 3 laptop) · `angka` (event 20–50+ unit) · `tips` (3–4 langkah/checklist edukasi) · `kenapa` (4 kartu alasan).
Contoh spec lengkap ada di folder `contoh/`. Kata di antara `*bintang*` = warna aksen brand.

Rotasi: setiap akun jangan memakai layout yang sama dengan 4 postingan autofeed terakhirnya (lihat `python3 riwayat.py`), dan dalam satu hari 6 akun minimal memakai 4 layout berbeda. Ganti unit unggulan dan sudut pesan (mahasiswa/skripsi, kerja/WFH, event, bulanan hemat, harga, cara sewa, perawatan). Pricelist maksimal sekali per 7 hari per akun. Judul tiap akun BEDA (jangan copy-paste antar akun), sebut kota akun bila pas.

## Langkah setiap sesi
1. Siapkan alat (sekali per sesi):
   `mkdir -p ~/autofeed && cd ~/autofeed && curl -sfL <URL_TOOLKIT> | tar -xz`
   Pastikan `node -e "require('playwright')"` jalan (Chromium sudah terpasang di container). `pip install -q pillow` bila perlu.
2. `python3 riwayat.py` → lihat layout terakhir & hari kosong. Target = BESOK (WIB). Akun yang besok sudah terisi: lewati.
3. Untuk tiap akun yang kosong, tulis `out/<tanggal>/<username>.json` (spec) dan `out/<tanggal>/<username>.txt` (caption).
4. Render: `node render.js out/<tanggal>/*.json` lalu BUKA setiap PNG (Read) dan cek: teks tidak terpotong/tumpang tindih, logo jelas, harga sesuai daftar, tidak ada typo, kota benar. Perbaiki spec & render ulang bila perlu.
5. Caption (Bahasa Indonesia, 500–1.000 karakter, beda tiap akun): kalimat pembuka yang relevan dengan gambar → 2–3 kalimat isi yang berguna (bukan pengulangan teks gambar) → CTA "Chat WhatsApp 0821-7798-4041 (https://wa.me/6282177984041)" → baris kosong → 4–6 hashtag (2 hashtag kota dari brands.json + yang relevan). Tanpa emoji berlebihan (maks 3).
6. Jadwalkan tiap akun: `python3 jadwal.py --akun <u> --png <png> --caption <txt> --tanggal <besok> --tag <layout>:<unit> --go`
   (jam default dari brands.json; skrip menolak jika slot hari itu sudah terisi).
7. Setelah IG terjadwal: buat 2 TikTok (lihat bagian TikTok) dan 5 Threads (lihat bagian Threads) untuk tanggal yang sama.
8. Buat kolase 6 gambar IG (PIL, 3×2) dan kirim ke pemilik lewat SendUserFile + ringkasan singkat: akun IG (jam, judul, unit), 2 TikTok (jam), dan kalimat utama 5 Threads. Sebutkan pemilik bisa membatalkan dari dashboard Repliz sebelum jam tayang.
9. Cek juga jadwal kemarin & hari ini: kalau ada status `failed`/`error` di akun-akun ini, laporkan dan jadwalkan ulang bila masih masuk akal.

Jangan memposting ke akun di luar brands.json, jangan menghapus jadwal lain, jangan mengubah harga/WA tanpa persetujuan pemilik.
