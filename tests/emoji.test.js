import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { enhanceEmojis, initEmoji, transformEmoji } from "../src/emoji.js";
import { createTopics } from "../src/preview.js";
import groups from "../src/vendor/polish/emoticons.json" with { type: "json" };
import { dom } from "./helpers.js";

test("Polish emoji groups retain image tokens and native emoji", () => {
  assert.equal(groups.length, 5);
  const image = groups[0].items[0];
  assert.equal(
    transformEmoji(`before ${image.value} after [unknown]`),
    `before ${image.url}  after [unknown]`,
  );
  dom(`<img class="embedded_image" src="${image.url}">`);
  enhanceEmojis(document);
  assert.equal(document.querySelector("img").src, image.image);
  assert.equal(document.querySelector("img").classList.contains("v2p-emoji-img"), true);
});

test("emoji picker preserves the current selection and draft", async () => {
  dom(
    '<div id="reply-box"><form><textarea id="reply_content">before after</textarea><button type="submit">Reply</button></form></div>',
  );
  const textarea = document.querySelector("textarea");
  textarea.setSelectionRange(7, 7);
  initEmoji({ emoji: true });
  document.querySelector('[aria-label="\u63d2\u5165\u8868\u60c5"]').click();
  assert.equal(document.querySelectorAll(".v2p-emoji-group").length, 5);
  const face = groups[1].items[0].value;
  const choice = [...document.querySelectorAll(".v2p-emoji")].find((node) => node.title === face);
  choice.click();
  assert.equal(textarea.value, `before ${face}after`);
  document.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  assert.equal(document.querySelector(".v2p-popup").hidden, true);
  await new Promise(setImmediate);
});

test("topic preview uses its own emoji picker and lets Escape close it before the preview", async () => {
  const topic = readFileSync(new URL("./fixtures/topic.html", import.meta.url), "utf8");
  for (const [emoji, signedIn] of [
    [true, true],
    [false, true],
    [true, false],
  ]) {
    const { window } = dom('<span class="item_title"><a href="/t/456">Topic</a></span>');
    try {
      createTopics({ preview: true, emoji }).enhance(document);
      document.querySelector(".v2p-topic-preview-btn").click();
      const frame = document.querySelector("iframe");
      const view = frame.contentWindow;
      const doc = frame.contentDocument;
      doc.open();
      doc.write(signedIn ? topic : topic.replaceAll('href="/member/reader"', 'href="/signin"'));
      doc.close();
      frame.dispatchEvent(new window.Event("load"));
      const trigger = doc.querySelector("#reply-box button[aria-expanded]");
      assert.equal(Boolean(trigger), emoji && signedIn);
      assert.equal(document.querySelector(".v2p-popup"), null);
      if (!trigger) continue;

      const textarea = doc.querySelector("#reply_content");
      textarea.value = "Draft: end";
      textarea.setSelectionRange(7, 7);
      textarea.dispatchEvent(new view.Event("input", { bubbles: true }));
      trigger.click();
      const popup = doc.querySelector(".v2p-popup");
      const item = groups[0].items[0];
      popup.querySelector(".v2p-emoji").click();
      assert.equal(textarea.value, `Draft: ${item.value}end`);
      await new Promise(setImmediate);
      assert.equal(popup.hidden, false);
      assert.notEqual(popup.style.left, "");

      const escape = () =>
        textarea.dispatchEvent(
          new view.KeyboardEvent("keydown", {
            key: "Escape",
            bubbles: true,
            cancelable: true,
          }),
        );
      escape();
      assert.equal(popup.hidden, true);
      assert.equal(frame.isConnected, true);

      textarea.form.dispatchEvent(new view.Event("submit", { bubbles: true, cancelable: true }));
      assert.equal(textarea.value, `Draft: ${item.url} end`);
      escape();
      assert.equal(frame.isConnected, false);
    } finally {
      window.close();
    }
  }
});
