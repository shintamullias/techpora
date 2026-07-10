/**
 * Generator artikel blog: panggil Lovable AI Gateway untuk tiap slug,
 * simpan sebagai JSON di src/content/blog/generated/{slug}.json.
 *
 * Usage:
 *   bun scripts/generate-articles.ts               # generate 5 sample
 *   bun scripts/generate-articles.ts --count 500   # generate 500
 *   bun scripts/generate-articles.ts --resume      # skip yang sudah ada
 *
 * Read LOVABLE_API_KEY dari env.
 */

import { mkdir, writeFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { buildMatrix, type SlugSpec } from "./keyword-matrix";

const OUT_DIR = "src/content/blog/generated";
const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "openai/gpt-5.5";
const CONCURRENCY = 5;
const WA_NUMBER = "6282177984041";

const args = process.argv.slice(2);
const argCount = args.includes("--count")
  ? Number(args[args.indexOf("--count") + 1])
  : 5;
const resume = args.includes("--resume") || argCount > 20; // auto-resume utk batch besar

const PERSONAS = [
  "gaya kasual seperti teman yang cerita, gunakan kata 'kamu' dan analogi sehari-hari",
  "gaya konsultan profesional, ringkas, banyak angka dan perbandingan",
  "gaya jurnalistik, ada anekdot pembuka + fakta lokal",
  "gaya blogger, pertanyaan retoris, subheading singkat",
  "gaya editor tekno, jargon dijelaskan, sedikit humor",
  "gaya storytelling case-study, awali dengan skenario pelanggan",
];

const OUTLINE_VARIANTS = [
  ["Kapan sewa lebih masuk akal", "Spesifikasi minimum yang kamu butuh", "Harga & paket", "Cara pesan cepat via WA"],
  ["Kenapa banyak orang pilih sewa", "Cek unit sebelum ambil", "Estimasi biaya realistis", "Alur pengiriman"],
  ["Skenario umum yang cocok", "Unit populer di kategori ini", "Simulasi harga", "Tanya jawab singkat"],
  ["Alasan sewa mengalahkan beli", "Yang harus dicek di kontrak sewa", "Rekomendasi durasi", "Kontak Techpora"],
  ["Situasi yang bikin kamu butuh ini", "Detail spesifikasi", "Rincian biaya", "Wilayah antar", "Testimoni singkat"],
  ["Overview singkat", "Perbandingan sewa vs beli", "Cara memilih unit", "Harga sewa terbaru", "FAQ"],
  ["Latar situasi", "Kriteria unit yang tepat", "Harga per periode", "Layanan tambahan", "Cara pesan"],
  ["Kenapa Techpora", "Unit yang sering diambil", "Simulasi paket hemat", "Wilayah antar", "Booking"],
];

const LENGTH_TARGETS = {
  short: { sections: 3, wordsPerSection: [80, 130] as [number, number], intro: [70, 100] as [number, number] },
  medium: { sections: 5, wordsPerSection: [140, 190] as [number, number], intro: [90, 130] as [number, number] },
  long: { sections: 8, wordsPerSection: [200, 260] as [number, number], intro: [120, 160] as [number, number] },
};

type GeneratedPost = {
  slug: string;
  title: string;
  description: string;
  category: "Mahasiswa" | "Profesional" | "Event" | "Panduan" | "Lokasi";
  date: string;
  readMinutes: number;
  intro: string;
  sections: { h: string; p: string }[];
  cta: {
    heading: string;
    body: string;
    waMessage: string;
    internalPath: string;
    internalLabel: string;
  };
  related: string[];
  keywords: string;
};

function categoryFor(spec: SlugSpec): GeneratedPost["category"] {
  if (spec.useCase === "mahasiswa" || spec.useCase === "skripsi" || spec.useCase === "kuliah-online" || spec.useCase === "bootcamp") return "Mahasiswa";
  if (spec.useCase === "event" || spec.useCase === "meeting") return "Event";
  if (spec.useCase === "freelancer" || spec.useCase === "kantor" || spec.useCase === "wfh" || spec.useCase === "editing" || spec.useCase === "design") return "Profesional";
  if (spec.area) return "Lokasi";
  return "Panduan";
}

function buildPrompt(spec: SlugSpec): { system: string; user: string } {
  const cfg = LENGTH_TARGETS[spec.length];
  const persona = PERSONAS[spec.persona];
  const outline = OUTLINE_VARIANTS[spec.outlineVariant].slice(0, cfg.sections);
  const areaTxt = spec.area ? `di ${spec.area}` : "di Jakarta dan sekitarnya";
  const durasiTxt = spec.durasi ? ` (${spec.durasi})` : "";
  const modTxt = spec.modifier ? ` — highlight modifier: ${spec.modifier}` : "";
  const useCaseTxt = spec.useCase ? ` — target audience: ${spec.useCase}` : "";

  const system = `Kamu adalah penulis blog SEO Bahasa Indonesia untuk Techpora.id, penyedia sewa/rental laptop di Jakarta.
Aturan wajib:
- Tulis natural, TIDAK boleh terdengar seperti hasil AI generic atau spun content.
- ${persona}.
- JANGAN pakai frasa klise ("dalam era digital", "seiring perkembangan zaman", "di zaman sekarang ini").
- JANGAN mengulang keyword utama lebih dari 4x di seluruh artikel.
- Wajib menyebut nomor WhatsApp Techpora: 6282177984041 (atau frasa "chat via WhatsApp") minimal 1x di intro dan 1x di CTA.
- Harga referensi (jangan di-invent): laptop mulai Rp100.000/hari, MacBook mulai Rp250.000/hari, sewa bulanan mulai Rp1.500.000.
- Struktur H2 mengikuti outline yang diberikan.
- Setiap paragraf punya opening yang berbeda (variasi kalimat pembuka).`;

  const user = `Tulis artikel blog untuk keyword utama: "${spec.primaryKeyword}".

Konteks:
- Intent: ${spec.intent} laptop
- Unit: ${spec.unit}
- Durasi: ${spec.durasi ?? "campuran"}
- Area: ${spec.area ?? "Jakarta umum"}${modTxt}${useCaseTxt}
- Panjang: ${spec.length} (${cfg.sections} section, ${cfg.wordsPerSection[0]}-${cfg.wordsPerSection[1]} kata/section)
- Fokus: laptop rental ${areaTxt}${durasiTxt}

Outline H2 yang WAJIB dipakai (boleh reword tapi urutan sama):
${outline.map((o, i) => `${i + 1}. ${o}`).join("\n")}

Return JSON persis dengan schema berikut, TANPA markdown fence:
{
  "title": "string, MAX 60 karakter, mengandung keyword utama",
  "description": "string, MAX 155 karakter, mengandung keyword & CTA implicit",
  "intro": "1 paragraf ${cfg.intro[0]}-${cfg.intro[1]} kata, sebutkan WhatsApp",
  "sections": [
    { "h": "H2 heading (sesuai outline)", "p": "paragraf ${cfg.wordsPerSection[0]}-${cfg.wordsPerSection[1]} kata" }
  ],
  "ctaHeading": "judul CTA singkat 4-8 kata, kontekstual",
  "ctaBody": "1 kalimat 20-35 kata mendorong chat WA",
  "waMessage": "pesan WhatsApp pre-filled 2 kalimat singkat yang MENYEBUT keyword utama dan lihat dari techpora.id"
}

Jumlah section HARUS ${cfg.sections}. Jangan tambah field lain.`;

  return { system, user };
}

async function callAI(spec: SlugSpec, apiKey: string): Promise<GeneratedPost> {
  const { system, user } = buildPrompt(spec);
  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      response_format: { type: "json_object" },
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`AI Gateway ${res.status}: ${body.slice(0, 500)}`);
  }
  const json = await res.json();
  const raw = json.choices?.[0]?.message?.content;
  if (!raw) throw new Error("No content in AI response");
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    throw new Error(`JSON parse fail: ${raw.slice(0, 200)}`);
  }

  const sections = (parsed.sections as { h: string; p: string }[] | undefined) ?? [];
  const wordCount =
    ((parsed.intro as string) ?? "").split(/\s+/).length +
    sections.reduce((s, sec) => s + (sec.p || "").split(/\s+/).length, 0);
  const readMinutes = Math.max(2, Math.round(wordCount / 220));

  const post: GeneratedPost = {
    slug: spec.slug,
    title: ((parsed.title as string) || spec.title).slice(0, 60),
    description: ((parsed.description as string) || "").slice(0, 155),
    category: categoryFor(spec),
    date: "2026-07-10",
    readMinutes,
    intro: (parsed.intro as string) ?? "",
    sections,
    cta: {
      heading: (parsed.ctaHeading as string) || "Butuh sekarang? Chat WhatsApp Techpora",
      body: (parsed.ctaBody as string) || "Tim kami balas cepat dan bisa antar unit ke lokasimu.",
      waMessage:
        (parsed.waMessage as string) ||
        `Halo Techpora, saya mau ${spec.primaryKeyword}. Mohon info ketersediaan. Saya lihat dari techpora.id.`,
      internalPath: spec.internalPath,
      internalLabel: spec.area ? `Cek layanan ${spec.area}` : "Cek semua unit Techpora",
    },
    related: [],
    keywords: spec.primaryKeyword,
  };
  return post;
}

async function runBatch(specs: SlugSpec[], apiKey: string) {
  await mkdir(OUT_DIR, { recursive: true });

  let existing = new Set<string>();
  if (resume && existsSync(OUT_DIR)) {
    const files = await readdir(OUT_DIR);
    existing = new Set(files.filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, "")));
  }

  const todo = specs.filter((s) => !existing.has(s.slug));
  console.log(`Total: ${specs.length}, sudah ada: ${existing.size}, akan generate: ${todo.length}`);

  let done = 0;
  let failed = 0;

  const worker = async (spec: SlugSpec) => {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const post = await callAI(spec, apiKey);
        // basic validation
        if (!post.intro || post.sections.length === 0) throw new Error("empty content");
        await writeFile(join(OUT_DIR, `${spec.slug}.json`), JSON.stringify(post, null, 2));
        done++;
        if (done % 10 === 0 || done < 10) {
          console.log(`  ✓ [${done}/${todo.length}] ${spec.slug} (${post.sections.length} sections)`);
        }
        return;
      } catch (e) {
        if (attempt === 1) {
          failed++;
          console.error(`  ✗ ${spec.slug}: ${(e as Error).message}`);
        } else {
          await new Promise((r) => setTimeout(r, 1500));
        }
      }
    }
  };

  // Simple concurrency pool
  const queue = [...todo];
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) {
      const next = queue.shift();
      if (!next) break;
      await worker(next);
    }
  });
  await Promise.all(workers);

  console.log(`\nSelesai: ${done} ok, ${failed} gagal.`);
}

async function main() {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("LOVABLE_API_KEY missing");

  const matrix = buildMatrix(500);
  const count = argCount > 0 ? argCount : 5;
  const target = matrix.slice(0, count);
  console.log(`Generating ${target.length} artikel dgn model ${MODEL}...`);
  await runBatch(target, apiKey);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
