import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  cloneTopReply,
  enhanceReplyActions,
  importReply,
  initReplies,
  parseReply,
  rankReplies,
} from "../src/replies.js";
import { dom } from "./helpers.js";
import { t } from "../src/i18n.js";

const fixture = readFileSync(new URL("./fixtures/topic.html", import.meta.url), "utf8");

test("Polish reply icons preserve native handlers, counts and thanked state", () => {
  dom(
    '<div id="Main"><div class="cell" id="r_1"><strong><a href="/member/Alice">Alice</a></strong><span class="no">1</span><span class="small fade"><img src="/static/img/heart.png">2</span><div class="thank_area" id="thank_area_1"><a href="#;" onclick="ignoreReply(1, 42)">Hide</a><a href="#;" onclick="thankReply(1)">Thank</a></div></div></div>',
  );
  const area = document.querySelector(".thank_area");
  const original = area.lastElementChild;
  let clicks = 0;
  original.addEventListener("click", (event) => {
    event.preventDefault();
    clicks++;
  });
  enhanceReplyActions(document);
  enhanceReplyActions(document);
  assert.equal(document.querySelectorAll(".v2p-control-hide svg").length, 1);
  assert.equal(document.querySelectorAll(".v2p-control-thank svg").length, 1);
  assert.equal(document.querySelector(".v2p-control-thank").parentElement, original);
  assert.equal(original.getAttribute("onclick"), "thankReply(1)");
  original.click();
  assert.equal(clicks, 1);
  assert.equal(parseReply(document.querySelector("#r_1")).thanks, 2);
  area.classList.add("thanked");
  area.innerHTML = '<a href="#;" onclick="ignoreReply(1, 42)">Hide</a> Thanks sent';
  enhanceReplyActions(area);
  assert.equal(area.querySelectorAll(".v2p-control-hide").length, 1);
  assert.equal(area.querySelector(".v2p-control-thank").getAttribute("aria-disabled"), "true");
  assert.equal(document.querySelector(".v2p-likes-box").classList.contains("v2p-thanked"), true);
  assert.doesNotMatch(area.textContent, /Thanks sent/);
});

test("imported replies and REP hot replies retain the native table structure", () => {
  dom(
    `<div class="cell" id="r_1"><table cellpadding="0" cellspacing="0" border="0" width="100%"><tbody><tr><td width="48" valign="top"><a href="/member/Alice"><img class="avatar" src="https://cdn.v2ex.com/avatar/example.png" width="48" alt="Alice"></a></td><td width="10"></td><td valign="top"><div class="flex-one-row"><div class="flex-one-row gap10"><strong><a href="/member/Alice">Alice</a></strong><span class="ago">now</span><span><img src="/heart.png">2</span></div><div class="fr"><span class="no">1</span></div></div><div class="reply_content"><pre><code>const answer = 42;</code></pre></div></td></tr></tbody></table></div>`,
  );
  const copy = importReply(document.querySelector("#r_1"), location.href);
  assert.equal(copy.querySelector("td").getAttribute("width"), "48");
  assert.equal(copy.querySelector("img.avatar").getAttribute("width"), "48");
  assert.equal(copy.querySelector("pre code").textContent, "const answer = 42;");
  const hot = cloneTopReply(parseReply(copy));
  assert.ok(hot.querySelector(".vr_wrapper > table"));
  assert.equal(hot.querySelector("a.no").getAttribute("href"), "#r_1");
  assert.equal(hot.querySelector("pre code").textContent, "const answer = 42;");
});

test("thanks sorting uses floor order for ties", () => {
  dom(fixture);
  const reply = parseReply(document.querySelector("#r_10"));
  assert.equal(reply.name, "Alice");
  assert.equal(reply.thanks, 2);
  assert.deepEqual(
    rankReplies([
      { id: "b", thanks: 2, floor: 3 },
      { id: "a", thanks: 2, floor: 1 },
      { id: "c", thanks: 0, floor: 2 },
    ]).map((row) => row.id),
    ["a", "b"],
  );
});

test("hot reply metadata shares the first row without moving the original likes", () => {
  const { window } = dom(`<div id="Main"><div class="cell" id="r_12"><table><tbody><tr><td>
    <div class="flex-one-row"><div class="flex-one-row gap10"><strong><a href="/member/Alice">Alice</a></strong>
    <span class="ago">now</span><span class="small fade flex-one-row gap5"><img src="/heart.png">123</span></div>
    <div class="fr"><span class="no">12</span></div></div><div class="reply_content">Reply</div>
    </td></tr></tbody></table></div></div>`);
  enhanceReplyActions(document);
  const source = document.querySelector("#r_12");
  const likes = source.querySelector(".v2p-likes-box");
  const originalParent = likes.parentElement;
  const hot = cloneTopReply(parseReply(source));
  const meta = hot.querySelector(".vx-hot-meta");
  assert.equal(meta.firstElementChild.classList.contains("v2p-likes-box"), true);
  assert.equal(meta.firstElementChild.textContent, "123");
  assert.equal(meta.lastElementChild.getAttribute("href"), "#r_12");
  assert.equal(meta.parentElement.querySelector("strong a").textContent, "Alice");
  assert.equal(hot.querySelector(".ago").parentElement.parentElement, meta.previousElementSibling);
  assert.equal(likes.parentElement, originalParent);
  assert.equal(parseReply(source).thanks, 123);
  let jumped = false;
  source.scrollIntoView = () => (jumped = true);
  meta.lastElementChild.click();
  assert.equal(jumped, true);
  window.close();
});

test("hot replies retain unchanged rows and update counts, ordering and empty states", () => {
  const row = (floor, thanks) => `<div class="cell" id="r_${floor}"><table><tbody><tr><td>
    <div class="flex-one-row"><div class="flex-one-row"><strong><a href="/member/Member${floor}">Member${floor}</a></strong>
    <span class="small fade"><img src="/heart.png"><span class="thank_count">${thanks}</span></span></div>
    <div class="fr"><span class="no">${floor}</span></div></div>
    <div class="reply_content">Complete reply ${floor}</div></td></tr></tbody></table></div>`;
  const { window } = dom(
    `<div id="Rightbar"><div class="box"></div></div><div id="Main"><div class="box">${row(1, 2)}${row(2, 5)}${row(3, 0)}</div></div>`,
  );
  enhanceReplyActions(document);
  const module = initReplies({
    options: { hotReplies: true, preloadPages: 0 },
    enhance: () => {},
    getDocument: () => assert.fail("unexpected page load"),
  });
  const panel = document.querySelector("#top_replies");
  const header = panel.firstElementChild;
  const unchanged = document.querySelector("#top_r_2");
  const original = document.querySelector("#top_r_1");
  const ids = () =>
    [...document.querySelectorAll('#top_replies > [id^="top_r_"]')].map((n) => n.id);
  const update = (id, count) => {
    const reply = document.querySelector(`#r_${id}`);
    reply.querySelector(".thank_count").textContent = String(count);
    module.update([reply]);
  };
  assert.deepEqual(ids(), ["top_r_2", "top_r_1"]);
  update(1, 9);
  assert.equal(document.querySelector("#top_replies"), panel);
  assert.equal(panel.firstElementChild, header);
  assert.equal(document.querySelector("#top_r_2"), unchanged);
  assert.notEqual(document.querySelector("#top_r_1"), original);
  assert.equal(document.querySelector("#top_r_1 .thank_count").textContent, "9");
  assert.equal(document.querySelector("#top_r_1 .reply_content").textContent, "Complete reply 1");
  assert.deepEqual(ids(), ["top_r_1", "top_r_2"]);
  const updated = document.querySelector("#top_r_1");
  update(1, 9);
  assert.equal(document.querySelector("#top_r_1"), updated);
  document.querySelector("#r_2 .reply_content").textContent = "Updated reply 2";
  module.invalidate(document.querySelector("#r_2"));
  update(2, 5);
  assert.notEqual(document.querySelector("#top_r_2"), unchanged);
  assert.equal(document.querySelector("#top_r_2 .reply_content").textContent, "Updated reply 2");
  const changed = document.querySelector("#r_2");
  changed.classList.add("v2p-blocked-reply");
  module.update([changed]);
  assert.deepEqual(ids(), ["top_r_1"]);
  changed.classList.remove("v2p-blocked-reply");
  module.update([changed]);
  assert.deepEqual(ids(), ["top_r_1", "top_r_2"]);
  changed.style.display = "none";
  module.update([changed]);
  assert.deepEqual(ids(), ["top_r_1"]);
  changed.style.removeProperty("display");
  module.update([changed]);
  update(2, 0);
  assert.equal(unchanged.isConnected, false);
  assert.deepEqual(ids(), ["top_r_1"]);
  update(1, 0);
  assert.equal(document.querySelector("#top_replies"), null);
  assert.equal(document.querySelector("[data-vx-hot-gap]"), null);
  update(3, 1);
  const retained = document.querySelector("#top_r_3");
  document.querySelector("[data-vx-paging]").insertAdjacentHTML("beforebegin", row(4, 7));
  module.add(document.querySelector("#r_4"));
  assert.equal(document.querySelector("#top_r_3"), retained);
  assert.deepEqual(ids(), ["top_r_4", "top_r_3"]);
  let jumped = false;
  document.querySelector("#r_3").scrollIntoView = () => (jumped = true);
  retained.querySelector("a.no").click();
  assert.equal(jumped, true);
  document.querySelector("#r_3").remove();
  module.update([module.replies.get("r_3").node]);
  assert.equal(module.replies.has("r_3"), false);
  assert.deepEqual(ids(), ["top_r_4"]);
  window.close();
});

test("preloaded tree replies retain validated geometry and native delegated toggles", async () => {
  const { window } = dom(`<div id="Main"><div class="box reply-threads-d">
    <a class="page_normal" href="/t/123?p=2">2</a>
    <div class="cell" id="r_1" data-depth="0" style="--depth:0"><div class="reply_content">Root</div></div>
    </div></div>`);
  const page = new DOMParser().parseFromString(
    `<div id="Main"><div class="box reply-threads-d">
    <div class="cell" id="r_2" data-depth="1" style="--depth:1;color:red;position:fixed" onclick="bad()">
      <button class="reply-toggle reply-toggle-big" aria-expanded="true" aria-label="Toggle replies" onclick="bad()" formaction="https://evil.test">2 replies</button>
      <button class="reply-tree-more" onclick="bad()">2 replies</button>
      <div class="reply-tree-line" data-for="1" style="--level:0;background:url(https://evil.test/x)"></div>
      <div class="reply_content"><button class="reply-toggle">Untrusted</button><span style="--level:1;color:red">Answer</span></div>
    </div>
    <div class="cell" id="r_3" data-depth="2" style="--depth:var(--unsafe)"><div class="reply-tree-line" style="--level:var(--unsafe)"></div><div class="reply_content">Child</div></div>
    <div class="cell" id="r_4" data-depth="invalid" style="--depth:2"><button class="reply-toggle">Invalid</button></div>
    <div class="cell" id="r_5" data-depth="12" style="--depth:4"><div class="reply_content">Deep reply</div></div>
    </div></div>`,
    "text/html",
  );
  const box = document.querySelector(".reply-threads-d");
  let toggled;
  box.addEventListener("click", (event) => {
    const toggle = event.target.closest(".reply-toggle");
    if (toggle) toggled = toggle.closest(".cell").id;
  });
  const module = initReplies({
    options: { hotReplies: false, preloadPages: 1 },
    enhance() {},
    getDocument: async () => page,
  });
  await module.preload();
  const row = document.querySelector("#r_2");
  assert.equal(row.style.cssText, "--depth: 1;");
  assert.equal(row.querySelector(".reply-tree-line").style.cssText, "--level: 0;");
  assert.equal(row.querySelector(".reply-tree-line").dataset.for, "1");
  const toggle = row.querySelector(".reply-toggle");
  assert.equal(toggle.type, "button");
  assert.equal(toggle.getAttribute("aria-expanded"), "true");
  assert.equal(toggle.hasAttribute("formaction"), false);
  toggle.click();
  assert.equal(toggled, "r_2");
  assert.equal(row.querySelector(".reply-tree-more").type, "button");
  assert.equal(row.querySelector(".reply-tree-more").textContent, "2 replies");
  const hot = cloneTopReply(parseReply(row));
  assert.equal(hot.querySelector(".reply-toggle,.reply-tree-more,.reply-tree-line"), null);
  assert.equal(
    row.querySelectorAll("[onclick],.reply_content [style],.reply_content button").length,
    0,
  );
  assert.equal(document.querySelector("#r_3").style.getPropertyValue("--depth"), "2");
  assert.equal(document.querySelector("#r_3 .reply-tree-line").hasAttribute("style"), false);
  assert.equal(document.querySelector("#r_4").hasAttribute("style"), false);
  assert.equal(document.querySelector("#r_4 button"), null);
  assert.equal(document.querySelector("#r_5").style.getPropertyValue("--depth"), "4");
  assert.equal(document.querySelector("#r_5").dataset.depth, "12");
  window.close();
});

test("nested replies cannot donate their thanks count to a parent", () => {
  dom(
    '<div class="cell" id="r_1"><strong><a href="/member/parent">parent</a></strong><span class="no">1</span><div class="reply_content">parent</div><div class="cell" id="r_2"><strong><a href="/member/child">child</a></strong><span><img src="/heart.png">9</span><div class="reply_content">child</div></div></div>',
  );
  assert.equal(parseReply(document.querySelector("#r_1")).thanks, 0);
  assert.equal(parseReply(document.querySelector("#r_2")).thanks, 9);
});

test("preloaded pages deduplicate replies, preserve order, and refresh popular replies", async () => {
  dom(fixture);
  let calls = 0;
  const module = initReplies({
    options: { hotReplies: true, preloadPages: 2 },
    enhance: () => {},
    getDocument: async () => {
      calls++;
      const id = 12 + calls;
      return new DOMParser().parseFromString(
        `<div id="Main"><div class="cell" id="r_11"><div class="reply_content">duplicate</div></div><div class="cell" id="r_${id}"><strong><a href="/member/Carol">Carol</a></strong><span class="no">${id - 9}</span><span><img src="/heart.png">20</span><div class="reply_content"><b>new</b><script>bad()</script></div></div></div>`,
        "text/html",
      );
    },
  });
  await module.preload();
  assert.equal(calls, 2);
  assert.equal(module.replies.size, 5);
  assert.equal(document.querySelectorAll("#r_11").length, 1);
  assert.deepEqual(
    [...document.querySelectorAll('.cell[id^="r_"]')].map((node) => node.id),
    ["r_10", "r_11", "r_12", "r_13", "r_14"],
  );
  assert.equal(document.querySelector("#top_replies a.no").getAttribute("href"), "#r_13");
  assert.equal(module.loaded.size, 3);
  assert.equal(document.querySelector("[data-vx-paging]").hidden, true);
  assert.doesNotMatch(document.querySelector("#Main").textContent, /Loaded \d/);
  assert.equal(document.querySelector("[data-vx-loaded] script"), null);
});

test("failed page stops automatic preloading and leaves manual retry available", async () => {
  dom(fixture);
  let calls = 0;
  const module = initReplies({
    options: { hotReplies: true, preloadPages: 2 },
    enhance: () => {},
    getDocument: async () => {
      calls++;
      throw new Error("offline");
    },
  });
  await module.preload();
  assert.equal(calls, 1);
  assert.equal(module.replies.size, 3);
  assert.match(
    document.querySelector("[data-vx-paging]").textContent,
    new RegExp(t("pageFailed", 2, "offline")),
  );
  assert.equal(document.querySelector("[data-vx-paging] button").disabled, false);
});

test("reply pagination follows reading position and shares in-flight page loads", async () => {
  const { window } = dom(
    fixture
      .replace('href="/t/123?p=3">3</a>', 'href="/t/123?p=4">4</a>')
      .replace(
        '</div><div class="box"><form',
        '<div class="cell ps_container"><a class="page_current" href="?p=1">1</a></div></div><div class="box"><form',
      ),
  );
  const calls = [],
    jumps = [];
  let resume;
  window.HTMLElement.prototype.scrollIntoView = function () {
    jumps.push(Number(this.dataset.vxPageStart));
  };
  const module = initReplies({
    options: { hotReplies: false, preloadPages: 2 },
    enhance: () => {},
    getDocument: async (url) => {
      const page = Number(new URL(url).searchParams.get("p"));
      calls.push(page);
      if (page === 2) await new Promise((resolve) => (resume = resolve));
      return new DOMParser().parseFromString(
        `<div id="Main"><div class="cell" id="r_${page * 100}"><span class="no">${page * 100}</span></div></div>`,
        "text/html",
      );
    },
  });
  const automatic = module.preload();
  const jump = module.paging.navigate(2);
  await Promise.resolve();
  assert.deepEqual(calls, [2]);
  resume();
  await Promise.all([automatic, jump]);
  assert.deepEqual(calls, [2, 3]);
  assert.deepEqual(jumps, [2]);
  const bottom = module.paging.bottom;
  assert.ok(bottom.matches(".ps_container"));
  assert.equal(bottom, document.querySelector("#replies").lastElementChild);
  bottom.querySelector('[data-vx-direction="1"]').click();
  assert.deepEqual(jumps, [2, 3]);
  bottom.querySelector('[data-vx-page="1"]').click();
  assert.deepEqual(jumps, [2, 3, 1]);
  for (const [index, marker] of [...document.querySelectorAll("[data-vx-page-start]")].entries())
    marker.getBoundingClientRect = () => ({ top: index === 2 ? 30 : -100 });
  module.paging.trackReading();
  assert.equal(bottom.querySelector('[aria-current="page"]').textContent, "3");
  await module.paging.navigate(4);
  assert.deepEqual(calls, [2, 3, 4]);
  assert.deepEqual(jumps, [2, 3, 1, 4]);
  assert.equal(bottom.querySelector('[aria-current="page"]').textContent, "4");
  assert.equal(bottom.previousElementSibling.previousElementSibling.id, "r_400");
  assert.equal(location.search, "");
  window.close();
});

test("imported account actions call only the matching native callbacks after confirmation", async () => {
  const { window } = dom('<div id="Main"></div>');
  const [row] = new DOMParser().parseFromString(
    `<div class="cell" id="r_201"><strong><a href="/member/Alice">Alice</a></strong>
    <div class="thank_area" id="thank_area_201">
      <a href="#;" onclick="ignoreReply(201, 42)">Hide</a>
      <a href="#;" onclick="if (confirm('Spend 2 copper?')) thankReply(201)">Thank</a>
    </div><a href="#;" onclick="replyOne('Alice', 201)">Reply</a>
    <div class="reply_content"><a href="#r_201" onclick="thankReply(201)">Fake action</a></div></div>`,
    "text/html",
  ).body.children;
  const imported = importReply(row, "https://www.v2ex.com/t/123?p=3");
  document.querySelector("#Main").append(imported);
  const calls = [],
    notices = [];
  let confirmed = false;
  window.confirm = (notice) => (notices.push(notice), confirmed);
  enhanceReplyActions(document, {
    fetchOnce: async () => "456",
    ignoreReply: (id, token) => calls.push(["hide", id, token]),
    thankReply: async (id) => calls.push(["thank", id]),
    replyOne: (name, id) => calls.push(["reply", name, id]),
  });
  const [hide, thank, reply] = imported.querySelectorAll('a[href$="#r_201"]');
  assert.equal(imported.querySelectorAll("[onclick]").length, 0);
  assert.equal(imported.querySelector(".v2p-control-thank").parentElement, thank);
  assert.equal(imported.querySelector(".v2p-control-hide").parentElement, hide);
  assert.equal(parseReply(imported).name, "Alice");
  assert.equal(reply.getAttribute("href"), "https://www.v2ex.com/t/123?p=3#r_201");
  thank.click();
  assert.deepEqual(calls, []);
  confirmed = true;
  thank.click();
  thank.click();
  hide.click();
  reply.click();
  await Promise.resolve();
  await Promise.resolve();
  assert.deepEqual(calls, [
    ["thank", 201],
    ["reply", "Alice", 201],
    ["hide", 201, "456"],
  ]);
  assert.match(notices[0], /2.*Alice/);
  assert.equal(imported.querySelector(".reply_content .v2p-control"), null);
  window.close();
});
