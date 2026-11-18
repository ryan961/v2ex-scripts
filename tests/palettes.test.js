import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { compile } from "sass";
import { applyTheme, normalizeTheme } from "../src/theme.js";
import { dom } from "./helpers.js";

test("theme IDs are validated while Polish structure and preview markers remain intact", () => {
  const { window } = dom('<div id="site-header"></div>');
  for (const value of [undefined, null, "unknown", ["arco-clear"], {}])
    assert.equal(normalizeTheme(value), "arco-clear");
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
  assert.equal(root.dataset.vxTheme, "arco-clear");
  applyTheme(document, true, "native");
  assert.equal(root.dataset.vxTheme, "native");
  assert.equal(root.dataset.v2pTheme, undefined);
  assert.equal(root.dataset.v2pPreview, "1");
  assert.equal(document.body.classList.contains("v2p-theme-minimalist"), false);
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

test("native theme leaves site colors and geometry intact while feature surfaces follow the site", () => {
  const { window } = dom(`<style>
    :root { --box-background-color:#ffffff; --box-foreground-color:#000000; --box-border-radius:3px; --color-gray:#999999; }
    :root.night { --box-background-color:#18222d; --box-foreground-color:#d1d5d9; --color-gray:#b2c3d4; }
    body { color:var(--box-foreground-color); margin:8px; }
    #Main .cell { padding:10px; background:var(--box-background-color); color:var(--box-foreground-color); }
    #Main a { color:#778087; }
  </style><div id="Main"><div class="cell" id="r_1"><a href="/member/Alice">Alice</a></div></div>
  <div class="vx-member-popup v2p-popup"><div class="v2p-popup-content"><div class="v2p-member-card">Card</div></div></div>`);
  const selectors = ["body", "#Main .cell", "#Main a"];
  const properties = [
    "color",
    "backgroundColor",
    "padding",
    "margin",
    "position",
    "fontFamily",
    "fontSize",
  ];
  const snapshot = () =>
    selectors.map((selector) => {
      const style = window.getComputedStyle(document.querySelector(selector));
      return Object.fromEntries(properties.map((property) => [property, style[property]]));
    });
  const original = snapshot();
  const style = document.createElement("style");
  style.textContent =
    ["src/themes/native.scss", "src/vendor/polish/v2ex-effect.scss", "src/vendor/rep/content.scss"]
      .map((file) => compile(file).css)
      .join("\n") + readFileSync("src/styles.css", "utf8");
  document.head.append(style);
  applyTheme(document, false, "native");
  assert.deepEqual(snapshot(), original);
  assert.equal(
    window.getComputedStyle(document.querySelector(".v2p-popup")).backgroundColor,
    "rgb(255, 255, 255)",
  );
  document.documentElement.classList.add("night");
  assert.equal(
    window.getComputedStyle(document.querySelector(".v2p-popup")).backgroundColor,
    "rgb(24, 34, 45)",
  );
  assert.equal(window.getComputedStyle(document.body).color, "rgb(209, 213, 217)");
  assert.equal(window.getComputedStyle(document.querySelector("#r_1")).padding, "10px");
  assert.equal(document.documentElement.dataset.v2pTheme, undefined);
  window.close();
});

test("enhanced themes follow the native dark selection and system changes in auto mode", () => {
  const { window } = dom('<div class="box">Panel</div><div class="v2p-modal-main">Dialog</div>');
  const root = document.documentElement;
  let onChange;
  const media = {
    matches: false,
    addEventListener(type, listener) {
      assert.equal(type, "change");
      assert.equal(onChange, undefined);
      onChange = listener;
    },
  };
  window.matchMedia = (query) => {
    assert.equal(query, "(prefers-color-scheme: dark)");
    return media;
  };
  const style = document.createElement("style");
  style.textContent = compile("src/theme.scss").css;
  document.head.append(style);
  const background = (node) => window.getComputedStyle(node).backgroundColor;
  const dialog = document.querySelector(".v2p-modal-main");

  root.dataset.siteTheme = "dark";
  applyTheme(document, false, "minimalist");
  assert.equal(background(document.body), "rgb(21, 26, 36)");
  assert.equal(background(dialog), "rgb(30, 37, 50)");
  applyTheme(document, false, "arco-clear");
  assert.equal(background(dialog), "rgb(35, 35, 36)");
  assert.equal(window.getComputedStyle(root).colorScheme, "dark");

  root.dataset.siteTheme = "auto";
  assert.equal(background(dialog), "rgb(255, 255, 255)");
  media.matches = true;
  onChange();
  assert.equal(background(dialog), "rgb(35, 35, 36)");
  root.dataset.siteTheme = "light";
  assert.equal(background(dialog), "rgb(255, 255, 255)");
  assert.equal(window.getComputedStyle(root).colorScheme, "light");
  window.close();
});
