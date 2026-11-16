import assert from "node:assert/strict";
import test from "node:test";
import { createTopics } from "../src/preview.js";
import { createMembers } from "../src/members.js";
import { createStorage } from "../src/storage.js";
import { dom, memoryAPI } from "./helpers.js";

test("body previews sanitize HTML, cache requests and remove dialogs on close", async () => {
  dom('<div id="Main"><span class="item_title"><a href="/t/456">Preview title</a></span></div>');
  let calls = 0;
  const topics = createTopics({ preview: true, newTab: true }, async () => {
    calls++;
    return new DOMParser().parseFromString(
      '<div id="Main"><h1>Loaded title</h1><div class="topic_content"><p>Body</p><script>bad()</script></div><div class="subtle"><div class="topic_content">Supplement</div></div></div>',
      "text/html",
    );
  });
  topics.enhance(document);
  topics.enhance(document);
  const preview = document.querySelector("button");
  assert.equal(document.querySelectorAll("button").length, 1);
  preview.click();
  await new Promise(setImmediate);
  assert.equal(document.querySelector("dialog h2").textContent, "Loaded title");
  assert.equal(document.querySelector(".vx-preview").textContent, "BodySupplement");
  assert.equal(document.querySelector(".vx-preview script"), null);
  document.querySelector("dialog").close();
  await new Promise(setImmediate);
  assert.equal(document.querySelector("dialog"), null);
  preview.click();
  await new Promise(setImmediate);
  assert.equal(calls, 1);
  document.querySelector("dialog").close();
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
  document.querySelector(".vx-tags button").click();
  document.querySelector("dialog input").value = "backend, database";
  [...document.querySelectorAll("dialog button")]
    .find((node) => node.textContent === "Save")
    .click();
  assert.deepEqual(store.getTags("alice"), ["backend", "database"]);
  assert.equal(document.querySelectorAll(".vx-tag").length, 4);
  assert.equal(document.querySelectorAll(".vx-tags button").length, 2);
  assert.equal(api.writes.length, 1);
});
