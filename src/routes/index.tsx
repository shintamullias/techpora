import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Check,
  Cpu,
  HardDrive,
  MemoryStick,
  MessageCircle,
  Phone,
  ShieldCheck,
  Zap,
  Clock,
  Truck,
  Instagram,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
} from "lucide-react";
import logoAsset from "@/assets/techpora-logo.png.asset.json";
import heroLaptop from "@/assets/hero-laptop.jpg";
import { Button } from "@/components/ui/button";

const WA_LINK =
  "https://wa.me/628812107859?text=Halo%20Techpora%2C%20saya%20ingin%20menyewa%20laptop.";
const PHONE = "0881-2107-859";

const SITE_URL = "https://sewalaptopjakarta.lovable.app";

const faqData = [
  { q: "Minimal sewa berapa hari?", a: "Bisa harian, mingguan, hingga bulanan." },
  { q: "Apakah bisa dikirim?", a: "Ya, tersedia layanan pengiriman." },
  { q: "Apakah laptop sudah siap pakai?", a: "Ya, semua unit sudah dicek dan siap digunakan." },
  { q: "Bisa untuk Zoom dan meeting?", a: "Ya, seluruh unit cocok untuk Zoom, Google Meet, presentasi, dan pekerjaan kantor." },
  { q: "Bingung pilih laptop?", a: "Admin siap membantu merekomendasikan unit sesuai kebutuhan dan budget." },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Techpora.id — Sewa Laptop Mudah, Cepat & Terpercaya" },
      {
        name: "description",
        content:
          "Sewa laptop harian, mingguan, dan bulanan untuk mahasiswa, freelancer, event, dan kebutuhan kerja. Unit terjamin, siap pakai, pengiriman cepat area Jakarta.",
      },
      { property: "og:title", content: "Techpora.id — Sewa Laptop Jakarta" },
      {
        property: "og:description",
        content: "Laptop siap pakai untuk mahasiswa, freelancer, dan event. Harian, mingguan, bulanan.",
      },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "Techpora.id — Sewa Laptop Jakarta" },
      { name: "twitter:description", content: "Laptop siap pakai untuk mahasiswa, freelancer, dan event. Harian, mingguan, bulanan." },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Techpora.id",
          description:
            "Layanan sewa laptop harian, mingguan, dan bulanan untuk mahasiswa, freelancer, event, dan kebutuhan kerja.",
          url: SITE_URL,
          telephone: "+62881-2107-859",
          areaServed: "Jakarta",
          priceRange: "Rp",
          sameAs: ["https://www.instagram.com/sewalaptopjakarta.co"],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqData.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: Index,
});

const navLinks = [
  { href: "#beranda", label: "Beranda" },
  { href: "#unit", label: "Unit Laptop" },
  { href: "#cara", label: "Cara Sewa" },
  { href: "#syarat", label: "Syarat Sewa" },
  { href: "#faq", label: "FAQ" },
  { href: "#kontak", label: "Kontak" },
];

const units = [
  {
    name: "Lenovo ThinkPad",
    cpu: "Intel Core i3",
    ram: "RAM 8GB",
    ssd: "SSD 256GB",
    daily: "Rp100.000",
    weekly: "Rp650.000",
    monthly: "Rp1.500.000",
  },
  {
    name: "ASUS VivoBook",
    cpu: "Intel Core i3",
    ram: "RAM 8GB",
    ssd: "SSD 256GB",
    daily: "Rp135.000",
    weekly: "Rp850.000",
    monthly: "Rp2.000.000",
  },
  {
    name: "RedmiBook 15",
    cpu: "Intel Core i3",
    ram: "RAM 8GB",
    ssd: "SSD 256GB",
    daily: "Rp135.000",
    weekly: "Rp850.000",
    monthly: "Rp2.000.000",
  },
  {
    name: "Acer Aspire 5",
    cpu: "Intel Core i5",
    ram: "RAM 8GB",
    ssd: "SSD 256GB",
    daily: "Rp175.000",
    weekly: "Rp1.100.000",
    monthly: "Rp3.000.000",
  },
  {
    name: "MacBook Air M1",
    cpu: "Apple M1",
    ram: "RAM 8GB",
    ssd: "SSD 256GB",
    daily: "Rp250.000",
    weekly: "Rp1.500.000",
    monthly: "Rp4.500.000",
    featured: true,
  },
];

const whyItems = [
  { icon: ShieldCheck, title: "Unit Terjamin", desc: "Semua unit dicek sebelum dikirim." },
  { icon: Zap, title: "Siap Pakai", desc: "Laptop siap digunakan tanpa instalasi tambahan." },
  { icon: Clock, title: "Fast Response", desc: "Admin siap membantu kapan saja." },
  { icon: Truck, title: "Pengiriman Cepat", desc: "Area Jakarta dan sekitarnya." },
];

const steps = [
  { n: "01", title: "Pilih Unit", desc: "Tentukan laptop sesuai kebutuhan & budget." },
  { n: "02", title: "Hubungi Admin", desc: "Chat WhatsApp untuk cek ketersediaan." },
  { n: "03", title: "Verifikasi Data", desc: "Kirim dokumen sesuai syarat sewa." },
  { n: "04", title: "Pembayaran", desc: "Lunas di awal masa sewa." },
  { n: "05", title: "Unit Dikirim", desc: "Laptop sampai, siap pakai." },
];

const faqs = [
  { q: "Minimal sewa berapa hari?", a: "Bisa harian, mingguan, hingga bulanan." },
  { q: "Apakah bisa dikirim?", a: "Ya, tersedia layanan pengiriman." },
  { q: "Apakah laptop sudah siap pakai?", a: "Ya, semua unit sudah dicek dan siap digunakan." },
  {
    q: "Bisa untuk Zoom dan meeting?",
    a: "Ya, seluruh unit cocok untuk Zoom, Google Meet, presentasi, dan pekerjaan kantor.",
  },
  {
    q: "Bingung pilih laptop?",
    a: "Admin siap membantu merekomendasikan unit sesuai kebutuhan dan budget.",
  },
];

const terms = [
  "Booking unit terlebih dahulu.",
  "Pembayaran dilakukan penuh di awal masa sewa.",
  "Penyewa bersedia didokumentasikan saat serah terima unit.",
  "Penyewa bertanggung jawab atas kerusakan akibat human error selama masa sewa.",
  "Kehilangan unit menjadi tanggung jawab penyewa.",
  "Masa sewa dihitung 24 jam sejak unit diterima.",
  "Keterlambatan pengembalian dikenakan biaya Rp10.000 per jam.",
  "Unit tidak boleh dipindahtangankan kepada pihak lain.",
  "Jika terdapat kendala penggunaan, wajib mengirimkan video bukti agar tim dapat melakukan pengecekan.",
  "Dokumen jaminan akan dikembalikan setelah unit diterima kembali dalam kondisi baik.",
];

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#beranda" className="flex items-center gap-2">
            <img src={logoAsset.url} alt="Techpora.id" className="h-9 w-auto" />
          </a>
          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="hidden lg:block">
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
              <Button className="gap-2 rounded-full bg-primary hover:bg-primary/90">
                <MessageCircle className="h-4 w-4" />
                Chat WhatsApp
              </Button>
            </a>
          </div>
          <button
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-border bg-background lg:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
                >
                  {l.label}
                </a>
              ))}
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="mt-2">
                <Button className="w-full gap-2 rounded-full bg-primary hover:bg-primary/90">
                  <MessageCircle className="h-4 w-4" />
                  Chat WhatsApp
                </Button>
              </a>
            </div>
          </div>
        )}
      </header>

      <main>
      {/* HERO */}
      <section id="beranda" className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-32 right-0 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-20 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-8 lg:py-24 lg:px-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
              Sewa Laptop Jakarta
            </div>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Sewa Laptop <span className="text-primary">Mudah, Cepat</span> & Terpercaya
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Laptop siap pakai untuk mahasiswa, freelancer, pekerja kantor, kebutuhan event,
              seminar, registrasi, dan pekerjaan harian.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="w-full gap-2 rounded-full bg-primary px-7 hover:bg-primary/90 sm:w-auto">
                  <MessageCircle className="h-5 w-5" />
                  Chat WhatsApp
                </Button>
              </a>
              <a href="#unit">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full gap-2 rounded-full border-border px-7 sm:w-auto"
                >
                  Lihat Unit Tersedia
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
            </div>
            <div className="mt-8 flex items-center gap-3 text-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Phone className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Hubungi Kami</div>
                <a href={`tel:${PHONE.replace(/-/g, "")}`} className="font-semibold text-foreground">
                  {PHONE}
                </a>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-primary/15 via-primary/5 to-transparent" />
            <div className="relative rounded-3xl border border-border bg-card p-6 shadow-[0_30px_80px_-20px_rgba(37,99,235,0.25)] sm:p-10">
              <img
                src={heroLaptop}
                alt="Laptop premium siap sewa Techpora"
                width={1024}
                height={1024}
                className="mx-auto h-auto w-full max-w-md"
              />
              <div className="absolute -bottom-5 left-6 right-6 flex items-center justify-between rounded-2xl border border-border bg-background px-5 py-3 shadow-lg sm:left-10 sm:right-10">
                <div>
                  <div className="text-xs text-muted-foreground">Mulai dari</div>
                  <div className="text-lg font-bold text-foreground">Rp100rb<span className="text-sm font-medium text-muted-foreground">/hari</span></div>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                  Available
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="border-y border-border bg-secondary/40 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">Kenapa Techpora</div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Sewa laptop tanpa ribet, dijamin nyaman
            </h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {whyItems.map((item) => (
              <div
                key={item.title}
                className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-base font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* UNITS */}
      <section id="unit" className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-xl">
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">Unit Tersedia</div>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Pilih laptop sesuai kebutuhanmu
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Semua unit dicek & siap pakai sebelum dikirim.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {units.map((u) => {
              const waUnit = `https://wa.me/628812107859?text=${encodeURIComponent(
                `Halo Techpora, saya ingin menyewa ${u.name}.`,
              )}`;
              return (
                <div
                  key={u.name}
                  className={`relative flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl ${
                    u.featured ? "border-primary/40 ring-1 ring-primary/20" : "border-border"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Available
                    </div>
                    {u.featured && (
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                        Premium
                      </span>
                    )}
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-foreground">{u.name}</h3>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                    <div className="rounded-lg bg-secondary px-2 py-2 text-center">
                      <Cpu className="mx-auto h-3.5 w-3.5 text-primary" />
                      <div className="mt-1 font-medium text-foreground">{u.cpu.replace("Intel ", "").replace("Apple ", "")}</div>
                    </div>
                    <div className="rounded-lg bg-secondary px-2 py-2 text-center">
                      <MemoryStick className="mx-auto h-3.5 w-3.5 text-primary" />
                      <div className="mt-1 font-medium text-foreground">{u.ram.replace("RAM ", "")}</div>
                    </div>
                    <div className="rounded-lg bg-secondary px-2 py-2 text-center">
                      <HardDrive className="mx-auto h-3.5 w-3.5 text-primary" />
                      <div className="mt-1 font-medium text-foreground">{u.ssd.replace("SSD ", "")}</div>
                    </div>
                  </div>
                  <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
                    <Row label="Harian" value={u.daily} />
                    <Row label="Mingguan" value={u.weekly} />
                    <Row label="Bulanan" value={u.monthly} highlight />
                  </div>
                  <a
                    href={waUnit}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6"
                  >
                    <Button className="w-full gap-2 rounded-full bg-primary hover:bg-primary/90">
                      <MessageCircle className="h-4 w-4" />
                      Sewa Sekarang
                    </Button>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW TO RENT */}
      <section id="cara" className="border-y border-border bg-secondary/40 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">Cara Sewa</div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              5 langkah, laptop sampai
            </h2>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((s, i) => (
              <div key={s.n} className="relative">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="text-3xl font-bold text-primary/30">{s.n}</div>
                  <h3 className="mt-3 text-base font-semibold text-foreground">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="absolute left-full top-1/2 hidden h-px w-5 -translate-y-1/2 bg-border lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SYARAT */}
      <section id="syarat" className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">Syarat Sewa</div>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Verifikasi tanpa deposit
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Untuk proses verifikasi penyewaan laptop tanpa deposit, mohon menyiapkan dokumen
                berikut. Data hanya digunakan untuk keperluan verifikasi dan keamanan transaksi sewa.
              </p>
              <div className="mt-8 rounded-2xl border border-border bg-card p-6">
                <h3 className="text-sm font-semibold text-foreground">Jaminan</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Penyewa bersedia meninggalkan 1 dokumen asli yang masih berlaku selama masa
                  penyewaan. Setelah unit dikembalikan dalam kondisi baik, dokumen jaminan akan
                  langsung dikembalikan kepada penyewa.
                </p>
              </div>
            </div>
            <div className="space-y-5">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-7 items-center rounded-full bg-primary px-2.5 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground">
                    Wajib
                  </span>
                  <h3 className="text-base font-semibold text-foreground">Data Wajib</h3>
                </div>
                <ul className="mt-4 space-y-2.5 text-sm">
                  {["KTP", "Screenshot profil Instagram aktif"].map((x) => (
                    <li key={x} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      <span className="text-foreground">{x}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-7 items-center rounded-full bg-secondary px-2.5 text-[11px] font-semibold uppercase tracking-wider text-foreground">
                    Pilih 2
                  </span>
                  <h3 className="text-base font-semibold text-foreground">Data Pendukung</h3>
                </div>
                <ul className="mt-4 grid grid-cols-2 gap-2.5 text-sm">
                  {["SIM", "NPWP", "KK", "KTM", "ID Card Kerja", "Paspor"].map((x) => (
                    <li key={x} className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 flex-shrink-0 text-primary" />
                      <span className="text-foreground">{x}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TERMS */}
      <section className="border-y border-border bg-secondary/40 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">Syarat & Ketentuan</div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Ketentuan penyewaan
            </h2>
          </div>
          <ol className="mt-10 grid gap-3 sm:grid-cols-2">
            {terms.map((t, i) => (
              <li
                key={i}
                className="flex gap-3 rounded-xl border border-border bg-card p-4 text-sm leading-relaxed"
              >
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {i + 1}
                </span>
                <span className="text-foreground">{t}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">FAQ</div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Pertanyaan yang sering ditanyakan
            </h2>
          </div>
          <div className="mt-10 space-y-3">
            {faqs.map((f, i) => {
              const open = openFaq === i;
              return (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-sm font-semibold text-foreground sm:text-base">{f.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {open && (
                    <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{f.a}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section id="kontak" className="px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-glow p-10 text-center shadow-[0_30px_80px_-20px_rgba(37,99,235,0.45)] sm:p-16">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              Masih bingung pilih laptop?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-primary-foreground/85">
              Chat admin sekarang dan dapatkan rekomendasi unit yang sesuai kebutuhanmu.
            </p>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="mt-8 inline-block">
              <Button
                size="lg"
                className="gap-2 rounded-full bg-background px-8 text-foreground hover:bg-background/90"
              >
                <MessageCircle className="h-5 w-5 text-primary" />
                WhatsApp Admin
              </Button>
            </a>
          </div>
        </div>
      </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border bg-background">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div>
            <img src={logoAsset.url} alt="Techpora.id" className="h-10 w-auto" />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Sewa Laptop • Mudah • Cepat • Terpercaya
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Kontak</h4>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2.5">
                <MessageCircle className="h-4 w-4 text-primary" />
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                  WhatsApp: {PHONE}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Instagram className="h-4 w-4 text-primary" />
                <a
                  href="https://instagram.com/sewalaptopjakarta.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground"
                >
                  @sewalaptopjakarta.co
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Navigasi</h4>
            <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="hover:text-foreground">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-muted-foreground sm:px-6 lg:px-8">
            Copyright © Techpora.id
          </div>
        </div>
      </footer>

      {/* Floating WA */}
      <a
        href={WA_LINK}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat WhatsApp"
        className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-emerald-500/30 transition-transform hover:scale-105"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={highlight ? "font-bold text-primary" : "font-semibold text-foreground"}>
        {value}
      </span>
    </div>
  );
}
