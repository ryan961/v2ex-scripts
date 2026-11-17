import assert from "node:assert/strict";
import test from "node:test";
import { createStorage, BACKUP_BYTES, byteLength, parseImport } from "../src/storage.js";
import {
  backupParts,
  NOTE_BYTES,
  NOTE_MARK,
  readBackupParts,
  singleBackup,
} from "../src/backup-format.js";
import { boundedText, notesBackup } from "../src/backup-notes.js";
import { openSettings } from "../src/settings.js";
import { setLanguage, t } from "../src/i18n.js";
import { dom, memoryAPI } from "./helpers.js";

const snapshot = (members = { alice: ["friend"] }) => ({
  schema: 1,
  exportedAt: "2026-11-17T00:00:00.000Z",
  options: { theme: "native", language: "en" },
  members,
});
const text = singleBackup(snapshot());

test("split files obey byte and member limits and restore only complete sets", () => {
  const long = Array.from({ length: 20 }, (_, i) => `${i}\u754c`.padEnd(80, "\u754c"));
  const members = Object.fromEntries(Array.from({ length: 520 }, (_, i) => [`member${i}`, long]));
  const parts = backupParts(snapshot(members));
  assert.equal(parts.length, 2);
  assert.ok(parts.every((part) => byteLength(part) <= BACKUP_BYTES));
  assert.throws(() => readBackupParts(parts.slice(0, 1)));
  assert.throws(() => readBackupParts([parts[0], parts[0]]));
  const result = readBackupParts([...parts].reverse());
  assert.deepEqual({ ...result.members }, members);
  assert.equal(result.options.theme, "native");
  assert.throws(() => singleBackup(snapshot(members), NOTE_MARK, NOTE_BYTES));
  assert.throws(() => parseImport("\u754c".repeat(700_000)), { message: /2 MB/ });
});

test("legacy label records and settings restore independently and preserve local secrets", () => {
  assert.deepEqual(parseImport('--\u7528\u6237\u6807\u7b7e--{"Alice":["friend"]}').members.alice, [
    "friend",
  ]);
  const foreign = parseImport(
    JSON.stringify({
      meta: { databaseVersion: 3 },
      data: {
        "https://www.v2ex.com/member/Bob": { tags: ["friend"] },
        "https://edge.v2ex.com/member/BOB": { tags: ["._DELETED_"] },
        "https://evil.example/member/Bob": { tags: ["ignored"] },
        "https://www.v2ex.com/t/123": { tags: ["topic"] },
      },
    }),
  );
  assert.deepEqual({ ...foreign.members }, { bob: [] });
  const store = createStorage(memoryAPI());
  store.setTags("alice", []);
  store.saveOptions({ theme: "arco-clear", imgurClientId: "local123" });
  store.set("backup:mode", "notes");
  const restored = readBackupParts([
    singleBackup(snapshot({ alice: ["old"], bob: [], carol: ["new"] })),
  ]);
  assert.deepEqual(store.previewRestore(restored), { added: 1, deleted: 1, conflicts: 1 });
  assert.equal(store.restore(restored, { settings: true, tags: false }), 0);
  assert.equal(store.options().theme, "native");
  assert.equal(store.options().imgurClientId, "local123");
  assert.equal(store.get("backup:mode"), "notes");
  assert.equal(store.restore(restored), 2);
  assert.deepEqual(store.getTags("alice"), []);
  assert.equal(JSON.parse(store.export()).options.imgurClientId, undefined);
});

test("a failed restore can resume without repeating completed writes", () => {
  const api = memoryAPI();
  const write = api.set;
  let fail = true;
  api.set = (key, value) => {
    if (fail && key.endsWith(":bob")) throw new Error("Storage full");
    write(key, value);
  };
  const store = createStorage(api);
  const data = readBackupParts([singleBackup(snapshot({ alice: [], bob: ["friend"] }))]);
  assert.throws(() => store.restore(data), /Storage full/);
  assert.deepEqual(store.getTags("alice"), []);
  fail = false;
  assert.equal(store.restore(data), 1);
  assert.deepEqual(store.getTags("bob"), ["friend"]);
  assert.equal(api.writes.length, 2);
});

test("oversized remote responses are cancelled before restoration", async () => {
  let cancelled = false;
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array(9));
    },
    cancel() {
      cancelled = true;
    },
  });
  await assert.rejects(boundedText(new Response(stream), 8));
  assert.equal(cancelled, true);
});

test("Notes verifies the signed-in account and reads the saved note back", async () => {
  const { window } = dom("");
  const note = singleBackup(snapshot(), NOTE_MARK, NOTE_BYTES);
  let content = "";
  let writes = 0;
  const home = '<div class="tools"><a href="/member/reader">reader</a></div>';
  const editor = (value = "") =>
    `<form><textarea name="content">${value}</textarea><input name="once" value="123"></form>`;
  const fetcher = async (url, init) => {
    const path = new URL(url).pathname;
    const page = (body, top = "") =>
      new Response(`<div id="Top">${top}</div><div id="Main">${body}</div>`);
    if (path === "/") return page("Home", home);
    assert.equal(init.credentials, "same-origin");
    if (init.method === "POST") {
      writes++;
      assert.equal(init.body.get("once"), "123");
      assert.equal(init.redirect, "manual");
      content = init.body.get("content");
      return new Response(null, { status: 303 });
    }
    if (path === "/notes")
      return page(
        content
          ? '<div class="note_item_title"><a href="/notes/10">V2EX_Lite_settings</a></div>'
          : "Empty",
      );
    if (path === "/notes/new") return page(editor());
    assert.equal(path, "/notes/edit/10");
    return page(editor(content));
  };
  await assert.rejects(notesBackup("other", note, { fetcher }));
  assert.equal(await notesBackup("reader", note, { fetcher, approve: () => false }), false);
  assert.equal(writes, 0);
  assert.equal(
    await notesBackup("reader", note, { fetcher, approve: (name) => name === "reader" }),
    true,
  );
  assert.equal(writes, 1);
  assert.deepEqual((await notesBackup("reader", undefined, { fetcher })).members.alice, ["friend"]);
  const truncated = async (url, init) => {
    const response = await fetcher(url, init);
    if (init.method === "POST") content = content.slice(0, -1);
    return response;
  };
  const changed = singleBackup(snapshot({ bob: ["new"] }), NOTE_MARK, NOTE_BYTES);
  await assert.rejects(notesBackup("reader", changed, { fetcher: truncated }));
  window.close();
});

test("settings embed local backup and file import waits for restore choices", async () => {
  const { window } = dom("");
  setLanguage("en");
  const store = createStorage(memoryAPI());
  openSettings(store, true);
  const dialog = document.querySelector("#vx-settings-dialog .vx-backup");
  assert.equal(document.querySelectorAll(".v2p-modal-mask").length, 1);
  assert.deepEqual(
    [...dialog.querySelector("select").options].map(({ value }) => value),
    ["local", "notes"],
  );
  const theme = document.querySelector('[name="theme"]');
  theme.value = "arco-clear";
  assert.equal(dialog.querySelector("select").value, "local");
  const input = dialog.querySelector('input[type="file"]');
  Object.defineProperty(input, "files", {
    value: [{ text: async () => text, size: byteLength(text) }],
  });
  input.dispatchEvent(new window.Event("change"));
  await new Promise(setImmediate);
  assert.deepEqual(store.getTags("alice"), []);
  const [tags, settings] = dialog.querySelectorAll('input[type="checkbox"]');
  assert.equal(tags.checked, true);
  assert.equal(settings.checked, false);
  settings.checked = true;
  [...dialog.querySelectorAll("button")]
    .find((button) => button.textContent === t("backupRestoreApply"))
    .click();
  assert.deepEqual(store.getTags("alice"), ["friend"]);
  assert.equal(store.options().theme, "native");
  assert.equal(theme.value, "native");
  assert.equal(document.querySelectorAll(".v2p-modal-mask").length, 1);
  const mode = dialog.querySelector("select");
  mode.value = "notes";
  mode.dispatchEvent(new window.Event("change"));
  assert.equal(document.querySelectorAll(".v2p-modal-mask").length, 1);
  assert.equal(theme.value, "native");
  assert.ok(
    [...dialog.querySelectorAll("button")].find((b) => b.textContent === t("backupToNotes")),
  );
  window.close();
  setLanguage("zh");
});

test("removed cloud preferences fall back to local and guests cannot use Notes", () => {
  const { window } = dom("");
  setLanguage("en");
  const api = memoryAPI();
  const store = createStorage(api);
  store.set("backup:mode", "cloud");
  const writes = api.writes.length;
  openSettings(store, false);
  const root = document.querySelector(".vx-backup");
  const mode = root.querySelector("select");
  assert.equal(mode.value, "local");
  assert.equal(api.writes.length, writes);
  const theme = document.querySelector('[name="theme"]');
  theme.value = "native";
  mode.value = "notes";
  mode.dispatchEvent(new window.Event("change"));
  assert.equal(theme.value, "native");
  assert.equal(document.querySelectorAll(".v2p-modal-mask").length, 1);
  assert.match(root.textContent, /Requires V2EX sign-in/);
  assert.equal(root.querySelectorAll("button").length, 2);
  for (const button of root.querySelectorAll("button")) {
    assert.equal(button.disabled, true);
    assert.equal(button.type, "button");
  }
  assert.equal(store.get("backup:mode"), "notes");
  window.close();
  setLanguage("zh");
});

test("closing settings while a backup file loads cannot restore or reopen it", async () => {
  const { window } = dom("");
  const api = memoryAPI();
  openSettings(createStorage(api), true);
  let finish;
  const loaded = new Promise((resolve) => (finish = resolve));
  const input = document.querySelector('.vx-backup input[type="file"]');
  Object.defineProperty(input, "files", {
    value: [{ text: () => loaded, size: byteLength(text) }],
  });
  input.dispatchEvent(new window.Event("change"));
  document.querySelector(".v2p-modal-close-btn").click();
  finish(text);
  await new Promise(setImmediate);
  assert.equal(document.querySelector(".v2p-modal-mask"), null);
  assert.deepEqual(api.writes, []);
  window.close();
});
