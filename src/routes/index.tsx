import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import {
  Check,
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
  Star,
  MapPin,
  Laptop as LaptopIcon,
  Printer as PrinterIcon,
  Projector as ProjectorIcon,
} from "lucide-react";
import logoAsset from "@/assets/techpora-logo.png.asset.json";
import heroLaptop from "@/assets/hero-laptop.jpg";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const WA_NUMBER = "6282177984041";
const PHONE = "0821-7798-4041";
const SITE_URL = "https://techpora.id";
const MAPS_URL = "https://maps.app.goo.gl/1bv9kcf5ynWE9VWn9";
const MAPS_REVIEWS_URL = "https://maps.app.goo.gl/eGnQSXjp4SkUSdSE9";
const MAPS_EMBED =
  "https://www.google.com/maps?q=SEWA+LAPTOP+JAKARTA+Jl.+R.Mangun+Muka+Raya+Rawamangun+Jakarta+Timur&output=embed";
const ADDRESS =
  "Jl. R. Mangun Muka Raya, Rawamangun, Kec. Pulo Gadung, Jakarta Timur 13220";

type Category = "Laptop" | "Printer" | "Proyektor";

type Product = {
  name: string;
  category: Category;
  specs?: string;
  daily: string;
  weekly: string;
  monthly: string;
  featured?: boolean;
};

const products: Product[] = [
  { name: "Lenovo ThinkPad", category: "Laptop", specs: "i3 · 8GB · SSD 256GB", daily: "Rp100.000", weekly: "Rp650.000", monthly: "Rp1.500.000" },
  { name: "ASUS VivoBook", category: "Laptop", specs: "i3 · 8GB · SSD 256GB", daily: "Rp135.000", weekly: "Rp850.000", monthly: "Rp2.000.000" },
  { name: "RedmiBook 15", category: "Laptop", specs: "i3 · 8GB · SSD 256GB", daily: "Rp135.000", weekly: "Rp850.000", monthly: "Rp2.000.000" },
  { name: "Acer Aspire 5", category: "Laptop", specs: "i5 · 8GB · SSD 256GB", daily: "Rp175.000", weekly: "Rp1.100.000", monthly: "Rp3.000.000" },
  { name: "MacBook Air M1", category: "Laptop", specs: "M1 · 8GB · SSD 256GB", daily: "Rp250.000", weekly: "Rp1.500.000", monthly: "Rp4.500.000", featured: true },
  { name: "Epson L3210", category: "Printer", specs: "Print · Scan · Copy", daily: "Rp100.000", weekly: "Rp500.000", monthly: "Rp1.500.000" },
  { name: "HP Smart Tank 215", category: "Printer", specs: "Print · Scan · Copy", daily: "Rp125.000", weekly: "Rp650.000", monthly: "Rp2.000.000" },
  { name: "ViewSonic SP3", category: "Proyektor", specs: "Portable · HD", daily: "Rp150.000", weekly: "Rp850.000", monthly: "Rp2.500.000" },
  { name: "Epson EB-E600", category: "Proyektor", specs: "3LCD · 3500 Lumens", daily: "Rp200.000", weekly: "Rp1.200.000", monthly: "Rp3.500.000" },
  { name: "Epson EB-X600", category: "Proyektor", specs: "3LCD · XGA · 3700 Lumens", daily: "Rp225.000", weekly: "Rp1.350.000", monthly: "Rp4.000.000", featured: true },
];

const reviews = [
  { name: "Rangga A.", role: "Mahasiswa UI", rating: 5, text: "Proses sewa cepat banget, laptop bersih dan siap pakai untuk sidang skripsi. Admin ramah!" },
  { name: "Sinta P.", role: "Event Organizer", rating: 5, text: "Sewa 20 laptop untuk event registrasi, semua unit lancar tanpa kendala. Recommended!" },
  { name: "Budi H.", role: "Freelancer", rating: 5, text: "Harga bersaing, MacBook-nya kondisi prima. Sudah langganan sewa di sini." },
  { name: "Dewi K.", role: "Karyawan Swasta", rating: 5, text: "Proyektor untuk meeting kantor jernih banget. Pengiriman tepat waktu ke Jakarta Pusat." },
  { name: "Aditya R.", role: "Trainer", rating: 5, text: "Printer Epson L3210-nya joss, hasil cetak training peserta lancar 2 hari penuh." },
  { name: "Maria L.", role: "Content Creator", rating: 5, text: "Suka karena unit datang sesuai jadwal dan admin fast response. Pasti sewa lagi." },
];

const faqData = [
  { q: "Minimal sewa berapa hari?", a: "Bisa harian, mingguan, hingga bulanan. Cocok untuk kebutuhan singkat 1 hari hingga proyek jangka panjang." },
  { q: "Apakah bisa dikirim?", a: "Ya, tersedia layanan pengiriman ke seluruh area Jakarta (Selatan, Timur, Barat, Utara, Pusat) serta Tangerang, Bekasi, dan Depok." },
  { q: "Apakah unit sudah siap pakai?", a: "Ya, semua laptop, printer, dan proyektor dicek, dibersihkan, dan siap digunakan tanpa instalasi tambahan." },
  { q: "Bisa untuk Zoom, meeting, dan event?", a: "Ya, cocok untuk Zoom, Google Meet, presentasi, registrasi event, dan kebutuhan kantor." },
  { q: "Apakah tersedia sewa proyektor dan printer?", a: "Ya, kami menyediakan proyektor ViewSonic & Epson serta printer Epson L3210 dan HP Smart Tank 215." },
  { q: "Bingung pilih unit?", a: "Admin siap membantu merekomendasikan unit sesuai kebutuhan dan budget." },
  { q: "Sewa laptop untuk skripsi, apa rekomendasinya?", a: "Untuk skripsi dan sidang, kami rekomendasikan ASUS VivoBook atau Acer Aspire 5 (i5, 8GB, SSD) yang lancar untuk Word, SPSS, Zoom sidang, dan render dokumen. Bisa sewa bulanan agar lebih hemat." },
  { q: "Sewa laptop untuk event atau pameran, bisa berapa unit?", a: "Kami melayani sewa laptop event dalam jumlah banyak (10–50+ unit) untuk registrasi, booth, training, dan pameran. Semua unit seragam, siap pakai, dan bisa diantar sekaligus dijemput di lokasi acara." },
  { q: "Lebih hemat sewa harian atau bulanan?", a: "Sewa bulanan jauh lebih hemat jika kebutuhan lebih dari 10 hari. Contoh: ThinkPad harian Rp100rb × 15 hari = Rp1,5jt, sedangkan bulanan hanya Rp1,5jt untuk 30 hari. Untuk kebutuhan singkat 1–3 hari, pilih harian." },
  { q: "Apa saja syarat sewa yang harus disiapkan?", a: "Wajib: KTP dan screenshot profil Instagram aktif. Pilih 2 dari dokumen pendukung: SIM, NPWP, KK, KTM, ID Card Kerja, atau Paspor. Dokumen jaminan dikembalikan setelah unit kembali dalam kondisi baik." },
  { q: "Bagaimana ketentuan pembayaran, keterlambatan & tanggung jawab penyewa?", a: "Ketentuan penyewaan lengkap: (1) Booking unit terlebih dahulu. (2) Pembayaran lunas di awal masa sewa. (3) Penyewa bersedia didokumentasikan saat serah terima unit. (4) Penyewa bertanggung jawab atas kerusakan akibat human error selama masa sewa. (5) Kehilangan unit menjadi tanggung jawab penyewa. (6) Masa sewa dihitung 24 jam sejak unit diterima. (7) Keterlambatan pengembalian dikenakan biaya Rp10.000 per jam. (8) Unit tidak boleh dipindahtangankan kepada pihak lain. (9) Jika terdapat kendala penggunaan, wajib mengirimkan video bukti agar tim dapat melakukan pengecekan. (10) Dokumen jaminan dikembalikan setelah unit diterima kembali dalam kondisi baik." },
];

const areaLayanan = [
  { area: "Jakarta Selatan", slug: "sewa-laptop-jakarta-selatan", desc: "Kemang, Senayan, Pondok Indah, Cilandak, TB Simatupang — pengiriman cepat untuk kantor & event." },
  { area: "Jakarta Timur", slug: "sewa-laptop-jakarta-timur", desc: "Rawamangun, Cawang, Cakung, Pulogadung — area basis operasional, ambil sendiri paling praktis." },
  { area: "Jakarta Barat", slug: "sewa-laptop-jakarta-barat", desc: "Grogol, Kebon Jeruk, Puri Indah, Kalideres — sewa laptop harian & bulanan untuk mahasiswa & startup." },
  { area: "Jakarta Utara", slug: "sewa-laptop-jakarta-utara", desc: "Kelapa Gading, Sunter, Ancol, PIK — cocok untuk event MICE dan pameran di kawasan bisnis Utara." },
  { area: "Jakarta Pusat", slug: "sewa-laptop-jakarta-pusat", desc: "Sudirman, Thamrin, Menteng, Kemayoran — pengiriman ke perkantoran & venue seminar." },
  { area: "Tangerang", slug: "sewa-laptop-tangerang", desc: "BSD, Alam Sutera, Karawaci, Gading Serpong — sewa laptop event dan kantor tersedia." },
  { area: "Bekasi", slug: "sewa-laptop-bekasi", desc: "Bekasi Kota, Summarecon, Harapan Indah — antar unit untuk training & kebutuhan bulanan." },
  { area: "Depok", slug: "sewa-laptop-depok", desc: "Margonda, UI, Cinere — favorit mahasiswa untuk sewa laptop skripsi dan tugas kuliah." },
];


const comparison = [
  { title: "Garansi Unit", us: "Semua unit dicek & bergaransi selama masa sewa", them: "Sering apa adanya, tanpa jaminan performa" },
  { title: "Gratis Ongkir", us: "Gratis ongkir area Jakarta (min. sewa mingguan)", them: "Ongkir ditanggung penyewa" },
  { title: "Respon WhatsApp", us: "Fast response, admin siap bantu tiap hari", them: "Balas lambat, sulit dihubungi weekend" },
  { title: "Unit Ready Pakai", us: "Sudah terinstal, dibersihkan, siap pakai", them: "Belum siap, perlu setup ulang" },
  { title: "Pilihan Unit", us: "Laptop, Printer & Proyektor lengkap", them: "Terbatas hanya laptop" },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Techpora.id — Sewa Laptop, Printer & Proyektor Jakarta" },
      {
        name: "description",
        content:
          "Sewa laptop, printer, dan proyektor harian, mingguan, dan bulanan di Jakarta. Unit terjamin, siap pakai, pengiriman cepat untuk mahasiswa, freelancer, kantor, dan event.",
      },
      { name: "keywords", content: "sewa laptop jakarta, rental laptop jakarta, sewa laptop harian, sewa laptop bulanan, sewa macbook jakarta, sewa printer jakarta, sewa proyektor jakarta, rental laptop event" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1" },
      { property: "og:title", content: "Techpora.id — Sewa Laptop, Printer & Proyektor Jakarta" },
      { property: "og:description", content: "Laptop, printer, proyektor siap pakai. Harian, mingguan, bulanan. Area Jakarta." },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "Techpora.id — Sewa Laptop, Printer & Proyektor Jakarta" },
      { name: "twitter:description", content: "Laptop, printer, proyektor siap pakai. Harian, mingguan, bulanan. Area Jakarta." },
    ],

    links: [
      { rel: "canonical", href: `${SITE_URL}/` },
      { rel: "preload", as: "image", href: heroLaptop, fetchpriority: "high" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": ["LocalBusiness", "Store"],
          name: "Techpora.id — Sewa Laptop Jakarta",
          description:
            "Layanan sewa laptop, printer, dan proyektor harian, mingguan, dan bulanan di Jakarta.",
          url: SITE_URL,
          telephone: "+62821-7798-4041",
          image: `${SITE_URL}/og-image.jpg`,
          address: {
            "@type": "PostalAddress",
            streetAddress: "Jl. R. Mangun Muka Raya",
            addressLocality: "Rawamangun, Pulo Gadung",
            addressRegion: "Jakarta Timur",
            postalCode: "13220",
            addressCountry: "ID",
          },
          areaServed: [
            "Jakarta Selatan","Jakarta Timur","Jakarta Barat","Jakarta Utara","Jakarta Pusat",
            "Tangerang","Bekasi","Depok",
          ],
          openingHoursSpecification: [{
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
            opens: "08:00",
            closes: "21:00",
          }],
          priceRange: "Rp100.000 - Rp4.500.000",
          aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "128" },
          sameAs: ["https://www.instagram.com/sewalaptopjakarta.co"],
          hasMap: MAPS_URL,
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
  { href: "#laptop", label: "Laptop" },
  { href: "#printer", label: "Printer" },
  { href: "#proyektor", label: "Proyektor" },
  { href: "#kenapa-kami", label: "Kenapa Kami" },
  { href: "#area", label: "Area" },
  { href: "#review", label: "Review" },
  { href: "/blog", label: "Blog" },
  { href: "#lokasi", label: "Lokasi" },
];

const whyItems = [
  { icon: ShieldCheck, title: "Unit Terjamin", desc: "Semua unit dicek sebelum dikirim." },
  { icon: Zap, title: "Siap Pakai", desc: "Tanpa instalasi tambahan." },
  { icon: Clock, title: "Fast Response", desc: "Admin siap membantu kapan saja." },
  { icon: Truck, title: "Pengiriman Cepat", desc: "Area Jakarta dan sekitarnya." },
];

const steps = [
  { n: "01", title: "Pilih Unit", desc: "Tentukan unit sesuai kebutuhan & budget." },
  { n: "02", title: "Hubungi Admin", desc: "Isi form cek ketersediaan via WhatsApp." },
  { n: "03", title: "Verifikasi Data", desc: "Kirim dokumen sesuai syarat sewa." },
  { n: "04", title: "Pembayaran", desc: "Lunas di awal masa sewa." },
  { n: "05", title: "Unit Dikirim", desc: "Unit sampai, siap pakai." },
];


type BookingForm = {
  unit: string;
  qty: string;
  start: string;
  end: string;
  purpose: string;
  pickup: "Ambil sendiri" | "Diantar";
  address: string;
};

const emptyBooking: BookingForm = {
  unit: "",
  qty: "1",
  start: "",
  end: "",
  purpose: "",
  pickup: "Ambil sendiri",
  address: "",
};

function buildWaText(b: BookingForm) {
  const lines = [
    "Halo Techpora, saya ingin cek ketersediaan unit:",
    "",
    `• Unit yang ingin disewa: ${b.unit || "-"}`,
    `• Jumlah unit: ${b.qty || "-"}`,
    `• Tanggal & jam mulai: ${b.start || "-"}`,
    `• Tanggal & jam selesai: ${b.end || "-"}`,
    `• Kebutuhan penggunaan: ${b.purpose || "-"}`,
    `• Pengambilan: ${b.pickup}`,
  ];
  if (b.pickup === "Diantar") lines.push(`• Alamat: ${b.address || "-"}`);
  lines.push("", "Saya lihat dari techpora.id.", "Terima kasih 🙏");
  return lines.join("\n");
}


function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [booking, setBooking] = useState<BookingForm>(emptyBooking);

  const openBooking = (preselectUnit?: string) => {
    setBooking({ ...emptyBooking, unit: preselectUnit ?? "" });
    setBookingOpen(true);
  };

  const submitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(buildWaText(booking))}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setBookingOpen(false);
  };

  const cats: { id: string; label: Category; icon: typeof LaptopIcon }[] = [
    { id: "laptop", label: "Laptop", icon: LaptopIcon },
    { id: "printer", label: "Printer", icon: PrinterIcon },
    { id: "proyektor", label: "Proyektor", icon: ProjectorIcon },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#beranda" className="flex items-center gap-2">
            <img src={logoAsset.url} alt="Techpora.id" className="h-9 w-auto" />
          </a>
          <nav className="hidden items-center gap-7 lg:flex">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="hidden lg:block">
            <Button onClick={() => openBooking()} className="gap-2 rounded-full bg-primary hover:bg-primary/90">
              <MessageCircle className="h-4 w-4" />
              Chat WhatsApp
            </Button>
          </div>
          <button className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle menu">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-border bg-background lg:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
              {navLinks.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary">
                  {l.label}
                </a>
              ))}
              <Button onClick={() => { setMenuOpen(false); openBooking(); }} className="mt-2 w-full gap-2 rounded-full bg-primary hover:bg-primary/90">
                <MessageCircle className="h-4 w-4" />
                Chat WhatsApp
              </Button>
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
                Sewa Laptop, Printer & Proyektor Jakarta
              </div>
              <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Sewa Laptop Jakarta <span className="text-primary">— Techpora</span>
              </h1>
              <p className="mt-3 text-lg font-medium text-foreground/80">
                Laptop, Printer & Proyektor siap pakai. Harian, mingguan, bulanan.
              </p>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Unit siap pakai untuk mahasiswa, freelancer, kantor, event, seminar, dan kebutuhan harian. Harian, mingguan, bulanan — pengiriman cepat area Jakarta.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button onClick={() => openBooking()} size="lg" className="w-full gap-2 rounded-full bg-primary px-7 hover:bg-primary/90 sm:w-auto">
                  <MessageCircle className="h-5 w-5" />
                  Cek Ketersediaan
                </Button>
                <a href="#laptop">
                  <Button size="lg" variant="outline" className="w-full gap-2 rounded-full border-border px-7 sm:w-auto">
                    Lihat Unit
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
                  <a href={`tel:${PHONE.replace(/-/g, "")}`} className="font-semibold text-foreground">{PHONE}</a>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-primary/15 via-primary/5 to-transparent" />
              <div className="relative rounded-3xl border border-border bg-card p-6 shadow-[0_30px_80px_-20px_rgba(37,99,235,0.25)] sm:p-10">
                <img src={heroLaptop} alt="Sewa laptop premium siap pakai Techpora Jakarta" width={1024} height={1024} fetchPriority="high" decoding="async" className="mx-auto h-auto w-full max-w-md" />
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
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Sewa tanpa ribet, dijamin nyaman</h2>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {whyItems.map((item) => (
                <div key={item.title} className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
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

        {/* PRODUCT SECTIONS by category */}
        {cats.map((cat) => {
          const items = products.filter((p) => p.category === cat.label);
          return (
            <section key={cat.id} id={cat.id} className="py-16 sm:py-24 even:bg-secondary/30 even:border-y even:border-border">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
                  <div className="max-w-xl">
                    <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                      <cat.icon className="h-4 w-4" />
                      Sewa {cat.label}
                    </div>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                      {cat.label === "Laptop" && "Pilih laptop sesuai kebutuhanmu"}
                      {cat.label === "Printer" && "Printer siap cetak untuk kantor & event"}
                      {cat.label === "Proyektor" && "Proyektor terang untuk meeting & seminar"}
                    </h2>
                  </div>
                  <p className="text-sm text-muted-foreground">Semua unit dicek & siap pakai sebelum dikirim.</p>
                </div>
                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((u) => (
                    <article
                      key={u.name}
                      className={`relative flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl ${
                        u.featured ? "border-primary/40 ring-1 ring-primary/20" : "border-border"
                      }`}
                    >
                      <div className="flex items-center gap-4 bg-secondary/60 p-6">
                        <div className="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <cat.icon className="h-6 w-6" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-lg font-bold leading-snug text-foreground">{u.name}</h3>
                          {u.specs && <p className="mt-0.5 text-xs text-muted-foreground">{u.specs}</p>}
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <div className="flex items-start justify-between">
                          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Available
                          </div>
                          {u.featured && (
                            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">Premium</span>
                          )}
                        </div>
                        <h3 className="mt-4 text-xl font-bold text-foreground">{u.name}</h3>
                        {u.specs && <p className="mt-1 text-xs text-muted-foreground">{u.specs}</p>}
                        <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
                          <Row label="Harian" value={u.daily} />
                          <Row label="Mingguan" value={u.weekly} />
                          <Row label="Bulanan" value={u.monthly} highlight />
                        </div>
                        <Button
                          onClick={() => openBooking(u.name)}
                          className="mt-6 w-full gap-2 rounded-full bg-primary hover:bg-primary/90"
                        >
                          <MessageCircle className="h-4 w-4" />
                          Cek Ketersediaan
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          );
        })}

        {/* REVIEWS */}
        <section id="review" className="border-y border-border bg-secondary/40 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">Review Pelanggan</div>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Dipercaya ratusan pelanggan</h2>
              <div className="mt-3 flex items-center justify-center gap-2 text-sm">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="font-semibold text-foreground">4.9</span>
                <span className="text-muted-foreground">dari 128+ ulasan</span>
              </div>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {reviews.map((r) => (
                <figure key={r.name} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <blockquote className="mt-4 text-sm leading-relaxed text-foreground">"{r.text}"</blockquote>
                  <figcaption className="mt-4 text-sm">
                    <div className="font-semibold text-foreground">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.role}</div>
                  </figcaption>
                </figure>
              ))}
            </div>
            <div className="mt-10 text-center">
              <a
                href={MAPS_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-secondary"
              >
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                Lihat semua review di Google Maps
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {/* HOW TO RENT */}
        <section id="cara" className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">Cara Sewa</div>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">5 langkah, unit sampai</h2>
            </div>
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {steps.map((s, i) => (
                <div key={s.n} className="relative">
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <div className="text-3xl font-bold text-primary/30">{s.n}</div>
                    <h3 className="mt-3 text-base font-semibold text-foreground">{s.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                  </div>
                  {i < steps.length - 1 && <div className="absolute left-full top-1/2 hidden h-px w-5 -translate-y-1/2 bg-border lg:block" />}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* KENAPA PILIH TECHPORA (COMPARISON) */}
        <section id="kenapa-kami" className="border-y border-border bg-secondary/40 py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">Kenapa Pilih Techpora</div>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Bandingkan sebelum kamu sewa</h2>
              <p className="mt-4 text-muted-foreground">Beda Techpora dibanding rental laptop lain — value nyata untuk kamu.</p>
            </div>
            <div className="mt-12 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div className="grid grid-cols-3 gap-0 border-b border-border bg-secondary/60 text-sm font-semibold">
                <div className="px-4 py-4 sm:px-6">Aspek</div>
                <div className="px-4 py-4 sm:px-6 text-primary">Techpora</div>
                <div className="px-4 py-4 sm:px-6 text-muted-foreground">Rental Lain</div>
              </div>
              {comparison.map((c, i) => (
                <div key={c.title} className={`grid grid-cols-3 gap-0 text-sm ${i !== comparison.length - 1 ? "border-b border-border" : ""}`}>
                  <div className="px-4 py-4 font-semibold text-foreground sm:px-6">{c.title}</div>
                  <div className="flex items-start gap-2 px-4 py-4 text-foreground sm:px-6">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    <span>{c.us}</span>
                  </div>
                  <div className="px-4 py-4 text-muted-foreground sm:px-6">{c.them}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AREA LAYANAN */}
        <section id="area" className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">Area Layanan</div>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Sewa Laptop Jabodetabek</h2>
              <p className="mt-4 text-muted-foreground">
                Kami melayani sewa laptop, printer, dan proyektor ke seluruh area Jakarta dan sekitarnya.
              </p>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {areaLayanan.map((a) => (
                <a
                  key={a.area}
                  href={`/${a.slug}`}
                  className="group block rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
                >

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <h3 className="text-base font-semibold text-foreground group-hover:text-primary">Sewa Laptop {a.area}</h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.desc}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                    Lihat detail area →
                  </span>
                </a>
              ))}
            </div>

          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="border-y border-border bg-secondary/40 py-16 sm:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">FAQ</div>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Pertanyaan yang sering ditanyakan</h2>
            </div>
            <div className="mt-10 space-y-3">
              {faqData.map((f, i) => {
                const open = openFaq === i;
                return (
                  <div key={i} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                    <button onClick={() => setOpenFaq(open ? null : i)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
                      <span className="text-sm font-semibold text-foreground sm:text-base">{f.q}</span>
                      <ChevronDown className={`h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
                    </button>
                    {open && <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{f.a}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* LOKASI / MAPS */}
        <section id="lokasi" className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-primary">Lokasi Kami</div>
                <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Sewa Laptop Jakarta — Rawamangun</h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Ambil sendiri di lokasi atau request pengiriman ke area Jakarta dan sekitarnya.
                </p>
                <div className="mt-6 flex items-start gap-3 rounded-2xl border border-border bg-card p-5">
                  <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <div className="text-sm">
                    <div className="font-semibold text-foreground">Techpora.id — Sewa Laptop Jakarta</div>
                    <div className="mt-1 text-muted-foreground">{ADDRESS}</div>
                  </div>
                </div>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <a href={MAPS_URL} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full gap-2 rounded-full sm:w-auto">
                      <MapPin className="h-4 w-4" />
                      Buka di Google Maps
                    </Button>
                  </a>
                  <Button onClick={() => openBooking()} className="w-full gap-2 rounded-full bg-primary hover:bg-primary/90 sm:w-auto">
                    <MessageCircle className="h-4 w-4" />
                    Cek Ketersediaan
                  </Button>
                </div>
              </div>
              <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                <iframe
                  title="Lokasi Techpora.id Sewa Laptop Jakarta"
                  src={MAPS_EMBED}
                  width="100%"
                  height="380"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-[380px] w-full border-0"
                />
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section id="kontak" className="px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-glow p-10 text-center shadow-[0_30px_80px_-20px_rgba(37,99,235,0.45)] sm:p-16">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">Masih bingung pilih unit?</h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-primary-foreground/85">
                Isi form cek ketersediaan & dapatkan rekomendasi unit sesuai kebutuhanmu.
              </p>
              <Button onClick={() => openBooking()} size="lg" className="mt-8 gap-2 rounded-full bg-background px-8 text-foreground hover:bg-background/90">
                <MessageCircle className="h-5 w-5 text-primary" />
                Cek Ketersediaan Sekarang
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border bg-background">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div>
            <img src={logoAsset.url} alt="Techpora.id" className="h-10 w-auto" />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">Sewa Laptop, Printer & Proyektor • Mudah • Cepat • Terpercaya</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Kontak</h4>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2.5">
                <MessageCircle className="h-4 w-4 text-primary" />
                <button onClick={() => openBooking()} className="hover:text-foreground">WhatsApp: {PHONE}</button>
              </li>
              <li className="flex items-center gap-2.5">
                <Instagram className="h-4 w-4 text-primary" />
                <a href="https://instagram.com/sewalaptopjakarta.co" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">@sewalaptopjakarta.co</a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">{ADDRESS}</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Navigasi</h4>
            <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              {navLinks.map((l) => (
                <li key={l.href}><a href={l.href} className="hover:text-foreground">{l.label}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-muted-foreground sm:px-6 lg:px-8">Copyright © Techpora.id</div>
        </div>
      </footer>

      {/* Floating WA */}
      <button
        onClick={() => openBooking()}
        aria-label="Chat WhatsApp"
        className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-emerald-500/30 transition-transform hover:scale-105"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Booking Dialog */}
      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Cek Ketersediaan Unit</DialogTitle>
            <DialogDescription>
              Boleh dibantu info berikut ya Kak 😊 — kami akan balas via WhatsApp.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitBooking} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="b-unit">Unit yang ingin disewa</Label>
              <Input id="b-unit" required placeholder="Contoh: MacBook Air M1" value={booking.unit} onChange={(e) => setBooking({ ...booking, unit: e.target.value })} maxLength={120} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="b-qty">Jumlah unit</Label>
                <Input id="b-qty" required type="number" min={1} max={200} value={booking.qty} onChange={(e) => setBooking({ ...booking, qty: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="b-purpose">Kebutuhan</Label>
                <Input id="b-purpose" placeholder="Event / kantor / kuliah" value={booking.purpose} onChange={(e) => setBooking({ ...booking, purpose: e.target.value })} maxLength={160} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="b-start">Mulai (tgl & jam)</Label>
                <Input id="b-start" required type="datetime-local" value={booking.start} onChange={(e) => setBooking({ ...booking, start: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="b-end">Selesai (tgl & jam)</Label>
                <Input id="b-end" required type="datetime-local" value={booking.end} onChange={(e) => setBooking({ ...booking, end: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Pengambilan</Label>
              <RadioGroup
                value={booking.pickup}
                onValueChange={(v) => setBooking({ ...booking, pickup: v as BookingForm["pickup"] })}
                className="grid grid-cols-2 gap-2"
              >
                <Label htmlFor="p-self" className="flex cursor-pointer items-center gap-2 rounded-lg border border-border p-3 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <RadioGroupItem id="p-self" value="Ambil sendiri" />
                  <span className="text-sm font-medium">Ambil sendiri</span>
                </Label>
                <Label htmlFor="p-deliver" className="flex cursor-pointer items-center gap-2 rounded-lg border border-border p-3 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <RadioGroupItem id="p-deliver" value="Diantar" />
                  <span className="text-sm font-medium">Diantar</span>
                </Label>
              </RadioGroup>
            </div>
            {booking.pickup === "Diantar" && (
              <div className="space-y-1.5">
                <Label htmlFor="b-address">Alamat pengiriman</Label>
                <Textarea id="b-address" required placeholder="Alamat lengkap + patokan" value={booking.address} onChange={(e) => setBooking({ ...booking, address: e.target.value })} maxLength={400} rows={3} />
              </div>
            )}
            <DialogFooter className="gap-2 sm:gap-2">
              <Button type="button" variant="outline" onClick={() => setBookingOpen(false)} className="rounded-full">Batal</Button>
              <Button type="submit" className="gap-2 rounded-full bg-primary hover:bg-primary/90">
                <MessageCircle className="h-4 w-4" />
                Kirim ke WhatsApp
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
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
