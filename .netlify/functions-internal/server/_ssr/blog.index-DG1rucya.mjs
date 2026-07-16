import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { p as Route$4, l as logoAsset } from "./router-BJ07QcjX.mjs";
import "../_libs/seroval.mjs";
import { m as Calendar, f as Clock, A as ArrowRight } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "./blog-C_p4h1ZY.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "./server-CZa_a97V.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
const WA_LINK = "https://wa.me/6282177984041?text=Halo%20Techpora%2C%20saya%20ingin%20menyewa%20laptop.";
const CATEGORY_IMAGES = {
  Mahasiswa: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=70",
  Profesional: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=70",
  Event: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=70",
  Panduan: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=70",
  Lokasi: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=70"
};
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=70";
function BlogIndex() {
  const {
    sorted,
    categories
  } = Route$4.useLoaderData();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logoAsset.url, alt: "Techpora.id", className: "h-9 w-auto" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "hidden items-center gap-8 lg:flex", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "text-sm font-medium text-muted-foreground hover:text-foreground", children: "Beranda" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/blog", className: "text-sm font-medium text-foreground", children: "Blog" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: WA_LINK, target: "_blank", rel: "noopener noreferrer", className: "text-sm font-medium text-muted-foreground hover:text-foreground", children: "WhatsApp" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-10 max-w-3xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-primary", children: "Blog Techpora.id" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-2 text-4xl font-bold tracking-tight sm:text-5xl", children: "Tips & Panduan Sewa Laptop" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-lg text-muted-foreground", children: "Kumpulan artikel untuk membantumu memilih laptop sewa yang tepat — mulai dari kebutuhan kuliah, event, hingga bisnis di Jakarta." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8 flex flex-wrap gap-2", children: categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-medium text-foreground", children: c }, c)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3", children: sorted.map((post) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/blog/$slug", params: {
        slug: post.slug
      }, className: "group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: CATEGORY_IMAGES[post.category] ?? DEFAULT_IMAGE, alt: post.title, loading: "lazy", className: "aspect-[16/9] w-full object-cover" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex w-fit rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary", children: post.category }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 text-lg font-semibold leading-snug text-foreground group-hover:text-primary", children: post.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 line-clamp-3 text-sm text-muted-foreground", children: post.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center gap-4 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3.5 w-3.5" }),
              new Date(post.date).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric"
              })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5" }),
              post.readMinutes,
              " mnt"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary", children: [
            "Baca artikel ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
          ] })
        ] })
      ] }, post.slug)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "border-t border-border bg-secondary/30 py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Copyright © Techpora.id" }) }) })
  ] });
}
export {
  BlogIndex as component
};
