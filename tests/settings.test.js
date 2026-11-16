import assert from "node:assert/strict";
import test from "node:test";
import { openSettings } from "../src/settings.js";
import { setLanguage } from "../src/i18n.js";
import { createStorage } from "../src/storage.js";
import { dom, memoryAPI } from "./helpers.js";

test("closing upload history returns to settings and preserves unsaved fields", () => {
  const { window } = dom("");
  const api = memoryAPI();
  openSettings(createStorage(api), true);
  const settings = document.querySelector("#vx-settings-dialog");
  const language = settings.querySelector('[name="language"]');
  language.value = "ko";
  const history = settings.querySelector(".v2p-modal-actions button");
  for (const method of ["button", "escape", "backdrop"]) {
    history.focus();
    history.click();
    const child = [...document.querySelectorAll(".v2p-modal-mask")].at(-1);
    assert.notEqual(child, settings);
    assert.equal(settings.hasAttribute("inert"), true);
    if (method === "button") child.querySelector(".v2p-modal-close-btn").click();
    else if (method === "escape")
      document.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    else {
      child.dispatchEvent(new window.MouseEvent("mousedown", { bubbles: true }));
      child.dispatchEvent(new window.MouseEvent("mouseup", { bubbles: true }));
    }
    assert.equal(document.querySelectorAll(".v2p-modal-mask").length, 1);
    assert.equal(settings.isConnected, true);
    assert.equal(settings.hasAttribute("inert"), false);
    assert.equal(language.value, "ko");
    assert.equal(document.activeElement, history);
    assert.equal(document.body.classList.contains("v2p-modal-open"), true);
  }
  assert.deepEqual(api.writes, []);
  settings.querySelector(".v2p-modal-close-btn").click();
  assert.equal(document.querySelector(".v2p-modal-mask"), null);
  assert.equal(document.body.classList.contains("v2p-modal-open"), false);
  window.close();
});

test("settings expose Chinese labels and associated explanations for every option", () => {
  dom("");
  const store = createStorage(memoryAPI());
  store.saveOptions({ preloadPages: 3, imgurClientId: "custom123", privacy: true });
  openSettings(store);
  const controls = [...document.querySelectorAll("form :is(input,select)[name]")];
  assert.equal(controls.length, 13);
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
  const language = document.querySelector('[name="language"]');
  assert.equal(language.value, "zh");
  assert.deepEqual(
    [...language.options].map((option) => option.value),
    ["zh", "en", "ja", "ko", "site"],
  );
  assert.match(document.querySelector(".vx-storage-help").textContent, /\u672c\u5730/);
  assert.equal(document.querySelectorAll('[name*="font"]').length, 0);
  document.querySelector(".v2p-modal-close-btn").click();
});

test("guest settings retain saved preferences and show account dependencies", () => {
  dom('<html lang="zh-CN">');
  setLanguage("en");
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
  document.querySelector('[name="language"]').value = "ko";
  document
    .querySelector("form")
    .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  assert.deepEqual(saved, { ...original, preloadPages: 1, language: "ko" });
  document.querySelector(".v2p-modal-close-btn").click();
  setLanguage("zh");
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
