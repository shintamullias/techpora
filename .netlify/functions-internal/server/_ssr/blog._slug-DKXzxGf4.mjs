import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { q as Route$3, r as coverFor, l as logoAsset, B as Button } from "./router-BJ07QcjX.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { w as waLinkFor } from "./blog-C_p4h1ZY.mjs";
import "../_libs/seroval.mjs";
import { c as ArrowLeft, m as Calendar, f as Clock, M as MessageCircle, A as ArrowRight } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
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
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
const WA_GENERIC = waLinkFor("Halo Techpora, saya mau sewa laptop. Saya lihat dari techpora.id.");
const SECTION_IMAGES = ["https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=70", "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=70", "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=70"];
function BlogPostPage() {
  const {
    post,
    related
  } = Route$3.useLoaderData();
  const cover = coverFor(post.category);
  const midIndex = Math.floor(post.sections.length / 2);
  const ctaWaLink = waLinkFor(post.cta.waMessage);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logoAsset.url, alt: "Techpora.id", className: "h-9 w-auto" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "hidden items-center gap-8 lg:flex", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "text-sm font-medium text-muted-foreground hover:text-foreground", children: "Beranda" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/blog", className: "text-sm font-medium text-muted-foreground hover:text-foreground", children: "Blog" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: WA_GENERIC, target: "_blank", rel: "noopener noreferrer", className: "text-sm font-medium text-muted-foreground hover:text-foreground", children: "WhatsApp" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/blog", className: "inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
        " Semua artikel"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "mt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary", children: post.category }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl", children: post.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center gap-4 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4" }),
            new Date(post.date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric"
            })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4" }),
            " ",
            post.readMinutes,
            " menit baca"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: cover, alt: post.title, loading: "eager", className: "mt-8 aspect-[16/9] w-full rounded-2xl border border-border object-cover" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-8 text-lg leading-relaxed text-foreground", children: post.intro }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 space-y-8", children: post.sections.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-foreground", children: s.h }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 leading-relaxed text-muted-foreground", children: s.p }),
          i === midIndex && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: SECTION_IMAGES[i % SECTION_IMAGES.length], alt: `Ilustrasi ${post.category.toLowerCase()} sewa laptop`, loading: "lazy", className: "mt-6 aspect-[16/9] w-full rounded-xl border border-border object-cover" })
        ] }, s.h)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12 grid gap-4 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-primary/30 bg-primary/5 p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-foreground", children: post.cta.heading }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: post.cta.body }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: ctaWaLink, target: "_blank", rel: "noopener noreferrer", className: "mt-4 inline-block", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "gap-2 rounded-full bg-primary hover:bg-primary/90", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4" }),
              " Chat WhatsApp"
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold", children: post.cta.internalLabel }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Cek unit tersedia, harga, dan detail area layanan yang paling relevan dengan topik artikel ini." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: post.cta.internalPath, className: "mt-4 inline-block", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "gap-2 rounded-full", children: [
              "Kunjungi halaman ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
            ] }) })
          ] })
        ] })
      ] }),
      related.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold", children: "Artikel terkait" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 grid gap-4 sm:grid-cols-3", children: related.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/blog/$slug", params: {
          slug: r.slug
        }, className: "rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary", children: r.category }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-2 text-sm font-semibold text-foreground", children: r.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 line-clamp-2 text-xs text-muted-foreground", children: r.description })
        ] }, r.slug)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "mt-16 border-t border-border bg-secondary/30 py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Copyright © Techpora.id" }) }) })
  ] });
}
export {
  BlogPostPage as component
};
