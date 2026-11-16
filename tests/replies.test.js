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
