// Auto-loader untuk artikel yang di-generate script. Menggunakan Vite import.meta.glob
// (eager) supaya semua JSON di-bundle di build time.
import type { BlogPost } from "@/data/blog";

const modules = import.meta.glob<{ default: BlogPost }>(
  "./generated/*.json",
  { eager: true, import: "default" },
);

// Sort by slug supaya deterministic
export const generatedPosts: BlogPost[] = Object.entries(modules)
  .map(([, post]) => post as unknown as BlogPost)
  .sort((a, b) => a.slug.localeCompare(b.slug));
