import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { JSDOM } from "jsdom";
import { currentUser } from "../src/dom.js";

const fixture = readFileSync(new URL("./fixtures/topic.html", import.meta.url), "utf8");
const built = readFileSync(new URL("../dist/v2ex-lite.user.js", import.meta.url), "utf8");

test("only owned preview frames bootstrap the theme without account or storage work", async () => {
  assert.equal(/^\/\/ @noframes\s*$/m.test(built), false);
  for (const [owned, html, themed, theme] of [
    [true, fixture, true, "minimalist"],
    [true, fixture, true, "arco-clear"],
    [true, fixture, true, "native"],
    [false, fixture, false, "arco-clear"],
    [true, '<h1>Security verification</h1><div id="challenge-stage"></div>', false, "arco-clear"],
  ]) {
    const instance = new JSDOM("", {
      url: "https://www.v2ex.com/",
      runScripts: "outside-only",
      pretendToBeVisual: true,
    });
    const frame = instance.window.document.createElement("iframe");
    instance.window.document.documentElement.dataset.vxTheme = theme;
    instance.window.document.documentElement.dataset.vxPrivacy = "";
    if (owned) frame.className = "v2p-topic-preview-frame";
    frame.style.visibility = "hidden";
    instance.window.document.body.append(frame);
    const view = frame.contentWindow;
    const doc = view.document;
    doc.open();
    doc.write(html);
    doc.close();
    const calls = [];
    for (const name of [
      "GM_getValue",
      "GM_setValue",
      "GM_registerMenuCommand",
      "GM_xmlhttpRequest",
      "fetch",
    ])
      view[name] = () => calls.push(name);
    view.GM_addStyle = (css) => {
      calls.push("style");
      const style = doc.createElement("style");
      style.textContent = css;
      doc.head.append(style);
      return style;
    };
    view.eval(built);
    await new Promise(setImmediate);
    assert.deepEqual(calls, themed ? ["style"] : []);
    assert.equal(doc.documentElement.dataset.v2pPreview, themed ? "1" : undefined);
    assert.equal(doc.documentElement.dataset.vxTheme, themed ? theme : undefined);
    assert.equal(doc.documentElement.hasAttribute("data-vx-privacy"), false);
    assert.equal(doc.querySelectorAll("#v2ex-lite-theme").length, themed ? 1 : 0);
    assert.equal(frame.style.visibility, owned ? "" : "hidden");
    instance.window.close();
  }
});

test("privacy prepares the header before main content and preserves account detection", async () => {
  for (const theme of ["minimalist", "arco-clear", "native"]) {
    for (const privacy of [true, false, "true"]) {
      const { window } = new JSDOM("", {
        url: "https://www.v2ex.com/",
        runScripts: "outside-only",
        pretendToBeVisual: true,
      });
      await new Promise((resolve) => window.addEventListener("load", resolve, { once: true }));
      const doc = window.document;
      let phase = "loading";
      const errors = [];
      window.addEventListener("error", (event) => errors.push(event.error));
      Object.defineProperty(doc, "readyState", { get: () => phase });
      let menus = 0;
      Object.assign(window, {
        GM_getValue: (key, fallback) =>
          key === "v2ex-lite:options"
            ? { theme, privacy, autoCheckIn: false, preloadPages: 0, userCards: false }
            : fallback,
        GM_addStyle(css) {
          assert.equal(doc.documentElement.hasAttribute("data-vx-privacy"), privacy === true);
          assert.equal(Boolean(doc.querySelector("#Logo svg")), privacy === true);
          const style = doc.createElement("style");
          style.textContent = css;
          doc.head.append(style);
          return style;
        },
        GM_setValue: () => assert.fail("unexpected storage write"),
        GM_deleteValue() {},
        GM_listValues: () => [],
        GM_addValueChangeListener() {},
        GM_registerMenuCommand: () => menus++,
        GM_xmlhttpRequest: () => assert.fail("unexpected upload"),
        fetch: () => assert.fail("unexpected request"),
        matchMedia: () => ({ matches: false, addEventListener() {} }),
        unsafeWindow: window,
      });
      window.eval(built);
      doc.head.insertAdjacentHTML("beforeend", '<link rel="icon" href="/favicon.ico">');
      doc.body.innerHTML = `<div id="Top"><a href="/"><div id="Logo"></div></a>
        <div class="tools"><a class="top" href="/member/Reader">Reader</a></div></div>`;
      await new Promise(setImmediate);
      assert.equal(doc.getElementById("Main"), null);
      const logo = doc.querySelector("#Logo svg");
      assert.equal(Boolean(logo), privacy === true);
      assert.equal(menus, 0);
      assert.equal(currentUser(doc), "Reader");
      assert.equal(
        window.getComputedStyle(doc.querySelector("#Top .top")).display === "none",
        privacy === true,
      );
      assert.equal(
        doc.querySelector('link[rel="icon"]').getAttribute("href"),
        privacy === true ? "https://v2p.leoku.dev/favicon.svg" : "/favicon.ico",
      );
      doc.body.insertAdjacentHTML("beforeend", '<div id="Main"></div><div id="Bottom"></div>');
      phase = "interactive";
      doc.dispatchEvent(new window.Event("DOMContentLoaded"));
      assert.equal(menus, 1);
      assert.equal(
        doc.querySelector("#Logo svg"),
        logo,
        "initialization must not replace the logo again",
      );
      assert.equal(currentUser(doc), "Reader");
      assert.equal(doc.querySelectorAll("#v2ex-lite-theme").length, 1);
      assert.deepEqual(errors, []);
      window.close();
    }
  }
});

test("saved themes are selected before the first style and recover from invalid or unavailable options", async () => {
  for (const [saved, expected, failFirstRead] of [
    ["arco-clear", "arco-clear", false],
    ["native", "native", false],
    [undefined, "minimalist", false],
    ["unknown", "minimalist", false],
    ["arco-clear", "minimalist", true],
  ]) {
    const instance = new JSDOM(fixture, {
      url: "https://www.v2ex.com/t/123",
      runScripts: "outside-only",
      pretendToBeVisual: true,
    });
    const { window } = instance;
    const doc = window.document;
    const reads = [];
    let phase = "loading";
    Object.defineProperty(doc, "readyState", { get: () => phase });
    doc.addEventListener("DOMContentLoaded", () => (phase = "interactive"), { once: true });
    const options = {
      theme: saved,
      privacy: true,
      autoCheckIn: false,
      preloadPages: 0,
      userCards: false,
      tags: false,
    };
    Object.assign(window, {
      GM_getValue(key, fallback) {
        if (key !== "v2ex-lite:options") return fallback;
        reads.push(phase);
        if (failFirstRead && reads.length === 1) throw new Error("Storage unavailable");
        return options;
      },
      GM_addStyle(css) {
        assert.equal(doc.documentElement.dataset.vxTheme, expected);
        assert.equal(phase, "loading");
        const style = doc.createElement("style");
        style.textContent = css;
        doc.head.append(style);
        return style;
      },
      GM_setValue: () => assert.fail("unexpected storage write"),
      GM_deleteValue() {},
      GM_listValues: () => [],
      GM_addValueChangeListener() {},
      GM_registerMenuCommand() {},
      GM_xmlhttpRequest: () => assert.fail("unexpected upload"),
      fetch: () => assert.fail("unexpected network request"),
      matchMedia: () => ({ matches: false, addEventListener() {} }),
      unsafeWindow: window,
    });
    window.eval(built);
    assert.deepEqual(reads, ["loading"]);
    await new Promise(setImmediate);
    assert.deepEqual(reads, ["loading", "interactive"]);
    assert.equal(doc.documentElement.dataset.vxTheme, expected);
    assert.equal(doc.documentElement.hasAttribute("data-vx-privacy"), true);
    assert.ok(doc.querySelector("#Logo svg"));
    assert.equal(doc.querySelectorAll("#v2ex-lite-theme").length, 1);
    instance.window.close();
  }
});

test("theme applies before DOMContentLoaded and functional initialization", async () => {
  const events = [];
  const reads = [];
  const instance = new JSDOM(fixture, {
    url: "https://www.v2ex.com/t/123",
    runScripts: "outside-only",
    pretendToBeVisual: true,
    beforeParse(window) {
      const doc = window.document;
      doc.addEventListener("DOMContentLoaded", () => events.push("ready"), { once: true });
      Object.assign(window, {
        GM_getValue: (key, fallback) => {
          reads.push(doc.readyState);
          return key === "v2ex-lite:options"
            ? { autoCheckIn: false, preloadPages: 0, userCards: false }
            : fallback;
        },
        GM_setValue: () => assert.fail("unexpected storage write"),
        GM_deleteValue: () => {},
        GM_listValues: () => [],
        GM_addValueChangeListener: () => {},
        GM_addStyle: (css) => {
          events.push("theme");
          const style = doc.createElement("style");
          style.textContent = css;
          doc.head.append(style);
        },
        GM_registerMenuCommand: () => events.push("menu"),
        GM_xmlhttpRequest: () => assert.fail("unexpected upload"),
        fetch: () => assert.fail("unexpected network request"),
        matchMedia: () => ({ matches: false, addEventListener() {} }),
        unsafeWindow: window,
      });
      assert.equal(doc.documentElement, null);
      window.eval(built);
    },
  });
  await new Promise(setImmediate);
  assert.deepEqual(events, ["theme", "ready", "menu"]);
  assert.ok(reads.length > 0);
  assert.equal(reads.includes("loading"), false);
  assert.equal(instance.window.document.documentElement.dataset.v2pTheme, "minimalist");
  assert.equal(instance.window.document.querySelectorAll("style").length, 1);
  instance.window.close();
});

test("V2EX navigation applies the theme while the main panel is still streaming", async () => {
  for (const url of [
    "https://www.v2ex.com/?tab=hot",
    "https://www.v2ex.com/t/123",
    "https://www.v2ex.com/member/Alice",
    "https://www.v2ex.com/my/nodes",
    "https://www.v2ex.com/my/topics",
    "https://www.v2ex.com/my/following",
    "https://www.v2ex.com/write",
    "https://www.v2ex.com/notes",
    "https://edge.v2ex.com/chat",
    "https://edge.v2ex.com/planes",
  ]) {
    const { window } = new JSDOM("", { url, runScripts: "outside-only", pretendToBeVisual: true });
    await new Promise((resolve) => window.addEventListener("load", resolve, { once: true }));
    const doc = window.document;
    let phase = "loading";
    let menus = 0;
    Object.defineProperty(doc, "readyState", { get: () => phase });
    Object.assign(window, {
      GM_getValue: (key, fallback) =>
        key === "v2ex-lite:options" ? { theme: "arco-clear", privacy: false } : fallback,
      GM_setValue: () => assert.fail("unexpected storage write"),
      GM_deleteValue() {},
      GM_listValues: () => [],
      GM_addValueChangeListener() {},
      GM_addStyle(css) {
        const style = doc.createElement("style");
        style.textContent = css;
        doc.head.append(style);
        return style;
      },
      GM_registerMenuCommand: () => menus++,
      fetch: () => assert.fail("unexpected network request"),
      matchMedia: () => ({ matches: false, addEventListener() {} }),
    });
    window.eval(built);
    doc.body.innerHTML = '<div id="Top"><a href="/"><div id="Logo"></div></a></div>';
    await new Promise(setImmediate);
    assert.equal(doc.getElementById("Main"), null, url);
    assert.equal(doc.documentElement.dataset.vxTheme, "arco-clear", url);
    assert.equal(doc.querySelectorAll("#v2ex-lite-theme").length, 1, url);
    assert.equal(menus, 0, url);
    doc.body.insertAdjacentHTML("beforeend", '<div id="Main"></div><div id="Bottom"></div>');
    phase = "interactive";
    doc.dispatchEvent(new window.Event("DOMContentLoaded"));
    assert.equal(menus, 1, url);
    assert.equal(doc.querySelectorAll("#v2ex-lite-theme").length, 1, url);
    window.close();
  }
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
    GM_deleteValue: (key) => data.delete(key),
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
  const settingsShortcut = window.document.querySelector(".vx-settings-shortcut button");
  assert.ok(settingsShortcut.querySelector("svg"));
  assert.equal(settingsShortcut.getAttribute("aria-label"), "\u8bbe\u7f6e");
  settingsShortcut.click();
  assert.equal(window.document.querySelectorAll("#vx-settings-dialog").length, 1);
  window.document.querySelector("#vx-settings-dialog .v2p-modal-close-btn").click();
  assert.equal(window.document.querySelector("#Bottom .v2p-footer-text").textContent, "V2EX Lite");
  assert.equal(window.document.querySelectorAll(".vx-upload").length, 1);
  assert.ok(window.document.querySelector('#reply-box button[aria-expanded="false"]'));
  const draft = window.document.querySelector("#reply_content");
  draft.value = "Existing draft";
  draft.scrollIntoView = () => assert.fail("opening the reply box must preserve scrolling");
  let floatedReply = 0;
  window.setReplyBoxSticky = () => {
    floatedReply++;
    window.document.querySelector("#reply-box").classList.add("reply-box-sticky");
  };
  Object.defineProperty(window, "scrollY", { configurable: true, value: 320 });
  window.dispatchEvent(new window.Event("scroll"));
  window.document.querySelector(".vx-quick-reply").click();
  assert.equal(floatedReply, 1);
  assert.equal(
    window.document.querySelector("#reply-box").classList.contains("reply-box-sticky"),
    true,
  );
  assert.equal(window.scrollY, 320);
  assert.equal(window.document.activeElement, draft);
  assert.equal(draft.value, "Existing draft");
  const top = window.document.querySelector(".vx-back-to-top");
  assert.equal(top.querySelector("svg").getAttribute("aria-hidden"), "true");
  assert.equal(
    top.getAttribute("aria-label"),
    top.querySelector(".vx-page-action-hint").textContent,
  );
  assert.ok(window.document.querySelector(".vx-quick-reply svg"));
  Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
  window.dispatchEvent(new window.Event("scroll"));
  assert.equal(top.hidden, true);
  Object.defineProperty(window, "scrollY", { configurable: true, value: 320 });
  window.dispatchEvent(new window.Event("scroll"));
  assert.equal(top.hidden, false);
  let jumpedToTop;
  window.scrollTo = (options) => (jumpedToTop = options.top);
  const rightbar = window.document.querySelector("#Rightbar");
  rightbar.scrollTop = 240;
  top.click();
  assert.equal(jumpedToTop, 0);
  assert.equal(rightbar.scrollTop, 0);
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
  assert.equal(window.document.documentElement.hasAttribute("data-vx-privacy"), false);
  assert.deepEqual(calls, []);
  window.document.body.insertAdjacentHTML("beforeend", '<div id="Top"></div><div id="Main"></div>');
  await new Promise((resolve) => window.setTimeout(resolve, 0));
  assert.deepEqual(calls, []);
  instance.window.close();
});

test("script language preferences localize modules and guests skip account features", async () => {
  const translations = {
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
  };
  for (const [language, locale, expected] of [
    [undefined, "enus", "zhcn"],
    ["en", "jajp", "enus"],
    ["ja", "enus", "jajp"],
    ["ko", "enus", "kokr"],
    ...Object.keys(translations).map((locale) => ["site", locale, locale]),
  ]) {
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
          ? { language, preloadPages: 0, autoCheckIn: true, emoji: true, upload: true }
          : fallback,
      GM_setValue: () => assert.fail("guest settings should not write on startup"),
      GM_deleteValue: () => assert.fail("guest settings should not delete on startup"),
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
    const [settings, preview, popular] = translations[expected];
    assert.equal(menu, `V2EX Lite ${settings}`);
    assert.equal(window.document.querySelector(".v2p-topic-preview-btn").textContent, preview);
    assert.equal(window.document.querySelector("#top_replies > .cell").textContent, popular);
    assert.equal(window.document.querySelector(".vx-upload"), null);
    assert.equal(window.document.querySelector(".vx-quick-reply"), null);
    assert.equal(window.document.querySelector('#reply-box button[type="button"]'), null);
    window.document.querySelector("#vx-settings").click();
    assert.equal(window.document.querySelector('[name="language"]').value, language ?? "zh");
    assert.ok(window.document.querySelector(".vx-settings-tag-manager summary"));
    assert.equal(window.document.querySelector('[name="autoCheckIn"]').disabled, true);
    assert.equal(window.document.querySelector('[name="autoFold"]').checked, true);
    assert.deepEqual(requests, []);
    instance.window.close();
  }
});
