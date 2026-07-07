import { Link } from "@tanstack/react-router";
import { MessageCircle, MapPin, ArrowLeft, Check, Clock, Truck, ShieldCheck } from "lucide-react";
import logoAsset from "@/assets/techpora-logo.png.asset.json";
import { Button } from "@/components/ui/button";
import type { AreaData } from "@/data/areas";
import { buildWaSimple, waLink } from "@/lib/wa";

export function AreaPage({ area }: { area: AreaData }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoAsset.url} alt="Techpora.id" className="h-9 w-auto" />
          </Link>
          <nav className="hidden items-center gap-6 lg:flex text-sm font-medium text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Beranda</Link>
            <Link to="/blog" className="hover:text-foreground">Blog</Link>
          </nav>
          <a href={waLink(buildWaSimple(undefined, area.area))} target="_blank" rel="noopener noreferrer">
            <Button className="gap-2 rounded-full bg-primary hover:bg-primary/90">
              <MessageCircle className="h-4 w-4" />
              Chat WhatsApp
            </Button>
          </a>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute -top-24 right-0 h-[400px] w-[400px] rounded-full bg-primary/10 blur-3xl" />
          <div className="relative mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:py-20 lg:px-8">
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-3.5 w-3.5" />
              Kembali ke Beranda
            </Link>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
              <MapPin className="h-3 w-3 text-primary" />
              Area {area.area}
            </div>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">{area.h1}</h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {area.intro}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={waLink(buildWaSimple(undefined, area.area))} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="w-full gap-2 rounded-full bg-primary px-7 hover:bg-primary/90 sm:w-auto">
                  <MessageCircle className="h-5 w-5" />
                  Cek Ketersediaan di {area.areaShort}
                </Button>
              </a>
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="h-4 w-4 text-primary" />
              {area.eta}
            </div>
          </div>
        </section>

        {/* HIGHLIGHTS */}
        <section className="bg-secondary/40 border-b border-border py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold sm:text-3xl">Kenapa sewa di {area.area} lewat Techpora?</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {area.highlights.map((h) => (
                <div key={h.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold">{h.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{h.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* USE CASES + LANDMARKS */}
        <section className="py-14">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">Kebutuhan yang biasa kami layani</h2>
              <ul className="mt-6 space-y-3">
                {area.useCases.map((u) => (
                  <li key={u} className="flex gap-3 text-sm">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    <span>{u}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">Kawasan yang dilayani di {area.area}</h2>
              <div className="mt-6 flex flex-wrap gap-2">
                {area.landmarks.map((l) => (
                  <span key={l} className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground">
                    {l}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-sm">
                <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span className="text-muted-foreground">{area.eta}</span>
              </div>
            </div>
          </div>
        </section>

        {/* UNITS */}
        <section className="border-y border-border bg-secondary/40 py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold sm:text-3xl">Unit yang tersedia untuk {area.area}</h2>
            <p className="mt-2 text-sm text-muted-foreground">Harga sudah termasuk pengecekan unit sebelum kirim.</p>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {area.units.map((u) => (
                <article key={u.name} className={`flex flex-col rounded-2xl border bg-card p-6 shadow-sm ${u.featured ? "border-primary/40 ring-1 ring-primary/20" : "border-border"}`}>
                  <div className="text-xs font-semibold uppercase tracking-wider text-primary">{u.category}</div>
                  <h3 className="mt-2 text-lg font-bold">{u.name}</h3>
                  {u.specs && <p className="mt-1 text-xs text-muted-foreground">{u.specs}</p>}
                  <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
                    <Row label="Harian" value={u.daily} />
                    <Row label="Mingguan" value={u.weekly} />
                    <Row label="Bulanan" value={u.monthly} highlight />
                  </div>
                  <a
                    href={waLink(buildWaSimple(u.name, area.area))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5"
                  >
                    <Button className="w-full gap-2 rounded-full bg-primary hover:bg-primary/90">
                      <MessageCircle className="h-4 w-4" />
                      Sewa {u.name}
                    </Button>
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold sm:text-4xl">Siap sewa laptop di {area.area}?</h2>
            <p className="mt-4 text-muted-foreground">Chat admin sekarang, unit siap dikirim hari ini juga.</p>
            <a href={waLink(buildWaSimple(undefined, area.area))} target="_blank" rel="noopener noreferrer" className="mt-8 inline-block">
              <Button size="lg" className="gap-2 rounded-full bg-primary px-8 hover:bg-primary/90">
                <MessageCircle className="h-5 w-5" />
                Cek Ketersediaan Sekarang
              </Button>
            </a>
            <div className="mt-8">
              <Link to="/" className="text-sm font-medium text-primary hover:underline">
                ← Lihat semua unit di halaman utama
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-xs text-muted-foreground sm:px-6 lg:px-8">
          Copyright © Techpora.id — Sewa Laptop Jakarta & Sekitarnya
        </div>
      </footer>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={highlight ? "font-bold text-primary" : "font-semibold text-foreground"}>{value}</span>
    </div>
  );
}
