import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  cloneTopReply,
  importReply,
  initReplies,
  parseReply,
  rankReplies,
} from "../src/replies.js";
import { dom } from "./helpers.js";

const fixture = readFileSync(new URL("./fixtures/topic.html", import.meta.url), "utf8");

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
    /Could not load replies: offline/,
  );
  assert.equal(document.querySelector("[data-vx-paging] button").disabled, false);
});
