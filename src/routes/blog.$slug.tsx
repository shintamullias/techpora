import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Calendar, Clock, MessageCircle } from "lucide-react";
import logoAsset from "@/assets/techpora-logo.png.asset.json";
import { Button } from "@/components/ui/button";
import { posts, ctaText, type BlogPost, type BlogSection } from "@/data/blog";

const SITE_URL = "https://sewalaptopjakarta.lovable.app";
const WA_LINK =
  "https://wa.me/6282177984041?text=Halo%20Techpora%2C%20saya%20ingin%20menyewa%20laptop.";

const CATEGORY_IMAGES: Record<string, string> = {
  Tips: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=70",
  Perbandingan: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=70",
  Event: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=70",
  Mahasiswa: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=70",
  Bisnis: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=70",
  Spesifikasi: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=1200&q=70",
};
const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=70";

const SECTION_IMAGES = [
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=70",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=70",
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=70",
];

function coverFor(category: string) {
  return CATEGORY_IMAGES[category] ?? DEFAULT_IMAGE;
}

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = posts.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return post;
  },
      head: ({ loaderData }) => {
    const post = loaderData;
    if (!post) return { meta: [{ title: "Artikel tidak ditemukan" }] };
    const url = `${SITE_URL}/blog/${post.slug}`;
    const cover = coverFor(post.category);
    return {
      meta: [
        { title: `${post.title} — Techpora.id` },
        { name: "description", content: post.description },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.description },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        { property: "og:image", content: cover },
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
            author: { "@type": "Organization", name: "Techpora.id" },
            publisher: {
              "@type": "Organization",
              name: "Techpora.id",
              url: SITE_URL,
            },
            mainEntityOfPage: url,
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
  const post = Route.useLoaderData() as BlogPost;
  const related = posts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);
  const cover = coverFor(post.category);
  const midIndex = Math.floor(post.sections.length / 2);

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
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-muted-foreground hover:text-foreground">WhatsApp</a>
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
            className="mt-8 aspect-[16/9] w-full rounded-2xl border border-border object-cover"
          />

          <p className="mt-8 text-lg leading-relaxed text-foreground">{post.intro}</p>

          <div className="mt-8 space-y-8">
            {post.sections.map((s: BlogSection, i: number) => (
              <section key={s.h}>
                <h2 className="text-xl font-semibold text-foreground">{s.h}</h2>
                <p className="mt-2 leading-relaxed text-muted-foreground">{s.p}</p>
                {i === midIndex && (
                  <img
                    src={SECTION_IMAGES[i % SECTION_IMAGES.length]}
                    alt={`Ilustrasi ${post.category.toLowerCase()} sewa laptop`}
                    loading="lazy"
                    className="mt-6 aspect-[16/9] w-full rounded-xl border border-border object-cover"
                  />
                )}
              </section>
            ))}
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-secondary/40 p-6">
              <h3 className="text-lg font-semibold">Siap sewa laptop?</h3>
              <p className="mt-2 text-sm text-muted-foreground">{ctaText}</p>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block">
                <Button className="gap-2 rounded-full bg-primary hover:bg-primary/90">
                  <MessageCircle className="h-4 w-4" /> Chat Admin WhatsApp
                </Button>
              </a>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-lg font-semibold">Lihat unit & harga</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Cek daftar unit laptop tersedia lengkap dengan harga harian, mingguan,
                dan bulanan di halaman utama Techpora.id.
              </p>
              <Link to="/" className="mt-4 inline-block">
                <Button variant="outline" className="gap-2 rounded-full">
                  Ke Beranda <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </article>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold">Artikel terkait</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to="/blog/$slug"
                  params={{ slug: r.slug }}
                  className="rounded-xl border border-border bg-card p-4 hover:shadow-md"
                >
                  <h3 className="text-sm font-semibold text-foreground">{r.title}</h3>
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
