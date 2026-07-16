import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { S as notFound } from "../_libs/tanstack__router-core.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { p as posts, g as generatedPosts } from "./blog-C_p4h1ZY.mjs";
import { S as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { c as createServerFn, T as TSS_SERVER_FUNCTION, g as getServerFnById } from "./server-CZa_a97V.mjs";
import { M as MessageCircle, a as MapPin, A as ArrowRight, T as Truck, S as ShieldCheck, b as Star, Z as Zap } from "../_libs/lucide-react.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
const appCss = "/assets/styles-zrb1goAE.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  reactExports.useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$i = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Techpora.id" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "google-site-verification", content: "s38inJ6I2e5zwqwEqQDEWc5sxUeleIoG8d0rNvugujA" },
      { title: "Techpora.id — Sewa Laptop, Printer & Proyektor Jakarta" },
      { property: "og:title", content: "Techpora.id — Sewa Laptop, Printer & Proyektor Jakarta" },
      { name: "twitter:title", content: "Techpora.id — Sewa Laptop, Printer & Proyektor Jakarta" },
      { name: "description", content: "Sewa laptop, printer & proyektor di Jakarta. Harian, mingguan, bulanan. Unit siap pakai, pengiriman cepat untuk mahasiswa, kantor, dan event." },
      { property: "og:description", content: "Sewa laptop, printer & proyektor di Jakarta. Harian, mingguan, bulanan. Unit siap pakai, pengiriman cepat untuk mahasiswa, kantor, dan event." },
      { name: "twitter:description", content: "Sewa laptop, printer & proyektor di Jakarta. Harian, mingguan, bulanan. Unit siap pakai, pengiriman cepat untuk mahasiswa, kantor, dan event." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/5874f92e-35ee-4710-ae8d-3edda3edb5ea" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/5874f92e-35ee-4710-ae8d-3edda3edb5ea" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Fira+Sans:wght@300;400;500;600;700;800&display=swap"
      }
    ],
    scripts: []
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$i.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) });
}
const laptops$1 = {
  thinkpad: { name: "Lenovo ThinkPad", category: "Laptop", specs: "i3 · 8GB · SSD 256GB", daily: "Rp100.000", weekly: "Rp650.000", monthly: "Rp1.500.000" },
  vivobook: { name: "ASUS VivoBook", category: "Laptop", specs: "i3 · 8GB · SSD 256GB", daily: "Rp135.000", weekly: "Rp850.000", monthly: "Rp2.000.000" },
  redmibook: { name: "RedmiBook 15", category: "Laptop", specs: "i3 · 8GB · SSD 256GB", daily: "Rp135.000", weekly: "Rp850.000", monthly: "Rp2.000.000" },
  acer: { name: "Acer Aspire 5", category: "Laptop", specs: "i5 · 8GB · SSD 256GB", daily: "Rp175.000", weekly: "Rp1.100.000", monthly: "Rp3.000.000" },
  macbook: { name: "MacBook Air M1", category: "Laptop", specs: "M1 · 8GB · SSD 256GB", daily: "Rp250.000", weekly: "Rp1.500.000", monthly: "Rp4.500.000", featured: true },
  epsonPrinter: { name: "Epson L3210", category: "Printer", specs: "Print · Scan · Copy", daily: "Rp100.000", weekly: "Rp500.000", monthly: "Rp1.500.000" },
  viewsonic: { name: "ViewSonic SP3", category: "Proyektor", specs: "Portable · HD", daily: "Rp150.000", weekly: "Rp850.000", monthly: "Rp2.500.000" },
  epsonProj: { name: "Epson EB-E600", category: "Proyektor", specs: "3LCD · 3500 Lumens", daily: "Rp200.000", weekly: "Rp1.200.000", monthly: "Rp3.500.000" }
};
const areas = [
  {
    slug: "sewa-laptop-jakarta-selatan",
    area: "Jakarta Selatan",
    areaShort: "Jaksel",
    title: "Sewa Laptop Jakarta Selatan — MacBook & i5 Ready | Techpora",
    metaDescription: "Sewa laptop Jakarta Selatan harian, mingguan, bulanan. MacBook, ThinkPad, VivoBook siap kirim ke Kemang, Senayan, Pondok Indah, TB Simatupang. Fast response WA.",
    keywords: "sewa laptop jakarta selatan, rental laptop jaksel, sewa macbook jakarta selatan, sewa laptop kemang, sewa laptop senayan, sewa laptop pondok indah",
    h1: "Sewa Laptop Jakarta Selatan — Techpora",
    intro: "Butuh sewa laptop di area Jakarta Selatan? Techpora melayani pengiriman laptop, printer, dan proyektor ke kawasan Kemang, Senayan, SCBD, Pondok Indah, Cilandak, hingga TB Simatupang. Cocok untuk startup di co-working, meeting di kantor Sudirman-Senayan, atau kebutuhan pribadi mahasiswa area Blok M dan sekitarnya. Unit yang paling dicari di Jaksel: MacBook Air M1 dan Acer Aspire 5 (i5) — banyak dipakai untuk kerja remote dan presentasi klien.",
    highlights: [
      { title: "Cepat ke SCBD & Sudirman", desc: "Pengiriman kilat ke gedung perkantoran di sekitar Sudirman, SCBD, dan Senayan." },
      { title: "Bulanan Favorit di Jaksel", desc: "Sewa bulanan MacBook & i5 populer untuk freelancer dan pekerja hybrid di area co-working Kemang." },
      { title: "Unit Premium Ready", desc: "MacBook Air M1 stok banyak — cocok untuk meeting klien tanpa khawatir tampilan." }
    ],
    landmarks: ["Kemang", "Senayan", "SCBD", "Sudirman", "Pondok Indah", "Cilandak", "TB Simatupang", "Blok M", "Fatmawati"],
    eta: "Estimasi tiba 1–3 jam sesuai jarak dari Rawamangun.",
    useCases: [
      "Kerja remote / hybrid di co-working Kemang & SCBD",
      "Presentasi klien di kantor Sudirman-Senayan",
      "Mahasiswa Universitas Pancasila, Al-Azhar, London School",
      "Event / seminar di hotel kawasan Senayan & Kuningan"
    ],
    units: [laptops$1.macbook, laptops$1.acer, laptops$1.vivobook, laptops$1.thinkpad, laptops$1.epsonProj]
  },
  {
    slug: "sewa-laptop-jakarta-timur",
    area: "Jakarta Timur",
    areaShort: "Jaktim",
    title: "Sewa Laptop Jakarta Timur — Rawamangun Ready | Techpora",
    metaDescription: "Sewa laptop Jakarta Timur — basis operasional Techpora di Rawamangun. Bisa ambil langsung tanpa ongkir. Melayani Cawang, Cakung, Pulogadung, Duren Sawit.",
    keywords: "sewa laptop jakarta timur, rental laptop jaktim, sewa laptop rawamangun, sewa laptop cakung, sewa laptop pulogadung, sewa laptop duren sawit",
    h1: "Sewa Laptop Jakarta Timur — Techpora",
    intro: "Techpora berbasis di Rawamangun, Jakarta Timur — jadi pengambilan langsung di sini paling praktis dan tanpa ongkir. Kami rutin melayani area Rawamangun, Cawang, Cakung, Pulogadung, Duren Sawit, Kampung Melayu, hingga Jatinegara. Banyak mahasiswa UNJ, UKI, dan STIE Trisakti yang sewa harian untuk sidang dan tugas kuliah — dan kantor-kantor di Kawasan Industri Pulogadung sewa mingguan untuk kebutuhan staff temporary.",
    highlights: [
      { title: "Ambil Sendiri di Rawamangun", desc: "Hemat ongkir. Alamat toko: Jl. R. Mangun Muka Raya, siap sambut kapan pun jam operasional." },
      { title: "Dekat Kampus UNJ", desc: "Mahasiswa UNJ tinggal jalan kaki. Sewa harian ThinkPad & VivoBook paling laris untuk skripsi." },
      { title: "Kirim Kilat", desc: "Pengiriman ke area Jaktim biasanya di bawah 1 jam." }
    ],
    landmarks: ["Rawamangun", "Cawang", "Cakung", "Pulogadung", "Duren Sawit", "Kampung Melayu", "Jatinegara", "UNJ", "UKI Cawang"],
    eta: "Ambil sendiri di Rawamangun (0 ongkir) atau kirim < 1 jam.",
    useCases: [
      "Sidang & skripsi mahasiswa UNJ, UKI, STIE Trisakti",
      "Kantor Kawasan Industri Pulogadung (staff temporary)",
      "Event kecil-menengah di venue Jaktim",
      "Kebutuhan harian keluarga (belajar anak, kerja WFH)"
    ],
    units: [laptops$1.thinkpad, laptops$1.vivobook, laptops$1.redmibook, laptops$1.acer, laptops$1.epsonPrinter]
  },
  {
    slug: "sewa-laptop-jakarta-barat",
    area: "Jakarta Barat",
    areaShort: "Jakbar",
    title: "Sewa Laptop Jakarta Barat — Grogol & Puri | Techpora",
    metaDescription: "Sewa laptop Jakarta Barat harian & bulanan. Kirim ke Grogol, Kebon Jeruk, Puri Indah, Kalideres, Taman Anggrek. Cocok untuk mahasiswa Untar, Binus, Trisakti.",
    keywords: "sewa laptop jakarta barat, rental laptop jakbar, sewa laptop grogol, sewa laptop puri indah, sewa laptop binus, sewa laptop untar",
    h1: "Sewa Laptop Jakarta Barat — Techpora",
    intro: "Untuk area Jakarta Barat, Techpora menjangkau Grogol, Kebon Jeruk, Puri Indah, Kalideres, Taman Anggrek, hingga Meruya. Area ini punya banyak permintaan dari mahasiswa Untar, Binus, dan Trisakti untuk sewa bulanan — jauh lebih hemat dari beli laptop baru. Selain itu, banyak agency dan startup kecil di area Green Ville-Kebon Jeruk yang sewa 3–5 unit untuk staff proyek jangka pendek.",
    highlights: [
      { title: "Sewa Bulanan Hemat", desc: "Mahasiswa Binus/Untar/Trisakti banyak yang ambil paket bulanan untuk semesteran." },
      { title: "Bundle untuk Agency", desc: "Sewa 3–5 unit sekaligus untuk tim proyek jangka pendek — harga bisa dibicarakan." },
      { title: "Kirim ke Mall Area", desc: "Pengiriman ke tenant di Taman Anggrek, Central Park, atau Puri Indah Mall bisa diatur." }
    ],
    landmarks: ["Grogol", "Kebon Jeruk", "Puri Indah", "Kalideres", "Taman Anggrek", "Central Park", "Meruya", "Green Ville"],
    eta: "Estimasi pengiriman 2–4 jam ke area Jakarta Barat.",
    useCases: [
      "Mahasiswa Untar, Binus, Trisakti — sewa semesteran",
      "Startup / agency Kebon Jeruk — tim proyek",
      "Kerja freelance di co-working area Puri",
      "Kebutuhan tenant mall (event booth, launching)"
    ],
    units: [laptops$1.vivobook, laptops$1.redmibook, laptops$1.thinkpad, laptops$1.macbook, laptops$1.viewsonic]
  },
  {
    slug: "sewa-laptop-jakarta-utara",
    area: "Jakarta Utara",
    areaShort: "Jakut",
    title: "Sewa Laptop Jakarta Utara — PIK & Kelapa Gading | Techpora",
    metaDescription: "Sewa laptop Jakarta Utara untuk event MICE, pameran, dan kantor. Kirim ke PIK, Kelapa Gading, Sunter, Ancol, Pluit. Paket bulk untuk event tersedia.",
    keywords: "sewa laptop jakarta utara, rental laptop jakut, sewa laptop kelapa gading, sewa laptop pik, sewa laptop pluit, sewa laptop event ancol",
    h1: "Sewa Laptop Jakarta Utara — Techpora",
    intro: "Jakarta Utara adalah kawasan MICE (Meeting, Incentive, Convention, Exhibition) — dan Techpora sudah biasa melayani sewa laptop volume banyak untuk event di JIExpo Kemayoran, Ancol, hingga PIK. Selain itu, kami juga sering kirim unit ke perkantoran di Sunter, Kelapa Gading, dan Pluit untuk kebutuhan training staff atau replace laptop rusak dadakan.",
    highlights: [
      { title: "Ready untuk Event Besar", desc: "Sewa 20–50+ unit sekaligus untuk registrasi event, booth, dan pameran di JIExpo/Ancol." },
      { title: "Antar-Jemput di Venue", desc: "Tim kami antar sekaligus jemput di lokasi acara, hemat waktu panitia." },
      { title: "Unit Seragam", desc: "Untuk event, semua unit spek seragam — tampilan booth rapi dan profesional." }
    ],
    landmarks: ["Kelapa Gading", "Sunter", "PIK", "Pluit", "Ancol", "JIExpo Kemayoran", "Muara Karang"],
    eta: "Pengiriman event bisa dijadwalkan H-1. Standar 2–3 jam.",
    useCases: [
      "Event & pameran di JIExpo, Ancol, ICE PIK",
      "Training kantor di Sunter & Kelapa Gading",
      "Booth registrasi (bulk 20–50 unit)",
      "Replace laptop rusak dadakan di kantor Pluit"
    ],
    units: [laptops$1.vivobook, laptops$1.thinkpad, laptops$1.redmibook, laptops$1.acer, laptops$1.epsonProj, laptops$1.viewsonic]
  },
  {
    slug: "sewa-laptop-jakarta-pusat",
    area: "Jakarta Pusat",
    areaShort: "Jakpus",
    title: "Sewa Laptop Jakarta Pusat — Sudirman & Thamrin | Techpora",
    metaDescription: "Sewa laptop Jakarta Pusat untuk kantor Sudirman-Thamrin, hotel Menteng, dan venue seminar Kemayoran. Fast response, unit siap pakai, invoice tersedia.",
    keywords: "sewa laptop jakarta pusat, rental laptop jakpus, sewa laptop sudirman, sewa laptop thamrin, sewa laptop menteng, sewa laptop kemayoran",
    h1: "Sewa Laptop Jakarta Pusat — Techpora",
    intro: "Jakarta Pusat adalah jantung perkantoran & venue seminar Jakarta. Techpora rutin melayani sewa laptop untuk kantor pusat perusahaan di Sudirman-Thamrin, seminar di hotel kawasan Menteng, hingga event di kawasan Kemayoran. Kalau butuh invoice untuk klaim ke kantor, tinggal request — kami siapkan dokumen sesuai kebutuhan corporate.",
    highlights: [
      { title: "Invoice Corporate", desc: "Butuh dokumen untuk reimburse kantor? Kami siapkan invoice resmi." },
      { title: "Meeting-Ready", desc: "MacBook Air & Acer i5 populer untuk presentasi ke direksi & klien." },
      { title: "Cepat ke Hotel", desc: "Kirim langsung ke concierge hotel Menteng/Thamrin untuk speaker seminar." }
    ],
    landmarks: ["Sudirman", "Thamrin", "Menteng", "Kemayoran", "Cikini", "Tanah Abang", "Senen"],
    eta: "Estimasi tiba 1–3 jam ke area perkantoran Jakpus.",
    useCases: [
      "Kantor pusat Sudirman-Thamrin (staff & meeting)",
      "Speaker seminar di hotel Menteng",
      "Event conference di JCC & Balai Kartini",
      "Media & agency kawasan Kebon Sirih"
    ],
    units: [laptops$1.macbook, laptops$1.acer, laptops$1.vivobook, laptops$1.thinkpad, laptops$1.epsonProj]
  },
  {
    slug: "sewa-laptop-tangerang",
    area: "Tangerang",
    areaShort: "Tangerang",
    title: "Sewa Laptop Tangerang — BSD & Alam Sutera | Techpora",
    metaDescription: "Sewa laptop Tangerang harian & bulanan. Kirim ke BSD, Alam Sutera, Karawaci, Gading Serpong, Bintaro. Cocok untuk mahasiswa Prasmul, UMN, SGU.",
    keywords: "sewa laptop tangerang, rental laptop bsd, sewa laptop alam sutera, sewa laptop karawaci, sewa laptop umn, sewa laptop prasmul",
    h1: "Sewa Laptop Tangerang — Techpora",
    intro: "Kawasan Tangerang (BSD, Alam Sutera, Karawaci, Gading Serpong, Bintaro) berkembang pesat sebagai hub pendidikan & tech startup. Techpora melayani mahasiswa Prasmul, UMN, SGU, hingga Binus BSD yang butuh sewa laptop bulanan untuk kuliah — dan startup di The Breeze / QBig BSD yang butuh unit tambahan untuk hackathon atau bootcamp.",
    highlights: [
      { title: "Favorit Mahasiswa BSD", desc: "Sewa bulanan Acer Aspire 5 & VivoBook untuk mahasiswa UMN, Prasmul, SGU." },
      { title: "Tech Startup Friendly", desc: "Startup di The Breeze BSD sering sewa 5–10 unit untuk sprint/bootcamp." },
      { title: "Free Shipping Bulanan", desc: "Sewa minimal mingguan ke Tangerang gratis ongkir." }
    ],
    landmarks: ["BSD", "Alam Sutera", "Karawaci", "Gading Serpong", "Bintaro", "The Breeze", "QBig", "UMN", "Prasmul"],
    eta: "Pengiriman ke Tangerang biasanya 2–4 jam.",
    useCases: [
      "Mahasiswa UMN, Prasmul, SGU, Binus BSD",
      "Tech startup — sprint & hackathon",
      "Bootcamp coding di co-working BSD",
      "Kantor kawasan Karawaci Office Park"
    ],
    units: [laptops$1.acer, laptops$1.vivobook, laptops$1.macbook, laptops$1.thinkpad, laptops$1.epsonProj]
  },
  {
    slug: "sewa-laptop-bekasi",
    area: "Bekasi",
    areaShort: "Bekasi",
    title: "Sewa Laptop Bekasi — Summarecon, Harapan Indah | Techpora",
    metaDescription: "Sewa laptop Bekasi untuk training kantor & kebutuhan bulanan. Kirim ke Bekasi Kota, Summarecon, Harapan Indah, Grand Galaxy. Fast response WhatsApp.",
    keywords: "sewa laptop bekasi, rental laptop bekasi, sewa laptop summarecon bekasi, sewa laptop harapan indah, sewa laptop training bekasi",
    h1: "Sewa Laptop Bekasi — Techpora",
    intro: "Bekasi banyak dihuni pekerja pabrik & kantor kawasan industri (MM2100, Jababeka, Cikarang) — dan Techpora rutin melayani sewa laptop untuk training staff HRD, sertifikasi ISO, hingga audit tahunan. Untuk warga Summarecon Bekasi, Harapan Indah, dan Grand Galaxy, sewa harian juga banyak untuk kebutuhan freelance & anak kuliah remote.",
    highlights: [
      { title: "Training HRD & Audit", desc: "Sewa 10–30 unit untuk training staff perusahaan kawasan industri Bekasi." },
      { title: "Pengiriman Cikarang", desc: "Melayani hingga Cikarang & MM2100 dengan jadwal H-1." },
      { title: "Paket Bulanan Populer", desc: "Warga Summarecon & Harapan Indah banyak ambil bulanan untuk WFH." }
    ],
    landmarks: ["Bekasi Kota", "Summarecon Bekasi", "Harapan Indah", "Grand Galaxy", "Kemang Pratama", "Jababeka", "Cikarang", "MM2100"],
    eta: "Estimasi pengiriman 3–5 jam. Untuk Cikarang bisa dijadwalkan H-1.",
    useCases: [
      "Training kantor kawasan industri (MM2100, Jababeka)",
      "Audit tahunan & sertifikasi ISO",
      "Warga Summarecon/Harapan Indah untuk WFH",
      "Mahasiswa Kalbis, Bina Nusantara Bekasi"
    ],
    units: [laptops$1.thinkpad, laptops$1.vivobook, laptops$1.acer, laptops$1.redmibook, laptops$1.epsonPrinter]
  },
  {
    slug: "sewa-laptop-depok",
    area: "Depok",
    areaShort: "Depok",
    title: "Sewa Laptop Depok — Margonda, UI, Cinere | Techpora",
    metaDescription: "Sewa laptop Depok untuk mahasiswa UI, Gunadarma, dan kebutuhan skripsi. Harian & bulanan. Kirim ke Margonda, Beji, Cinere, Cimanggis, Sawangan.",
    keywords: "sewa laptop depok, rental laptop depok, sewa laptop margonda, sewa laptop ui, sewa laptop skripsi depok, sewa laptop gunadarma",
    h1: "Sewa Laptop Depok — Techpora",
    intro: "Depok adalah kota mahasiswa — dan Techpora sudah lama jadi andalan mahasiswa UI, Gunadarma, dan Politeknik Negeri Jakarta untuk sewa laptop skripsi, sidang, dan tugas akhir. Yang paling laris di sini: sewa bulanan ASUS VivoBook / Acer Aspire 5 untuk 1–3 bulan menuju wisuda. Kami juga melayani area Beji, Cinere, Cimanggis, hingga Sawangan.",
    highlights: [
      { title: "#1 untuk Skripsi", desc: "Paket bulanan i5 laris untuk mahasiswa yang lagi ngerjain revisi & sidang." },
      { title: "Antar ke Kos Margonda", desc: "Kirim langsung ke kos-kosan sekitar UI & Gunadarma." },
      { title: "Refund Cepat", desc: "Selesai sidang, unit tinggal dibalikin — jaminan diproses cepat." }
    ],
    landmarks: ["Margonda", "UI Depok", "Gunadarma", "Beji", "Cinere", "Cimanggis", "Sawangan", "PNJ"],
    eta: "Pengiriman ke Depok 2–4 jam. Bisa antar langsung ke kos.",
    useCases: [
      "Mahasiswa UI, Gunadarma, PNJ — skripsi & sidang",
      "Tugas akhir & TA (bulanan)",
      "Anak SMA les online (harian/mingguan)",
      "Freelance mahasiswa Depok"
    ],
    units: [laptops$1.vivobook, laptops$1.acer, laptops$1.thinkpad, laptops$1.redmibook, laptops$1.macbook]
  }
];
const areaBySlug = (slug) => areas.find((a) => a.slug === slug);
const BASE_URL$3 = "https://techpora.id";
const Route$h = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/sewa-laptop-jakarta", changefreq: "weekly", priority: "0.95" },
          { path: "/rental-laptop-jakarta", changefreq: "weekly", priority: "0.9" },
          { path: "/sewa-macbook", changefreq: "monthly", priority: "0.8" },
          { path: "/blog", changefreq: "weekly", priority: "0.8" },
          ...areas.map((a) => ({
            path: `/${a.slug}`,
            changefreq: "monthly",
            priority: "0.7"
          })),
          ...posts.map((p) => ({
            path: `/blog/${p.slug}`,
            lastmod: p.date,
            changefreq: "monthly",
            priority: "0.6"
          }))
        ];
        const urls = entries.map(
          (e) => [
            `  <url>`,
            `    <loc>${BASE_URL$3}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`
          ].filter(Boolean).join("\n")
        );
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`
        ].join("\n");
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600"
          }
        });
      }
    }
  }
});
const faqs = [{
  q: "Berapa harga sewa MacBook Air M1 di Techpora?",
  a: "Rp250.000 per hari, Rp1.500.000 per minggu, Rp4.500.000 per bulan. Semakin panjang durasi semakin hemat."
}, {
  q: "Apa syarat sewa MacBook?",
  a: "KTP + satu identitas pendukung (SIM/kartu pelajar/kartu kantor). Untuk durasi panjang atau nominal besar bisa ada deposit yang dijelaskan saat konfirmasi via WhatsApp."
}, {
  q: "Apakah bisa antar-jemput ke lokasi saya?",
  a: "Bisa. Kami melayani antar-jemput area Jakarta, Bekasi, Depok, dan Tangerang. Biaya antar disesuaikan jarak dan bisa gratis untuk durasi tertentu."
}, {
  q: "Apakah software desain sudah terinstall?",
  a: "MacBook siap pakai dengan macOS terbaru. Software berlisensi (Adobe, Figma desktop, dll.) menggunakan akun pribadi Anda — kami bantu proses instalasi jika perlu."
}];
const $$splitComponentImporter$d = () => import("./sewa-macbook-Cj0S35tI.mjs");
const SITE_URL$d = "https://techpora.id";
const SLUG$8 = "sewa-macbook";
const TITLE = "Sewa MacBook Jakarta — Air M1 Harian & Bulanan";
const DESC = "Sewa MacBook di Jakarta untuk desainer, developer, dan pekerja kreatif. MacBook Air M1 ready — harian, mingguan, bulanan. Antar-jemput area Jabodetabek.";
const Route$g = createFileRoute("/sewa-macbook")({
  head: () => ({
    meta: [{
      title: TITLE
    }, {
      name: "description",
      content: DESC
    }, {
      name: "keywords",
      content: "sewa macbook, sewa macbook jakarta, rental macbook, sewa macbook air m1, sewa laptop apple, rental macbook harian, sewa macbook bulanan"
    }, {
      name: "robots",
      content: "index, follow, max-image-preview:large, max-snippet:-1"
    }, {
      property: "og:title",
      content: TITLE
    }, {
      property: "og:description",
      content: DESC
    }, {
      property: "og:url",
      content: `${SITE_URL$d}/${SLUG$8}`
    }, {
      property: "og:type",
      content: "website"
    }, {
      name: "twitter:card",
      content: "summary_large_image"
    }, {
      name: "twitter:title",
      content: TITLE
    }, {
      name: "twitter:description",
      content: DESC
    }],
    links: [{
      rel: "canonical",
      href: `${SITE_URL$d}/${SLUG$8}`
    }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        name: "Sewa MacBook Air M1 — Techpora",
        description: DESC,
        brand: {
          "@type": "Brand",
          name: "Apple"
        },
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
            url: SITE_URL$d,
            telephone: "+62821-7798-4041"
          }
        },
        url: `${SITE_URL$d}/${SLUG$8}`
      })
    }, {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.a
          }
        }))
      })
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const SLUG$7 = "sewa-laptop-tangerang";
const area$7 = areaBySlug(SLUG$7);
const $$splitComponentImporter$c = () => import("./sewa-laptop-tangerang-BvjvvW91.mjs");
const SITE_URL$c = "https://techpora.id";
const Route$f = createFileRoute("/sewa-laptop-tangerang")({
  head: () => ({
    meta: [{
      title: area$7.title
    }, {
      name: "description",
      content: area$7.metaDescription
    }, {
      name: "keywords",
      content: area$7.keywords
    }, {
      name: "robots",
      content: "index, follow, max-image-preview:large, max-snippet:-1"
    }, {
      property: "og:title",
      content: area$7.title
    }, {
      property: "og:description",
      content: area$7.metaDescription
    }, {
      property: "og:url",
      content: `${SITE_URL$c}/${SLUG$7}`
    }, {
      property: "og:type",
      content: "website"
    }, {
      name: "twitter:card",
      content: "summary_large_image"
    }, {
      name: "twitter:title",
      content: area$7.title
    }, {
      name: "twitter:description",
      content: area$7.metaDescription
    }],
    links: [{
      rel: "canonical",
      href: `${SITE_URL$c}/${SLUG$7}`
    }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        name: area$7.h1,
        serviceType: "Sewa Laptop",
        areaServed: {
          "@type": "Place",
          name: area$7.area
        },
        provider: {
          "@type": "LocalBusiness",
          name: "Techpora.id",
          url: SITE_URL$c,
          telephone: "+62821-7798-4041"
        },
        url: `${SITE_URL$c}/${SLUG$7}`,
        description: area$7.metaDescription
      })
    }, {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [{
          "@type": "ListItem",
          position: 1,
          name: "Beranda",
          item: `${SITE_URL$c}/`
        }, {
          "@type": "ListItem",
          position: 2,
          name: area$7.area,
          item: `${SITE_URL$c}/${SLUG$7}`
        }]
      })
    }]
  }),
  loader: () => {
    if (!areaBySlug(SLUG$7)) throw notFound();
    return null;
  },
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const SLUG$6 = "sewa-laptop-jakarta-utara";
const area$6 = areaBySlug(SLUG$6);
const $$splitComponentImporter$b = () => import("./sewa-laptop-jakarta-utara-DH4Ri2Uq.mjs");
const SITE_URL$b = "https://techpora.id";
const Route$e = createFileRoute("/sewa-laptop-jakarta-utara")({
  head: () => ({
    meta: [{
      title: area$6.title
    }, {
      name: "description",
      content: area$6.metaDescription
    }, {
      name: "keywords",
      content: area$6.keywords
    }, {
      name: "robots",
      content: "index, follow, max-image-preview:large, max-snippet:-1"
    }, {
      property: "og:title",
      content: area$6.title
    }, {
      property: "og:description",
      content: area$6.metaDescription
    }, {
      property: "og:url",
      content: `${SITE_URL$b}/${SLUG$6}`
    }, {
      property: "og:type",
      content: "website"
    }, {
      name: "twitter:card",
      content: "summary_large_image"
    }, {
      name: "twitter:title",
      content: area$6.title
    }, {
      name: "twitter:description",
      content: area$6.metaDescription
    }],
    links: [{
      rel: "canonical",
      href: `${SITE_URL$b}/${SLUG$6}`
    }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        name: area$6.h1,
        serviceType: "Sewa Laptop",
        areaServed: {
          "@type": "Place",
          name: area$6.area
        },
        provider: {
          "@type": "LocalBusiness",
          name: "Techpora.id",
          url: SITE_URL$b,
          telephone: "+62821-7798-4041"
        },
        url: `${SITE_URL$b}/${SLUG$6}`,
        description: area$6.metaDescription
      })
    }, {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [{
          "@type": "ListItem",
          position: 1,
          name: "Beranda",
          item: `${SITE_URL$b}/`
        }, {
          "@type": "ListItem",
          position: 2,
          name: area$6.area,
          item: `${SITE_URL$b}/${SLUG$6}`
        }]
      })
    }]
  }),
  loader: () => {
    if (!areaBySlug(SLUG$6)) throw notFound();
    return null;
  },
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const SLUG$5 = "sewa-laptop-jakarta-timur";
const area$5 = areaBySlug(SLUG$5);
const $$splitComponentImporter$a = () => import("./sewa-laptop-jakarta-timur-B-iS75kh.mjs");
const SITE_URL$a = "https://techpora.id";
const Route$d = createFileRoute("/sewa-laptop-jakarta-timur")({
  head: () => ({
    meta: [{
      title: area$5.title
    }, {
      name: "description",
      content: area$5.metaDescription
    }, {
      name: "keywords",
      content: area$5.keywords
    }, {
      name: "robots",
      content: "index, follow, max-image-preview:large, max-snippet:-1"
    }, {
      property: "og:title",
      content: area$5.title
    }, {
      property: "og:description",
      content: area$5.metaDescription
    }, {
      property: "og:url",
      content: `${SITE_URL$a}/${SLUG$5}`
    }, {
      property: "og:type",
      content: "website"
    }, {
      name: "twitter:card",
      content: "summary_large_image"
    }, {
      name: "twitter:title",
      content: area$5.title
    }, {
      name: "twitter:description",
      content: area$5.metaDescription
    }],
    links: [{
      rel: "canonical",
      href: `${SITE_URL$a}/${SLUG$5}`
    }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        name: area$5.h1,
        serviceType: "Sewa Laptop",
        areaServed: {
          "@type": "Place",
          name: area$5.area
        },
        provider: {
          "@type": "LocalBusiness",
          name: "Techpora.id",
          url: SITE_URL$a,
          telephone: "+62821-7798-4041"
        },
        url: `${SITE_URL$a}/${SLUG$5}`,
        description: area$5.metaDescription
      })
    }, {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [{
          "@type": "ListItem",
          position: 1,
          name: "Beranda",
          item: `${SITE_URL$a}/`
        }, {
          "@type": "ListItem",
          position: 2,
          name: area$5.area,
          item: `${SITE_URL$a}/${SLUG$5}`
        }]
      })
    }]
  }),
  loader: () => {
    if (!areaBySlug(SLUG$5)) throw notFound();
    return null;
  },
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const SLUG$4 = "sewa-laptop-jakarta-selatan";
const area$4 = areaBySlug(SLUG$4);
const $$splitComponentImporter$9 = () => import("./sewa-laptop-jakarta-selatan-B88qD64P.mjs");
const SITE_URL$9 = "https://techpora.id";
const Route$c = createFileRoute("/sewa-laptop-jakarta-selatan")({
  head: () => ({
    meta: [{
      title: area$4.title
    }, {
      name: "description",
      content: area$4.metaDescription
    }, {
      name: "keywords",
      content: area$4.keywords
    }, {
      name: "robots",
      content: "index, follow, max-image-preview:large, max-snippet:-1"
    }, {
      property: "og:title",
      content: area$4.title
    }, {
      property: "og:description",
      content: area$4.metaDescription
    }, {
      property: "og:url",
      content: `${SITE_URL$9}/${SLUG$4}`
    }, {
      property: "og:type",
      content: "website"
    }, {
      name: "twitter:card",
      content: "summary_large_image"
    }, {
      name: "twitter:title",
      content: area$4.title
    }, {
      name: "twitter:description",
      content: area$4.metaDescription
    }],
    links: [{
      rel: "canonical",
      href: `${SITE_URL$9}/${SLUG$4}`
    }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        name: area$4.h1,
        serviceType: "Sewa Laptop",
        areaServed: {
          "@type": "Place",
          name: area$4.area
        },
        provider: {
          "@type": "LocalBusiness",
          name: "Techpora.id",
          url: SITE_URL$9,
          telephone: "+62821-7798-4041"
        },
        url: `${SITE_URL$9}/${SLUG$4}`,
        description: area$4.metaDescription
      })
    }, {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [{
          "@type": "ListItem",
          position: 1,
          name: "Beranda",
          item: `${SITE_URL$9}/`
        }, {
          "@type": "ListItem",
          position: 2,
          name: area$4.area,
          item: `${SITE_URL$9}/${SLUG$4}`
        }]
      })
    }]
  }),
  loader: () => {
    if (!areaBySlug(SLUG$4)) throw notFound();
    return null;
  },
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const SLUG$3 = "sewa-laptop-jakarta-pusat";
const area$3 = areaBySlug(SLUG$3);
const $$splitComponentImporter$8 = () => import("./sewa-laptop-jakarta-pusat-BBuyDb2K.mjs");
const SITE_URL$8 = "https://techpora.id";
const Route$b = createFileRoute("/sewa-laptop-jakarta-pusat")({
  head: () => ({
    meta: [{
      title: area$3.title
    }, {
      name: "description",
      content: area$3.metaDescription
    }, {
      name: "keywords",
      content: area$3.keywords
    }, {
      name: "robots",
      content: "index, follow, max-image-preview:large, max-snippet:-1"
    }, {
      property: "og:title",
      content: area$3.title
    }, {
      property: "og:description",
      content: area$3.metaDescription
    }, {
      property: "og:url",
      content: `${SITE_URL$8}/${SLUG$3}`
    }, {
      property: "og:type",
      content: "website"
    }, {
      name: "twitter:card",
      content: "summary_large_image"
    }, {
      name: "twitter:title",
      content: area$3.title
    }, {
      name: "twitter:description",
      content: area$3.metaDescription
    }],
    links: [{
      rel: "canonical",
      href: `${SITE_URL$8}/${SLUG$3}`
    }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        name: area$3.h1,
        serviceType: "Sewa Laptop",
        areaServed: {
          "@type": "Place",
          name: area$3.area
        },
        provider: {
          "@type": "LocalBusiness",
          name: "Techpora.id",
          url: SITE_URL$8,
          telephone: "+62821-7798-4041"
        },
        url: `${SITE_URL$8}/${SLUG$3}`,
        description: area$3.metaDescription
      })
    }, {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [{
          "@type": "ListItem",
          position: 1,
          name: "Beranda",
          item: `${SITE_URL$8}/`
        }, {
          "@type": "ListItem",
          position: 2,
          name: area$3.area,
          item: `${SITE_URL$8}/${SLUG$3}`
        }]
      })
    }]
  }),
  loader: () => {
    if (!areaBySlug(SLUG$3)) throw notFound();
    return null;
  },
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const SLUG$2 = "sewa-laptop-jakarta-barat";
const area$2 = areaBySlug(SLUG$2);
const $$splitComponentImporter$7 = () => import("./sewa-laptop-jakarta-barat-CSw7teCO.mjs");
const SITE_URL$7 = "https://techpora.id";
const Route$a = createFileRoute("/sewa-laptop-jakarta-barat")({
  head: () => ({
    meta: [{
      title: area$2.title
    }, {
      name: "description",
      content: area$2.metaDescription
    }, {
      name: "keywords",
      content: area$2.keywords
    }, {
      name: "robots",
      content: "index, follow, max-image-preview:large, max-snippet:-1"
    }, {
      property: "og:title",
      content: area$2.title
    }, {
      property: "og:description",
      content: area$2.metaDescription
    }, {
      property: "og:url",
      content: `${SITE_URL$7}/${SLUG$2}`
    }, {
      property: "og:type",
      content: "website"
    }, {
      name: "twitter:card",
      content: "summary_large_image"
    }, {
      name: "twitter:title",
      content: area$2.title
    }, {
      name: "twitter:description",
      content: area$2.metaDescription
    }],
    links: [{
      rel: "canonical",
      href: `${SITE_URL$7}/${SLUG$2}`
    }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        name: area$2.h1,
        serviceType: "Sewa Laptop",
        areaServed: {
          "@type": "Place",
          name: area$2.area
        },
        provider: {
          "@type": "LocalBusiness",
          name: "Techpora.id",
          url: SITE_URL$7,
          telephone: "+62821-7798-4041"
        },
        url: `${SITE_URL$7}/${SLUG$2}`,
        description: area$2.metaDescription
      })
    }, {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [{
          "@type": "ListItem",
          position: 1,
          name: "Beranda",
          item: `${SITE_URL$7}/`
        }, {
          "@type": "ListItem",
          position: 2,
          name: area$2.area,
          item: `${SITE_URL$7}/${SLUG$2}`
        }]
      })
    }]
  }),
  loader: () => {
    if (!areaBySlug(SLUG$2)) throw notFound();
    return null;
  },
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const url$a = "/__l5e/assets-v1/9f5a7cf0-e39e-40f7-82fe-078ca5130eb1/techpora-logo.png";
const logoAsset = {
  url: url$a
};
const url$9 = "/__l5e/assets-v1/07c57521-f3e6-42ab-8122-7621595ad4d7/thinkpad.png";
const thinkpad = {
  url: url$9
};
const url$8 = "/__l5e/assets-v1/c8a95364-1a45-4b09-a8c7-85815fa87637/vivobook.png";
const vivobook = {
  url: url$8
};
const url$7 = "/__l5e/assets-v1/f56fc2c2-2bd6-4cc9-a344-ca3e8a81f23f/redmibook.png";
const redmibook = {
  url: url$7
};
const url$6 = "/__l5e/assets-v1/20a7c4c9-1eaf-4df2-8d5f-de611597f1e1/acer.png";
const acer = {
  url: url$6
};
const url$5 = "/__l5e/assets-v1/e4ae2bfb-6c00-4e95-baa0-37a1e3f96283/macbook.png";
const macbook = {
  url: url$5
};
const url$4 = "/__l5e/assets-v1/de46a4a3-aee0-440d-b4e0-e1ce9befaaaf/epson-printer.png";
const epsonPrinter = {
  url: url$4
};
const url$3 = "/__l5e/assets-v1/90e4f4c2-558d-422e-b579-b4b3cf0cd4e3/hp-printer.png";
const hpPrinter = {
  url: url$3
};
const url$2 = "/__l5e/assets-v1/da0d8ef5-383c-48aa-98ba-611184a1d326/viewsonic.png";
const viewsonic = {
  url: url$2
};
const url$1 = "/__l5e/assets-v1/56f1bcf4-2dd5-4952-ad75-31ceef7cfab4/epson-projector-e600.png";
const epsonProjE600 = {
  url: url$1
};
const url = "/__l5e/assets-v1/5542db01-541a-46fa-9981-d6d8743a6ad4/epson-projector-x600.png";
const epsonProjX600 = {
  url
};
const unitImages = {
  "Lenovo ThinkPad": thinkpad.url,
  "ASUS VivoBook": vivobook.url,
  "RedmiBook 15": redmibook.url,
  "Acer Aspire 5": acer.url,
  "MacBook Air M1": macbook.url,
  "Epson L3210": epsonPrinter.url,
  "HP Smart Tank 215": hpPrinter.url,
  "ViewSonic SP3": viewsonic.url,
  "Epson EB-E600": epsonProjE600.url,
  "Epson EB-X600": epsonProjX600.url
};
const getUnitImage = (name) => unitImages[name];
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = reactExports.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
  }
);
Button.displayName = "Button";
const WA_NUMBER = "6282177984041";
const SITE_DOMAIN = "techpora.id";
function buildWaSimple(unit, area2) {
  const unitPart = unit ? `unit ${unit}` : "unit yang tersedia";
  const areaPart = area2 ? ` untuk area ${area2}` : "";
  return [
    `Halo Techpora, saya mau sewa ${unitPart}${areaPart}.`,
    "Mohon info ketersediaan dan durasi sewa yang paling hemat.",
    `Saya lihat dari ${SITE_DOMAIN}.`
  ].join("\n");
}
function waLink(text) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}
const jakartaAreas = areas.filter((a) => a.area.toLowerCase().startsWith("jakarta"));
const allUnits = (() => {
  const seen = /* @__PURE__ */ new Map();
  for (const a of areas) {
    for (const u of a.units) {
      if (!seen.has(u.name)) seen.set(u.name, u);
    }
  }
  return Array.from(seen.values());
})();
const laptops = allUnits.filter((u) => u.category === "Laptop");
const printers = allUnits.filter((u) => u.category === "Printer");
const projectors = allUnits.filter((u) => u.category === "Proyektor");
const COPY = {
  sewa: {
    term: "sewa",
    Term: "Sewa",
    title: "Sewa Laptop Jakarta — Harian, Mingguan, Bulanan | Techpora",
    h1: "Sewa Laptop Jakarta — Techpora",
    intro: "Techpora adalah layanan sewa laptop Jakarta yang berbasis di Rawamangun, Jakarta Timur. Kami melayani sewa laptop harian, mingguan, dan bulanan untuk seluruh area Jakarta — dari MacBook Air M1 untuk presentasi klien di SCBD, ThinkPad & VivoBook untuk mahasiswa UI/UNJ/Binus, hingga unit bulk 20–50 laptop untuk event registrasi di JIExpo. Semua unit dicek, dibersihkan, dan siap pakai sebelum dikirim ke lokasi kamu.",
    metaDescription: "Sewa laptop Jakarta harian, mingguan, bulanan. MacBook, ThinkPad, VivoBook, Acer i5 siap kirim ke Jakarta Selatan, Timur, Barat, Utara, Pusat. Fast response WA.",
    ogTitle: "Sewa Laptop Jakarta — Harian, Mingguan, Bulanan | Techpora",
    ogDesc: "Sewa laptop Jakarta dengan pilihan lengkap MacBook, ThinkPad, VivoBook, Acer i5. Kirim ke seluruh Jakarta, unit dicek sebelum kirim.",
    keywords: "sewa laptop jakarta, sewa laptop harian jakarta, sewa laptop bulanan jakarta, sewa laptop murah jakarta, sewa macbook jakarta, tempat sewa laptop jakarta",
    whyLead: "Kenapa penyewa Jakarta pilih Techpora?",
    whyPoints: [
      {
        title: "Kirim ke seluruh Jakarta",
        desc: "Pengiriman kilat ke Jakarta Selatan (SCBD, Sudirman, Kemang), Timur (Rawamangun, Cawang), Barat (Grogol, Kebon Jeruk), Utara (Kelapa Gading, PIK), dan Pusat (Thamrin, Menteng)."
      },
      {
        title: "Harian, mingguan, bulanan",
        desc: "Sewa laptop bebas mau 1 hari untuk ujian praktikum, 1 minggu untuk event, atau bulanan untuk skripsi & WFH — paket bulanan paling favorit di Jakarta."
      },
      {
        title: "Unit dicek dulu",
        desc: "Setiap laptop dibersihkan, di-install ulang Office, dan diuji sebelum kirim. Tidak ada 'unit rusak sampai di tangan penyewa'."
      },
      {
        title: "Ganti unit di hari sama",
        desc: "Kalau unit bermasalah selama masa sewa, tim kami ganti unit di hari yang sama untuk area Jakarta — penting saat kamu lagi kejar deadline."
      },
      {
        title: "Invoice untuk kantor",
        desc: "Butuh reimburse ke perusahaan? Kami siapkan invoice resmi corporate — cocok untuk kantor Sudirman, Thamrin, dan kawasan industri Pulogadung."
      },
      {
        title: "Bulk 20–50 unit siap",
        desc: "Untuk event & training kantor Jakarta, kami stok unit seragam yang bisa dikirim dalam sehari. Sudah biasa handle event JIExpo, Kemayoran, hingga ICE PIK."
      }
    ],
    contextParagraphs: [
      "Kebutuhan sewa laptop di Jakarta punya karakter khas. Startup di SCBD dan agency di Kebon Jeruk biasanya ambil paket bulanan untuk staff proyek jangka pendek. Mahasiswa UI, Binus, dan UMN paling sering sewa 1–3 bulan menjelang sidang skripsi. Event organizer di Kemayoran dan Ancol butuh puluhan unit seragam untuk registrasi peserta. Techpora sudah melayani ketiganya sejak lama — jadi kami paham unit apa yang cocok untuk skenario kamu.",
      "Untuk kebutuhan pribadi, MacBook Air M1 dan Acer Aspire 5 (i5) adalah dua unit paling laris di Jakarta. MacBook cocok untuk kamu yang sering meeting klien atau kerja mobile — daya tahan baterai 10+ jam. Acer i5 lebih hemat untuk kerja kantor sehari-hari: Word, Excel, Zoom, plus multi-tab Chrome tanpa lag. Kalau budget lebih ketat, ThinkPad dan VivoBook i3 juga sangat cukup untuk skripsi & tugas kuliah.",
      "Untuk kebutuhan kantor & event, kami sediakan bundling laptop + printer (Epson L3210 atau HP Smart Tank) + proyektor (Epson EB-E600 atau EB-X600). Satu invoice, satu koordinator pengiriman. Banyak kantor pusat di Thamrin dan Sudirman yang sudah pakai bundling ini untuk training staff dan audit tahunan — hemat waktu dibanding sewa terpisah dari 3 vendor berbeda."
    ],
    faqs: [
      {
        q: "Berapa harga sewa laptop di Jakarta?",
        a: "Mulai dari Rp100.000/hari untuk Lenovo ThinkPad i3, hingga Rp250.000/hari untuk MacBook Air M1. Paket bulanan jauh lebih hemat: mulai Rp1.500.000/bulan (ThinkPad) sampai Rp4.500.000/bulan (MacBook Air M1). Semua harga sudah termasuk pengecekan unit sebelum kirim."
      },
      {
        q: "Apa saja area Jakarta yang dilayani?",
        a: "Seluruh area Jakarta: Jakarta Selatan (Kemang, SCBD, Pondok Indah, Sudirman), Jakarta Timur (Rawamangun, Cawang, Pulogadung), Jakarta Barat (Grogol, Puri Indah, Kalideres), Jakarta Utara (Kelapa Gading, PIK, Ancol), dan Jakarta Pusat (Thamrin, Menteng, Kemayoran). Basis operasional kami di Rawamangun, jadi Jakarta Timur bisa ambil langsung tanpa ongkir."
      },
      {
        q: "Apakah bisa sewa laptop 1 hari saja di Jakarta?",
        a: "Bisa. Sewa harian populer untuk ujian praktikum kampus, presentasi klien 1 hari, atau event booth. Chat admin dengan detail kebutuhan — unit bisa siap dikirim dalam 1–3 jam untuk area Jakarta."
      },
      {
        q: "Berapa lama pengiriman sampai ke lokasi Jakarta?",
        a: "Estimasi 1–3 jam tergantung jarak dari basis kami di Rawamangun. Jakarta Timur & Pusat biasanya < 2 jam, Jakarta Selatan & Utara 2–3 jam, Jakarta Barat 2–4 jam. Untuk event, pengiriman bisa dijadwalkan H-1 supaya set-up di venue tenang."
      },
      {
        q: "Apakah bisa untuk sewa bulk (banyak unit) untuk event?",
        a: "Ya, kami sudah biasa handle sewa 20–50+ unit untuk event registrasi di JIExpo Kemayoran, ICE BSD, dan Ancol. Unit spek seragam, dikirim antar & jemput oleh tim kami di lokasi acara."
      },
      {
        q: "Bisa invoice untuk klaim kantor?",
        a: "Bisa. Kami siapkan invoice resmi corporate lengkap dengan detail unit, periode sewa, dan pajak — cocok untuk reimburse ke perusahaan. Banyak dipakai kantor pusat di Sudirman-Thamrin."
      },
      {
        q: "Bagaimana kalau unit bermasalah di tengah masa sewa?",
        a: "Kami ganti unit di hari yang sama untuk area Jakarta. Cukup chat admin, tim kami langsung antar unit pengganti dan tarik unit lama. Ini yang bikin kami dipercaya penyewa jangka panjang."
      },
      {
        q: "Apakah tersedia bundling laptop + printer + proyektor?",
        a: "Tersedia. Bundling paling laris: 1 laptop + 1 proyektor untuk presentasi, atau 5 laptop + 1 printer untuk training kantor. Satu invoice, satu koordinator pengiriman — hemat waktu dibanding sewa dari vendor terpisah."
      }
    ]
  },
  rental: {
    term: "rental",
    Term: "Rental",
    title: "Rental Laptop Jakarta — Harian, Mingguan, Bulanan | Techpora",
    h1: "Rental Laptop Jakarta — Techpora",
    intro: "Cari rental laptop di Jakarta dengan pilihan unit lengkap dan pengiriman cepat? Techpora adalah rental laptop Jakarta berbasis di Rawamangun (Jakarta Timur) yang melayani corporate, event organizer, mahasiswa, dan profesional di seluruh DKI Jakarta. Rental harian untuk kebutuhan mendadak, rental mingguan untuk event & training, rental bulanan untuk staff proyek & mahasiswa akhir — semua dengan invoice resmi kalau kamu perlu reimburse ke kantor.",
    metaDescription: "Rental laptop Jakarta harian, mingguan, bulanan. MacBook, ThinkPad, Acer i5. Melayani corporate, event, mahasiswa. Invoice resmi, pengiriman ke seluruh Jakarta.",
    ogTitle: "Rental Laptop Jakarta — Harian, Mingguan, Bulanan | Techpora",
    ogDesc: "Rental laptop Jakarta terpercaya untuk corporate, event, dan mahasiswa. Unit dicek, invoice resmi, pengiriman kilat.",
    keywords: "rental laptop jakarta, rental laptop harian jakarta, rental laptop bulanan jakarta, rental macbook jakarta, rental laptop kantor jakarta, rental laptop event jakarta",
    whyLead: "Kenapa corporate & event organizer Jakarta pilih rental di Techpora?",
    whyPoints: [
      {
        title: "Rental corporate ready",
        desc: "Invoice resmi, PO friendly, bisa termin pembayaran untuk klien perusahaan. Sudah dipakai HRD kantor Sudirman-Thamrin dan agency Kebon Jeruk."
      },
      {
        title: "Rental event 20–50+ unit",
        desc: "Unit spek seragam, antar-jemput di lokasi acara. Sudah biasa handle JIExpo Kemayoran, ICE BSD, dan pameran Ancol."
      },
      {
        title: "Rental training kantor",
        desc: "Paket rental mingguan untuk training internal — laptop + printer + proyektor jadi satu paket. Set-up rapi di ruang training."
      },
      {
        title: "Rental proyek jangka pendek",
        desc: "Sewa 3–6 bulan untuk staff proyek atau konsultan. Lebih hemat daripada beli laptop yang cuma dipakai sebentar."
      },
      {
        title: "Ganti unit di hari yang sama",
        desc: "SLA rental corporate: unit bermasalah diganti hari itu juga untuk area Jakarta. Tidak ada downtime yang mengganggu operasional."
      },
      {
        title: "Kirim ke 5 kota Jakarta",
        desc: "Jakarta Selatan, Timur, Barat, Utara, Pusat — semua dijangkau. Basis di Rawamangun, jadi Jakarta Timur bahkan bisa ambil langsung."
      }
    ],
    contextParagraphs: [
      "Berbeda dari sewa harian personal, rental laptop Jakarta untuk corporate biasanya menuntut lebih: PO, invoice, termin pembayaran, dan SLA penggantian unit. Techpora menyiapkan itu semua sebagai standar — tidak perlu request khusus. Kami sudah rutin menyediakan rental untuk agency di Kebon Jeruk, kantor pusat di Sudirman-Thamrin, dan kawasan industri Pulogadung untuk training staff dan audit tahunan.",
      "Untuk event organizer, tantangan rental laptop di Jakarta biasanya ada di dua hal: unit yang spek-nya seragam (supaya booth registrasi rapi), dan tim yang bisa antar-jemput di lokasi. Techpora punya stok unit ThinkPad & VivoBook yang seragam, plus tim antar-jemput yang sudah familiar dengan venue-venue besar Jakarta seperti JIExpo Kemayoran, Balai Kartini, dan Ancol Beach City. Sekali koordinasi, semua handle.",
      "Untuk profesional dan mahasiswa yang butuh rental jangka panjang, paket bulanan Techpora dirancang lebih hemat dari kalkulasi harian × 30 hari. MacBook Air M1 bulanan populer di kalangan freelancer & konsultan Jaksel yang sering meeting klien. Acer Aspire 5 i5 bulanan paling laris untuk mahasiswa UI, Binus, UMN yang lagi menuju sidang. Semua unit sudah include Office & antivirus siap pakai."
    ],
    faqs: [
      {
        q: "Berapa harga rental laptop di Jakarta?",
        a: "Rental harian mulai Rp100.000 (Lenovo ThinkPad i3) sampai Rp250.000 (MacBook Air M1). Rental bulanan lebih hemat: Rp1.500.000 – Rp4.500.000 tergantung unit. Semua harga include pengecekan unit dan pengiriman ke Jakarta."
      },
      {
        q: "Apakah rental laptop Techpora menerima PO corporate?",
        a: "Ya. Kami terima PO dan siapkan invoice resmi untuk klien perusahaan. Termin pembayaran juga bisa didiskusikan untuk rental jangka menengah–panjang."
      },
      {
        q: "Apakah bisa rental laptop bulk 20+ unit untuk event?",
        a: "Bisa. Kami sudah rutin menyediakan rental 20–50+ laptop untuk event registrasi di JIExpo Kemayoran, ICE BSD, dan pameran Ancol. Antar-jemput ke lokasi acara termasuk dalam paket."
      },
      {
        q: "Berapa lama rental minimum di Techpora?",
        a: "Rental minimum 1 hari. Kalau butuh cuma buat ujian praktikum atau presentasi single-day, chat admin — unit bisa dikirim dalam 1–3 jam untuk area Jakarta."
      },
      {
        q: "Apa saja area Jakarta yang dijangkau?",
        a: "Seluruh DKI Jakarta: Selatan, Timur, Barat, Utara, Pusat. Kami juga melayani Tangerang (BSD, Alam Sutera, Karawaci), Depok, dan Bekasi. Basis di Rawamangun (Jakarta Timur)."
      },
      {
        q: "Bagaimana kalau unit rental bermasalah?",
        a: "SLA kami: unit bermasalah diganti di hari yang sama untuk area Jakarta. Cukup chat admin, tim kami langsung antar unit pengganti dan tarik unit lama. Tidak ada downtime yang mengganggu operasional."
      },
      {
        q: "Bisa rental laptop bundling dengan printer & proyektor?",
        a: "Bisa. Bundling paling laris untuk kantor: 5 laptop + 1 printer Epson L3210 untuk training staff, atau 1 laptop + 1 proyektor Epson EB-X600 untuk presentasi. Satu koordinator, satu invoice."
      },
      {
        q: "Bagaimana cara mulai rental di Techpora?",
        a: "Chat admin via WhatsApp dengan detail kebutuhan (jenis unit, jumlah, durasi, alamat pengiriman). Admin akan konfirmasi ketersediaan, harga, dan estimasi kirim. Setelah pembayaran, unit langsung disiapkan dan dikirim."
      }
    ]
  }
};
function JakartaHub({ variant }) {
  const c2 = COPY[variant];
  const other = variant === "sewa" ? COPY.rental : COPY.sewa;
  const otherPath = variant === "sewa" ? "/rental-laptop-jakarta" : "/sewa-laptop-jakarta";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logoAsset.url, alt: "Techpora.id", className: "h-9 w-auto" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "hidden items-center gap-6 lg:flex text-sm font-medium text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:text-foreground", children: "Beranda" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/blog", className: "hover:text-foreground", children: "Blog" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: waLink(buildWaSimple(void 0, "Jakarta")), target: "_blank", rel: "noopener noreferrer", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "gap-2 rounded-full bg-primary hover:bg-primary/90", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4" }),
        "Chat WhatsApp"
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden border-b border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute -top-24 right-0 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:py-20 lg:px-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3 text-primary" }),
            "Melayani seluruh DKI Jakarta"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl", children: c2.h1 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg", children: c2.intro }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-col gap-3 sm:flex-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: waLink(buildWaSimple(void 0, "Jakarta")), target: "_blank", rel: "noopener noreferrer", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "lg", className: "w-full gap-2 rounded-full bg-primary px-7 hover:bg-primary/90 sm:w-auto", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-5 w-5" }),
              "Cek Ketersediaan Sekarang"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#unit-jakarta", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "lg", variant: "outline", className: "w-full gap-2 rounded-full px-7 sm:w-auto", children: [
              "Lihat harga unit",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-4 w-4 text-primary" }),
              "Kirim 1–3 jam"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4 text-primary" }),
              "Unit dicek sebelum kirim"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4 fill-amber-400 text-amber-400" }),
              "4.9 dari 128+ ulasan"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-b border-border py-14", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl space-y-6 px-4 sm:px-6 lg:px-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-2xl font-bold sm:text-3xl", children: [
          c2.Term,
          " laptop Jakarta untuk siapa saja?"
        ] }),
        c2.contextParagraphs.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base leading-relaxed text-muted-foreground", children: p }, i))
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-secondary/40 border-b border-border py-14", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold sm:text-3xl", children: c2.whyLead }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3", children: c2.whyPoints.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-6 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-4 text-base font-semibold", children: p.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-sm text-muted-foreground", children: p.desc })
        ] }, p.title)) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "unit-jakarta", className: "border-b border-border py-14", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-2xl font-bold sm:text-3xl", children: [
          "Daftar unit & harga ",
          c2.term,
          " Jakarta"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Semua harga sudah termasuk pengecekan unit dan siap pakai. Konfirmasi ketersediaan via WhatsApp." }),
        [
          { label: "Laptop", items: laptops },
          { label: "Printer", items: printers },
          { label: "Proyektor", items: projectors }
        ].map((group) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-bold", children: [
            c2.Term,
            " ",
            group.label,
            " Jakarta"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3", children: group.items.map((u) => {
            const img = getUnitImage(u.name);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "article",
              {
                className: `flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm ${u.featured ? "border-primary/40 ring-1 ring-primary/20" : "border-border"}`,
                children: [
                  img && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-secondary/70 via-secondary/30 to-background p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: img, alt: `${c2.Term} ${u.name} Jakarta`, width: 800, height: 600, loading: "lazy", className: "max-h-full w-auto object-contain drop-shadow-lg" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col p-6", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold uppercase tracking-wider text-primary", children: u.category }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "mt-2 text-lg font-bold", children: u.name }),
                    u.specs && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: u.specs }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-2 border-t border-border pt-4 text-sm", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Harian", value: u.daily }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Mingguan", value: u.weekly }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Bulanan", value: u.monthly, highlight: true })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "a",
                      {
                        href: waLink(buildWaSimple(u.name, "Jakarta")),
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "mt-5",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "w-full gap-2 rounded-full bg-primary hover:bg-primary/90", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4" }),
                          c2.Term,
                          " ",
                          u.name
                        ] })
                      }
                    )
                  ] })
                ]
              },
              u.name
            );
          }) })
        ] }, group.label))
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-b border-border bg-secondary/40 py-14", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-2xl font-bold sm:text-3xl", children: [
          c2.Term,
          " laptop per wilayah Jakarta"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Pilih halaman area untuk detail landmark, ETA pengiriman, dan use case lokal." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: jakartaAreas.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: `/${a.slug}`,
            className: "group rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-base font-semibold text-foreground group-hover:text-primary", children: [
                  c2.Term,
                  " Laptop ",
                  a.area
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-sm leading-relaxed text-muted-foreground", children: [
                a.landmarks.slice(0, 4).join(", "),
                ", dan sekitarnya."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary", children: [
                "Detail area ",
                a.areaShort,
                " →"
              ] })
            ]
          },
          a.slug
        )) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-b border-border py-14", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-4xl px-4 sm:px-6 lg:px-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-2xl font-bold sm:text-3xl", children: [
          "Cara ",
          c2.term,
          " laptop di Techpora Jakarta"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "mt-8 space-y-4", children: [
          { n: 1, t: "Chat admin via WhatsApp", d: "Sebutkan jenis unit, jumlah, durasi, dan alamat pengiriman di Jakarta." },
          { n: 2, t: "Konfirmasi ketersediaan & harga", d: "Admin cek stok real-time dan kirim detail harga + estimasi kirim." },
          { n: 3, t: `Verifikasi data & bayar`, d: "Kirim ID dan bukti pembayaran (transfer / QRIS). Corporate bisa PO." },
          { n: 4, t: "Unit disiapkan & dicek", d: "Kami install Office, antivirus, dan uji fungsi keyboard-layar sebelum kirim." },
          { n: 5, t: "Unit dikirim ke lokasi Jakarta", d: "Estimasi 1–3 jam. Unit sampai, langsung siap pakai — tanpa setup tambahan." }
        ].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-4 rounded-xl border border-border bg-card p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground", children: s.n }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-foreground", children: s.t }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: s.d })
          ] })
        ] }, s.n)) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-b border-border bg-secondary/40 py-14", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl px-4 sm:px-6 lg:px-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-2xl font-bold sm:text-3xl", children: [
          "FAQ ",
          c2.term,
          " laptop Jakarta"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 space-y-4", children: c2.faqs.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { className: "group rounded-xl border border-border bg-card p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("summary", { className: "flex cursor-pointer items-start justify-between gap-4 text-base font-semibold text-foreground", children: [
            f.q,
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-0.5 text-primary transition-transform group-open:rotate-45", children: "+" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm leading-relaxed text-muted-foreground", children: f.a })
        ] }, f.q)) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-b border-border py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "Cari halaman ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: other.term }),
          " laptop Jakarta?"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: otherPath, className: "mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline", children: [
          "Lihat halaman ",
          other.Term,
          " Laptop Jakarta →"
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-14", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3.5 w-3.5" }),
          "Unit ready hari ini"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mt-4 text-3xl font-bold sm:text-4xl", children: [
          "Siap ",
          c2.term,
          " laptop di Jakarta?"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground", children: "Chat admin sekarang — unit siap dikirim ke lokasi kamu hari ini juga." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: waLink(buildWaSimple(void 0, "Jakarta")), target: "_blank", rel: "noopener noreferrer", className: "mt-8 inline-block", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "lg", className: "gap-2 rounded-full bg-primary px-8 hover:bg-primary/90", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-5 w-5" }),
          "Chat WhatsApp Sekarang"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex justify-center gap-6 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "font-medium text-primary hover:underline", children: "← Beranda" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/blog", className: "font-medium text-primary hover:underline", children: "Baca panduan sewa →" })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 py-6 text-center text-xs text-muted-foreground sm:px-6 lg:px-8", children: [
      "Copyright © Techpora.id — ",
      c2.Term,
      " Laptop Jakarta & Sekitarnya"
    ] }) })
  ] });
}
function Row({ label, value, highlight }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: highlight ? "font-bold text-primary" : "font-semibold text-foreground", children: value })
  ] });
}
const jakartaHubCopy = COPY;
const $$splitComponentImporter$6 = () => import("./sewa-laptop-jakarta-B4J8SdFI.mjs");
const SITE_URL$6 = "https://techpora.id";
const PATH$1 = "/sewa-laptop-jakarta";
const c$1 = jakartaHubCopy.sewa;
const Route$9 = createFileRoute("/sewa-laptop-jakarta")({
  head: () => ({
    meta: [{
      title: c$1.title
    }, {
      name: "description",
      content: c$1.metaDescription
    }, {
      name: "keywords",
      content: c$1.keywords
    }, {
      name: "robots",
      content: "index, follow, max-image-preview:large, max-snippet:-1"
    }, {
      property: "og:title",
      content: c$1.ogTitle
    }, {
      property: "og:description",
      content: c$1.ogDesc
    }, {
      property: "og:url",
      content: `${SITE_URL$6}${PATH$1}`
    }, {
      property: "og:type",
      content: "website"
    }, {
      name: "twitter:card",
      content: "summary_large_image"
    }, {
      name: "twitter:title",
      content: c$1.ogTitle
    }, {
      name: "twitter:description",
      content: c$1.ogDesc
    }],
    links: [{
      rel: "canonical",
      href: `${SITE_URL$6}${PATH$1}`
    }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: "Techpora.id — Sewa Laptop Jakarta",
        image: `${SITE_URL$6}/og-image.jpg`,
        url: `${SITE_URL$6}${PATH$1}`,
        telephone: "+62821-7798-4041",
        priceRange: "Rp100.000 - Rp4.500.000",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Jl. R. Mangun Muka Raya, Rawamangun",
          addressLocality: "Jakarta Timur",
          addressRegion: "DKI Jakarta",
          postalCode: "13220",
          addressCountry: "ID"
        },
        areaServed: [{
          "@type": "City",
          name: "Jakarta Selatan"
        }, {
          "@type": "City",
          name: "Jakarta Timur"
        }, {
          "@type": "City",
          name: "Jakarta Barat"
        }, {
          "@type": "City",
          name: "Jakarta Utara"
        }, {
          "@type": "City",
          name: "Jakarta Pusat"
        }],
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          opens: "08:00",
          closes: "21:00"
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "128"
        }
      })
    }, {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [{
          "@type": "ListItem",
          position: 1,
          name: "Beranda",
          item: `${SITE_URL$6}/`
        }, {
          "@type": "ListItem",
          position: 2,
          name: "Sewa Laptop Jakarta",
          item: `${SITE_URL$6}${PATH$1}`
        }]
      })
    }, {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: c$1.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.a
          }
        }))
      })
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const SLUG$1 = "sewa-laptop-depok";
const area$1 = areaBySlug(SLUG$1);
const $$splitComponentImporter$5 = () => import("./sewa-laptop-depok-CA9zwhAa.mjs");
const SITE_URL$5 = "https://techpora.id";
const Route$8 = createFileRoute("/sewa-laptop-depok")({
  head: () => ({
    meta: [{
      title: area$1.title
    }, {
      name: "description",
      content: area$1.metaDescription
    }, {
      name: "keywords",
      content: area$1.keywords
    }, {
      name: "robots",
      content: "index, follow, max-image-preview:large, max-snippet:-1"
    }, {
      property: "og:title",
      content: area$1.title
    }, {
      property: "og:description",
      content: area$1.metaDescription
    }, {
      property: "og:url",
      content: `${SITE_URL$5}/${SLUG$1}`
    }, {
      property: "og:type",
      content: "website"
    }, {
      name: "twitter:card",
      content: "summary_large_image"
    }, {
      name: "twitter:title",
      content: area$1.title
    }, {
      name: "twitter:description",
      content: area$1.metaDescription
    }],
    links: [{
      rel: "canonical",
      href: `${SITE_URL$5}/${SLUG$1}`
    }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        name: area$1.h1,
        serviceType: "Sewa Laptop",
        areaServed: {
          "@type": "Place",
          name: area$1.area
        },
        provider: {
          "@type": "LocalBusiness",
          name: "Techpora.id",
          url: SITE_URL$5,
          telephone: "+62821-7798-4041"
        },
        url: `${SITE_URL$5}/${SLUG$1}`,
        description: area$1.metaDescription
      })
    }, {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [{
          "@type": "ListItem",
          position: 1,
          name: "Beranda",
          item: `${SITE_URL$5}/`
        }, {
          "@type": "ListItem",
          position: 2,
          name: area$1.area,
          item: `${SITE_URL$5}/${SLUG$1}`
        }]
      })
    }]
  }),
  loader: () => {
    if (!areaBySlug(SLUG$1)) throw notFound();
    return null;
  },
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const SLUG = "sewa-laptop-bekasi";
const area = areaBySlug(SLUG);
const $$splitComponentImporter$4 = () => import("./sewa-laptop-bekasi-DKQtFQFP.mjs");
const SITE_URL$4 = "https://techpora.id";
const Route$7 = createFileRoute("/sewa-laptop-bekasi")({
  head: () => ({
    meta: [{
      title: area.title
    }, {
      name: "description",
      content: area.metaDescription
    }, {
      name: "keywords",
      content: area.keywords
    }, {
      name: "robots",
      content: "index, follow, max-image-preview:large, max-snippet:-1"
    }, {
      property: "og:title",
      content: area.title
    }, {
      property: "og:description",
      content: area.metaDescription
    }, {
      property: "og:url",
      content: `${SITE_URL$4}/${SLUG}`
    }, {
      property: "og:type",
      content: "website"
    }, {
      name: "twitter:card",
      content: "summary_large_image"
    }, {
      name: "twitter:title",
      content: area.title
    }, {
      name: "twitter:description",
      content: area.metaDescription
    }],
    links: [{
      rel: "canonical",
      href: `${SITE_URL$4}/${SLUG}`
    }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        name: area.h1,
        serviceType: "Sewa Laptop",
        areaServed: {
          "@type": "Place",
          name: area.area
        },
        provider: {
          "@type": "LocalBusiness",
          name: "Techpora.id",
          url: SITE_URL$4,
          telephone: "+62821-7798-4041"
        },
        url: `${SITE_URL$4}/${SLUG}`,
        description: area.metaDescription
      })
    }, {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [{
          "@type": "ListItem",
          position: 1,
          name: "Beranda",
          item: `${SITE_URL$4}/`
        }, {
          "@type": "ListItem",
          position: 2,
          name: area.area,
          item: `${SITE_URL$4}/${SLUG}`
        }]
      })
    }]
  }),
  loader: () => {
    if (!areaBySlug(SLUG)) throw notFound();
    return null;
  },
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./rental-laptop-jakarta-C4Q0hN90.mjs");
const SITE_URL$3 = "https://techpora.id";
const PATH = "/rental-laptop-jakarta";
const c = jakartaHubCopy.rental;
const Route$6 = createFileRoute("/rental-laptop-jakarta")({
  head: () => ({
    meta: [{
      title: c.title
    }, {
      name: "description",
      content: c.metaDescription
    }, {
      name: "keywords",
      content: c.keywords
    }, {
      name: "robots",
      content: "index, follow, max-image-preview:large, max-snippet:-1"
    }, {
      property: "og:title",
      content: c.ogTitle
    }, {
      property: "og:description",
      content: c.ogDesc
    }, {
      property: "og:url",
      content: `${SITE_URL$3}${PATH}`
    }, {
      property: "og:type",
      content: "website"
    }, {
      name: "twitter:card",
      content: "summary_large_image"
    }, {
      name: "twitter:title",
      content: c.ogTitle
    }, {
      name: "twitter:description",
      content: c.ogDesc
    }],
    links: [{
      rel: "canonical",
      href: `${SITE_URL$3}${PATH}`
    }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: "Techpora.id — Rental Laptop Jakarta",
        image: `${SITE_URL$3}/og-image.jpg`,
        url: `${SITE_URL$3}${PATH}`,
        telephone: "+62821-7798-4041",
        priceRange: "Rp100.000 - Rp4.500.000",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Jl. R. Mangun Muka Raya, Rawamangun",
          addressLocality: "Jakarta Timur",
          addressRegion: "DKI Jakarta",
          postalCode: "13220",
          addressCountry: "ID"
        },
        areaServed: [{
          "@type": "City",
          name: "Jakarta Selatan"
        }, {
          "@type": "City",
          name: "Jakarta Timur"
        }, {
          "@type": "City",
          name: "Jakarta Barat"
        }, {
          "@type": "City",
          name: "Jakarta Utara"
        }, {
          "@type": "City",
          name: "Jakarta Pusat"
        }],
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          opens: "08:00",
          closes: "21:00"
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "128"
        }
      })
    }, {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [{
          "@type": "ListItem",
          position: 1,
          name: "Beranda",
          item: `${SITE_URL$3}/`
        }, {
          "@type": "ListItem",
          position: 2,
          name: "Rental Laptop Jakarta",
          item: `${SITE_URL$3}${PATH}`
        }]
      })
    }, {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: c.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.a
          }
        }))
      })
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const MAPS_URL = "https://maps.app.goo.gl/1bv9kcf5ynWE9VWn9";
const faqData = [{
  q: "Minimal sewa berapa hari?",
  a: "Bisa harian, mingguan, hingga bulanan. Cocok untuk kebutuhan singkat 1 hari hingga proyek jangka panjang."
}, {
  q: "Apakah bisa dikirim?",
  a: "Ya, tersedia layanan pengiriman ke seluruh area Jakarta (Selatan, Timur, Barat, Utara, Pusat) serta Tangerang, Bekasi, dan Depok."
}, {
  q: "Apakah unit sudah siap pakai?",
  a: "Ya, semua laptop, printer, dan proyektor dicek, dibersihkan, dan siap digunakan tanpa instalasi tambahan."
}, {
  q: "Bisa untuk Zoom, meeting, dan event?",
  a: "Ya, cocok untuk Zoom, Google Meet, presentasi, registrasi event, dan kebutuhan kantor."
}, {
  q: "Apakah tersedia sewa proyektor dan printer?",
  a: "Ya, kami menyediakan proyektor ViewSonic & Epson serta printer Epson L3210 dan HP Smart Tank 215."
}, {
  q: "Bingung pilih unit?",
  a: "Admin siap membantu merekomendasikan unit sesuai kebutuhan dan budget."
}, {
  q: "Sewa laptop untuk skripsi, apa rekomendasinya?",
  a: "Untuk skripsi dan sidang, kami rekomendasikan ASUS VivoBook atau Acer Aspire 5 (i5, 8GB, SSD) yang lancar untuk Word, SPSS, Zoom sidang, dan render dokumen. Bisa sewa bulanan agar lebih hemat."
}, {
  q: "Sewa laptop untuk event atau pameran, bisa berapa unit?",
  a: "Kami melayani sewa laptop event dalam jumlah banyak (10–50+ unit) untuk registrasi, booth, training, dan pameran. Semua unit seragam, siap pakai, dan bisa diantar sekaligus dijemput di lokasi acara."
}, {
  q: "Lebih hemat sewa harian atau bulanan?",
  a: "Sewa bulanan jauh lebih hemat jika kebutuhan lebih dari 10 hari. Contoh: ThinkPad harian Rp100rb × 15 hari = Rp1,5jt, sedangkan bulanan hanya Rp1,5jt untuk 30 hari. Untuk kebutuhan singkat 1–3 hari, pilih harian."
}, {
  q: "Apa saja syarat sewa yang harus disiapkan?",
  a: "Wajib: KTP dan screenshot profil Instagram aktif. Pilih 2 dari dokumen pendukung: SIM, NPWP, KK, KTM, ID Card Kerja, atau Paspor. Dokumen jaminan dikembalikan setelah unit kembali dalam kondisi baik."
}, {
  q: "Bagaimana ketentuan pembayaran, keterlambatan & tanggung jawab penyewa?",
  a: "Ketentuan penyewaan lengkap: (1) Booking unit terlebih dahulu. (2) Pembayaran lunas di awal masa sewa. (3) Penyewa bersedia didokumentasikan saat serah terima unit. (4) Penyewa bertanggung jawab atas kerusakan akibat human error selama masa sewa. (5) Kehilangan unit menjadi tanggung jawab penyewa. (6) Masa sewa dihitung 24 jam sejak unit diterima. (7) Keterlambatan pengembalian dikenakan biaya Rp10.000 per jam. (8) Unit tidak boleh dipindahtangankan kepada pihak lain. (9) Jika terdapat kendala penggunaan, wajib mengirimkan video bukti agar tim dapat melakukan pengecekan. (10) Dokumen jaminan dikembalikan setelah unit diterima kembali dalam kondisi baik."
}];
var createSsrRpc = (functionId) => {
  const url2 = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url: url2,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const heroLaptop = "/assets/hero-laptop-pu9eodxm.jpg";
const $$splitComponentImporter$2 = () => import("./index-DSucvX2n.mjs");
const SITE_URL$2 = "https://techpora.id";
const fetchLatestPosts = createServerFn({
  method: "GET"
}).handler(createSsrRpc("4e514227a64adfd70c6acbe448bb1f2487895d140c3ee24e6b8616bd5418f5a3"));
const Route$5 = createFileRoute("/")({
  loader: () => fetchLatestPosts(),
  head: () => ({
    meta: [{
      title: "Techpora.id — Sewa Laptop, Printer & Proyektor Jakarta"
    }, {
      name: "description",
      content: "Sewa laptop, printer & proyektor di Jakarta. Harian, mingguan, bulanan. Unit siap pakai, pengiriman cepat untuk mahasiswa, kantor, dan event."
    }, {
      name: "keywords",
      content: "sewa laptop jakarta, rental laptop jakarta, sewa laptop harian, sewa laptop bulanan, sewa macbook jakarta, sewa printer jakarta, sewa proyektor jakarta, rental laptop event"
    }, {
      name: "robots",
      content: "index, follow, max-image-preview:large, max-snippet:-1"
    }, {
      property: "og:title",
      content: "Techpora.id — Sewa Laptop, Printer & Proyektor Jakarta"
    }, {
      property: "og:description",
      content: "Sewa laptop, printer & proyektor di Jakarta. Harian, mingguan, bulanan. Unit siap pakai, pengiriman cepat untuk mahasiswa, kantor, dan event."
    }, {
      property: "og:url",
      content: `${SITE_URL$2}/`
    }, {
      property: "og:type",
      content: "website"
    }, {
      property: "og:image",
      content: `${SITE_URL$2}/og-image.jpg`
    }, {
      property: "og:image:width",
      content: "1200"
    }, {
      property: "og:image:height",
      content: "630"
    }, {
      name: "twitter:title",
      content: "Techpora.id — Sewa Laptop, Printer & Proyektor Jakarta"
    }, {
      name: "twitter:description",
      content: "Sewa laptop, printer & proyektor di Jakarta. Harian, mingguan, bulanan. Unit siap pakai, pengiriman cepat untuk mahasiswa, kantor, dan event."
    }, {
      name: "twitter:image",
      content: `${SITE_URL$2}/og-image.jpg`
    }],
    links: [{
      rel: "canonical",
      href: `${SITE_URL$2}/`
    }, {
      rel: "preload",
      as: "image",
      href: heroLaptop,
      fetchpriority: "high"
    }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": ["LocalBusiness", "Store"],
        name: "Techpora.id — Sewa Laptop Jakarta",
        description: "Layanan sewa laptop, printer, dan proyektor harian, mingguan, dan bulanan di Jakarta.",
        url: SITE_URL$2,
        telephone: "+62821-7798-4041",
        image: `${SITE_URL$2}/og-image.jpg`,
        address: {
          "@type": "PostalAddress",
          streetAddress: "Jl. R. Mangun Muka Raya",
          addressLocality: "Rawamangun, Pulo Gadung",
          addressRegion: "Jakarta Timur",
          postalCode: "13220",
          addressCountry: "ID"
        },
        areaServed: ["Jakarta Selatan", "Jakarta Timur", "Jakarta Barat", "Jakarta Utara", "Jakarta Pusat", "Tangerang", "Bekasi", "Depok"],
        openingHoursSpecification: [{
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          opens: "08:00",
          closes: "21:00"
        }],
        priceRange: "Rp100.000 - Rp4.500.000",
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "128"
        },
        sameAs: ["https://www.instagram.com/sewalaptopjakarta.co"],
        hasMap: MAPS_URL
      })
    }, {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqData.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.a
          }
        }))
      })
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./blog.index-DG1rucya.mjs");
const fetchBlogList = createServerFn({
  method: "GET"
}).handler(createSsrRpc("5be302f3bf90cd928b18ce8b59c7c73c524cc8600b15f8c158bfcaf36f8197ee"));
const SITE_URL$1 = "https://techpora.id";
const Route$4 = createFileRoute("/blog/")({
  loader: () => fetchBlogList(),
  head: () => ({
    meta: [{
      title: "Blog Techpora.id — Tips & Panduan Sewa Laptop"
    }, {
      name: "description",
      content: "Kumpulan artikel tips, perbandingan, dan panduan sewa laptop untuk mahasiswa, freelancer, event, dan bisnis di Jakarta."
    }, {
      property: "og:title",
      content: "Blog Techpora.id — Tips Sewa Laptop"
    }, {
      property: "og:description",
      content: "30 artikel pilar seputar sewa laptop: tips memilih, panduan event, dan strategi hemat untuk mahasiswa & profesional."
    }, {
      property: "og:url",
      content: `${SITE_URL$1}/blog`
    }, {
      property: "og:type",
      content: "website"
    }, {
      name: "twitter:title",
      content: "Blog Techpora.id"
    }, {
      name: "twitter:description",
      content: "Tips dan panduan sewa laptop di Jakarta."
    }],
    links: [{
      rel: "canonical",
      href: `${SITE_URL$1}/blog`
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const CATEGORY_IMAGES = {
  Mahasiswa: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=70",
  Profesional: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=70",
  Event: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=70",
  Panduan: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=70",
  Lokasi: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=70"
};
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=70";
function coverFor(category) {
  return CATEGORY_IMAGES[category] ?? DEFAULT_IMAGE;
}
const $$splitComponentImporter = () => import("./blog._slug-DKXzxGf4.mjs");
const $$splitErrorComponentImporter = () => import("./blog._slug-DPc5Wdde.mjs");
const $$splitNotFoundComponentImporter = () => import("./blog._slug-CM61SdcK.mjs");
const fetchBlogPostData = createServerFn({
  method: "GET"
}).inputValidator((slug) => slug).handler(createSsrRpc("96175ca94e352df193070640863f1c18b3e336285487f8ff766c50a9aa72a793"));
const SITE_URL = "https://techpora.id";
const Route$3 = createFileRoute("/blog/$slug")({
  loader: async ({
    params
  }) => {
    const result = await fetchBlogPostData({
      data: params.slug
    });
    if (!result) throw notFound();
    return result;
  },
  head: ({
    loaderData
  }) => {
    const post = loaderData?.post;
    if (!post) return {
      meta: [{
        title: "Artikel tidak ditemukan"
      }]
    };
    const url2 = `${SITE_URL}/blog/${post.slug}`;
    const cover = coverFor(post.category);
    return {
      meta: [{
        title: `${post.title} — Techpora.id`
      }, {
        name: "description",
        content: post.description
      }, {
        name: "robots",
        content: "index, follow, max-image-preview:large, max-snippet:-1"
      }, {
        property: "og:title",
        content: post.title
      }, {
        property: "og:description",
        content: post.description
      }, {
        property: "og:url",
        content: url2
      }, {
        property: "og:type",
        content: "article"
      }, {
        property: "og:image",
        content: cover
      }, {
        name: "twitter:card",
        content: "summary_large_image"
      }, {
        name: "twitter:title",
        content: post.title
      }, {
        name: "twitter:description",
        content: post.description
      }, {
        name: "twitter:image",
        content: cover
      }],
      links: [{
        rel: "canonical",
        href: url2
      }],
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          image: cover,
          author: {
            "@type": "Organization",
            name: "Techpora.id"
          },
          publisher: {
            "@type": "Organization",
            name: "Techpora.id",
            url: SITE_URL
          },
          mainEntityOfPage: url2
        })
      }, {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [{
            "@type": "ListItem",
            position: 1,
            name: "Beranda",
            item: `${SITE_URL}/`
          }, {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: `${SITE_URL}/blog`
          }, {
            "@type": "ListItem",
            position: 3,
            name: post.title,
            item: url2
          }]
        })
      }]
    };
  },
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const BASE_URL$2 = "https://techpora.id";
const SITEMAP_URL = `${BASE_URL$2}/sitemap.xml`;
const INDEXNOW_KEY$2 = "2142cfecfef4a3d20adbb5417c86ff96";
const Route$2 = createFileRoute("/api/public/ping-sitemap")({
  server: {
    handlers: {
      GET: async () => {
        const results = {};
        const ping = async (name, url2, init) => {
          try {
            const r = await fetch(url2, init);
            const body = await r.text().catch(() => "");
            results[name] = { status: r.status, ok: r.ok, body: body.slice(0, 200) };
          } catch (e) {
            results[name] = { status: 0, ok: false, body: String(e).slice(0, 200) };
          }
        };
        await Promise.all([
          ping("bing", `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`),
          ping(
            "indexnow_sitemap",
            `https://api.indexnow.org/indexnow?url=${encodeURIComponent(SITEMAP_URL)}&key=${INDEXNOW_KEY$2}`
          )
        ]);
        return Response.json(
          { sitemap: SITEMAP_URL, results, ts: (/* @__PURE__ */ new Date()).toISOString() },
          { headers: { "Cache-Control": "no-store" } }
        );
      }
    }
  }
});
const HOST$1 = "techpora.id";
const BASE_URL$1 = `https://${HOST$1}`;
const INDEXNOW_KEY$1 = "2142cfecfef4a3d20adbb5417c86ff96";
const KEY_LOCATION$1 = `${BASE_URL$1}/${INDEXNOW_KEY$1}.txt`;
const STATIC_PATHS = [
  "/",
  "/blog",
  "/sewa-laptop-jakarta",
  "/sewa-laptop-jakarta-selatan",
  "/sewa-laptop-jakarta-barat",
  "/sewa-laptop-jakarta-timur",
  "/sewa-laptop-jakarta-utara",
  "/sewa-laptop-jakarta-pusat",
  "/sewa-laptop-bekasi",
  "/sewa-laptop-depok",
  "/sewa-laptop-tangerang",
  "/sewa-macbook",
  "/rental-laptop-jakarta"
];
const Route$1 = createFileRoute("/api/public/indexnow-all")({
  server: {
    handlers: {
      GET: async () => {
        const blogSlugs = [
          ...posts.map((p) => p.slug),
          ...generatedPosts.map((p) => p.slug)
        ];
        const unique = Array.from(new Set(blogSlugs));
        const urls = [
          ...STATIC_PATHS.map((p) => `${BASE_URL$1}${p}`),
          ...unique.map((s) => `${BASE_URL$1}/blog/${s}`)
        ].slice(0, 1e4);
        const r = await fetch("https://api.indexnow.org/indexnow", {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body: JSON.stringify({
            host: HOST$1,
            key: INDEXNOW_KEY$1,
            keyLocation: KEY_LOCATION$1,
            urlList: urls
          })
        });
        const text = await r.text().catch(() => "");
        return Response.json(
          { submitted: urls.length, status: r.status, ok: r.ok, response: text.slice(0, 500) },
          { headers: { "Cache-Control": "no-store" } }
        );
      }
    }
  }
});
const HOST = "techpora.id";
const BASE_URL = `https://${HOST}`;
const INDEXNOW_KEY = "2142cfecfef4a3d20adbb5417c86ff96";
const KEY_LOCATION = `${BASE_URL}/${INDEXNOW_KEY}.txt`;
const Route = createFileRoute("/api/public/indexnow")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "invalid json" }, { status: 400 });
        }
        const raw = body?.urls;
        if (!Array.isArray(raw) || raw.length === 0) {
          return Response.json({ error: "urls[] required" }, { status: 400 });
        }
        const urls = raw.filter((u) => typeof u === "string").map((u) => u.startsWith("http") ? u : `${BASE_URL}${u.startsWith("/") ? u : `/${u}`}`).filter((u) => {
          try {
            return new URL(u).hostname === HOST;
          } catch {
            return false;
          }
        }).slice(0, 1e4);
        if (urls.length === 0) {
          return Response.json({ error: "no valid urls for host" }, { status: 400 });
        }
        const payload = {
          host: HOST,
          key: INDEXNOW_KEY,
          keyLocation: KEY_LOCATION,
          urlList: urls
        };
        const r = await fetch("https://api.indexnow.org/indexnow", {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body: JSON.stringify(payload)
        });
        const text = await r.text().catch(() => "");
        return Response.json(
          { submitted: urls.length, status: r.status, ok: r.ok, response: text.slice(0, 500) },
          { headers: { "Cache-Control": "no-store" } }
        );
      }
    }
  }
});
const SitemapDotxmlRoute = Route$h.update({
  id: "/sitemap.xml",
  path: "/sitemap.xml",
  getParentRoute: () => Route$i
});
const SewaMacbookRoute = Route$g.update({
  id: "/sewa-macbook",
  path: "/sewa-macbook",
  getParentRoute: () => Route$i
});
const SewaLaptopTangerangRoute = Route$f.update({
  id: "/sewa-laptop-tangerang",
  path: "/sewa-laptop-tangerang",
  getParentRoute: () => Route$i
});
const SewaLaptopJakartaUtaraRoute = Route$e.update({
  id: "/sewa-laptop-jakarta-utara",
  path: "/sewa-laptop-jakarta-utara",
  getParentRoute: () => Route$i
});
const SewaLaptopJakartaTimurRoute = Route$d.update({
  id: "/sewa-laptop-jakarta-timur",
  path: "/sewa-laptop-jakarta-timur",
  getParentRoute: () => Route$i
});
const SewaLaptopJakartaSelatanRoute = Route$c.update({
  id: "/sewa-laptop-jakarta-selatan",
  path: "/sewa-laptop-jakarta-selatan",
  getParentRoute: () => Route$i
});
const SewaLaptopJakartaPusatRoute = Route$b.update({
  id: "/sewa-laptop-jakarta-pusat",
  path: "/sewa-laptop-jakarta-pusat",
  getParentRoute: () => Route$i
});
const SewaLaptopJakartaBaratRoute = Route$a.update({
  id: "/sewa-laptop-jakarta-barat",
  path: "/sewa-laptop-jakarta-barat",
  getParentRoute: () => Route$i
});
const SewaLaptopJakartaRoute = Route$9.update({
  id: "/sewa-laptop-jakarta",
  path: "/sewa-laptop-jakarta",
  getParentRoute: () => Route$i
});
const SewaLaptopDepokRoute = Route$8.update({
  id: "/sewa-laptop-depok",
  path: "/sewa-laptop-depok",
  getParentRoute: () => Route$i
});
const SewaLaptopBekasiRoute = Route$7.update({
  id: "/sewa-laptop-bekasi",
  path: "/sewa-laptop-bekasi",
  getParentRoute: () => Route$i
});
const RentalLaptopJakartaRoute = Route$6.update({
  id: "/rental-laptop-jakarta",
  path: "/rental-laptop-jakarta",
  getParentRoute: () => Route$i
});
const IndexRoute = Route$5.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$i
});
const BlogIndexRoute = Route$4.update({
  id: "/blog/",
  path: "/blog/",
  getParentRoute: () => Route$i
});
const BlogSlugRoute = Route$3.update({
  id: "/blog/$slug",
  path: "/blog/$slug",
  getParentRoute: () => Route$i
});
const ApiPublicPingSitemapRoute = Route$2.update({
  id: "/api/public/ping-sitemap",
  path: "/api/public/ping-sitemap",
  getParentRoute: () => Route$i
});
const ApiPublicIndexnowAllRoute = Route$1.update({
  id: "/api/public/indexnow-all",
  path: "/api/public/indexnow-all",
  getParentRoute: () => Route$i
});
const ApiPublicIndexnowRoute = Route.update({
  id: "/api/public/indexnow",
  path: "/api/public/indexnow",
  getParentRoute: () => Route$i
});
const rootRouteChildren = {
  IndexRoute,
  RentalLaptopJakartaRoute,
  SewaLaptopBekasiRoute,
  SewaLaptopDepokRoute,
  SewaLaptopJakartaRoute,
  SewaLaptopJakartaBaratRoute,
  SewaLaptopJakartaPusatRoute,
  SewaLaptopJakartaSelatanRoute,
  SewaLaptopJakartaTimurRoute,
  SewaLaptopJakartaUtaraRoute,
  SewaLaptopTangerangRoute,
  SewaMacbookRoute,
  SitemapDotxmlRoute,
  BlogSlugRoute,
  BlogIndexRoute,
  ApiPublicIndexnowRoute,
  ApiPublicIndexnowAllRoute,
  ApiPublicPingSitemapRoute
};
const routeTree = Route$i._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Button as B,
  JakartaHub as J,
  MAPS_URL as M,
  Route$5 as R,
  area$7 as a,
  buildWaSimple as b,
  area$6 as c,
  area$5 as d,
  area$4 as e,
  faqs as f,
  area$3 as g,
  area$2 as h,
  area$1 as i,
  area as j,
  getUnitImage as k,
  logoAsset as l,
  cn as m,
  heroLaptop as n,
  faqData as o,
  Route$4 as p,
  Route$3 as q,
  coverFor as r,
  router as s,
  waLink as w
};
