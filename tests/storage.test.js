import assert from "node:assert/strict";
import test from "node:test";
import { createStorage, normalizeOptions, normalizeTags, parseImport } from "../src/storage.js";
import { memoryAPI } from "./helpers.js";

test("options reject invalid types and unknown fields", () => {
  const options = normalizeOptions({
    theme: "broken",
    privacy: "yes",
    preloadPages: 99,
    imgurClientId: "x\r\ny",
    injected: true,
  });
  assert.equal(options.theme, undefined);
  assert.equal(options.privacy, false);
  assert.equal(options.preloadPages, 2);
  assert.equal(options.imgurClientId, "");
  assert.equal(options.injected, undefined);
});

test("Polish import accepts old tag objects and validates the entire file", () => {
  assert.deepEqual(normalizeTags([" a ", { name: "b" }, "a"]), ["a", "b"]);
  assert.deepEqual(
    parseImport('V2EX_Polish_settings{"member-tag":{"Alice":{"tags":[{"name":"backend"}]}}}')
      .members.alice,
    ["backend"],
  );
  assert.throws(
    () => parseImport('{"member-tag":{"ok":{"tags":["valid"]},"bad/user":[]}}'),
    /username/,
  );
  assert.throws(() => parseImport('{"schema":2,"members":{}}'), /version/);
  assert.throws(() => parseImport('{"members":{"alice":{"tags":[null]}}}'), /Invalid tag/);
});

test("storage writes only changes; local entries and tombstones win imports", () => {
  const api = memoryAPI();
  const store = createStorage(api);
  store.setTags("Alice", ["local"]);
  store.setTags("alice", ["local"]);
  store.setTags("Bob", []);
  assert.equal(api.writes.length, 2);
  assert.equal(
    store.import('{"members":{"alice":["remote"],"bob":["remote"],"carol":["new"]}}'),
    1,
  );
  assert.deepEqual(store.getTags("ALICE"), ["local"]);
  assert.deepEqual(store.getTags("Bob"), []);
  const before = api.writes.length;
  assert.throws(() => store.import('{"members":{"fresh":["a"],"bad/name":[]}}'));
  assert.equal(api.writes.length, before);
});

test("backup excludes Client ID and runtime state; remote events never echo writes", () => {
  const api = memoryAPI();
  const store = createStorage(api);
  store.saveOptions({ imgurClientId: "abc123" });
  store.set("daily:reader", { success: true });
  store.watchTags("Alice", () => {});
  const before = api.writes.length;
  api.listeners.get("v2ex-lite:member:alice")("key", [], ["remote"], true);
  assert.deepEqual(store.getTags("Alice"), ["remote"]);
  assert.equal(api.writes.length, before);
  const backup = JSON.parse(store.export());
  assert.equal(backup.options.imgurClientId, undefined);
  assert.equal(JSON.stringify(backup).includes("daily:"), false);
});
