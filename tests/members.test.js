import assert from "node:assert/strict";
import test from "node:test";
import { createMembers } from "../src/members.js";
import { createTopics } from "../src/preview.js";
import { blockMember, fetchMember, parseMemberTopics } from "../src/member-data.js";
import { createStorage } from "../src/storage.js";
import { dom, memoryAPI } from "./helpers.js";

const profile = (name, block = false) =>
  `<div id="Main"><input name="once" value="42">${block ? '<input type="button" value="Block" onclick="location.href=\'/block/123?once=42\'">' : ""}<div class="cell item"><span class="item_title"><a class="topic-link" href="/t/123">Safe &lt;topic&gt;</a></span></div></div>`;
const response = (body, url = "", status = 200) => ({
  ok: status === 200,
  status,
  url,
  text: async () => body,
  json: async () => body,
});
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

test("member topics keep the original five-row limit and reject external links", () => {
  dom("");
  const html =
    '<div class="cell item"><span class="item_title"><a class="topic-link" href="https://evil.test/t/1">Bad</a></span></div>' +
    Array.from(
      { length: 7 },
      (_, i) =>
        `<div class="cell item"><span class="item_title"><a class="topic-link" href="/t/${i + 1}">Title ${i + 1}</a></span></div>`,
    ).join("");
  assert.equal(parseMemberTopics(new DOMParser().parseFromString(html, "text/html")).length, 4);
});

test("member info and recent topics start together; optional profile failures keep member info", async () => {
  dom("");
  const pending = [];
  const task = fetchMember("Alice", new AbortController().signal, (path, options) => {
    assert.equal(options.credentials, "same-origin");
    return new Promise((resolve) => pending.push({ path, resolve }));
  });
  assert.equal(pending.length, 2);
  pending.find((x) => x.path.startsWith("/api/")).resolve(response({ username: "Alice", id: 1 }));
  pending.find((x) => x.path.startsWith("/member/")).resolve(response(profile("Alice")));
  assert.equal((await task).topics[0].title, "Safe <topic>");
  const data = await fetchMember("Alice", new AbortController().signal, async (path) =>
    path.startsWith("/api/") ? response({ username: "Alice", id: 1 }) : response("", "/signin"),
  );
  assert.deepEqual(data.topics, []);
});

test("blocking requires a fresh validated URL and verifies the resulting profile", async () => {
  dom("");
  const paths = [];
  await blockMember("Alice", async (path) => {
    paths.push(path);
    return response(profile("Alice", paths.length === 1), "https://www.v2ex.com/member/Alice");
  });
  assert.deepEqual(paths, ["/member/Alice", "/block/123?once=42", "/member/Alice"]);
  let calls = 0;
  await assert.rejects(
    blockMember("Alice", async () => {
      calls++;
      return response(
        '<div id="Main"><input type="button" value="Block" onclick="location.href=\'https://evil.test/block/1?once=42\'"></div>',
      );
    }),
  );
  assert.equal(calls, 1);
  await assert.rejects(
    blockMember("Alice", async () => response(profile("Alice", true), "/signin")),
  );
  await assert.rejects(blockMember("Alice", async () => response(profile("Alice", true))));
});

test("Polish member card uses skeletons, complete content, cached requests and topic previews", async () => {
  dom(
    '<div id="Wrapper"><div id="Main"><strong><a href="/member/Alice">Alice</a></strong></div></div>',
  );
  const requests = [];
  const oldFetch = globalThis.fetch;
  globalThis.fetch = (path, options) =>
    new Promise((resolve) => requests.push({ path, options, resolve }));
  try {
    createMembers(
      createStorage(memoryAPI()),
      { userCards: true, tags: true, preview: true, newTab: true },
      createTopics({ preview: true, newTab: true }),
    ).enhance(document);
    const anchor = document.querySelector('a[href="/member/Alice"]');
    anchor.dispatchEvent(new window.MouseEvent("pointerover", { bubbles: true }));
    assert.equal(requests.length, 0);
    await delay(380);
    assert.equal(requests.length, 2);
    assert.equal(document.querySelectorAll(".v2p-member-card .v2p-loading").length, 2);
    requests
      .find((x) => x.path.startsWith("/api/"))
      .resolve(
        response({
          username: "Alice",
          id: 123,
          created: Math.floor(Date.now() / 1000) - 86400,
          bio: "<safe bio>",
          avatar_large: "https://cdn.v2ex.com/a.png",
        }),
      );
    requests.find((x) => x.path.startsWith("/member/")).resolve(response(profile("Alice")));
    await new Promise(setImmediate);
    assert.match(document.querySelector(".v2p-no").textContent, /123/);
    assert.equal(document.querySelector(".v2p-bio").textContent, "<safe bio>");
    assert.match(document.querySelector(".v2p-register-days").textContent, /15/);
    assert.equal(document.querySelectorAll(".v2p-loading").length, 0);
    assert.equal(document.querySelectorAll(".v2p-member-card-actions button").length, 2);
    assert.ok(document.querySelector(".v2p-member-topic-item-row > .v2p-topic-preview-btn"));
    document.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    anchor.dispatchEvent(new window.MouseEvent("pointerover", { bubbles: true }));
    await delay(380);
    assert.equal(requests.length, 2);
    document.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  } finally {
    globalThis.fetch = oldFetch;
  }
});

test("leaving a member card aborts both outstanding requests and stale results stay hidden", async () => {
  dom('<div id="Main"><a href="/member/Alice">Alice</a></div>');
  const oldFetch = globalThis.fetch,
    requests = [];
  globalThis.fetch = (path, options) =>
    new Promise((resolve) => requests.push({ path, options, resolve }));
  try {
    createMembers(createStorage(memoryAPI()), { userCards: true, tags: true }).enhance(document);
    document
      .querySelector("a")
      .dispatchEvent(new window.MouseEvent("pointerover", { bubbles: true }));
    await delay(380);
    document.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    assert.equal(
      requests.every((x) => x.options.signal.aborted),
      true,
    );
    requests
      .find((x) => x.path.startsWith("/api/"))
      .resolve(response({ username: "Alice", id: 123 }));
    requests.find((x) => x.path.startsWith("/member/")).resolve(response(profile("Alice")));
    await new Promise(setImmediate);
    assert.equal(document.querySelector(".v2p-popup").hidden, true);
  } finally {
    globalThis.fetch = oldFetch;
  }
});
