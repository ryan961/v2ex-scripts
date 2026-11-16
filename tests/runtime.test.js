import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { JSDOM } from "jsdom";

const fixture = readFileSync(new URL("./fixtures/topic.html", import.meta.url), "utf8");
const built = readFileSync(new URL("../dist/v2ex-lite.user.js", import.meta.url), "utf8");

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
  window.eval(built);
  await new Promise((resolve) => setTimeout(resolve, 40));
  assert.equal(window.document.querySelector(".item_title a").target, "_blank");
  assert.equal(window.document.querySelectorAll(".vx-tags").length, 3);
  assert.equal(window.document.querySelectorAll("#vx-settings").length, 1);
  assert.equal(window.document.querySelector("#Bottom .v2p-footer-text").textContent, "V2EX Lite");
  assert.equal(window.document.querySelectorAll(".vx-upload").length, 1);
  assert.ok(window.document.querySelector('#reply-box button[aria-expanded="false"]'));
  assert.equal(window.document.documentElement.dataset.v2pTheme, "minimalist");
  assert.equal(window.document.body.classList.contains("v2p-theme-minimalist"), true);
  assert.doesNotMatch(
    window.document.querySelector("style").textContent,
    /@font-face|vivoSans-Regular\.woff2/,
  );
  const row = window.document.createElement("div");
  row.className = "cell";
  row.id = "r_99";
  row.innerHTML =
    '<strong><a href="/member/Carol">Carol</a></strong><span class="no">4</span><span><img src="/heart.png">50</span><div class="reply_content">new</div>';
  window.document.querySelector("#replies").append(row);
  await new Promise((resolve) => setTimeout(resolve, 60));
  assert.equal(row.querySelectorAll(".vx-tags").length, 1);
  assert.equal(window.document.querySelector("#top_replies a.no").getAttribute("href"), "#r_99");
  const tagCount = window.document.querySelectorAll(".vx-tags").length;
  await new Promise((resolve) => setTimeout(resolve, 60));
  assert.equal(window.document.querySelectorAll(".vx-tags").length, tagCount);
  assert.deepEqual(writes, []);
  instance.window.close();
});

test("Cloudflare and error pages do not run V2EX Lite", async () => {
  const instance = new JSDOM(
    '<h1>Security verification</h1><div id="challenge-stage"></div><footer>Cloudflare</footer>',
    { url: "https://v2ex.com/t/123", runScripts: "outside-only", pretendToBeVisual: true },
  );
  const { window } = instance;
  const calls = [];
  for (const name of ["GM_getValue", "GM_addStyle", "GM_registerMenuCommand", "fetch"])
    window[name] = () => calls.push(name);
  window.eval(built);
  await new Promise((resolve) => window.setTimeout(resolve, 0));
  assert.equal(window.document.querySelector(".v2p-footer"), null);
  assert.equal(window.document.documentElement.dataset.v2pTheme, undefined);
  assert.deepEqual(calls, []);
  instance.window.close();
});

test("V2EX language cookie localizes script modules and guests skip account features", async () => {
  for (const [locale, labels] of Object.entries({
    enus: ["Settings", "Preview", "Top replies on this page"],
    zhcn: ["\u8bbe\u7f6e", "\u9884\u89c8", "\u5f53\u524d\u9875\u70ed\u95e8\u56de\u590d"],
    jajp: [
      "\u8a2d\u5b9a",
      "\u30d7\u30ec\u30d3\u30e5\u30fc",
      "\u3053\u306e\u30da\u30fc\u30b8\u306e\u4eba\u6c17\u8fd4\u4fe1",
    ],
    kokr: [
      "\uc124\uc815",
      "\ubbf8\ub9ac\ubcf4\uae30",
      "\ud604\uc7ac \ud398\uc774\uc9c0 \uc778\uae30 \ub313\uae00",
    ],
  })) {
    const instance = new JSDOM(
      fixture
        .replace("<html>", '<html lang="zh-CN">')
        .replaceAll('href="/member/reader"', 'href="/signin"'),
      { url: "https://www.v2ex.com/t/123", runScripts: "outside-only", pretendToBeVisual: true },
    );
    const { window } = instance;
    window.document.cookie = `V2EX_LANG=${locale}`;
    let menu;
    const requests = [];
    Object.assign(window, {
      GM_getValue: (key, fallback) =>
        key === "v2ex-lite:options"
          ? { preloadPages: 0, autoCheckIn: true, emoji: true, upload: true }
          : fallback,
      GM_setValue: () => assert.fail("guest settings should not write on startup"),
      GM_listValues: () => [],
      GM_addValueChangeListener: () => {},
      GM_addStyle: () => {},
      GM_registerMenuCommand: (label) => (menu = label),
      GM_xmlhttpRequest: () => requests.push("imgur"),
      fetch: (url) => requests.push(url),
      matchMedia: () => ({ matches: false, addEventListener() {} }),
    });
    window.eval(built);
    await new Promise((resolve) => window.setTimeout(resolve, 0));
    const [settings, preview, popular] = labels;
    assert.equal(menu, `V2EX Lite ${settings}`);
    assert.equal(window.document.querySelector(".v2p-topic-preview-btn").textContent, preview);
    assert.equal(window.document.querySelector("#top_replies > .cell").textContent, popular);
    assert.equal(window.document.querySelector(".vx-upload"), null);
    assert.equal(window.document.querySelector('#reply-box button[type="button"]'), null);
    window.document.querySelector("#vx-settings").click();
    assert.equal(window.document.querySelector('[name="autoCheckIn"]').disabled, true);
    assert.equal(window.document.querySelector('[name="autoFold"]').checked, true);
    assert.deepEqual(requests, []);
    instance.window.close();
  }
});
