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
const fetchBlogPostData_createServerFn_handler = createServerRpc({
  id: "96175ca94e352df193070640863f1c18b3e336285487f8ff766c50a9aa72a793",
  name: "fetchBlogPostData",
  filename: "src/routes/blog.$slug.tsx"
}, (opts) => fetchBlogPostData.__executeServer(opts));
const fetchBlogPostData = createServerFn({
  method: "GET"
}).inputValidator((slug) => slug).handler(fetchBlogPostData_createServerFn_handler, async ({
  data: slug
}) => {
  const {
    posts
  } = await import("./blog-C_p4h1ZY.mjs").then((n) => n.b);
  const post = posts.find((p) => p.slug === slug);
  if (!post) return null;
  const curated = post.related.map((s) => posts.find((p) => p.slug === s)).filter((p) => Boolean(p) && p.slug !== post.slug);
  const fillers = posts.filter((p) => p.slug !== post.slug && p.category === post.category && !curated.find((c) => c.slug === p.slug));
  const related = [...curated, ...fillers].slice(0, 3);
  return {
    post,
    related
  };
});
export {
  fetchBlogPostData_createServerFn_handler
};
