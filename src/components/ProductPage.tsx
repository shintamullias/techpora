import { Link } from "@tanstack/react-router";
import { MessageCircle, ArrowLeft, Check } from "lucide-react";
import logoAsset from "@/assets/techpora-logo.png.asset.json";
import { getUnitImage } from "@/assets/units";
import { Button } from "@/components/ui/button";
import { buildWaSimple, waLink } from "@/lib/wa";

export const PRODUCT_SITE_URL = "https://techpora.id";

export type ProductUnit = {
  name: string;
  specs: string;
  daily: string;
  weekly: string;
  monthly: string;
  dailyNum: number;
  monthlyNum: number;
};

export type ProductPageData = {
  slug: string;
  title: string;
  description: string;
  keywords: string;
  eyebrow: string;
  h1: string;
  intro: string;
  waUnit: string;
  unitsHeading: string;
  units: ProductUnit[];
  whyHeading: string;
  why: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
  related: { to: string; label: string }[];
};

/** Head meta + JSON-LD (Product/AggregateOffer + FAQPage) untuk halaman produk. */
export function productHead(d: ProductPageData) {
  const url = `${PRODUCT_SITE_URL}/${d.slug}`;
  const low = Math.min(...d.units.map((u) => u.dailyNum));
  const high = Math.max(...d.units.map((u) => u.monthlyNum));
  return {
    meta: [
      { title: d.title },
      { name: "description", content: d.description },
      { name: "keywords", content: d.keywords },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1" },
      { property: "og:title", content: d.title },
      { property: "og:description", content: d.description },
      { property: "og:url", content: url },
      { property: "og:type", content: "website" },
      { property: "og:image", content: `${PRODUCT_SITE_URL}/og-image.jpg` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: d.title },
      { name: "twitter:description", content: d.description },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: d.h1,
          description: d.description,
          category: d.eyebrow,
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "IDR",
            lowPrice: String(low),
            highPrice: String(high),
            offerCount: d.units.length * 3,
            availability: "https://schema.org/InStock",
            seller: { "@type": "LocalBusiness", name: "Techpora.id", url: PRODUCT_SITE_URL, telephone: "+62821-7798-4041" },
          },
          url,
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: d.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  };
}

export function ProductPage({ data }: { data: ProductPageData }) {
  const wa = waLink(buildWaSimple(data.waUnit));
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoAsset.url} alt="Techpora.id" className="h-14 w-auto" />
          </Link>
          <nav className="hidden items-center gap-6 lg:flex text-sm font-medium text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Beranda</Link>
            <Link to="/blog" className="hover:text-foreground">Blog</Link>
          </nav>
          <a href={wa} target="_blank" rel="noopener noreferrer">
            <Button className="gap-2 rounded-full bg-primary hover:bg-primary/90">
              <MessageCircle className="h-4 w-4" />
              Chat WhatsApp
            </Button>
          </a>
        </div>
      </header>

      <main>
        <section className="border-b border-border bg-secondary/30">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
            <Link to="/" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Kembali ke beranda
            </Link>
            <p className="text-sm font-semibold text-primary">{data.eyebrow}</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">{data.h1}</h1>
            <p className="mt-4 max-w-3xl text-lg text-muted-foreground">{data.intro}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={wa} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="gap-2 rounded-full bg-primary hover:bg-primary/90">
                  <MessageCircle className="h-4 w-4" />
                  Cek Ketersediaan
                </Button>
              </a>
              <Link to="/sewa-laptop-jakarta">
                <Button size="lg" variant="outline" className="rounded-full">Lihat sewa laptop</Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight">{data.unitsHeading}</h2>
          <p className="mt-2 text-sm text-muted-foreground">Harga per unit. Ketersediaan dikonfirmasi lewat WhatsApp sebelum pesanan.</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {data.units.map((u) => {
              const img = getUnitImage(u.name);
              return (
                <article key={u.name} className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                  {img && (
                    <div className="flex aspect-[4/3] items-center justify-center bg-secondary p-6">
                      <img src={img} alt={`Sewa ${u.name} Jakarta`} width={800} height={600} loading="lazy" className="max-h-full w-auto object-contain drop-shadow-md" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-lg font-bold">{u.name}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{u.specs}</p>
                    <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
                      <Row label="Harian" value={u.daily} />
                      <Row label="Mingguan" value={u.weekly} />
                      <Row label="Bulanan" value={u.monthly} highlight />
                    </div>
                    <a href={waLink(buildWaSimple(u.name))} target="_blank" rel="noopener noreferrer" className="mt-5">
                      <Button className="w-full gap-2 rounded-full bg-primary hover:bg-primary/90">
                        <MessageCircle className="h-4 w-4" />
                        Pesan {u.name}
                      </Button>
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="border-y border-border bg-secondary/30">
          <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight">{data.whyHeading}</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {data.why.map((w) => (
                <div key={w.title} className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center gap-2 font-semibold">
                    <Check className="h-4 w-4 flex-none text-primary" />
                    {w.title}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{w.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight">Pertanyaan yang Sering Ditanyakan</h2>
          <div className="mt-6 space-y-4">
            {data.faqs.map((f) => (
              <div key={f.q} className="rounded-2xl border border-border bg-card p-5">
                <h3 className="font-semibold">{f.q}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <h2 className="text-xl font-bold">Layanan Techpora lainnya</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {data.related.map((r) => (
                <a key={r.to} href={r.to} className="rounded-full border border-border bg-card px-4 py-2 text-sm hover:border-primary/50 hover:text-primary">
                  {r.label}
                </a>
              ))}
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center">
            <h2 className="text-2xl font-bold">Butuh {data.waUnit} sekarang?</h2>
            <p className="mt-2 text-muted-foreground">Chat sekarang — kami balas cepat dan info stok terbaru.</p>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block">
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
          <p>Copyright © Techpora.id — Sewa Laptop, Printer & Proyektor Jakarta</p>
        </div>
      </footer>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={highlight ? "font-bold text-primary" : "font-semibold"}>{value}</span>
    </div>
  );
}
