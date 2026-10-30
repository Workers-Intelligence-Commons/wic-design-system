// Builds dist/: ES modules and types, the stylesheet, and the browser-global script wic.global.js.
import { $, type BunPlugin } from "bun";
import { copyFile, rm } from "node:fs/promises";

const root = new URL("..", import.meta.url).pathname;
process.chdir(root);

await rm("dist", { recursive: true, force: true });
await $`bun scripts/marks.ts`;
await $`bunx tsc -p tsconfig.build.json`;
await copyFile("src/styles.css", "dist/styles.css");

// React 19 ships no browser-global build, so the global script reads React from window.React,
// which the page provides before loading it.
const windowReact: BunPlugin = {
  name: "window-react",
  setup(build) {
    build.onResolve({ filter: /^react(\/jsx-runtime|\/jsx-dev-runtime)?$/ }, (args) => ({ path: args.path, namespace: "window-react" }));
    build.onLoad({ filter: /.*/, namespace: "window-react" }, (args) => ({
      loader: "js",
      contents:
        args.path === "react"
          ? "export default window.React;"
          : `const R = window.React;
export const Fragment = R.Fragment;
export function jsx(type, props, key) { return R.createElement(type, key === undefined ? props : { ...props, key }); }
export const jsxs = jsx;
export const jsxDEV = jsx;`,
    }));
  },
};

const result = await Bun.build({
  entrypoints: ["src/global.ts"],
  outdir: "dist",
  naming: "wic.global.js",
  format: "iife",
  target: "browser",
  plugins: [windowReact],
});
if (!result.success) {
  for (const log of result.logs) console.error(log);
  process.exit(1);
}
