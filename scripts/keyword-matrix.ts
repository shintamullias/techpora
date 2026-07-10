/**
 * Keyword × area × durasi × unit × modifier matrix.
 * Deterministic, dedup, dan menghasilkan tepat 500 slug unik.
 *
 * Slug tidak boleh bentrok dengan:
 * - Route existing (sewa-laptop-jakarta, rental-laptop-jakarta, sewa-macbook, dst)
 * - Existing blog post slug (di data/blog.ts)
 */

export type SlugSpec = {
  slug: string;                // e.g. "sewa-laptop-harian-jakarta-selatan"
  primaryKeyword: string;      // "sewa laptop harian jakarta selatan"
  title: string;               // proposed title (60 chars max)
  intent: "sewa" | "rental";
  unit: string;                // "laptop" | "macbook" | ...
  durasi?: string;             // "harian" | "mingguan" | ...
  area?: string;               // "Jakarta Selatan"
  areaSlug?: string;           // "jakarta-selatan"
  modifier?: string;           // "murah" | "free-ongkir" | ...
  useCase?: string;            // "mahasiswa" | ...
  length: "short" | "medium" | "long"; // 30/50/20
  persona: number;             // 0..5 rotasi gaya
  outlineVariant: number;      // 0..7 rotasi struktur H2
  internalPath: string;        // pilar/area target
};

const INTENTS = ["sewa", "rental"] as const;

const UNITS = [
  { slug: "laptop", label: "laptop" },
  { slug: "macbook", label: "MacBook" },
  { slug: "thinkpad", label: "ThinkPad" },
  { slug: "vivobook", label: "VivoBook" },
  { slug: "redmibook", label: "RedmiBook" },
  { slug: "acer", label: "Acer" },
];

const DURASI = [
  { slug: "harian", label: "harian" },
  { slug: "mingguan", label: "mingguan" },
  { slug: "bulanan", label: "bulanan" },
  { slug: "3-hari", label: "3 hari" },
  { slug: "seminggu", label: "seminggu" },
  { slug: "tahunan", label: "tahunan" },
];

const MODIFIERS = [
  { slug: "murah", label: "murah" },
  { slug: "terjangkau", label: "terjangkau" },
  { slug: "free-ongkir", label: "free ongkir" },
  { slug: "ready-stock", label: "ready stock" },
  { slug: "bergaransi", label: "bergaransi" },
  { slug: "bisa-antar", label: "bisa antar" },
  { slug: "tanpa-dp", label: "tanpa DP" },
  { slug: "paling-hemat", label: "paling hemat" },
  { slug: "24-jam", label: "24 jam" },
];

const AREAS = [
  { slug: "jakarta", label: "Jakarta", internal: "/sewa-laptop-jakarta" },
  { slug: "jakarta-selatan", label: "Jakarta Selatan", internal: "/sewa-laptop-jakarta-selatan" },
  { slug: "jakarta-timur", label: "Jakarta Timur", internal: "/sewa-laptop-jakarta-timur" },
  { slug: "jakarta-barat", label: "Jakarta Barat", internal: "/sewa-laptop-jakarta-barat" },
  { slug: "jakarta-utara", label: "Jakarta Utara", internal: "/sewa-laptop-jakarta-utara" },
  { slug: "jakarta-pusat", label: "Jakarta Pusat", internal: "/sewa-laptop-jakarta-pusat" },
  { slug: "bekasi", label: "Bekasi", internal: "/sewa-laptop-bekasi" },
  { slug: "depok", label: "Depok", internal: "/sewa-laptop-depok" },
  { slug: "tangerang", label: "Tangerang", internal: "/sewa-laptop-tangerang" },
  { slug: "bsd", label: "BSD", internal: "/sewa-laptop-tangerang" },
  { slug: "bintaro", label: "Bintaro", internal: "/sewa-laptop-jakarta-selatan" },
  { slug: "pik", label: "PIK", internal: "/sewa-laptop-jakarta-utara" },
  { slug: "kelapa-gading", label: "Kelapa Gading", internal: "/sewa-laptop-jakarta-utara" },
  { slug: "rawamangun", label: "Rawamangun", internal: "/sewa-laptop-jakarta-timur" },
  { slug: "kuningan", label: "Kuningan", internal: "/sewa-laptop-jakarta-selatan" },
  { slug: "sudirman", label: "Sudirman", internal: "/sewa-laptop-jakarta-pusat" },
  { slug: "thamrin", label: "Thamrin", internal: "/sewa-laptop-jakarta-pusat" },
  { slug: "grogol", label: "Grogol", internal: "/sewa-laptop-jakarta-barat" },
  { slug: "puri", label: "Puri Indah", internal: "/sewa-laptop-jakarta-barat" },
  { slug: "alam-sutera", label: "Alam Sutera", internal: "/sewa-laptop-tangerang" },
];

const USECASES = [
  { slug: "mahasiswa", label: "mahasiswa" },
  { slug: "freelancer", label: "freelancer" },
  { slug: "event", label: "event" },
  { slug: "kantor", label: "kantor" },
  { slug: "meeting", label: "meeting" },
  { slug: "editing", label: "editing video" },
  { slug: "design", label: "desain grafis" },
  { slug: "kuliah-online", label: "kuliah online" },
  { slug: "wfh", label: "WFH" },
  { slug: "bootcamp", label: "bootcamp coding" },
  { slug: "skripsi", label: "skripsi" },
  { slug: "pribadi", label: "kebutuhan pribadi" },
];

// Slug yang sudah dipakai (route dan blog post pilar) — jangan generate ulang.
const RESERVED_SLUGS = new Set<string>([
  // hub pages
  "sewa-laptop-jakarta",
  "rental-laptop-jakarta",
  "sewa-macbook",
  // area pages
  "sewa-laptop-jakarta-selatan",
  "sewa-laptop-jakarta-timur",
  "sewa-laptop-jakarta-barat",
  "sewa-laptop-jakarta-utara",
  "sewa-laptop-jakarta-pusat",
  "sewa-laptop-bekasi",
  "sewa-laptop-depok",
  "sewa-laptop-tangerang",
]);

function titleCase(s: string) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

function pickInternal(area?: typeof AREAS[number]) {
  return area?.internal ?? "/sewa-laptop-jakarta";
}

// Distribusi panjang: 30% short, 50% medium, 20% long → deterministic dari index.
function lengthFor(index: number): "short" | "medium" | "long" {
  const m = index % 10;
  if (m < 3) return "short";
  if (m < 8) return "medium";
  return "long";
}

function makeSpec(args: {
  intent: (typeof INTENTS)[number];
  unit: (typeof UNITS)[number];
  durasi?: (typeof DURASI)[number];
  modifier?: (typeof MODIFIERS)[number];
  area?: (typeof AREAS)[number];
  useCase?: (typeof USECASES)[number];
  index: number;
}): SlugSpec | null {
  const { intent, unit, durasi, modifier, area, useCase, index } = args;

  const parts = [intent, unit.slug];
  const kwParts = [intent === "sewa" ? "sewa" : "rental", unit.label.toLowerCase()];
  if (durasi) {
    parts.push(durasi.slug);
    kwParts.push(durasi.label);
  }
  if (modifier) {
    parts.push(modifier.slug);
    kwParts.push(modifier.label);
  }
  if (area) {
    parts.push(area.slug);
    kwParts.push(area.label);
  }
  if (useCase) {
    parts.push("untuk", useCase.slug);
    kwParts.push("untuk", useCase.label);
  }

  const slug = parts.join("-").toLowerCase();
  if (RESERVED_SLUGS.has(slug)) return null;

  const primaryKeyword = kwParts.join(" ");

  // Title < 60 chars. Format: "<Keyword> — Techpora" or singkat.
  const kwTitle = titleCase(kwParts.join(" "));
  let title = `${kwTitle} | Techpora`;
  if (title.length > 60) title = kwTitle.slice(0, 60);

  return {
    slug,
    primaryKeyword,
    title,
    intent,
    unit: unit.slug,
    durasi: durasi?.slug,
    area: area?.label,
    areaSlug: area?.slug,
    modifier: modifier?.slug,
    useCase: useCase?.slug,
    length: lengthFor(index),
    persona: index % 6,
    outlineVariant: index % 8,
    internalPath: pickInternal(area),
  };
}

/**
 * Bangun matriks 500 slug unik, ter-shuffle deterministic dari beberapa strategi.
 */
export function buildMatrix(target = 500): SlugSpec[] {
  const seen = new Set<string>();
  const out: SlugSpec[] = [];
  let idx = 0;

  const push = (spec: SlugSpec | null) => {
    if (!spec || seen.has(spec.slug)) return;
    seen.add(spec.slug);
    out.push(spec);
    idx++;
  };

  // Strategi A: intent × unit × durasi × area (mesin utama)
  for (const area of AREAS) {
    for (const durasi of DURASI) {
      for (const unit of UNITS) {
        for (const intent of INTENTS) {
          if (out.length >= target) break;
          push(makeSpec({ intent, unit, durasi, area, index: idx }));
        }
      }
    }
  }

  // Strategi B: intent × laptop × modifier × area
  const laptop = UNITS[0]; // laptop generic
  for (const area of AREAS) {
    for (const modifier of MODIFIERS) {
      for (const intent of INTENTS) {
        if (out.length >= target) break;
        push(makeSpec({ intent, unit: laptop, modifier, area, index: idx }));
      }
    }
  }

  // Strategi C: intent × laptop × durasi × modifier (tanpa area)
  for (const durasi of DURASI) {
    for (const modifier of MODIFIERS) {
      for (const intent of INTENTS) {
        if (out.length >= target) break;
        push(makeSpec({ intent, unit: laptop, durasi, modifier, index: idx }));
      }
    }
  }

  // Strategi D: intent × laptop × usecase × area
  for (const useCase of USECASES) {
    for (const area of AREAS) {
      for (const intent of INTENTS) {
        if (out.length >= target) break;
        push(makeSpec({ intent, unit: laptop, useCase, area, index: idx }));
      }
    }
  }

  // Strategi E: intent × unit × modifier
  for (const unit of UNITS) {
    for (const modifier of MODIFIERS) {
      for (const intent of INTENTS) {
        if (out.length >= target) break;
        push(makeSpec({ intent, unit, modifier, index: idx }));
      }
    }
  }

  return out.slice(0, target);
}

if (import.meta.main) {
  const m = buildMatrix(500);
  console.log(`Total slug: ${m.length}`);
  console.log(`Panjang mix: short=${m.filter((s) => s.length === "short").length}, medium=${m.filter((s) => s.length === "medium").length}, long=${m.filter((s) => s.length === "long").length}`);
  console.log("Sample:", m.slice(0, 8).map((s) => s.slug));
  console.log("Last:", m.slice(-4).map((s) => s.slug));
}
