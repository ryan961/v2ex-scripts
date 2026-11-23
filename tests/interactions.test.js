import assert from "node:assert/strict";
import test from "node:test";
import { createTopics, PREVIEW_READY } from "../src/preview.js";
import { createMembers } from "../src/members.js";
import { openSettings } from "../src/settings.js";
import { installPageActions } from "../src/page-actions.js";
import { setLanguage } from "../src/i18n.js";
import { createStorage } from "../src/storage.js";
import { enhanceImages, installImageViewer } from "../src/image-viewer.js";
import { dom, memoryAPI } from "./helpers.js";

test("reply shortcut floats the existing draft when the native helper is unavailable", () => {
  const { window } = dom(`<div id="Main"><div id="reply-box">
    <button id="undock-button" style="display:none">Undock</button>
    <textarea id="reply_content">Existing draft</textarea>
    </div></div>`);
  const editor = document.querySelector("#reply_content");
  editor.scrollIntoView = () => assert.fail("opening a floating reply must not scroll");
  window.scrollTo = () => assert.fail("opening a floating reply must not scroll");
  editor.setSelectionRange(2, 5);
  installPageActions(true, {});
  const reply = document.querySelector(".vx-quick-reply");
  const box = document.querySelector("#reply-box");
  reply.click();
  assert.equal(box.classList.contains("reply-box-sticky"), true);
  assert.equal(document.querySelector("#undock-button").style.display, "inline-block");
  assert.equal(document.activeElement, editor);
  assert.equal(editor.value, "Existing draft");
  assert.equal(editor.selectionStart, 2);
  assert.equal(editor.selectionEnd, 5);
  box.classList.remove("reply-box-sticky");
  reply.click();
  assert.equal(box.classList.contains("reply-box-sticky"), true);
  window.close();
});

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
  assert.equal(frame.style.visibility, "hidden");
  const embedded = frame.contentDocument;
  embedded.open();
  embedded.write(`<div id="Top"></div><div id="Main"><div id="r_23" class="cell">
    <div class="thank_area"><a onclick="ignoreReply(23, 1)">Hide</a><a onclick="thankReply(23)">Thank</a></div>
    <div class="reply_content"><img src="https://images.example.org/photo.png" alt="Reply photo"></div>
    </div></div>`);
  embedded.close();
  frame.dispatchEvent(new Event("load"));
  assert.equal(frame.style.visibility, "");
  assert.equal(embedded.querySelectorAll("#v2ex-lite-theme").length, 1);
  frame.dispatchEvent(new Event("load"));
  assert.equal(embedded.querySelectorAll("#v2ex-lite-theme").length, 1);
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
  const previewMask = document.querySelector(".v2p-modal-mask");
  embedded.querySelector(".reply_content img").click();
  assert.equal(document.querySelectorAll(".vx-image-viewer").length, 1);
  assert.equal(previewMask.hasAttribute("inert"), true);
  const escape = () =>
    new window.KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
      cancelable: true,
    });
  embedded.dispatchEvent(escape());
  assert.equal(document.querySelectorAll(".v2p-modal-mask").length, 2);
  document.dispatchEvent(escape());
  assert.equal(previewMask.hasAttribute("inert"), false);
  assert.equal(document.querySelector("iframe"), frame);
  const handled = escape();
  handled.preventDefault();
  embedded.dispatchEvent(handled);
  assert.equal(previewMask.isConnected, true);
  embedded.querySelector(".reply_content img").focus();
  embedded.querySelector(".reply_content img").dispatchEvent(escape());
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

test("preview opens cross-origin content links outside the frame without changing their URLs", () => {
  const { window } = dom('<span class="item_title"><a href="/t/1258295">Topic</a></span>');
  try {
    createTopics({ preview: true, newTab: false }).enhance(document);
    document.querySelector(".v2p-topic-preview-btn").click();
    const frame = document.querySelector("iframe");
    const doc = frame.contentDocument;
    doc.open();
    doc.write(`<div id="Top"></div><div id="Main">
      <a id="page" href="/t/1258295?p=2">Next page</a>
      <div class="topic_content">
        <a id="edge" href="https://edge.v2ex.com/t/1257733?p=2#r_23" rel="nofollow"><span>Topic</span></a>
        <a id="floor" href="#r_23">Reply</a>
        <a id="download" href="https://example.org/file.txt" download>Download</a>
        <a id="image" href="https://example.org/full.png"><img src="https://example.org/thumb.png"></a>
      </div>
    </div>`);
    doc.close();
    frame.dispatchEvent(new window.Event("load"));
    doc
      .getElementById("Main")
      .insertAdjacentHTML(
        "beforeend",
        '<div class="reply_content"><a id="external" target="_self" href="https://example.org/">External</a></div>',
      );

    // Inspect the link after its click handlers run, without navigating the fixture.
    doc.addEventListener("click", (event) => event.preventDefault());
    doc.querySelector("#edge span").click();
    const edge = doc.getElementById("edge");
    assert.equal(edge.target, "_blank");
    assert.equal(edge.href, "https://edge.v2ex.com/t/1257733?p=2#r_23");
    assert.ok(edge.relList.contains("noopener"));
    assert.ok(edge.relList.contains("nofollow"));
    doc.getElementById("external").click();
    assert.equal(doc.getElementById("external").target, "_blank");
    for (const id of ["page", "floor", "download"]) {
      const link = doc.getElementById(id);
      link.click();
      assert.equal(link.hasAttribute("target"), false, id);
    }
    doc.querySelector("#image img").click();
    assert.ok(document.querySelector(".vx-image-viewer"));
    assert.equal(doc.getElementById("image").hasAttribute("target"), false);
    assert.equal(document.querySelector("iframe"), frame);
  } finally {
    window.close();
  }
});

test("opt-in image proxy covers preview images, lazy sources and the image viewer", async () => {
  const { window } = dom('<span class="item_title"><a href="/t/456">Topic</a></span>');
  const proxy = "https://images.example.org/proxy?url=";
  const thumbnail = "https://i.imgur.com/Thumb.png?size=small&format=1";
  const original = "https://i.imgur.com/Original.png";
  const wide = `https://i.imgur.com/Wide.webp?tags=${",".repeat(8_000)}end`;
  const proxied = (url) => proxy + encodeURIComponent(url);
  try {
    createTopics({ preview: true, imgurProxy: true, imgurProxyURL: proxy }).enhance(document);
    document.querySelector(".v2p-topic-preview-btn").click();
    const frame = document.querySelector("iframe");
    const doc = frame.contentDocument;
    doc.open();
    doc.write(`<div id="Top"></div><div id="Main"><div class="topic_content">
      <a href="${original}"><img id="thumbnail" src="${thumbnail}"></a>
      <picture>
        <source srcset="${wide} 2x,https://cdn.example.org/Other.webp 1x">
        <img id="responsive" srcset="data:image/png;base64,AAAA, https://i.imgur.com/Small.png" src="/placeholder.png">
      </picture>
      <img id="lookalike" src="https://i.imgur.com.example.org/Thumb.png">
    </div></div>`);
    doc.close();
    frame.dispatchEvent(new doc.defaultView.Event(PREVIEW_READY));
    const image = doc.getElementById("thumbnail");
    assert.equal(image.src, proxied(thumbnail));
    assert.equal(image.getAttribute("referrerpolicy"), "no-referrer");
    assert.equal(image.parentElement.href, original);
    assert.equal(
      doc.querySelector("source").getAttribute("srcset"),
      `${proxied(wide)} 2x,https://cdn.example.org/Other.webp 1x`,
    );
    const responsive = doc.getElementById("responsive");
    assert.equal(
      responsive.getAttribute("srcset"),
      `data:image/png;base64,AAAA, ${proxied("https://i.imgur.com/Small.png")}`,
    );
    assert.equal(doc.getElementById("lookalike").src, "https://i.imgur.com.example.org/Thumb.png");
    responsive.src = "https://i.imgur.com/Lazy.gif";
    const source = doc.querySelector("source");
    source.srcset = "https://i.imgur.com/Source.png 320w";
    doc
      .querySelector(".topic_content")
      .insertAdjacentHTML(
        "afterend",
        '<div class="reply_content"><img id="later" src="https://i.imgur.com/Reply.jpg"></div>',
      );
    await new Promise(setImmediate);
    assert.equal(responsive.src, proxied("https://i.imgur.com/Lazy.gif"));
    assert.equal(source.srcset, `${proxied("https://i.imgur.com/Source.png")} 320w`);
    assert.equal(doc.getElementById("later").src, proxied("https://i.imgur.com/Reply.jpg"));

    image.click();
    const viewer = document.querySelector(".vx-image-viewer");
    frame.dispatchEvent(new window.Event("load"));
    const large = viewer.querySelector("img");
    assert.equal(large.src, proxied(original));
    const direct = viewer.querySelector(".v2p-modal-actions a");
    assert.equal(direct.href, original);
    assert.equal(direct.target, "_blank");
    large.dispatchEvent(new window.Event("error"));
    assert.equal(large.src, proxied(thumbnail));
    large.dispatchEvent(new window.Event("error"));
    assert.ok(viewer.querySelector('[role="status"]'));
    assert.ok(direct.isConnected);
  } finally {
    window.close();
  }
});

test("topic images open in place while ordinary links and emoji keep their behavior", () => {
  const { window } = dom(`<div id="Main"><div class="topic_content">
    <img id="plain" src="/plain.png" alt="Screenshot">
    <a id="linked" href="/full.png" target="_blank"><img src="/thumbnail.png"></a>
    <a id="website" href="/member/Alice" target="_blank"><img src="/logo.png"></a>
    <img id="emoji" class="v2p-emoji-img" src="/emoji.png">
  </div></div>`);
  const main = document.getElementById("Main");
  installImageViewer(main);
  enhanceImages(main);
  const plain = document.getElementById("plain");
  assert.equal(plain.tabIndex, 0);
  assert.equal(plain.getAttribute("role"), "button");
  assert.equal(document.getElementById("emoji").hasAttribute("tabindex"), false);

  plain.focus();
  const press = (node, key) =>
    node.dispatchEvent(
      new window.KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }),
    );
  assert.equal(press(plain, "Enter"), false);
  const viewer = () => document.querySelector(".vx-image-viewer");
  assert.equal(viewer().querySelector("img").src, "https://www.v2ex.com/plain.png");
  assert.equal(viewer().querySelector("img").alt, "Screenshot");
  press(document, "Escape");
  assert.equal(viewer(), null);
  assert.equal(document.activeElement, plain);

  document.getElementById("linked").click();
  const large = viewer().querySelector("img");
  assert.equal(large.src, "https://www.v2ex.com/full.png");
  large.dispatchEvent(new window.Event("error"));
  assert.equal(large.src, "https://www.v2ex.com/thumbnail.png");
  large.dispatchEvent(new window.Event("error"));
  assert.ok(viewer().querySelector('[role="status"]'));
  press(document, "Escape");

  document.querySelector("#website img").click();
  document.getElementById("emoji").click();
  assert.equal(viewer(), null);
  main.insertAdjacentHTML("beforeend", '<div class="reply_content"><img src="/new.png"></div>');
  main.querySelector(".reply_content img").click();
  assert.equal(viewer().querySelector("img").src, "https://www.v2ex.com/new.png");
  press(document, "Escape");
  window.close();
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

test("topic lists show one author tag when author and latest replier links repeat", () => {
  dom(`<div id="Main">
    <div class="cell item"><span class="topic_info">
      <strong><a href="/member/burnsby">burnsby</a></strong><span>Today</span>
      <strong><a href="/member/burnsby">burnsby</a></strong>
    </span></div>
    <div class="cell item"><span class="topic_info">
      <strong><a href="/member/burnsby">burnsby</a></strong><span>Yesterday</span>
      <strong><a href="/member/Alice">Alice</a></strong>
    </span></div></div>`);
  const store = createStorage(memoryAPI());
  store.setTags("burnsby", ["Test"]);
  store.setTags("Alice", ["Another member"]);
  const members = createMembers(store, { tags: true, userCards: false });
  members.enhance(document);
  members.enhance(document);
  for (const info of document.querySelectorAll(".topic_info")) {
    members.enhance(info.querySelector("strong:last-of-type a"));
    assert.equal(info.querySelectorAll(".vx-tags").length, 1);
    assert.equal(info.querySelector("strong").nextElementSibling, info.querySelector(".vx-tags"));
    assert.equal(info.querySelector(".vx-tags").title, "Test");
  }
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
  assert.ok(profile.closest(".vx-tag-card"));
  assert.equal(
    search.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Enter", cancelable: true })),
    false,
  );
  const edit = list.querySelector(".vx-tag-actions button");
  assert.ok(edit.querySelector('svg[aria-hidden="true"]'));
  assert.equal(edit.getAttribute("aria-label"), "Edit tags for alice");
  edit.click();
  const input = details.querySelector(".vx-tag-fields textarea");
  const entry = details.querySelector(".vx-tag-entry textarea");
  assert.equal(details.querySelector(".vx-tag-input .sl"), null);
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
  const toggle = list.querySelector(".vx-tag-more");
  assert.equal(toggle.textContent, "+2");
  assert.equal(toggle.getAttribute("aria-expanded"), "false");
  assert.equal(list.querySelectorAll(".vx-tag-filter").length, 3);
  toggle.click();
  assert.equal(toggle.getAttribute("aria-expanded"), "true");
  assert.equal(list.querySelectorAll(".vx-tag-filter").length, 5);
  toggle.click();
  assert.equal(list.querySelectorAll(".vx-tag-filter").length, 3);
  group.value = "Pending";
  group.dispatchEvent(new Event("change"));
  assert.equal(list.querySelector('.vx-tag-filter[aria-pressed="true"]').textContent, "Pending");
  const remove = list.querySelector(".vx-tag-delete");
  assert.ok(remove.querySelector('svg[aria-hidden="true"]'));
  assert.equal(remove.title, "Delete tags for alice");
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
