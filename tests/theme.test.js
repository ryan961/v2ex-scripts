import assert from "node:assert/strict";
import test from "node:test";
import { compile } from "sass";
import { dom } from "./helpers.js";

test("theme keeps native V2EX reply spacing and typography", () => {
  dom(`<style>
    .box { padding: 0; }
    .cell { padding: 10px; font-size: 14px; line-height: 150%; }
    .reply_content { font-size: 14px; line-height: 1.6; }
    .ago { font-size: 11px; }
    .no { font-size: 9px; line-height: 9px; padding: 2px 5px; }
    .sep3 { height: 3px; }
  </style><div id="Main"><div class="box" id="replies"><div class="cell" id="r_1"><table><tbody><tr><td width="48"><img class="avatar" width="48"></td><td width="10"></td><td><span class="ago">now</span><span class="no">1</span><div class="sep3"></div><div class="reply_content"><p>Native paragraph</p></div></td></tr></tbody></table></div></div></div>`);
  const selectors = [
    "#replies",
    "#r_1",
    ".reply_content",
    ".ago",
    ".no",
    ".sep3",
    "td",
    "img.avatar",
    ".reply_content p",
  ];
  const properties = [
    "fontSize",
    "lineHeight",
    "paddingTop",
    "paddingRight",
    "paddingBottom",
    "paddingLeft",
    "marginTop",
    "marginBottom",
    "width",
    "height",
  ];
  const metrics = () =>
    selectors.map((selector) => {
      const style = window.getComputedStyle(document.querySelector(selector));
      return properties.map((property) => style[property]);
    });
  const native = metrics();
  const style = document.createElement("style");
  style.textContent = compile("src/theme.scss").css;
  document.head.append(style);
  assert.deepEqual(metrics(), native);
});
