// ==UserScript==
// @name         V2EX Lite
// @namespace    https://github.com/ryan961/v2ex-scripts
// @version      0.1.0
// @description  Focused V2EX themes, tags, previews, replies, check-in and image uploads.
// @author       ryan961
// @license      MIT
// @homepageURL  https://github.com/ryan961/v2ex-scripts
// @supportURL   https://github.com/ryan961/v2ex-scripts/issues
// @downloadURL  https://raw.githubusercontent.com/ryan961/v2ex-scripts/main/dist/v2ex-lite.user.js
// @updateURL    https://raw.githubusercontent.com/ryan961/v2ex-scripts/main/dist/v2ex-lite.meta.js
// @match        https://v2ex.com/*
// @match        https://*.v2ex.com/*
// @noframes
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_addValueChangeListener
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      api.imgur.com
// ==/UserScript==
/*
MIT License

Copyright (c) 2023-present LeoKu (https://github.com/Codennnn) and contributors

This project is a derivative work of V2EX Polish
(https://github.com/coolpace/V2EX_Polish) and includes contributions from its
authors and community contributors. The copyright notice above is intended to
cover all such contributions.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
(() => {
  // src/styles.css
  var styles_default = '@font-face {\n  font-family: "vivoSans";\n  font-weight: 400;\n  font-style: normal;\n  font-display: swap;\n  src:\n    local("vivo Sans"),\n    local("vivoSans-Regular"),\n    url("https://assets.leoku.dev/fonts/vivoSans-Regular.woff2") format("woff2");\n}\n@font-face {\n  font-family: "vivoSans";\n  font-weight: 500;\n  font-style: normal;\n  font-display: swap;\n  src:\n    local("vivo Sans Medium"),\n    local("vivoSans-Medium"),\n    url("https://assets.leoku.dev/fonts/vivoSans-Medium.woff2") format("woff2");\n}\n@font-face {\n  font-family: "vivoSans";\n  font-weight: 600;\n  font-style: normal;\n  font-display: swap;\n  src:\n    local("vivo Sans SemiBold"),\n    local("vivoSans-SemiBold"),\n    url("https://assets.leoku.dev/fonts/vivoSans-SemiBold.woff2") format("woff2");\n}\n@font-face {\n  font-family: "vivoSans";\n  font-weight: 700;\n  font-style: normal;\n  font-display: swap;\n  src:\n    local("vivo Sans Bold"),\n    local("vivoSans-Bold"),\n    url("https://assets.leoku.dev/fonts/vivoSans-Bold.woff2") format("woff2");\n}\n:root[data-vx-theme="minimalist"] {\n  color-scheme: light;\n  --vx-bg: var(--v2p-color-bg-content);\n  --vx-page: var(--v2p-color-background);\n  --vx-text: var(--v2p-color-foreground);\n  --vx-muted: var(--v2p-color-font-secondary);\n  --vx-line: var(--v2p-color-border);\n  --vx-accent: var(--v2p-color-foreground);\n  --box-background-color: var(--vx-bg);\n  --box-foreground-color: var(--vx-text);\n  --box-border-color: var(--vx-line);\n  --box-border-radius: 0px;\n  --color-fade: var(--vx-muted);\n  --color-gray: var(--vx-muted);\n}\nhtml[data-vx-theme] body,\nhtml[data-vx-theme] #Wrapper {\n  background: var(--vx-page) !important;\n  color: var(--vx-text) !important;\n}\nhtml[data-vx-theme] :is(body, button, input, select, textarea) {\n  font-family: "vivoSans", system-ui, sans-serif !important;\n}\nhtml[data-vx-theme]\n  :is(.box, .cell, .header, .inner, .topic_buttons, .reply_content, textarea, input, select) {\n  background-color: var(--vx-bg) !important;\n  color: var(--vx-text) !important;\n  border-color: var(--vx-line) !important;\n}\nhtml[data-vx-theme] :is(#Top, #Bottom) {\n  background: var(--vx-page) !important;\n  border: 0;\n  color: var(--vx-text) !important;\n}\nhtml[data-vx-theme] .box {\n  border: 1px solid var(--vx-line);\n  border-radius: 0;\n  box-shadow: none;\n}\nhtml[data-vx-theme] ::selection {\n  color: currentColor;\n  background: var(--v2p-color-selection-background);\n}\nhtml[data-vx-theme] :is(.item_title a, a.topic-link) {\n  font-weight: 500;\n}\nhtml[data-vx-theme] :is(pre, code) {\n  font-family: Consolas, Menlo, monospace;\n  background: var(--vx-page);\n}\nhtml[data-vx-theme] :is(.subtle, #SecondaryTabs) {\n  background: var(--vx-page) !important;\n}\nhtml[data-vx-theme] :is(a, a:visited) {\n  color: var(--vx-accent);\n}\nhtml[data-vx-theme] :is(.fade, .gray, .ago, .snow) {\n  color: var(--vx-muted) !important;\n}\nhtml[data-vx-privacy]\n  :is(\n    #Top a[href^="/member/"],\n    #Top a[href^="/settings"],\n    #Top a[href^="/balance"],\n    #Top a[href^="/signout"]\n  ) {\n  visibility: hidden !important;\n}\nhtml[data-vx-privacy] :is(.balance_area, #vx-account-box) {\n  visibility: hidden !important;\n  pointer-events: none !important;\n}\nhtml[data-vx-privacy] #Logo {\n  background: none !important;\n  width: 110px;\n  height: 30px;\n}\nhtml[data-vx-privacy] #Logo::after {\n  content: "Workspace";\n  font:\n    600 17px/30px "vivoSans",\n    system-ui,\n    sans-serif;\n  color: var(--vx-muted);\n}\n.vx-button {\n  font: inherit;\n  cursor: pointer;\n  color: var(--vx-accent);\n  background: var(--vx-bg);\n  border: 1px solid var(--vx-line);\n  border-radius: 4px;\n  padding: 3px 7px;\n  margin: 3px;\n}\n.vx-button:disabled {\n  opacity: 0.55;\n  cursor: default;\n}\n.vx-button:focus-visible,\n.vx-dialog a:focus-visible {\n  outline: 2px solid var(--vx-accent);\n  outline-offset: 2px;\n}\n#vx-settings {\n  position: fixed;\n  bottom: 14px;\n  right: 16px;\n  z-index: 1000;\n  box-shadow: 0 2px 8px #0002;\n}\n.vx-dialog {\n  background: var(--vx-bg);\n  color: var(--vx-text);\n  border: 1px solid var(--vx-line);\n  border-radius: 8px;\n  width: min(780px, calc(100vw - 48px));\n  max-height: 85vh;\n  overflow: auto;\n  padding: 18px;\n  overflow-wrap: anywhere;\n}\n.vx-dialog::backdrop {\n  background: #0008;\n}\n.vx-dialog > .vx-button:first-child {\n  float: right;\n}\n.vx-dialog h2 {\n  font-size: 20px;\n  line-height: 1.5;\n}\n.vx-dialog input:not([type="checkbox"]),\n.vx-dialog select {\n  max-width: 100%;\n  padding: 5px;\n}\n.vx-setting {\n  display: block;\n  padding: 6px 0;\n}\n.vx-tag {\n  display: inline-block;\n  background: var(--vx-page);\n  color: var(--vx-accent);\n  border: 1px solid var(--vx-line);\n  border-radius: 4px;\n  padding: 0 4px;\n  margin: 0 2px;\n  font-size: 11px;\n  overflow-wrap: anywhere;\n}\n.vx-tags .vx-button {\n  padding: 0 3px;\n  font-size: 10px;\n}\n.vx-card {\n  position: fixed;\n  width: min(290px, calc(100vw - 40px));\n  max-height: 220px;\n  overflow: auto;\n  z-index: 1100;\n  background: var(--vx-bg);\n  color: var(--vx-text);\n  padding: 12px;\n  border: 1px solid var(--vx-line);\n  border-radius: 6px;\n  box-shadow: 0 4px 20px #0003;\n  overflow-wrap: anywhere;\n}\n.vx-card[hidden] {\n  display: none;\n}\n.vx-card img {\n  float: right;\n}\n.vx-hot {\n  padding: 12px;\n  margin-top: 20px;\n  overflow-wrap: anywhere;\n}\n.vx-hot h3 {\n  margin: 0;\n  font-size: 15px;\n}\n.vx-hot p,\n.vx-hot summary {\n  font-size: 12px;\n  line-height: 1.7;\n}\n.vx-hot-item {\n  padding: 8px 0;\n  border-top: 1px solid var(--vx-line);\n}\n.vx-hot-item details {\n  max-height: 400px;\n  overflow: auto;\n}\n.vx-hot img,\n.vx-preview img,\n.vx-loaded-reply img {\n  max-width: 100%;\n  height: auto;\n}\n.vx-preview pre,\n.vx-loaded-reply pre {\n  overflow: auto;\n}\n.vx-preview {\n  line-height: 1.8;\n  padding-top: 12px;\n}\n.vx-toolbar,\n.vx-page {\n  padding: 10px;\n  border-bottom: 1px solid var(--vx-line);\n}\n.vx-upload {\n  padding: 8px 0;\n  line-height: 1.6;\n}\n.vx-upload p {\n  overflow-wrap: anywhere;\n  font-size: 12px;\n}\n.vx-loaded-reply {\n  padding: 12px;\n  border-bottom: 1px solid var(--vx-line);\n}\n.vx-loaded-reply .reply_content {\n  padding-top: 8px;\n}\n@media (max-width: 820px) {\n  #Rightbar:has(.vx-hot) {\n    display: block;\n    float: none;\n    width: auto;\n    margin: 0 10px;\n  }\n  #Rightbar:has(.vx-hot) > :not(.vx-hot) {\n    display: none;\n  }\n}\n';

  // src/polish-minimalist.css
  var polish_minimalist_default = '/* Adapted from V2EX Polish, v2ex-theme-minimalist.scss.\n * Copyright (c) 2023-present LeoKu and contributors. MIT; see THIRD-PARTY-NOTICES.md.\n */\nbody.v2p-theme-minimalist,\n.v2p-theme-minimalist,\n:root[data-v2p-theme="minimalist"],\n:root[data-v2p-theme="minimalist"] body {\n  --v2p-color-accent-50: oklch(97.9% 0.021 166.113deg);\n  --v2p-color-accent-100: oklch(95% 0.052 163.051deg);\n  --v2p-color-accent-200: oklch(90.5% 0.093 164.15deg);\n  --v2p-color-accent-300: oklch(84.5% 0.143 164.978deg);\n  --v2p-color-accent-400: oklch(76.5% 0.177 163.223deg);\n  --v2p-color-accent-500: oklch(69.6% 0.17 162.48deg);\n  --v2p-color-accent-600: oklch(59.6% 0.145 163.225deg);\n  --v2p-color-accent-700: oklch(50.8% 0.118 165.612deg);\n  --v2p-color-orange-50: #fff7ed;\n  --v2p-color-orange-100: #ffedd5;\n  --v2p-color-orange-400: #fb923c;\n\n  --v2p-color-background: oklch(97.6% 0.005 253deg);\n  --v2p-color-foreground: oklch(28.2% 0.091 267.935deg);\n  --v2p-color-selection-foreground: currentColor;\n  --v2p-color-selection-background: oklch(93.2% 0.032 255.585deg);\n  --v2p-color-selection-background-img: var(--v2p-color-selection-background);\n  --v2p-color-font-secondary: oklch(from var(--v2p-color-foreground) l c h / 80%);\n  --v2p-color-font-tertiary: oklch(from var(--v2p-color-foreground) l c h / 68%);\n  --v2p-color-font-quaternary: oklch(from var(--v2p-color-foreground) l c h / 57%);\n\n  --v2p-color-button-background: var(--v2p-color-background);\n  --v2p-color-button-foreground: var(--v2p-color-foreground);\n  --v2p-color-button-background-hover: oklch(from var(--v2p-color-foreground) l c h / 10%);\n  --v2p-color-button-foreground-hover: var(--v2p-color-foreground);\n  --v2p-color-button-special-background: var(--v2p-color-accent-50);\n  --v2p-color-button-special-foreground: var(--v2p-color-accent-700);\n  --v2p-color-button-special-border: var(--v2p-color-accent-600);\n\n  --v2p-color-bg-content: #fff;\n  --v2p-color-bg-footer: var(--v2p-color-background);\n  --v2p-color-bg-hover-btn: rgb(152 147 165 / 10%);\n  --v2p-color-bg-subtle: oklch(from var(--v2p-color-foreground) l c h / 2%);\n  --v2p-color-bg-input: var(--v2p-color-background);\n  --v2p-color-bg-search: var(--v2p-color-bg-content);\n  --v2p-color-bg-search-active: var(--v2p-color-bg-search);\n  --v2p-color-bg-widget: var(--v2p-color-bg-content);\n  --v2p-color-bg-reply: var(--v2p-color-background);\n  --v2p-color-bg-tooltip: var(--v2p-color-background);\n  --v2p-color-bg-tabs: var(--v2p-color-background);\n  --v2p-color-bg-tpr: var(--v2p-color-background);\n  --v2p-color-bg-avatar: var(--v2p-color-background);\n  --v2p-color-bg-block: var(--v2p-color-background);\n  --v2p-color-bg-block-darker: var(--v2p-color-background);\n  --v2p-color-bg-link: transparent;\n  --v2p-color-bg-link-hover: var(--v2p-color-background);\n\n  --v2p-color-tabs: var(--v2p-color-foreground);\n  --v2p-color-heart: #ef4444;\n  --v2p-color-heart-fill: #fee2e2;\n  --v2p-color-mask: rgb(0 0 0 / 25%);\n  --v2p-color-divider: lab(30.7907% 22.35 -63.8417 / 20%);\n  --v2p-color-border: var(--v2p-color-divider);\n  --v2p-color-input-border: var(--v2p-color-border);\n  --v2p-color-border-darker: lab(30.7907% 22.35 -63.8417 / 30%);\n  --v2p-color-link-visited: var(--v2p-color-font-secondary);\n  --v2p-color-error: #ef4444;\n  --v2p-color-bg-error: #fee2e2;\n  --v2p-color-cell-num: var(--v2p-color-font-secondary);\n  --v2p-box-radius: 0;\n  --v2p-input-radius: 4px;\n  --v2p-button-radius: var(--v2p-input-radius);\n  --v2p-popup-radius: var(--v2p-input-radius);\n\n  --v2p-box-shadow: none;\n  --v2p-widget-shadow: 0 2px 8px -2px lab(30.7907% 22.35 -63.8417 / 12%);\n  --v2p-toast-shadow: 0 4px 12px -2px lab(30.7907% 22.35 -63.8417 / 15%);\n\n  --link-color: var(--v2p-color-foreground);\n  --box-background-alt-color: var(--v2p-color-bg-block);\n  --box-background-hover-color: var(--v2p-color-bg-link-hover);\n  --button-hover-color: var(--v2p-color-button-background-hover);\n  --button-border-color: var(--v2p-color-border);\n  --button-border-hover-color: var(--v2p-color-border-darker);\n\n  position: relative;\n  visibility: visible;\n\n  .v2p-modal-mask {\n    background-color: oklch(from var(--v2p-color-bg-content) l c h / 60%);\n    background-image: repeating-linear-gradient(\n      0deg,\n      transparent,\n      transparent 2px,\n      rgb(30 64 175 / 3%) 2px,\n      rgb(30 64 175 / 3%) 4px\n    );\n  }\n\n  #Top {\n    background-color: var(--v2p-color-background);\n  }\n\n  #Wrapper {\n    #Main {\n      > .box:has(.topic_buttons),\n      .v2p-left-group .box:has(.topic_buttons) {\n        border-bottom: 1px solid var(--v2p-color-border) !important;\n      }\n\n      #SecondaryTabs {\n        border-radius: 0;\n      }\n    }\n\n    .box {\n      border: 1px solid var(--v2p-color-border);\n    }\n  }\n\n  #Rightbar {\n    > .box:has(.member-activity-bar) {\n      background-image: linear-gradient(\n        to top,\n        transparent 0%,\n        transparent 50%,\n        lab(30.7907% 22.35 -63.8417/8%) 100%\n      );\n    }\n  }\n\n  .fade {\n    color: var(--v2p-color-font-secondary);\n  }\n\n  .button {\n    &.special {\n      --button-hover-shadow:\n        0 1.8px 0 var(--v2p-color-accent-100), 0 1.8px 0 var(--v2p-color-accent-50);\n\n      &:hover {\n        &,\n        &:enabled {\n          --button-hover-shadow:\n            0 1.8px 0 var(--v2p-color-accent-500), 0 1.8px 0 var(--v2p-color-button-special-border);\n\n          text-shadow: none;\n        }\n      }\n    }\n  }\n\n  .badge {\n    &.op {\n      border: 1px solid var(--v2p-color-accent-100);\n      color: var(--v2p-color-accent-600);\n      background-color: var(--v2p-color-accent-100);\n    }\n\n    &.mod {\n      border: 1px solid var(--v2p-color-accent-600);\n      background-color: var(--v2p-color-accent-600);\n    }\n\n    &.pro {\n      border: 1px solid var(--v2p-color-foreground);\n      color: var(--v2p-color-bg-content);\n      background-color: var(--v2p-color-foreground);\n    }\n  }\n\n  .v2p-modal-main {\n    border: 2px solid var(--v2p-color-border);\n\n    .v2p-modal-header {\n      background-image: linear-gradient(\n        to bottom,\n        lab(30.7907% 22.35 -63.8417 / 3%) 0%,\n        transparent 100%\n      );\n    }\n  }\n\n  .v2p-control {\n    &::after {\n      background-color: var(--v2p-color-background);\n    }\n  }\n\n  .green {\n    color: var(--v2p-color-accent-500);\n  }\n\n  .onoffswitch label .frame::before {\n    background-color: var(--v2p-color-accent-500);\n  }\n\n  .onoffswitch label .frame::after {\n    background-color: var(--v2p-color-bg-search);\n  }\n\n  :is(.subtle) {\n    border: none;\n    background-color: transparent;\n    background-image: linear-gradient(\n      to right,\n      lab(30.7907% 22.35 -63.8417 / 8%) 0%,\n      transparent 100%\n    );\n  }\n}\n';

  // src/storage.js
  var PREFIX = "v2ex-lite:";
  var DEFAULTS = Object.freeze({
    privacy: false,
    newTab: true,
    preview: true,
    userCards: true,
    tags: true,
    preloadPages: 2,
    hotReplies: true,
    autoCheckIn: true,
    upload: true,
    imgurClientId: ""
  });
  var validName = /^[a-z0-9_-]{1,64}$/i;
  function normalizeOptions(input = {}) {
    const output = { ...DEFAULTS };
    if (!input || typeof input !== "object") return output;
    for (const key of Object.keys(DEFAULTS)) {
      if (typeof DEFAULTS[key] === "boolean" && typeof input[key] === "boolean")
        output[key] = input[key];
    }
    if (Number.isInteger(input.preloadPages) && input.preloadPages >= 0 && input.preloadPages <= 5) {
      output.preloadPages = input.preloadPages;
    }
    if (typeof input.imgurClientId === "string" && /^[a-z0-9]{0,64}$/i.test(input.imgurClientId)) {
      output.imgurClientId = input.imgurClientId;
    }
    return output;
  }
  function normalizeTags(value) {
    const raw = typeof value === "string" ? value.split(/[,\uFF0C\n]/) : value;
    if (!Array.isArray(raw) || raw.length > 20) throw new Error("Use at most 20 tags per user.");
    const result = [];
    for (const item of raw) {
      const text = typeof item === "string" ? item.trim() : item?.name?.trim?.();
      if (typeof text !== "string" || text.length > 80)
        throw new Error("Invalid tag; maximum length is 80.");
      if (text && !result.includes(text)) result.push(text);
    }
    return result;
  }
  function parseImport(text) {
    if (text.length > 2e6) throw new Error("Backup exceeds 2 MB.");
    const data = JSON.parse(text.replace(/^V2EX_Polish_settings\s*/, ""));
    if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("Invalid backup.");
    if (data.schema !== void 0 && data.schema !== 1)
      throw new Error("Unsupported backup version.");
    const source = data.members ?? data["member-tag"];
    if (!source || typeof source !== "object" || Array.isArray(source))
      throw new Error("No user tags found.");
    const entries = Object.entries(source);
    if (entries.length > 2e4) throw new Error("Too many users in backup.");
    const members = /* @__PURE__ */ Object.create(null);
    for (const [name, entry] of entries) {
      if (!validName.test(name)) throw new Error(`Invalid username: ${name}`);
      members[name.toLowerCase()] = normalizeTags(
        Array.isArray(entry) || typeof entry === "string" ? entry : entry?.tags
      );
    }
    return { members, options: data.schema === 1 ? normalizeOptions(data.options) : null };
  }
  function createStorage(api) {
    const cache = /* @__PURE__ */ new Map();
    const keyFor = (name) => `${PREFIX}member:${name.toLowerCase()}`;
    const write = (key, value) => {
      if (JSON.stringify(api.get(key)) === JSON.stringify(value)) return false;
      api.set(key, value);
      return true;
    };
    return {
      options: () => normalizeOptions(api.get(`${PREFIX}options`)),
      saveOptions: (value) => write(`${PREFIX}options`, normalizeOptions(value)),
      getTags(name) {
        const key = keyFor(name);
        if (!cache.has(key)) cache.set(key, normalizeTags(api.get(key, [])));
        return cache.get(key);
      },
      setTags(name, value) {
        if (!validName.test(name)) throw new Error("Invalid username.");
        const tags = normalizeTags(value);
        const key = keyFor(name);
        write(key, tags);
        cache.set(key, tags);
      },
      watchTags(name, callback) {
        api.listen(keyFor(name), (_key, _old, value, remote) => {
          if (!remote) return;
          cache.set(keyFor(name), normalizeTags(value ?? []));
          callback();
        });
      },
      export() {
        const members = /* @__PURE__ */ Object.create(null);
        for (const key of api.keys()) {
          if (key.startsWith(`${PREFIX}member:`))
            members[key.slice(`${PREFIX}member:`.length)] = api.get(key);
        }
        const { imgurClientId: _clientId, ...options2 } = this.options();
        return JSON.stringify(
          { schema: 1, exportedAt: (/* @__PURE__ */ new Date()).toISOString(), options: options2, members },
          null,
          2
        );
      },
      import(text) {
        const data = parseImport(text);
        let imported = 0;
        for (const [name, tags] of Object.entries(data.members)) {
          if (api.get(keyFor(name)) !== void 0) continue;
          this.setTags(name, tags);
          imported++;
        }
        return imported;
      },
      get: (key, fallback) => api.get(`${PREFIX}${key}`, fallback),
      set: (key, value) => write(`${PREFIX}${key}`, value)
    };
  }

  // src/dom.js
  function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== void 0) node.textContent = text;
    if (className) node.className = className;
    return node;
  }
  function button(text, onClick) {
    const node = element("button", text, "vx-button");
    node.type = "button";
    node.addEventListener("click", onClick);
    return node;
  }
  function owned(node) {
    node.dataset.vxOwned = "";
    return node;
  }
  function matching(root, selector) {
    return [...root.matches?.(selector) ? [root] : [], ...root.querySelectorAll(selector)];
  }
  function memberName(link) {
    if (!link?.getAttribute) return null;
    const path = link.getAttribute("href");
    return /^\/member\/([a-z0-9_-]{1,64})\/?$/i.exec(path ?? "")?.[1] ?? null;
  }
  function currentUser(doc = document) {
    const links = doc.querySelectorAll(
      '#Top .tools a[href^="/member/"], #Top a.top[href^="/member/"]'
    );
    const top = [...links].map(memberName).find(Boolean);
    if (top) return top;
    const accountBox = doc.querySelector(
      '#Rightbar .box:has(a[href="/balance"]), #Rightbar .box:has(a[href="/my/nodes"])'
    );
    return memberName(accountBox?.querySelector('a[href^="/member/"]'));
  }
  function safeURL(value, base, image = false) {
    if (typeof value !== "string" || !value.trim()) return null;
    try {
      const url = new URL(value, base);
      if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) return null;
      if (image && url.protocol !== "https:") return null;
      return url.href;
    } catch {
      return null;
    }
  }
  var allowedTags = new Set(
    "A ABBR B BLOCKQUOTE BR CODE DEL DETAILS DIV EM H1 H2 H3 H4 H5 H6 HR I IMG LI OL P PRE S SMALL SPAN STRONG SUB SUMMARY SUP TABLE TBODY TD TH THEAD TR U UL".split(
      " "
    )
  );
  function safeContent(source, base) {
    const fragment = document.createDocumentFragment();
    function append(parent, child) {
      if (child.nodeType === 3) {
        parent.append(document.createTextNode(child.textContent));
        return;
      }
      if (child.nodeType !== 1 || !allowedTags.has(child.tagName)) return;
      const copy = document.createElement(child.tagName.toLowerCase());
      if (child.tagName === "A") {
        const url = safeURL(child.getAttribute("href"), base);
        if (url) {
          copy.href = url;
          copy.target = "_blank";
          copy.rel = "noopener noreferrer";
        }
      }
      if (child.tagName === "IMG") {
        const url = safeURL(child.getAttribute("src"), base, true);
        if (!url) return;
        copy.src = url;
        copy.alt = child.getAttribute("alt") ?? "";
        copy.loading = "lazy";
        copy.referrerPolicy = "no-referrer";
      }
      for (const node of child.childNodes) append(copy, node);
      parent.append(copy);
    }
    for (const child of source.childNodes) append(fragment, child);
    return fragment;
  }
  function modal(title) {
    const dialog = owned(element("dialog", void 0, "vx-dialog"));
    const heading = element("h2", title);
    const close = button("Close", () => dialog.close());
    close.setAttribute("aria-label", `Close ${title}`);
    dialog.append(close, heading);
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener("close", () => dialog.remove(), { once: true });
    document.body.append(dialog);
    dialog.showModal();
    return dialog;
  }
  function syncOnce(doc, pageWindow = globalThis.unsafeWindow) {
    const input = doc.querySelector('input[name="once"]');
    const scriptToken = [...doc.scripts].map((script) => /\bvar\s+once\s*=\s*["'](\d+)["']/.exec(script.textContent)?.[1]).find(Boolean);
    const token = input?.value ?? scriptToken;
    if (!token || !/^\d+$/.test(token)) return;
    for (const field of document.querySelectorAll('form input[name="once"]')) field.value = token;
    if (pageWindow && "once" in pageWindow) pageWindow.once = token;
  }
  function createHTTP(fetcher = fetch) {
    let tail = Promise.resolve();
    return (path) => {
      const task = tail.then(async () => {
        const url = new URL(path, location.href);
        if (url.origin !== location.origin) throw new Error("Cross-origin page request blocked.");
        const response = await fetcher(url.href, {
          credentials: "same-origin",
          signal: AbortSignal.timeout(15e3)
        });
        if (!response.ok) throw new Error(`V2EX returned HTTP ${response.status}.`);
        const final = new URL(response.url || url.href);
        const rewardRedirect = url.pathname === "/mission/daily/redeem" && final.pathname === "/mission/daily";
        if (final.origin !== url.origin || final.pathname !== url.pathname && !rewardRedirect)
          throw new Error("V2EX redirected this request. Open the page directly first.");
        const doc = new DOMParser().parseFromString(await response.text(), "text/html");
        if (!doc.querySelector("#Main"))
          throw new Error("Unexpected page. Complete sign-in or verification on V2EX first.");
        syncOnce(doc);
        return doc;
      });
      tail = task.catch(() => {
      });
      return task;
    };
  }

  // src/members.js
  function createMembers(store2, options2) {
    const registered = /* @__PURE__ */ new WeakSet();
    const byName = /* @__PURE__ */ new Map();
    function draw(name, only) {
      const groups = byName.get(name.toLowerCase());
      for (const group of only ? [only] : groups ?? []) {
        if (!group.isConnected) {
          groups?.delete(group);
          continue;
        }
        group.replaceChildren();
        for (const tag of store2.getTags(name)) group.append(element("span", tag, "vx-tag"));
        const edit = button("tag", () => {
          const dialog = modal(`Tags: ${name}`);
          const label = element("label", "Separate tags with commas (up to 20). ");
          const input = element("input");
          input.value = store2.getTags(name).join(", ");
          label.append(input);
          const message = element("p");
          dialog.append(
            label,
            button("Save", () => {
              try {
                store2.setTags(name, input.value);
                draw(name);
                dialog.close();
              } catch (error) {
                message.textContent = error.message;
              }
            }),
            message
          );
          input.focus();
        });
        edit.setAttribute("aria-label", `Edit tags for ${name}`);
        group.append(edit);
      }
    }
    function enhance(root) {
      if (!options2.tags) return;
      for (const link of matching(root, 'a[href^="/member/"]')) {
        const name = memberName(link);
        if (!name || !link.textContent.trim() || registered.has(link) || link.closest("[data-vx-owned], #Top, #Rightbar, #Bottom"))
          continue;
        registered.add(link);
        const key = name.toLowerCase();
        const group = owned(element("span", void 0, "vx-tags"));
        link.after(group);
        if (!byName.has(key)) {
          byName.set(key, /* @__PURE__ */ new Set());
          store2.watchTags(name, () => draw(name));
        }
        byName.get(key).add(group);
        draw(name, group);
      }
    }
    if (options2.userCards) initCards();
    function initCards() {
      const cache = /* @__PURE__ */ new Map();
      const card = owned(element("aside", void 0, "vx-card"));
      card.hidden = true;
      card.setAttribute("aria-label", "Member information");
      document.body.append(card);
      let timer;
      let closeTimer;
      let active = null;
      let sequence = 0;
      function resolve(target) {
        const link = target.closest?.('a[href^="/member/"]');
        const name = memberName(link) ?? (/^[a-z0-9_-]{1,64}$/i.test(target.closest?.("img.avatar")?.alt ?? "") ? target.closest("img.avatar").alt : null);
        return name ? { name, anchor: link ?? target } : null;
      }
      function hide() {
        clearTimeout(timer);
        card.hidden = true;
        active = null;
        sequence++;
      }
      async function get(name) {
        const key = name.toLowerCase();
        if (cache.has(key) && cache.get(key).expires > Date.now()) return cache.get(key).promise;
        const promise = fetch(`/api/members/show.json?username=${encodeURIComponent(name)}`, {
          credentials: "same-origin",
          signal: AbortSignal.timeout(1e4)
        }).then(async (response) => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const member = await response.json();
          if (!member.username || member.status === "not-found")
            throw new Error("Member not found.");
          return member;
        }).catch((error) => {
          cache.delete(key);
          throw error;
        });
        if (cache.size >= 100) cache.delete(cache.keys().next().value);
        cache.set(key, { promise, expires: Date.now() + 6e5 });
        return promise;
      }
      document.addEventListener("pointerover", (event) => {
        clearTimeout(closeTimer);
        if (card.contains(event.target)) return;
        const match = resolve(event.target);
        if (!match || match.anchor === active) return;
        hide();
        active = match.anchor;
        const request = sequence;
        timer = setTimeout(async () => {
          const rect = match.anchor.getBoundingClientRect();
          card.style.left = `${Math.max(8, Math.min(rect.left, innerWidth - 320))}px`;
          card.style.top = `${Math.max(8, Math.min(rect.bottom + 6, innerHeight - 250))}px`;
          card.replaceChildren(element("strong", match.name), element("p", "Loading member..."));
          card.hidden = false;
          try {
            const member = await get(match.name);
            if (request !== sequence) return;
            card.replaceChildren(element("strong", member.username));
            for (const key of ["bio", "location", "website"]) {
              if (typeof member[key] === "string" && member[key])
                card.append(element("p", member[key].slice(0, 1e3)));
            }
            if (Number.isFinite(member.created))
              card.append(
                element("p", `Joined: ${new Date(member.created * 1e3).toLocaleDateString()}`)
              );
            const avatar = safeURL(member.avatar_large ?? member.avatar_normal, location.href, true);
            if (avatar) {
              const image = element("img");
              image.src = avatar;
              image.alt = member.username;
              image.width = 48;
              card.prepend(image);
            }
          } catch (error) {
            if (request === sequence) card.replaceChildren(element("p", `Member: ${error.message}`));
          }
        }, 350);
      });
      document.addEventListener("pointerout", (event) => {
        if (event.relatedTarget && (card.contains(event.relatedTarget) || active?.contains(event.relatedTarget)))
          return;
        closeTimer = setTimeout(hide, 150);
      });
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") hide();
      });
      window.addEventListener("scroll", hide, { passive: true });
    }
    return { enhance };
  }

  // src/preview.js
  function createTopics(options2, getDocument) {
    const seen = /* @__PURE__ */ new WeakSet();
    const cache = /* @__PURE__ */ new Map();
    function get(path) {
      const entry = cache.get(path);
      if (entry && entry.expires > Date.now()) return entry.promise;
      const promise = getDocument(path).then((doc) => {
        const content = doc.querySelector(".topic_content");
        const title = doc.querySelector("#Main h1");
        if (!title) throw new Error("Topic unavailable or sign-in required.");
        return {
          title: title.textContent,
          content: content ? safeContent(content, new URL(path, location.href).href) : null,
          supplements: [...doc.querySelectorAll(".subtle .topic_content")].filter((node) => node !== content).map((node) => safeContent(node, new URL(path, location.href).href))
        };
      }).catch((error) => {
        cache.delete(path);
        throw error;
      });
      if (cache.size >= 20) cache.delete(cache.keys().next().value);
      cache.set(path, { promise, expires: Date.now() + 6e5 });
      return promise;
    }
    return {
      enhance(root) {
        for (const link of matching(root, ".item_title a[href], a.topic-link[href]")) {
          if (seen.has(link)) continue;
          seen.add(link);
          const url = new URL(link.href, location.href);
          if (url.origin !== location.origin || !/^\/t\/\d+\/?$/.test(url.pathname)) continue;
          if (options2.newTab) {
            link.target = "_blank";
            link.rel = "noopener noreferrer";
          }
          if (options2.preview) {
            const trigger = owned(
              button("Preview", async () => {
                const dialog = modal("Topic preview");
                const body = element("div", "Loading...", "vx-preview");
                const original = element("a", "Open topic");
                original.href = link.href;
                original.target = "_blank";
                original.rel = "noopener noreferrer";
                dialog.append(original, body);
                try {
                  const topic = await get(url.pathname);
                  if (!dialog.isConnected) return;
                  dialog.querySelector("h2").textContent = topic.title;
                  body.replaceChildren();
                  if (topic.content) body.append(topic.content.cloneNode(true));
                  else body.append(element("p", "No topic body."));
                  for (const content of topic.supplements)
                    body.append(element("hr"), content.cloneNode(true));
                } catch (error) {
                  body.textContent = error.message;
                }
              })
            );
            link.after(trigger);
          }
        }
      }
    };
  }

  // src/replies.js
  var REPLY = '.cell[id^="r_"]';
  function thanksCount(node) {
    const header = node.querySelector(".flex-one-row") ?? node;
    const heart = [
      ...header.querySelectorAll('img[alt="\u2764\uFE0F"], img[src*="heart"], .v2p-icon-heart')
    ].find((image) => image.closest(REPLY) === node && !image.closest(".reply_content"));
    const text = heart?.parentElement.textContent ?? node.querySelector(".thank_area .thank_count, .thank_count")?.textContent ?? "";
    return Number.parseInt(text.replace(/,/g, "").match(/\d+/)?.[0] ?? "0", 10);
  }
  function parseReply(node) {
    if (!/^r_\d+$/.test(node.id)) return null;
    const author = node.querySelector('strong a[href^="/member/"]');
    return {
      id: node.id,
      node,
      name: memberName(author) ?? "unknown",
      floor: Number.parseInt(node.querySelector(".no")?.textContent ?? "0", 10) || Number(node.id.slice(2)),
      thanks: thanksCount(node)
    };
  }
  function rankReplies(replies, limit = 10) {
    return [...replies].filter((reply) => reply.thanks > 0).sort((left, right) => right.thanks - left.thanks || left.floor - right.floor).slice(0, limit);
  }
  function pageCount(doc, topicPath) {
    const pages = [Number(new URL(location.href).searchParams.get("p")) || 1];
    for (const link of doc.querySelectorAll('a[href*="p="]')) {
      const url = new URL(link.getAttribute("href"), location.href);
      if (url.origin !== location.origin || url.pathname !== topicPath) continue;
      const page = Number(url.searchParams.get("p"));
      if (Number.isInteger(page) && page > 0 && page <= 1e5) pages.push(page);
    }
    const input = doc.querySelector("input.page_input[max]");
    if (input && Number(input.max) > 0 && Number(input.max) <= 1e5) pages.push(Number(input.max));
    return Math.max(...pages);
  }
  function initReplies({ options: options2, getDocument, enhance }) {
    if (!/^\/t\/\d+\/?$/.test(location.pathname)) return null;
    const first = document.querySelector(REPLY);
    if (!first) return null;
    const container = first.parentElement;
    const replies = /* @__PURE__ */ new Map();
    const current = Number(new URL(location.href).searchParams.get("p")) || 1;
    const loaded = /* @__PURE__ */ new Set([current]);
    let total = pageCount(document, location.pathname);
    let next = current + 1;
    let busy = false;
    let limit = 10;
    let signature = "";
    const panel = owned(element("section", void 0, "box vx-hot"));
    panel.id = "vx-hot";
    const summary = element("p");
    const list = element("div");
    const more = button("Show more", () => {
      limit += 10;
      render();
    });
    panel.append(element("h3", "Popular replies"), summary, list, more);
    if (options2.hotReplies)
      (document.querySelector("#Rightbar") ?? container.parentElement).append(panel);
    const toolbar = owned(element("div", void 0, "vx-toolbar"));
    const status = element("span");
    const loadButton = button("Load next page", () => void loadNext());
    toolbar.append(status, loadButton);
    first.before(toolbar);
    function render() {
      status.textContent = `Loaded ${loaded.size}/${total} pages (${[...loaded].sort((a, b) => a - b).join(", ")}); ${replies.size} replies. `;
      loadButton.disabled = busy || next > total;
      loadButton.hidden = next > total;
      if (!options2.hotReplies) return;
      summary.textContent = "Ranked by thanks on loaded pages only.";
      const ranked = rankReplies(replies.values(), limit);
      const nextSignature = ranked.map((reply) => `${reply.id}:${reply.thanks}`).join("|") + `:${limit}`;
      if (nextSignature === signature) return;
      signature = nextSignature;
      const fragment = document.createDocumentFragment();
      for (const reply of ranked) {
        const item = element("article", void 0, "vx-hot-item");
        const jump = element("a", `#${reply.floor} ${reply.name} - ${reply.thanks} thanks`);
        jump.href = `#${reply.id}`;
        const content = element("details");
        content.append(
          element(
            "summary",
            (reply.node.querySelector(".reply_content")?.textContent ?? "").slice(0, 140) || "Read reply"
          )
        );
        content.addEventListener("toggle", () => {
          if (content.open && !content.dataset.loaded) {
            content.dataset.loaded = "true";
            const body = reply.node.querySelector(".reply_content");
            if (body) content.append(safeContent(body, location.href));
          }
        });
        item.append(jump, content);
        fragment.append(item);
      }
      if (!ranked.length) fragment.append(element("p", "No thanked replies on loaded pages."));
      list.replaceChildren(fragment);
      more.hidden = rankReplies(replies.values(), limit + 1).length <= limit;
    }
    function add(root) {
      let changed = false;
      for (const node of matching(root, REPLY)) {
        if (replies.has(node.id)) continue;
        const reply = parseReply(node);
        if (!reply) continue;
        replies.set(reply.id, reply);
        changed = true;
      }
      if (changed) render();
    }
    async function loadNext() {
      if (busy || next > total) return false;
      busy = true;
      render();
      const page = next;
      try {
        const url = new URL(location.href);
        url.search = "";
        url.searchParams.set("p", String(page));
        const doc = await getDocument(url.href);
        const rows = [...doc.querySelectorAll(REPLY)];
        if (!rows.length) throw new Error("No replies found. Open this page directly to verify it.");
        total = Math.max(total, pageCount(doc, location.pathname));
        const fragment = document.createDocumentFragment();
        const divider = owned(element("p", `Page ${page}`, "vx-page"));
        const source = element("a", " Open original page");
        source.href = url.href;
        divider.append(source);
        fragment.append(divider);
        const added = [];
        for (const row of rows) {
          if (replies.has(row.id)) continue;
          const clean = element("div", void 0, "cell vx-loaded-reply");
          clean.id = row.id;
          const reply = parseReply(row);
          if (!reply) continue;
          const meta = element("div");
          const author = element("strong");
          const member = element("a", reply.name);
          member.href = `/member/${reply.name}`;
          author.append(member);
          meta.append(
            author,
            " ",
            element("span", String(reply.floor), "no"),
            ` - ${reply.thanks} thanks`
          );
          const body = element("div", void 0, "reply_content");
          const original = row.querySelector(".reply_content");
          if (original) body.append(safeContent(original, url.href));
          clean.append(meta, body);
          fragment.append(clean);
          replies.set(clean.id, { ...reply, node: clean });
          added.push(clean);
        }
        const last = [...replies.values()].map((reply) => reply.node).filter((node) => node.parentElement === container).at(-1);
        if (last) last.after(fragment);
        else container.append(fragment);
        for (const row of added) enhance(row);
        loaded.add(page);
        next++;
        return true;
      } catch (error) {
        status.textContent = `Page ${page} failed: ${error.message} `;
        return false;
      } finally {
        busy = false;
        loadButton.disabled = next > total;
        if (loaded.has(page)) render();
      }
    }
    add(document);
    render();
    return {
      add,
      update(node) {
        const reply = replies.get(node.id);
        if (reply && !node.classList.contains("vx-loaded-reply")) {
          const count = thanksCount(node);
          if (count !== reply.thanks) {
            reply.thanks = count;
            render();
          }
        }
      },
      async preload() {
        for (let index = 0; index < options2.preloadPages; index++) {
          if (!await loadNext()) break;
        }
      },
      replies
    };
  }

  // src/check-in.js
  function dayKey(now = Date.now()) {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Shanghai",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(now);
  }
  function canAttempt(state, day, now) {
    return !state || state.day !== day || !state.success && state.attempts < 3 && now >= state.nextAt;
  }
  function redeemed(doc) {
    return /\u6bcf\u5929\u7684\u767b\u5f55\u5956\u52b1\u5df2\u7ecf\u9886\u53d6|\u6bcf\u65e5\u767b\u5f55\u5956\u52b1\u5df2\u9886\u53d6|\u4eca\u65e5\u767b\u5f55\u5956\u52b1\u5df2\u9886\u53d6|\u4f60\u5df2\u7ecf\u9886\u53d6\u4e86\u4eca\u5929\u7684\u767b\u5f55\u5956\u52b1|\u5df2\u6210\u529f\u9886\u53d6|Daily (?:login )?reward (?:received|already redeemed)/i.test(
      doc.querySelector("#Main")?.textContent ?? ""
    );
  }
  function createCheckIn({
    store: store2,
    getDocument,
    locks = navigator.locks,
    now = Date.now,
    onStatus = () => {
    }
  }) {
    let running = false;
    return async function run(name) {
      if (!name || running) return;
      if (!locks) {
        onStatus("Automatic check-in requires Web Locks. Use /mission/daily manually.");
        return;
      }
      running = true;
      try {
        await locks.request("v2ex-lite:check-in", { ifAvailable: true }, async (lock) => {
          if (!lock) return;
          const time = now();
          const day = dayKey(time);
          const key = `daily:${name.toLowerCase()}`;
          let state = store2.get(key);
          if (!canAttempt(state, day, time)) return;
          const lease = store2.get("daily-lease");
          if (lease?.until > time) return;
          const owner = crypto.randomUUID();
          store2.set("daily-lease", { owner, until: time + 45e3 });
          if (store2.get("daily-lease")?.owner !== owner) return;
          state = {
            day,
            attempts: state?.day === day ? state.attempts + 1 : 1,
            success: false,
            nextAt: time + 6e4
          };
          store2.set(key, state);
          try {
            const doc = await getDocument("/mission/daily");
            if (currentUser(doc)?.toLowerCase() !== name.toLowerCase())
              throw new Error("Account changed or signed out.");
            if (!redeemed(doc)) {
              const link = doc.querySelector('a[href^="/mission/daily/redeem?once="]');
              const inline = [...doc.querySelectorAll("input[onclick], button[onclick]")].map(
                (node) => /["'](\/mission\/daily\/redeem\?once=\d+)["']/.exec(
                  node.getAttribute("onclick")
                )?.[1]
              ).find(Boolean);
              const path = link?.getAttribute("href") ?? inline;
              if (!path || !/^\/mission\/daily\/redeem\?once=\d+$/.test(path))
                throw new Error("Reward link not found.");
              const result = await getDocument(path);
              if (!redeemed(result)) throw new Error("Reward was not confirmed; no immediate retry.");
            }
            store2.set(key, { ...state, success: true, nextAt: 0 });
            onStatus("Daily reward received.");
          } catch (error) {
            store2.set(key, { ...state, nextAt: time + (state.attempts === 1 ? 6e4 : 3e5) });
            onStatus(`Check-in: ${error.message}`);
          } finally {
            if (store2.get("daily-lease")?.owner === owner)
              store2.set("daily-lease", { owner, until: 0 });
          }
        });
      } finally {
        running = false;
      }
    };
  }

  // src/upload.js
  function replacePlaceholder(textarea, marker, replacement) {
    const offset = textarea.value.indexOf(marker);
    if (offset < 0) return false;
    const start2 = textarea.selectionStart;
    const end = textarea.selectionEnd;
    textarea.setRangeText(replacement, offset, offset + marker.length, "preserve");
    const adjust = (position) => position <= offset ? position : position >= offset + marker.length ? position + replacement.length - marker.length : offset + replacement.length;
    textarea.setSelectionRange(adjust(start2), adjust(end));
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    return true;
  }
  function uploadImage(file, clientId, request = GM_xmlhttpRequest) {
    if (!/^[a-z0-9]{1,64}$/i.test(clientId))
      return Promise.reject(new Error("Configure your Imgur Client ID in settings first."));
    if (!/^image\/(png|jpeg|gif|webp)$/.test(file.type) || file.size > 10 * 1024 * 1024 || file.size === 0) {
      return Promise.reject(new Error("Use a PNG, JPEG, GIF or WebP image up to 10 MB."));
    }
    return new Promise((resolve, reject) => {
      const data = new FormData();
      data.append("image", file);
      request({
        method: "POST",
        url: "https://api.imgur.com/3/image",
        headers: { Authorization: `Client-ID ${clientId}` },
        data,
        anonymous: true,
        timeout: 3e4,
        onload(response) {
          try {
            const body = JSON.parse(response.responseText);
            const link = safeURL(body.data?.link, "https://i.imgur.com", true);
            if (response.status < 200 || response.status >= 300 || body.success !== true || !link || new URL(link).hostname !== "i.imgur.com") {
              throw new Error(`Imgur upload failed (HTTP ${response.status}).`);
            }
            resolve({
              link,
              deleteHash: /^[a-z0-9]+$/i.test(body.data?.deletehash ?? "") ? body.data.deletehash : null
            });
          } catch (error) {
            reject(error);
          }
        },
        onerror: () => reject(new Error("Imgur network error.")),
        ontimeout: () => reject(
          new Error(
            "Imgur upload timed out. Check Imgur before retrying; it may have received the image."
          )
        ),
        onabort: () => reject(new Error("Imgur upload aborted."))
      });
    });
  }
  function initUpload(options2) {
    const textarea = document.querySelector(
      'textarea#reply_content, #reply-box textarea, textarea[name="content"]'
    );
    if (!textarea || !options2.upload) return;
    const toolbar = owned(element("div", void 0, "vx-upload"));
    const input = element("input");
    input.type = "file";
    input.accept = "image/png,image/jpeg,image/gif,image/webp";
    input.multiple = true;
    input.hidden = true;
    const messages = element("div");
    messages.setAttribute("aria-live", "polite");
    const pick = button("Upload images to Imgur", () => input.click());
    toolbar.append(
      pick,
      element(
        "small",
        " Public image hosting. Paste or drop images here; replies are never submitted automatically."
      ),
      input,
      messages
    );
    textarea.before(toolbar);
    let queue = Promise.resolve();
    let pending = 0;
    function enqueue(files) {
      const images = [...files].filter((file) => file.type.startsWith("image/"));
      if (!images.length) return false;
      if (!options2.imgurClientId) {
        messages.textContent = "Set your own Imgur Client ID in V2EX Lite settings first.";
        return false;
      }
      if (images.length + pending > 10) {
        messages.textContent = "Queue limit: 10 images. Wait for current uploads to finish.";
        return false;
      }
      for (const file of images) {
        pending++;
        const marker = `[vx-upload:${crypto.randomUUID()}]`;
        textarea.setRangeText(`
${marker}
`, textarea.selectionEnd, textarea.selectionEnd, "end");
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
        const row = element("p", `${file.name || "Pasted image"}: queued`);
        messages.append(row);
        while (messages.children.length > 20) messages.firstElementChild.remove();
        queue = queue.then(async () => {
          row.textContent = `${file.name || "Pasted image"}: uploading...`;
          try {
            const result = await uploadImage(file, options2.imgurClientId);
            const replaced = replacePlaceholder(textarea, marker, result.link);
            row.textContent = replaced ? "Uploaded: " : "Draft marker removed; copy this URL: ";
            const link = element("a", result.link);
            link.href = result.link;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            row.append(link);
            if (result.deleteHash) {
              const deletion = element("a", " Save deletion link");
              deletion.href = `https://imgur.com/delete/${result.deleteHash}`;
              deletion.target = "_blank";
              deletion.rel = "noopener noreferrer";
              row.append(deletion);
            }
          } catch (error) {
            replacePlaceholder(textarea, marker, "");
            row.textContent = `${file.name || "Pasted image"}: ${error.message} Select the file again to retry.`;
          } finally {
            pending--;
          }
        });
      }
      return true;
    }
    input.addEventListener("change", () => {
      enqueue(input.files);
      input.value = "";
    });
    textarea.addEventListener("paste", (event) => {
      const images = [...event.clipboardData?.items ?? []].filter((item) => item.kind === "file").map((item) => item.getAsFile()).filter(Boolean);
      if (enqueue(images)) event.preventDefault();
    });
    textarea.addEventListener("dragover", (event) => {
      if ([...event.dataTransfer?.items ?? []].some((item) => item.type.startsWith("image/")))
        event.preventDefault();
    });
    textarea.addEventListener("drop", (event) => {
      if (enqueue(event.dataTransfer?.files ?? [])) event.preventDefault();
    });
    textarea.form?.addEventListener(
      "submit",
      (event) => {
        if (pending || /\[vx-upload:[^\]]+\]/.test(textarea.value)) {
          event.preventDefault();
          event.stopImmediatePropagation();
          messages.append(
            element("p", "Wait for uploads or remove unfinished upload markers before submitting.")
          );
        }
      },
      true
    );
  }

  // src/settings.js
  function openSettings(store2) {
    if (document.querySelector("#vx-settings-dialog")) return;
    const options2 = store2.options();
    const dialog = modal("V2EX Lite settings");
    dialog.id = "vx-settings-dialog";
    const form = element("form");
    const fields = /* @__PURE__ */ new Map();
    function field(key, label, control) {
      const wrapper = element("label", `${label} `, "vx-setting");
      wrapper.append(control);
      form.append(wrapper);
      fields.set(key, control);
    }
    form.append(element("p", "Appearance: V2EX Polish Minimalist / Vivo Sans."));
    const names = {
      privacy: "Privacy mode (hide account, logo and tab identity)",
      newTab: "Open topics in a new tab",
      preview: "Topic body previews",
      userCards: "Hover member cards",
      tags: "User tags",
      hotReplies: "Popular replies sidebar",
      autoCheckIn: "Daily check-in on page open / returning to a visible tab",
      upload: "Image upload, paste and drop"
    };
    for (const [key, label] of Object.entries(names)) {
      const input = element("input");
      input.type = "checkbox";
      input.checked = options2[key];
      field(key, label, input);
    }
    const pages = element("input");
    pages.type = "number";
    pages.min = "0";
    pages.max = "5";
    pages.step = "1";
    pages.value = String(options2.preloadPages);
    field("preloadPages", "Additional reply pages (0-5)", pages);
    const client = element("input");
    client.type = "text";
    client.autocomplete = "off";
    client.pattern = "[A-Za-z0-9]{0,64}";
    client.value = options2.imgurClientId;
    field("imgurClientId", "Your Imgur Client ID (no Client Secret)", client);
    const message = element("p");
    message.setAttribute("aria-live", "polite");
    const save = element("button", "Save and reload", "vx-button");
    save.type = "submit";
    form.append(save);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const next = { ...options2 };
      for (const [key, control] of fields)
        next[key] = control.type === "checkbox" ? control.checked : control.value;
      next.preloadPages = Number(next.preloadPages);
      store2.saveOptions(next);
      location.reload();
    });
    const file = element("input");
    file.type = "file";
    file.accept = ".json,application/json,text/plain";
    file.hidden = true;
    file.addEventListener("change", async () => {
      try {
        if (!file.files[0]) return;
        if (file.files[0].size > 2e6) throw new Error("Backup exceeds 2 MB.");
        const count = store2.import(await file.files[0].text());
        message.textContent = `Imported ${count} users; existing local entries kept. Reload to display changes.`;
      } catch (error) {
        message.textContent = error.message;
      } finally {
        file.value = "";
      }
    });
    dialog.append(
      form,
      element("h3", "Local backup / Polish migration"),
      element(
        "p",
        "Backups contain plain-text tags and settings. Keep them private. Imports merge tags; local entries win. Settings and Client ID are kept."
      ),
      button("Export JSON", () => {
        const url = URL.createObjectURL(new Blob([store2.export()], { type: "application/json" }));
        const anchor = element("a");
        anchor.href = url;
        anchor.download = "v2ex-lite-backup.json";
        anchor.click();
        setTimeout(() => URL.revokeObjectURL(url), 1e3);
      }),
      button("Import tags JSON", () => file.click()),
      file,
      message
    );
  }
  function installSettings(store2) {
    const entry = owned(button("V2EX Lite", () => openSettings(store2)));
    entry.id = "vx-settings";
    document.body.append(entry);
    GM_registerMenuCommand("V2EX Lite settings", () => openSettings(store2));
  }

  // src/main.js
  var store = createStorage({
    get: GM_getValue,
    set: GM_setValue,
    keys: GM_listValues,
    listen: GM_addValueChangeListener
  });
  var options = store.options();
  GM_addStyle(`${polish_minimalist_default}
${styles_default}`);
  function applyTheme() {
    if (!document.documentElement) return;
    document.documentElement.dataset.vxTheme = "minimalist";
    document.documentElement.dataset.v2pTheme = "minimalist";
    document.body?.classList.add("v2p-theme-minimalist");
    document.documentElement.toggleAttribute("data-vx-privacy", options.privacy);
  }
  applyTheme();
  function start() {
    applyTheme();
    const name = currentUser();
    if (options.privacy) {
      document.title = "Workspace";
      for (const icon2 of document.querySelectorAll('link[rel~="icon"]')) icon2.remove();
      const icon = document.createElement("link");
      icon.rel = "icon";
      icon.href = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect x="3" y="3" width="26" height="26" rx="5" fill="#657581"/><path d="M9 11h14v2H9zm0 6h14v2H9z" fill="white"/></svg>')}`;
      document.head.append(icon);
      if (name) {
        const account = [...document.querySelectorAll('#Rightbar a[href^="/member/"]')].find(
          (link) => link.getAttribute("href").toLowerCase() === `/member/${name.toLowerCase()}`
        );
        const box = account?.closest(".box");
        if (box) box.id = "vx-account-box";
      }
    }
    const getDocument = createHTTP();
    const members = createMembers(store, options);
    const topics = createTopics(options, getDocument);
    const enhance = (root) => {
      members.enhance(root);
      topics.enhance(root);
    };
    enhance(document);
    const replies = initReplies({ options, getDocument, enhance });
    installSettings(store);
    initUpload(options);
    const main = document.querySelector("#Main");
    if (main) {
      const roots = /* @__PURE__ */ new Set();
      const changed = /* @__PURE__ */ new Set();
      let scheduled = false;
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          const target = mutation.target.nodeType === 1 ? mutation.target : mutation.target.parentElement;
          if (target?.closest("[data-vx-owned]")) continue;
          const reply = target?.closest(REPLY);
          if (reply) changed.add(reply);
          for (const node of mutation.addedNodes) {
            if (node.nodeType === 1 && !node.matches("[data-vx-owned]")) roots.add(node);
          }
        }
        if (scheduled || !roots.size && !changed.size) return;
        scheduled = true;
        requestAnimationFrame(() => {
          scheduled = false;
          for (const root of roots) {
            if (root.isConnected) {
              enhance(root);
              replies?.add(root);
            }
          }
          for (const node of changed) replies?.update(node);
          roots.clear();
          changed.clear();
        });
      });
      observer.observe(main, { childList: true, subtree: true, characterData: true });
    }
    const report = (message) => {
      document.querySelector("#vx-settings").title = message;
      console.info(`[V2EX Lite] ${message}`);
    };
    const checkIn = createCheckIn({ store, getDocument, onStatus: report });
    const runDaily = () => {
      if (options.autoCheckIn && document.visibilityState === "visible")
        void checkIn(name).catch((error) => report(error.message));
    };
    document.addEventListener("visibilitychange", runDaily);
    runDaily();
    void replies?.preload();
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
