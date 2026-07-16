import { j as jsxRuntimeExports } from "../_libs/react.mjs";
const SplitErrorComponent = ({
  error
}) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl px-6 py-24 text-center", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", children: "Terjadi kesalahan" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground", children: error.message })
] });
export {
  SplitErrorComponent as errorComponent
};
