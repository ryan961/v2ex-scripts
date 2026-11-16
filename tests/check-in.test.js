import assert from "node:assert/strict";
import test from "node:test";
import { canAttempt, createCheckIn, dayKey, redeemed } from "../src/check-in.js";
import { createStorage } from "../src/storage.js";
import { dom, locks, memoryAPI } from "./helpers.js";

function mission(content) {
  return new DOMParser().parseFromString(
    `<div id="Top"><div class="tools"><a href="/member/reader">reader</a></div></div><div id="Main">${content}</div>`,
    "text/html",
  );
}

test("dates use China time and attempt bounds reset on a new day", () => {
  assert.equal(dayKey(Date.parse("2026-11-16T16:01:00Z")), "2026-11-17");
  assert.equal(
    canAttempt({ day: "today", attempts: 3, success: false, nextAt: 0 }, "today", 100),
    false,
  );
  assert.equal(canAttempt({ day: "yesterday", attempts: 3, success: true }, "today", 100), true);
});

test("already redeemed English and Chinese pages are recognized", () => {
  dom("");
  assert.equal(redeemed(mission("Daily login reward already redeemed")), true);
  assert.equal(redeemed(mission("\u6bcf\u65e5\u767b\u5f55\u5956\u52b1\u5df2\u9886\u53d6")), true);
  assert.equal(redeemed(mission("Claim your daily login reward")), false);
});

test("concurrent tabs check in once, then trigger no writes or requests", async () => {
  dom("");
  const api = memoryAPI();
  const store = createStorage(api);
  const sharedLocks = locks();
  const requests = [];
  const config = {
    store,
    locks: sharedLocks,
    now: () => 1_800_000_000_000,
    getDocument: async (path) => {
      requests.push(path);
      return mission(
        path === "/mission/daily"
          ? '<a href="/mission/daily/redeem?once=123">Claim</a>'
          : "Daily reward received",
      );
    },
  };
  const first = createCheckIn(config);
  const second = createCheckIn(config);
  await Promise.all([first("reader"), second("reader")]);
  assert.equal(requests.length, 2);
  const writes = api.writes.length;
  for (let index = 0; index < 20; index++) await first("reader");
  assert.equal(requests.length, 2);
  assert.equal(api.writes.length, writes);
  assert.equal(store.get("daily:reader").success, true);
});

test("failures stop after three attempts and anonymous pages do no work", async () => {
  dom("");
  const api = memoryAPI();
  const store = createStorage(api);
  let time = 1_800_000_000_000;
  let requests = 0;
  const run = createCheckIn({
    store,
    locks: locks(),
    now: () => time,
    getDocument: async () => {
      requests++;
      throw new Error("offline");
    },
  });
  await run(null);
  assert.equal(api.writes.length, 0);
  for (let index = 0; index < 5; index++) {
    await run("reader");
    time += 600_000;
  }
  assert.equal(requests, 3);
  assert.equal(store.get("daily:reader").attempts, 3);
});

test("account mismatch never redeems and missing locks disables automatic requests", async () => {
  dom("");
  const store = createStorage(memoryAPI());
  const requests = [];
  const run = createCheckIn({
    store,
    locks: locks(),
    getDocument: async (path) => {
      requests.push(path);
      return mission('<a href="/mission/daily/redeem?once=123">Claim</a>');
    },
  });
  await run("other");
  assert.deepEqual(requests, ["/mission/daily"]);
  await createCheckIn({
    store,
    locks: null,
    getDocument: async () => assert.fail("must not request"),
  })("reader");
});
