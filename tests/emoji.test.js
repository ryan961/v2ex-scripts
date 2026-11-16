import assert from "node:assert/strict";
import test from "node:test";
import { enhanceEmojis, initEmoji, transformEmoji } from "../src/emoji.js";
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
