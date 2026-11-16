import { build } from "esbuild";
import { mkdir, readFile, writeFile } from "node:fs/promises";

const { version } = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const polishLicense = await readFile(
  new URL("../licenses/v2ex-polish-MIT.txt", import.meta.url),
  "utf8",
);
const base = "https://raw.githubusercontent.com/ryan961/v2ex-scripts/main/dist/v2ex-lite";
const header = `// ==UserScript==
// @name         V2EX Lite
// @namespace    https://github.com/ryan961/v2ex-scripts
// @version      ${version}
// @description  Focused V2EX themes, tags, previews, replies, check-in and image uploads.
// @author       ryan961
// @license      MIT
// @homepageURL  https://github.com/ryan961/v2ex-scripts
// @supportURL   https://github.com/ryan961/v2ex-scripts/issues
// @downloadURL  ${base}.user.js
// @updateURL    ${base}.meta.js
// @match        https://v2ex.com/*
// @match        https://*.v2ex.com/*
// @noframes
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
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
  target: ["chrome120", "firefox121"],
  outfile: "dist/v2ex-lite.user.js",
  banner: { js: `${header}\n/*\n${polishLicense.trim()}\n*/` },
  legalComments: "inline",
  loader: { ".css": "text" },
});
await writeFile(new URL("../dist/v2ex-lite.meta.js", import.meta.url), `${header}\n`);
