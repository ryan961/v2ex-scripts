import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { JSDOM } from "jsdom";
import { build } from "esbuild";

const fixture = readFileSync(new URL("./fixtures/topic.html", import.meta.url), "utf8");
const built = await build({
  entryPoints: ["src/main.js"],
  bundle: true,
  write: false,
  format: "iife",
  loader: { ".css": "text" },
});

test("bundled script initializes, enhances only new nodes, and settles without storage writes", async () => {
  const instance = new JSDOM(fixture, {
    url: "https://www.v2ex.com/t/123",
    runScripts: "outside-only",
    pretendToBeVisual: true,
  });
  const { window } = instance;
  const data = new Map([
    ["v2ex-lite:options", { autoCheckIn: false, preloadPages: 0, userCards: false }],
  ]);
  const writes = [];
  Object.assign(window, {
    GM_getValue: (key, fallback) => (data.has(key) ? structuredClone(data.get(key)) : fallback),
    GM_setValue: (key, value) => {
      writes.push(key);
      data.set(key, value);
    },
    GM_listValues: () => [...data.keys()],
    GM_addValueChangeListener: () => {},
    GM_addStyle: (css) => {
      const style = window.document.createElement("style");
      style.textContent = css;
      window.document.head.append(style);
    },
    GM_registerMenuCommand: () => {},
    GM_xmlhttpRequest: () => assert.fail("unexpected upload"),
    fetch: () => assert.fail("unexpected network request"),
    matchMedia: () => ({ matches: false, addEventListener() {} }),
    unsafeWindow: window,
  });
  window.eval(built.outputFiles[0].text);
  await new Promise((resolve) => setTimeout(resolve, 40));
  assert.equal(window.document.querySelector(".item_title a").target, "_blank");
  assert.equal(window.document.querySelectorAll(".vx-tags").length, 3);
  assert.equal(window.document.querySelectorAll("#vx-settings").length, 1);
  assert.equal(window.document.querySelectorAll(".vx-upload").length, 1);
  assert.equal(window.document.documentElement.dataset.v2pTheme, "minimalist");
  assert.equal(window.document.body.classList.contains("v2p-theme-minimalist"), true);
  assert.match(window.document.querySelector("style").textContent, /vivoSans-Regular\.woff2/);
  const row = window.document.createElement("div");
  row.className = "cell";
  row.id = "r_99";
  row.innerHTML =
    '<strong><a href="/member/Carol">Carol</a></strong><span class="no">4</span><span><img src="/heart.png">50</span><div class="reply_content">new</div>';
  window.document.querySelector("#replies").append(row);
  await new Promise((resolve) => setTimeout(resolve, 60));
  assert.equal(row.querySelectorAll(".vx-tags").length, 1);
  assert.equal(window.document.querySelector("#vx-hot a").getAttribute("href"), "#r_99");
  const tagCount = window.document.querySelectorAll(".vx-tags").length;
  await new Promise((resolve) => setTimeout(resolve, 60));
  assert.equal(window.document.querySelectorAll(".vx-tags").length, tagCount);
  assert.deepEqual(writes, []);
  instance.window.close();
});
