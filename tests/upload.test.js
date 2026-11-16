import assert from "node:assert/strict";
import test from "node:test";
import { replacePlaceholder, uploadImage } from "../src/upload.js";
import { dom } from "./helpers.js";

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
    uploadImage(image, "", () => assert.fail()),
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
