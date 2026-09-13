import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Calendar, Clock, MessageCircle } from "lucide-react";
import { createServerFn } from "@tanstack/react-start";
import logoAsset from "@/assets/techpora-logo.png.asset.json";
import { Button } from "@/components/ui/button";
import { waLinkFor } from "@/lib/wa-link";
import type { BlogPost, BlogSection } from "@/data/blog";

const fetchBlogPostData = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    // Artikel pilar (kecil, ~30) tetap eager; artikel generated (284) di-load
    // LAZY per-slug supaya tidak memuat semua ke memori tiap render.
    const { posts } = await import("@/data/blog");
    const { postMeta, loadPost } = await import("@/content/blog");

    // Cari post: pilar dulu, lalu lazy-load dari generated.
    let post: BlogPost | undefined = posts.find((p) => p.slug === slug);
    if (!post) post = await loadPost(slug);
    if (!post) return null;

    // Related: pakai metadata RINGAN (tanpa sections) untuk memilih,
    // lalu lazy-load isi penuh hanya 3 artikel terpilih.
    const pilarMeta = posts.map((p) => ({
      slug: p.slug, title: p.title, description: p.description,
      category: p.category, date: p.date, readMinutes: p.readMinutes, related: p.related,
    }));
    const allMeta = [...pilarMeta, ...postMeta];

    const curatedSlugs = (post.related || [])
      .filter((s) => s !== post!.slug && allMeta.some((m) => m.slug === s));
    const fillerSlugs = allMeta
      .filter((m) => m.slug !== post!.slug && m.category === post!.category && !curatedSlugs.includes(m.slug))
      .map((m) => m.slug);
    const chosen = [...curatedSlugs, ...fillerSlugs].slice(0, 3);

    const related = (
      await Promise.all(
        chosen.map(async (s) => posts.find((p) => p.slug === s) ?? (await loadPost(s))),
      )
    ).filter((p): p is BlogPost => Boolean(p));

    return { post, related };
  });

const SITE_URL = "https://techpora.id";
const WA_GENERIC = waLinkFor(
  "Halo Techpora, saya mau sewa laptop. Saya lihat dari techpora.id.",
);

const CATEGORY_IMAGES: Record<string, string> = {
  Mahasiswa: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=60",
  Profesional: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=60",
  Event: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=60",
  Panduan: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=60",
  Lokasi: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=60",
};
const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=60";

const SECTION_IMAGES = [
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=60",
];

function coverFor(category: string, coverImage?: string) {
  return coverImage || CATEGORY_IMAGES[category] || DEFAULT_IMAGE;
}

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const result = await fetchBlogPostData({ data: params.slug });
    if (!result) throw notFound();
    return result;
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) return { meta: [{ title: "Artikel tidak ditemukan" }] };
    const url = `${SITE_URL}/blog/${post.slug}`;
    const cover = coverFor(post.category, (post as any).coverImage);
    return {
      meta: [
        { title: `${post.title} — Techpora.id` },
        { name: "description", content: post.description },
        { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1" },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.description },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        { property: "og:image", content: cover },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: post.title },
        { name: "twitter:description", content: post.description },
        { name: "twitter:image", content: cover },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            image: cover,
            author: { "@type": "Organization", name: "Techpora.id" },
            publisher: {
              "@type": "Organization",
              name: "Techpora.id",
              url: SITE_URL,
            },
            mainEntityOfPage: url,
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Beranda", item: `${SITE_URL}/` },
              { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
              { "@type": "ListItem", position: 3, name: post.title, item: url },
            ],
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="text-3xl font-bold">Artikel tidak ditemukan</h1>
      <Link to="/blog" className="mt-6 inline-block text-primary underline">
        Kembali ke blog
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="text-3xl font-bold">Terjadi kesalahan</h1>
      <p className="mt-2 text-muted-foreground">{error.message}</p>
    </div>
  ),
  component: BlogPostPage,
});

function BlogPostPage() {
  const { post, related } = Route.useLoaderData();

  const cover = coverFor(post.category, (post as any).coverImage);
  const midIndex = Math.floor(post.sections.length / 2);
  const ctaWaLink = waLinkFor(post.cta.waMessage);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoAsset.url} alt="Techpora.id" className="h-9 w-auto" />
          </Link>
          <nav className="hidden items-center gap-8 lg:flex">
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">Beranda</Link>
            <Link to="/blog" className="text-sm font-medium text-muted-foreground hover:text-foreground">Blog</Link>
            <a href={WA_GENERIC} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-muted-foreground hover:text-foreground">WhatsApp</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Semua artikel
        </Link>

        <article className="mt-6">
          <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            {post.category}
          </span>
          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            {post.title}
          </h1>
          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(post.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-4 w-4" /> {post.readMinutes} menit baca
            </span>
          </div>

          <img
            src={cover}
            alt={post.title}
            loading="eager"
            decoding="async"
            width={800}
            height={450}
            className="mt-8 aspect-[16/9] w-full rounded-2xl border border-border object-cover"
          />

          <p className="mt-8 text-lg leading-relaxed text-foreground">{post.intro}</p>

          <div className="mt-8 space-y-8">
            {post.sections.map((s: BlogSection, i: number) => (
              <section key={s.h}>
                <h2 className="text-xl font-semibold text-foreground">{s.h}</h2>
                <p className="mt-2 leading-relaxed text-muted-foreground">{s.p}</p>
                {post.contextLinks
                  ?.filter((c) => c.section === i)
                  .map((c) => (
                    <p key={c.to} className="mt-3 text-sm">
                      <span className="text-muted-foreground">Baca juga: </span>
                      <a
                        href={c.to}
                        className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
                      >
                        {c.anchor}
                      </a>
                    </p>
                  ))}
                {i === midIndex && (
                  <img
                    src={SECTION_IMAGES[i % SECTION_IMAGES.length]}
                    alt={`Ilustrasi ${post.category.toLowerCase()} sewa laptop`}
                    loading="lazy"
                    decoding="async"
                    width={800}
                    height={450}
                    className="mt-6 aspect-[16/9] w-full rounded-xl border border-border object-cover"
                  />
                )}
              </section>
            ))}
          </div>

          {/* Contextual CTA — unique per article */}
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6">
              <h3 className="text-lg font-semibold text-foreground">{post.cta.heading}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{post.cta.body}</p>
              <a href={ctaWaLink} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block">
                <Button className="gap-2 rounded-full bg-primary hover:bg-primary/90">
                  <MessageCircle className="h-4 w-4" /> Chat WhatsApp
                </Button>
              </a>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-lg font-semibold">{post.cta.internalLabel}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Cek unit tersedia, harga, dan detail area layanan yang paling relevan dengan topik artikel ini.
              </p>
              <a href={post.cta.internalPath} className="mt-4 inline-block">
                <Button variant="outline" className="gap-2 rounded-full">
                  Kunjungi halaman <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </article>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold">Artikel terkait</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {related.map((r: BlogPost) => (
                <Link
                  key={r.slug}
                  to="/blog/$slug"
                  params={{ slug: r.slug }}
                  className="rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-md"
                >
                  <span className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    {r.category}
                  </span>
                  <h3 className="mt-2 text-sm font-semibold text-foreground">{r.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{r.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="mt-16 border-t border-border bg-secondary/30 py-10">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
          <p>Copyright © Techpora.id</p>
        </div>
      </footer>
    </div>
  );
}
