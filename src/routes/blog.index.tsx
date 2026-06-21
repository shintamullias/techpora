import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import logoAsset from "@/assets/techpora-logo.png.asset.json";
import { posts } from "@/data/blog";

const SITE_URL = "https://sewalaptopjakarta.lovable.app";
const WA_LINK =
  "https://wa.me/628812107859?text=Halo%20Techpora%2C%20saya%20ingin%20menyewa%20laptop.";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog Techpora.id — Tips & Panduan Sewa Laptop" },
      {
        name: "description",
        content:
          "Kumpulan artikel tips, perbandingan, dan panduan sewa laptop untuk mahasiswa, freelancer, event, dan bisnis di Jakarta.",
      },
      { property: "og:title", content: "Blog Techpora.id — Tips Sewa Laptop" },
      {
        property: "og:description",
        content:
          "50+ artikel seputar sewa laptop: tips memilih, perbandingan unit, dan panduan untuk event.",
      },
      { property: "og:url", content: `${SITE_URL}/blog` },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "Blog Techpora.id" },
      {
        name: "twitter:description",
        content: "Tips dan panduan sewa laptop di Jakarta.",
      },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/blog` }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const sorted = [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
  const categories = Array.from(new Set(posts.map((p) => p.category)));

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoAsset.url} alt="Techpora.id" className="h-9 w-auto" />
          </Link>
          <nav className="hidden items-center gap-8 lg:flex">
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">Beranda</Link>
            <Link to="/blog" className="text-sm font-medium text-foreground">Blog</Link>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-muted-foreground hover:text-foreground">WhatsApp</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-semibold text-primary">Blog Techpora.id</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Tips & Panduan Sewa Laptop
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Kumpulan artikel untuk membantumu memilih laptop sewa yang tepat —
            mulai dari kebutuhan kuliah, event, hingga bisnis di Jakarta.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((c) => (
            <span
              key={c}
              className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-medium text-foreground"
            >
              {c}
            </span>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((post) => (
            <Link
              key={post.slug}
              to="/blog/$slug"
              params={{ slug: post.slug }}
              className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-lg"
            >
              <span className="inline-flex w-fit rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {post.category}
              </span>
              <h2 className="mt-3 text-lg font-semibold leading-snug text-foreground group-hover:text-primary">
                {post.title}
              </h2>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                {post.description}
              </p>
              <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(post.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {post.readMinutes} mnt
                </span>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Baca artikel <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </main>

      <footer className="border-t border-border bg-secondary/30 py-10">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
          <p>Copyright © Techpora.id</p>
        </div>
      </footer>
    </div>
  );
}
