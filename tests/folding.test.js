import assert from "node:assert/strict";
import test from "node:test";
import { createReplyFolding } from "../src/folding.js";
import { dom } from "./helpers.js";

function animationFrames(window) {
  const pending = new Map();
  let next = 0;
  window.requestAnimationFrame = (callback) => {
    pending.set(++next, callback);
    return next;
  };
  window.cancelAnimationFrame = (id) => pending.delete(id);
  return {
    get size() {
      return pending.size;
    },
    flush() {
      const callbacks = [...pending.values()];
      pending.clear();
      for (const callback of callbacks) callback(0);
    },
  };
}

test("long replies fold at their measured height and unfold without changing other controls", () => {
  const { window } = dom(`<main id="Main">
    <div class="cell"><button id="action">Reply</button><div class="reply_content">${"word ".repeat(80)}</div></div>
    <div class="reply_content">short</div>
    <div class="reply_content"><img src="https://example.test/photo.png"></div>
  </main>`);
  const frames = animationFrames(window);
  const [long, short, media] = document.querySelectorAll(".reply_content");
  let mediaHeight = 200;
  long.getBoundingClientRect = short.getBoundingClientRect = () => ({ height: 300 });
  media.getBoundingClientRect = () => ({ height: mediaHeight });
  createReplyFolding(false).enhance(document);
  assert.equal(document.querySelectorAll(".v2p-expand-btn").length, 0);
  const folding = createReplyFolding();
  folding.enhance(document);
  folding.enhance(document);
  assert.equal(frames.size, 1);
  assert.equal(document.querySelectorAll(".v2p-expand-btn").length, 0);
  frames.flush();
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
  frames.flush();
  assert.equal(media.nextElementSibling.getAttribute("aria-expanded"), "false");
  folding.destroy();
  window.close();
});

test("separate enhancement calls measure every reply before inserting any folding wrapper", () => {
  const { window } = dom(`<div id="Main">
    <div class="reply_content">${"first ".repeat(80)}</div>
    <div class="reply_content">${"second ".repeat(80)}</div></div>`);
  const frames = animationFrames(window);
  const contents = [...document.querySelectorAll(".reply_content")];
  const measured = [];
  for (const content of contents)
    content.getBoundingClientRect = () => {
      assert.equal(document.querySelector(".v2p-reply-content"), null);
      measured.push(content);
      return { height: 400 };
    };
  const folding = createReplyFolding();
  for (const content of contents) folding.enhance(content);
  folding.enhance(document);
  assert.deepEqual(measured, []);
  assert.equal(frames.size, 1);
  frames.flush();
  assert.deepEqual(measured, contents);
  assert.equal(document.querySelectorAll(".v2p-collapsed").length, 2);
  folding.destroy();
  window.close();
});

test("resize callbacks share a frame, detach removed content and cancel work on page exit", () => {
  const { window } = dom('<div id="Main"><div class="reply_content"><img></div></div>');
  const frames = animationFrames(window);
  const watched = new Set();
  let resized;
  window.ResizeObserver = class {
    constructor(callback) {
      resized = callback;
    }
    observe(content) {
      watched.add(content);
    }
    unobserve(content) {
      watched.delete(content);
    }
    disconnect() {
      watched.clear();
    }
  };
  const content = document.querySelector(".reply_content");
  let measured = 0;
  content.getBoundingClientRect = () => {
    measured++;
    return { height: 200 };
  };
  const folding = createReplyFolding();
  folding.enhance(document);
  frames.flush();
  assert.equal(measured, 1);
  resized([{ target: content }]);
  resized([{ target: content }]);
  assert.equal(frames.size, 1);
  content.remove();
  frames.flush();
  assert.equal(measured, 1);
  assert.equal(watched.size, 0);
  document.querySelector("#Main").append(content);
  folding.enhance(content);
  assert.equal(frames.size, 1);
  window.dispatchEvent(new window.PageTransitionEvent("pagehide", { persisted: false }));
  assert.equal(frames.size, 0);
  assert.equal(watched.size, 0);
  resized([{ target: content }]);
  content.querySelector("img").dispatchEvent(new Event("load"));
  folding.enhance(content);
  assert.equal(frames.size, 0);
  window.close();
});
