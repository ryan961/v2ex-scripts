import { build, transform } from "esbuild";
import { compile } from "sass";
import { mkdir, readFile, writeFile } from "node:fs/promises";

const greasyFork = process.argv.includes("--greasyfork");
const { version } = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const polishLicense = await readFile(
  new URL("../licenses/v2ex-polish-MIT.txt", import.meta.url),
  "utf8",
);
const repLicense = await readFile(new URL("../licenses/v2ex-rep-MIT.txt", import.meta.url), "utf8");
const floatingLicense = await readFile(
  new URL("../licenses/floating-ui-MIT.txt", import.meta.url),
  "utf8",
);
const lucideLicense = await readFile(
  new URL("../licenses/lucide-LICENSE.txt", import.meta.url),
  "utf8",
);
const upstreamSources = greasyFork
  ? `V2EX Polish styles and emoticons: https://github.com/coolpace/V2EX_Polish/tree/c8f1b70fdf13fa17bc842d05949f94ff19bc6cfc
V2EX.REP styles and adapted features: https://github.com/v2hot/v2ex.rep/tree/a5820a221d7832b340a26624b6e2211149ec6397
Floating UI: https://github.com/floating-ui/floating-ui
Bundled to resolve its ES module dependencies in a single userscript.
Lucide icon paths: https://github.com/lucide-icons/lucide

`
  : "";
const base = "https://raw.githubusercontent.com/ryan961/v2ex-scripts/main/dist/v2ex-lite";
const description = greasyFork
  ? "\u6539\u5584 V2EX \u7684\u9605\u8bfb\u4e0e\u56de\u590d\u4f53\u9a8c\uff0c\u652f\u6301\u4e3b\u9898\u5207\u6362\u3001\u5e16\u5b50\u9884\u89c8\u3001\u591a\u9875\u56de\u590d\u3001\u7528\u6237\u6807\u7b7e\u3001\u8868\u60c5\u3001\u56fe\u7247\u4e0a\u4f20\u4e0e\u4ee3\u7406\uff0c\u4ee5\u53ca\u5907\u4efd\u6062\u590d\u3002"
  : "Focused V2EX themes, tags, previews, replies, check-in and image uploads.";
const updates = greasyFork
  ? ""
  : `
// @downloadURL  ${base}.user.js
// @updateURL    ${base}.meta.js`;
const target = ["chrome120", "firefox121"];
const header = `// ==UserScript==
// @name         V2EX Lite
// @namespace    https://github.com/ryan961/v2ex-scripts
// @version      ${version}
// @description  ${description}
// @author       ryan961
// @license      MIT
// @homepageURL  https://github.com/ryan961/v2ex-scripts
// @supportURL   https://github.com/ryan961/v2ex-scripts/issues${updates}
// @match        https://v2ex.com/*
// @match        https://*.v2ex.com/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addValueChangeListener
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      api.imgur.com
// ==/UserScript==`;

await mkdir(new URL("../dist", import.meta.url), { recursive: true });
await build({
  entryPoints: ["src/main.js"],
  bundle: true,
  format: "iife",
  target,
  minify: !greasyFork,
  outfile: greasyFork ? "dist/v2ex-lite.greasyfork.user.js" : "dist/v2ex-lite.user.js",
  banner: {
    js: `${header}\n/*\n${upstreamSources}${polishLicense.trim()}\n\n${repLicense.trim()}\n\n${floatingLicense.trim()}\n\n${lucideLicense.trim()}\n*/`,
  },
  legalComments: "inline",
  loader: { ".css": "text" },
  plugins: [
    {
      name: "styles",
      setup(builder) {
        builder.onLoad({ filter: /\.(scss|css)$/ }, async (args) => {
          const source = args.path.endsWith(".scss")
            ? compile(args.path).css
            : await readFile(args.path, "utf8");
          const { code } = await transform(source, {
            loader: "css",
            minify: !greasyFork,
            target,
            legalComments: "inline",
          });
          return { contents: code, loader: "text" };
        });
      },
    },
  ],
});
if (!greasyFork)
  await writeFile(new URL("../dist/v2ex-lite.meta.js", import.meta.url), `${header}\n`);
