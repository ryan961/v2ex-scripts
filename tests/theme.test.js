import assert from "node:assert/strict";
import test from "node:test";
import { compile } from "sass";
import { readFileSync } from "node:fs";
import { dom } from "./helpers.js";

test("requested padding stays scoped to the topic list and top-level threaded replies", () => {
  dom(
    '<style>.cell {padding:10px}.reply-group > .reply-group-item {padding:8px 0} #Rightbar .cell.item {padding:7px}</style><div id="Main"><div class="box"><div id="Tabs"></div><div class="cell item" id="topic"></div></div><div class="box"><div class="cell item" id="other"></div></div><div class="box reply-threads-c"><div class="cell" id="r_1"></div><div class="reply-group"><div class="cell reply-group-item" id="r_2"></div></div></div></div><div id="Rightbar"><div class="cell item" id="side"></div></div>',
  );
  const style = document.createElement("style");
  style.textContent = compile("src/theme.scss").css;
  document.head.append(style);
  const padding = (id) => window.getComputedStyle(document.getElementById(id)).padding;
  assert.equal(padding("topic"), "15px 10px");
  assert.equal(padding("other"), "20px 10px");
  assert.equal(padding("r_1"), "15px 10px");
  assert.equal(padding("r_2"), "8px 0px");
  assert.equal(padding("side"), "7px");
});

test("title preview is visible before hover and separated from the title", () => {
  dom(
    '<div id="Main"><div class="cell"><span class="item_title">Title</span><button class="v2p-topic-preview-btn vx-preview-visible">Preview</button></div></div>',
  );
  const style = document.createElement("style");
  style.textContent = compile("src/theme.scss").css + readFileSync("src/styles.css", "utf8");
  document.head.append(style);
  const computed = window.getComputedStyle(document.querySelector("button"));
  assert.equal(computed.visibility, "visible");
  assert.equal(computed.marginInlineStart, "8px");
});

test("native thank-area styles cannot hide the Polish action icons", () => {
  dom('<div class="thank_area v2p-controls"><a href="#">Action</a></div>');
  document.documentElement.dataset.v2pTheme = "minimalist";
  const style = document.createElement("style");
  style.textContent =
    compile("src/theme.scss").css +
    readFileSync("src/styles.css", "utf8") +
    ".thank_area{display:inline-block}.thank_area>a{visibility:hidden}";
  document.head.append(style);
  assert.equal(
    window.getComputedStyle(document.querySelector(".thank_area")).display,
    "inline-flex",
  );
  assert.equal(window.getComputedStyle(document.querySelector("a")).visibility, "visible");
});

test("theme keeps native V2EX reply spacing and typography on desktop and mobile", () => {
  dom(`<style>
    .box { padding: 0; }
    .cell { padding: 10px; font-size: 14px; line-height: 150%; }
    .reply_content { font-size: 14px; line-height: 1.6; }
    .ago { font-size: 11px; }
    .no { font-size: 9px; line-height: 9px; padding: 2px 5px; }
    .sep3 { height: 3px; }
  </style><div id="Wrapper"><div class="content"><div id="Main"><div class="box" id="replies"><div class="cell" id="r_1"><table><tbody><tr><td width="48"><img class="avatar" width="48"></td><td width="10"></td><td><div class="flex-one-row"><span class="ago">now</span><span class="no">1</span></div><div class="sep3"></div><div class="reply_content"><p>Native paragraph</p></div></td></tr></tbody></table></div></div></div></div></div>`);
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
    ".flex-one-row",
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
  document.documentElement.dataset.v2pMobile = "true";
  assert.deepEqual(metrics(), native);
});

test("native reply groups remain visible through transparent reply items", () => {
  dom(`<style>
    .box { background-color: rgb(255, 255, 255); }
    .reply-group { background-color: rgb(247, 249, 251); }
  </style><div id="Main"><div class="box"><div class="cell" id="r_1">Normal reply</div><div class="reply-group"><div class="cell reply-group-item" id="r_2"><table><tbody><tr><td>Grouped reply</td></tr></tbody></table></div><div class="reply-group"><div class="cell reply-group-item" id="r_3">Nested group</div></div></div></div></div><div id="Rightbar"><div id="top_replies"><div class="cell" id="top_r_2">Popular reply</div></div></div>`);
  const items = ["#r_1", "#r_2", "#r_3", "#top_r_2"];
  const colors = () =>
    items.map(
      (selector) => window.getComputedStyle(document.querySelector(selector)).backgroundColor,
    );
  const native = colors();
  const style = document.createElement("style");
  style.textContent = compile("src/theme.scss").css;
  document.head.append(style);
  assert.deepEqual(colors(), native);
  assert.equal(
    window.getComputedStyle(document.querySelector("#r_2 table")).backgroundColor,
    "rgba(0, 0, 0, 0)",
  );
});

test("tag filters use their grid columns instead of V2EX's fixed input width", () => {
  dom(`<style>.sl { width: 320px; }</style>
    <input class="sl" id="native">
    <div id="vx-settings-dialog"><div class="vx-tag-filters">
      <label>Search<input type="search"></label>
      <label>Tag group<select class="vx-tag-group"><option>All tags</option></select></label>
      <span class="vx-tag-count">1 tagged member</span>
    </div></div>`);
  const style = document.createElement("style");
  style.textContent = readFileSync("src/styles.css", "utf8");
  document.head.append(style);
  const computed = (selector) => window.getComputedStyle(document.querySelector(selector));
  assert.match(
    computed(".vx-tag-filters").gridTemplateColumns,
    /^repeat\(2, minmax\(0(?:px)?, 1fr\)\)$/,
  );
  assert.equal(computed(".vx-tag-filters input").width, "100%");
  assert.equal(computed(".vx-tag-group").width, "100%");
  assert.equal(computed(".vx-tag-count").gridColumn, "1 / -1");
  assert.equal(computed("#native").width, "320px");
});

test("post-list member tags paint above the topic metadata overlay", () => {
  dom(`<span class="topic_info" style="pointer-events: none">
    <div class="vx-tags v2p-reply-tags">Tag</div>
  </span><div class="reply"><div class="vx-tags v2p-reply-tags">Tag</div></div>`);
  const style = document.createElement("style");
  style.textContent = readFileSync("src/styles.css", "utf8");
  document.head.append(style);
  const list = window.getComputedStyle(document.querySelector(".topic_info .vx-tags"));
  const reply = window.getComputedStyle(document.querySelector(".reply .vx-tags"));
  assert.equal(list.pointerEvents, "auto");
  assert.equal(list.zIndex, "2");
  assert.equal(list.lineHeight, reply.lineHeight);
});
