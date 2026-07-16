import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { l as logoAsset, B as Button, w as waLink, b as buildWaSimple, k as getUnitImage } from "./router-BJ07QcjX.mjs";
import { M as MessageCircle, c as ArrowLeft, a as MapPin, T as Truck, S as ShieldCheck, e as Check, f as Clock } from "../_libs/lucide-react.mjs";
function AreaPage({ area }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logoAsset.url, alt: "Techpora.id", className: "h-9 w-auto" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "hidden items-center gap-6 lg:flex text-sm font-medium text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:text-foreground", children: "Beranda" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/blog", className: "hover:text-foreground", children: "Blog" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: waLink(buildWaSimple(void 0, area.area)), target: "_blank", rel: "noopener noreferrer", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "gap-2 rounded-full bg-primary hover:bg-primary/90", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4" }),
        "Chat WhatsApp"
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden border-b border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute -top-24 right-0 h-[400px] w-[400px] rounded-full bg-primary/10 blur-3xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:py-20 lg:px-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3.5 w-3.5" }),
            "Kembali ke Beranda"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3 text-primary" }),
            "Area ",
            area.area
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 text-4xl font-bold tracking-tight sm:text-5xl", children: area.h1 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg", children: area.intro }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 flex flex-col gap-3 sm:flex-row", children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: waLink(buildWaSimple(void 0, area.area)), target: "_blank", rel: "noopener noreferrer", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "lg", className: "w-full gap-2 rounded-full bg-primary px-7 hover:bg-primary/90 sm:w-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-5 w-5" }),
            "Cek Ketersediaan di ",
            area.areaShort
          ] }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex items-center gap-2 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-4 w-4 text-primary" }),
            area.eta
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-secondary/40 border-b border-border py-14", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-2xl font-bold sm:text-3xl", children: [
          "Kenapa sewa di ",
          area.area,
          " lewat Techpora?"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3", children: area.highlights.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-6 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-4 text-base font-semibold", children: h.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-sm text-muted-foreground", children: h.desc })
        ] }, h.title)) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-14", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold sm:text-3xl", children: "Kebutuhan yang biasa kami layani" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-6 space-y-3", children: area.useCases.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-3 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "mt-0.5 h-4 w-4 flex-shrink-0 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: u })
          ] }, u)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-2xl font-bold sm:text-3xl", children: [
            "Kawasan yang dilayani di ",
            area.area
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex flex-wrap gap-2", children: area.landmarks.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground", children: l }, l)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "mt-0.5 h-4 w-4 flex-shrink-0 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: area.eta })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-y border-border bg-secondary/40 py-14", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-2xl font-bold sm:text-3xl", children: [
          "Unit yang tersedia untuk ",
          area.area
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Harga sudah termasuk pengecekan unit sebelum kirim." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3", children: area.units.map((u) => {
          const img = getUnitImage(u.name);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: `flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm ${u.featured ? "border-primary/40 ring-1 ring-primary/20" : "border-border"}`, children: [
            img && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-secondary/60 to-secondary/20 p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: img, alt: u.name, width: 800, height: 600, loading: "lazy", className: "max-h-full w-auto object-contain drop-shadow-md" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col p-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold uppercase tracking-wider text-primary", children: u.category }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-2 text-lg font-bold", children: u.name }),
              u.specs && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: u.specs }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-2 border-t border-border pt-4 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Harian", value: u.daily }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Mingguan", value: u.weekly }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Bulanan", value: u.monthly, highlight: true })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "a",
                {
                  href: waLink(buildWaSimple(u.name, area.area)),
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "mt-5",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "w-full gap-2 rounded-full bg-primary hover:bg-primary/90", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4" }),
                    "Sewa ",
                    u.name
                  ] })
                }
              )
            ] })
          ] }, u.name);
        }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-14", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-3xl font-bold sm:text-4xl", children: [
          "Siap sewa laptop di ",
          area.area,
          "?"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground", children: "Chat admin sekarang, unit siap dikirim hari ini juga." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: waLink(buildWaSimple(void 0, area.area)), target: "_blank", rel: "noopener noreferrer", className: "mt-8 inline-block", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "lg", className: "gap-2 rounded-full bg-primary px-8 hover:bg-primary/90", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-5 w-5" }),
          "Cek Ketersediaan Sekarang"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "text-sm font-medium text-primary hover:underline", children: "← Lihat semua unit di halaman utama" }) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl px-4 py-6 text-center text-xs text-muted-foreground sm:px-6 lg:px-8", children: "Copyright © Techpora.id — Sewa Laptop Jakarta & Sekitarnya" }) })
  ] });
}
function Row({ label, value, highlight }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: highlight ? "font-bold text-primary" : "font-semibold text-foreground", children: value })
  ] });
}
export {
  AreaPage as A
};
