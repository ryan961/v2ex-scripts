import assert from "node:assert/strict";
import test from "node:test";
import { openSettings } from "../src/settings.js";
import { createStorage } from "../src/storage.js";
import { dom, memoryAPI } from "./helpers.js";

test("settings expose Chinese labels and associated explanations for every option", () => {
  dom("");
  const store = createStorage(memoryAPI());
  store.saveOptions({ preloadPages: 3, imgurClientId: "custom123", privacy: true });
  openSettings(store);
  const controls = [...document.querySelectorAll("form input[name]")];
  assert.equal(controls.length, 12);
  assert.equal(document.querySelectorAll("fieldset legend").length, 4);
  assert.equal(
    document.querySelector(".v2p-modal-footer [type=submit]").form.id,
    "vx-settings-form",
  );
  for (const control of controls) {
    assert.match(control.closest("label").textContent, /[\u4e00-\u9fff]/);
    const help = document.getElementById(control.getAttribute("aria-describedby"));
    assert.match(help.textContent, /[\u4e00-\u9fff]/);
  }
  assert.equal(document.querySelector('[name="privacy"]').checked, true);
  assert.equal(document.querySelector('[name="preloadPages"]').value, "3");
  assert.equal(document.querySelector('[name="imgurClientId"]').value, "custom123");
  assert.equal(document.querySelectorAll('[name*="font"]').length, 0);
  document.querySelector(".v2p-modal-close-btn").click();
});

test("guest settings retain saved preferences and show account dependencies", () => {
  dom('<html lang="zh-CN">');
  document.cookie = "V2EX_LANG=enus";
  const original = createStorage(memoryAPI()).options();
  let saved;
  openSettings(
    {
      options: () => original,
      saveOptions(next) {
        saved = next;
        throw new Error("Stop before the browser reload");
      },
    },
    false,
  );
  assert.match(document.querySelector(".v2p-modal-title").textContent, /Settings/);
  assert.match(document.querySelector(".vx-settings-notice").textContent, /Sign in/);
  for (const key of ["autoCheckIn", "emoji", "upload", "imgurClientId"]) {
    const control = document.querySelector(`[name="${key}"]`);
    assert.equal(control.disabled, true);
    assert.equal(control.checked, false);
    assert.match(
      document.getElementById(control.getAttribute("aria-describedby")).textContent,
      /Requires V2EX sign-in/,
    );
  }
  document.querySelector('[name="preloadPages"]').value = "1";
  document
    .querySelector("form")
    .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  assert.deepEqual(saved, { ...original, preloadPages: 1 });
  document.querySelector(".v2p-modal-close-btn").click();
});

test("invalid preload values cannot overwrite saved settings", () => {
  dom("");
  const api = memoryAPI(),
    store = createStorage(api);
  openSettings(store);
  document.querySelector('[name="preloadPages"]').value = "99";
  document
    .querySelector("form")
    .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  assert.equal(api.writes.length, 0);
  document.querySelector(".v2p-modal-close-btn").click();
});
