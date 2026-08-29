/**
 * Internal Link Engine — Techpora blog (hub-and-spoke)
 * -----------------------------------------------------
 * Memperkaya internal linking 284 artikel generated secara AMAN:
 *   1. related[]        → dihitung ulang berbasis relevansi (brand/lokasi/durasi/kategori/token)
 *                          + dijamin minimal 1 pillar hub (spoke selalu naik ke hub).
 *   2. contextLinks[]   → 2 link kontekstual di dalam body (anchor kaya keyword) menuju:
 *                          (a) halaman landing komersial paling relevan  → money page
 *                          (b) pillar hub / artikel sibling terkuat.
 *
 * Sifat: DETERMINISTIK & IDEMPOTEN. Hanya menyentuh file JSON generated
 * (30 artikel pilar hardcoded di data/blog.ts TIDAK diubah — sudah dikurasi tangan,
 * dan tetap dipakai sebagai target hub).
 *
 * Jalankan:  node scripts/internal-links.mjs --dry   (preview, tidak menulis)
 *            node scripts/internal-links.mjs         (menulis perubahan)
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.cwd());
const GEN_DIR = path.join(ROOT, "src/content/blog/generated");
const BLOG_TS = path.join(ROOT, "src/data/blog.ts");
const DRY = process.argv.includes("--dry");

// ---------------------------------------------------------------------------
// 1. HALAMAN LANDING KOMERSIAL (target link paling bernilai = money page)
//    tier 1 = prioritas strategis (JakTim/Rawamangun + core Jakarta + harian)
// ---------------------------------------------------------------------------
const LANDINGS = [
  { to: "/sewa-laptop-jakarta-timur", label: "sewa laptop Jakarta Timur", loc: "jakarta-timur", tier: 1 },
  { to: "/sewa-laptop-rawamangun", label: "sewa laptop Rawamangun", loc: "jakarta-timur", area: "rawamangun", tier: 1 },
  { to: "/sewa-laptop-pulogadung", label: "sewa laptop Pulogadung", loc: "jakarta-timur", area: "pulogadung", tier: 1 },
  { to: "/sewa-laptop-matraman", label: "sewa laptop Matraman", loc: "jakarta-timur", area: "matraman", tier: 2 },
  { to: "/sewa-laptop-cempaka-putih", label: "sewa laptop Cempaka Putih", loc: "jakarta-timur", area: "cempaka-putih", tier: 2 },
  { to: "/sewa-laptop-harian-jakarta", label: "sewa laptop harian Jakarta", loc: "jakarta", durasi: "harian", tier: 1 },
  { to: "/sewa-laptop-jakarta", label: "sewa laptop Jakarta", loc: "jakarta", tier: 1 },
  { to: "/rental-laptop-jakarta", label: "rental laptop Jakarta", loc: "jakarta", tier: 2 },
  { to: "/sewa-laptop-jakarta-selatan", label: "sewa laptop Jakarta Selatan", loc: "jakarta-selatan", tier: 1 },
  { to: "/sewa-laptop-jakarta-utara", label: "sewa laptop Jakarta Utara", loc: "jakarta-utara", tier: 2 },
  { to: "/sewa-laptop-jakarta-barat", label: "sewa laptop Jakarta Barat", loc: "jakarta-barat", tier: 2 },
  { to: "/sewa-laptop-jakarta-pusat", label: "sewa laptop Jakarta Pusat", loc: "jakarta-pusat", tier: 2 },
  { to: "/sewa-laptop-bekasi", label: "sewa laptop Bekasi", loc: "bekasi", tier: 2 },
  { to: "/sewa-laptop-depok", label: "sewa laptop Depok", loc: "depok", tier: 2 },
  { to: "/sewa-laptop-tangerang", label: "sewa laptop Tangerang", loc: "tangerang", tier: 2 },
  { to: "/sewa-macbook", label: "sewa MacBook", brand: "macbook", tier: 2 },
  { to: "/sewa-laptop-mahasiswa-jakarta", label: "sewa laptop mahasiswa Jakarta", useCase: "mahasiswa", tier: 2 },
  { to: "/sewa-laptop-event-jakarta", label: "sewa laptop event Jakarta", useCase: "event", tier: 2 },
];

// Pillar hubs (money pages, artikel) — spoke wajib naik ke sini
const PILLAR_HUBS = [
  "sewa-laptop-jakarta-panduan-lengkap-harga-syarat-2026",
  "biaya-sewa-laptop-per-hari-jakarta",
  "perbandingan-sewa-vs-beli-laptop-jakarta",
  "cara-pilih-tempat-sewa-laptop-terpercaya-jakarta",
  "panduan-syarat-dan-proses-sewa-laptop-techpora",
  "faq-antar-jemput-laptop-sewaan-ke-lokasi-jakarta",
];

// Anchor bersih & kurasi untuk pillar hub (hindari potongan judul mentah)
const HUB_LABELS = {
  "faq-antar-jemput-laptop-sewaan-ke-lokasi-jakarta": "antar-jemput laptop sewaan",
  "biaya-sewa-laptop-per-hari-jakarta": "biaya sewa laptop per hari",
  "perbandingan-sewa-vs-beli-laptop-jakarta": "perbandingan sewa vs beli laptop",
  "cara-pilih-tempat-sewa-laptop-terpercaya-jakarta": "tempat sewa laptop terpercaya",
  "panduan-syarat-dan-proses-sewa-laptop-techpora": "syarat & proses sewa laptop",
  "sewa-laptop-jakarta-panduan-lengkap-harga-syarat-2026": "panduan lengkap sewa laptop Jakarta",
};

const BRANDS = ["macbook", "thinkpad", "vivobook", "redmibook", "acer"];
const DURASI = ["harian", "mingguan", "bulanan", "tahunan", "3-hari", "seminggu"];
const LOCS = [
  "jakarta-selatan", "jakarta-timur", "jakarta-utara", "jakarta-barat", "jakarta-pusat",
  "rawamangun", "pulogadung", "matraman", "cempaka-putih", "bekasi", "depok", "tangerang",
  "jakarta", // generic terakhir supaya spesifik menang
];
const STOP = new Set(["sewa", "rental", "laptop", "di", "untuk", "dan", "yang", "atau", "ke", "dari", "2026", "jakarta", "tips", "cara", "panduan", "harga", "biaya"]);

// ---------------------------------------------------------------------------
// 2. LOAD CORPUS
// ---------------------------------------------------------------------------
function tokenize(str) {
  return new Set(
    String(str || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .split(/[\s-]+/)
      .filter((w) => w.length > 2 && !STOP.has(w)),
  );
}
function detect(list, hay) {
  for (const x of list) if (hay.includes(x)) return x;
  return null;
}
function feats(slug, title, keywords, category) {
  const hay = `${slug} ${keywords || ""}`.toLowerCase();
  return {
    brand: detect(BRANDS, hay),
    durasi: detect(DURASI, hay),
    loc: detect(LOCS, hay),
    category: category || null,
    tokens: tokenize(`${slug} ${title} ${keywords || ""}`),
  };
}

// generated JSON
const genFiles = fs.readdirSync(GEN_DIR).filter((f) => f.endsWith(".json"));
const gen = genFiles.map((f) => {
  const data = JSON.parse(fs.readFileSync(path.join(GEN_DIR, f), "utf8"));
  return { file: f, data, kind: "generated", ...feats(data.slug, data.title, data.keywords, data.category) };
});

// pillar posts (parse ringan dari blog.ts, hanya slug/title/category — sebagai target hub)
function parsePillars(src) {
  const start = src.indexOf("export const posts");
  const arr = src.slice(start, src.indexOf("\n];", start));
  const out = [];
  const re = /slug:\s*"([^"]+)"/g;
  let m;
  const idxs = [];
  while ((m = re.exec(arr))) idxs.push({ slug: m[1], at: m.index });
  for (let i = 0; i < idxs.length; i++) {
    const seg = arr.slice(idxs[i].at, i + 1 < idxs.length ? idxs[i + 1].at : arr.length);
    const title = (seg.match(/title:\s*\n?\s*"([^"]+)"/) || [])[1] || idxs[i].slug;
    const category = (seg.match(/category:\s*"([^"]+)"/) || [])[1] || null;
    out.push({ slug: idxs[i].slug, title, category });
  }
  return out;
}
const pillars = parsePillars(fs.readFileSync(BLOG_TS, "utf8")).map((p) => ({
  data: { slug: p.slug, title: p.title },
  kind: "pillar",
  ...feats(p.slug, p.title, "", p.category),
}));

const bySlug = new Map();
[...gen, ...pillars].forEach((a) => bySlug.set(a.data.slug, a));
const allTargets = [...gen, ...pillars];

// ---------------------------------------------------------------------------
// 3. SCORING
// ---------------------------------------------------------------------------
function jaccard(a, b) {
  let inter = 0;
  for (const t of a) if (b.has(t)) inter++;
  const uni = a.size + b.size - inter || 1;
  return inter / uni;
}
function relScore(src, tgt) {
  if (src.data.slug === tgt.data.slug) return -1;
  let s = 0;
  if (src.brand && src.brand === tgt.brand) s += 3;
  if (src.loc && src.loc === tgt.loc) s += src.loc === "jakarta" ? 1 : 3;
  if (src.durasi && src.durasi === tgt.durasi) s += 2;
  if (src.category && src.category === tgt.category) s += 2;
  s += jaccard(src.tokens, tgt.tokens) * 5;
  if (PILLAR_HUBS.includes(tgt.data.slug)) s += 2; // dorong ke hub
  if (tgt.kind === "pillar") s += 0.5;
  return s;
}
function bestLanding(src) {
  let best = null, bestScore = -1;
  for (const L of LANDINGS) {
    let s = 0;
    if (L.area && src.tokens.has(L.area)) s += 5;
    if (L.loc && L.loc === src.loc) s += L.loc === "jakarta" ? 1.5 : 4;
    if (L.brand && L.brand === src.brand) s += 4;
    if (L.durasi && L.durasi === src.durasi) s += 2;
    if (L.useCase && src.tokens.has(L.useCase)) s += 3;
    s += (3 - L.tier) * 0.6; // sedikit prioritas tier-1
    if (s > bestScore) { bestScore = s; best = L; }
  }
  return best;
}

// ---------------------------------------------------------------------------
// 4. BUILD LINKS
// ---------------------------------------------------------------------------
function clean(str, max = 50) {
  let s = String(str || "")
    .split(/[:—(]/)[0] // buang subtitle setelah ":" "—" "("
    .replace(/\s+/g, " ")
    .trim();
  if (s.length > max) {
    s = s.slice(0, max);
    s = s.slice(0, s.lastIndexOf(" ")); // potong di batas kata
  }
  return s.replace(/[\s.,;-]+$/, "");
}
function titleAnchor(a) {
  if (HUB_LABELS[a.data.slug]) return HUB_LABELS[a.data.slug];
  const kw = (a.data.keywords || "").split(",")[0].trim();
  if (kw && kw.length >= 8 && kw.length <= 50) return kw;
  return clean(a.data.title);
}

let changed = 0;
const preview = [];

for (const art of gen) {
  const scored = allTargets
    .map((t) => ({ t, s: relScore(art, t) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s);

  // related[]: top 4 + jamin minimal 1 pillar hub
  const related = [];
  for (const { t } of scored) {
    if (related.length >= 4) break;
    related.push(t.data.slug);
  }
  if (!related.some((s) => PILLAR_HUBS.includes(s))) {
    const hub = scored.find((x) => PILLAR_HUBS.includes(x.t.data.slug));
    if (hub) related.splice(3, 1, hub.t.data.slug);
  }

  // contextLinks[]: (1) landing komersial terbaik, (2) hub/sibling terkuat
  const nSec = Array.isArray(art.data.sections) ? art.data.sections.length : 0;
  const ctx = [];
  const L = bestLanding(art);
  if (L && nSec >= 1) ctx.push({ section: Math.min(1, nSec - 1), anchor: L.label, to: L.to });

  const sib = scored.find(
    (x) => x.t.kind !== "pillar" || PILLAR_HUBS.includes(x.t.data.slug),
  );
  const hubTarget =
    scored.find((x) => PILLAR_HUBS.includes(x.t.data.slug)) || sib;
  if (hubTarget && nSec >= 2) {
    ctx.push({
      section: nSec - 1,
      anchor: titleAnchor(hubTarget.t),
      to: `/blog/${hubTarget.t.data.slug}`,
    });
  }

  const before = JSON.stringify({ r: art.data.related, c: art.data.contextLinks || null });
  art.data.related = related;
  art.data.contextLinks = ctx;
  const after = JSON.stringify({ r: art.data.related, c: art.data.contextLinks });

  if (before !== after) {
    changed++;
    const showList = (process.env.SHOW || "").split(",").filter(Boolean);
    const pick = showList.length ? showList.includes(art.data.slug) : preview.length < 6;
    if (pick) preview.push({ slug: art.data.slug, related, ctx });
    if (!DRY) {
      fs.writeFileSync(
        path.join(GEN_DIR, art.file),
        JSON.stringify(art.data, null, 2) + "\n",
        "utf8",
      );
    }
  }
}

// ---------------------------------------------------------------------------
// 5. REPORT
// ---------------------------------------------------------------------------
console.log(`\n${DRY ? "[DRY RUN] " : ""}Internal Link Engine — Techpora`);
console.log(`  Artikel generated : ${gen.length}`);
console.log(`  Pillar (target)   : ${pillars.length}`);
console.log(`  Landing komersial : ${LANDINGS.length}`);
console.log(`  Artikel diubah    : ${changed}\n`);
console.log("  Contoh hasil:");
for (const p of preview) {
  console.log(`\n  • ${p.slug}`);
  console.log(`    related    : ${p.related.join(", ")}`);
  for (const c of p.ctx) console.log(`    ctx[sec ${c.section}] : "${c.anchor}" → ${c.to}`);
}
console.log("");
