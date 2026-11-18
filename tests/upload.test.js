import assert from "node:assert/strict";
import test from "node:test";
import { setLanguage } from "../src/i18n.js";
import { initUpload, openUploadHistory, replacePlaceholder, uploadImage } from "../src/upload.js";
import { createStorage, DEFAULT_IMGUR_CLIENT_ID } from "../src/storage.js";
import { dom, memoryAPI } from "./helpers.js";

test("upload completion preserves concurrent typing and removed markers", () => {
  dom("<textarea></textarea>");
  const textarea = document.querySelector("textarea");
  textarea.value = "before [upload] after plus new typing";
  textarea.setSelectionRange(textarea.value.length, textarea.value.length);
  assert.equal(replacePlaceholder(textarea, "[upload]", "https://i.imgur.com/a.png"), true);
  assert.equal(textarea.value, "before https://i.imgur.com/a.png after plus new typing");
  assert.equal(textarea.selectionStart, textarea.value.length);
  const before = textarea.value;
  assert.equal(replacePlaceholder(textarea, "[gone]", "link"), false);
  assert.equal(textarea.value, before);
});

test("upload validates files and response URLs before changing the draft", async () => {
  dom("");
  setLanguage("en");
  const image = new File(["image"], "test.png", { type: "image/png" });
  const result = await uploadImage(image, "client123", (request) => {
    assert.equal(request.url, "https://api.imgur.com/3/image");
    assert.equal(request.anonymous, true);
    assert.equal(request.headers.Authorization, "Client-ID client123");
    request.onload({
      status: 200,
      responseText:
        '{"success":true,"data":{"link":"https://i.imgur.com/a.png","deletehash":"abc123"}}',
    });
  });
  assert.equal(result.link, "https://i.imgur.com/a.png");
  await assert.rejects(
    uploadImage(image, "invalid\r\nid", () => assert.fail()),
    /Client ID/,
  );
  await assert.rejects(
    uploadImage(new File(["x"], "x.svg", { type: "image/svg+xml" }), "client", () => assert.fail()),
    /PNG/,
  );
  await assert.rejects(
    uploadImage(image, "client", (request) =>
      request.onload({
        status: 200,
        responseText: '{"success":true,"data":{"link":"https://evil.test/a.png"}}',
      }),
    ),
    /failed/,
  );
  await assert.rejects(
    uploadImage(image, "client", (request) => request.ontimeout()),
    /timed out/,
  );
});

test("empty custom Client ID uses the upstream public default", async () => {
  dom("");
  const image = new File(["image"], "image.png", { type: "image/png" });
  await uploadImage(image, "", (request) => {
    assert.equal(request.headers.Authorization, `Client-ID ${DEFAULT_IMGUR_CLIENT_ID}`);
    request.onload({
      status: 200,
      responseText:
        '{"success":true,"data":{"link":"https://i.imgur.com/a.png","deletehash":"hash123"}}',
    });
  });
});

test("upload entry uses the original REP reply header position", () => {
  dom(
    '<div id="reply-box"><div class="cell"><div>New Comment</div><div>Back to top</div></div><div class="cell"><form><textarea id="reply_content"></textarea><button type="submit">Reply</button></form></div></div>',
  );
  initUpload({ upload: true }, createStorage(memoryAPI()), () => assert.fail());
  assert.ok(document.querySelector("#reply-box > div > div > .vr_upload_image"));
  assert.equal(document.querySelector(".vx-upload .vr_upload_image"), null);
});

test("rate limiting stops the queue and persists the pause without rotating IDs", async () => {
  dom(
    '<form><textarea id="reply_content">Existing draft</textarea><button type="submit">Reply</button></form>',
  );
  const store = createStorage(memoryAPI());
  let calls = 0;
  initUpload({ upload: true, imgurClientId: "" }, store, (request) => {
    calls++;
    request.onload({
      status: 429,
      responseHeaders: "Retry-After: 60",
      responseText: "Too many uploads",
    });
  });
  const input = document.querySelector('input[type="file"]');
  Object.defineProperty(input, "files", {
    value: [
      new File(["a"], "a.png", { type: "image/png" }),
      new File(["b"], "b.png", { type: "image/png" }),
    ],
  });
  input.dispatchEvent(new Event("change"));
  await new Promise(setImmediate);
  assert.equal(calls, 1);
  assert.ok(store.get("upload-paused-until") > Date.now());
  assert.doesNotMatch(document.querySelector("textarea").value, /vx-upload/);
  assert.match(document.querySelector("textarea").value, /Existing draft/);
  assert.equal(store.uploads().length, 0);
});

test("upload records survive another storage instance and stay out of tag backups", () => {
  const api = memoryAPI(),
    first = createStorage(api),
    second = createStorage(api);
  first.recordUpload({ link: "https://i.imgur.com/a.png", deleteHash: "abc", fileName: "a.png" });
  second.recordUpload({ link: "https://i.imgur.com/b.png", deleteHash: "def", fileName: "b.png" });
  assert.equal(createStorage(api).uploads().length, 2);
  assert.doesNotMatch(first.export(), /deleteHash|i.imgur.com/);
});

test("rejected image drops cancel browser navigation and preserve the draft", () => {
  for (const paused of [true, false]) {
    const { window } = dom('<form><textarea id="reply_content">Unsaved draft</textarea></form>');
    const store = createStorage(memoryAPI());
    if (paused) store.set("upload-paused-until", Date.now() + 60_000);
    initUpload({ upload: true }, store, () => assert.fail("unexpected upload"));
    const textarea = document.querySelector("textarea");
    const drop = (files) => {
      const event = new window.Event("drop", { bubbles: true, cancelable: true });
      Object.defineProperty(event, "dataTransfer", { value: { files } });
      textarea.dispatchEvent(event);
      return event.defaultPrevented;
    };
    const image = new File(["image"], "test.png", { type: "image/png" });
    assert.equal(drop(Array(paused ? 1 : 11).fill(image)), true);
    assert.equal(textarea.value, "Unsaved draft");
    assert.equal(store.uploads().length, 0);
    assert.equal(drop([new File(["text"], "test.txt", { type: "text/plain" })]), false);
    assert.equal(drop([]), false);
    const submit = new window.Event("submit", { bubbles: true, cancelable: true });
    textarea.form.dispatchEvent(submit);
    assert.equal(submit.defaultPrevented, false);
    window.close();
  }
});

test("upload history links lazy Imgur previews and preserves original and deletion links", () => {
  dom("");
  openUploadHistory({
    uploads: () => [
      {
        link: "https://i.imgur.com/example.png",
        deleteHash: "remove123",
        fileName: "example.png",
        sourceTopic: { title: "Example topic", url: "https://v2ex.com/t/123?p=2#r_1" },
      },
      {
        link: "https://other.test/example.png",
        fileName: "other.png",
        sourceTopic: { title: "External link", url: "https://v2ex.com.other.test/t/123" },
      },
    ],
  });
  const images = document.querySelectorAll(".vx-upload-record img");
  assert.equal(images.length, 1);
  const [image] = images;
  assert.equal(image.getAttribute("src"), "https://i.imgur.com/examplem.png");
  assert.equal(image.getAttribute("loading"), "lazy");
  assert.equal(image.getAttribute("referrerpolicy"), "no-referrer");
  assert.equal(image.parentElement.href, "https://i.imgur.com/example.png");
  assert.equal(image.parentElement.target, "_blank");
  image.dispatchEvent(new Event("error"));
  assert.equal(image.src, "https://i.imgur.com/example.png");
  image.dispatchEvent(new Event("error"));
  assert.equal(image.isConnected, false);
  assert.ok(document.querySelector('a[href="https://i.imgur.com/example.png"]'));
  assert.ok(document.querySelector('a[href="https://imgur.com/delete/remove123"]'));
  assert.equal(
    document.querySelector('a[href="https://v2ex.com/t/123"]').textContent,
    "Example topic",
  );
  assert.equal(document.querySelector('a[href*="other.test"]'), null);
  document.querySelector(".v2p-modal-close-btn").click();
});

test("uploads record the source topic with the image in one write", async () => {
  for (const [path, expected] of [
    ["/t/123?p=2#r_99", { url: "https://www.v2ex.com/t/123", title: "Topic title" }],
    ["/new", undefined],
  ]) {
    const { window } = dom(
      '<div id="Main"><div class="header"><h1>Topic title</h1></div><form><textarea name="content"></textarea></form></div>',
      `https://www.v2ex.com${path}`,
    );
    const api = memoryAPI();
    const store = createStorage(api);
    initUpload({ upload: true }, store, (request) =>
      request.onload({
        status: 200,
        responseText: '{"success":true,"data":{"link":"https://i.imgur.com/a.png"}}',
      }),
    );
    const input = document.querySelector('input[type="file"]');
    Object.defineProperty(input, "files", {
      value: [new File(["a"], "a.png", { type: "image/png" })],
    });
    input.dispatchEvent(new Event("change"));
    await new Promise(setImmediate);
    assert.equal(api.writes.length, 1);
    assert.deepEqual(store.uploads()[0].sourceTopic, expected);
    assert.equal(document.querySelector("textarea").value.trim(), "https://i.imgur.com/a.png");
    window.close();
  }
});

test("history removes confirmed Imgur deletions and lets users remove local records", async () => {
  const { window } = dom("");
  setLanguage("en");
  const store = createStorage(memoryAPI());
  store.recordUpload({ link: "https://i.imgur.com/deleted.png", fileName: "deleted.png" });
  store.recordUpload({ link: "https://i.imgur.com/unknown.png", fileName: "unknown.png" });
  const previousFetch = globalThis.fetch;
  const requests = [];
  globalThis.fetch = async (url, options) => {
    requests.push({ url, method: options.method });
    return url.endsWith("/deleted.png")
      ? { redirected: true, url: "https://i.imgur.com/removed.png" }
      : { status: 404, redirected: false, url };
  };
  try {
    openUploadHistory(store);
    for (const preview of document.querySelectorAll(".vx-upload-record-preview img"))
      preview.dispatchEvent(new Event("load"));
    await new Promise(setImmediate);
    assert.deepEqual(
      store.uploads().map((record) => record.fileName),
      ["unknown.png"],
    );
    assert.equal(requests.length, 2);
    assert.ok(requests.every(({ method }) => method === "HEAD"));
    assert.match(
      document.querySelector(".vx-upload-history-status").textContent,
      /deleted on Imgur/,
    );
    const remove = document.querySelector(".vx-upload-remove");
    window.confirm = () => false;
    remove.click();
    assert.equal(store.uploads().length, 1);
    window.confirm = () => true;
    remove.click();
    assert.deepEqual(store.uploads(), []);
    assert.equal(requests.length, 2);
    assert.equal(document.querySelector(".vx-upload-record"), null);
    assert.match(document.querySelector(".v2p-modal-content").textContent, /No uploads yet/);
    document.querySelector(".v2p-modal-close-btn").click();
  } finally {
    globalThis.fetch = previousFetch;
    window.close();
  }
});
