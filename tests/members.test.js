import assert from "node:assert/strict";
import test from "node:test";
import { createMembers } from "../src/members.js";
import { createTopics } from "../src/preview.js";
import {
  blockMember,
  fetchMember,
  parseMemberReplies,
  parseMemberTopics,
  setMemberFollow,
} from "../src/member-data.js";
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
const replyRows = (count = 4) =>
  Array.from(
    { length: count },
    (_, index) =>
      `<div class="dock_area"><span class="fade">${index + 1} hours ago</span><a href="/t/${index + 1}#reply7">Topic ${index + 1}</a></div><div class="inner"><div class="reply_content">Reply &lt;safe&gt;<br>line ${index + 1}</div></div>`,
  ).join("");
const followProfile = (following, id = "123", once = "42") =>
  profile("Alice").replace(
    '<div id="Main">',
    `<div id="Top"><a class="top" href="/member/reader">reader</a></div><div id="Main"><div class="box"><h1>Alice</h1><input type="button" onclick="if(confirm('Continue?')){location.href='/${following ? "unfollow" : "follow"}/${id}?once=${once}';}"><a href="/top/dau">8553</a></div>`,
  );

test("recent replies retain three native topic links and render only bounded plain text", () => {
  dom("");
  const page = new DOMParser().parseFromString(`<div id="Main">${replyRows()}</div>`, "text/html");
  const replies = parseMemberReplies(page);
  assert.equal(replies.length, 3);
  assert.deepEqual(replies[0], {
    title: "Topic 1",
    url: "https://www.v2ex.com/t/1#reply7",
    text: "Reply <safe> line 1",
    time: "1 hours ago",
  });
  page.querySelector(".dock_area a").href = "https://evil.test/t/1";
  page.querySelectorAll(".reply_content")[1].textContent = "x".repeat(300);
  assert.equal(parseMemberReplies(page).length, 2);
  assert.equal(parseMemberReplies(page)[0].text.length, 161);
  page.querySelectorAll(".dock_area a")[1].href = "javascript:alert(1)";
  assert.equal(parseMemberReplies(page).length, 1);
});

test("profile metadata shares the existing two requests and remains optional", async () => {
  dom("");
  const paths = [];
  const data = await fetchMember("Alice", new AbortController().signal, async (path) => {
    paths.push(path);
    return response(
      path.startsWith("/api/")
        ? { username: "Alice", id: 123 }
        : followProfile(true).replace(/<\/div>$/, replyRows() + "</div>"),
    );
  });
  assert.equal(paths.length, 2);
  assert.equal(data.activityRank, 8553);
  assert.equal(data.following, true);
  assert.equal(data.replies.length, 3);
  const missing = await fetchMember("Alice", new AbortController().signal, async (path) =>
    path.startsWith("/api/") ? response({ username: "Alice", id: 123 }) : response("", "/signin"),
  );
  assert.equal(missing.activityRank, null);
  assert.equal(missing.following, null);
  assert.deepEqual(missing.replies, []);
});

test("follow changes use fresh native tokens, verify the result and avoid repeated mutations", async () => {
  dom("");
  const paths = [];
  let following = false;
  const fetcher = async (path, options) => {
    assert.equal(options.credentials, "same-origin");
    paths.push(path);
    if (path.startsWith("/follow/")) following = true;
    if (path.startsWith("/unfollow/")) following = false;
    return response(followProfile(following), "https://www.v2ex.com/member/Alice");
  };
  assert.equal(await setMemberFollow("Alice", true, "reader", fetcher), true);
  assert.deepEqual(paths, ["/member/Alice", "/follow/123?once=42", "/member/Alice"]);
  paths.length = 0;
  assert.equal(await setMemberFollow("Alice", true, "reader", fetcher), true);
  assert.deepEqual(paths, ["/member/Alice"]);
  paths.length = 0;
  assert.equal(await setMemberFollow("Alice", false, "reader", fetcher), false);
  assert.deepEqual(paths, ["/member/Alice", "/unfollow/123?once=42", "/member/Alice"]);
  let calls = 0;
  await assert.rejects(
    setMemberFollow("Alice", true, "reader", async () => {
      calls++;
      return response(followProfile(false).replace("'/follow/", "'https://evil.test/follow/"));
    }),
  );
  assert.equal(calls, 1);
  calls = 0;
  await assert.rejects(
    setMemberFollow("Alice", true, "other", async () => {
      calls++;
      return response(followProfile(false));
    }),
  );
  assert.equal(calls, 1);
  await assert.rejects(
    setMemberFollow("Alice", true, "reader", async () => response(followProfile(false))),
  );
  calls = 0;
  await assert.rejects(
    setMemberFollow("Alice", true, "reader", async () =>
      response(followProfile(++calls > 1), calls === 2 ? "/signin" : ""),
    ),
  );
  assert.equal(calls, 2);
  calls = 0;
  await assert.rejects(
    setMemberFollow("Alice", true, "reader", async () =>
      response(followProfile(++calls > 1, calls === 3 ? "456" : "123")),
    ),
  );
});

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
  const signedIn = (body, name = "reader") =>
    `<div id="Top"><a class="top" href="/member/${name}">${name}</a></div>${body}`;
  const paths = [];
  await blockMember("Alice", "reader", async (path) => {
    paths.push(path);
    return response(
      signedIn(profile("Alice", paths.length === 1)),
      "https://www.v2ex.com/member/Alice",
    );
  });
  assert.deepEqual(paths, ["/member/Alice", "/block/123?once=42", "/member/Alice"]);
  let calls = 0;
  await assert.rejects(
    blockMember("Alice", "reader", async () => {
      calls++;
      return response(
        signedIn(
          '<div id="Main"><input type="button" value="Block" onclick="location.href=\'https://evil.test/block/1?once=42\'"></div>',
        ),
      );
    }),
  );
  assert.equal(calls, 1);
  await assert.rejects(
    blockMember("Alice", "reader", async () =>
      response(signedIn(profile("Alice", true)), "/signin"),
    ),
  );
  await assert.rejects(
    blockMember("Alice", "reader", async () => response(signedIn(profile("Alice", true)))),
  );
  for (const account of ["other", null]) {
    calls = 0;
    await assert.rejects(
      blockMember("Alice", account, async (path) => {
        calls++;
        assert.equal(path, "/member/Alice");
        return response(signedIn(profile("Alice", true)));
      }),
    );
    assert.equal(calls, 1);
  }
  calls = 0;
  await assert.rejects(
    blockMember("Alice", "reader", async () => {
      calls++;
      return response(signedIn(profile("Alice", calls === 1), calls < 3 ? "reader" : "other"));
    }),
  );
  assert.equal(calls, 3);
});

test("member cards cancel dismissal on reentry and close one second after leaving", async () => {
  const { window } = dom('<div id="Main"><a href="/member/Alice">Alice</a></div>');
  try {
    createMembers(createStorage(memoryAPI()), { tags: true, userCards: false });
    const anchor = document.querySelector("#Main a");
    const popup = document.querySelector(".vx-member-popup");
    const pointer = (node, type, relatedTarget) =>
      node.dispatchEvent(new window.MouseEvent(type, { bubbles: true, relatedTarget }));
    pointer(anchor, "pointerover", document.body);
    await delay(380);
    assert.equal(popup.hidden, false);
    pointer(anchor, "pointerout", document.body);
    await delay(80);
    pointer(anchor, "pointerover", document.body);
    await delay(1050);
    assert.equal(popup.hidden, false);
    pointer(anchor, "pointerout", document.body);
    pointer(popup, "pointerover", document.body);
    await delay(1050);
    assert.equal(popup.hidden, false);
    pointer(popup, "pointerout", document.body);
    await delay(400);
    assert.equal(popup.hidden, false);
    await delay(650);
    assert.equal(popup.hidden, true);
  } finally {
    window.close();
  }
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
      "reader",
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

test("member cards show activity, three replies and verified follow state without cache refetches", async () => {
  const { window } = dom('<div id="Main"><a href="/member/Alice">Alice</a></div>');
  const oldFetch = globalThis.fetch;
  const paths = [];
  let following = false;
  globalThis.fetch = async (path) => {
    paths.push(path);
    if (path.startsWith("/follow/")) following = true;
    return response(
      path.startsWith("/api/")
        ? { username: "Alice", id: 123, created: 1600000000 }
        : followProfile(following).replace(/<\/div>$/, replyRows() + "</div>"),
    );
  };
  window.confirm = () => true;
  try {
    createMembers(
      createStorage(memoryAPI()),
      { userCards: true, tags: true, newTab: true },
      null,
      "reader",
    );
    const anchor = document.querySelector("#Main > a");
    anchor.dispatchEvent(new window.MouseEvent("pointerover", { bubbles: true }));
    await delay(380);
    assert.equal(paths.length, 2);
    assert.match(document.querySelector(".vx-member-rank").textContent, /8553/);
    assert.equal(document.querySelectorAll(".vx-member-reply").length, 3);
    assert.equal(
      document.querySelector(".vx-member-reply-text").textContent,
      "Reply <safe> line 1",
    );
    const follow = document.querySelector(".vx-member-follow");
    follow.click();
    follow.click();
    await new Promise(setImmediate);
    assert.equal(paths.filter((path) => path.startsWith("/follow/")).length, 1);
    assert.equal(follow.getAttribute("aria-pressed"), "true");
    assert.equal(follow.disabled, false);
    document.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    anchor.dispatchEvent(new window.MouseEvent("pointerover", { bubbles: true }));
    await delay(380);
    assert.equal(paths.length, 5);
    assert.equal(document.querySelector(".vx-member-follow").getAttribute("aria-pressed"), "true");
  } finally {
    globalThis.fetch = oldFetch;
    window.close();
  }
});

test("guests and the current member never receive follow controls", async () => {
  const oldFetch = globalThis.fetch;
  try {
    for (const account of [undefined, "Alice"]) {
      const { window } = dom('<div id="Main"><a href="/member/Alice">Alice</a></div>');
      globalThis.fetch = async (path) =>
        response(path.startsWith("/api/") ? { username: "Alice", id: 123 } : followProfile(false));
      createMembers(createStorage(memoryAPI()), { userCards: true }, null, account);
      document
        .querySelector("a")
        .dispatchEvent(new window.MouseEvent("pointerover", { bubbles: true }));
      await delay(380);
      assert.ok(document.querySelector(".v2p-member-card"));
      assert.equal(document.querySelector(".vx-member-follow"), null);
      window.close();
    }
  } finally {
    globalThis.fetch = oldFetch;
  }
});
