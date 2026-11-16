import assert from "node:assert/strict";
import test from "node:test";
import { createReplyFolding } from "../src/folding.js";
import { dom } from "./helpers.js";

test("long replies fold at their measured height and unfold without changing other controls", () => {
  const { window } = dom(`<main id="Main">
    <div class="cell"><button id="action">Reply</button><div class="reply_content">${"word ".repeat(80)}</div></div>
    <div class="reply_content">short</div>
    <div class="reply_content"><img src="https://example.test/photo.png"></div>
  </main>`);
  const [long, short, media] = document.querySelectorAll(".reply_content");
  let mediaHeight = 200;
  long.getBoundingClientRect = short.getBoundingClientRect = () => ({ height: 300 });
  media.getBoundingClientRect = () => ({ height: mediaHeight });
  createReplyFolding(false).enhance(document);
  assert.equal(document.querySelectorAll(".v2p-expand-btn").length, 0);
  const folding = createReplyFolding();
  folding.enhance(document);
  folding.enhance(document);
  assert.equal(document.querySelectorAll(".v2p-expand-btn").length, 1);
  const control = long.nextElementSibling;
  assert.equal(control.getAttribute("aria-expanded"), "false");
  assert.equal(document.querySelector("#action").closest(".v2p-reply-content"), null);
  control.click();
  assert.equal(control.getAttribute("aria-expanded"), "true");
  assert.equal(long.parentElement.classList.contains("v2p-collapsed"), false);
  control.click();
  assert.equal(control.getAttribute("aria-expanded"), "false");
  assert.equal(short.nextElementSibling, media);
  mediaHeight = 400;
  media.querySelector("img").dispatchEvent(new Event("load"));
  assert.equal(media.nextElementSibling.getAttribute("aria-expanded"), "false");
  folding.destroy();
  window.close();
});
