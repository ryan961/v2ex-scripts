import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { compile } from "sass";
import { applyTheme, normalizeTheme } from "../src/theme.js";
import { dom } from "./helpers.js";

test("theme IDs are validated while Polish structure and preview markers remain intact", () => {
  const { window } = dom('<div id="site-header"></div>');
  for (const value of [undefined, null, "unknown", ["arco-clear"], {}])
    assert.equal(normalizeTheme(value), "minimalist");
  applyTheme(document, true, "arco-clear");
  const root = document.documentElement;
  assert.equal(root.dataset.vxTheme, "arco-clear");
  assert.equal(root.dataset.v2pTheme, "minimalist");
  assert.equal(root.dataset.v2pPreview, "1");
  assert.equal(root.dataset.v2pMobile, "true");
  assert.equal(document.body.classList.contains("v2p-theme-minimalist"), true);
  applyTheme(document, true);
  assert.equal(root.dataset.vxTheme, "arco-clear");
  applyTheme(document, true, "invalid");
  assert.equal(root.dataset.vxTheme, "minimalist");
  window.close();
});

test("Arco colors override both root and body palettes without modifying geometry rules", () => {
  const { window } = dom(
    '<div id="Main"><div class="box"><div class="cell" id="r_1">Reply</div></div></div>',
  );
  const style = document.createElement("style");
  style.textContent = compile("src/theme.scss").css;
  document.head.append(style);
  applyTheme(document, false, "arco-clear");
  assert.equal(window.getComputedStyle(document.body).color, "rgb(29, 33, 41)");
  assert.equal(window.getComputedStyle(document.body).backgroundColor, "rgb(247, 248, 250)");
  assert.equal(
    window.getComputedStyle(document.documentElement).getPropertyValue("--v2p-color-accent-600"),
    "#165dff",
  );
  const allowed = new Set([
    "color",
    "background-color",
    "background-image",
    "border-color",
    "outline",
    "outline-offset",
    "box-shadow",
    "transition",
  ]);
  for (const file of ["base", "compat", "minimalist", "arco-clear"])
    for (const [, property] of readFileSync(`src/themes/${file}.scss`, "utf8").matchAll(
      /^\s*([a-z-]+):/gm,
    ))
      assert.ok(
        property.startsWith("--") || allowed.has(property),
        `${file}: ${property} changes layout`,
      );
  window.close();
});
