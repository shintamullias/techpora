// Auto-loader artikel. DIOPTIMALKAN untuk performa:
//   - `postMeta` (eager, RINGAN): hanya metadata untuk daftar & related
//     (tanpa `sections`/`intro` panjang) — kecil, aman di-bundle semua.
//   - `loadPost(slug)` (LAZY): memuat 1 artikel penuh hanya saat dibutuhkan.
// Sebelumnya semua 284 artikel di-load eager penuh -> chunk ~2MB & lambat.
import type { BlogPost } from "@/data/blog";

export type BlogMeta = Pick<
  BlogPost,
  "slug" | "title" | "description" | "category" | "date" | "readMinutes" | "related"
>;

// Eager TAPI ringan: ambil hanya field metadata dari tiap JSON.
const metaModules = import.meta.glob<{ default: BlogPost }>(
  "./generated/*.json",
  { eager: true, import: "default" },
);

export const postMeta: BlogMeta[] = Object.entries(metaModules)
  .map(([, p]) => {
    const post = p as unknown as BlogPost;
    return {
      slug: post.slug,
      title: post.title,
      description: post.description,
      category: post.category,
      date: post.date,
      readMinutes: post.readMinutes,
      related: post.related,
    };
  })
  .sort((a, b) => a.slug.localeCompare(b.slug));

// Lazy: peta slug -> loader modul JSON penuh (di-split per file oleh Vite).
const lazyModules = import.meta.glob<BlogPost>("./generated/*.json", {
  import: "default",
});

const slugToLoader = new Map<string, () => Promise<BlogPost>>();
for (const [path, loader] of Object.entries(lazyModules)) {
  const slug = path.replace("./generated/", "").replace(".json", "");
  slugToLoader.set(slug, loader as () => Promise<BlogPost>);
}

export async function loadPost(slug: string): Promise<BlogPost | undefined> {
  const loader = slugToLoader.get(slug);
  if (!loader) return undefined;
  return loader();
}

// Backward-compat: sebagian modul (sitemap, indexnow) butuh daftar metadata;
// mereka tidak butuh `sections`, jadi pakai postMeta.
export const generatedPosts = postMeta as unknown as BlogPost[];
