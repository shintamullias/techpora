import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { generatedPosts } from "@/content/blog";
import { posts as staticBlogPosts } from "@/data/blog";

const HOST = "techpora.id";
const BASE_URL = `https://${HOST}`;
const INDEXNOW_KEY = "2142cfecfef4a3d20adbb5417c86ff96";
const KEY_LOCATION = `${BASE_URL}/${INDEXNOW_KEY}.txt`;

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
  "/rental-laptop-jakarta",
];

// GET /api/public/indexnow-all — submit SEMUA URL (static + blog) sekali jalan.
// Panggil setelah deploy besar (mis. batch artikel baru selesai).
export const Route = createFileRoute("/api/public/indexnow-all")({
  server: {
    handlers: {
      GET: async () => {
        const blogSlugs = [
          ...staticBlogPosts.map((p) => p.slug),
          ...generatedPosts.map((p) => p.slug),
        ];
        const unique = Array.from(new Set(blogSlugs));
        const urls = [
          ...STATIC_PATHS.map((p) => `${BASE_URL}${p}`),
          ...unique.map((s) => `${BASE_URL}/blog/${s}`),
        ].slice(0, 10000);

        const r = await fetch("https://api.indexnow.org/indexnow", {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body: JSON.stringify({
            host: HOST,
            key: INDEXNOW_KEY,
            keyLocation: KEY_LOCATION,
            urlList: urls,
          }),
        });
        const text = await r.text().catch(() => "");

        return Response.json(
          { submitted: urls.length, status: r.status, ok: r.ok, response: text.slice(0, 500) },
          { headers: { "Cache-Control": "no-store" } },
        );
      },
    },
  },
});
