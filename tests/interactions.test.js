import assert from "node:assert/strict";
import test from "node:test";
import { createTopics } from "../src/preview.js";
import { createMembers } from "../src/members.js";
import { openSettings } from "../src/settings.js";
import { setLanguage } from "../src/i18n.js";
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
  const frame = document.querySelector("iframe");
  const embedded = frame.contentDocument;
  embedded.open();
  embedded.write(`<div id="Top"></div><div id="Main"><div id="r_23" class="cell">
    <div class="thank_area"><a onclick="ignoreReply(23, 1)">Hide</a><a onclick="thankReply(23)">Thank</a></div>
    </div></div>`);
  embedded.close();
  frame.dispatchEvent(new Event("load"));
  const area = embedded.querySelector(".thank_area");
  assert.equal(area.querySelectorAll(".v2p-control > svg").length, 2);
  assert.equal(
    area.querySelector("a:has(.v2p-control-hide)").getAttribute("onclick"),
    "ignoreReply(23, 1)",
  );
  assert.equal(
    area.querySelector("a:has(.v2p-control-thank)").getAttribute("onclick"),
    "thankReply(23)",
  );
  area.classList.add("thanked");
  area.textContent = "Thanks sent";
  await new Promise(setImmediate);
  assert.ok(area.querySelector(".v2p-control-thank.v2p-thanked"));
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
    .find((node) => node.textContent === "\u4fdd\u5b58\u6807\u7b7e")
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

test("settings edit and delete saved tags without submitting the settings form", async () => {
  const { window } = dom('<div id="Main"><strong><a href="/member/Alice">Alice</a></strong></div>');
  setLanguage("en");
  const api = memoryAPI();
  const store = createStorage(api);
  store.import(
    `{"schema":1,"members":{"Alice":["Database","Research, Development"],"Bob":["UX"],"Former":[]}}`,
  );
  for (let i = 0; i < 49; i++) store.setTags(`test-${i}`, ["example"]);
  const members = createMembers(store, { tags: true, userCards: false });
  members.enhance(document);
  openSettings(store, false, members);
  const details = document.querySelector(".vx-settings-tag-manager");
  assert.equal(details.querySelector("summary").textContent, "Manage member tags");
  assert.equal(details.querySelector("input"), null);
  await new Promise((resolve) => {
    details.addEventListener("toggle", resolve, { once: true });
    details.open = true;
  });
  const list = details.querySelector(".vx-tag-list");
  const manager = details.querySelector(".vx-tag-manager");
  const group = details.querySelector(".vx-tag-group");
  assert.match(manager.textContent, /20 tags per member.*80 characters.*20,000 members/);
  assert.match(manager.textContent, /51 tagged members/);
  assert.equal(list.children.length, 50);
  manager.lastElementChild.click();
  assert.equal(list.children.length, 51);
  assert.doesNotMatch(list.textContent, /Former/i);
  const search = details.querySelector('input[type="search"]');
  const query = (value) => {
    search.value = value;
    search.dispatchEvent(new Event("input", { bubbles: true }));
  };
  assert.match([...group.options].find((option) => option.value === "example").textContent, /49/);
  group.value = "Database";
  group.dispatchEvent(new Event("change"));
  assert.equal(list.children.length, 1);
  assert.match(manager.querySelector(".vx-tag-count").textContent, /1 of 51/);
  query("BOB");
  assert.equal(list.textContent, "No matching member tags.");
  query("");
  const matchingChip = [...list.querySelectorAll(".vx-tag-filter")].find(
    (chip) => chip.textContent === "Research, Development",
  );
  matchingChip.click();
  assert.equal(group.value, "Research, Development");
  assert.equal(list.querySelector('[aria-pressed="true"]').textContent, "Research, Development");
  group.value = "Database";
  group.dispatchEvent(new Event("change"));
  query("DATABASE");
  assert.equal(list.children.length, 1);
  assert.match(list.textContent, /alice.*Database/);
  const profile = list.querySelector(".vx-tag-profile");
  assert.equal(profile.href, "https://www.v2ex.com/member/alice");
  assert.equal(profile.target, "_blank");
  assert.equal(
    search.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Enter", cancelable: true })),
    false,
  );
  list.querySelector(".vx-tag-actions button").click();
  const input = details.querySelector(".vx-tag-fields textarea");
  const entry = details.querySelector(".vx-tag-entry textarea");
  assert.equal(input.value, "Database");
  const save = [...details.querySelectorAll("button")].find(
    (button) => button.textContent === "Save tags",
  );
  entry.value = "x".repeat(81);
  save.click();
  assert.match(details.querySelector('[role="alert"]').textContent, /80 characters/);
  assert.deepEqual(store.getTags("alice"), ["Database", "Research, Development"]);
  entry.select();
  const paste = new Event("paste", { bubbles: true, cancelable: true });
  Object.defineProperty(paste, "clipboardData", {
    value: { getData: () => "UI, Browser\nDatabase" },
  });
  entry.dispatchEvent(paste);
  assert.equal(paste.defaultPrevented, true);
  assert.deepEqual(
    [...details.querySelectorAll(".vx-tag-fields textarea")].map((field) => field.value),
    ["Database", "Research, Development", "UI", "Browser"],
  );
  const [first, , third] = details.querySelectorAll(".vx-tag-field");
  const editTag = first.querySelector(".vx-tag-edit-value");
  const rename = first.querySelector("textarea");
  assert.equal(rename.hidden, true);
  editTag.click();
  assert.equal(rename.hidden, false);
  rename.value = "Discard";
  rename.dispatchEvent(
    new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }),
  );
  assert.equal(editTag.textContent, "Database");
  editTag.click();
  rename.value = "Backend";
  rename.dispatchEvent(
    new window.KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }),
  );
  assert.equal(editTag.textContent, "Backend");
  third.querySelector(".vx-tag-remove-value").click();
  entry.value = "Comma";
  entry.dispatchEvent(
    new window.KeyboardEvent("keydown", { key: ",", bubbles: true, cancelable: true }),
  );
  assert.equal(entry.value, "");
  entry.value = "Pending";
  save.click();
  assert.match(document.querySelector("#Main .vx-tags").textContent, /Backend/);
  assert.match(details.querySelector('[role="status"]').textContent, /saved for alice/);
  assert.deepEqual(store.getTags("alice"), [
    "Backend",
    "Research, Development",
    "Browser",
    "Comma",
    "Pending",
  ]);
  assert.equal(group.value, "");
  assert.ok([...group.options].some((option) => option.value === "Backend"));
  query("ALICE");
  assert.match(list.textContent, /alice.*Backend/);
  const remove = list.querySelector(".vx-tag-delete");
  window.confirm = () => false;
  remove.click();
  assert.match(list.textContent, /alice.*Backend/);
  window.confirm = (message) => message === "Delete all tags for alice?";
  remove.click();
  assert.equal(list.textContent, "No matching member tags.");
  assert.match(manager.textContent, /0 of 50 tagged members/);
  assert.equal(document.querySelector("#Main .vx-tags").hidden, true);
  assert.equal(store.import('{"schema":1,"members":{"Alice":["old"]}}'), 0);
  assert.equal(
    api.writes.some((write) => write.endsWith(":options")),
    false,
  );
  document.querySelector(".v2p-modal-close-btn").click();
  window.close();
  setLanguage("zh");
});
