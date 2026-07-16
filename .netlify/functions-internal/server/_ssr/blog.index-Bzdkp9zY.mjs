import { c as createServerRpc } from "./createServerRpc-CYYErrJb.mjs";
import { c as createServerFn } from "./server-CZa_a97V.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
const fetchBlogList_createServerFn_handler = createServerRpc({
  id: "5be302f3bf90cd928b18ce8b59c7c73c524cc8600b15f8c158bfcaf36f8197ee",
  name: "fetchBlogList",
  filename: "src/routes/blog.index.tsx"
}, (opts) => fetchBlogList.__executeServer(opts));
const fetchBlogList = createServerFn({
  method: "GET"
}).handler(fetchBlogList_createServerFn_handler, async () => {
  const {
    posts
  } = await import("./blog-C_p4h1ZY.mjs").then((n) => n.b);
  const sorted = [...posts].sort((a, b) => a.date < b.date ? 1 : -1).map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    category: p.category,
    date: p.date,
    readMinutes: p.readMinutes
  }));
  const categories = Array.from(new Set(posts.map((p) => p.category)));
  return {
    sorted,
    categories
  };
});
export {
  fetchBlogList_createServerFn_handler
};
