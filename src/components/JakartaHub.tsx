import { Link } from "@tanstack/react-router";
import {
  MessageCircle,
  MapPin,
  Check,
  Clock,
  Truck,
  ShieldCheck,
  Zap,
  Star,
  ArrowRight,
} from "lucide-react";
import logoAsset from "@/assets/techpora-logo.png.asset.json";
import { getUnitImage, hasWhiteBackdrop } from "@/assets/units";
import { Button } from "@/components/ui/button";
import { areas } from "@/data/areas";
import { buildWaSimple, waLink } from "@/lib/wa";

export type JakartaHubVariant = "sewa" | "rental";

const jakartaAreas = areas.filter((a) => a.area.toLowerCase().startsWith("jakarta"));

// Semua unit (dari areas data, dedup by name)
const allUnits = (() => {
  const seen = new Map<string, ReturnType<typeof getUnit>>();
  for (const a of areas) {
    for (const u of a.units) {
      if (!seen.has(u.name)) seen.set(u.name, u);
    }
  }
  return Array.from(seen.values());
  function getUnit(u: (typeof areas)[number]["units"][number]) {
    return u;
  }
})();

const laptops = allUnits.filter((u) => u.category === "Laptop");
const printers = allUnits.filter((u) => u.category === "Printer");
const projectors = allUnits.filter((u) => u.category === "Proyektor");

type Copy = {
  term: string; // "sewa" | "rental"
  Term: string; // "Sewa" | "Rental"
  title: string;
  h1: string;
  intro: string;
  metaDescription: string;
  ogTitle: string;
  ogDesc: string;
  keywords: string;
  whyLead: string;
  whyPoints: { title: string; desc: string }[];
  contextParagraphs: string[];
  faqs: { q: string; a: string }[];
};

const COPY: Record<JakartaHubVariant, Copy> = {
  sewa: {
    term: "sewa",
    Term: "Sewa",
    title: "Sewa Laptop Jakarta — Harian, Mingguan, Bulanan | Techpora",
    h1: "Sewa Laptop Jakarta — Techpora",
    intro:
      "Techpora adalah layanan sewa laptop Jakarta yang berbasis di Rawamangun, Jakarta Timur. Kami melayani sewa laptop harian, mingguan, dan bulanan untuk seluruh area Jakarta — dari MacBook Air M1 untuk presentasi klien di SCBD, ThinkPad & VivoBook untuk mahasiswa UI/UNJ/Binus, hingga unit bulk 20–50 laptop untuk event registrasi di JIExpo. Semua unit dicek, dibersihkan, dan siap pakai sebelum dikirim ke lokasi kamu.",
    metaDescription:
      "Sewa laptop Jakarta harian, mingguan, bulanan. MacBook, ThinkPad, VivoBook, Acer i5 siap kirim ke Jakarta Selatan, Timur, Barat, Utara, Pusat. Fast response WA.",
    ogTitle: "Sewa Laptop Jakarta — Harian, Mingguan, Bulanan | Techpora",
    ogDesc:
      "Sewa laptop Jakarta dengan pilihan lengkap MacBook, ThinkPad, VivoBook, Acer i5. Kirim ke seluruh Jakarta, unit dicek sebelum kirim.",
    keywords:
      "sewa laptop jakarta, sewa laptop harian jakarta, sewa laptop bulanan jakarta, sewa laptop murah jakarta, sewa macbook jakarta, tempat sewa laptop jakarta",
    whyLead: "Kenapa penyewa Jakarta pilih Techpora?",
    whyPoints: [
      {
        title: "Kirim ke seluruh Jakarta",
        desc: "Pengiriman kilat ke Jakarta Selatan (SCBD, Sudirman, Kemang), Timur (Rawamangun, Cawang), Barat (Grogol, Kebon Jeruk), Utara (Kelapa Gading, PIK), dan Pusat (Thamrin, Menteng).",
      },
      {
        title: "Harian, mingguan, bulanan",
        desc: "Sewa laptop bebas mau 1 hari untuk ujian praktikum, 1 minggu untuk event, atau bulanan untuk skripsi & WFH — paket bulanan paling favorit di Jakarta.",
      },
      {
        title: "Unit dicek dulu",
        desc: "Setiap laptop dibersihkan, di-install ulang Office, dan diuji sebelum kirim. Tidak ada 'unit rusak sampai di tangan penyewa'.",
      },
      {
        title: "Ganti unit di hari sama",
        desc: "Kalau unit bermasalah selama masa sewa, tim kami ganti unit di hari yang sama untuk area Jakarta — penting saat kamu lagi kejar deadline.",
      },
      {
        title: "Invoice untuk kantor",
        desc: "Butuh reimburse ke perusahaan? Kami siapkan invoice resmi corporate — cocok untuk kantor Sudirman, Thamrin, dan kawasan industri Pulogadung.",
      },
      {
        title: "Bulk 20–50 unit siap",
        desc: "Untuk event & training kantor Jakarta, kami stok unit seragam yang bisa dikirim dalam sehari. Sudah biasa handle event JIExpo, Kemayoran, hingga ICE PIK.",
      },
    ],
    contextParagraphs: [
      "Kebutuhan sewa laptop di Jakarta punya karakter khas. Startup di SCBD dan agency di Kebon Jeruk biasanya ambil paket bulanan untuk staff proyek jangka pendek. Mahasiswa UI, Binus, dan UMN paling sering sewa 1–3 bulan menjelang sidang skripsi. Event organizer di Kemayoran dan Ancol butuh puluhan unit seragam untuk registrasi peserta. Techpora sudah melayani ketiganya sejak lama — jadi kami paham unit apa yang cocok untuk skenario kamu.",
      "Untuk kebutuhan pribadi, MacBook Air M1 dan Acer Aspire 5 (i5) adalah dua unit paling laris di Jakarta. MacBook cocok untuk kamu yang sering meeting klien atau kerja mobile — daya tahan baterai 10+ jam. Acer i5 lebih hemat untuk kerja kantor sehari-hari: Word, Excel, Zoom, plus multi-tab Chrome tanpa lag. Kalau budget lebih ketat, ThinkPad dan VivoBook i3 juga sangat cukup untuk skripsi & tugas kuliah.",
      "Untuk kebutuhan kantor & event, kami sediakan bundling laptop + printer (Epson L3210 atau HP Smart Tank) + proyektor (Epson EB-E600 atau EB-X600). Satu invoice, satu koordinator pengiriman. Banyak kantor pusat di Thamrin dan Sudirman yang sudah pakai bundling ini untuk training staff dan audit tahunan — hemat waktu dibanding sewa terpisah dari 3 vendor berbeda.",
    ],
    faqs: [
      {
        q: "Berapa harga sewa laptop di Jakarta?",
        a: "Mulai dari Rp49.000/hari untuk HP 14s (paling hemat), Rp100.000/hari untuk Lenovo ThinkPad i3, hingga Rp250.000/hari untuk MacBook Air M1. Semua harga sudah termasuk pengecekan unit sebelum kirim.",
      },
      {
        q: "Apa saja area Jakarta yang dilayani?",
        a: "Seluruh area Jakarta: Jakarta Selatan (Kemang, SCBD, Pondok Indah, Sudirman), Jakarta Timur (Rawamangun, Cawang, Pulogadung), Jakarta Barat (Grogol, Puri Indah, Kalideres), Jakarta Utara (Kelapa Gading, PIK, Ancol), dan Jakarta Pusat (Thamrin, Menteng, Kemayoran). Basis operasional kami di Rawamangun, jadi Jakarta Timur bisa ambil langsung tanpa ongkir.",
      },
      {
        q: "Apakah bisa sewa laptop 1 hari saja di Jakarta?",
        a: "Bisa. Sewa harian populer untuk ujian praktikum kampus, presentasi klien 1 hari, atau event booth. Chat admin dengan detail kebutuhan — unit bisa siap dikirim dalam 1–3 jam untuk area Jakarta.",
      },
      {
        q: "Berapa lama pengiriman sampai ke lokasi Jakarta?",
        a: "Estimasi 1–3 jam tergantung jarak dari basis kami di Rawamangun. Jakarta Timur & Pusat biasanya < 2 jam, Jakarta Selatan & Utara 2–3 jam, Jakarta Barat 2–4 jam. Untuk event, pengiriman bisa dijadwalkan H-1 supaya set-up di venue tenang.",
      },
      {
        q: "Apakah bisa untuk sewa bulk (banyak unit) untuk event?",
        a: "Ya, kami sudah biasa handle sewa 20–50+ unit untuk event registrasi di JIExpo Kemayoran, ICE BSD, dan Ancol. Unit spek seragam, dikirim antar & jemput oleh tim kami di lokasi acara.",
      },
      {
        q: "Bisa invoice untuk klaim kantor?",
        a: "Bisa. Kami siapkan invoice resmi corporate lengkap dengan detail unit, periode sewa, dan pajak — cocok untuk reimburse ke perusahaan. Banyak dipakai kantor pusat di Sudirman-Thamrin.",
      },
      {
        q: "Bagaimana kalau unit bermasalah di tengah masa sewa?",
        a: "Kami ganti unit di hari yang sama untuk area Jakarta. Cukup chat admin, tim kami langsung antar unit pengganti dan tarik unit lama. Ini yang bikin kami dipercaya penyewa jangka panjang.",
      },
      {
        q: "Apakah tersedia bundling laptop + printer + proyektor?",
        a: "Tersedia. Bundling paling laris: 1 laptop + 1 proyektor untuk presentasi, atau 5 laptop + 1 printer untuk training kantor. Satu invoice, satu koordinator pengiriman — hemat waktu dibanding sewa dari vendor terpisah.",
      },
    ],
  },
  rental: {
    term: "rental",
    Term: "Rental",
    title: "Rental Laptop Jakarta — Harian, Mingguan, Bulanan | Techpora",
    h1: "Rental Laptop Jakarta — Techpora",
    intro:
      "Cari rental laptop di Jakarta dengan pilihan unit lengkap dan pengiriman cepat? Techpora adalah rental laptop Jakarta berbasis di Rawamangun (Jakarta Timur) yang melayani corporate, event organizer, mahasiswa, dan profesional di seluruh DKI Jakarta. Rental harian untuk kebutuhan mendadak, rental mingguan untuk event & training, rental bulanan untuk staff proyek & mahasiswa akhir — semua dengan invoice resmi kalau kamu perlu reimburse ke kantor.",
    metaDescription:
      "Rental laptop Jakarta harian, mingguan, bulanan. MacBook, ThinkPad, Acer i5. Melayani corporate, event, mahasiswa. Invoice resmi, pengiriman ke seluruh Jakarta.",
    ogTitle: "Rental Laptop Jakarta — Harian, Mingguan, Bulanan | Techpora",
    ogDesc:
      "Rental laptop Jakarta terpercaya untuk corporate, event, dan mahasiswa. Unit dicek, invoice resmi, pengiriman kilat.",
    keywords:
      "rental laptop jakarta, rental laptop harian jakarta, rental laptop bulanan jakarta, rental macbook jakarta, rental laptop kantor jakarta, rental laptop event jakarta",
    whyLead: "Kenapa corporate & event organizer Jakarta pilih rental di Techpora?",
    whyPoints: [
      {
        title: "Rental corporate ready",
        desc: "Invoice resmi, PO friendly, bisa termin pembayaran untuk klien perusahaan. Sudah dipakai HRD kantor Sudirman-Thamrin dan agency Kebon Jeruk.",
      },
      {
        title: "Rental event 20–50+ unit",
        desc: "Unit spek seragam, antar-jemput di lokasi acara. Sudah biasa handle JIExpo Kemayoran, ICE BSD, dan pameran Ancol.",
      },
      {
        title: "Rental training kantor",
        desc: "Paket rental mingguan untuk training internal — laptop + printer + proyektor jadi satu paket. Set-up rapi di ruang training.",
      },
      {
        title: "Rental proyek jangka pendek",
        desc: "Sewa 3–6 bulan untuk staff proyek atau konsultan. Lebih hemat daripada beli laptop yang cuma dipakai sebentar.",
      },
      {
        title: "Ganti unit di hari yang sama",
        desc: "SLA rental corporate: unit bermasalah diganti hari itu juga untuk area Jakarta. Tidak ada downtime yang mengganggu operasional.",
      },
      {
        title: "Kirim ke 5 kota Jakarta",
        desc: "Jakarta Selatan, Timur, Barat, Utara, Pusat — semua dijangkau. Basis di Rawamangun, jadi Jakarta Timur bahkan bisa ambil langsung.",
      },
    ],
    contextParagraphs: [
      "Berbeda dari sewa harian personal, rental laptop Jakarta untuk corporate biasanya menuntut lebih: PO, invoice, termin pembayaran, dan SLA penggantian unit. Techpora menyiapkan itu semua sebagai standar — tidak perlu request khusus. Kami sudah rutin menyediakan rental untuk agency di Kebon Jeruk, kantor pusat di Sudirman-Thamrin, dan kawasan industri Pulogadung untuk training staff dan audit tahunan.",
      "Untuk event organizer, tantangan rental laptop di Jakarta biasanya ada di dua hal: unit yang spek-nya seragam (supaya booth registrasi rapi), dan tim yang bisa antar-jemput di lokasi. Techpora punya stok unit ThinkPad & VivoBook yang seragam, plus tim antar-jemput yang sudah familiar dengan venue-venue besar Jakarta seperti JIExpo Kemayoran, Balai Kartini, dan Ancol Beach City. Sekali koordinasi, semua handle.",
      "Untuk profesional dan mahasiswa yang butuh rental jangka panjang, paket bulanan Techpora dirancang lebih hemat dari kalkulasi harian × 30 hari. MacBook Air M1 bulanan populer di kalangan freelancer & konsultan Jaksel yang sering meeting klien. Acer Aspire 5 i5 bulanan paling laris untuk mahasiswa UI, Binus, UMN yang lagi menuju sidang. Semua unit sudah include Office & antivirus siap pakai.",
    ],
    faqs: [
      {
        q: "Berapa harga rental laptop di Jakarta?",
        a: "Rental harian mulai Rp49.000 (HP 14s, paling hemat), Rp100.000 (Lenovo ThinkPad i3), sampai Rp250.000 (MacBook Air M1). Semua harga include pengecekan unit dan pengiriman ke Jakarta.",
      },
      {
        q: "Apakah rental laptop Techpora menerima PO corporate?",
        a: "Ya. Kami terima PO dan siapkan invoice resmi untuk klien perusahaan. Termin pembayaran juga bisa didiskusikan untuk rental jangka menengah–panjang.",
      },
      {
        q: "Apakah bisa rental laptop bulk 20+ unit untuk event?",
        a: "Bisa. Kami sudah rutin menyediakan rental 20–50+ laptop untuk event registrasi di JIExpo Kemayoran, ICE BSD, dan pameran Ancol. Antar-jemput ke lokasi acara termasuk dalam paket.",
      },
      {
        q: "Berapa lama rental minimum di Techpora?",
        a: "Rental minimum 1 hari. Kalau butuh cuma buat ujian praktikum atau presentasi single-day, chat admin — unit bisa dikirim dalam 1–3 jam untuk area Jakarta.",
      },
      {
        q: "Apa saja area Jakarta yang dijangkau?",
        a: "Seluruh DKI Jakarta: Selatan, Timur, Barat, Utara, Pusat. Kami juga melayani Tangerang (BSD, Alam Sutera, Karawaci), Depok, dan Bekasi. Basis di Rawamangun (Jakarta Timur).",
      },
      {
        q: "Bagaimana kalau unit rental bermasalah?",
        a: "SLA kami: unit bermasalah diganti di hari yang sama untuk area Jakarta. Cukup chat admin, tim kami langsung antar unit pengganti dan tarik unit lama. Tidak ada downtime yang mengganggu operasional.",
      },
      {
        q: "Bisa rental laptop bundling dengan printer & proyektor?",
        a: "Bisa. Bundling paling laris untuk kantor: 5 laptop + 1 printer Epson L3210 untuk training staff, atau 1 laptop + 1 proyektor Epson EB-X600 untuk presentasi. Satu koordinator, satu invoice.",
      },
      {
        q: "Bagaimana cara mulai rental di Techpora?",
        a: "Chat admin via WhatsApp dengan detail kebutuhan (jenis unit, jumlah, durasi, alamat pengiriman). Admin akan konfirmasi ketersediaan, harga, dan estimasi kirim. Setelah pembayaran, unit langsung disiapkan dan dikirim.",
      },
    ],
  },
};

export function JakartaHub({ variant }: { variant: JakartaHubVariant }) {
  const c = COPY[variant];
  const other = variant === "sewa" ? COPY.rental : COPY.sewa;
  const otherPath = variant === "sewa" ? "/rental-laptop-jakarta" : "/sewa-laptop-jakarta";

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
          <a href={waLink(buildWaSimple(undefined, "Jakarta"))} target="_blank" rel="noopener noreferrer">
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
          <div className="pointer-events-none absolute -top-24 right-0 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl" />
          <div className="relative mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:py-20 lg:px-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
              <MapPin className="h-3 w-3 text-primary" />
              Melayani seluruh DKI Jakarta
            </div>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">{c.h1}</h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {c.intro}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={waLink(buildWaSimple(undefined, "Jakarta"))} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="w-full gap-2 rounded-full bg-primary px-7 hover:bg-primary/90 sm:w-auto">
                  <MessageCircle className="h-5 w-5" />
                  Cek Ketersediaan Sekarang
                </Button>
              </a>
              <a href="#unit-jakarta">
                <Button size="lg" variant="outline" className="w-full gap-2 rounded-full px-7 sm:w-auto">
                  Lihat harga unit
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-primary" />
                Kirim 1–3 jam
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Unit dicek sebelum kirim
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                4.9 dari 128+ ulasan
              </div>
            </div>
          </div>
        </section>

        {/* CONTEXT PARAGRAPHS (SEO content depth) */}
        <section className="border-b border-border py-14">
          <div className="mx-auto max-w-3xl space-y-6 px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold sm:text-3xl">
              {c.Term} laptop Jakarta untuk siapa saja?
            </h2>
            {c.contextParagraphs.map((p, i) => (
              <p key={i} className="text-base leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
          </div>
        </section>

        {/* WHY */}
        <section className="bg-secondary/40 border-b border-border py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold sm:text-3xl">{c.whyLead}</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {c.whyPoints.map((p) => (
                <div key={p.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold">{p.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* UNITS */}
        <section id="unit-jakarta" className="border-b border-border py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold sm:text-3xl">Daftar unit & harga {c.term} Jakarta</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Semua harga sudah termasuk pengecekan unit dan siap pakai. Konfirmasi ketersediaan via WhatsApp.
            </p>

            {[
              { label: "Laptop", items: laptops },
              { label: "Printer", items: printers },
              { label: "Proyektor", items: projectors },
            ].map((group) => (
              <div key={group.label} className="mt-10">
                <h3 className="text-lg font-bold">{c.Term} {group.label} Jakarta</h3>
                <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((u) => {
                    const img = getUnitImage(u.name);
                    return (
                      <article
                        key={u.name}
                        className={`flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm ${u.featured ? "border-primary/40 ring-1 ring-primary/20" : "border-border"}`}
                      >
                        {img && (
                          <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-secondary/70 via-secondary/30 to-background p-6">
                            <img src={img} alt={`${c.Term} ${u.name} Jakarta`} width={800} height={600} loading="lazy" className={`max-h-full w-auto object-contain ${hasWhiteBackdrop(u.name) ? "mix-blend-multiply" : "drop-shadow-lg"}`} />
                          </div>
                        )}
                        <div className="flex flex-1 flex-col p-6">
                          <div className="text-xs font-semibold uppercase tracking-wider text-primary">{u.category}</div>
                          <h4 className="mt-2 text-lg font-bold">{u.name}</h4>
                          {u.specs && <p className="mt-1 text-xs text-muted-foreground">{u.specs}</p>}
                          <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
                            <Row label="Harian" value={u.daily} />
                            <Row label="Mingguan" value={u.weekly} />
                            <Row label="Bulanan" value={u.monthly} highlight />
                          </div>
                          <a
                            href={waLink(buildWaSimple(u.name, "Jakarta"))}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-5"
                          >
                            <Button className="w-full gap-2 rounded-full bg-primary hover:bg-primary/90">
                              <MessageCircle className="h-4 w-4" />
                              {c.Term} {u.name}
                            </Button>
                          </a>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PER-AREA JAKARTA */}
        <section className="border-b border-border bg-secondary/40 py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold sm:text-3xl">{c.Term} laptop per wilayah Jakarta</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Pilih halaman area untuk detail landmark, ETA pengiriman, dan use case lokal.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {jakartaAreas.map((a) => (
                <a
                  key={a.slug}
                  href={`/${a.slug}`}
                  className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <h3 className="text-base font-semibold text-foreground group-hover:text-primary">
                      {c.Term} Laptop {a.area}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {a.landmarks.slice(0, 4).join(", ")}, dan sekitarnya.
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                    Detail area {a.areaShort} →
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="border-b border-border py-14">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold sm:text-3xl">Cara {c.term} laptop di Techpora Jakarta</h2>
            <ol className="mt-8 space-y-4">
              {[
                { n: 1, t: "Chat admin via WhatsApp", d: "Sebutkan jenis unit, jumlah, durasi, dan alamat pengiriman di Jakarta." },
                { n: 2, t: "Konfirmasi ketersediaan & harga", d: "Admin cek stok real-time dan kirim detail harga + estimasi kirim." },
                { n: 3, t: `Verifikasi data & bayar`, d: "Kirim ID dan bukti pembayaran (transfer / QRIS). Corporate bisa PO." },
                { n: 4, t: "Unit disiapkan & dicek", d: "Kami install Office, antivirus, dan uji fungsi keyboard-layar sebelum kirim." },
                { n: 5, t: "Unit dikirim ke lokasi Jakarta", d: "Estimasi 1–3 jam. Unit sampai, langsung siap pakai — tanpa setup tambahan." },
              ].map((s) => (
                <li key={s.n} className="flex gap-4 rounded-xl border border-border bg-card p-4">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {s.n}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{s.t}</div>
                    <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-b border-border bg-secondary/40 py-14">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold sm:text-3xl">FAQ {c.term} laptop Jakarta</h2>
            <div className="mt-8 space-y-4">
              {c.faqs.map((f) => (
                <details key={f.q} className="group rounded-xl border border-border bg-card p-5">
                  <summary className="flex cursor-pointer items-start justify-between gap-4 text-base font-semibold text-foreground">
                    {f.q}
                    <span className="mt-0.5 text-primary transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CROSS-LINK to variant */}
        <section className="border-b border-border py-10">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <p className="text-sm text-muted-foreground">
              Cari halaman <span className="font-semibold text-foreground">{other.term}</span> laptop Jakarta?
            </p>
            <a href={otherPath} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              Lihat halaman {other.Term} Laptop Jakarta →
            </a>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Zap className="h-3.5 w-3.5" />
              Unit ready hari ini
            </div>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Siap {c.term} laptop di Jakarta?</h2>
            <p className="mt-4 text-muted-foreground">Chat admin sekarang — unit siap dikirim ke lokasi kamu hari ini juga.</p>
            <a href={waLink(buildWaSimple(undefined, "Jakarta"))} target="_blank" rel="noopener noreferrer" className="mt-8 inline-block">
              <Button size="lg" className="gap-2 rounded-full bg-primary px-8 hover:bg-primary/90">
                <MessageCircle className="h-5 w-5" />
                Chat WhatsApp Sekarang
              </Button>
            </a>
            <div className="mt-8 flex justify-center gap-6 text-sm">
              <Link to="/" className="font-medium text-primary hover:underline">← Beranda</Link>
              <Link to="/blog" className="font-medium text-primary hover:underline">Baca panduan sewa →</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-xs text-muted-foreground sm:px-6 lg:px-8">
          Copyright © Techpora.id — {c.Term} Laptop Jakarta & Sekitarnya
        </div>
      </footer>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={highlight ? "font-bold text-primary" : "font-semibold text-foreground"}>{value}</span>
    </div>
  );
}

// Expose copy so route files can build head() meta + JSON-LD.
export const jakartaHubCopy = COPY;
