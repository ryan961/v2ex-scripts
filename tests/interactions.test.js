import assert from "node:assert/strict";
import test from "node:test";
import { createTopics } from "../src/preview.js";
import { createMembers } from "../src/members.js";
import { createStorage } from "../src/storage.js";
import { dom, memoryAPI } from "./helpers.js";

test("Polish preview markup uses a same-origin iframe and removes it on close", async () => {
  dom(
    '<div id="Main"><div class="cell item"><span class="item_title"><a href="/t/456">Preview title</a></span><span class="topic_info"><span title="timestamp">now</span></span></div></div>',
  );
  const topics = createTopics({ preview: true, newTab: true });
  topics.enhance(document);
  topics.enhance(document);
  const preview = document.querySelector("button");
  assert.equal(document.querySelectorAll("button").length, 1);
  assert.equal(document.querySelector(".item_title").nextElementSibling, preview);
  assert.equal(preview.classList.contains("vx-preview-visible"), true);
  assert.equal(document.querySelector(".topic_info button"), null);
  assert.equal(document.querySelector(".item_title button"), null);
  preview.click();
  await new Promise(setImmediate);
  assert.equal(document.querySelector(".v2p-modal-title").textContent, "Preview title");
  assert.equal(document.querySelector("iframe").src, "https://www.v2ex.com/t/456?v2p-preview=1");
  assert.equal(document.querySelector(".v2p-modal-main").getAttribute("role"), "dialog");
  document.querySelector(".v2p-modal-close-btn").click();
  await new Promise(setImmediate);
  assert.equal(document.querySelector(".v2p-modal-mask"), null);
  preview.click();
  await new Promise(setImmediate);
  assert.equal(document.querySelectorAll("iframe").length, 1);
  assert.equal(
    document.querySelector(".v2p-topic-preview-title-link").href,
    "https://www.v2ex.com/t/456",
  );
  document.querySelector(".v2p-modal-close-btn").click();
});

test("editing one member updates all visible instances without duplicate controls", () => {
  dom(
    '<div id="Main"><strong><a href="/member/Alice">Alice</a></strong><strong><a href="/member/Alice">Alice</a></strong></div>',
  );
  const api = memoryAPI();
  const store = createStorage(api);
  const members = createMembers(store, { tags: true, userCards: false });
  members.enhance(document);
  members.enhance(document);
  assert.equal(document.querySelectorAll(".vx-tags").length, 2);
  members.edit("Alice");
  document.querySelector(".v2p-modal-content textarea").value = "backend, database";
  [...document.querySelectorAll(".v2p-modal-main button")]
    .find((node) => node.textContent === "\u786e\u8ba4\u8bbe\u7f6e")
    .click();
  assert.deepEqual(store.getTags("alice"), ["backend", "database"]);
  assert.equal(document.querySelectorAll(".v2p-reply-tags:not([hidden])").length, 2);
  assert.equal(document.querySelectorAll(".vx-tags button").length, 0);
  assert.match(document.querySelector(".v2p-reply-tags").textContent, /backend/);
  assert.equal(api.writes.length, 1);
});

test("tags retain the Polish header and inline reply positions", () => {
  dom(
    '<div id="Main"><div class="header"><a href="/member/Alice">Alice</a></div><div class="cell" id="r_1"><table><tbody><tr><td><div class="flex-one-row"><strong><a href="/member/Alice">Alice</a></strong><div class="badges"></div><span class="ago">now</span></div><div class="reply_content">Body</div></td></tr></tbody></table></div></div>',
  );
  const store = createStorage(memoryAPI());
  store.setTags("Alice", ["backend"]);
  createMembers(store, { tags: true, userCards: false }).enhance(document);
  assert.equal(
    document.querySelector(".header").lastElementChild.classList.contains("v2p-reply-tags"),
    true,
  );
  assert.equal(
    document
      .querySelector(".badges")
      .previousElementSibling.classList.contains("v2p-reply-tags-inline"),
    true,
  );
  assert.equal(document.querySelector("strong .v2p-reply-tags"), null);
  assert.equal(document.querySelector("#r_1 .v2p-reply-tags b").textContent, "#");
});
