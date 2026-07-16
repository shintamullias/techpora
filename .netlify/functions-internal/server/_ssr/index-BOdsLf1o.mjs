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
const fetchLatestPosts_createServerFn_handler = createServerRpc({
  id: "4e514227a64adfd70c6acbe448bb1f2487895d140c3ee24e6b8616bd5418f5a3",
  name: "fetchLatestPosts",
  filename: "src/routes/index.tsx"
}, (opts) => fetchLatestPosts.__executeServer(opts));
const fetchLatestPosts = createServerFn({
  method: "GET"
}).handler(fetchLatestPosts_createServerFn_handler, async () => {
  const {
    posts
  } = await import("./blog-C_p4h1ZY.mjs").then((n) => n.b);
  return posts.slice(0, 3).map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    category: p.category
  }));
});
export {
  fetchLatestPosts_createServerFn_handler
};
