import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "https://techpora.id";
const SITEMAP_URL = `${BASE_URL}/sitemap.xml`;
const INDEXNOW_KEY = "2142cfecfef4a3d20adbb5417c86ff96";

// GET /api/public/ping-sitemap
// - Ping Bing sitemap
// - Submit sitemap URL ke IndexNow (dipropagasi ke Bing, Yandex, Naver, dsb.)
// Cocok dipanggil manual atau via cron eksternal setelah deploy.
export const Route = createFileRoute("/api/public/ping-sitemap")({
  server: {
    handlers: {
      GET: async () => {
        const results: Record<string, { status: number; ok: boolean; body?: string }> = {};

        const ping = async (name: string, url: string, init?: RequestInit) => {
          try {
            const r = await fetch(url, init);
            const body = await r.text().catch(() => "");
            results[name] = { status: r.status, ok: r.ok, body: body.slice(0, 200) };
          } catch (e) {
            results[name] = { status: 0, ok: false, body: String(e).slice(0, 200) };
          }
        };

        await Promise.all([
          ping("bing", `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`),
          ping(
            "indexnow_sitemap",
            `https://api.indexnow.org/indexnow?url=${encodeURIComponent(SITEMAP_URL)}&key=${INDEXNOW_KEY}`,
          ),
        ]);

        return Response.json(
          { sitemap: SITEMAP_URL, results, ts: new Date().toISOString() },
          { headers: { "Cache-Control": "no-store" } },
        );
      },
    },
  },
});
