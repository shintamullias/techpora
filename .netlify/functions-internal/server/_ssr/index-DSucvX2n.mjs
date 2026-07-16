import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { R as Route$5, l as logoAsset, B as Button, n as heroLaptop, k as getUnitImage, o as faqData, M as MAPS_URL, m as cn } from "./router-BJ07QcjX.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { D as Dialog$1, a as DialogPortal$1, b as DialogContent$1, c as DialogClose, d as DialogTitle$1, e as DialogDescription$1, f as DialogOverlay$1 } from "../_libs/radix-ui__react-dialog.mjs";
import { R as Root } from "../_libs/radix-ui__react-label.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { R as RadioGroup$1, a as RadioGroupItem$1, b as RadioGroupIndicator } from "../_libs/radix-ui__react-radio-group.mjs";
import "../_libs/seroval.mjs";
import { M as MessageCircle, X, g as Menu, A as ArrowRight, h as Phone, b as Star, S as ShieldCheck, e as Check, Z as Zap, T as Truck, f as Clock, L as Laptop, i as Printer, j as Projector, a as MapPin, k as ChevronDown, I as Instagram, l as Circle } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./blog-C_p4h1ZY.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "./server-CZa_a97V.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
const Dialog = Dialog$1;
const DialogPortal = DialogPortal$1;
const DialogOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  DialogOverlay$1,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = DialogOverlay$1.displayName;
const DialogContent = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent$1,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogClose, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = DialogContent$1.displayName;
const DialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className), ...props });
DialogHeader.displayName = "DialogHeader";
const DialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
    ...props
  }
);
DialogFooter.displayName = "DialogFooter";
const DialogTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  DialogTitle$1,
  {
    ref,
    className: cn("text-lg font-semibold leading-none tracking-tight", className),
    ...props
  }
));
DialogTitle.displayName = DialogTitle$1.displayName;
const DialogDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  DialogDescription$1,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = DialogDescription$1.displayName;
const Input = reactExports.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
const Label = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { ref, className: cn(labelVariants(), className), ...props }));
Label.displayName = Root.displayName;
const Textarea = reactExports.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "textarea",
      {
        className: cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Textarea.displayName = "Textarea";
const RadioGroup = reactExports.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(RadioGroup$1, { className: cn("grid gap-2", className), ...props, ref });
});
RadioGroup.displayName = RadioGroup$1.displayName;
const RadioGroupItem = reactExports.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    RadioGroupItem$1,
    {
      ref,
      className: cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(RadioGroupIndicator, { className: "flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "h-3.5 w-3.5 fill-primary" }) })
    }
  );
});
RadioGroupItem.displayName = RadioGroupItem$1.displayName;
const WA_NUMBER = "6282177984041";
const PHONE = "0821-7798-4041";
const MAPS_REVIEWS_URL = "https://maps.app.goo.gl/eGnQSXjp4SkUSdSE9";
const MAPS_EMBED = "https://www.google.com/maps?q=SEWA+LAPTOP+JAKARTA+Jl.+R.Mangun+Muka+Raya+Rawamangun+Jakarta+Timur&output=embed";
const ADDRESS = "Jl. R. Mangun Muka Raya, Rawamangun, Kec. Pulo Gadung, Jakarta Timur 13220";
const products = [{
  name: "Lenovo ThinkPad",
  category: "Laptop",
  specs: "i3 · 8GB · SSD 256GB",
  daily: "Rp100.000",
  weekly: "Rp650.000",
  monthly: "Rp1.500.000"
}, {
  name: "ASUS VivoBook",
  category: "Laptop",
  specs: "i3 · 8GB · SSD 256GB",
  daily: "Rp135.000",
  weekly: "Rp850.000",
  monthly: "Rp2.000.000"
}, {
  name: "RedmiBook 15",
  category: "Laptop",
  specs: "i3 · 8GB · SSD 256GB",
  daily: "Rp135.000",
  weekly: "Rp850.000",
  monthly: "Rp2.000.000"
}, {
  name: "Acer Aspire 5",
  category: "Laptop",
  specs: "i5 · 8GB · SSD 256GB",
  daily: "Rp175.000",
  weekly: "Rp1.100.000",
  monthly: "Rp3.000.000"
}, {
  name: "MacBook Air M1",
  category: "Laptop",
  specs: "M1 · 8GB · SSD 256GB",
  daily: "Rp250.000",
  weekly: "Rp1.500.000",
  monthly: "Rp4.500.000",
  featured: true
}, {
  name: "Epson L3210",
  category: "Printer",
  specs: "Print · Scan · Copy",
  daily: "Rp100.000",
  weekly: "Rp500.000",
  monthly: "Rp1.500.000"
}, {
  name: "HP Smart Tank 215",
  category: "Printer",
  specs: "Print · Scan · Copy",
  daily: "Rp125.000",
  weekly: "Rp650.000",
  monthly: "Rp2.000.000"
}, {
  name: "ViewSonic SP3",
  category: "Proyektor",
  specs: "Portable · HD",
  daily: "Rp150.000",
  weekly: "Rp850.000",
  monthly: "Rp2.500.000"
}, {
  name: "Epson EB-E600",
  category: "Proyektor",
  specs: "3LCD · 3500 Lumens",
  daily: "Rp200.000",
  weekly: "Rp1.200.000",
  monthly: "Rp3.500.000"
}, {
  name: "Epson EB-X600",
  category: "Proyektor",
  specs: "3LCD · XGA · 3700 Lumens",
  daily: "Rp225.000",
  weekly: "Rp1.350.000",
  monthly: "Rp4.000.000",
  featured: true
}];
const reviews = [{
  name: "Rangga A.",
  role: "Mahasiswa UI",
  rating: 5,
  text: "Proses sewa cepat banget, laptop bersih dan siap pakai untuk sidang skripsi. Admin ramah!"
}, {
  name: "Sinta P.",
  role: "Event Organizer",
  rating: 5,
  text: "Sewa 20 laptop untuk event registrasi, semua unit lancar tanpa kendala. Recommended!"
}, {
  name: "Budi H.",
  role: "Freelancer",
  rating: 5,
  text: "Harga bersaing, MacBook-nya kondisi prima. Sudah langganan sewa di sini."
}, {
  name: "Dewi K.",
  role: "Karyawan Swasta",
  rating: 5,
  text: "Proyektor untuk meeting kantor jernih banget. Pengiriman tepat waktu ke Jakarta Pusat."
}, {
  name: "Aditya R.",
  role: "Trainer",
  rating: 5,
  text: "Printer Epson L3210-nya joss, hasil cetak training peserta lancar 2 hari penuh."
}, {
  name: "Maria L.",
  role: "Content Creator",
  rating: 5,
  text: "Suka karena unit datang sesuai jadwal dan admin fast response. Pasti sewa lagi."
}];
const areaLayanan = [{
  area: "Jakarta Selatan",
  slug: "sewa-laptop-jakarta-selatan",
  desc: "Kemang, Senayan, Pondok Indah, Cilandak, TB Simatupang — pengiriman cepat untuk kantor & event."
}, {
  area: "Jakarta Timur",
  slug: "sewa-laptop-jakarta-timur",
  desc: "Rawamangun, Cawang, Cakung, Pulogadung — area basis operasional, ambil sendiri paling praktis."
}, {
  area: "Jakarta Barat",
  slug: "sewa-laptop-jakarta-barat",
  desc: "Grogol, Kebon Jeruk, Puri Indah, Kalideres — sewa laptop harian & bulanan untuk mahasiswa & startup."
}, {
  area: "Jakarta Utara",
  slug: "sewa-laptop-jakarta-utara",
  desc: "Kelapa Gading, Sunter, Ancol, PIK — cocok untuk event MICE dan pameran di kawasan bisnis Utara."
}, {
  area: "Jakarta Pusat",
  slug: "sewa-laptop-jakarta-pusat",
  desc: "Sudirman, Thamrin, Menteng, Kemayoran — pengiriman ke perkantoran & venue seminar."
}, {
  area: "Tangerang",
  slug: "sewa-laptop-tangerang",
  desc: "BSD, Alam Sutera, Karawaci, Gading Serpong — sewa laptop event dan kantor tersedia."
}, {
  area: "Bekasi",
  slug: "sewa-laptop-bekasi",
  desc: "Bekasi Kota, Summarecon, Harapan Indah — antar unit untuk training & kebutuhan bulanan."
}, {
  area: "Depok",
  slug: "sewa-laptop-depok",
  desc: "Margonda, UI, Cinere — favorit mahasiswa untuk sewa laptop skripsi dan tugas kuliah."
}];
const comparison = [{
  title: "Garansi Unit",
  us: "Semua unit dicek & bergaransi selama masa sewa",
  them: "Sering apa adanya, tanpa jaminan performa"
}, {
  title: "Gratis Ongkir",
  us: "Gratis ongkir area Jakarta (min. sewa mingguan)",
  them: "Ongkir ditanggung penyewa"
}, {
  title: "Respon WhatsApp",
  us: "Fast response, admin siap bantu tiap hari",
  them: "Balas lambat, sulit dihubungi weekend"
}, {
  title: "Unit Ready Pakai",
  us: "Sudah terinstal, dibersihkan, siap pakai",
  them: "Belum siap, perlu setup ulang"
}, {
  title: "Pilihan Unit",
  us: "Laptop, Printer & Proyektor lengkap",
  them: "Terbatas hanya laptop"
}];
const navLinks = [{
  href: "#beranda",
  label: "Beranda"
}, {
  href: "#laptop",
  label: "Laptop"
}, {
  href: "#printer",
  label: "Printer"
}, {
  href: "#proyektor",
  label: "Proyektor"
}, {
  href: "#kenapa-kami",
  label: "Kenapa Kami"
}, {
  href: "#area",
  label: "Area"
}, {
  href: "#review",
  label: "Review"
}, {
  href: "/blog",
  label: "Blog"
}, {
  href: "#lokasi",
  label: "Lokasi"
}];
const steps = [{
  n: "01",
  title: "Pilih Unit",
  desc: "Tentukan unit sesuai kebutuhan & budget."
}, {
  n: "02",
  title: "Hubungi Admin",
  desc: "Isi form cek ketersediaan via WhatsApp."
}, {
  n: "03",
  title: "Verifikasi Data",
  desc: "Kirim dokumen sesuai syarat sewa."
}, {
  n: "04",
  title: "Pembayaran",
  desc: "Lunas di awal masa sewa."
}, {
  n: "05",
  title: "Unit Dikirim",
  desc: "Unit sampai, siap pakai."
}];
const emptyBooking = {
  unit: "",
  qty: "1",
  start: "",
  end: "",
  purpose: "",
  pickup: "Ambil sendiri",
  address: ""
};
function buildWaText(b) {
  const lines = ["Halo Techpora, saya ingin cek ketersediaan unit:", "", `• Unit yang ingin disewa: ${b.unit || "-"}`, `• Jumlah unit: ${b.qty || "-"}`, `• Tanggal & jam mulai: ${b.start || "-"}`, `• Tanggal & jam selesai: ${b.end || "-"}`, `• Kebutuhan penggunaan: ${b.purpose || "-"}`, `• Pengambilan: ${b.pickup}`];
  if (b.pickup === "Diantar") lines.push(`• Alamat: ${b.address || "-"}`);
  lines.push("", "Saya lihat dari techpora.id.", "Terima kasih 🙏");
  return lines.join("\n");
}
function Index() {
  const posts = Route$5.useLoaderData();
  const [menuOpen, setMenuOpen] = reactExports.useState(false);
  const [openFaq, setOpenFaq] = reactExports.useState(0);
  const [bookingOpen, setBookingOpen] = reactExports.useState(false);
  const [booking, setBooking] = reactExports.useState(emptyBooking);
  const openBooking = (preselectUnit) => {
    setBooking({
      ...emptyBooking,
      unit: preselectUnit ?? ""
    });
    setBookingOpen(true);
  };
  const submitBooking = (e) => {
    e.preventDefault();
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(buildWaText(booking))}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setBookingOpen(false);
  };
  const cats = [{
    id: "laptop",
    label: "Laptop",
    icon: Laptop
  }, {
    id: "printer",
    label: "Printer",
    icon: Printer
  }, {
    id: "proyektor",
    label: "Proyektor",
    icon: Projector
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#beranda", className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logoAsset.url, alt: "Techpora.id", className: "h-9 w-auto" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "hidden items-center gap-7 lg:flex", children: navLinks.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: l.href, className: "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground", children: l.label }, l.href)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden lg:block", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => openBooking(), className: "gap-2 rounded-full bg-primary hover:bg-primary/90", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4" }),
          "Chat WhatsApp"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground", onClick: () => setMenuOpen((v) => !v), "aria-label": "Toggle menu", children: menuOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-5 w-5" }) })
      ] }),
      menuOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border bg-background lg:hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4", children: [
        navLinks.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: l.href, onClick: () => setMenuOpen(false), className: "rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary", children: l.label }, l.href)),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => {
          setMenuOpen(false);
          openBooking();
        }, className: "mt-2 w-full gap-2 rounded-full bg-primary hover:bg-primary/90", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4" }),
          "Chat WhatsApp"
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "beranda", className: "relative overflow-hidden bg-ink text-white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute -top-40 right-[-10%] h-[560px] w-[560px] rounded-full bg-sky/30 blur-3xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute -bottom-52 -left-24 h-[460px] w-[460px] rounded-full bg-primary/50 blur-3xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "aria-hidden": true, className: "pointer-events-none absolute inset-0 opacity-[0.12]", style: {
          backgroundImage: "linear-gradient(to right, rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.4) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse at 50% 20%, black 30%, transparent 75%)"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-10 lg:py-28 lg:px-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block h-1.5 w-1.5 rounded-full bg-sky" }),
              "Sewa Laptop, Printer & Proyektor Jakarta"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-6 font-serif text-5xl leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl", children: [
              "Sewa Laptop Jakarta",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block italic text-gradient-sky", children: "— Techpora" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 text-lg font-medium text-white/90", children: "Laptop, Printer & Proyektor siap pakai. Harian, mingguan, bulanan." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg", children: "Unit siap pakai untuk mahasiswa, freelancer, kantor, event, seminar, dan kebutuhan harian — pengiriman cepat area Jakarta." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-col gap-3 sm:flex-row sm:items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => openBooking(), size: "lg", className: "w-full gap-2 rounded-full bg-white px-7 text-ink hover:bg-white/90 sm:w-auto", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-5 w-5" }),
                "Cek Ketersediaan"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#laptop", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "lg", variant: "outline", className: "w-full gap-2 rounded-full border-white/25 bg-white/5 px-7 text-white hover:bg-white/10 hover:text-white sm:w-auto", children: [
                "Lihat Unit",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex items-center gap-8 border-t border-white/10 pt-6 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4 text-sky" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-white/50", children: "Hubungi Kami" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `tel:${PHONE.replace(/-/g, "")}`, className: "font-semibold text-white", children: PHONE })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:block", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-amber-300", children: [
                  Array.from({
                    length: 5
                  }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4 fill-amber-300" }, i)),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1.5 font-semibold text-white", children: "4.9" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-white/50", children: "128+ ulasan Google" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-sky/25 via-white/5 to-transparent blur-2xl" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/[0.06] p-6 backdrop-blur-xl sm:p-10", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-6 top-6 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/90 backdrop-blur", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" }),
                "Available now"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: heroLaptop, alt: "Sewa laptop premium siap pakai Techpora Jakarta", width: 1024, height: 1024, fetchPriority: "high", decoding: "async", className: "mx-auto h-auto w-full max-w-md drop-shadow-[0_30px_60px_rgba(123,179,255,0.25)]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-6 text-white", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] uppercase tracking-wider text-white/50", children: "Mulai dari" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 font-serif text-2xl", children: [
                    "Rp100rb",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-sans text-white/60", children: "/hari" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] uppercase tracking-wider text-white/50", children: "Unit" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-serif text-2xl", children: "10+" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] uppercase tracking-wider text-white/50", children: "Area" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-serif text-2xl", children: "8 Kota" })
                ] })
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "kenapa-kami", className: "relative bg-background py-20 sm:py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold uppercase tracking-[0.2em] text-primary", children: "Kenapa Techpora" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mt-3 font-serif text-4xl leading-tight sm:text-5xl", children: [
            "Sewa tanpa ribet, ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "italic text-primary", children: "dijamin nyaman" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-base text-muted-foreground", children: "Standar layanan premium untuk kebutuhan harian, event, dan proyek jangka panjang." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-14 grid gap-4 sm:grid-cols-6 sm:gap-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-3xl bg-ink p-8 text-white shadow-[0_30px_80px_-30px_rgba(15,36,71,0.6)] sm:col-span-4 sm:row-span-2 sm:p-10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-sky/30 blur-3xl" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-primary/40 blur-3xl" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-sky", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-6 w-6" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "mt-6 font-serif text-3xl leading-tight sm:text-4xl", children: [
                "Unit dicek, dibersihkan, ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "italic text-sky", children: "siap pakai" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 max-w-md text-white/70", children: "Semua laptop, printer, dan proyektor melewati QC internal sebelum dikirim. Tidak perlu setup, tinggal colok dan pakai." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 grid grid-cols-2 gap-4 text-sm", children: ["OS terupdate", "Baterai prima", "Sudah terinstal", "Bergaransi masa sewa"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-white/85", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-sky" }),
                t
              ] }, t)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-border bg-card p-6 shadow-sm sm:col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-5 font-serif text-2xl text-foreground", children: "Fast response" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-sm leading-relaxed text-muted-foreground", children: "Admin balas WhatsApp dalam menit, 7 hari seminggu." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-border bg-card p-6 shadow-sm sm:col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-5 font-serif text-2xl text-foreground", children: "Pengiriman cepat" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-sm leading-relaxed text-muted-foreground", children: "Antar area Jakarta, Tangerang, Bekasi, Depok. Gratis ongkir min. sewa mingguan." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background p-6 sm:col-span-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 text-amber-500", children: Array.from({
              length: 5
            }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-5 w-5 fill-amber-400 text-amber-400" }, i)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-baseline gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-5xl text-foreground", children: "4.9" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "/ 5 · 128+ ulasan" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Rating konsisten dari mahasiswa, freelancer & korporat." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-border bg-card p-6 shadow-sm sm:col-span-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-5 font-serif text-2xl text-foreground", children: "Harian · Mingguan · Bulanan" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-sm leading-relaxed text-muted-foreground", children: "Fleksibel dari 1 hari sampai proyek berbulan-bulan — harga makin hemat untuk sewa panjang." })
          ] })
        ] })
      ] }) }),
      cats.map((cat) => {
        const items = products.filter((p) => p.category === cat.label);
        return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: cat.id, className: "py-16 sm:py-24 even:bg-secondary/30 even:border-y even:border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(cat.icon, { className: "h-4 w-4" }),
                "Sewa ",
                cat.label
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mt-3 text-3xl font-bold tracking-tight sm:text-4xl", children: [
                cat.label === "Laptop" && "Pilih laptop sesuai kebutuhanmu",
                cat.label === "Printer" && "Printer siap cetak untuk kantor & event",
                cat.label === "Proyektor" && "Proyektor terang untuk meeting & seminar"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Semua unit dicek & siap pakai sebelum dikirim." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3", children: items.map((u) => {
            const img = getUnitImage(u.name);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: `relative flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl ${u.featured ? "border-primary/40 ring-1 ring-primary/20" : "border-border"}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gradient-to-br from-secondary/70 via-secondary/30 to-background p-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-background/80 px-2.5 py-1 text-[11px] font-semibold text-primary shadow-sm backdrop-blur", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(cat.icon, { className: "h-3.5 w-3.5" }),
                  u.category
                ] }),
                img ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: img, alt: `${u.name} — sewa ${u.category.toLowerCase()} Techpora`, width: 800, height: 600, loading: "lazy", className: "max-h-full w-auto object-contain drop-shadow-lg transition-transform duration-300 group-hover:scale-105" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(cat.icon, { className: "h-16 w-16 text-primary/40" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col p-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" }),
                    "Available"
                  ] }),
                  u.featured && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary", children: "Premium" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-4 text-xl font-bold text-foreground", children: u.name }),
                u.specs && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: u.specs }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 space-y-2 border-t border-border pt-4 text-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Harian", value: u.daily }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Mingguan", value: u.weekly }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Bulanan", value: u.monthly, highlight: true })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => openBooking(u.name), className: "mt-6 w-full gap-2 rounded-full bg-primary hover:bg-primary/90", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4" }),
                  "Cek Ketersediaan"
                ] })
              ] })
            ] }, u.name);
          }) })
        ] }) }, cat.id);
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "review", className: "border-y border-border bg-secondary/40 py-16 sm:py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold uppercase tracking-wider text-primary", children: "Review Pelanggan" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 text-3xl font-bold tracking-tight sm:text-4xl", children: "Dipercaya ratusan pelanggan" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center justify-center gap-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex", children: Array.from({
              length: 5
            }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4 fill-amber-400 text-amber-400" }, i)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: "4.9" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "dari 128+ ulasan" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3", children: reviews.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("figure", { className: "rounded-2xl border border-border bg-card p-6 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex", children: Array.from({
            length: r.rating
          }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4 fill-amber-400 text-amber-400" }, i)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("blockquote", { className: "mt-4 text-sm leading-relaxed text-foreground", children: [
            '"',
            r.text,
            '"'
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("figcaption", { className: "mt-4 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-foreground", children: r.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: r.role })
          ] })
        ] }, r.name)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: MAPS_REVIEWS_URL, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-secondary", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4 fill-amber-400 text-amber-400" }),
          "Lihat semua review di Google Maps",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "cara", className: "py-16 sm:py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold uppercase tracking-wider text-primary", children: "Cara Sewa" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 text-3xl font-bold tracking-tight sm:text-4xl", children: "5 langkah, unit sampai" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5", children: steps.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-6 shadow-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold text-primary/30", children: s.n }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-3 text-base font-semibold text-foreground", children: s.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-sm leading-relaxed text-muted-foreground", children: s.desc })
          ] }),
          i < steps.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-full top-1/2 hidden h-px w-5 -translate-y-1/2 bg-border lg:block" })
        ] }, s.n)) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "kenapa-kami", className: "border-y border-border bg-secondary/40 py-16 sm:py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold uppercase tracking-wider text-primary", children: "Kenapa Pilih Techpora" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 text-3xl font-bold tracking-tight sm:text-4xl", children: "Bandingkan sebelum kamu sewa" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground", children: "Beda Techpora dibanding rental laptop lain — value nyata untuk kamu." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12 overflow-hidden rounded-2xl border border-border bg-card shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-0 border-b border-border bg-secondary/60 text-sm font-semibold", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-4 sm:px-6", children: "Aspek" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-4 sm:px-6 text-primary", children: "Techpora" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-4 sm:px-6 text-muted-foreground", children: "Rental Lain" })
          ] }),
          comparison.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `grid grid-cols-3 gap-0 text-sm ${i !== comparison.length - 1 ? "border-b border-border" : ""}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-4 font-semibold text-foreground sm:px-6", children: c.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 px-4 py-4 text-foreground sm:px-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "mt-0.5 h-4 w-4 flex-shrink-0 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: c.us })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-4 text-muted-foreground sm:px-6", children: c.them })
          ] }, c.title))
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "area", className: "py-16 sm:py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold uppercase tracking-wider text-primary", children: "Area Layanan" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 text-3xl font-bold tracking-tight sm:text-4xl", children: "Sewa Laptop Jabodetabek" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground", children: "Kami melayani sewa laptop, printer, dan proyektor ke seluruh area Jakarta dan sekitarnya." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex flex-wrap justify-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/sewa-laptop-jakarta", className: "inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90", children: "Sewa Laptop Jakarta (semua wilayah) →" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/rental-laptop-jakarta", className: "inline-flex items-center gap-1 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:border-primary/40", children: "Rental Laptop Jakarta →" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: areaLayanan.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `/${a.slug}`, className: "group block rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-base font-semibold text-foreground group-hover:text-primary", children: [
              "Sewa Laptop ",
              a.area
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm leading-relaxed text-muted-foreground", children: a.desc }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary", children: "Lihat detail area →" })
        ] }, a.area)) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "blog-highlights", className: "py-16 sm:py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-end justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold uppercase tracking-wider text-primary", children: "Blog" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 text-3xl font-bold tracking-tight sm:text-4xl", children: "Panduan sewa laptop & printer" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-muted-foreground", children: "Tips memilih unit, hitung-hitungan paket, dan panduan sewa per area — ditulis dari pengalaman melayani ratusan penyewa Techpora." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/blog", className: "inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline", children: [
            "Lihat semua artikel ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3", children: posts.slice(0, 3).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/blog/$slug", params: {
          slug: p.slug
        }, className: "group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex w-fit rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary", children: p.category }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-3 text-base font-semibold leading-snug text-foreground group-hover:text-primary", children: p.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground", children: p.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary", children: "Baca artikel →" })
        ] }, p.slug)) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "faq", className: "border-y border-border bg-secondary/40 py-16 sm:py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl px-4 sm:px-6 lg:px-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold uppercase tracking-wider text-primary", children: "FAQ" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 text-3xl font-bold tracking-tight sm:text-4xl", children: "Pertanyaan yang sering ditanyakan" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 space-y-3", children: faqData.map((f, i) => {
          const open = openFaq === i;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-hidden rounded-2xl border border-border bg-card shadow-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setOpenFaq(open ? null : i), className: "flex w-full items-center justify-between gap-4 px-5 py-4 text-left", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground sm:text-base", children: f.q }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: `h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}` })
            ] }),
            open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 pb-5 text-sm leading-relaxed text-muted-foreground", children: f.a })
          ] }, i);
        }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "lokasi", className: "py-16 sm:py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold uppercase tracking-wider text-primary", children: "Lokasi Kami" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 text-3xl font-bold tracking-tight sm:text-4xl", children: "Sewa Laptop Jakarta — Rawamangun" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 leading-relaxed text-muted-foreground", children: "Ambil sendiri di lokasi atau request pengiriman ke area Jakarta dan sekitarnya." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex items-start gap-3 rounded-2xl border border-border bg-card p-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "mt-0.5 h-5 w-5 flex-shrink-0 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-foreground", children: "Techpora.id — Sewa Laptop Jakarta" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-muted-foreground", children: ADDRESS })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex flex-col gap-3 sm:flex-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: MAPS_URL, target: "_blank", rel: "noopener noreferrer", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "w-full gap-2 rounded-full sm:w-auto", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4" }),
              "Buka di Google Maps"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => openBooking(), className: "w-full gap-2 rounded-full bg-primary hover:bg-primary/90 sm:w-auto", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4" }),
              "Cek Ketersediaan"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden rounded-3xl border border-border bg-card shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx("iframe", { title: "Lokasi Techpora.id Sewa Laptop Jakarta", src: MAPS_EMBED, width: "100%", height: "380", loading: "lazy", referrerPolicy: "no-referrer-when-downgrade", className: "h-[380px] w-full border-0" }) })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "kontak", className: "px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-glow p-10 text-center shadow-[0_30px_80px_-20px_rgba(37,99,235,0.45)] sm:p-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl", children: "Masih bingung pilih unit?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mx-auto mt-4 max-w-xl text-base text-primary-foreground/85", children: "Isi form cek ketersediaan & dapatkan rekomendasi unit sesuai kebutuhanmu." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => openBooking(), size: "lg", className: "mt-8 gap-2 rounded-full bg-background px-8 text-foreground hover:bg-background/90", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-5 w-5 text-primary" }),
            "Cek Ketersediaan Sekarang"
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "border-t border-border bg-background", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logoAsset.url, alt: "Techpora.id", className: "h-10 w-auto" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 max-w-xs text-sm text-muted-foreground", children: "Sewa Laptop, Printer & Proyektor • Mudah • Cepat • Terpercaya" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-semibold text-foreground", children: "Kontak" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-4 space-y-3 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => openBooking(), className: "hover:text-foreground", children: [
                "WhatsApp: ",
                PHONE
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Instagram, { className: "h-4 w-4 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://instagram.com/sewalaptopjakarta.co", target: "_blank", rel: "noopener noreferrer", className: "hover:text-foreground", children: "@sewalaptopjakarta.co" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "mt-0.5 h-4 w-4 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: MAPS_URL, target: "_blank", rel: "noopener noreferrer", className: "hover:text-foreground", children: ADDRESS })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-semibold text-foreground", children: "Navigasi" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-4 grid grid-cols-2 gap-2 text-sm text-muted-foreground", children: navLinks.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: l.href, className: "hover:text-foreground", children: l.label }) }, l.href)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl px-4 py-5 text-center text-xs text-muted-foreground sm:px-6 lg:px-8", children: "Copyright © Techpora.id" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => openBooking(), "aria-label": "Chat WhatsApp", className: "fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-emerald-500/30 transition-transform hover:scale-105", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-6 w-6" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: bookingOpen, onOpenChange: setBookingOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-h-[92vh] overflow-y-auto sm:max-w-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Cek Ketersediaan Unit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Boleh dibantu info berikut ya Kak 😊 — kami akan balas via WhatsApp." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submitBooking, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "b-unit", children: "Unit yang ingin disewa" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "b-unit", required: true, placeholder: "Contoh: MacBook Air M1", value: booking.unit, onChange: (e) => setBooking({
            ...booking,
            unit: e.target.value
          }), maxLength: 120 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "b-qty", children: "Jumlah unit" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "b-qty", required: true, type: "number", min: 1, max: 200, value: booking.qty, onChange: (e) => setBooking({
              ...booking,
              qty: e.target.value
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "b-purpose", children: "Kebutuhan" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "b-purpose", placeholder: "Event / kantor / kuliah", value: booking.purpose, onChange: (e) => setBooking({
              ...booking,
              purpose: e.target.value
            }), maxLength: 160 })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "b-start", children: "Mulai (tgl & jam)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "b-start", required: true, type: "datetime-local", value: booking.start, onChange: (e) => setBooking({
              ...booking,
              start: e.target.value
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "b-end", children: "Selesai (tgl & jam)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "b-end", required: true, type: "datetime-local", value: booking.end, onChange: (e) => setBooking({
              ...booking,
              end: e.target.value
            }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Pengambilan" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(RadioGroup, { value: booking.pickup, onValueChange: (v) => setBooking({
            ...booking,
            pickup: v
          }), className: "grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "p-self", className: "flex cursor-pointer items-center gap-2 rounded-lg border border-border p-3 has-[:checked]:border-primary has-[:checked]:bg-primary/5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RadioGroupItem, { id: "p-self", value: "Ambil sendiri" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "Ambil sendiri" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "p-deliver", className: "flex cursor-pointer items-center gap-2 rounded-lg border border-border p-3 has-[:checked]:border-primary has-[:checked]:bg-primary/5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RadioGroupItem, { id: "p-deliver", value: "Diantar" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "Diantar" })
            ] })
          ] })
        ] }),
        booking.pickup === "Diantar" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "b-address", children: "Alamat pengiriman" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "b-address", required: true, placeholder: "Alamat lengkap + patokan", value: booking.address, onChange: (e) => setBooking({
            ...booking,
            address: e.target.value
          }), maxLength: 400, rows: 3 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 sm:gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => setBookingOpen(false), className: "rounded-full", children: "Batal" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", className: "gap-2 rounded-full bg-primary hover:bg-primary/90", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4" }),
            "Kirim ke WhatsApp"
          ] })
        ] })
      ] })
    ] }) })
  ] });
}
function Row({
  label,
  value,
  highlight
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: highlight ? "font-bold text-primary" : "font-semibold text-foreground", children: value })
  ] });
}
export {
  Index as component
};
