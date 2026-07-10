import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const HOST = "techpora.id";
const BASE_URL = `https://${HOST}`;
const INDEXNOW_KEY = "2142cfecfef4a3d20adbb5417c86ff96";
const KEY_LOCATION = `${BASE_URL}/${INDEXNOW_KEY}.txt`;

// POST /api/public/indexnow  { "urls": ["https://techpora.id/blog/xxx", ...] }
// Batch submit ke IndexNow (Bing/Yandex/Naver/Seznam/Yep).
// Max 10.000 URL per request per spec IndexNow.
export const Route = createFileRoute("/api/public/indexnow")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "invalid json" }, { status: 400 });
        }
        const raw = (body as { urls?: unknown })?.urls;
        if (!Array.isArray(raw) || raw.length === 0) {
          return Response.json({ error: "urls[] required" }, { status: 400 });
        }
        const urls = raw
          .filter((u): u is string => typeof u === "string")
          .map((u) => (u.startsWith("http") ? u : `${BASE_URL}${u.startsWith("/") ? u : `/${u}`}`))
          .filter((u) => {
            try {
              return new URL(u).hostname === HOST;
            } catch {
              return false;
            }
          })
          .slice(0, 10000);

        if (urls.length === 0) {
          return Response.json({ error: "no valid urls for host" }, { status: 400 });
        }

        const payload = {
          host: HOST,
          key: INDEXNOW_KEY,
          keyLocation: KEY_LOCATION,
          urlList: urls,
        };

        const r = await fetch("https://api.indexnow.org/indexnow", {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body: JSON.stringify(payload),
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
