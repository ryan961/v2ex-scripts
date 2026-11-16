import assert from "node:assert/strict";
import test from "node:test";
import { initUpload, replacePlaceholder, uploadImage } from "../src/upload.js";
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
