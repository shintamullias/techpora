# Internal Link Engine

Engine internal linking hub-and-spoke untuk blog Techpora. Memperkuat SEO
lewat internal link yang relevan & aman (bukan spam) — 100% ke aset milik
sendiri (artikel + halaman landing komersial).

## Apa yang dilakukan

Untuk tiap **284 artikel generated** (`src/content/blog/generated/*.json`):

1. **`related[]`** — dihitung ulang berbasis relevansi (brand / lokasi / durasi /
   kategori / overlap keyword). Dijamin **minimal 1 pillar hub** → tiap spoke
   selalu "naik" ke money page.
2. **`contextLinks[]`** — 2 link kontekstual **di dalam body** dengan anchor kaya
   keyword, menuju:
   - halaman **landing komersial** paling relevan (money page — mis.
     `/sewa-laptop-jakarta-timur`, `/sewa-macbook`);
   - **pillar hub** / artikel sibling terkuat.

Artikel pilar (hardcoded di `src/data/blog.ts`) **tidak diubah** — sudah
dikurasi tangan, dan tetap dipakai sebagai target hub.

## Prioritas strategis

- Cluster **Jakarta Timur / Rawamangun** diprioritaskan (tier-1 landing).
- Money pages (`biaya-sewa-laptop-per-hari`, `sewa-laptop-harian-jakarta`,
  panduan lengkap, dst.) jadi hub utama.

## Menjalankan

```bash
node scripts/internal-links.mjs --dry   # preview, tidak menulis
node scripts/internal-links.mjs         # terapkan

# preview slug tertentu:
SHOW="rental-acer-harian-jakarta-timur,sewa-macbook-mingguan-jakarta" \
  node scripts/internal-links.mjs --dry
```

Sifatnya **deterministik & idempoten** — aman dijalankan ulang tiap kali ada
artikel baru; hanya menimpa `related` + `contextLinks` pada file generated.

## Render

`contextLinks` dirender di `src/routes/blog.$slug.tsx` sebagai baris
"Baca juga:" di bawah section terkait (link internal `<a href>`).

## Kenapa aman (bukan spam)

- Semua link ke **domain/aset sendiri** (internal), bukan blast ke situs pihak
  ketiga → tidak masuk kategori link scheme / scaled abuse.
- Anchor bervariasi & natural, jumlah dibatasi (2 in-body + 4 related).
