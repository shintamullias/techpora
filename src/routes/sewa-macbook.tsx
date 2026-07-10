import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle, Check, ArrowLeft, Palette, Code2, Video, Sparkles } from "lucide-react";
import logoAsset from "@/assets/techpora-logo.png.asset.json";
import { Button } from "@/components/ui/button";
import { buildWaSimple, waLink } from "@/lib/wa";

const SITE_URL = "https://techpora.id";
const SLUG = "sewa-macbook";
const TITLE = "Sewa MacBook Jakarta — Air M1 Harian & Bulanan";
const DESC =
  "Sewa MacBook di Jakarta untuk desainer, developer, dan pekerja kreatif. MacBook Air M1 ready — harian, mingguan, bulanan. Antar-jemput area Jabodetabek.";

const useCases = [
  {
    icon: Palette,
    title: "Desainer & Kreatif",
    body: "Figma, Adobe Illustrator, Photoshop, dan After Effects lancar di layar Retina dengan color accuracy tinggi.",
  },
  {
    icon: Code2,
    title: "Developer & Engineer",
    body: "Xcode, Docker, Node, dan toolchain berbasis Unix jalan native di Apple Silicon — tanpa perlu setup dual boot.",
  },
  {
    icon: Video,
    title: "Video & Content Creator",
    body: "Final Cut Pro dan Premiere untuk editing 1080p/4K ringan, dengan baterai tahan seharian saat produksi lapangan.",
  },
  {
    icon: Sparkles,
    title: "Presentasi & Pitching",
    body: "Tampil profesional di depan klien atau investor — Keynote di MacBook memberi kesan siap dan premium.",
  },
];

const specs = [
  "Apple M1 chip (8-core CPU, 7/8-core GPU)",
  "RAM 8GB unified memory",
  "SSD 256GB",
  "Layar Retina 13.3\" (2560 x 1600)",
  "Baterai hingga 15 jam pemakaian",
  "macOS versi terbaru + software standar terpasang",
];

const faqs = [
  {
    q: "Berapa harga sewa MacBook Air M1 di Techpora?",
    a: "Rp250.000 per hari, Rp1.500.000 per minggu, Rp4.500.000 per bulan. Semakin panjang durasi semakin hemat.",
  },
  {
    q: "Apa syarat sewa MacBook?",
    a: "KTP + satu identitas pendukung (SIM/kartu pelajar/kartu kantor). Untuk durasi panjang atau nominal besar bisa ada deposit yang dijelaskan saat konfirmasi via WhatsApp.",
  },
  {
    q: "Apakah bisa antar-jemput ke lokasi saya?",
    a: "Bisa. Kami melayani antar-jemput area Jakarta, Bekasi, Depok, dan Tangerang. Biaya antar disesuaikan jarak dan bisa gratis untuk durasi tertentu.",
  },
  {
    q: "Apakah software desain sudah terinstall?",
    a: "MacBook siap pakai dengan macOS terbaru. Software berlisensi (Adobe, Figma desktop, dll.) menggunakan akun pribadi Anda — kami bantu proses instalasi jika perlu.",
  },
];

const waMacbook = buildWaSimple("MacBook Air M1");

export const Route = createFileRoute("/sewa-macbook")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      {
        name: "keywords",
        content:
          "sewa macbook, sewa macbook jakarta, rental macbook, sewa macbook air m1, sewa laptop apple, rental macbook harian, sewa macbook bulanan",
      },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: `${SITE_URL}/${SLUG}` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/${SLUG}` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: "Sewa MacBook Air M1 — Techpora",
          description: DESC,
          brand: { "@type": "Brand", name: "Apple" },
          category: "Laptop Rental",
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "IDR",
            lowPrice: "250000",
            highPrice: "4500000",
            offerCount: 3,
            availability: "https://schema.org/InStock",
            seller: {
              "@type": "LocalBusiness",
              name: "Techpora.id",
              url: SITE_URL,
              telephone: "+62821-7798-4041",
            },
          },
          url: `${SITE_URL}/${SLUG}`,
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: MacbookPage,
});

function MacbookPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoAsset.url} alt="Techpora.id" className="h-9 w-auto" />
          </Link>
          <nav className="hidden items-center gap-6 lg:flex text-sm font-medium text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Beranda</Link>
            <Link to="/blog" className="hover:text-foreground">Blog</Link>
          </nav>
          <a href={waLink(waMacbook)} target="_blank" rel="noopener noreferrer">
            <Button className="gap-2 rounded-full bg-primary hover:bg-primary/90">
              <MessageCircle className="h-4 w-4" />
              Chat WhatsApp
            </Button>
          </a>
        </div>
      </header>

      <main>
        <section className="border-b border-border bg-gradient-to-b from-secondary/30 to-background">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
            <Link to="/" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Kembali ke beranda
            </Link>
            <p className="text-sm font-semibold text-primary">Rental MacBook — Jakarta & Jabodetabek</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Sewa MacBook Jakarta — MacBook Air M1 Ready Pakai
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
              Kebutuhan MacBook untuk proyek desain, coding di Apple Silicon, editing
              video, atau presentasi klien? Techpora menyediakan MacBook Air M1
              untuk sewa harian, mingguan, dan bulanan di Jakarta dan sekitarnya —
              tanpa perlu commit beli unit baru.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={waLink(waMacbook)} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="gap-2 rounded-full bg-primary hover:bg-primary/90">
                  <MessageCircle className="h-4 w-4" />
                  Cek Ketersediaan MacBook
                </Button>
              </a>
              <Link to="/">
                <Button size="lg" variant="outline" className="rounded-full">
                  Lihat unit laptop lainnya
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight">Kenapa Sewa MacBook, Bukan Beli?</h2>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            MacBook baru berkisar Rp15–25 juta per unit. Untuk proyek freelance,
            kebutuhan client 1–3 bulan, atau uji coba workflow Apple Silicon,
            menyewa jauh lebih masuk akal — tidak ada aset menganggur setelah
            proyek selesai, dan biaya bisa langsung dibebankan ke proyek.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {useCases.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-lg font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-border bg-secondary/30">
          <div className="mx-auto grid max-w-5xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">MacBook Air M1 — Spesifikasi</h2>
              <p className="mt-3 text-muted-foreground">
                Unit yang tersedia di Techpora sudah dites, di-reset, dan siap
                dipakai begitu sampai di lokasi Anda.
              </p>
              <ul className="mt-5 space-y-2">
                {specs.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 flex-none text-primary" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="text-sm font-semibold text-primary">Harga sewa</p>
              <h3 className="mt-1 text-2xl font-bold">MacBook Air M1</h3>
              <div className="mt-5 space-y-3">
                <PriceRow label="Harian" price="Rp250.000" />
                <PriceRow label="Mingguan" price="Rp1.500.000" hint="Hemat vs harian" />
                <PriceRow label="Bulanan" price="Rp4.500.000" hint="Paling hemat" highlight />
              </div>
              <a href={waLink(waMacbook)} target="_blank" rel="noopener noreferrer" className="mt-6 block">
                <Button className="w-full gap-2 rounded-full bg-primary hover:bg-primary/90">
                  <MessageCircle className="h-4 w-4" />
                  Pesan MacBook via WhatsApp
                </Button>
              </a>
              <p className="mt-3 text-xs text-muted-foreground">
                Ketersediaan dinamis — konfirmasi via WhatsApp untuk memastikan
                unit ready pada tanggal yang Anda butuhkan.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight">Pertanyaan yang Sering Ditanyakan</h2>
          <div className="mt-6 space-y-4">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-2xl border border-border bg-card p-5">
                <h3 className="font-semibold">{f.q}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center">
            <h2 className="text-2xl font-bold">Butuh MacBook untuk proyek Anda?</h2>
            <p className="mt-2 text-muted-foreground">
              Chat sekarang — kami balas cepat dan info stok real-time.
            </p>
            <a href={waLink(waMacbook)} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block">
              <Button size="lg" className="gap-2 rounded-full bg-primary hover:bg-primary/90">
                <MessageCircle className="h-4 w-4" />
                Hubungi Techpora
              </Button>
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-secondary/30 py-10">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
          <p>Copyright © Techpora.id — Sewa Laptop & MacBook Jakarta</p>
        </div>
      </footer>
    </div>
  );
}

function PriceRow({ label, price, hint, highlight }: { label: string; price: string; hint?: string; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between rounded-xl border px-4 py-3 ${highlight ? "border-primary/40 bg-primary/5" : "border-border"}`}>
      <div>
        <p className="font-medium">{label}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
      <p className="text-lg font-bold">{price}</p>
    </div>
  );
}
