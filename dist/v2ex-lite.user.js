// ==UserScript==
// @name         V2EX Lite
// @namespace    https://github.com/ryan961/v2ex-scripts
// @version      0.1.2
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

MIT License

Copyright (c) 2023-2026 Pipecraft

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

MIT License

Copyright (c) 2021-present Floating UI contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
(() => {
  // src/theme.js
  function applyTheme(doc = document, preview = false) {
    const root = doc.documentElement;
    if (!root) return;
    root.dataset.v2pTheme = "minimalist";
    root.dataset.vxTheme = "minimalist";
    if (/^\/t\/\d+/.test(doc.location?.pathname ?? location.pathname)) root.dataset.v2pPage = "topic";
    if (preview) root.dataset.v2pPreview = "1";
    doc.body?.classList.add("v2p-theme-minimalist");
    if (doc.querySelector("#site-header")) {
      root.dataset.v2pMobile = "true";
      doc.body?.classList.add("v2p-mobile");
    }
  }

  // src/theme.scss
  var theme_default = '@charset "UTF-8";\n/* V2EX Polish c8f1b70; Copyright (c) 2023-present LeoKu and contributors.\n * MIT; see licenses/v2ex-polish-MIT.txt. Font overrides removed as requested.\n */\n:root {\n  --zidx-search: 100;\n  --zidx-tabs: 10;\n  --zidx-tools-card: 10;\n  --zidx-reply-box: 99;\n  --zidx-modal-header: 50;\n  --zidx-modal-mask: 888;\n  --zidx-toast: 999;\n  --zidx-tip: 999;\n  --zidx-popup: 99;\n  --zidx-expand-mask: 10;\n  --zidx-expand-btn: 20;\n  --zidx-rightbar: 99;\n  --v2p-spacing-box: 12px;\n  --v2p-spacing-cell: 10px;\n  --v2p-underline-offset: 0.5ex;\n  --v2p-layout-column-gap: 25px;\n  --v2p-layout-row-gap: 20px;\n  --v2p-nav-height: 55px;\n  --v2p-tp-item-x: 20px;\n  --v2p-tp-item-y: 10px;\n  --v2p-tp-tabs-pd: 10px;\n  --v2p-tp-nested-pd: 15px;\n  --v2p-tp-preview-pd: 20px;\n  --v2p-emoji-size: 21px;\n  --v2p-box-radius: 10px;\n  --v2p-input-radius: 6px;\n  --v2p-button-radius: 6px;\n  --v2p-popup-radius: 6px;\n  --v2p-content-width: 1120px;\n  --v2p-rightbar-width: 270px;\n  --v2p-color-main-50: #f7f9fb;\n  --v2p-color-main-100: #f1f5f9;\n  --v2p-color-main-150: #eaeff5;\n  --v2p-color-main-200: #e2e8f0;\n  --v2p-color-main-300: #cbd5e1;\n  --v2p-color-main-350: #94a3b8cc;\n  --v2p-color-main-400: #94a3b8;\n  --v2p-color-main-500: #64748b;\n  --v2p-color-main-600: #475569;\n  --v2p-color-main-700: #334155;\n  --v2p-color-main-800: #1e293b;\n  --v2p-color-accent-50: oklch(97.9% 0.021 166.113deg);\n  --v2p-color-accent-100: oklch(95% 0.052 163.051deg);\n  --v2p-color-accent-200: oklch(90.5% 0.093 164.15deg);\n  --v2p-color-accent-300: oklch(84.5% 0.143 164.978deg);\n  --v2p-color-accent-400: oklch(76.5% 0.177 163.223deg);\n  --v2p-color-accent-500: oklch(69.6% 0.17 162.48deg);\n  --v2p-color-accent-600: oklch(59.6% 0.145 163.225deg);\n  --v2p-color-accent-700: oklch(50.8% 0.118 165.612deg);\n  --v2p-color-orange-50: #fff7ed;\n  --v2p-color-orange-100: #ffedd5;\n  --v2p-color-orange-400: #fb923c;\n  --v2p-color-background: #f2f3f5;\n  --v2p-color-foreground: var(--v2p-color-main-800);\n  --v2p-color-selection-foreground: var(--v2p-color-main-100);\n  --v2p-color-selection-background: var(--v2p-color-main-700);\n  --v2p-color-selection-background-img: var(--v2p-color-main-500);\n  --v2p-color-font-secondary: var(--v2p-color-main-600);\n  --v2p-color-font-tertiary: var(--v2p-color-main-500);\n  --v2p-color-font-quaternary: var(--v2p-color-main-400);\n  --v2p-color-button-background: var(--v2p-color-main-100);\n  --v2p-color-button-foreground: var(--v2p-color-main-500);\n  --v2p-color-button-background-hover: var(--v2p-color-main-200);\n  --v2p-color-button-foreground-hover: var(--v2p-color-main-600);\n  --v2p-color-button-border: var(--v2p-color-main-300);\n  --v2p-color-button-special-background: var(--v2p-color-accent-50);\n  --v2p-color-button-special-foreground: var(--v2p-color-accent-700);\n  --v2p-color-button-special-border: var(--v2p-color-accent-600);\n  --v2p-color-button-special-foreground-hover: var(--v2p-color-accent-700);\n  --v2p-color-bg-content: #fff;\n  --v2p-color-bg-footer: var(--v2p-color-bg-content);\n  --v2p-color-bg-hover-btn: rgb(226 232 240 / 70%);\n  --v2p-color-bg-subtle: rgb(236 253 245 / 90%);\n  --v2p-color-bg-input: var(--v2p-color-main-50);\n  --v2p-color-bg-search: var(--v2p-color-main-100);\n  --v2p-color-bg-search-active: var(--v2p-color-main-150);\n  --v2p-color-bg-widget: rgb(255 255 255 / 70%);\n  --v2p-color-bg-reply: var(--v2p-color-main-100);\n  --v2p-color-bg-tooltip: var(--v2p-color-bg-content);\n  --v2p-color-bg-tabs: var(--v2p-color-main-100);\n  --v2p-color-bg-tpr: var(--v2p-color-main-100);\n  --v2p-color-bg-avatar: var(--v2p-color-main-300);\n  --v2p-color-bg-block: var(--v2p-color-main-100);\n  --v2p-color-bg-block-darker: var(--v2p-color-main-300);\n  --v2p-color-bg-link: var(--v2p-color-main-100);\n  --v2p-color-bg-link-hover: var(--v2p-color-main-200);\n  --v2p-color-bg-error: #fee2e2;\n  --v2p-color-tabs: var(--v2p-color-foreground);\n  --v2p-color-heart: #ef4444;\n  --v2p-color-heart-fill: #fee2e2;\n  --v2p-color-mask: rgb(0 0 0 / 25%);\n  --v2p-color-divider: var(--v2p-color-main-200);\n  --v2p-color-border: var(--v2p-color-main-200);\n  --v2p-color-input-border: var(--v2p-color-main-300);\n  --v2p-color-input-border-focus: var(--v2p-color-main-400);\n  --v2p-color-border-darker: var(--v2p-color-main-300);\n  --v2p-color-link-visited: var(--v2p-color-main-400);\n  --v2p-color-error: #ef4444;\n  --v2p-color-cell-num: var(--v2p-color-main-350);\n  --v2p-color-badge: var(--v2p-color-bg-content);\n  --v2p-box-shadow: 0 3px 5px 0 rgb(0 0 0 / 4%);\n  --v2p-widget-shadow: 0 9px 24px -3px rgb(0 0 0 / 6%), 0 4px 8px -1px rgb(0 0 0 /12%);\n  --v2p-toast-shadow:\n    0 6px 16px 0 rgb(0 0 0 / 8%), 0 3px 6px -4px rgb(0 0 0 / 12%), 0 9px 28px 8px rgb(0 0 0 / 5%);\n  --color-fade: var(--v2p-color-font-secondary);\n  --color-gray: var(--v2p-color-font-secondary);\n  --link-color: var(--v2p-color-foreground);\n  --link-darker-color: var(--v2p-color-main-600);\n  --link-hover-color: var(--v2p-color-foreground);\n  --link-caution-color: var(--v2p-color-orange-400);\n  --link-visited-color: currentColor;\n  --box-border-color: var(--v2p-color-border);\n  --box-foreground-color: var(--v2p-color-foreground);\n  --box-background-color: var(--v2p-color-bg-content);\n  --box-background-alt-color: var(--v2p-color-main-100);\n  --box-background-hover-color: var(--v2p-color-main-200);\n  --box-border-focus-color: var(--v2p-color-main-200);\n  --box-border-radius: var(--v2p-box-radius);\n  --button-background-color: var(--v2p-color-button-background);\n  --button-foreground-color: var(--v2p-color-button-foreground);\n  --button-hover-color: var(--v2p-color-button-background-hover);\n  --button-background-hover-color: var(--v2p-color-button-background-hover);\n  --button-foreground-hover-color: var(--v2p-color-button-foreground-hover);\n  --button-border-color: var(--v2p-color-main-300);\n  --button-border-hover-color: var(--v2p-color-main-400);\n}\n:root body {\n  --v2p-color-main-50: #f7f9fb;\n  --v2p-color-main-100: #f1f5f9;\n  --v2p-color-main-150: #eaeff5;\n  --v2p-color-main-200: #e2e8f0;\n  --v2p-color-main-300: #cbd5e1;\n  --v2p-color-main-350: #94a3b8cc;\n  --v2p-color-main-400: #94a3b8;\n  --v2p-color-main-500: #64748b;\n  --v2p-color-main-600: #475569;\n  --v2p-color-main-700: #334155;\n  --v2p-color-main-800: #1e293b;\n  --v2p-color-accent-50: oklch(97.9% 0.021 166.113deg);\n  --v2p-color-accent-100: oklch(95% 0.052 163.051deg);\n  --v2p-color-accent-200: oklch(90.5% 0.093 164.15deg);\n  --v2p-color-accent-300: oklch(84.5% 0.143 164.978deg);\n  --v2p-color-accent-400: oklch(76.5% 0.177 163.223deg);\n  --v2p-color-accent-500: oklch(69.6% 0.17 162.48deg);\n  --v2p-color-accent-600: oklch(59.6% 0.145 163.225deg);\n  --v2p-color-accent-700: oklch(50.8% 0.118 165.612deg);\n  --v2p-color-orange-50: #fff7ed;\n  --v2p-color-orange-100: #ffedd5;\n  --v2p-color-orange-400: #fb923c;\n  --v2p-color-background: #f2f3f5;\n  --v2p-color-foreground: var(--v2p-color-main-800);\n  --v2p-color-selection-foreground: var(--v2p-color-main-100);\n  --v2p-color-selection-background: var(--v2p-color-main-700);\n  --v2p-color-selection-background-img: var(--v2p-color-main-500);\n  --v2p-color-font-secondary: var(--v2p-color-main-600);\n  --v2p-color-font-tertiary: var(--v2p-color-main-500);\n  --v2p-color-font-quaternary: var(--v2p-color-main-400);\n  --v2p-color-button-background: var(--v2p-color-main-100);\n  --v2p-color-button-foreground: var(--v2p-color-main-500);\n  --v2p-color-button-background-hover: var(--v2p-color-main-200);\n  --v2p-color-button-foreground-hover: var(--v2p-color-main-600);\n  --v2p-color-button-border: var(--v2p-color-main-300);\n  --v2p-color-button-special-background: var(--v2p-color-accent-50);\n  --v2p-color-button-special-foreground: var(--v2p-color-accent-700);\n  --v2p-color-button-special-border: var(--v2p-color-accent-600);\n  --v2p-color-button-special-foreground-hover: var(--v2p-color-accent-700);\n  --v2p-color-bg-content: #fff;\n  --v2p-color-bg-footer: var(--v2p-color-bg-content);\n  --v2p-color-bg-hover-btn: rgb(226 232 240 / 70%);\n  --v2p-color-bg-subtle: rgb(236 253 245 / 90%);\n  --v2p-color-bg-input: var(--v2p-color-main-50);\n  --v2p-color-bg-search: var(--v2p-color-main-100);\n  --v2p-color-bg-search-active: var(--v2p-color-main-150);\n  --v2p-color-bg-widget: rgb(255 255 255 / 70%);\n  --v2p-color-bg-reply: var(--v2p-color-main-100);\n  --v2p-color-bg-tooltip: var(--v2p-color-bg-content);\n  --v2p-color-bg-tabs: var(--v2p-color-main-100);\n  --v2p-color-bg-tpr: var(--v2p-color-main-100);\n  --v2p-color-bg-avatar: var(--v2p-color-main-300);\n  --v2p-color-bg-block: var(--v2p-color-main-100);\n  --v2p-color-bg-block-darker: var(--v2p-color-main-300);\n  --v2p-color-bg-link: var(--v2p-color-main-100);\n  --v2p-color-bg-link-hover: var(--v2p-color-main-200);\n  --v2p-color-bg-error: #fee2e2;\n  --v2p-color-tabs: var(--v2p-color-foreground);\n  --v2p-color-heart: #ef4444;\n  --v2p-color-heart-fill: #fee2e2;\n  --v2p-color-mask: rgb(0 0 0 / 25%);\n  --v2p-color-divider: var(--v2p-color-main-200);\n  --v2p-color-border: var(--v2p-color-main-200);\n  --v2p-color-input-border: var(--v2p-color-main-300);\n  --v2p-color-input-border-focus: var(--v2p-color-main-400);\n  --v2p-color-border-darker: var(--v2p-color-main-300);\n  --v2p-color-link-visited: var(--v2p-color-main-400);\n  --v2p-color-error: #ef4444;\n  --v2p-color-cell-num: var(--v2p-color-main-350);\n  --v2p-color-badge: var(--v2p-color-bg-content);\n  --v2p-box-shadow: 0 3px 5px 0 rgb(0 0 0 / 4%);\n  --v2p-widget-shadow: 0 9px 24px -3px rgb(0 0 0 / 6%), 0 4px 8px -1px rgb(0 0 0 /12%);\n  --v2p-toast-shadow:\n    0 6px 16px 0 rgb(0 0 0 / 8%), 0 3px 6px -4px rgb(0 0 0 / 12%), 0 9px 28px 8px rgb(0 0 0 / 5%);\n  --color-fade: var(--v2p-color-font-secondary);\n  --color-gray: var(--v2p-color-font-secondary);\n  --link-color: var(--v2p-color-foreground);\n  --link-darker-color: var(--v2p-color-main-600);\n  --link-hover-color: var(--v2p-color-foreground);\n  --link-caution-color: var(--v2p-color-orange-400);\n  --link-visited-color: currentColor;\n  --box-border-color: var(--v2p-color-border);\n  --box-foreground-color: var(--v2p-color-foreground);\n  --box-background-color: var(--v2p-color-bg-content);\n  --box-background-alt-color: var(--v2p-color-main-100);\n  --box-background-hover-color: var(--v2p-color-main-200);\n  --box-border-focus-color: var(--v2p-color-main-200);\n  --box-border-radius: var(--v2p-box-radius);\n  --button-background-color: var(--v2p-color-button-background);\n  --button-foreground-color: var(--v2p-color-button-foreground);\n  --button-hover-color: var(--v2p-color-button-background-hover);\n  --button-background-hover-color: var(--v2p-color-button-background-hover);\n  --button-foreground-hover-color: var(--v2p-color-button-foreground-hover);\n  --button-border-color: var(--v2p-color-main-300);\n  --button-border-hover-color: var(--v2p-color-main-400);\n  color: var(--v2p-color-foreground);\n  text-autospace: normal;\n  background-color: var(--v2p-color-background);\n}\n:root body.v2p-theme-light-default,\n:root body .v2p-theme-light-default {\n  --v2p-color-main-50: #f7f9fb;\n  --v2p-color-main-100: #f1f5f9;\n  --v2p-color-main-150: #eaeff5;\n  --v2p-color-main-200: #e2e8f0;\n  --v2p-color-main-300: #cbd5e1;\n  --v2p-color-main-350: #94a3b8cc;\n  --v2p-color-main-400: #94a3b8;\n  --v2p-color-main-500: #64748b;\n  --v2p-color-main-600: #475569;\n  --v2p-color-main-700: #334155;\n  --v2p-color-main-800: #1e293b;\n  --v2p-color-accent-50: oklch(97.9% 0.021 166.113deg);\n  --v2p-color-accent-100: oklch(95% 0.052 163.051deg);\n  --v2p-color-accent-200: oklch(90.5% 0.093 164.15deg);\n  --v2p-color-accent-300: oklch(84.5% 0.143 164.978deg);\n  --v2p-color-accent-400: oklch(76.5% 0.177 163.223deg);\n  --v2p-color-accent-500: oklch(69.6% 0.17 162.48deg);\n  --v2p-color-accent-600: oklch(59.6% 0.145 163.225deg);\n  --v2p-color-accent-700: oklch(50.8% 0.118 165.612deg);\n  --v2p-color-orange-50: #fff7ed;\n  --v2p-color-orange-100: #ffedd5;\n  --v2p-color-orange-400: #fb923c;\n  --v2p-color-background: #f2f3f5;\n  --v2p-color-foreground: var(--v2p-color-main-800);\n  --v2p-color-selection-foreground: var(--v2p-color-main-100);\n  --v2p-color-selection-background: var(--v2p-color-main-700);\n  --v2p-color-selection-background-img: var(--v2p-color-main-500);\n  --v2p-color-font-secondary: var(--v2p-color-main-600);\n  --v2p-color-font-tertiary: var(--v2p-color-main-500);\n  --v2p-color-font-quaternary: var(--v2p-color-main-400);\n  --v2p-color-button-background: var(--v2p-color-main-100);\n  --v2p-color-button-foreground: var(--v2p-color-main-500);\n  --v2p-color-button-background-hover: var(--v2p-color-main-200);\n  --v2p-color-button-foreground-hover: var(--v2p-color-main-600);\n  --v2p-color-button-border: var(--v2p-color-main-300);\n  --v2p-color-button-special-background: var(--v2p-color-accent-50);\n  --v2p-color-button-special-foreground: var(--v2p-color-accent-700);\n  --v2p-color-button-special-border: var(--v2p-color-accent-600);\n  --v2p-color-button-special-foreground-hover: var(--v2p-color-accent-700);\n  --v2p-color-bg-content: #fff;\n  --v2p-color-bg-footer: var(--v2p-color-bg-content);\n  --v2p-color-bg-hover-btn: rgb(226 232 240 / 70%);\n  --v2p-color-bg-subtle: rgb(236 253 245 / 90%);\n  --v2p-color-bg-input: var(--v2p-color-main-50);\n  --v2p-color-bg-search: var(--v2p-color-main-100);\n  --v2p-color-bg-search-active: var(--v2p-color-main-150);\n  --v2p-color-bg-widget: rgb(255 255 255 / 70%);\n  --v2p-color-bg-reply: var(--v2p-color-main-100);\n  --v2p-color-bg-tooltip: var(--v2p-color-bg-content);\n  --v2p-color-bg-tabs: var(--v2p-color-main-100);\n  --v2p-color-bg-tpr: var(--v2p-color-main-100);\n  --v2p-color-bg-avatar: var(--v2p-color-main-300);\n  --v2p-color-bg-block: var(--v2p-color-main-100);\n  --v2p-color-bg-block-darker: var(--v2p-color-main-300);\n  --v2p-color-bg-link: var(--v2p-color-main-100);\n  --v2p-color-bg-link-hover: var(--v2p-color-main-200);\n  --v2p-color-bg-error: #fee2e2;\n  --v2p-color-tabs: var(--v2p-color-foreground);\n  --v2p-color-heart: #ef4444;\n  --v2p-color-heart-fill: #fee2e2;\n  --v2p-color-mask: rgb(0 0 0 / 25%);\n  --v2p-color-divider: var(--v2p-color-main-200);\n  --v2p-color-border: var(--v2p-color-main-200);\n  --v2p-color-input-border: var(--v2p-color-main-300);\n  --v2p-color-input-border-focus: var(--v2p-color-main-400);\n  --v2p-color-border-darker: var(--v2p-color-main-300);\n  --v2p-color-link-visited: var(--v2p-color-main-400);\n  --v2p-color-error: #ef4444;\n  --v2p-color-cell-num: var(--v2p-color-main-350);\n  --v2p-color-badge: var(--v2p-color-bg-content);\n  --v2p-box-shadow: 0 3px 5px 0 rgb(0 0 0 / 4%);\n  --v2p-widget-shadow: 0 9px 24px -3px rgb(0 0 0 / 6%), 0 4px 8px -1px rgb(0 0 0 /12%);\n  --v2p-toast-shadow:\n    0 6px 16px 0 rgb(0 0 0 / 8%), 0 3px 6px -4px rgb(0 0 0 / 12%), 0 9px 28px 8px rgb(0 0 0 / 5%);\n  --color-fade: var(--v2p-color-font-secondary);\n  --color-gray: var(--v2p-color-font-secondary);\n  --link-color: var(--v2p-color-foreground);\n  --link-darker-color: var(--v2p-color-main-600);\n  --link-hover-color: var(--v2p-color-foreground);\n  --link-caution-color: var(--v2p-color-orange-400);\n  --link-visited-color: currentColor;\n  --box-border-color: var(--v2p-color-border);\n  --box-foreground-color: var(--v2p-color-foreground);\n  --box-background-color: var(--v2p-color-bg-content);\n  --box-background-alt-color: var(--v2p-color-main-100);\n  --box-background-hover-color: var(--v2p-color-main-200);\n  --box-border-focus-color: var(--v2p-color-main-200);\n  --box-border-radius: var(--v2p-box-radius);\n  --button-background-color: var(--v2p-color-button-background);\n  --button-foreground-color: var(--v2p-color-button-foreground);\n  --button-hover-color: var(--v2p-color-button-background-hover);\n  --button-background-hover-color: var(--v2p-color-button-background-hover);\n  --button-foreground-hover-color: var(--v2p-color-button-foreground-hover);\n  --button-border-color: var(--v2p-color-main-300);\n  --button-border-hover-color: var(--v2p-color-main-400);\n}\n:root body #Logo {\n  background-image: url("https://www.v2ex.com/static/img/v2ex@2x.png");\n}\n:root body ::selection {\n  color: var(--v2p-color-selection-foreground);\n  background-color: var(--v2p-color-selection-background);\n}\n:root body img::selection {\n  background-color: var(--v2p-color-selection-background-img);\n}\n:root code,\n:root pre,\n:root table {\n  text-autospace: no-autospace;\n}\n\n/* V2EX Polish c8f1b70; Copyright (c) 2023-present LeoKu and contributors.\n * MIT; see licenses/v2ex-polish-MIT.txt. Font and reply-spacing overrides removed as requested.\n */\n/* V2EX Polish c8f1b70; Copyright (c) 2023-present LeoKu and contributors.\n * MIT; see licenses/v2ex-polish-MIT.txt. Font overrides removed as requested.\n */\n:root {\n  color-scheme: light;\n  background-color: var(--v2p-color-background);\n}\n\nhtml,\nbody {\n  min-height: 100vh;\n}\n\n:root[data-v2p-theme] body {\n  visibility: visible;\n}\n\n@keyframes v2p-boot-reveal {\n  to {\n    visibility: visible;\n  }\n}\nbody {\n  scrollbar-gutter: stable;\n  overflow: auto;\n  visibility: hidden;\n  animation: v2p-boot-reveal 0s 800ms forwards;\n}\nbody.v2p-theme-light-default {\n  visibility: visible;\n}\nbody h1 {\n  font-weight: bold;\n}\nbody a {\n  cursor: default;\n  text-decoration: none;\n}\nbody a[href] {\n  cursor: pointer;\n}\nbody a:hover {\n  text-decoration: underline 1px;\n  text-underline-offset: var(--v2p-underline-offset);\n}\nbody pre {\n  max-width: calc(var(--v2p-content-width) - var(--v2p-rightbar-width) - 2 * var(--v2p-layout-column-gap) - 24px);\n}\nbody #Top {\n  height: var(--v2p-nav-height);\n  border: none;\n  background-color: var(--v2p-color-bg-content);\n}\nbody #Bottom {\n  border: none;\n  color: var(--v2p-color-font-secondary);\n  background-color: var(--v2p-color-bg-footer);\n}\nbody #Bottom .content {\n  flex-direction: column;\n}\nbody #Wrapper {\n  background-color: inherit;\n  background-image: none;\n}\nbody #Wrapper.Night {\n  background-color: inherit;\n  background-image: none;\n}\nbody #Wrapper .content {\n  display: flex;\n  gap: var(--v2p-layout-column-gap);\n  max-width: var(--v2p-content-width);\n}\n#Navcol .nav_item:hover {\n  background-color: var(--box-background-hover-color);\n}\n#Navcol .nav_item:hover:active {\n  box-shadow: none;\n}\n#Navcol .nav_item_current:hover {\n  color: var(--box-foreground-color);\n  background-color: var(--v2p-color-bg-content);\n}\n#Navcol .nav_item_current:active {\n  box-shadow: none;\n}\n\n#Rightcol #page-outline-title {\n  background-color: var(--v2p-color-button-background-hover);\n}\n#Rightcol .page-outline-item:hover {\n  background-color: var(--box-background-hover-color);\n}\n\nbody #Wrapper:has(#Singleton) {\n  padding: 20px 0 0;\n}\nbody #Wrapper:has(#Singleton) #Singleton {\n  overflow: hidden;\n  box-shadow: var(--v2p-box-shadow);\n}\nbody #Leftbar {\n  float: none;\n  order: 1;\n}\nbody #Main {\n  flex: 1;\n  order: 2;\n  max-width: clamp(400px, 92vw, 1200px);\n  margin: 0;\n}\nbody #Rightbar {\n  float: none;\n  order: 3;\n  width: var(--v2p-rightbar-width);\n  margin-right: var(--v2p-layout-column-gap);\n}\n:root[data-v2p-preview] {\n  --v2p-rightbar-toggle-display: flex;\n}\n:root[data-v2p-preview] body {\n  min-width: 450px;\n}\n:root[data-v2p-preview] #Wrapper .content {\n  gap: 0;\n  min-width: 450px;\n}\n:root[data-v2p-preview] #Wrapper #Main {\n  margin: auto;\n}\n:root[data-v2p-preview] #Wrapper #Rightbar {\n  position: fixed;\n  z-index: var(--zidx-rightbar);\n  top: var(--v2p-layout-column-gap);\n  right: 10px;\n  overflow-y: auto;\n  display: none;\n  max-height: calc(100vh - 2 * var(--v2p-layout-column-gap));\n  margin: 0;\n  padding: 10px;\n  border: 1px solid var(--v2p-color-border);\n  border-radius: var(--v2p-box-radius);\n  background-color: var(--v2p-color-bg-content);\n  box-shadow: var(--v2p-widget-shadow);\n}\n:root[data-v2p-preview] #Wrapper #Rightbar.v2p-layout-rightbar-visible {\n  display: block;\n}\n:root[data-v2p-preview] #Wrapper #Rightbar.v2p-layout-rightbar-visible .box {\n  background-color: var(--v2p-color-background);\n  box-shadow: none;\n}\n:root[data-v2p-preview] #Wrapper #Rightbar .v2p-tool-box {\n  border: 1px solid var(--v2p-color-border);\n}\n\n:root[data-v2p-preview="1"] #Top,\n:root[data-v2p-preview="1"] #Bottom {\n  display: none;\n}\n\n@media (width < 900px) {\n  :root[data-v2p-page=topic] {\n    --v2p-rightbar-toggle-display: flex;\n  }\n  :root[data-v2p-page=topic] #Wrapper .content {\n    gap: 0;\n  }\n  :root[data-v2p-page=topic] #Wrapper #Main {\n    margin: auto;\n  }\n  :root[data-v2p-page=topic] #Wrapper #Rightbar {\n    position: fixed;\n    z-index: var(--zidx-rightbar);\n    top: var(--v2p-layout-column-gap);\n    right: 10px;\n    overflow-y: auto;\n    display: none;\n    max-height: calc(100vh - 2 * var(--v2p-layout-column-gap));\n    margin: 0;\n    padding: 10px;\n    border: 1px solid var(--v2p-color-border);\n    border-radius: var(--v2p-box-radius);\n    background-color: var(--v2p-color-bg-content);\n    box-shadow: var(--v2p-widget-shadow);\n  }\n  :root[data-v2p-page=topic] #Wrapper #Rightbar.v2p-layout-rightbar-visible {\n    display: block;\n  }\n  :root[data-v2p-page=topic] #Wrapper #Rightbar.v2p-layout-rightbar-visible .box {\n    background-color: var(--v2p-color-background);\n    box-shadow: none;\n  }\n  :root[data-v2p-page=topic] #Wrapper #Rightbar .v2p-tool-box {\n    border: 1px solid var(--v2p-color-border);\n  }\n}\nbody #search-container {\n  height: 30px;\n  margin: 0 30px;\n  border: none;\n  border-radius: var(--v2p-input-radius);\n  background-color: var(--v2p-color-bg-search);\n}\nbody #search-container::before {\n  top: 0;\n  left: 4px;\n  opacity: 0.6;\n  background-size: 14px 14px;\n  filter: none;\n}\nbody #search-container.active {\n  background-color: var(--v2p-color-bg-search-active);\n}\nbody #search-container #search {\n  font-size: 14px;\n  font-weight: 500;\n}\nbody #search-container #search-result {\n  z-index: var(--zidx-search);\n  top: 42px;\n  border: 1px solid var(--box-border-color);\n  font-size: 14px;\n  color: var(--v2p-color-font-secondary);\n  background: var(--v2p-color-bg-widget);\n  backdrop-filter: blur(16px);\n  box-shadow: var(--v2p-widget-shadow);\n}\nbody #search-container #search-result .fade {\n  color: var(--v2p-color-font-secondary);\n}\nbody #search-container #search-result .search-item {\n  border-radius: var(--v2p-button-radius);\n  font-weight: bold;\n  color: var(--v2p-color-foreground);\n}\nbody #search-container #search-result .search-item.active {\n  color: var(--v2p-color-foreground);\n}\nbody #search-container #search-result .search-item.active.v2p-no-active {\n  background-color: transparent;\n}\nbody .box {\n  border: none;\n  border-radius: var(--box-border-radius);\n  color: var(--box-foreground-color);\n  background-color: var(--v2p-color-bg-content);\n  box-shadow: var(--v2p-box-shadow);\n}\nbody .box .header {\n  font-weight: 500;\n}\nbody .box .header > h1 {\n  font-size: 22px;\n  font-weight: bold;\n}\nbody .box .header .gray {\n  color: var(--color-gray);\n}\nbody .button {\n  --button-hover-shadow:\n    0 1.8px 0 var(--button-border-color), 0 1.8px 0 var(--button-background-color);\n}\nbody .button.normal, body .button.super, body .button.special {\n  cursor: pointer;\n  user-select: none;\n  position: relative;\n  display: inline-flex;\n  gap: 5px;\n  align-items: center;\n  height: 28px;\n  padding: 0 12px;\n  border: 1px solid var(--v2p-color-button-border);\n  border-radius: var(--v2p-button-radius);\n  font-family: inherit;\n  font-size: 14px;\n  font-weight: 500;\n  line-height: 28px;\n  color: var(--v2p-color-button-foreground);\n  text-shadow: none;\n  white-space: nowrap;\n  background: var(--v2p-color-button-background);\n  outline: none;\n  box-shadow: 0 1.8px 0 var(--box-background-hover-color), 0 1.8px 0 var(--button-background-color);\n  transition: color 0.25s, background-color 0.25s, box-shadow 0.25s;\n}\nbody .button.normal.special, body .button.super.special, body .button.special.special {\n  border-color: var(--v2p-color-button-special-border);\n  color: var(--v2p-color-button-special-foreground);\n  background: var(--v2p-color-button-special-background);\n}\nbody .button.normal.v2p-btn-small, body .button.super.v2p-btn-small, body .button.special.v2p-btn-small {\n  height: 24px;\n  padding: 0 10px;\n  border-radius: var(--v2p-button-radius);\n  font-size: 12px;\n}\nbody .button.normal.v2p-btn-large, body .button.super.v2p-btn-large, body .button.special.v2p-btn-large {\n  height: 32px;\n  padding: 0 14px;\n  border-radius: var(--v2p-box-radius);\n  font-size: 16px;\n}\nbody .button.normal:is(:hover:enabled, :active:enabled), body .button.super:is(:hover:enabled, :active:enabled), body .button.special:is(:hover:enabled, :active:enabled) {\n  border: 1px solid var(--v2p-color-button-border);\n  font-weight: 500;\n  color: var(--v2p-color-button-foreground-hover);\n  text-shadow: none;\n  background: var(--v2p-color-button-background-hover);\n  box-shadow: var(--button-hover-shadow);\n}\nbody .button.normal:is(:hover:enabled, :active:enabled).special, body .button.super:is(:hover:enabled, :active:enabled).special, body .button.special:is(:hover:enabled, :active:enabled).special {\n  border-color: var(--v2p-color-button-special-border);\n  color: var(--v2p-color-button-special-foreground-hover);\n  background: var(--v2p-color-button-special-background);\n}\nbody .button.normal:is(.hover_now, .disable_now), body .button.super:is(.hover_now, .disable_now), body .button.special:is(.hover_now, .disable_now) {\n  border: 1px solid var(--v2p-color-button-border);\n  color: var(--v2p-color-button-foreground) !important;\n  text-shadow: none !important;\n  background: var(--button-background-color) !important;\n  box-shadow: 0 1.8px 0 var(--box-background-hover-color) !important, 0 1.8px 0 var(--button-background-color) !important;\n}\nbody .button.normal:is(.hover_now, .disable_now).special, body .button.super:is(.hover_now, .disable_now).special, body .button.special:is(.hover_now, .disable_now).special {\n  border-color: var(--v2p-color-button-special-border);\n}\nbody .button.normal:is(.disable_now, :disabled), body .button.super:is(.disable_now, :disabled), body .button.special:is(.disable_now, :disabled) {\n  pointer-events: none;\n  cursor: default;\n  font-weight: 500;\n  color: var(--v2p-color-button-foreground);\n  text-shadow: none;\n  opacity: 0.8;\n  background: var(--button-background-color);\n  box-shadow: 0 1.8px 0 var(--box-background-hover-color), 0 1.8px 0 var(--button-background-color);\n}\nbody .button.normal kbd, body .button.super kbd, body .button.special kbd {\n  position: relative;\n  right: -4px;\n  padding: 0 3px;\n  border: 1px solid var(--button-border-color);\n  border-radius: var(--v2p-button-radius);\n  font-family: inherit;\n  font-size: 90%;\n  line-height: initial;\n}\nbody .button.special {\n  --button-hover-shadow:\n    0 1.8px 0 var(--v2p-color-accent-200), 0 1.8px 0 var(--v2p-color-accent-100);\n  box-shadow: var(--button-hover-shadow);\n}\nbody .button.special:hover, body .button.special:hover:enabled {\n  color: var(--v2p-color-accent-600);\n  box-shadow: var(--button-hover-shadow);\n}\nbody .button a {\n  color: inherit;\n  text-decoration: none;\n}\nbody .badge {\n  user-select: none;\n  padding: 2px 5px;\n  border: 1px solid var(--v2p-color-accent-400);\n  font-weight: bold;\n}\nbody .badge:first-child {\n  border: 1px solid var(--v2p-color-accent-400);\n  border-top-left-radius: var(--v2p-button-radius);\n  border-bottom-left-radius: var(--v2p-button-radius);\n}\nbody .badge:last-child {\n  border: 1px solid var(--v2p-color-accent-400);\n  border-top-right-radius: var(--v2p-button-radius);\n  border-bottom-right-radius: var(--v2p-button-radius);\n}\nbody .badge.op {\n  color: var(--v2p-color-accent-500);\n  background-color: var(--v2p-color-accent-50);\n}\nbody .badge.mod {\n  color: var(--v2p-color-bg-content);\n  background-color: var(--v2p-color-accent-400);\n}\nbody .badge.you {\n  border: 1px solid var(--v2p-color-orange-400);\n  color: var(--v2p-color-orange-400);\n  background-color: var(--v2p-color-orange-50);\n}\nbody .badge.mini {\n  height: 1.2em;\n  padding: 0 3px;\n  font-size: 12px;\n  font-weight: normal;\n  line-height: 1;\n}\nbody a.node:is(:active, :link, :visited) {\n  padding: 5px 6px;\n  border-radius: var(--v2p-button-radius);\n  font-size: 13px;\n  color: var(--v2p-color-font-secondary);\n  background-color: var(--v2p-color-bg-block);\n}\nbody a.node:is(:active, :link, :visited):hover {\n  color: var(--v2p-color-font-tertiary);\n  background-color: var(--v2p-color-button-background-hover);\n}\nbody .outdated {\n  border-color: var(--v2p-color-border);\n  border-bottom: none;\n  font-size: 12px;\n}\nbody :is(.page_normal, .page_current):is(:link, :visited) {\n  user-select: none;\n  padding: 6px 9px;\n  border: none;\n  border-radius: var(--v2p-button-radius);\n  font-size: 14px;\n}\nbody .page_normal:is(:link, :visited) {\n  font-weight: 500;\n  background-color: var(--v2p-color-bg-content);\n  box-shadow: 0 2px 2px var(--box-background-hover-color);\n  transition: transform 0.25s;\n}\nbody .page_normal:is(:link, :visited):hover {\n  transform: scale(1.1) translateY(-2px);\n}\nbody .page_current:is(:link, :visited) {\n  pointer-events: none;\n  font-weight: bold;\n  background-color: var(--box-background-hover-color);\n  box-shadow: none;\n}\nbody .page_input {\n  display: none;\n}\nbody .dock_area {\n  margin: 12px 0;\n  background: var(--v2p-color-bg-block);\n}\nbody .member-activity-bar {\n  background-color: var(--v2p-color-divider);\n}\nbody .member-activity-bar .member-activity-start {\n  background-color: var(--v2p-color-accent-200);\n}\nbody .member-activity-bar .member-activity-fourth {\n  background-color: var(--v2p-color-accent-400);\n}\nbody .member-activity-bar .member-activity-half {\n  background-color: var(--v2p-color-accent-500);\n}\nbody .member-activity-bar .member-activity-almost {\n  background-color: var(--v2p-color-accent-600);\n}\nbody .member-activity-bar .member-activity-done {\n  background-color: var(--v2p-color-orange-400);\n}\nbody .online {\n  user-select: none;\n  padding: 6px 8px;\n  border-radius: var(--v2p-button-radius);\n  font-size: 13px;\n  color: var(--v2p-color-bg-content);\n  background: var(--v2p-color-accent-400);\n}\nbody #topic_supplement {\n  resize: none;\n  overflow: hidden;\n  height: unset;\n  min-height: 550px !important;\n  max-height: 800px !important;\n  border: 1px solid var(--button-border-color);\n  border-radius: var(--v2p-input-radius);\n  font-size: 15px;\n  color: currentColor;\n  background-color: var(--v2p-color-bg-input);\n  transition: opacity 0.25s;\n  overflow-y: auto;\n}\nbody #topic_supplement::placeholder {\n  font-size: 15px;\n  color: var(--v2p-color-font-tertiary);\n}\nbody #topic_supplement:is(:focus, :focus-within) {\n  border-color: var(--button-border-hover-color);\n  background-color: transparent;\n  outline: none;\n  box-shadow: none;\n}\nbody .item_hot_topic_title {\n  --offset: 2.4px;\n  overflow: hidden;\n  display: -webkit-box;\n  -webkit-box-orient: vertical;\n  -webkit-line-clamp: 2;\n  line-height: 1.4;\n  position: relative;\n  padding: var(--offset) 0;\n  text-shadow: none;\n}\nbody .item_hot_topic_title > a:hover {\n  text-underline-offset: var(--offset);\n}\nbody form textarea#topic_title {\n  resize: none;\n  overflow: hidden;\n  height: unset;\n  min-height: 75px !important;\n  max-height: 800px !important;\n  border: 1px solid var(--button-border-color);\n  border-radius: var(--v2p-input-radius);\n  font-size: 15px;\n  color: currentColor;\n  background-color: var(--v2p-color-bg-input);\n  transition: opacity 0.25s;\n}\nbody form textarea#topic_title::placeholder {\n  font-size: 15px;\n  color: var(--v2p-color-font-tertiary);\n}\nbody form textarea#topic_title:is(:focus, :focus-within) {\n  border-color: var(--button-border-hover-color);\n  background-color: transparent;\n  outline: none;\n  box-shadow: none;\n}\nbody form #topic_title {\n  resize: none;\n  overflow: hidden;\n  height: unset;\n  min-height: 30px !important;\n  max-height: 800px !important;\n  border: 1px solid var(--button-border-color);\n  border-radius: var(--v2p-input-radius);\n  font-size: 15px;\n  color: currentColor;\n  background-color: var(--v2p-color-bg-input);\n  transition: opacity 0.25s;\n}\nbody form #topic_title::placeholder {\n  font-size: 15px;\n  color: var(--v2p-color-font-tertiary);\n}\nbody form #topic_title:is(:focus, :focus-within) {\n  border-color: var(--button-border-hover-color);\n  background-color: transparent;\n  outline: none;\n  box-shadow: none;\n}\nbody form #topic_content {\n  resize: none;\n  overflow: hidden;\n  height: unset;\n  min-height: 120px !important;\n  max-height: 800px !important;\n  border: 1px solid var(--button-border-color);\n  border-radius: var(--v2p-input-radius);\n  font-size: 15px;\n  color: currentColor;\n  background-color: var(--v2p-color-bg-input);\n  transition: opacity 0.25s;\n}\nbody form #topic_content::placeholder {\n  font-size: 15px;\n  color: var(--v2p-color-font-tertiary);\n}\nbody form #topic_content:is(:focus, :focus-within) {\n  border-color: var(--button-border-hover-color);\n  background-color: transparent;\n  outline: none;\n  box-shadow: none;\n}\nbody form[action^="/notes"] .cell {\n  background-color: transparent !important;\n}\nbody #syntax-selector .radio-group {\n  padding: 3px;\n  border-radius: var(--v2p-box-radius);\n  background-color: var(--v2p-color-background);\n  box-shadow: 0 1px 2px var(--v2p-box-shadow) inset;\n}\nbody #syntax-selector .radio-group > input[type=radio]:checked + label {\n  border-radius: var(--v2p-button-radius);\n  color: var(--v2p-color-accent-600);\n  background-color: var(--v2p-color-accent-100);\n  box-shadow: 1px 1px 2px var(--v2p-box-shadow);\n}\nbody #syntax-selector .radio-group > input[type=radio] + label {\n  cursor: pointer;\n  font-size: 13px;\n}\nbody #syntax-selector label {\n  color: var(--v2p-color-foreground);\n}\nbody .snow {\n  color: var(--v2p-color-font-quaternary);\n}\nbody .orange-dot {\n  background: var(--v2p-color-orange-400);\n}\nbody .alt {\n  border: 1px solid var(--button-border-color);\n  background-color: var(--v2p-color-bg-input);\n}\nbody a.btn_hero {\n  border-color: var(--v2p-color-foreground);\n}\nbody a.btn_hero:hover {\n  background-color: var(--v2p-color-foreground);\n}\nbody .cell_ops {\n  background-color: transparent;\n}\nbody :is(.topic_content,\n.reply_content,\n.v2p-topic-preview-content,\n.v2p-topic-preview-addons,\n.v2p-reply-preview,\n.markdown_body) a[href*="v2ex.com/t"],\nbody :is(.topic_content,\n.reply_content,\n.v2p-topic-preview-content,\n.v2p-topic-preview-addons,\n.v2p-reply-preview,\n.markdown_body) a[href*="v2ex.com/t"][href^=http],\nbody :is(.topic_content,\n.reply_content,\n.v2p-topic-preview-content,\n.v2p-topic-preview-addons,\n.v2p-reply-preview,\n.markdown_body) a[href*="v2ex.co/t"],\nbody :is(.topic_content,\n.reply_content,\n.v2p-topic-preview-content,\n.v2p-topic-preview-addons,\n.v2p-reply-preview,\n.markdown_body) a[href*="v2ex.co/t"][href^=http],\nbody :is(.topic_content,\n.reply_content,\n.v2p-topic-preview-content,\n.v2p-topic-preview-addons,\n.v2p-reply-preview,\n.markdown_body) a[href^="/"] {\n  text-decoration: underline 1.5px;\n  text-underline-offset: 0.46ex;\n  color: var(--v2p-color-accent-500);\n  background-color: var(--v2p-color-accent-50);\n}\nbody :is(.topic_content,\n.reply_content,\n.v2p-topic-preview-content,\n.v2p-topic-preview-addons,\n.v2p-reply-preview,\n.markdown_body) a[href*="v2ex.com/t"]:hover,\nbody :is(.topic_content,\n.reply_content,\n.v2p-topic-preview-content,\n.v2p-topic-preview-addons,\n.v2p-reply-preview,\n.markdown_body) a[href*="v2ex.com/t"][href^=http]:hover,\nbody :is(.topic_content,\n.reply_content,\n.v2p-topic-preview-content,\n.v2p-topic-preview-addons,\n.v2p-reply-preview,\n.markdown_body) a[href*="v2ex.co/t"]:hover,\nbody :is(.topic_content,\n.reply_content,\n.v2p-topic-preview-content,\n.v2p-topic-preview-addons,\n.v2p-reply-preview,\n.markdown_body) a[href*="v2ex.co/t"][href^=http]:hover,\nbody :is(.topic_content,\n.reply_content,\n.v2p-topic-preview-content,\n.v2p-topic-preview-addons,\n.v2p-reply-preview,\n.markdown_body) a[href^="/"]:hover {\n  color: var(--v2p-color-accent-500);\n  background-color: var(--v2p-color-accent-50);\n}\nbody :is(.topic_content,\n.reply_content,\n.v2p-topic-preview-content,\n.v2p-topic-preview-addons,\n.v2p-reply-preview,\n.markdown_body) a[href^=http],\nbody :is(.topic_content,\n.reply_content,\n.v2p-topic-preview-content,\n.v2p-topic-preview-addons,\n.v2p-reply-preview,\n.markdown_body) a[href*="/email-protection"],\nbody :is(.topic_content,\n.reply_content,\n.v2p-topic-preview-content,\n.v2p-topic-preview-addons,\n.v2p-reply-preview,\n.markdown_body) a[href^="/member/"] {\n  text-decoration: underline 1.5px;\n  text-underline-offset: 0.46ex;\n  color: currentColor;\n  background-color: var(--v2p-color-bg-link);\n}\nbody :is(.topic_content,\n.reply_content,\n.v2p-topic-preview-content,\n.v2p-topic-preview-addons,\n.v2p-reply-preview,\n.markdown_body) a[href^=http]:hover,\nbody :is(.topic_content,\n.reply_content,\n.v2p-topic-preview-content,\n.v2p-topic-preview-addons,\n.v2p-reply-preview,\n.markdown_body) a[href*="/email-protection"]:hover,\nbody :is(.topic_content,\n.reply_content,\n.v2p-topic-preview-content,\n.v2p-topic-preview-addons,\n.v2p-reply-preview,\n.markdown_body) a[href^="/member/"]:hover {\n  color: currentColor;\n  background-color: var(--v2p-color-bg-link-hover);\n}\nbody :is(.topic_content,\n.reply_content,\n.v2p-topic-preview-content,\n.v2p-topic-preview-addons,\n.v2p-reply-preview,\n.markdown_body) a[href^=http]:has(> .embedded_image),\nbody :is(.topic_content,\n.reply_content,\n.v2p-topic-preview-content,\n.v2p-topic-preview-addons,\n.v2p-reply-preview,\n.markdown_body) a[href*="/email-protection"]:has(> .embedded_image),\nbody :is(.topic_content,\n.reply_content,\n.v2p-topic-preview-content,\n.v2p-topic-preview-addons,\n.v2p-reply-preview,\n.markdown_body) a[href^="/member/"]:has(> .embedded_image) {\n  background-color: transparent;\n}\nbody .CodeMirror {\n  color: currentColor;\n  background-color: var(--v2p-color-bg-input);\n}\nbody .CodeMirror.CodeMirror-focused {\n  background-color: var(--v2p-color-bg-content);\n}\nbody .CodeMirror .CodeMirror-gutters {\n  padding-right: 5px;\n  border-right: 1px solid var(--v2p-color-border-darker);\n  background-color: var(--v2p-color-bg-input);\n}\nbody .CodeMirror .CodeMirror-linenumber {\n  color: var(--v2p-color-font-quaternary);\n}\nbody .CodeMirror .CodeMirror-cursors {\n  background-color: var(--v2p-color-foreground);\n}\nbody .cm-s-one-dark {\n  background-color: var(--v2p-color-bg-input);\n}\nbody #workspace {\n  overflow: hidden;\n  border: 1px solid var(--button-border-color);\n  border-radius: 8px;\n}\nbody .select2-container {\n  width: 200px !important;\n}\nbody .select2-container .select2-selection {\n  height: 33px !important;\n  border: 1px solid var(--v2p-color-border);\n  border-radius: var(--v2p-input-radius) !important;\n  background-color: var(--v2p-color-bg-content);\n}\nbody .select2-container .select2-selection .select2-selection__rendered,\nbody .select2-container .select2-selection .select2-selection__placeholder {\n  display: inline-flex;\n  align-items: center;\n  height: 100%;\n  color: var(--v2p-color-foreground);\n}\nbody .select2-container .select2-dropdown {\n  border: 1px solid var(--box-border-color);\n  border-radius: var(--v2p-popup-radius);\n  font-size: 14px;\n  background: var(--v2p-color-bg-widget);\n  backdrop-filter: blur(16px);\n  box-shadow: var(--v2p-widget-shadow);\n  transform: translateY(5px);\n}\nbody .select2-container .select2-dropdown .select2-search {\n  padding: 5px;\n}\nbody .select2-container .select2-dropdown .select2-search .select2-search__field {\n  padding: 6px 4px;\n  border: 1px solid var(--v2p-color-border);\n  border-radius: var(--v2p-input-radius);\n  background-color: transparent;\n}\nbody .select2-container .select2-dropdown .select2-search .select2-search__field:focus-visible {\n  border-color: var(--v2p-color-font-quaternary);\n  outline: none;\n}\nbody .select2-container .select2-dropdown .select2-results > .select2-results__options {\n  padding: 5px;\n}\nbody .select2-container .select2-dropdown .select2-container--default .select2-results__option--selected {\n  color: currentColor;\n  background-color: var(--v2p-color-accent-100);\n}\nbody .select2-container .select2-results__option {\n  border-radius: var(--v2p-popup-radius);\n}\nbody .select2-container .select2-results__option--highlighted.select2-results__option--selectable {\n  color: currentColor;\n  background-color: var(--v2p-color-button-background-hover);\n}\nbody .select2-container .select2-results__option--selected {\n  color: currentColor !important;\n  background-color: var(--v2p-color-accent-100) !important;\n}\nbody .problem {\n  border-color: var(--v2p-color-orange-400);\n  border-bottom: none;\n  color: currentColor;\n  color: var(--v2p-color-orange-400);\n  background-color: var(--v2p-color-orange-50);\n}\nbody .markdown_body table {\n  border-top: 1px solid var(--v2p-color-border-darker);\n  box-shadow: none;\n}\nbody .markdown_body table tr th,\nbody .markdown_body table tr td {\n  border: 1px solid var(--v2p-color-border-darker);\n}\nbody .markdown_body table tr:nth-child(2n) {\n  background-color: var(--box-background-alt-color);\n}\nbody .markdown_body blockquote {\n  margin-inline: 0;\n  padding: 0 1em;\n  border-left: 3px solid var(--v2p-color-border);\n  color: var(--v2p-color-font-tertiary);\n}\nbody .markdown_body pre,\nbody .markdown_body pre > .hljs {\n  line-height: 1.5;\n  color: var(--v2p-color-foreground);\n  background-color: var(--v2p-color-bg-block);\n}\nbody .social_label:is(:link, :visited, :active) {\n  border-radius: var(--box-border-radius);\n  background-color: var(--v2p-color-button-background);\n  box-shadow: none;\n}\nbody .social_label:is(:link, :visited, :active):hover {\n  background-color: var(--v2p-color-button-background-hover);\n}\nbody .green {\n  color: var(--v2p-color-accent-500);\n}\nbody .message {\n  border: none;\n  color: var(--v2p-color-orange-400);\n  background-color: var(--v2p-color-orange-50);\n}\nbody .balance_area,\nbody a.balance_area:is(:link, :visited) {\n  display: inline-flex;\n  gap: 3px;\n  align-items: center;\n  font-weight: 600;\n  color: var(--v2p-color-foreground);\n  text-shadow: none;\n  background: var(--v2p-color-button-background);\n}\nbody .balance_area:hover,\nbody a.balance_area:is(:link, :visited):hover {\n  background: var(--v2p-color-button-background-hover);\n}\nbody :is(.subtle) {\n  border-left: 3px solid var(--v2p-color-accent-200);\n  background-color: var(--v2p-color-bg-subtle);\n}\nbody :is(.subtle) .topic_content {\n  font-size: 15px;\n}\nbody .onoffswitch label .frame::before {\n  color: #fff;\n  background-color: var(--v2p-color-accent-400);\n}\nbody .onoffswitch label .frame::after {\n  color: var(--v2p-color-font-secondary);\n  background-color: var(--v2p-color-bg-search);\n}\nbody select {\n  padding: 6px 8px;\n  border: 1px solid var(--v2p-color-border);\n  border-radius: var(--v2p-input-radius);\n  color: var(--v2p-color-foreground);\n  background-color: var(--v2p-color-background);\n  cursor: pointer;\n  border-radius: var(--v2p-input-radius);\n  background-color: var(--v2p-color-bg-content);\n}\nbody select:hover {\n  border-color: var(--v2p-color-input-border-focus);\n}\nbody select:focus {\n  border-color: var(--v2p-color-border);\n}\nbody .ml,\nbody .mle,\nbody .mll,\nbody .sl,\nbody .sll,\nbody .sls {\n  padding: 7px 10.5px;\n  border-color: var(--v2p-color-input-border);\n  border-radius: var(--v2p-input-radius);\n  color: var(--v2p-color-foreground);\n  background-color: var(--v2p-color-bg-content);\n}\nbody .ml::placeholder,\nbody .mle::placeholder,\nbody .mll::placeholder,\nbody .sl::placeholder,\nbody .sll::placeholder,\nbody .sls::placeholder {\n  color: var(--v2p-color-font-tertiary);\n}\nbody .ml:focus,\nbody .mle:focus,\nbody .mll:focus,\nbody .sl:focus,\nbody .sll:focus,\nbody .sls:focus {\n  border-color: var(--v2p-color-input-border-focus);\n}\nbody input,\nbody select,\nbody textarea {\n  color: var(--v2p-color-foreground);\n}\nbody .onoffswitch {\n  width: 90px;\n  min-width: 90px;\n  max-width: 90px;\n}\n\n.box .tag::before {\n  color: var(--v2p-color-font-secondary);\n}\n.box .tag:link, .box .tag:visited {\n  border-radius: var(--v2p-button-radius);\n  font-size: 12px;\n  color: var(--v2p-color-font-secondary);\n  background-color: var(--v2p-color-main-100);\n}\n.box .tag > li {\n  opacity: 0.6;\n}\n\n#Top .content {\n  height: 100%;\n}\n#Top .site-nav {\n  height: 100%;\n  padding: 0;\n}\n#Top .tools {\n  display: flex;\n  gap: 8px 14px;\n  align-items: center;\n  justify-content: flex-end;\n  font-size: 14px;\n  font-weight: 400;\n}\n#Top .tools .top {\n  height: 26px;\n  padding: 0 6px;\n  border-radius: var(--v2p-button-radius);\n  line-height: 26px;\n  color: var(--v2p-color-button-foreground);\n  white-space: nowrap;\n}\n#Top .tools .top:hover {\n  color: var(--v2p-color-foreground);\n}\n#Top .tools .top:not(.v2p-hover-btn):hover {\n  background-color: var(--v2p-color-button-background-hover);\n}\n#Top .tools * {\n  margin-left: 0;\n}\n\n#Main .box {\n  overflow: auto;\n}\n#Main .box:not(:has(.cell[id^=r_])) {\n  padding: 0 var(--v2p-spacing-box);\n}\n#Main .box.node-header > .cell {\n  margin: 0 calc(var(--v2p-spacing-box) * -1);\n}\n#Main .box .cell:not([id^=r_]) {\n  padding: var(--v2p-tp-item-x) var(--v2p-tp-item-y);\n}\n#Main .box .cell {\n  background-image: none !important;\n}\n#Main .box .cell_ops {\n  padding: 15px 5px;\n}\n#Main .box:has(form[action="/write"]) .cell:nth-child(1), #Main .box:has(form[action="/write"]) .cell:nth-child(2) {\n  border: none;\n}\n#Main .box:has(form[action="/write"]) .cell:has(#syntax-selector) {\n  padding: 8px 0 !important;\n}\n#Main .box:has(form[action="/write"]) .cell:has(#syntax-selector) .tab-alt-container {\n  gap: 0 8px;\n}\n#Main .box:has(form[action="/write"]) .cell:has(#syntax-selector) .tab-alt {\n  padding: 4px 2px;\n  border-bottom-width: 2px;\n  transition: none;\n}\n#Main .box:has(form[action="/write"]) .cell:has(#syntax-selector) .tab-alt:not(.active):hover {\n  border-color: transparent;\n}\n#Main .box:has(form[action="/write"]) .cell#preview {\n  padding: 2px 5px;\n}\n#Main .topic_buttons {\n  display: flex;\n  flex-wrap: wrap;\n  column-gap: 5px;\n  align-items: center;\n  padding: 8px 0;\n  background: none;\n}\n#Main .topic_buttons .topic_stats {\n  float: none;\n  flex: 1;\n  order: 99;\n  margin-left: 10px;\n  padding: 0 !important;\n  font-size: 12px;\n  text-shadow: none;\n  white-space: nowrap;\n}\n#Main .topic_buttons .topic_thanked {\n  font-size: 12px;\n}\n#Main .topic_buttons a.tb:link {\n  display: flex;\n  flex-direction: row-reverse;\n  column-gap: 5px;\n  align-items: center;\n  padding: 5px;\n  border-radius: var(--v2p-button-radius);\n  text-shadow: none;\n  white-space: nowrap;\n  background: none;\n}\n#Main .topic_buttons a.tb:link:not(.v2p-hover-btn) {\n  color: var(--v2p-color-font-secondary);\n}\n#Main .topic_buttons a.tb:link:hover:not(.v2p-hover-btn) {\n  color: currentColor;\n  background: var(--v2p-color-bg-block);\n}\n#Main .vote:link {\n  border-color: var(--v2p-color-border-darker);\n  border-radius: var(--v2p-button-radius);\n  color: var(--v2p-color-font-tertiary);\n}\n#Main .vote:link:hover {\n  box-shadow: 0 2px 2px var(--v2p-color-main-200);\n}\n#Main .cell .topic-link {\n  color: var(--v2p-color-foreground);\n  text-decoration: none;\n}\n#Main .cell .topic-link:visited {\n  color: var(--v2p-color-link-visited);\n}\n#Main .cell .topic_info {\n  pointer-events: none;\n  user-select: none;\n  position: relative;\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n}\n#Main .cell .topic_info::after {\n  content: "";\n  position: absolute;\n  z-index: 1;\n  inset: 0 0 -6px;\n  background-color: var(--v2p-color-bg-content);\n}\n#Main .cell .topic_info .votes,\n#Main .cell .topic_info .node,\n#Main .cell .topic_info .badges,\n#Main .cell .topic_info strong:first-of-type,\n#Main .cell .topic_info span:first-of-type,\n#Main .cell .topic_info .v2p-topic-actions {\n  pointer-events: auto;\n  position: relative;\n  z-index: 2;\n}\n#Main .cell .topic_info a[href^="/member"] {\n  font-weight: 500;\n  color: var(--v2p-color-font-tertiary);\n  background-color: transparent;\n}\n#Main .cell .count_livid {\n  user-select: none;\n  display: inline-block;\n  padding: 5px 10px;\n  border-radius: var(--v2p-button-radius);\n  font-size: 12px;\n  font-weight: 400;\n  white-space: nowrap;\n  margin-right: 0;\n  color: var(--v2p-color-button-foreground);\n  background-color: var(--v2p-color-bg-block);\n}\n#Main .cell .count_orange {\n  user-select: none;\n  display: inline-block;\n  padding: 5px 10px;\n  border-radius: var(--v2p-button-radius);\n  font-size: 12px;\n  font-weight: 400;\n  white-space: nowrap;\n  font-weight: bold;\n  color: var(--v2p-color-badge);\n  background-color: var(--v2p-color-orange-400);\n}\n#Main .cell .item_title .topic-link {\n  font-size: 15px;\n  font-weight: 500;\n}\n#Main .cell.item tr > td:nth-child(2) {\n  width: 30px;\n}\n#Main .cell[id^=r_] {\n  --bg-reply: var(--v2p-color-bg-content);\n  background-color: var(--bg-reply);\n}\n#Main .cell[id^=r_] .ago {\n  color: var(--v2p-color-font-quaternary);\n}\n#Main .cell[id^=r_] .no {\n  color: var(--v2p-color-cell-num);\n  background-color: transparent;\n}\n#Main #Tabs {\n  user-select: none;\n  position: sticky;\n  z-index: var(--zidx-tabs);\n  top: 0;\n  display: flex;\n  flex-wrap: wrap;\n  gap: 4px 3px;\n  align-items: center;\n  padding: var(--v2p-tp-tabs-pd);\n  border-bottom: 1px solid var(--box-border-color);\n  background-color: var(--v2p-color-bg-content);\n}\n#Main #Tabs .tab_current {\n  margin-right: 0;\n}\n#Main #Tabs .tab {\n  margin: 0;\n}\n#Main #Tabs .tab.v2p-hover-btn::before {\n  inset: 0;\n}\n#Main #SecondaryTabs {\n  padding: 10px;\n  border-radius: var(--v2p-box-radius);\n  background-color: var(--v2p-color-bg-tabs);\n}\n#Main #SecondaryTabs a {\n  color: var(--v2p-color-tabs);\n}\n#Main .topic_content {\n  font-size: 15px;\n  line-height: 1.6;\n}\n#Main .topic_content,\n#Main .reply_content {\n  color: currentColor;\n}\n#Main .topic_content a[href^="/member"],\n#Main .reply_content a[href^="/member"] {\n  color: var(--v2p-color-font-tertiary);\n  text-decoration: underline;\n  text-underline-offset: 0.4ex;\n  background-color: transparent;\n}\n#Main .thank_area {\n  font-size: 12px;\n}\n#Main .tab {\n  user-select: none;\n  border-radius: var(--v2p-button-radius);\n  color: var(--v2p-color-foreground);\n  background-color: transparent;\n}\n#Main .tab:not(.v2p-hover-btn):hover {\n  background-color: var(--v2p-color-bg-block);\n}\n#Main .tab_current {\n  user-select: none;\n  border-radius: var(--v2p-button-radius);\n  color: var(--v2p-color-bg-content);\n  background-color: var(--v2p-color-foreground);\n}\n#Main #reply-box.reply-box-sticky {\n  z-index: var(--zidx-reply-box);\n  bottom: 20px;\n  overflow: visible;\n  margin: 0 -10px;\n  padding: 0 22px;\n  border: none;\n  border-radius: var(--box-border-radius);\n  outline: 2px solid var(--v2p-color-border);\n}\n#Main #reply-box .flex-one-row:last-of-type {\n  flex-direction: row-reverse;\n  gap: 10px;\n  justify-content: flex-start;\n}\n#Main #reply-box .flex-one-row:last-of-type .gray {\n  margin-right: auto;\n}\n#Main #reply-box > .cell {\n  font-size: 12px;\n}\n#Main #reply-box > .cell.flex-one-row {\n  min-height: 45px;\n  padding: 0 10px;\n  border: none;\n}\n#Main #reply-box > .cell.flex-row-end {\n  padding: 12px 10px;\n  border: none;\n}\n#Main #reply-box > .cell:has(form) {\n  padding-top: 0;\n}\n#Main #no-comments-yet {\n  border-color: var(--color-gray);\n  color: var(--color-gray);\n}\n#Main #notifications .cell[id^=n]:hover .node {\n  opacity: 1;\n}\n#Main #notifications .cell[id^=n] .node {\n  opacity: 0;\n}\n#Main #notifications .cell[id^=n] .payload {\n  color: var(--v2p-color-foreground);\n  background-color: var(--v2p-color-bg-block);\n}\n#Main #notifications .cell[id^=n] .payload:has(.embedded_video_wrapper) {\n  min-width: 50%;\n}\n#Main #notifications .cell[id^=n] .topic-link:visited {\n  color: var(--v2p-color-font-quaternary);\n}\n#Main .cell_tabs .cell_tab_current {\n  border-color: var(--v2p-color-foreground);\n  font-weight: bold;\n}\n#Main .cell_tabs .cell_tab {\n  color: var(--v2p-color-foreground);\n}\n#Main .cell_tabs .cell_tab:hover {\n  border-color: var(--v2p-color-border-darker);\n}\n#Main .settings.block .block-stat {\n  padding: var(--v2p-spacing-box);\n  background-color: transparent;\n}\n#Main .settings.privacy .privacy-settings-form > div:nth-of-type(2n) {\n  background-color: transparent;\n}\n\n#Rightbar .cell:has(.light-toggle) {\n  font-size: 13px;\n}\n#Rightbar .box .item_node {\n  border-color: var(--v2p-color-border);\n  border-radius: var(--v2p-button-radius);\n  font-size: 12px;\n  color: var(--v2p-color-font-secondary);\n}\n#Rightbar .box .item_node:hover {\n  box-shadow: var(--v2p-box-shadow);\n}\n#Rightbar a.dark:is(:link, :active, :visited, :hover) {\n  color: var(--v2p-color-font-tertiary);\n}\n#Rightbar a.dark:is(:link, :active, :visited, :hover):hover {\n  color: var(--v2p-color-font-secondary);\n}\n\n#Bottom {\n  position: sticky;\n  top: 100%;\n}\n#Bottom a.dark {\n  font-size: 13px;\n  font-weight: 400;\n}\n#Bottom a.dark:is(:link, :active, :visited, :hover) {\n  color: var(--v2p-color-font-tertiary);\n}\n\n.wwads-cn {\n  border: none !important;\n  box-shadow: none !important;\n}\n\n.box:has(a[href^="/advertise"]) {\n  overflow: hidden;\n  border: none !important;\n  box-shadow: none !important;\n}\n.box:has(a[href^="/advertise"]) .sidebar_compliance {\n  background-color: var(--v2p-color-bg-block);\n}\n\n/* V2EX Polish c8f1b70; Copyright (c) 2023-present LeoKu and contributors.\n * MIT; see licenses/v2ex-polish-MIT.txt. Font overrides removed as requested.\n */\nbody {\n  position: relative;\n}\nbody.v2p-modal-open {\n  overflow: hidden;\n}\nbody.v2p-img-preview-enabled .embedded_image {\n  cursor: zoom-in;\n}\nbody.v2p-img-preview-enabled .embedded_image.v2p-emoji-img {\n  cursor: default;\n}\nbody .button.v2p-prev-btn, body .button.v2p-next-btn {\n  padding: 0 15px;\n}\nbody .button.v2p-btn-loading {\n  pointer-events: none;\n}\nbody #Top a:has(#Logo.v2p-logo) {\n  display: inline-flex;\n  align-items: center;\n}\nbody #Logo.v2p-logo {\n  flex-shrink: 0;\n  width: unset;\n  height: 25px;\n  padding: 0 8px;\n  background-image: none !important;\n}\n\n.v2p-hover-btn {\n  cursor: pointer;\n  user-select: none;\n  position: relative;\n  z-index: 1;\n  margin: 0;\n  text-decoration: none;\n  white-space: nowrap;\n  background: none;\n  background-color: transparent;\n  transition: color 0.2s;\n}\n.v2p-hover-btn::before {\n  content: "";\n  position: absolute;\n  z-index: -1;\n  inset: 0 -5px;\n  transform: scale(0.65);\n  border-radius: var(--v2p-button-radius);\n  opacity: 0;\n  background-color: var(--v2p-color-bg-hover-btn);\n  transition: background-color 0.15s, color 0.15s, transform 0.15s, opacity 0.15s;\n}\n.v2p-hover-btn:hover {\n  text-decoration: none;\n}\n.v2p-hover-btn:hover::before {\n  transform: scale(1);\n  opacity: 1;\n}\n\n.v2p-hover-btn-disabled {\n  pointer-events: none;\n  opacity: 0.8;\n}\n\n.v2p-icon-heart {\n  display: inline-flex;\n  width: 16px;\n  height: 16px;\n  color: var(--v2p-color-heart);\n}\n.v2p-icon-heart svg {\n  fill: var(--v2p-color-heart-fill);\n}\n\n#Main .cell[id^=r] .v2p-auto-hide {\n  overflow: hidden;\n  display: inline-flex;\n  width: 0;\n}\n#Main .cell[id^=r]:has(.v2p-topic-reply-ref) .v2p-member-ref {\n  display: none;\n}\n#Main #reply-box .v2p-reply-preview {\n  font-size: 15px;\n  line-height: 1.6;\n}\n#Main .box .v2p-home-filter-hidden {\n  display: none;\n}\n#Main .box .v2p-home-filter-revealed {\n  opacity: 0.35;\n  transition: opacity 0.15s;\n}\n#Main .box .v2p-home-filter-revealed:hover {\n  opacity: 1;\n}\n#Main .box .v2p-filter-counter.cell {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 4px 10px;\n  font-size: 13px;\n  color: var(--v2p-color-font-secondary);\n  background-color: var(--v2p-color-bg-subtle);\n}\n#Main .box .v2p-filter-counter.cell .v2p-filter-show {\n  cursor: pointer;\n  color: var(--v2p-color-accent-500);\n}\n#Main .box .v2p-filter-counter.cell .v2p-filter-show:hover {\n  text-decoration: underline;\n}\n\n#Main .cell:hover .v2p-topic-preview-btn,\n#Main .cell:hover .v2p-topic-ignore-btn,\n#Rightbar .cell:hover .v2p-topic-preview-btn,\n#Rightbar .cell:hover .v2p-topic-ignore-btn {\n  visibility: visible;\n}\n\n.v2p-checkin-mission-panel {\n  padding: 12px 16px;\n  border-top: 1px solid var(--v2p-color-divider);\n  font-size: 13px;\n  color: var(--v2p-color-foreground);\n  background-color: var(--v2p-color-bg-content);\n}\n.v2p-checkin-mission-panel__content {\n  display: flex;\n  gap: 10px;\n  align-items: flex-start;\n}\n.v2p-checkin-mission-panel__mark {\n  display: inline-flex;\n  flex: 0 0 22px;\n  align-items: center;\n  justify-content: center;\n  height: 22px;\n  border-radius: 999px;\n  font-size: 13px;\n  font-weight: 700;\n  color: var(--v2p-color-accent-700);\n  background-color: var(--v2p-color-accent-100);\n}\n.v2p-checkin-mission-panel__copy {\n  display: flex;\n  flex: 1;\n  flex-direction: column;\n  gap: 2px;\n  min-width: 0;\n}\n.v2p-checkin-mission-panel__title {\n  line-height: 22px;\n}\n.v2p-checkin-mission-panel__description {\n  margin: 0;\n  line-height: 1.55;\n  color: var(--v2p-color-font-secondary);\n}\n.v2p-checkin-mission-panel__detail {\n  font-size: 12px;\n  color: var(--v2p-color-font-tertiary);\n}\n.v2p-checkin-mission-panel__actions {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n  margin-top: 10px;\n  margin-left: 32px;\n}\n.v2p-checkin-mission-panel__button {\n  cursor: pointer;\n  padding: 3px 9px;\n  border: 1px solid var(--v2p-color-border);\n  border-radius: var(--v2p-button-radius);\n  font-size: 12px;\n  line-height: 20px;\n  color: var(--v2p-color-font-secondary);\n  text-decoration: none;\n  background-color: var(--v2p-color-bg-content);\n}\n.v2p-checkin-mission-panel__button:hover {\n  color: var(--v2p-color-foreground);\n  text-decoration: none;\n  background-color: var(--v2p-color-bg-hover-btn);\n}\n.v2p-checkin-mission-panel__button:focus-visible {\n  outline: 2px solid var(--v2p-color-accent-500);\n  outline-offset: 2px;\n}\n.v2p-checkin-mission-panel__button:disabled {\n  cursor: default;\n  opacity: 0.65;\n}\n.v2p-checkin-mission-panel__button[data-action=retry]:disabled {\n  cursor: wait;\n}\n.v2p-checkin-mission-panel__button--primary {\n  border-color: var(--v2p-color-accent-300);\n  color: var(--v2p-color-accent-700);\n  background-color: var(--v2p-color-accent-50);\n}\n.v2p-checkin-mission-panel--success {\n  background-color: var(--v2p-color-accent-50);\n}\n.v2p-checkin-mission-panel--waiting .v2p-checkin-mission-panel__mark {\n  color: var(--v2p-color-orange-400);\n  background-color: var(--v2p-color-orange-100);\n}\n.v2p-checkin-mission-panel--error {\n  background-color: var(--v2p-color-orange-50);\n}\n.v2p-checkin-mission-panel--error .v2p-checkin-mission-panel__mark {\n  color: var(--v2p-color-error);\n  background-color: var(--v2p-color-bg-content);\n}\n.v2p-checkin-mission-panel--muted .v2p-checkin-mission-panel__mark {\n  color: var(--v2p-color-font-tertiary);\n  background-color: var(--v2p-color-bg-block);\n}\n\n#Rightbar .v2p-info-row {\n  display: block;\n  font-size: 12px;\n  color: var(--v2p-color-accent-500);\n  text-align: center;\n}\n#Rightbar .v2p-info-row:hover {\n  text-decoration: none;\n  background-color: var(--v2p-color-accent-50);\n}\n#Rightbar .v2p-info-row.v2p-info-row-muted {\n  color: var(--v2p-color-font-secondary);\n}\n#Rightbar .v2p-info-row.v2p-info-row-muted:hover {\n  background-color: var(--v2p-color-bg-block);\n}\n#Rightbar .v2p-topic-preview-btn {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  height: 20px;\n  font-size: 12px;\n  backdrop-filter: blur(8px);\n  box-shadow: 0 0 0 3px var(--v2p-color-bg-content);\n}\n.v2p-tool-box {\n  position: sticky;\n  z-index: var(--zidx-tools-card);\n  top: var(--v2p-layout-row-gap);\n}\n.v2p-tool-box .v2p-tools {\n  display: grid;\n  grid-auto-rows: auto;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 8px 15px;\n  align-items: center;\n  justify-content: center;\n  font-size: 12px;\n  color: var(--v2p-color-font-secondary);\n}\n\n.v2p-tool {\n  display: inline-flex;\n  gap: 0 5px;\n  align-items: center;\n  padding: 3px 0;\n}\n.v2p-tool:hover {\n  color: var(--v2p-color-button-foreground-hover);\n}\n.v2p-tool .v2p-tool-icon {\n  width: 16px;\n  height: 16px;\n}\n\n#Rightbar .v2p-hot-filter-hidden {\n  display: none;\n}\n#Rightbar .v2p-hot-filter-revealed {\n  opacity: 0.35;\n  transition: opacity 0.15s;\n}\n#Rightbar .v2p-hot-filter-revealed:hover {\n  opacity: 1;\n}\n#Rightbar .v2p-hot-filter-counter {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 6px 10px;\n  font-size: 12px;\n  color: var(--v2p-color-font-tertiary);\n}\n#Rightbar .v2p-hot-filter-counter .v2p-filter-show {\n  cursor: pointer;\n  color: var(--v2p-color-accent-500);\n}\n#Rightbar .v2p-hot-filter-counter .v2p-filter-show:hover {\n  text-decoration: underline;\n}\n\n.v2p-toggle-rightbar-btn {\n  cursor: pointer;\n  position: fixed;\n  z-index: 9999;\n  top: 50%;\n  right: 0;\n  transform: translateY(-50%);\n  display: var(--v2p-rightbar-toggle-display, none);\n  align-items: center;\n  justify-content: center;\n  width: 24px;\n  height: 40px;\n  border-radius: var(--v2p-button-radius) 0 0 var(--v2p-button-radius);\n  background: var(--v2p-color-bg-content);\n  box-shadow: var(--v2p-widget-shadow);\n}\n\n.v2p-toggle-rightbar-icon {\n  width: 16px;\n  height: 16px;\n}\n\n.v2p-topic-actions {\n  display: inline-flex;\n  gap: 2px 10px;\n}\n\n.v2p-topic-preview-btn {\n  cursor: pointer;\n  border: 1px solid var(--v2p-color-border-darker);\n  border-radius: var(--v2p-button-radius);\n  font-size: 13px;\n  color: var(--v2p-color-button-foreground);\n  visibility: hidden;\n  background-color: var(--v2p-color-button-background);\n  outline: none;\n  transition: color 0.25s;\n}\n.v2p-topic-preview-btn:is(:hover, :focus) {\n  color: var(--v2p-color-button-foreground-hover);\n  background-color: var(--v2p-color-button-background-hover);\n}\n.v2p-topic-preview-btn:active {\n  transform: scale(0.95);\n  box-shadow: inset 0 0 3px 1px var(--v2p-color-border-darker);\n  transition: all 0.25s;\n}\n\n.v2p-topic-ignore-btn {\n  cursor: pointer;\n  margin-left: 8px;\n  visibility: hidden;\n}\n\n.v2p-topic-preview {\n  font-size: 15px;\n  line-height: 1.6;\n  padding: var(--v2p-tp-preview-pd);\n}\n.v2p-tpr-loading {\n  --tpr-h: 30px;\n  --tpr-h-p: 22px;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  padding: 25px;\n}\n.v2p-tpr-loading .v2p-tpr {\n  border-radius: var(--v2p-button-radius);\n  background-color: var(--v2p-color-bg-tpr);\n}\n.v2p-tpr-loading .v2p-tpr-info {\n  display: flex;\n  gap: 15px;\n  align-items: center;\n}\n.v2p-tpr-info-avatar {\n  width: var(--tpr-h);\n  height: var(--tpr-h);\n}\n\n.v2p-tpr-info-text {\n  width: 50%;\n  height: var(--tpr-h);\n}\n\n.v2p-tpr-loading .v2p-tpr-content {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  padding: 15px 0 20px;\n}\n.v2p-tpr-loading .v2p-tpr-content .v2p-tpr-content-p {\n  height: var(--tpr-h-p);\n}\n.v2p-tpr-loading .v2p-tpr-cmt {\n  display: flex;\n  gap: 15px;\n  padding-top: 15px;\n  border-top: 1px solid var(--v2p-color-border);\n}\n.v2p-tpr-loading .v2p-tpr-cmt .v2p-tpr-cmt-avatar {\n  width: 50px;\n  height: 50px;\n}\n.v2p-tpr-loading .v2p-tpr-cmt .v2p-tpr-cmt-right {\n  display: flex;\n  flex: 1;\n  flex-direction: column;\n  gap: 10px;\n}\n.v2p-tpr-loading .v2p-tpr-cmt .v2p-tpr-cmt-right .v2p-tpr-cmt-header {\n  width: 50%;\n  height: var(--tpr-h);\n}\n.v2p-tpr-loading .v2p-tpr-cmt .v2p-tpr-cmt-right .v2p-tpr-cmt-p {\n  height: var(--tpr-h-p);\n}\n\n.v2p-tp-info-bar {\n  display: flex;\n  gap: 10px;\n  align-items: center;\n  margin-bottom: 10px;\n}\n\n.v2p-tp-info,\n.v2p-tp-read {\n  overflow: hidden;\n  display: inline-flex;\n  gap: 20px;\n  align-items: center;\n  padding: 5px 10px;\n  border-radius: var(--v2p-button-radius);\n  font-size: 13px;\n  background-color: var(--v2p-color-button-background);\n}\n\n.v2p-tp-read {\n  cursor: pointer;\n  user-select: none;\n  gap: 4px;\n}\n.v2p-tp-read:hover {\n  background-color: var(--v2p-color-button-background-hover);\n}\n\n.v2p-tp-read-icon {\n  width: 16px;\n  height: 16px;\n}\n\n.v2p-tp-member {\n  display: inline-flex;\n  gap: 5px;\n  align-items: center;\n  font-weight: bold;\n}\n\n.v2p-tp-avatar {\n  width: 20px;\n  height: 20px;\n  border-radius: var(--v2p-box-radius);\n  background-color: var(--v2p-color-bg-avatar);\n}\n\n.v2p-topic-preview-addons {\n  margin-top: 30px;\n}\n\n#Main.v2p-topic-preview > .box {\n  border: 1px solid var(--v2p-color-border);\n}\n\na.v2p-topic-preview-title-link:hover {\n  text-decoration: underline 1.5px;\n  text-underline-offset: 0.46ex;\n}\n\n.v2p-dot {\n  margin: 0 8px;\n  font-size: 15px;\n  font-weight: 800;\n}\n\n.v2p-paging {\n  background: none !important;\n}\n.v2p-paging.cell {\n  border-bottom: none;\n}\n\n.v2p-modal-mask {\n  position: fixed;\n  z-index: var(--zidx-modal-mask);\n  inset: 0;\n  overflow: hidden;\n  overflow-y: auto;\n  padding: min(2vh, 60px);\n  background-color: var(--v2p-color-mask);\n}\n\n.v2p-popup {\n  border: 1px solid var(--box-border-color);\n  border-radius: var(--v2p-popup-radius);\n  font-size: 14px;\n  background: var(--v2p-color-bg-widget);\n  backdrop-filter: blur(16px);\n  box-shadow: var(--v2p-widget-shadow);\n  position: absolute;\n  z-index: var(--zidx-popup);\n  top: 0;\n  left: 0;\n}\n\n.v2p-popup-content {\n  overflow-y: auto;\n  width: max-content;\n}\n\n.v2p-toast {\n  position: fixed;\n  z-index: var(--zidx-toast);\n  top: 50px;\n  left: 50%;\n  transform: translateX(-50%);\n  padding: 10px 15px;\n  border-radius: var(--v2p-popup-radius);\n  font-size: 14px;\n  color: var(--v2p-color-background);\n  background: var(--v2p-color-foreground);\n  box-shadow: var(--v2p-toast-shadow);\n}\n\n.v2p-modal-main {\n  position: relative;\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n  box-sizing: border-box;\n  width: clamp(450px, 100%, 800px);\n  height: 100%;\n  margin: 0 auto;\n  border-radius: var(--box-border-radius);\n  background-color: var(--v2p-color-bg-content);\n  outline: none;\n}\n.v2p-modal-header {\n  display: flex;\n  gap: 5px 15px;\n  align-items: center;\n  padding: 15px;\n  border-bottom: 1px solid var(--box-border-color);\n  background-color: var(--v2p-color-bg-content);\n}\n\n.v2p-modal-footer {\n  display: flex;\n  gap: 5px 15px;\n  align-items: center;\n  justify-content: flex-end;\n  padding: 15px;\n  border-top: 1px solid var(--box-border-color);\n  background-color: var(--v2p-color-bg-content);\n}\n\n.v2p-modal-title {\n  overflow: hidden;\n  padding: 2px 0;\n  font-size: 16px;\n  font-weight: bold;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.v2p-modal-actions {\n  display: flex;\n  gap: 0 10px;\n  align-items: center;\n  margin-left: auto;\n}\n\n.v2p-modal-content {\n  position: relative;\n  overflow-y: auto;\n  overscroll-behavior-y: contain;\n  flex: 1;\n  outline: none;\n}\n.v2p-modal-content #Main.v2p-topic-preview > .box {\n  border: none;\n  box-shadow: none;\n}\n\n.v2p-modal-comments {\n  position: absolute;\n  inset: 0;\n  overflow-y: auto;\n  padding: 0 20px;\n  visibility: hidden;\n}\n.v2p-modal-comments.v2p-tab-content-active {\n  z-index: 20;\n  visibility: visible;\n}\n\n.v2p-modal-comment-tabs {\n  display: flex;\n  gap: 4px;\n  align-items: center;\n  padding: 4px 5px;\n  border-radius: var(--v2p-button-radius);\n  font-size: 14px;\n  font-weight: normal;\n  background-color: var(--button-background-color);\n}\n.v2p-modal-comment-tabs > [data-tab-key] {\n  cursor: pointer;\n  padding: 4px 5px;\n  border-radius: var(--v2p-button-radius);\n}\n.v2p-modal-comment-tabs > [data-tab-key]:hover {\n  background-color: var(--v2p-color-button-background-hover);\n}\n.v2p-modal-comment-tabs > [data-tab-key].v2p-tab-active {\n  color: var(--v2p-color-foreground);\n  background-color: var(--v2p-color-accent-100);\n}\n\n.v2p-no-pat {\n  padding: 30px 20px;\n  font-size: 15px;\n  text-align: center;\n}\n.v2p-no-pat .v2p-no-pat-title {\n  font-size: 16px;\n  font-weight: bold;\n}\n.v2p-no-pat .v2p-no-pat-desc {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin-top: 15px;\n}\n.v2p-no-pat .v2p-no-pat-block {\n  display: inline-flex;\n  align-items: center;\n  margin: 0 5px;\n  padding: 2px 10px;\n  border-radius: var(--v2p-box-radius);\n  background-color: var(--v2p-color-bg-block);\n}\n.v2p-no-pat .v2p-no-pat-steps {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 20px;\n  max-width: 800px;\n  margin-top: 20px;\n  padding: 20px;\n  border-radius: var(--v2p-box-radius);\n  background-color: var(--v2p-color-bg-block);\n}\n.v2p-no-pat .v2p-no-pat-step {\n  flex: 1;\n}\n.v2p-no-pat .v2p-no-pat-img {\n  width: 100%;\n  border-radius: var(--v2p-box-radius);\n  box-shadow: var(--v2p-widget-shadow);\n}\n.v2p-no-pat .v2p-icon-logo {\n  width: 15px;\n  height: 15px;\n}\n\n.v2p-blocked-reply:not(.v2p-blocked-revealed) > table,\n.v2p-blocked-reply-empty:not(.v2p-blocked-revealed),\n.v2p-ignored-reply:not(.v2p-ignored-revealed) > table {\n  display: none;\n}\n\n.v2p-ignored-reply.v2p-ignored-revealed > .v2p-ignored-placeholder {\n  display: none;\n}\n\n.v2p-ignored-placeholder {\n  padding: 8px 10px;\n  font-size: 12px;\n  color: var(--v2p-color-font-tertiary);\n  text-align: center;\n}\n.v2p-ignored-placeholder .v2p-ignored-toggle {\n  cursor: pointer;\n  color: var(--v2p-color-accent-500);\n}\n.v2p-ignored-placeholder .v2p-ignored-toggle:focus-visible {\n  outline: 2px solid var(--v2p-color-accent-500);\n  outline-offset: 2px;\n}\n\n.v2p-blocked-notice {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n  align-items: center;\n  justify-content: center;\n  padding: 6px 10px;\n  font-size: 12px;\n  color: var(--v2p-color-font-tertiary);\n  background-color: var(--v2p-color-bg-subtle);\n}\n.v2p-blocked-notice .v2p-blocked-toggle {\n  cursor: pointer;\n  color: var(--v2p-color-accent-500);\n}\n.v2p-blocked-notice .v2p-blocked-toggle:focus-visible {\n  outline: 2px solid var(--v2p-color-accent-500);\n  outline-offset: 2px;\n}\n\n.v2p-likes-box {\n  user-select: none;\n  position: relative;\n  top: 3px;\n  display: inline-flex;\n  column-gap: 5px;\n  align-items: center;\n}\n.v2p-likes-box.v2p-thanked {\n  font-weight: bold;\n  color: var(--v2p-color-heart);\n  opacity: 0.8;\n}\n.v2p-likes-box.v2p-thanked .v2p-icon-heart svg {\n  fill: var(--v2p-color-heart);\n}\n\n@supports not selector(:has(*)) {\n  #Main .cell[id^=r] > table:hover .v2p-controls {\n    opacity: 1;\n  }\n}\n@supports selector(:has(*)) {\n  #Main .cell[id^=r]:not(:has(.cell:hover)) > table:hover .v2p-auto-hide {\n    width: auto;\n  }\n  #Main .cell[id^=r]:not(:has(.cell:hover)) > table:hover .v2p-controls {\n    opacity: 1;\n  }\n}\n.v2p-controls {\n  display: inline-flex;\n  column-gap: 15px;\n  align-items: center;\n  margin-right: 15px;\n  font-size: 12px;\n  opacity: 0;\n}\n.v2p-controls > a {\n  text-decoration: none;\n}\n.v2p-control {\n  position: relative;\n  z-index: var(--zidx-popup);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 16px;\n  height: 16px;\n  padding: 4px 0;\n  color: var(--v2p-color-font-tertiary);\n}\n.v2p-control::after {\n  pointer-events: none;\n  z-index: var(--zidx-tip);\n  overflow: hidden;\n  width: max-content;\n  min-width: 30px;\n  padding: 2px 5px;\n  border-radius: var(--v2p-popup-radius);\n  font-size: 12px;\n  color: var(--v2p-color-foreground);\n  text-align: center;\n  white-space: nowrap;\n  background-color: var(--v2p-color-bg-tooltip);\n  box-shadow: var(--v2p-widget-shadow);\n  position: absolute;\n  z-index: var(--zidx-tip);\n  top: -8px;\n  transform: translateY(-100%);\n  opacity: 0;\n  background-color: var(--v2p-color-bg-tooltip);\n}\n.v2p-control:hover {\n  color: var(--v2p-color-font-secondary);\n}\n.v2p-control.v2p-thanked {\n  cursor: default;\n  color: var(--v2p-color-heart);\n}\n.v2p-control.v2p-thank-pending, .v2p-control.v2p-ignore-pending {\n  cursor: wait;\n  opacity: 0.6;\n}\n.v2p-control:focus-visible {\n  border-radius: 2px;\n  outline: 2px solid var(--v2p-color-heart);\n  outline-offset: 2px;\n}\n.v2p-control:hover::after {\n  opacity: 1;\n}\n.v2p-control.v2p-control-hide::after {\n  content: "\u9690\u85CF\u56DE\u590D";\n}\n\n.v2p-control.v2p-control-thank::after {\n  content: "\u611F\u8C22\u56DE\u590D";\n}\n.v2p-control.v2p-control-thank.v2p-thanked::after {\n  content: "\u5DF2\u611F\u8C22";\n}\n\n.v2p-control.v2p-control-reply::after {\n  content: "\u56DE\u590D";\n}\n\n@media (hover: none) {\n  .v2p-controls {\n    opacity: 1;\n  }\n}\n.topic_buttons .v2p-tb.v2p-hover-btn {\n  color: var(--v2p-color-font-secondary);\n}\n.topic_buttons .v2p-tb.v2p-hover-btn::after {\n  display: none;\n}\n.topic_buttons .v2p-tb.v2p-hover-btn:hover {\n  color: currentColor;\n}\n\n.v2p-tb-icon {\n  width: 15px;\n  height: 15px;\n}\n\n.v2p-emoji-container {\n  overflow-y: auto;\n  max-height: 285px;\n  padding: 15px 18px;\n  color: var(--v2p-color-font-secondary);\n}\n\n.v2p-member-card {\n  --v2p-card-spacing: 10px;\n  max-width: 320px;\n  max-height: 420px;\n  padding: 12px;\n  font-size: 13px;\n  text-align: left;\n}\n.v2p-member-card .v2p-info {\n  display: flex;\n  gap: 15px;\n}\n.v2p-member-card .v2p-info-right {\n  padding: 2px 0;\n}\n.v2p-member-card .v2p-avatar-box {\n  overflow: hidden;\n  display: inline-block;\n  width: 73px;\n  height: 73px;\n  border-radius: var(--v2p-box-radius);\n  background-color: var(--button-background-hover-color);\n}\n.v2p-member-card .v2p-avatar {\n  width: 100%;\n  height: 100%;\n}\n.v2p-member-card .v2p-username {\n  font-size: 16px;\n  font-weight: bold;\n}\n.v2p-member-card .v2p-no {\n  margin: 5px 0;\n}\n.v2p-member-card .v2p-no,\n.v2p-member-card .v2p-created-date {\n  width: 160px;\n  height: 16px;\n}\n.v2p-member-card .v2p-loading {\n  border-radius: var(--v2p-button-radius);\n  background-color: var(--button-background-hover-color);\n}\n.v2p-member-card .v2p-bio {\n  overflow: hidden;\n  display: -webkit-box;\n  -webkit-box-orient: vertical;\n  -webkit-line-clamp: 3;\n  line-height: 1.4;\n  padding-top: var(--v2p-card-spacing);\n}\n\n.v2p-member-card-actions {\n  display: flex;\n  gap: 6px;\n  align-items: center;\n  padding: var(--v2p-card-spacing) 0 0;\n}\n\n.v2p-member-topics {\n  margin-top: var(--v2p-card-spacing);\n  padding-top: var(--v2p-card-spacing);\n  border-top: 1px solid var(--box-border-color);\n}\n\n.v2p-member-topics-header {\n  margin-bottom: 8px;\n  font-size: 12px;\n  font-weight: 500;\n  color: var(--v2p-color-font-secondary);\n}\n\n.v2p-member-topics-list {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n\n.v2p-member-topic-item-row {\n  display: flex;\n  gap: 4px;\n  align-items: center;\n}\n.v2p-member-topic-item-row .v2p-topic-preview-btn {\n  max-width: 0;\n  height: 19px;\n  max-height: 0;\n  padding: 0 4px;\n  font-size: 12px;\n  visibility: hidden;\n}\n.v2p-member-topic-item-row:hover .v2p-topic-preview-btn {\n  max-width: unset;\n  max-height: unset;\n  visibility: visible;\n}\n\n.v2p-member-topic-item {\n  overflow: hidden;\n  flex: 1;\n  min-width: 0;\n  padding-left: 2px;\n  border-radius: var(--v2p-button-radius);\n  font-size: 13px;\n  line-height: 1.5;\n  color: var(--v2p-color-font-primary);\n  text-decoration: none;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.v2p-member-topic-item::before {\n  content: "\u25B8";\n  margin-right: 4px;\n  color: var(--v2p-color-font-tertiary);\n}\n.v2p-member-topic-item:hover {\n  text-decoration: none;\n  background-color: var(--v2p-color-bg-link-hover);\n}\n\n.v2p-reply-tags {\n  cursor: pointer;\n  display: inline-flex;\n  margin: 0 0 2px;\n  padding: 0 3px;\n  border-radius: var(--v2p-button-radius);\n  font-size: 12px;\n  background-color: var(--button-background-hover-color);\n}\n\n.v2p-reply-tags-inline {\n  overflow: hidden;\n  max-width: 300px;\n  margin: 0 5px 0 0;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.v2p-emoticons-box {\n  font-size: 15px;\n}\n\n.v2p-emoji-group ~ .v2p-emoji-group {\n  margin-top: 10px;\n}\n\n.v2p-emoji-title {\n  margin: 0 0 10px;\n  font-size: 14px;\n  text-align: left;\n}\n\n.v2p-emoji-list {\n  display: grid;\n  grid-template-columns: repeat(8, 1fr);\n  gap: 5px;\n  font-size: 20px;\n}\n\n.v2p-emoji {\n  cursor: pointer;\n  height: 20px;\n  padding: 3px;\n  border-radius: var(--v2p-button-radius);\n  line-height: 20px;\n}\n.v2p-emoji:hover {\n  background-color: var(--box-background-hover-color);\n}\n.v2p-emoji > img {\n  height: 100%;\n}\n\n.v2p-decode {\n  cursor: copy;\n  position: relative;\n  padding: 2px 4px;\n  font-size: 13px;\n  color: var(--v2p-color-orange-400);\n  text-decoration: none;\n  background-color: var(--v2p-color-orange-50);\n}\n.v2p-decode::after {\n  pointer-events: none;\n  z-index: var(--zidx-tip);\n  overflow: hidden;\n  width: max-content;\n  min-width: 30px;\n  padding: 2px 5px;\n  border-radius: var(--v2p-popup-radius);\n  font-size: 12px;\n  color: var(--v2p-color-foreground);\n  text-align: center;\n  white-space: nowrap;\n  background-color: var(--v2p-color-bg-tooltip);\n  box-shadow: var(--v2p-widget-shadow);\n  content: attr(data-title);\n  position: absolute;\n  top: -8px;\n  left: 50%;\n  transform: translate(-50%, -100%);\n  opacity: 0;\n  background-color: var(--v2p-color-bg-tooltip);\n}\n.v2p-decode:hover {\n  color: var(--v2p-color-orange-400);\n}\n.v2p-decode:hover::after {\n  opacity: 1;\n}\n\n.v2p-reply-content {\n  position: relative;\n}\n.v2p-reply-content .v2p-expand-btn.normal.button {\n  position: absolute;\n  z-index: var(--zidx-expand-btn);\n  bottom: 5px;\n  left: 50%;\n  transform: translateX(-50%);\n  font-size: 12px;\n  font-weight: 400;\n}\n.v2p-reply-content.v2p-collapsed {\n  overflow: hidden;\n  max-height: 250px;\n  padding-bottom: 0;\n}\n.v2p-reply-content.v2p-collapsed::before {\n  pointer-events: none;\n  content: "";\n  position: absolute;\n  z-index: var(--zidx-expand-mask);\n  right: 0;\n  bottom: 0;\n  left: 0;\n  height: 130px;\n  background: linear-gradient(to top, var(--bg-reply) 10px, transparent);\n}\n.v2p-reply-content.v2p-collapsed .reply_content a,\n.v2p-reply-content.v2p-collapsed .reply_content .embedded_video {\n  pointer-events: none;\n}\n.v2p-reply-content.v2p-collapsed .v2p-expand-btn.normal.button {\n  bottom: 10px;\n  transform: translateX(-50%);\n}\n.v2p-reply-content:not(.v2p-collapsed) {\n  overflow: auto;\n  max-height: none;\n  padding-bottom: 40px;\n}\n\n.cell[id^=r] .cell[id^=r] .v2p-reply-content .v2p-expand-btn.normal.button {\n  color: var(--v2p-color-button-foreground);\n  background: var(--v2p-color-button-background-hover);\n  box-shadow: var(--button-hover-shadow);\n}\n\n.v2p-empty-content {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  padding-top: 20px;\n  font-size: 14px;\n  color: var(--v2p-color-font-secondary);\n}\n.v2p-empty-content .v2p-text-emoji {\n  font-size: 20px;\n}\n\n.v2p-topic-reply-ref {\n  margin: 0 -10px 15px;\n  padding: 5px 10px;\n  border-radius: var(--v2p-box-radius);\n  font-size: 13px;\n  color: var(--v2p-color-font-tertiary);\n  background-color: var(--v2p-color-bg-block);\n}\n\n.v2p-topic-reply-box {\n  margin-top: 50px;\n  padding: 30px 0;\n  border-top: 1px solid var(--v2p-color-divider);\n  font-size: 14px;\n  line-height: 1.55;\n  color: var(--v2p-color-font-secondary);\n}\n.v2p-topic-reply ~ .v2p-topic-reply {\n  margin-top: 15px;\n}\n.v2p-topic-reply-member {\n  display: inline;\n  font-weight: bold;\n  color: var(--v2p-color-main-700);\n}\n\n.v2p-topic-reply-avatar {\n  position: relative;\n  top: 2px;\n  overflow: hidden;\n  width: 15px;\n  height: 15px;\n  margin-right: 5px;\n  border-radius: var(--v2p-box-radius);\n  object-fit: cover;\n  background-color: var(--v2p-color-bg-avatar);\n}\n\n.v2p-topic-reply-content {\n  display: inline;\n}\n\n.v2p-topic-reply-tip {\n  margin-top: 20px;\n  font-size: 13px;\n  color: var(--v2p-color-font-quaternary);\n  text-align: center;\n}\n\n.v2p-reply-wrap {\n  resize: none;\n  overflow: hidden;\n  height: unset;\n  min-height: 140px !important;\n  max-height: 800px !important;\n  border: 1px solid var(--button-border-color);\n  border-radius: var(--v2p-input-radius);\n  font-size: 15px;\n  color: currentColor;\n  background-color: var(--v2p-color-bg-input);\n  transition: opacity 0.25s;\n}\n.v2p-reply-wrap::placeholder {\n  font-size: 15px;\n  color: var(--v2p-color-font-tertiary);\n}\n.v2p-reply-wrap:is(:focus, :focus-within) {\n  border-color: var(--button-border-hover-color);\n  background-color: transparent;\n  outline: none;\n  box-shadow: none;\n}\n.v2p-reply-wrap #reply_content {\n  border: none;\n  background-color: transparent;\n}\n.v2p-reply-wrap #reply_content::placeholder {\n  font-size: 14px;\n  color: var(--v2p-color-font-tertiary);\n}\n.v2p-reply-wrap #reply_content:focus {\n  background-color: var(--v2p-color-bg-content);\n  outline: none;\n}\n\n.v2p-reply-upload-bar {\n  cursor: pointer;\n  padding: 6px 10px;\n  border-top: 1px dashed var(--v2p-color-border-darker);\n  font-size: 12px;\n  color: var(--v2p-color-font-tertiary);\n  background-color: var(--v2p-color-bg-input);\n}\n\n.v2p-reply-upload-bar-disabled {\n  pointer-events: none;\n}\n\n.v2p-footer {\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 35px 10px 20px;\n  border-top: 1px solid var(--v2p-color-divider);\n  font-size: 12px;\n  color: var(--v2p-color-font-tertiary);\n}\n.v2p-footer a:hover {\n  text-decoration: none;\n}\n\n.v2p-footer-logo {\n  --logo-size: 16px;\n  position: absolute;\n  top: calc(-1 * (var(--logo-size) + 5px) / 2);\n  left: 50%;\n  transform: translateX(-50%);\n  display: inline-flex;\n  box-sizing: border-box;\n  padding: 3px 25px;\n  background-color: var(--v2p-color-bg-footer);\n}\n.v2p-footer-logo svg {\n  width: var(--logo-size);\n}\n\n.v2p-footer-text {\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-start;\n  width: 240px;\n  color: var(--v2p-color-font-secondary);\n}\n\n.v2p-footer-links {\n  display: inline-flex;\n  gap: 0 8px;\n  align-items: center;\n}\n\n.v2p-footer-link {\n  padding: 4px 5px;\n  color: currentColor;\n}\n\n.v2p-footer-brand {\n  display: inline-flex;\n  gap: 0 15px;\n  align-items: center;\n  justify-content: flex-end;\n  width: 240px;\n}\n.v2p-footer-brand .v2p-github-ref {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 20px;\n  height: 20px;\n  padding: 2px 0;\n}\n\n.v2p-color-mode-toggle {\n  width: 22px;\n  height: 22px;\n  opacity: 0.8;\n}\n.v2p-color-mode-toggle:hover {\n  opacity: 1;\n}\n\n.v2p-reply-tabs {\n  display: flex;\n  gap: 0 6px;\n  align-items: center;\n  font-size: 14px;\n}\n.v2p-reply-tabs .v2p-reply-tab {\n  cursor: pointer;\n  padding: 2px 3px;\n}\n.v2p-reply-tabs .v2p-reply-tab.active {\n  text-decoration: underline;\n  text-decoration-color: var(--v2p-color-font-tertiary);\n  text-decoration-thickness: 2px;\n  text-underline-offset: 4px;\n}\n\n.v2p-select-dropdown {\n  display: flex;\n  flex-direction: column;\n  gap: 1px;\n  padding: 5px;\n  border-radius: var(--v2p-popup-radius);\n  font-size: 12px;\n  text-align: left;\n}\n.v2p-select-item {\n  cursor: pointer;\n  padding: 5px 10px;\n  border-radius: var(--v2p-button-radius);\n  white-space: nowrap;\n}\n.v2p-select-item:hover {\n  background-color: var(--v2p-color-button-background-hover);\n}\n.v2p-select-item.v2p-select-item-active {\n  background-color: var(--v2p-color-accent-50);\n}\n\n.v2p-select-divider {\n  pointer-events: none;\n  height: 1px;\n  margin: 5px 0;\n  background-color: var(--v2p-color-border);\n}\n\n.v2p-preview-retry,\n.v2p-topic-preview-retry,\na.v2p-preview-retry,\na.v2p-topic-preview-retry,\na:link.v2p-preview-retry,\na:link.v2p-topic-preview-retry {\n  text-decoration: underline 1px;\n  text-underline-offset: var(--v2p-underline-offset);\n  cursor: pointer;\n}\n\n.v2p-indent .v2p-member-ref {\n  display: none;\n}\n\n.v2p-member-ref + br {\n  display: none;\n}\n.v2p-member-ref + br + b {\n  display: none;\n}\n.v2p-member-ref.v2p-member-ref-show {\n  display: inline !important;\n}\n\n.v2p-layout-toggle {\n  display: inline-block;\n  width: 18px;\n  height: 18px;\n  padding: 4px 2px;\n  color: var(--v2p-color-font-tertiary);\n}\n\n.v2p-content-layout.v2p-content-layout.content {\n  --v2p-content-width: 2000px;\n}\n.v2p-content-layout.v2p-content-layout.content #Main.v2p-horizontal-layout {\n  display: flex;\n  flex-wrap: wrap;\n  gap: var(--v2p-layout-column-gap);\n  max-width: unset;\n}\n.v2p-left-side {\n  flex: 1;\n  min-width: 0;\n}\n.v2p-left-side > .v2p-left-group {\n  position: sticky;\n  z-index: var(--zidx-reply-box);\n  top: 0;\n  display: flex;\n  flex-direction: column;\n  max-height: calc(100vh - var(--v2p-nav-height) - var(--v2p-layout-row-gap));\n}\n.v2p-left-side > .v2p-left-group .sep,\n.v2p-left-side > .v2p-left-group .sep20,\n.v2p-left-side > .v2p-left-group > #topic-tip-box {\n  flex-shrink: 0;\n}\n.v2p-left-side > .v2p-left-group > .box:has(.topic_buttons) {\n  display: flex;\n  flex: 1;\n  flex-direction: column;\n  min-height: 0;\n}\n.v2p-left-side > .v2p-left-group > .box:has(.topic_buttons) > .header {\n  flex-shrink: 0;\n}\n.v2p-left-side .v2p-left-side-content {\n  overflow: auto;\n  flex: 1;\n  margin-right: calc(var(--v2p-spacing-box) * -1);\n  padding-right: var(--v2p-spacing-box);\n  border-bottom: 1px solid var(--box-border-color);\n}\n\n.v2p-right-side {\n  flex: 1;\n  min-width: 0;\n}\n\n.v2p-register-days {\n  display: inline-flex;\n  align-items: center;\n  margin-left: 2px;\n  padding: 0 2px;\n  border-radius: var(--v2p-button-radius);\n  color: var(--v2p-color-orange-400);\n  background-color: var(--v2p-color-orange-100);\n}\n.v2p-register-days.v2p-register-days-large {\n  display: inline-flex;\n  margin-left: 10px;\n  padding: 2px 5px;\n  border-radius: var(--v2p-button-radius);\n  font-size: 16px;\n  line-height: 1.4;\n}\n\n.v2p-topics-hot-loading {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 50px 0;\n  color: currentColor;\n}\n.v2p-topics-hot-loading .v2p-icon-loading {\n  width: 40px;\n}\n\n.v2p-topics-hot-empty {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  min-height: 84px;\n  margin: 12px 10px 10px;\n  padding: 18px 16px;\n  border: 1px dashed var(--v2p-color-divider);\n  border-radius: var(--v2p-input-radius);\n  font-size: 13px;\n  line-height: 1.6;\n  color: var(--v2p-color-font-tertiary);\n  text-align: center;\n  background-color: var(--v2p-color-bg-subtle);\n}\n\n.v2p-topics-hot-header {\n  display: flex;\n  align-items: center;\n}\n\n.v2p-topics-hot-picker {\n  cursor: pointer;\n  display: inline-flex;\n  gap: 4px;\n  align-items: center;\n  margin-left: auto;\n  padding: 1px 6px;\n  border-radius: var(--v2p-button-radius);\n  font-size: 13px;\n  background-color: var(--v2p-color-button-background);\n}\n.v2p-topics-hot-picker:hover {\n  background-color: var(--v2p-color-button-background-hover);\n}\n.v2p-topics-hot-icon {\n  position: relative;\n  top: -2px;\n  width: 1em;\n  height: 1em;\n}\n\n.v2p-tag-block {\n  margin-bottom: 10px;\n}\n\n@supports (filter: blur(6px)) {\n  .v2p-hide-account {\n    opacity: 0.5;\n    filter: blur(6px);\n  }\n}\n@supports not (filter: blur(6px)) {\n  .v2p-hide-account {\n    opacity: 0;\n  }\n}\n\n@supports (filter: blur(6px)) {\n  .v2p-hide-balance {\n    opacity: 0.5;\n    filter: blur(6px);\n  }\n  .v2p-hide-balance:hover {\n    opacity: 1;\n    filter: none;\n  }\n}\n@supports not (filter: blur(6px)) {\n  .v2p-hide-balance {\n    opacity: 0;\n  }\n  .v2p-hide-balance:hover {\n    opacity: 1;\n  }\n}\n\n.v2p-member-name {\n  display: flex;\n  align-items: center;\n}\n\n.v2p-settings-header.page-content-header {\n  gap: 10px;\n}\n.v2p-settings-header.page-content-header .v2p-settings-icon {\n  width: 40px;\n  height: 40px;\n  margin: 0;\n}\n.v2p-settings-header.page-content-header .v2p-settings-title {\n  padding: 0;\n  white-space: nowrap;\n}\n.v2p-settings-header.page-content-header .v2p-settings-actions {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: flex-end;\n}\n\n.v2p-link-preview-btn {\n  cursor: pointer;\n  user-select: none;\n  display: inline-flex;\n  height: 100%;\n  margin-left: 5px;\n  padding: 0 5px;\n  border-radius: var(--v2p-button-radius);\n  font-size: 12px;\n  color: var(--v2p-color-bg-content);\n  background-color: var(--v2p-color-accent-500);\n}\n.v2p-link-preview-btn:hover {\n  background-color: var(--v2p-color-accent-600);\n}\n\n#node_sidebar.v2p-node-sidebar-flamewar {\n  border: 1px solid var(--v2p-color-orange-400);\n  border-radius: var(--v2p-box-radius);\n  background-color: var(--v2p-color-orange-50);\n}\n\n.v2p-topic-preview-frame {\n  width: 100%;\n  height: 100%;\n  border: none;\n}\n\n.v2p-topic-preview-wrapper {\n  overflow: hidden;\n  width: 100%;\n  height: 100%;\n}\n\n.v2p-sync-dialog-main.v2p-modal-main {\n  height: auto;\n}\n.v2p-sync-dialog-main.v2p-modal-main .v2p-modal-content {\n  padding: var(--v2p-spacing-box);\n}\n.v2p-sync-dialog-message {\n  margin: 0 0 var(--v2p-spacing-cell);\n  font-size: 15px;\n  font-weight: 500;\n  line-height: 1.6;\n  color: var(--v2p-color-foreground);\n}\n\n.v2p-sync-dialog-message-sub {\n  margin: 0 0 calc(var(--v2p-spacing-cell) * 0.75);\n  padding: calc(var(--v2p-spacing-cell) * 0.75) var(--v2p-spacing-cell);\n  border-radius: var(--v2p-input-radius);\n  font-size: 14px;\n  line-height: 1.6;\n  color: var(--v2p-color-font-secondary);\n  background-color: var(--v2p-color-bg-input);\n}\n.v2p-sync-dialog-message-sub strong {\n  font-weight: 600;\n  color: var(--v2p-color-foreground);\n}\n\n.v2p-sync-dialog-message-question {\n  margin: calc(var(--v2p-spacing-cell) * 1.25) 0 var(--v2p-spacing-cell);\n  font-size: 15px;\n  font-weight: 500;\n  line-height: 1.6;\n  color: var(--v2p-color-foreground);\n}\n\n.v2p-sync-dialog-message-tip {\n  margin: calc(var(--v2p-spacing-cell) * 0.5) 0 0;\n  padding: calc(var(--v2p-spacing-cell) * 0.5) var(--v2p-spacing-cell);\n  border-radius: var(--v2p-input-radius);\n  font-size: 13px;\n  line-height: 1.5;\n  color: var(--v2p-color-font-tertiary);\n  background-color: var(--v2p-color-bg-subtle);\n}\n\n.v2p-modal-footer .v2p-sync-skip-btn,\n.v2p-modal-footer .v2p-sync-confirm-btn {\n  height: 32px;\n  padding: 0 16px;\n  font-size: 14px;\n}\n.v2p-modal-footer .v2p-sync-confirm-btn {\n  font-weight: 600;\n}\n\n/* V2EX Polish c8f1b70; Copyright (c) 2023-present LeoKu and contributors.\n * MIT; see licenses/v2ex-polish-MIT.txt. Font overrides removed as requested.\n */\nbody.v2p-theme-minimalist,\n.v2p-theme-minimalist,\n:root[data-v2p-theme=minimalist],\n:root[data-v2p-theme=minimalist] body {\n  --v2p-color-accent-50: oklch(97.9% 0.021 166.113deg);\n  --v2p-color-accent-100: oklch(95% 0.052 163.051deg);\n  --v2p-color-accent-200: oklch(90.5% 0.093 164.15deg);\n  --v2p-color-accent-300: oklch(84.5% 0.143 164.978deg);\n  --v2p-color-accent-400: oklch(76.5% 0.177 163.223deg);\n  --v2p-color-accent-500: oklch(69.6% 0.17 162.48deg);\n  --v2p-color-accent-600: oklch(59.6% 0.145 163.225deg);\n  --v2p-color-accent-700: oklch(50.8% 0.118 165.612deg);\n  --v2p-color-orange-50: #fff7ed;\n  --v2p-color-orange-100: #ffedd5;\n  --v2p-color-orange-400: #fb923c;\n  --v2p-color-background: oklch(97.6% 0.005 253deg);\n  --v2p-color-foreground: oklch(28.2% 0.091 267.935deg);\n  --v2p-color-selection-foreground: currentColor;\n  --v2p-color-selection-background: oklch(93.2% 0.032 255.585deg);\n  --v2p-color-selection-background-img: var(--v2p-color-selection-background);\n  --v2p-color-font-secondary: oklch(from var(--v2p-color-foreground) l c h / 80%);\n  --v2p-color-font-tertiary: oklch(from var(--v2p-color-foreground) l c h / 68%);\n  --v2p-color-font-quaternary: oklch(from var(--v2p-color-foreground) l c h / 57%);\n  --v2p-color-button-background: var(--v2p-color-background);\n  --v2p-color-button-foreground: var(--v2p-color-foreground);\n  --v2p-color-button-background-hover: oklch(from var(--v2p-color-foreground) l c h / 10%);\n  --v2p-color-button-foreground-hover: var(--v2p-color-foreground);\n  --v2p-color-button-special-background: var(--v2p-color-accent-50);\n  --v2p-color-button-special-foreground: var(--v2p-color-accent-700);\n  --v2p-color-button-special-border: var(--v2p-color-accent-600);\n  --v2p-color-bg-content: #fff;\n  --v2p-color-bg-footer: var(--v2p-color-background);\n  --v2p-color-bg-hover-btn: rgb(152 147 165 / 10%);\n  --v2p-color-bg-subtle: oklch(from var(--v2p-color-foreground) l c h / 2%);\n  --v2p-color-bg-input: var(--v2p-color-background);\n  --v2p-color-bg-search: var(--v2p-color-bg-content);\n  --v2p-color-bg-search-active: var(--v2p-color-bg-search);\n  --v2p-color-bg-widget: var(--v2p-color-bg-content);\n  --v2p-color-bg-reply: var(--v2p-color-background);\n  --v2p-color-bg-tooltip: var(--v2p-color-background);\n  --v2p-color-bg-tabs: var(--v2p-color-background);\n  --v2p-color-bg-tpr: var(--v2p-color-background);\n  --v2p-color-bg-avatar: var(--v2p-color-background);\n  --v2p-color-bg-block: var(--v2p-color-background);\n  --v2p-color-bg-block-darker: var(--v2p-color-background);\n  --v2p-color-bg-link: transparent;\n  --v2p-color-bg-link-hover: var(--v2p-color-background);\n  --v2p-color-tabs: var(--v2p-color-foreground);\n  --v2p-color-heart: #ef4444;\n  --v2p-color-heart-fill: #fee2e2;\n  --v2p-color-mask: rgb(0 0 0 / 25%);\n  --v2p-color-divider: lab(30.7907% 22.35 -63.8417 / 20%);\n  --v2p-color-border: var(--v2p-color-divider);\n  --v2p-color-input-border: var(--v2p-color-border);\n  --v2p-color-border-darker: lab(30.7907% 22.35 -63.8417 / 30%);\n  --v2p-color-link-visited: var(--v2p-color-font-secondary);\n  --v2p-color-error: #ef4444;\n  --v2p-color-bg-error: #fee2e2;\n  --v2p-color-cell-num: var(--v2p-color-font-secondary);\n  --v2p-box-radius: 0;\n  --v2p-input-radius: 4px;\n  --v2p-button-radius: var(--v2p-input-radius);\n  --v2p-popup-radius: var(--v2p-input-radius);\n  --v2p-box-shadow: none;\n  --v2p-widget-shadow: 0 2px 8px -2px lab(30.7907% 22.35 -63.8417 / 12%);\n  --v2p-toast-shadow: 0 4px 12px -2px lab(30.7907% 22.35 -63.8417 / 15%);\n  --link-color: var(--v2p-color-foreground);\n  --box-background-alt-color: var(--v2p-color-bg-block);\n  --box-background-hover-color: var(--v2p-color-bg-link-hover);\n  --button-hover-color: var(--v2p-color-button-background-hover);\n  --button-border-color: var(--v2p-color-border);\n  --button-border-hover-color: var(--v2p-color-border-darker);\n  position: relative;\n  visibility: visible;\n}\nbody.v2p-theme-minimalist .v2p-modal-mask,\n.v2p-theme-minimalist .v2p-modal-mask,\n:root[data-v2p-theme=minimalist] .v2p-modal-mask,\n:root[data-v2p-theme=minimalist] body .v2p-modal-mask {\n  background-color: oklch(from var(--v2p-color-bg-content) l c h/60%);\n  background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(30, 64, 175, 0.03) 2px, rgba(30, 64, 175, 0.03) 4px);\n}\nbody.v2p-theme-minimalist #Top,\n.v2p-theme-minimalist #Top,\n:root[data-v2p-theme=minimalist] #Top,\n:root[data-v2p-theme=minimalist] body #Top {\n  background-color: var(--v2p-color-background);\n}\nbody.v2p-theme-minimalist #Wrapper #Main > .box:has(.topic_buttons),\nbody.v2p-theme-minimalist #Wrapper #Main .v2p-left-group .box:has(.topic_buttons),\n.v2p-theme-minimalist #Wrapper #Main > .box:has(.topic_buttons),\n.v2p-theme-minimalist #Wrapper #Main .v2p-left-group .box:has(.topic_buttons),\n:root[data-v2p-theme=minimalist] #Wrapper #Main > .box:has(.topic_buttons),\n:root[data-v2p-theme=minimalist] #Wrapper #Main .v2p-left-group .box:has(.topic_buttons),\n:root[data-v2p-theme=minimalist] body #Wrapper #Main > .box:has(.topic_buttons),\n:root[data-v2p-theme=minimalist] body #Wrapper #Main .v2p-left-group .box:has(.topic_buttons) {\n  border-bottom: 1px solid var(--v2p-color-border) !important;\n}\nbody.v2p-theme-minimalist #Wrapper #Main #SecondaryTabs,\n.v2p-theme-minimalist #Wrapper #Main #SecondaryTabs,\n:root[data-v2p-theme=minimalist] #Wrapper #Main #SecondaryTabs,\n:root[data-v2p-theme=minimalist] body #Wrapper #Main #SecondaryTabs {\n  border-radius: 0;\n}\nbody.v2p-theme-minimalist #Wrapper .box,\n.v2p-theme-minimalist #Wrapper .box,\n:root[data-v2p-theme=minimalist] #Wrapper .box,\n:root[data-v2p-theme=minimalist] body #Wrapper .box {\n  border: 1px solid var(--v2p-color-border);\n}\nbody.v2p-theme-minimalist #Rightbar > .box:has(.member-activity-bar),\n.v2p-theme-minimalist #Rightbar > .box:has(.member-activity-bar),\n:root[data-v2p-theme=minimalist] #Rightbar > .box:has(.member-activity-bar),\n:root[data-v2p-theme=minimalist] body #Rightbar > .box:has(.member-activity-bar) {\n  background-image: linear-gradient(to top, transparent 0%, transparent 50%, lab(30.7907% 22.35 -63.8417 / 0.08) 100%);\n}\nbody.v2p-theme-minimalist .fade,\n.v2p-theme-minimalist .fade,\n:root[data-v2p-theme=minimalist] .fade,\n:root[data-v2p-theme=minimalist] body .fade {\n  color: var(--v2p-color-font-secondary);\n}\nbody.v2p-theme-minimalist .button.special,\n.v2p-theme-minimalist .button.special,\n:root[data-v2p-theme=minimalist] .button.special,\n:root[data-v2p-theme=minimalist] body .button.special {\n  --button-hover-shadow:\n    0 1.8px 0 var(--v2p-color-accent-100), 0 1.8px 0 var(--v2p-color-accent-50);\n}\nbody.v2p-theme-minimalist .button.special:hover, body.v2p-theme-minimalist .button.special:hover:enabled,\n.v2p-theme-minimalist .button.special:hover,\n.v2p-theme-minimalist .button.special:hover:enabled,\n:root[data-v2p-theme=minimalist] .button.special:hover,\n:root[data-v2p-theme=minimalist] .button.special:hover:enabled,\n:root[data-v2p-theme=minimalist] body .button.special:hover,\n:root[data-v2p-theme=minimalist] body .button.special:hover:enabled {\n  --button-hover-shadow:\n    0 1.8px 0 var(--v2p-color-accent-500), 0 1.8px 0 var(--v2p-color-button-special-border);\n  text-shadow: none;\n}\nbody.v2p-theme-minimalist .badge.op,\n.v2p-theme-minimalist .badge.op,\n:root[data-v2p-theme=minimalist] .badge.op,\n:root[data-v2p-theme=minimalist] body .badge.op {\n  border: 1px solid var(--v2p-color-accent-100);\n  color: var(--v2p-color-accent-600);\n  background-color: var(--v2p-color-accent-100);\n}\nbody.v2p-theme-minimalist .badge.mod,\n.v2p-theme-minimalist .badge.mod,\n:root[data-v2p-theme=minimalist] .badge.mod,\n:root[data-v2p-theme=minimalist] body .badge.mod {\n  border: 1px solid var(--v2p-color-accent-600);\n  background-color: var(--v2p-color-accent-600);\n}\nbody.v2p-theme-minimalist .badge.pro,\n.v2p-theme-minimalist .badge.pro,\n:root[data-v2p-theme=minimalist] .badge.pro,\n:root[data-v2p-theme=minimalist] body .badge.pro {\n  border: 1px solid var(--v2p-color-foreground);\n  color: var(--v2p-color-bg-content);\n  background-color: var(--v2p-color-foreground);\n}\nbody.v2p-theme-minimalist .v2p-modal-main,\n.v2p-theme-minimalist .v2p-modal-main,\n:root[data-v2p-theme=minimalist] .v2p-modal-main,\n:root[data-v2p-theme=minimalist] body .v2p-modal-main {\n  border: 2px solid var(--v2p-color-border);\n}\nbody.v2p-theme-minimalist .v2p-modal-main .v2p-modal-header,\n.v2p-theme-minimalist .v2p-modal-main .v2p-modal-header,\n:root[data-v2p-theme=minimalist] .v2p-modal-main .v2p-modal-header,\n:root[data-v2p-theme=minimalist] body .v2p-modal-main .v2p-modal-header {\n  background-image: linear-gradient(to bottom, lab(30.7907% 22.35 -63.8417 / 0.03) 0%, transparent 100%);\n}\nbody.v2p-theme-minimalist .v2p-control::after,\n.v2p-theme-minimalist .v2p-control::after,\n:root[data-v2p-theme=minimalist] .v2p-control::after,\n:root[data-v2p-theme=minimalist] body .v2p-control::after {\n  background-color: var(--v2p-color-background);\n}\nbody.v2p-theme-minimalist .green,\n.v2p-theme-minimalist .green,\n:root[data-v2p-theme=minimalist] .green,\n:root[data-v2p-theme=minimalist] body .green {\n  color: var(--v2p-color-accent-500);\n}\nbody.v2p-theme-minimalist .onoffswitch label .frame::before,\n.v2p-theme-minimalist .onoffswitch label .frame::before,\n:root[data-v2p-theme=minimalist] .onoffswitch label .frame::before,\n:root[data-v2p-theme=minimalist] body .onoffswitch label .frame::before {\n  background-color: var(--v2p-color-accent-500);\n}\nbody.v2p-theme-minimalist .onoffswitch label .frame::after,\n.v2p-theme-minimalist .onoffswitch label .frame::after,\n:root[data-v2p-theme=minimalist] .onoffswitch label .frame::after,\n:root[data-v2p-theme=minimalist] body .onoffswitch label .frame::after {\n  background-color: var(--v2p-color-bg-search);\n}\nbody.v2p-theme-minimalist :is(.subtle),\n.v2p-theme-minimalist :is(.subtle),\n:root[data-v2p-theme=minimalist] :is(.subtle),\n:root[data-v2p-theme=minimalist] body :is(.subtle) {\n  border: none;\n  background-color: transparent;\n  background-image: linear-gradient(to right, lab(30.7907% 22.35 -63.8417 / 0.08) 0%, transparent 100%);\n}\n\n/* V2EX Polish c8f1b70; Copyright (c) 2023-present LeoKu and contributors.\n * MIT; see licenses/v2ex-polish-MIT.txt. Font overrides removed as requested.\n */\nbody.v2p-mobile,\n:root[data-v2p-mobile=true],\n:root[data-v2p-mobile=true] body {\n  --v2p-spacing-cell: 10px;\n}\nbody.v2p-mobile #site-header,\n:root[data-v2p-mobile=true] #site-header,\n:root[data-v2p-mobile=true] body #site-header {\n  border-color: var(--v2p-color-border);\n}\nbody.v2p-mobile #site-header #site-header-menu #menu-body,\n:root[data-v2p-mobile=true] #site-header #site-header-menu #menu-body,\n:root[data-v2p-mobile=true] body #site-header #site-header-menu #menu-body {\n  right: 5px;\n  border: 1px solid var(--v2p-color-border);\n  border-radius: 8px;\n}\nbody.v2p-mobile #Wrapper .content,\n:root[data-v2p-mobile=true] #Wrapper .content,\n:root[data-v2p-mobile=true] body #Wrapper .content {\n  display: block;\n  padding: 0;\n}\nbody.v2p-mobile #Wrapper .content .flex-one-row:first-of-type:not(.cell[id^=r_] .flex-one-row),\n:root[data-v2p-mobile=true] #Wrapper .content .flex-one-row:first-of-type:not(.cell[id^=r_] .flex-one-row),\n:root[data-v2p-mobile=true] body #Wrapper .content .flex-one-row:first-of-type:not(.cell[id^=r_] .flex-one-row) {\n  padding: 8px var(--v2p-spacing-cell) !important;\n}\nbody.v2p-mobile #Wrapper .content .header,\n:root[data-v2p-mobile=true] #Wrapper .content .header,\n:root[data-v2p-mobile=true] body #Wrapper .content .header {\n  padding: 10px var(--v2p-spacing-cell);\n}\nbody.v2p-mobile .box,\n:root[data-v2p-mobile=true] .box,\n:root[data-v2p-mobile=true] body .box {\n  border-radius: 0;\n}\nbody.v2p-mobile .box .cell:not([id^=r_]),\n:root[data-v2p-mobile=true] .box .cell:not([id^=r_]),\n:root[data-v2p-mobile=true] body .box .cell:not([id^=r_]) {\n  padding: var(--v2p-spacing-cell);\n}\nbody.v2p-mobile .box .cell .item,\n:root[data-v2p-mobile=true] .box .cell .item,\n:root[data-v2p-mobile=true] body .box .cell .item {\n  padding-right: 8px;\n}\nbody.v2p-mobile .box .cell .item .item_title,\n:root[data-v2p-mobile=true] .box .cell .item .item_title,\n:root[data-v2p-mobile=true] body .box .cell .item .item_title {\n  padding-top: 4px;\n}\nbody.v2p-mobile .box .cell .item .item_title .topic-link:hover,\n:root[data-v2p-mobile=true] .box .cell .item .item_title .topic-link:hover,\n:root[data-v2p-mobile=true] body .box .cell .item .item_title .topic-link:hover {\n  text-decoration: none;\n}\nbody.v2p-mobile .box .cell .item .count_livid,\n:root[data-v2p-mobile=true] .box .cell .item .count_livid,\n:root[data-v2p-mobile=true] body .box .cell .item .count_livid {\n  user-select: none;\n  display: inline-block;\n  padding: 5px 10px;\n  border-radius: var(--v2p-button-radius);\n  font-size: 12px;\n  font-weight: 400;\n  white-space: nowrap;\n  margin-right: 0;\n  color: var(--v2p-color-button-foreground);\n  background-color: var(--v2p-color-bg-block);\n}\n\n/* V2EX.REP; Copyright (c) 2023-2026 Pipecraft. MIT; see licenses/v2ex-rep-MIT.txt. */\na.icon_button {\n  opacity: 1 !important;\n  visibility: visible;\n  margin-right: 14px;\n}\n\na.icon_button:last-child {\n  margin-right: 0;\n}\n\na.icon_button svg {\n  vertical-align: text-top;\n}\n\nbody .v2p-controls {\n  opacity: 1;\n}\n\nbody .v2p-controls > a.icon_button {\n  margin-right: 0;\n}\n\nbody .v2p-controls div a {\n  margin-right: 15px;\n}\n\nbody .v2p-controls div a:last-child {\n  margin-right: 0;\n}\n\nbody .v2p-controls a[onclick^=replyOne] {\n  opacity: 1 !important;\n}\n\n.sticky_rightbar #Rightbar {\n  position: sticky;\n  top: 0;\n  max-height: 100vh;\n  overflow-y: auto;\n  overflow-x: hidden;\n  --sb-track-color: #00000000;\n  --sb-thumb-color: #33334480;\n  --sb-size: 2px;\n  scrollbar-color: rgba(0, 0, 0, 0) rgba(0, 0, 0, 0);\n  scrollbar-width: thin;\n}\n.sticky_rightbar #Rightbar:hover {\n  scrollbar-color: var(--sb-thumb-color) var(--sb-track-color);\n}\n.sticky_rightbar #Rightbar::-webkit-scrollbar {\n  width: var(--sb-size);\n}\n.sticky_rightbar #Rightbar::-webkit-scrollbar-track {\n  background: rgba(0, 0, 0, 0);\n  border-radius: 10px;\n}\n.sticky_rightbar #Rightbar:hover::-webkit-scrollbar-track {\n  background: var(--sb-track-color);\n}\n.sticky_rightbar #Rightbar::-webkit-scrollbar-thumb {\n  background: rgba(0, 0, 0, 0);\n  border-radius: 10px;\n}\n.sticky_rightbar #Rightbar:hover::-webkit-scrollbar-thumb {\n  background: var(--sb-thumb-color);\n}\n.sticky_rightbar #Rightbar .v2p-tool-box {\n  position: unset;\n}\n\n.related_replies_container .box {\n  border-radius: 0 !important;\n}\n.related_replies_container .related_replies {\n  position: absolute;\n  overflow: visible !important;\n  padding: 0px !important;\n  z-index: 10000;\n  width: 100%;\n  -webkit-box-shadow: 0px 10px 39px 10px rgba(62, 66, 66, 0.22);\n  -moz-box-shadow: 0px 10px 39px 10px rgba(62, 66, 66, 0.22);\n  box-shadow: 0px 10px 39px 10px rgba(62, 66, 66, 0.22) !important;\n}\n.related_replies_container .related_replies_before::before {\n  content: "";\n  display: block;\n  width: 100%;\n  height: 10000px;\n  position: absolute;\n  margin-top: -10000px;\n  background-color: #333344;\n  opacity: 50%;\n}\n.related_replies_container .related_replies_after::after {\n  content: "";\n  display: block;\n  width: 100%;\n  height: 10000px;\n  position: absolute;\n  background-color: #333344;\n  opacity: 50%;\n}\n.related_replies_container.no_replies .related_replies_before::before,\n.related_replies_container.no_replies .related_replies_after::after {\n  display: none;\n}\n.related_replies_container .tabs {\n  position: sticky;\n  top: 0;\n  display: flex;\n  justify-content: center;\n  z-index: 10001;\n  padding: 10px !important;\n}\n.related_replies_container .tabs a {\n  cursor: pointer;\n}\n\na.no {\n  background-color: transparent !important;\n  color: #1484cd !important;\n  border: 1px solid #1484cd;\n  border-radius: 3px !important;\n  opacity: 1 !important;\n}\n\n.cited_floor_number {\n  color: #1484cd !important;\n  cursor: pointer;\n}\n\n.reply_content .cell.cited_reply {\n  scale: 0.85;\n  background-color: #f5f5f5;\n  border: 1px solid var(--box-border-color);\n  white-space: initial;\n}\n.reply_content .cell.cited_reply::after {\n  content: "";\n  display: block;\n  position: absolute;\n  left: 0;\n  bottom: 0;\n  width: 100%;\n  height: 100%;\n  opacity: 0.45;\n  background-color: var(--box-background-color);\n}\n.reply_content .cell.cited_reply:hover::after {\n  display: none;\n}\n.reply_content .cell.cited_reply .vr_wrapper {\n  max-height: 150px;\n  overflow: auto;\n  --sb-track-color: #00000000;\n  --sb-thumb-color: #33334480;\n  --sb-size: 2px;\n  scrollbar-color: var(--sb-thumb-color) var(--sb-track-color);\n  scrollbar-width: thin;\n}\n.reply_content .cell.cited_reply .vr_wrapper::-webkit-scrollbar {\n  width: var(--sb-size);\n}\n.reply_content .cell.cited_reply .vr_wrapper::-webkit-scrollbar-track {\n  background: var(--sb-track-color);\n  border-radius: 10px;\n}\n.reply_content .cell.cited_reply .vr_wrapper::-webkit-scrollbar-thumb {\n  background: var(--sb-thumb-color);\n  border-radius: 10px;\n}\n\n[data-vr-opaticy-of-cited-replies="0"] .reply_content .cell.cited_reply::after {\n  display: none;\n}\n\n[data-vr-opaticy-of-cited-replies="1"] .reply_content .cell.cited_reply::after {\n  opacity: 0.2;\n}\n\n[data-vr-opaticy-of-cited-replies="3"] .reply_content .cell.cited_reply::after {\n  opacity: 0.6;\n}\n\n.v2p-indent .cell.cited_reply,\n.v2p-indent .reply_content + .reply_content,\n.v2p-indent .reply_content + .reply_content + .v2p-expand-btn,\n.v2p-indent .v2p-collapsed:has(.reply_content + .reply_content)::before,\n.comment .comment .cell.cited_reply {\n  display: none !important;\n}\n\n#top_replies .cell .vr_wrapper {\n  position: relative;\n  max-height: 150px;\n  overflow: hidden;\n}\n#top_replies .cell .vr_wrapper::after {\n  content: "";\n  display: block;\n  position: absolute;\n  bottom: 0;\n  width: 100%;\n  height: 5px;\n  opacity: 0.8;\n  background-color: var(--box-background-color);\n}\n\n#top_replies td > .flex-one-row {\n  column-gap: 4px;\n}\n#top_replies td > .flex-one-row > .flex-one-row:first-child {\n  flex: 1 1 100%;\n  flex-wrap: wrap;\n  min-width: 0;\n  row-gap: 2px;\n}\n#top_replies td > .flex-one-row > .flex-one-row:last-child {\n  align-self: baseline;\n  margin-left: auto;\n}\n#top_replies td > .flex-one-row > .flex-one-row:last-child a.no {\n  word-break: keep-all;\n}\n#top_replies td > .flex-one-row strong {\n  flex: 1 1 100%;\n  min-width: 0;\n  overflow-wrap: anywhere;\n}\n#top_replies td > .flex-one-row .ago {\n  line-height: 110%;\n}\n\n.sticky_paging {\n  position: sticky;\n  bottom: 0;\n  background-color: var(--box-background-color) !important;\n  border-top: 1px solid var(--box-border-color);\n  z-index: 90;\n}\n\n.reply-box-sticky {\n  z-index: 91;\n}\n\n.Night .reply_content .cell.cited_reply {\n  background-color: #1d1f21;\n}\n\n.vr_upload_image {\n  cursor: pointer;\n}\n\n.vr_upload_image.vr_button_disabled,\n.vr_upload_image.vr_button_disabled:hover {\n  cursor: default;\n  text-decoration: none;\n  color: var(--color-fade);\n}\n\n.sticky_topic_buttons .topic_buttons,\n.sticky_topic_buttons .topic_buttons_mobile {\n  position: sticky;\n  bottom: 0;\n  background-color: var(--box-background-color) !important;\n  border-top: 1px solid var(--box-border-color);\n}\n.sticky_topic_buttons .header + .cell {\n  border-bottom: none;\n}';

  // src/styles.css
  var styles_default = "[hidden] {\n  display: none !important;\n}\n";

  // node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs
  var min = Math.min;
  var max = Math.max;
  var round = Math.round;
  var createCoords = (v) => ({
    x: v,
    y: v
  });
  var oppositeSideMap = {
    left: "right",
    right: "left",
    bottom: "top",
    top: "bottom"
  };
  function clamp(start2, value, end) {
    return max(start2, min(value, end));
  }
  function evaluate(value, param) {
    return typeof value === "function" ? value(param) : value;
  }
  function getSide(placement) {
    return placement.split("-")[0];
  }
  function getAlignment(placement) {
    return placement.split("-")[1];
  }
  function getOppositeAxis(axis) {
    return axis === "x" ? "y" : "x";
  }
  function getAxisLength(axis) {
    return axis === "y" ? "height" : "width";
  }
  function getSideAxis(placement) {
    const firstChar = placement[0];
    return firstChar === "t" || firstChar === "b" ? "y" : "x";
  }
  function getAlignmentAxis(placement) {
    return getOppositeAxis(getSideAxis(placement));
  }
  function getAlignmentSides(placement, rects, rtl) {
    if (rtl === void 0) {
      rtl = false;
    }
    const alignment = getAlignment(placement);
    const alignmentAxis = getAlignmentAxis(placement);
    const length = getAxisLength(alignmentAxis);
    let mainAlignmentSide = alignmentAxis === "x" ? alignment === (rtl ? "end" : "start") ? "right" : "left" : alignment === "start" ? "bottom" : "top";
    if (rects.reference[length] > rects.floating[length]) {
      mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
    }
    return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
  }
  function getExpandedPlacements(placement) {
    const oppositePlacement = getOppositePlacement(placement);
    return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
  }
  function getOppositeAlignmentPlacement(placement) {
    return placement.includes("start") ? placement.replace("start", "end") : placement.replace("end", "start");
  }
  var lrPlacement = ["left", "right"];
  var rlPlacement = ["right", "left"];
  var tbPlacement = ["top", "bottom"];
  var btPlacement = ["bottom", "top"];
  function getSideList(side, isStart, rtl) {
    switch (side) {
      case "top":
      case "bottom":
        if (rtl) return isStart ? rlPlacement : lrPlacement;
        return isStart ? lrPlacement : rlPlacement;
      case "left":
      case "right":
        return isStart ? tbPlacement : btPlacement;
      default:
        return [];
    }
  }
  function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
    const alignment = getAlignment(placement);
    let list = getSideList(getSide(placement), direction === "start", rtl);
    if (alignment) {
      list = list.map((side) => side + "-" + alignment);
      if (flipAlignment) {
        list = list.concat(list.map(getOppositeAlignmentPlacement));
      }
    }
    return list;
  }
  function getOppositePlacement(placement) {
    const side = getSide(placement);
    return oppositeSideMap[side] + placement.slice(side.length);
  }
  function expandPaddingObject(padding) {
    var _padding$top, _padding$right, _padding$bottom, _padding$left;
    return {
      top: (_padding$top = padding.top) != null ? _padding$top : 0,
      right: (_padding$right = padding.right) != null ? _padding$right : 0,
      bottom: (_padding$bottom = padding.bottom) != null ? _padding$bottom : 0,
      left: (_padding$left = padding.left) != null ? _padding$left : 0
    };
  }
  function getPaddingObject(padding) {
    return typeof padding !== "number" ? expandPaddingObject(padding) : {
      top: padding,
      right: padding,
      bottom: padding,
      left: padding
    };
  }
  function rectToClientRect(rect) {
    const {
      x,
      y,
      width,
      height
    } = rect;
    return {
      width,
      height,
      top: y,
      left: x,
      right: x + width,
      bottom: y + height,
      x,
      y
    };
  }

  // node_modules/@floating-ui/core/dist/floating-ui.core.mjs
  function computeCoordsFromPlacement(_ref, placement, rtl) {
    let {
      reference,
      floating
    } = _ref;
    const sideAxis = getSideAxis(placement);
    const alignmentAxis = getAlignmentAxis(placement);
    const alignLength = getAxisLength(alignmentAxis);
    const side = getSide(placement);
    const isVertical = sideAxis === "y";
    const commonX = reference.x + reference.width / 2 - floating.width / 2;
    const commonY = reference.y + reference.height / 2 - floating.height / 2;
    const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
    let coords;
    switch (side) {
      case "top":
        coords = {
          x: commonX,
          y: reference.y - floating.height
        };
        break;
      case "bottom":
        coords = {
          x: commonX,
          y: reference.y + reference.height
        };
        break;
      case "right":
        coords = {
          x: reference.x + reference.width,
          y: commonY
        };
        break;
      case "left":
        coords = {
          x: reference.x - floating.width,
          y: commonY
        };
        break;
      default:
        coords = {
          x: reference.x,
          y: reference.y
        };
    }
    const alignment = getAlignment(placement);
    if (alignment) {
      coords[alignmentAxis] += commonAlign * (alignment === "end" ? 1 : -1) * (rtl && isVertical ? -1 : 1);
    }
    return coords;
  }
  async function detectOverflow(state, options2) {
    var _await$platform$isEle;
    if (options2 === void 0) {
      options2 = {};
    }
    const {
      x,
      y,
      platform: platform2,
      rects,
      elements,
      strategy
    } = state;
    const {
      boundary = "clippingAncestors",
      rootBoundary = "viewport",
      elementContext = "floating",
      altBoundary = false,
      padding = 0
    } = evaluate(options2, state);
    const paddingObject = getPaddingObject(padding);
    const altContext = elementContext === "floating" ? "reference" : "floating";
    const element2 = elements[altBoundary ? altContext : elementContext];
    const clippingClientRect = rectToClientRect(await platform2.getClippingRect({
      element: ((_await$platform$isEle = await (platform2.isElement == null ? void 0 : platform2.isElement(element2))) != null ? _await$platform$isEle : true) ? element2 : element2.contextElement || await (platform2.getDocumentElement == null ? void 0 : platform2.getDocumentElement(elements.floating)),
      boundary,
      rootBoundary,
      strategy
    }));
    const rect = elementContext === "floating" ? {
      x,
      y,
      width: rects.floating.width,
      height: rects.floating.height
    } : rects.reference;
    const offsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(elements.floating));
    const offsetScale = await (platform2.isElement == null ? void 0 : platform2.isElement(offsetParent)) && await (platform2.getScale == null ? void 0 : platform2.getScale(offsetParent)) || {
      x: 1,
      y: 1
    };
    const elementClientRect = rectToClientRect(platform2.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform2.convertOffsetParentRelativeRectToViewportRelativeRect({
      elements,
      rect,
      offsetParent,
      strategy
    }) : rect);
    return {
      top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
      bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
      left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
      right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
    };
  }
  var MAX_RESET_COUNT = 50;
  var computePosition = async (reference, floating, config) => {
    const {
      placement = "bottom",
      strategy = "absolute",
      middleware = [],
      platform: platform2
    } = config;
    const platformWithDetectOverflow = platform2.detectOverflow ? platform2 : {
      ...platform2,
      detectOverflow
    };
    const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(floating));
    let rects = await platform2.getElementRects({
      reference,
      floating,
      strategy
    });
    let {
      x,
      y
    } = computeCoordsFromPlacement(rects, placement, rtl);
    let statefulPlacement = placement;
    let resetCount = 0;
    const middlewareData = {};
    for (let i = 0; i < middleware.length; i++) {
      const currentMiddleware = middleware[i];
      if (!currentMiddleware) {
        continue;
      }
      const {
        name,
        fn
      } = currentMiddleware;
      const {
        x: nextX,
        y: nextY,
        data,
        reset
      } = await fn({
        x,
        y,
        initialPlacement: placement,
        placement: statefulPlacement,
        strategy,
        middlewareData,
        rects,
        platform: platformWithDetectOverflow,
        elements: {
          reference,
          floating
        }
      });
      x = nextX != null ? nextX : x;
      y = nextY != null ? nextY : y;
      middlewareData[name] = {
        ...middlewareData[name],
        ...data
      };
      if (reset && resetCount < MAX_RESET_COUNT) {
        resetCount++;
        if (typeof reset === "object") {
          if (reset.placement) {
            statefulPlacement = reset.placement;
          }
          if (reset.rects) {
            rects = reset.rects === true ? await platform2.getElementRects({
              reference,
              floating,
              strategy
            }) : reset.rects;
          }
          ({
            x,
            y
          } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
        }
        i = -1;
      }
    }
    return {
      x,
      y,
      placement: statefulPlacement,
      strategy,
      middlewareData
    };
  };
  var flip = function(options2) {
    if (options2 === void 0) {
      options2 = {};
    }
    return {
      name: "flip",
      options: options2,
      async fn(state) {
        var _middlewareData$arrow, _middlewareData$flip;
        const {
          placement,
          middlewareData,
          rects,
          initialPlacement,
          platform: platform2,
          elements
        } = state;
        const {
          mainAxis: checkMainAxis = true,
          crossAxis: checkCrossAxis = true,
          fallbackPlacements: specifiedFallbackPlacements,
          fallbackStrategy = "bestFit",
          fallbackAxisSideDirection = "none",
          flipAlignment = true,
          ...detectOverflowOptions
        } = evaluate(options2, state);
        if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
          return {};
        }
        const side = getSide(placement);
        const initialSideAxis = getSideAxis(initialPlacement);
        const isBasePlacement = getSide(initialPlacement) === initialPlacement;
        const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
        const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
        const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== "none";
        if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) {
          fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
        }
        const placements2 = [initialPlacement, ...fallbackPlacements];
        const overflow = await platform2.detectOverflow(state, detectOverflowOptions);
        const overflows = [];
        let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
        if (checkMainAxis) {
          overflows.push(overflow[side]);
        }
        if (checkCrossAxis) {
          const sides2 = getAlignmentSides(placement, rects, rtl);
          overflows.push(overflow[sides2[0]], overflow[sides2[1]]);
        }
        overflowsData = [...overflowsData, {
          placement,
          overflows
        }];
        if (!overflows.every((side2) => side2 <= 0)) {
          var _middlewareData$flip2, _overflowsData$filter;
          const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
          const nextPlacement = placements2[nextIndex];
          if (nextPlacement) {
            const ignoreCrossAxisOverflow = checkCrossAxis === "alignment" ? initialSideAxis !== getSideAxis(nextPlacement) : false;
            if (!ignoreCrossAxisOverflow || // We leave the current main axis only if every placement on that axis
            // overflows the main axis.
            overflowsData.every((d) => getSideAxis(d.placement) === initialSideAxis ? d.overflows[0] > 0 : true)) {
              return {
                data: {
                  index: nextIndex,
                  overflows: overflowsData
                },
                reset: {
                  placement: nextPlacement
                }
              };
            }
          }
          let resetPlacement = (_overflowsData$filter = overflowsData.filter((d) => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;
          if (!resetPlacement) {
            switch (fallbackStrategy) {
              case "bestFit": {
                var _overflowsData$filter2;
                const placement2 = (_overflowsData$filter2 = overflowsData.filter((d) => {
                  if (hasFallbackAxisSideDirection) {
                    const currentSideAxis = getSideAxis(d.placement);
                    return currentSideAxis === initialSideAxis || // Create a bias to the `y` side axis due to horizontal
                    // reading directions favoring greater width.
                    currentSideAxis === "y";
                  }
                  return true;
                }).map((d) => [d.placement, d.overflows.filter((overflow2) => overflow2 > 0).reduce((acc, overflow2) => acc + overflow2, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
                if (placement2) {
                  resetPlacement = placement2;
                }
                break;
              }
              case "initialPlacement":
                resetPlacement = initialPlacement;
                break;
            }
          }
          if (placement !== resetPlacement) {
            return {
              reset: {
                placement: resetPlacement
              }
            };
          }
        }
        return {};
      }
    };
  };
  var originSides = /* @__PURE__ */ new Set(["left", "top"]);
  async function convertValueToCoords(state, options2) {
    const {
      placement,
      platform: platform2,
      elements
    } = state;
    const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
    const side = getSide(placement);
    const alignment = getAlignment(placement);
    const isVertical = getSideAxis(placement) === "y";
    const mainAxisMulti = originSides.has(side) ? -1 : 1;
    const crossAxisMulti = rtl && isVertical ? -1 : 1;
    const rawValue = evaluate(options2, state);
    let {
      mainAxis,
      crossAxis,
      alignmentAxis
    } = typeof rawValue === "number" ? {
      mainAxis: rawValue,
      crossAxis: 0,
      alignmentAxis: null
    } : {
      mainAxis: rawValue.mainAxis || 0,
      crossAxis: rawValue.crossAxis || 0,
      alignmentAxis: rawValue.alignmentAxis
    };
    if (alignment && typeof alignmentAxis === "number") {
      crossAxis = alignment === "end" ? alignmentAxis * -1 : alignmentAxis;
    }
    return isVertical ? {
      x: crossAxis * crossAxisMulti,
      y: mainAxis * mainAxisMulti
    } : {
      x: mainAxis * mainAxisMulti,
      y: crossAxis * crossAxisMulti
    };
  }
  var offset = function(options2) {
    if (options2 === void 0) {
      options2 = 0;
    }
    return {
      name: "offset",
      options: options2,
      async fn(state) {
        var _middlewareData$offse, _middlewareData$arrow;
        const {
          x,
          y,
          placement,
          middlewareData
        } = state;
        const diffCoords = await convertValueToCoords(state, options2);
        if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
          return {};
        }
        return {
          x: x + diffCoords.x,
          y: y + diffCoords.y,
          data: {
            ...diffCoords,
            placement
          }
        };
      }
    };
  };
  var shift = function(options2) {
    if (options2 === void 0) {
      options2 = {};
    }
    return {
      name: "shift",
      options: options2,
      async fn(state) {
        const {
          x,
          y,
          placement,
          platform: platform2
        } = state;
        const {
          mainAxis: checkMainAxis = true,
          crossAxis: checkCrossAxis = false,
          limiter = {
            fn: (_ref) => {
              let {
                x: x2,
                y: y2
              } = _ref;
              return {
                x: x2,
                y: y2
              };
            }
          },
          ...detectOverflowOptions
        } = evaluate(options2, state);
        const coords = {
          x,
          y
        };
        const overflow = await platform2.detectOverflow(state, detectOverflowOptions);
        const crossAxis = getSideAxis(placement);
        const mainAxis = getOppositeAxis(crossAxis);
        let mainAxisCoord = coords[mainAxis];
        let crossAxisCoord = coords[crossAxis];
        const clampCoord = (axis, coord) => clamp(coord + overflow[axis === "y" ? "top" : "left"], coord, coord - overflow[axis === "y" ? "bottom" : "right"]);
        if (checkMainAxis) {
          mainAxisCoord = clampCoord(mainAxis, mainAxisCoord);
        }
        if (checkCrossAxis) {
          crossAxisCoord = clampCoord(crossAxis, crossAxisCoord);
        }
        const limitedCoords = limiter.fn({
          ...state,
          [mainAxis]: mainAxisCoord,
          [crossAxis]: crossAxisCoord
        });
        return {
          ...limitedCoords,
          data: {
            x: limitedCoords.x - x,
            y: limitedCoords.y - y,
            enabled: {
              [mainAxis]: checkMainAxis,
              [crossAxis]: checkCrossAxis
            }
          }
        };
      }
    };
  };

  // node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs
  function hasWindow() {
    return typeof window !== "undefined";
  }
  function getNodeName(node) {
    if (isNode(node)) {
      return (node.nodeName || "").toLowerCase();
    }
    return "#document";
  }
  function getWindow(node) {
    var _node$ownerDocument;
    return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
  }
  function getDocumentElement(node) {
    var _ref;
    return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
  }
  function isNode(value) {
    if (!hasWindow()) {
      return false;
    }
    return value instanceof Node || value instanceof getWindow(value).Node;
  }
  function isElement(value) {
    if (!hasWindow()) {
      return false;
    }
    return value instanceof Element || value instanceof getWindow(value).Element;
  }
  function isHTMLElement(value) {
    if (!hasWindow()) {
      return false;
    }
    return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
  }
  function isShadowRoot(value) {
    if (!hasWindow() || typeof ShadowRoot === "undefined") {
      return false;
    }
    return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
  }
  function isOverflowElement(element2) {
    const {
      overflow,
      overflowX,
      overflowY,
      display
    } = getComputedStyle2(element2);
    return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && display !== "inline" && display !== "contents";
  }
  function isTableElement(element2) {
    return /^(table|td|th)$/.test(getNodeName(element2));
  }
  function isTopLayer(element2) {
    try {
      if (element2.matches(":popover-open")) {
        return true;
      }
    } catch (_e) {
    }
    try {
      return element2.matches(":modal");
    } catch (_e) {
      return false;
    }
  }
  var willChangeRe = /transform|translate|scale|rotate|perspective|filter/;
  var containRe = /paint|layout|strict|content/;
  var isNotNone = (value) => !!value && value !== "none";
  var isWebKitValue;
  function isContainingBlock(elementOrCss) {
    const css = isElement(elementOrCss) ? getComputedStyle2(elementOrCss) : elementOrCss;
    return isNotNone(css.transform) || isNotNone(css.translate) || isNotNone(css.scale) || isNotNone(css.rotate) || isNotNone(css.perspective) || !isWebKit() && (isNotNone(css.backdropFilter) || isNotNone(css.filter)) || willChangeRe.test(css.willChange || "") || containRe.test(css.contain || "");
  }
  function getContainingBlock(element2) {
    let currentNode = getParentNode(element2);
    while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
      if (isContainingBlock(currentNode)) {
        return currentNode;
      } else if (isTopLayer(currentNode)) {
        return null;
      }
      currentNode = getParentNode(currentNode);
    }
    return null;
  }
  function isWebKit() {
    if (isWebKitValue == null) {
      isWebKitValue = typeof CSS !== "undefined" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none");
    }
    return isWebKitValue;
  }
  function isLastTraversableNode(node) {
    return /^(html|body|#document)$/.test(getNodeName(node));
  }
  function getComputedStyle2(element2) {
    return getWindow(element2).getComputedStyle(element2);
  }
  function getNodeScroll(element2) {
    if (isElement(element2)) {
      return {
        scrollLeft: element2.scrollLeft,
        scrollTop: element2.scrollTop
      };
    }
    return {
      scrollLeft: element2.scrollX,
      scrollTop: element2.scrollY
    };
  }
  function getParentNode(node) {
    if (getNodeName(node) === "html") {
      return node;
    }
    const result = (
      // Step into the shadow DOM of the parent of a slotted node.
      node.assignedSlot || // DOM Element detected.
      node.parentNode || // ShadowRoot detected.
      isShadowRoot(node) && node.host || // Fallback.
      getDocumentElement(node)
    );
    return isShadowRoot(result) ? result.host : result;
  }
  function getNearestOverflowAncestor(node) {
    const parentNode = getParentNode(node);
    if (isLastTraversableNode(parentNode)) {
      return (node.ownerDocument || node).body;
    }
    if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
      return parentNode;
    }
    return getNearestOverflowAncestor(parentNode);
  }
  function getOverflowAncestors(node, list, traverseIframes) {
    var _node$ownerDocument2;
    if (list === void 0) {
      list = [];
    }
    if (traverseIframes === void 0) {
      traverseIframes = true;
    }
    const scrollableAncestor = getNearestOverflowAncestor(node);
    const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
    const win = getWindow(scrollableAncestor);
    if (isBody) {
      const frameElement = getFrameElement(win);
      return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
    } else {
      return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
    }
  }
  function getFrameElement(win) {
    return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
  }

  // node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs
  function getCssDimensions(element2) {
    const css = getComputedStyle2(element2);
    let width = parseFloat(css.width) || 0;
    let height = parseFloat(css.height) || 0;
    const hasOffset = isHTMLElement(element2);
    const offsetWidth = hasOffset ? element2.offsetWidth : width;
    const offsetHeight = hasOffset ? element2.offsetHeight : height;
    const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
    if (shouldFallback) {
      width = offsetWidth;
      height = offsetHeight;
    }
    return {
      width,
      height,
      $: shouldFallback
    };
  }
  function unwrapElement(element2) {
    return !isElement(element2) ? element2.contextElement : element2;
  }
  function getScale(element2) {
    const domElement = unwrapElement(element2);
    if (!isHTMLElement(domElement)) {
      return createCoords(1);
    }
    const rect = domElement.getBoundingClientRect();
    const {
      width,
      height,
      $
    } = getCssDimensions(domElement);
    let x = ($ ? round(rect.width) : rect.width) / width;
    let y = ($ ? round(rect.height) : rect.height) / height;
    if (!x || !Number.isFinite(x)) {
      x = 1;
    }
    if (!y || !Number.isFinite(y)) {
      y = 1;
    }
    return {
      x,
      y
    };
  }
  var noOffsets = /* @__PURE__ */ createCoords(0);
  function getVisualOffsets(element2) {
    const win = getWindow(element2);
    if (!isWebKit() || !win.visualViewport) {
      return noOffsets;
    }
    return {
      x: win.visualViewport.offsetLeft,
      y: win.visualViewport.offsetTop
    };
  }
  function shouldAddVisualOffsets(element2, isFixed, floatingOffsetParent) {
    if (isFixed === void 0) {
      isFixed = false;
    }
    return !!floatingOffsetParent && isFixed && floatingOffsetParent === getWindow(element2);
  }
  function getBoundingClientRect(element2, includeScale, isFixedStrategy, offsetParent) {
    if (includeScale === void 0) {
      includeScale = false;
    }
    if (isFixedStrategy === void 0) {
      isFixedStrategy = false;
    }
    const clientRect = element2.getBoundingClientRect();
    const domElement = unwrapElement(element2);
    let scale = createCoords(1);
    if (includeScale) {
      if (offsetParent) {
        if (isElement(offsetParent)) {
          scale = getScale(offsetParent);
        }
      } else {
        scale = getScale(element2);
      }
    }
    const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
    let x = (clientRect.left + visualOffsets.x) / scale.x;
    let y = (clientRect.top + visualOffsets.y) / scale.y;
    let width = clientRect.width / scale.x;
    let height = clientRect.height / scale.y;
    if (domElement && offsetParent) {
      const win = getWindow(domElement);
      const offsetWin = isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
      let currentWin = win;
      let currentIFrame = getFrameElement(currentWin);
      while (currentIFrame && offsetWin !== currentWin) {
        const iframeScale = getScale(currentIFrame);
        const iframeRect = currentIFrame.getBoundingClientRect();
        const css = getComputedStyle2(currentIFrame);
        const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
        const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
        x *= iframeScale.x;
        y *= iframeScale.y;
        width *= iframeScale.x;
        height *= iframeScale.y;
        x += left;
        y += top;
        currentWin = getWindow(currentIFrame);
        currentIFrame = getFrameElement(currentWin);
      }
    }
    return rectToClientRect({
      width,
      height,
      x,
      y
    });
  }
  function getWindowScrollBarX(element2, rect) {
    const leftScroll = getNodeScroll(element2).scrollLeft;
    if (!rect) {
      return getBoundingClientRect(getDocumentElement(element2)).left + leftScroll;
    }
    return rect.left + leftScroll;
  }
  function getHTMLOffset(documentElement, scroll) {
    const htmlRect = documentElement.getBoundingClientRect();
    const x = htmlRect.left + scroll.scrollLeft - getWindowScrollBarX(documentElement, htmlRect);
    const y = htmlRect.top + scroll.scrollTop;
    return {
      x,
      y
    };
  }
  function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
    let {
      elements,
      rect,
      offsetParent,
      strategy
    } = _ref;
    const isFixed = strategy === "fixed";
    const documentElement = getDocumentElement(offsetParent);
    const topLayer = elements ? isTopLayer(elements.floating) : false;
    if (offsetParent === documentElement || topLayer && isFixed) {
      return rect;
    }
    let scroll = {
      scrollLeft: 0,
      scrollTop: 0
    };
    let scale = createCoords(1);
    const offsets = createCoords(0);
    const isOffsetParentAnElement = isHTMLElement(offsetParent);
    if (isOffsetParentAnElement || !isFixed) {
      if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
        scroll = getNodeScroll(offsetParent);
      }
      if (isOffsetParentAnElement) {
        const offsetRect = getBoundingClientRect(offsetParent);
        scale = getScale(offsetParent);
        offsets.x = offsetRect.x + offsetParent.clientLeft;
        offsets.y = offsetRect.y + offsetParent.clientTop;
      }
    }
    const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
    return {
      width: rect.width * scale.x,
      height: rect.height * scale.y,
      x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x + htmlOffset.x,
      y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y + htmlOffset.y
    };
  }
  function getClientRects(element2) {
    return element2.getClientRects ? Array.from(element2.getClientRects()) : [];
  }
  function getDocumentRect(html) {
    const scroll = getNodeScroll(html);
    const body = html.ownerDocument.body;
    const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
    const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
    let x = -scroll.scrollLeft + getWindowScrollBarX(html);
    const y = -scroll.scrollTop;
    if (getComputedStyle2(body).direction === "rtl") {
      x += max(html.clientWidth, body.clientWidth) - width;
    }
    return {
      width,
      height,
      x,
      y
    };
  }
  var SCROLLBAR_MAX = 25;
  function getViewportRect(element2, strategy, rootBoundary) {
    if (rootBoundary === void 0) {
      rootBoundary = "viewport";
    }
    const isLayoutViewport = rootBoundary === "layoutViewport";
    const win = getWindow(element2);
    const html = getDocumentElement(element2);
    const visualViewport = win.visualViewport;
    let width = html.clientWidth;
    let height = html.clientHeight;
    let x = 0;
    let y = 0;
    if (visualViewport) {
      const layoutRelativeClientCoords = !isWebKit() || strategy === "fixed";
      if (isLayoutViewport) {
        if (!layoutRelativeClientCoords) {
          x = -visualViewport.offsetLeft;
          y = -visualViewport.offsetTop;
        }
      } else {
        width = visualViewport.width;
        height = visualViewport.height;
        if (layoutRelativeClientCoords) {
          x = visualViewport.offsetLeft;
          y = visualViewport.offsetTop;
        }
      }
    }
    const windowScrollbarX = getWindowScrollBarX(html);
    if (windowScrollbarX <= 0) {
      const doc = html.ownerDocument;
      const body = doc.body;
      const bodyStyles = getComputedStyle(body);
      const bodyMarginInline = doc.compatMode === "CSS1Compat" ? parseFloat(bodyStyles.marginLeft) + parseFloat(bodyStyles.marginRight) || 0 : 0;
      const reservedWidth = Math.abs(html.clientWidth - body.clientWidth - bodyMarginInline);
      const gutter = getComputedStyle(html).scrollbarGutter === "stable both-edges" ? reservedWidth / 2 : reservedWidth;
      if (gutter <= SCROLLBAR_MAX) {
        width -= gutter;
      }
    }
    return {
      width,
      height,
      x,
      y
    };
  }
  function getInnerBoundingClientRect(element2, strategy) {
    const clientRect = getBoundingClientRect(element2, true, strategy === "fixed");
    const top = clientRect.top + element2.clientTop;
    const left = clientRect.left + element2.clientLeft;
    const scale = getScale(element2);
    const width = element2.clientWidth * scale.x;
    const height = element2.clientHeight * scale.y;
    const x = left * scale.x;
    const y = top * scale.y;
    return {
      width,
      height,
      x,
      y
    };
  }
  function getClientRectFromClippingAncestor(element2, clippingAncestor, strategy) {
    let rect;
    if (clippingAncestor === "viewport" || clippingAncestor === "layoutViewport") {
      rect = getViewportRect(element2, strategy, clippingAncestor);
    } else if (clippingAncestor === "document") {
      rect = getDocumentRect(getDocumentElement(element2));
    } else if (isElement(clippingAncestor)) {
      rect = getInnerBoundingClientRect(clippingAncestor, strategy);
    } else {
      const visualOffsets = getVisualOffsets(element2);
      rect = {
        x: clippingAncestor.x - visualOffsets.x,
        y: clippingAncestor.y - visualOffsets.y,
        width: clippingAncestor.width,
        height: clippingAncestor.height
      };
    }
    return rectToClientRect(rect);
  }
  function getClippingElementAncestors(element2, cache) {
    const cachedResult = cache.get(element2);
    if (cachedResult) {
      return cachedResult;
    }
    let result = getOverflowAncestors(element2, [], false).filter((el) => isElement(el) && getNodeName(el) !== "body");
    let lastKeptComputedStyle = null;
    const elementIsFixed = getComputedStyle2(element2).position === "fixed";
    let currentNode = elementIsFixed ? getParentNode(element2) : element2;
    while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
      const computedStyle = getComputedStyle2(currentNode);
      const currentNodeIsContaining = isContainingBlock(currentNode);
      const lastPosition = lastKeptComputedStyle ? lastKeptComputedStyle.position : elementIsFixed ? "fixed" : "";
      const shouldDropCurrentNode = !currentNodeIsContaining && (lastPosition === "fixed" || lastPosition === "absolute" && computedStyle.position === "static");
      if (shouldDropCurrentNode) {
        result = result.filter((ancestor) => ancestor !== currentNode);
      } else {
        lastKeptComputedStyle = computedStyle;
      }
      currentNode = getParentNode(currentNode);
    }
    cache.set(element2, result);
    return result;
  }
  function getClippingRect(_ref) {
    let {
      element: element2,
      boundary,
      rootBoundary,
      strategy
    } = _ref;
    const elementClippingAncestors = boundary === "clippingAncestors" ? isTopLayer(element2) ? [] : getClippingElementAncestors(element2, this._c) : [].concat(boundary);
    const clippingAncestors = [...elementClippingAncestors, rootBoundary];
    const firstRect = getClientRectFromClippingAncestor(element2, clippingAncestors[0], strategy);
    let top = firstRect.top;
    let right = firstRect.right;
    let bottom = firstRect.bottom;
    let left = firstRect.left;
    for (let i = 1; i < clippingAncestors.length; i++) {
      const rect = getClientRectFromClippingAncestor(element2, clippingAncestors[i], strategy);
      top = max(rect.top, top);
      right = min(rect.right, right);
      bottom = min(rect.bottom, bottom);
      left = max(rect.left, left);
    }
    return {
      width: right - left,
      height: bottom - top,
      x: left,
      y: top
    };
  }
  function getDimensions(element2) {
    const {
      width,
      height
    } = getCssDimensions(element2);
    return {
      width,
      height
    };
  }
  function getRectRelativeToOffsetParent(element2, offsetParent, strategy) {
    const isOffsetParentAnElement = isHTMLElement(offsetParent);
    const documentElement = getDocumentElement(offsetParent);
    const isFixed = strategy === "fixed";
    const rect = getBoundingClientRect(element2, true, isFixed, offsetParent);
    let scroll = {
      scrollLeft: 0,
      scrollTop: 0
    };
    const offsets = createCoords(0);
    if (isOffsetParentAnElement || !isFixed) {
      if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
        scroll = getNodeScroll(offsetParent);
      }
      if (isOffsetParentAnElement) {
        const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
        offsets.x = offsetRect.x + offsetParent.clientLeft;
        offsets.y = offsetRect.y + offsetParent.clientTop;
      }
    }
    if (!isOffsetParentAnElement && documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
    const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
    const x = rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x;
    const y = rect.top + scroll.scrollTop - offsets.y - htmlOffset.y;
    return {
      x,
      y,
      width: rect.width,
      height: rect.height
    };
  }
  function isStaticPositioned(element2) {
    return getComputedStyle2(element2).position === "static";
  }
  function getTrueOffsetParent(element2, polyfill) {
    if (!isHTMLElement(element2) || getComputedStyle2(element2).position === "fixed") {
      return null;
    }
    if (polyfill) {
      return polyfill(element2);
    }
    let rawOffsetParent = element2.offsetParent;
    if (getDocumentElement(element2) === rawOffsetParent) {
      rawOffsetParent = rawOffsetParent.ownerDocument.body;
    }
    return rawOffsetParent;
  }
  function getOffsetParent(element2, polyfill) {
    const win = getWindow(element2);
    if (isTopLayer(element2)) {
      return win;
    }
    if (!isHTMLElement(element2)) {
      let svgOffsetParent = getParentNode(element2);
      while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
        if (isElement(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) {
          return svgOffsetParent;
        }
        svgOffsetParent = getParentNode(svgOffsetParent);
      }
      return win;
    }
    let offsetParent = getTrueOffsetParent(element2, polyfill);
    while (offsetParent && isTableElement(offsetParent) && isStaticPositioned(offsetParent)) {
      offsetParent = getTrueOffsetParent(offsetParent, polyfill);
    }
    if (offsetParent && isLastTraversableNode(offsetParent) && isStaticPositioned(offsetParent) && !isContainingBlock(offsetParent)) {
      return win;
    }
    return offsetParent || getContainingBlock(element2) || win;
  }
  var getElementRects = async function(data) {
    const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
    const getDimensionsFn = this.getDimensions;
    const floatingDimensions = await getDimensionsFn(data.floating);
    return {
      reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
      floating: {
        x: 0,
        y: 0,
        width: floatingDimensions.width,
        height: floatingDimensions.height
      }
    };
  };
  function isRTL(element2) {
    return getComputedStyle2(element2).direction === "rtl";
  }
  var platform = {
    convertOffsetParentRelativeRectToViewportRelativeRect,
    getDocumentElement,
    getClippingRect,
    getOffsetParent,
    getElementRects,
    getClientRects,
    getDimensions,
    getScale,
    isElement,
    isRTL
  };
  var offset2 = offset;
  var shift2 = shift;
  var flip2 = flip;
  var computePosition2 = (reference, floating, options2) => {
    const cache = /* @__PURE__ */ new Map();
    const mergedOptions = options2 != null ? options2 : {};
    const platformWithCache = {
      ...platform,
      ...mergedOptions.platform,
      _c: cache
    };
    return computePosition(reference, floating, {
      ...mergedOptions,
      platform: platformWithCache
    });
  };

  // src/vendor/polish/emoticons.json
  var emoticons_default = [
    {
      title: "\u6D41\u884C",
      items: [
        {
          value: "[doge]",
          image: "https://i.imgur.com/HZL0hOa.png",
          url: "https://i.imgur.com/agAJ0Rd.png"
        },
        {
          value: "[\u8131\u5355doge]",
          image: "https://i.imgur.com/3mPhudo.png",
          url: "https://i.imgur.com/L62ZP7V.png"
        },
        {
          value: "[\u6253call]",
          image: "https://i.imgur.com/4GfTlV0.png",
          url: "https://i.imgur.com/pmNOo2w.png"
        },
        {
          value: "[\u661F\u661F\u773C]",
          image: "https://i.imgur.com/oEIJRru.png",
          url: "https://i.imgur.com/2spsghH.png"
        },
        {
          value: "[\u5403\u74DC]",
          image: "https://i.imgur.com/Gy3nwkC.png",
          url: "https://i.imgur.com/Ug1iMq4.png"
        },
        {
          value: "[OK]",
          image: "https://i.imgur.com/PE2dyjY.png",
          url: "https://i.imgur.com/6DMydmQ.png"
        },
        {
          value: "[\u54E6\u547C]",
          image: "https://i.imgur.com/CXXgF4E.png",
          url: "https://i.imgur.com/km62MY2.png"
        },
        {
          value: "[\u601D\u8003]",
          image: "https://i.imgur.com/eRJTCx7.png",
          url: "https://i.imgur.com/MAyk5GN.png"
        },
        {
          value: "[\u7591\u60D1]",
          image: "https://i.imgur.com/3gCygBS.png",
          url: "https://i.imgur.com/U3hKhrT.png"
        },
        {
          value: "[\u8FA3\u773C\u775B]",
          image: "https://i.imgur.com/A5WXoZJ.png",
          url: "https://i.imgur.com/n119Wvk.png"
        },
        {
          value: "[\u50B2\u5A07]",
          image: "https://i.imgur.com/m7IlCrD.png",
          url: "https://i.imgur.com/TkdeN49.png"
        },
        {
          value: "[\u6342\u8138]",
          image: "https://i.imgur.com/fLp3t8s.png",
          url: "https://i.imgur.com/14cwgsI.png"
        },
        {
          value: "[\u65E0\u8BED]",
          image: "https://i.imgur.com/wMfcBqD.png",
          url: "https://i.imgur.com/e1q9ScT.png"
        },
        {
          value: "[\u5927\u54ED]",
          image: "https://i.imgur.com/SNHJxtv.png",
          url: "https://i.imgur.com/YGIx7lh.png"
        },
        {
          value: "[\u9178\u4E86]",
          image: "https://i.imgur.com/wnQBodT.png",
          url: "https://i.imgur.com/5FDsp6L.png"
        },
        {
          value: "[\u6B6A\u5634]",
          image: "https://i.imgur.com/84ycU43.png",
          url: "https://i.imgur.com/XzEYBoY.png"
        },
        {
          value: "[\u8C03\u76AE]",
          image: "https://i.imgur.com/ggHTLzH.png",
          url: "https://i.imgur.com/O6ZZSLk.png"
        },
        {
          value: "[\u7B11\u54ED]",
          image: "https://i.imgur.com/h8edr5G.png",
          url: "https://i.imgur.com/NIvxivj.png"
        },
        {
          value: "[\u55D1\u74DC\u5B50]",
          image: "https://i.imgur.com/GMzq0tq.png",
          url: "https://i.imgur.com/rjR4rdr.png"
        },
        {
          value: "[\u559C\u6781\u800C\u6CE3]",
          image: "https://i.imgur.com/L1N27tb.png",
          url: "https://i.imgur.com/N9E3iZ2.png"
        },
        {
          value: "[\u60CA\u8BB6]",
          image: "https://i.imgur.com/cuzxGOI.png",
          url: "https://i.imgur.com/aptfuiN.png"
        },
        {
          value: "[\u7ED9\u5FC3\u5FC3]",
          image: "https://i.imgur.com/q663Mor.png",
          url: "https://i.imgur.com/4aXVwxJ.png"
        },
        {
          value: "[\u5446]",
          image: "https://i.imgur.com/xMXlmxm.png",
          url: "https://i.imgur.com/c1Q76Cd.png"
        },
        {
          value: "[\u8DEA\u4E86]",
          image: "https://i.imgur.com/0pjsMf0.png",
          url: "https://i.imgur.com/TYtySHv.png"
        },
        {
          value: "[\u54CD\u6307]",
          image: "https://i.imgur.com/nkoevMu.png",
          url: "https://i.imgur.com/Ac88cMm.png"
        },
        {
          value: "[\u54C7R]",
          image: "https://i.imgur.com/ngoi2I6.png",
          url: "https://i.imgur.com/OZySWIG.png"
        },
        {
          value: "[\u840C\u840C\u54D2R]",
          image: "https://i.imgur.com/vOHzwus.png",
          url: "https://i.imgur.com/Ue1kikn.png"
        },
        {
          value: "[\u5BB3\u7F9ER]",
          image: "https://i.imgur.com/1PeoVR5.png",
          url: "https://i.imgur.com/OVQjxIr.png"
        },
        {
          value: "[\u5077\u7B11R]",
          image: "https://i.imgur.com/WneGpK9.png",
          url: "https://i.imgur.com/aF7QiE5.png"
        },
        {
          value: "[\u54ED\u60F9R]",
          image: "https://i.imgur.com/0aOdQJd.png",
          url: "https://i.imgur.com/HgxsUD2.png"
        },
        {
          value: "[\u6C57\u989CR]",
          image: "https://i.imgur.com/O8alqc1.png",
          url: "https://i.imgur.com/jrVZoLi.png"
        },
        {
          value: "[\u8272\u8272R]",
          image: "https://i.imgur.com/mEGRKJy.png",
          url: "https://i.imgur.com/ZA1jRv1.png"
        },
        {
          value: "[\u62A0\u9F3BR]",
          image: "https://i.imgur.com/ErnQrMJ.png",
          url: "https://i.imgur.com/pYtTFnj.png"
        },
        {
          value: "[\u9119\u89C6R]",
          image: "https://i.imgur.com/StrGaFx.png",
          url: "https://i.imgur.com/LaO5dh3.png"
        },
        {
          value: "[\u4E70\u7206R]",
          image: "https://i.imgur.com/za9t585.png",
          url: "https://i.imgur.com/2JhZFtb.png"
        },
        {
          value: "[\u9ED1\u85AF\u95EE\u53F7R]",
          image: "https://i.imgur.com/i4Wgtyv.png",
          url: "https://i.imgur.com/aCjmFLD.png"
        },
        {
          value: "[\u6276\u5899R]",
          image: "https://i.imgur.com/PjhjZsJ.png",
          url: "https://i.imgur.com/RV7y6tR.png"
        },
        {
          value: "[\u8E72R]",
          image: "https://i.imgur.com/jdTq0YI.png",
          url: "https://i.imgur.com/t876WSv.png"
        },
        {
          value: "[\u53EFR]",
          image: "https://i.imgur.com/nRgXwUT.png",
          url: "https://i.imgur.com/I70yy88.png"
        },
        {
          value: "[\u516DR]",
          image: "https://i.imgur.com/cUVWKc2.png",
          url: "https://i.imgur.com/JqoC4L5.png"
        },
        {
          value: "[\u52A0\u4E00R]",
          image: "https://i.imgur.com/abBCCK9.png",
          url: "https://i.imgur.com/hpVvbVh.png"
        },
        {
          value: "[\u5E86\u795DR]",
          image: "https://i.imgur.com/lx6jrkm.png",
          url: "https://i.imgur.com/wQw2kD0.png"
        }
      ]
    },
    {
      title: "\u5C0F\u9EC4\u8138",
      items: [
        {
          value: "\u{1F600}",
          image: null,
          url: null
        },
        {
          value: "\u{1F601}",
          image: null,
          url: null
        },
        {
          value: "\u{1F602}",
          image: null,
          url: null
        },
        {
          value: "\u{1F923}",
          image: null,
          url: null
        },
        {
          value: "\u{1F605}",
          image: null,
          url: null
        },
        {
          value: "\u{1F60A}",
          image: null,
          url: null
        },
        {
          value: "\u{1F60B}",
          image: null,
          url: null
        },
        {
          value: "\u{1F618}",
          image: null,
          url: null
        },
        {
          value: "\u{1F970}",
          image: null,
          url: null
        },
        {
          value: "\u{1F617}",
          image: null,
          url: null
        },
        {
          value: "\u{1F929}",
          image: null,
          url: null
        },
        {
          value: "\u{1F914}",
          image: null,
          url: null
        },
        {
          value: "\u{1F928}",
          image: null,
          url: null
        },
        {
          value: "\u{1F610}",
          image: null,
          url: null
        },
        {
          value: "\u{1F611}",
          image: null,
          url: null
        },
        {
          value: "\u{1F644}",
          image: null,
          url: null
        },
        {
          value: "\u{1F60F}",
          image: null,
          url: null
        },
        {
          value: "\u{1F62A}",
          image: null,
          url: null
        },
        {
          value: "\u{1F62B}",
          image: null,
          url: null
        },
        {
          value: "\u{1F971}",
          image: null,
          url: null
        },
        {
          value: "\u{1F61C}",
          image: null,
          url: null
        },
        {
          value: "\u{1F612}",
          image: null,
          url: null
        },
        {
          value: "\u{1F614}",
          image: null,
          url: null
        },
        {
          value: "\u{1F628}",
          image: null,
          url: null
        },
        {
          value: "\u{1F630}",
          image: null,
          url: null
        },
        {
          value: "\u{1F631}",
          image: null,
          url: null
        },
        {
          value: "\u{1F975}",
          image: null,
          url: null
        },
        {
          value: "\u{1F621}",
          image: null,
          url: null
        },
        {
          value: "\u{1F973}",
          image: null,
          url: null
        },
        {
          value: "\u{1F97A}",
          image: null,
          url: null
        },
        {
          value: "\u{1F92D}",
          image: null,
          url: null
        },
        {
          value: "\u{1F9D0}",
          image: null,
          url: null
        },
        {
          value: "\u{1F60E}",
          image: null,
          url: null
        },
        {
          value: "\u{1F913}",
          image: null,
          url: null
        },
        {
          value: "\u{1F62D}",
          image: null,
          url: null
        },
        {
          value: "\u{1F911}",
          image: null,
          url: null
        },
        {
          value: "\u{1F92E}",
          image: null,
          url: null
        }
      ]
    },
    {
      title: "\u624B\u52BF",
      items: [
        {
          value: "\u{1F64B}",
          image: null,
          url: null
        },
        {
          value: "\u{1F64E}",
          image: null,
          url: null
        },
        {
          value: "\u{1F645}",
          image: null,
          url: null
        },
        {
          value: "\u{1F647}",
          image: null,
          url: null
        },
        {
          value: "\u{1F937}",
          image: null,
          url: null
        },
        {
          value: "\u{1F90F}",
          image: null,
          url: null
        },
        {
          value: "\u{1F449}",
          image: null,
          url: null
        },
        {
          value: "\u270C\uFE0F",
          image: null,
          url: null
        },
        {
          value: "\u{1F918}",
          image: null,
          url: null
        },
        {
          value: "\u{1F919}",
          image: null,
          url: null
        },
        {
          value: "\u{1F44C}",
          image: null,
          url: null
        },
        {
          value: "\u{1F90C}",
          image: null,
          url: null
        },
        {
          value: "\u{1F44D}",
          image: null,
          url: null
        },
        {
          value: "\u{1F44E}",
          image: null,
          url: null
        },
        {
          value: "\u{1F44B}",
          image: null,
          url: null
        },
        {
          value: "\u{1F91D}",
          image: null,
          url: null
        },
        {
          value: "\u{1F64F}",
          image: null,
          url: null
        },
        {
          value: "\u{1F44F}",
          image: null,
          url: null
        }
      ]
    },
    {
      title: "\u5E86\u795D",
      items: [
        {
          value: "\u2728",
          image: null,
          url: null
        },
        {
          value: "\u{1F389}",
          image: null,
          url: null
        },
        {
          value: "\u{1F38A}",
          image: null,
          url: null
        }
      ]
    },
    {
      title: "\u5176\u4ED6",
      items: [
        {
          value: "\u{1F47B}",
          image: null,
          url: null
        },
        {
          value: "\u{1F921}",
          image: null,
          url: null
        },
        {
          value: "\u{1F414}",
          image: null,
          url: null
        },
        {
          value: "\u{1F440}",
          image: null,
          url: null
        },
        {
          value: "\u{1F4A9}",
          image: null,
          url: null
        },
        {
          value: "\u{1F434}",
          image: null,
          url: null
        },
        {
          value: "\u{1F984}",
          image: null,
          url: null
        },
        {
          value: "\u{1F427}",
          image: null,
          url: null
        },
        {
          value: "\u{1F436}",
          image: null,
          url: null
        },
        {
          value: "\u{1F412}",
          image: null,
          url: null
        },
        {
          value: "\u{1F648}",
          image: null,
          url: null
        },
        {
          value: "\u{1F649}",
          image: null,
          url: null
        },
        {
          value: "\u{1F64A}",
          image: null,
          url: null
        },
        {
          value: "\u{1F435}",
          image: null,
          url: null
        }
      ]
    }
  ];

  // src/dom.js
  function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== void 0) node.textContent = text;
    if (className) node.className = className;
    return node;
  }
  function button(text, onClick) {
    const node = element("button", text, "normal button");
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
  function modal(title, hasFooter = false) {
    const mask = owned(element("div", void 0, "v2p-modal-mask"));
    const main = element("div", void 0, "v2p-modal-main");
    main.setAttribute("role", "dialog");
    main.setAttribute("aria-modal", "true");
    main.tabIndex = -1;
    const heading = element("div", title, "v2p-modal-title");
    heading.id = `vx-modal-${crypto.randomUUID()}`;
    main.setAttribute("aria-labelledby", heading.id);
    const actions = element("div", void 0, "v2p-modal-actions");
    const header = element("div", void 0, "v2p-modal-header");
    const content = element("div", void 0, "v2p-modal-content");
    const footer = element("div", void 0, hasFooter ? "v2p-modal-footer" : void 0);
    const previous = document.activeElement;
    const closeModal = () => {
      mask.remove();
      document.removeEventListener("keydown", onKey);
      if (!document.querySelector(".v2p-modal-mask"))
        document.body.classList.remove("v2p-modal-open");
      previous?.focus?.();
    };
    const onKey = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeModal();
      }
      if (event.key === "Tab") {
        const controls = [
          ...main.querySelectorAll('a[href],button,input,select,textarea,[tabindex="0"]')
        ].filter((node) => !node.disabled && !node.hidden);
        const first = controls[0], last = controls.at(-1);
        if (event.shiftKey && (document.activeElement === first || document.activeElement === main)) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    const close = button("\u5173\u95ED", closeModal);
    close.classList.add("v2p-modal-close-btn");
    close.append(element("kbd", "Esc"));
    close.setAttribute("aria-label", `Close ${title}`);
    actions.append(close);
    header.append(heading, actions);
    main.append(header, content, footer);
    mask.append(main);
    let down;
    mask.addEventListener("mousedown", (event) => {
      down = event.target;
    });
    mask.addEventListener("mouseup", (event) => {
      if (down === mask && event.target === mask) closeModal();
    });
    document.addEventListener("keydown", onKey);
    document.body.append(mask);
    document.body.classList.add("v2p-modal-open");
    main.focus({ preventScroll: true });
    return { root: mask, main, title: heading, actions, content, footer, close: closeModal };
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

  // src/emoji.js
  var pictures = new Map(
    emoticons_default.flatMap((group) => group.items).filter((item) => item.url).map((item) => [item.url, item.image])
  );
  var tokens = new Map(
    emoticons_default.flatMap((group) => group.items).filter((item) => item.url).map((item) => [item.value, item.url])
  );
  var emojiSources = /* @__PURE__ */ new Set([...pictures.keys(), ...pictures.values()]);
  function transformEmoji(text) {
    return text.replace(
      /\[[^\]]+\]/g,
      (token) => tokens.has(token) ? `${tokens.get(token)} ` : token
    );
  }
  function enhanceEmojis(root) {
    for (const image of matching(root, "img.embedded_image")) {
      const high = pictures.get(image.getAttribute("src"));
      if (high) image.src = high;
      if (emojiSources.has(image.getAttribute("src"))) {
        image.classList.add("v2p-emoji-img");
        image.style.width = "var(--v2p-emoji-size)";
        image.style.height = "var(--v2p-emoji-size)";
      }
    }
  }
  function initEmoji(options2) {
    const textarea = document.querySelector(
      'textarea#reply_content, #reply-box textarea, textarea[name="content"]'
    );
    if (!textarea || !options2.emoji) return;
    const submit = textarea.form?.querySelector('input[type="submit"],button[type="submit"]');
    if (!submit) return;
    const trigger = owned(button("", () => {
    }));
    trigger.setAttribute("aria-label", "Insert emoji");
    trigger.title = "Insert emoji";
    trigger.innerHTML = '<span style="width:18px;height:18px"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></svg></span>';
    submit.after(trigger);
    const popup = owned(element("div", void 0, "v2p-popup"));
    popup.hidden = true;
    popup.append(element("div", void 0, "v2p-popup-content"));
    (document.querySelector("#reply-box") ?? textarea.form).append(popup);
    let rendered = false, selection = [textarea.selectionStart, textarea.selectionEnd];
    const remember = () => {
      selection = [textarea.selectionStart, textarea.selectionEnd];
    };
    textarea.addEventListener("select", remember);
    textarea.addEventListener("keyup", remember);
    textarea.addEventListener("click", remember);
    textarea.addEventListener("input", remember);
    const close = () => {
      popup.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
    };
    trigger.setAttribute("aria-expanded", "false");
    trigger.addEventListener("click", () => {
      if (!popup.hidden) {
        close();
        return;
      }
      if (!rendered) {
        rendered = true;
        const container = element("div", void 0, "v2p-emoji-container"), box = element("div", void 0, "v2p-emoticons-box");
        for (const group of emoticons_default) {
          const section = element("div", void 0, "v2p-emoji-group"), list = element("div", void 0, "v2p-emoji-list");
          section.append(element("div", group.title, "v2p-emoji-title"), list);
          for (const item of group.items) {
            const choice = element("span", item.image ? void 0 : item.value, "v2p-emoji");
            choice.title = item.value;
            choice.tabIndex = 0;
            choice.setAttribute("role", "button");
            choice.setAttribute("aria-label", item.value);
            if (item.image) {
              const image = element("img");
              image.src = item.image;
              image.alt = item.value;
              image.loading = "lazy";
              choice.append(image);
            }
            const insert = () => {
              textarea.setRangeText(item.value, ...selection, "end");
              textarea.dispatchEvent(new Event("input", { bubbles: true }));
              textarea.focus();
              remember();
            };
            choice.addEventListener("click", insert);
            choice.addEventListener("keydown", (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                insert();
              }
            });
            list.append(choice);
          }
          box.append(section);
        }
        container.append(box);
        popup.append(container);
      }
      popup.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
      void computePosition2(trigger, popup, {
        placement: "right-end",
        middleware: [offset2({ mainAxis: 5, crossAxis: 5 }), flip2(), shift2({ padding: 8 })]
      }).then(({ x, y }) => {
        popup.style.left = `${x}px`;
        popup.style.top = `${y}px`;
      }).catch(close);
      textarea.focus();
    });
    document.addEventListener("click", (event) => {
      if (!popup.contains(event.target) && !trigger.contains(event.target)) close();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !popup.hidden) {
        event.preventDefault();
        close();
      }
    });
    textarea.form?.addEventListener(
      "submit",
      (event) => {
        if (!event.defaultPrevented) textarea.value = transformEmoji(textarea.value);
      },
      true
    );
  }

  // src/storage.js
  var PREFIX = "v2ex-lite:";
  var DEFAULT_IMGUR_CLIENT_ID = "3107b9ef8b316f3";
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
    emoji: true,
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
      set: (key, value) => write(`${PREFIX}${key}`, value),
      recordUpload(record) {
        const id = crypto.randomUUID();
        write(`${PREFIX}upload:${id}`, { ...record, id, createdAt: (/* @__PURE__ */ new Date()).toISOString() });
      },
      uploads() {
        return api.keys().filter((key) => key.startsWith(`${PREFIX}upload:`)).map((key) => api.get(key)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      }
    };
  }

  // src/members.js
  function createMembers(store2, options2) {
    const registered = /* @__PURE__ */ new WeakSet(), byName = /* @__PURE__ */ new Map();
    function edit(name) {
      const dialog = modal(`Tags: ${name}`, true);
      Object.assign(dialog.root.style, {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      });
      dialog.main.style.height = "auto";
      const form = element("div", void 0, "v2p-tag-input-wrapper");
      Object.assign(form.style, {
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "15px"
      });
      const label = element("label", "Separate tags with commas (up to 20). ");
      const input = element("textarea");
      input.className = "sl";
      input.rows = 4;
      input.style.width = "100%";
      input.value = store2.getTags(name).join(", ");
      label.append(input);
      const error = element("p");
      form.append(label, error);
      dialog.content.append(form);
      dialog.footer.append(
        button("Save", () => {
          try {
            store2.setTags(name, input.value);
            draw(name);
            dialog.close();
          } catch (cause) {
            error.textContent = cause.message;
          }
        })
      );
      input.focus();
    }
    function draw(name, only) {
      const groups = byName.get(name.toLowerCase());
      for (const group of only ? [only] : groups ?? []) {
        if (!group.isConnected) {
          groups?.delete(group);
          continue;
        }
        const tags = store2.getTags(name);
        group.replaceChildren();
        if (tags.length) group.append(element("b", "#"), `\xA0${tags.join("\uFF0C")}`);
        group.title = tags.join("\uFF0C");
        group.hidden = !tags.length;
      }
    }
    function enhance(root) {
      if (!options2.tags) return;
      for (const link of matching(root, 'strong a[href^="/member/"], .header a[href^="/member/"]')) {
        const name = memberName(link);
        if (!name || !link.textContent.trim() || registered.has(link) || link.closest("[data-vx-owned],#Rightbar,#Bottom"))
          continue;
        registered.add(link);
        const key = name.toLowerCase();
        const group = owned(
          element("div", void 0, "vx-tags v2p-reply-tags v2p-reply-tags-inline")
        );
        group.setAttribute("role", "button");
        group.tabIndex = 0;
        group.setAttribute("aria-label", `Edit tags for ${name}`);
        group.addEventListener("click", () => edit(name));
        group.addEventListener("keydown", (event) => {
          if (event.key === "Enter") edit(name);
        });
        const header = link.closest(".header");
        const author = link.closest("strong");
        const badges = author?.parentElement.querySelector(":scope > .badges");
        if (header) {
          group.classList.remove("v2p-reply-tags-inline");
          header.append(group);
        } else if (badges) badges.before(group);
        else (author ?? link).after(group);
        if (!byName.has(key)) {
          byName.set(key, /* @__PURE__ */ new Set());
          store2.watchTags(name, () => draw(name));
        }
        byName.get(key).add(group);
        draw(name, group);
      }
    }
    if (options2.userCards || options2.tags) initCards();
    function initCards() {
      const cache = /* @__PURE__ */ new Map();
      const popup = owned(element("div", void 0, "v2p-popup"));
      popup.hidden = true;
      const content = element("div", void 0, "v2p-popup-content");
      popup.append(content);
      document.body.append(popup);
      let timer, closeTimer, active, sequence = 0;
      function hide2() {
        clearTimeout(timer);
        popup.hidden = true;
        active = null;
        sequence++;
      }
      async function get(name) {
        const key = name.toLowerCase(), cached = cache.get(key);
        if (cached?.expires > Date.now()) return cached.promise;
        const promise = fetch(`/api/members/show.json?username=${encodeURIComponent(name)}`, {
          credentials: "same-origin",
          signal: AbortSignal.timeout(1e4)
        }).then(async (response) => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const data = await response.json();
          if (!data.username) throw new Error("Member unavailable.");
          return data;
        }).catch((error) => {
          cache.delete(key);
          throw error;
        });
        if (cache.size >= 100) cache.delete(cache.keys().next().value);
        cache.set(key, { promise, expires: Date.now() + 6e5 });
        return promise;
      }
      function render(name, data = {}) {
        const card = element("div", void 0, "v2p-member-card");
        const info = element("div", void 0, "v2p-info"), left = element("div", void 0, "v2p-info-left"), right = element("div", void 0, "v2p-info-right");
        const avatar = safeURL(data.avatar_large ?? data.avatar_normal, location.href, true);
        if (avatar) {
          const link2 = element("a", void 0, "v2p-avatar-box");
          link2.href = `/member/${name}`;
          const image = element("img", void 0, "v2p-avatar");
          image.src = avatar;
          image.alt = name;
          link2.append(image);
          left.append(link2);
        }
        const username = element("div", void 0, "v2p-username"), link = element("a", name);
        link.href = `/member/${name}`;
        username.append(link);
        right.append(username);
        right.append(
          element("div", data.id ? `V2EX member #${data.id}` : "Loading member...", "v2p-no")
        );
        right.append(
          element(
            "div",
            data.created ? `Joined: ${new Date(data.created * 1e3).toLocaleDateString()}` : "",
            "v2p-created-date"
          )
        );
        info.append(left, right);
        card.append(info);
        if (data.bio) card.append(element("div", data.bio, "v2p-bio"));
        if (options2.tags) {
          const actions = element("div", void 0, "v2p-member-card-actions");
          const control = button("Set user tags", () => {
            hide2();
            edit(name);
          });
          control.classList.add("v2p-btn-small");
          actions.append(control);
          card.append(actions);
        }
        content.replaceChildren(card);
      }
      function position(anchor) {
        void computePosition2(anchor, popup, {
          placement: "bottom-start",
          middleware: [offset2({ mainAxis: 5, crossAxis: 5 }), flip2(), shift2({ padding: 8 })]
        }).then(({ x, y }) => {
          popup.style.left = `${x}px`;
          popup.style.top = `${y}px`;
        }).catch(hide2);
      }
      document.addEventListener("pointerover", (event) => {
        clearTimeout(closeTimer);
        if (popup.contains(event.target) || event.target.closest?.(".v2p-modal-mask")) return;
        const link = event.target.closest?.('a[href^="/member/"]'), image = event.target.closest?.("img.avatar");
        const name = memberName(link) ?? (/^[a-z0-9_-]{1,64}$/i.test(image?.alt ?? "") ? image.alt : null), anchor = link ?? image;
        if (!name || !anchor || anchor === active) return;
        hide2();
        active = anchor;
        const request = sequence;
        timer = setTimeout(async () => {
          render(name);
          popup.hidden = false;
          position(anchor);
          if (!options2.userCards) return;
          try {
            const data = await get(name);
            if (request !== sequence) return;
            render(name, data);
            position(anchor);
          } catch (error) {
            if (request === sequence) content.append(element("p", error.message));
          }
        }, 350);
      });
      document.addEventListener("pointerout", (event) => {
        if (event.relatedTarget && (popup.contains(event.relatedTarget) || active?.contains(event.relatedTarget)))
          return;
        closeTimer = setTimeout(hide2, 350);
      });
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") hide2();
      });
      window.addEventListener("scroll", hide2, { passive: true });
    }
    return { enhance, edit };
  }

  // src/preview.js
  function createTopics(options2, themeCSS2 = "") {
    const seen = /* @__PURE__ */ new WeakSet();
    return {
      enhance(root) {
        for (const link of matching(
          root,
          ".item_title a[href], a.topic-link[href], .item_hot_topic_title > a[href]"
        )) {
          if (seen.has(link)) continue;
          seen.add(link);
          const url = new URL(link.href, location.href);
          if (url.origin !== location.origin || !/^\/t\/\d+\/?$/.test(url.pathname)) continue;
          if (options2.newTab) {
            link.target = "_blank";
            link.rel = "noopener noreferrer";
          }
          if (!options2.preview) continue;
          const trigger = owned(
            button("\u9884\u89C8", () => {
              const dialog = modal(link.textContent);
              const titleLink = element("a", link.textContent, "v2p-topic-preview-title-link");
              titleLink.title = link.textContent;
              titleLink.href = url.href;
              titleLink.target = options2.newTab ? "_blank" : "_self";
              titleLink.rel = "noopener noreferrer";
              dialog.title.replaceChildren(titleLink);
              const original = element("a", "\u8FDB\u5165\u4E3B\u9898", "normal button special");
              original.href = url.href;
              original.target = options2.newTab ? "_blank" : "_self";
              original.rel = "noopener noreferrer";
              dialog.actions.prepend(original);
              const frame = element("iframe", void 0, "v2p-topic-preview-frame");
              frame.title = link.textContent;
              const previewURL = new URL(url.href);
              previewURL.searchParams.set("v2p-preview", "1");
              frame.src = previewURL.href;
              const wrapper = element("div", void 0, "v2p-topic-preview-wrapper");
              wrapper.append(frame);
              dialog.content.append(wrapper);
              frame.addEventListener("load", () => {
                try {
                  const doc = frame.contentDocument;
                  if (!doc?.querySelector("#Main")) return;
                  applyTheme(doc, true);
                  const style = doc.createElement("style");
                  style.textContent = themeCSS2;
                  doc.head.append(style);
                  enhanceEmojis(doc);
                  syncOnce(doc);
                } catch {
                }
              });
            })
          );
          trigger.className = "v2p-topic-preview-btn";
          const item = link.closest(".cell");
          const info = item?.querySelector(".topic_info");
          if (info) {
            const actions = owned(element("span", void 0, "v2p-topic-actions"));
            actions.append(trigger);
            const anchor = info.querySelector(":scope > span:first-of-type");
            if (anchor) anchor.after(actions);
            else info.append(actions);
          } else if (link.parentElement.matches(".item_hot_topic_title")) {
            link.parentElement.append(trigger);
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
      ...header.querySelectorAll('img[alt="\u2764\uFE0F"],img[src*="heart"],.v2p-icon-heart')
    ].find((image) => image.closest(REPLY) === node && !image.closest(".reply_content"));
    const text = heart?.nextSibling?.textContent ?? node.querySelector(".thank_count")?.textContent ?? "";
    return Number.parseInt(text.replace(/,/g, "").match(/\d+/)?.[0] ?? "0", 10);
  }
  function parseReply(node) {
    if (!/^r_\d+$/.test(node.id)) return null;
    return {
      id: node.id,
      node,
      name: memberName(node.querySelector('strong a[href^="/member/"]')) ?? "unknown",
      floor: Number.parseInt(node.querySelector(".no")?.textContent ?? "0", 10) || Number(node.id.slice(2)),
      thanks: thanksCount(node)
    };
  }
  function rankReplies(replies, limit = Infinity) {
    return [...replies].filter((reply) => reply.thanks > 0).sort((a, b) => b.thanks - a.thanks || a.floor - b.floor).slice(0, limit);
  }
  function pageCount(doc, path) {
    const pages = [Number(new URL(location.href).searchParams.get("p")) || 1];
    for (const link of doc.querySelectorAll('a[href*="p="]')) {
      const url = new URL(link.getAttribute("href"), location.href);
      const page = Number(url.searchParams.get("p"));
      if (url.origin === location.origin && url.pathname === path && Number.isInteger(page) && page > 0 && page <= 1e5)
        pages.push(page);
    }
    for (const input of doc.querySelectorAll("input.page_input[max]"))
      if (Number(input.max) > 0 && Number(input.max) <= 1e5) pages.push(Number(input.max));
    return Math.max(...pages);
  }
  function importReply(row, base) {
    const copy = row.cloneNode(true);
    for (const node of copy.querySelectorAll(
      "script,style,iframe,object,embed,link,meta,base,form,input,button"
    ))
      node.remove();
    for (const node of [copy, ...copy.querySelectorAll("*")]) {
      for (const attr of [...node.attributes]) {
        if (/^on/i.test(attr.name) || ["srcdoc", "style", "srcset", "name"].includes(attr.name))
          node.removeAttribute(attr.name);
      }
      for (const attr of ["href", "src"]) {
        if (!node.hasAttribute(attr)) continue;
        const value = safeURL(node.getAttribute(attr), base, attr === "src");
        if (value) node.setAttribute(attr, value);
        else node.removeAttribute(attr);
      }
      if (node.tagName === "IMG") node.loading = "lazy";
    }
    for (const actions of copy.querySelectorAll(".thank_area,.v2p-controls")) actions.remove();
    return copy;
  }
  function cloneTopReply(reply) {
    const cloned = reply.node.cloneNode(true);
    cloned.id = `top_${reply.id}`;
    for (const child of cloned.querySelectorAll(".cell,.v2p-topic-reply-ref,.nested")) child.remove();
    const floor2 = cloned.querySelector(".no");
    const toolbox = cloned.querySelector(".fr") ?? floor2?.parentElement;
    if (floor2 && toolbox) {
      const jump = element("a", floor2.textContent, "no");
      jump.href = `#${reply.id}`;
      jump.addEventListener("click", (event) => {
        event.preventDefault();
        reply.node.scrollIntoView({ block: "start" });
      });
      toolbox.replaceChildren(jump);
    }
    for (const node of cloned.querySelectorAll("[id]")) node.removeAttribute("id");
    const table = cloned.firstElementChild;
    if (table?.tagName === "TABLE") {
      const wrapper = element("div", void 0, "vr_wrapper");
      table.after(wrapper);
      wrapper.append(table);
    }
    const info = cloned.querySelector("td > .flex-one-row .flex-one-row:first-child");
    if (info) {
      const wrapper = element("div", void 0, "flex-one-row gap10");
      wrapper.style.width = "100%";
      for (const child of [...info.children]) if (child.tagName !== "STRONG") wrapper.append(child);
      info.append(wrapper);
    }
    return cloned;
  }
  function initReplies({ options: options2, getDocument, enhance }) {
    if (!/^\/t\/\d+\/?$/.test(location.pathname)) return null;
    const first = document.querySelector(`#Main ${REPLY}`);
    if (!first) return null;
    const container = first.parentElement;
    const replies = /* @__PURE__ */ new Map();
    const current = Number(new URL(location.href).searchParams.get("p")) || 1;
    const loaded = /* @__PURE__ */ new Set([current]);
    let total = pageCount(document, location.pathname), next = current + 1, busy = false, signature = "";
    let panel;
    const toolbar = owned(element("div", void 0, "cell"));
    toolbar.dataset.vxPaging = "";
    const status = element("span");
    status.setAttribute("role", "status");
    const loadButton = button("Load next page", () => void loadNext());
    toolbar.append(status, loadButton);
    container.append(toolbar);
    function render() {
      toolbar.hidden = !busy && next > total;
      loadButton.hidden = next > total;
      loadButton.disabled = busy;
      if (!options2.hotReplies) return;
      const ranked = rankReplies(replies.values());
      const key = ranked.map((reply) => `${reply.id}:${reply.thanks}`).join("|");
      if (key === signature && panel) return;
      signature = key;
      panel?.previousElementSibling?.matches("[data-vx-hot-gap]") && panel.previousElementSibling.remove();
      panel?.remove();
      panel = null;
      if (!ranked.length) return;
      panel = owned(element("div", void 0, "box"));
      panel.id = "top_replies";
      const header = element("div", void 0, "cell");
      header.title = "Ranked by thanks on loaded pages.";
      header.append(
        element("div", void 0, "fr"),
        element("span", "\u5F53\u524D\u9875\u70ED\u95E8\u56DE\u590D", "fade")
      );
      panel.append(header, ...ranked.map(cloneTopReply));
      const anchor = document.querySelector("#Rightbar .box");
      if (anchor) {
        const gap = owned(element("div", void 0, "sep20"));
        gap.dataset.vxHotGap = "";
        anchor.after(gap, panel);
        document.querySelector("#Wrapper")?.classList.add("sticky_rightbar");
      }
    }
    function add(root) {
      let changed = false;
      for (const node of matching(root, REPLY)) {
        if (!node.closest("#Main") || replies.has(node.id)) continue;
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
      status.textContent = "Loading replies... ";
      render();
      const page = next;
      try {
        const url = new URL(location.href);
        url.search = "";
        url.searchParams.set("p", String(page));
        const doc = await getDocument(url.href);
        const rows = [...doc.querySelectorAll(`#Main ${REPLY}`)];
        if (!rows.length) throw new Error("No replies found. Open this page directly to verify it.");
        total = Math.max(total, pageCount(doc, location.pathname));
        const fragment = document.createDocumentFragment();
        const added = [];
        for (const row of rows) {
          if (replies.has(row.id)) continue;
          const clean = importReply(row, url.href);
          for (const child of [...clean.querySelectorAll(REPLY)])
            if (replies.has(child.id)) child.remove();
          for (const node of matching(clean, REPLY)) {
            const reply = parseReply(node);
            if (reply) replies.set(reply.id, reply);
          }
          clean.dataset.vxLoaded = "";
          fragment.append(clean);
          added.push(clean);
        }
        toolbar.before(fragment);
        for (const row of added) enhance(row);
        loaded.add(page);
        next++;
        status.textContent = "";
        return true;
      } catch (error) {
        status.textContent = `Could not load replies: ${error.message} `;
        return false;
      } finally {
        busy = false;
        render();
      }
    }
    add(document);
    render();
    return {
      add,
      replies,
      loaded,
      update(node) {
        const reply = replies.get(node.id);
        if (reply && !node.hasAttribute("data-vx-loaded")) {
          const count = thanksCount(node);
          if (count !== reply.thanks) {
            reply.thanks = count;
            render();
          }
        }
      },
      async preload() {
        for (let index = 0; index < options2.preloadPages; index++) if (!await loadNext()) break;
      }
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
              const inline2 = [...doc.querySelectorAll("input[onclick], button[onclick]")].map(
                (node) => /["'](\/mission\/daily\/redeem\?once=\d+)["']/.exec(
                  node.getAttribute("onclick")
                )?.[1]
              ).find(Boolean);
              const path = link?.getAttribute("href") ?? inline2;
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
    const offset3 = textarea.value.indexOf(marker);
    if (offset3 < 0) return false;
    const start2 = textarea.selectionStart;
    const end = textarea.selectionEnd;
    textarea.setRangeText(replacement, offset3, offset3 + marker.length, "preserve");
    const adjust = (position) => position <= offset3 ? position : position >= offset3 + marker.length ? position + replacement.length - marker.length : offset3 + replacement.length;
    textarea.setSelectionRange(adjust(start2), adjust(end));
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    return true;
  }
  function uploadImage(file, clientId = DEFAULT_IMGUR_CLIENT_ID, request = GM_xmlhttpRequest) {
    clientId ||= DEFAULT_IMGUR_CLIENT_ID;
    if (!/^[a-z0-9]{1,64}$/i.test(clientId))
      return Promise.reject(new Error("Invalid Imgur Client ID."));
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
            if (response.status === 429 || response.status === 403 && /rate.?limit|quota|credits/i.test(response.responseText)) {
              const retry = /^retry-after:\s*(.+)$/im.exec(response.responseHeaders ?? "")?.[1]?.trim();
              const delay = Number(retry) > 0 ? Number(retry) * 1e3 : Date.parse(retry) - Date.now();
              const error = new Error(
                "Imgur rate limit reached. Upload queue stopped; no automatic retry."
              );
              error.rateLimited = true;
              error.retryAt = Date.now() + (Number.isFinite(delay) && delay > 0 ? delay : 36e5);
              throw error;
            }
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
  function openUploadHistory(store2) {
    const dialog = modal("Upload history");
    const content = element("div", void 0, "v2p-topic-preview");
    const records = store2.uploads();
    if (!records.length) content.append(element("p", "No saved uploads."));
    for (const record of records) {
      const row = element("div", void 0, "cell");
      row.append(element("p", `${record.createdAt} \xB7 ${record.fileName}`));
      const url = safeURL(record.link, "https://i.imgur.com", true);
      if (url && new URL(url).hostname === "i.imgur.com") {
        const link = element("a", url);
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        row.append(link);
      }
      if (/^[a-z0-9]+$/i.test(record.deleteHash ?? "")) {
        const link = element("a", " Delete image");
        link.href = `https://imgur.com/delete/${record.deleteHash}`;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        row.append(" \xB7 ", link);
      }
      content.append(row);
    }
    dialog.content.append(content);
  }
  function initUpload(options2, store2, request = GM_xmlhttpRequest) {
    const textarea = document.querySelector(
      'textarea#reply_content, #reply-box textarea, textarea[name="content"]'
    );
    if (!textarea || !options2.upload) return;
    const toolbar = owned(element("div", void 0, "vx-upload"));
    const input = element("input");
    input.type = "file";
    input.accept = "image/png,image/jpeg,image/gif,image/webp";
    input.multiple = true;
    Object.assign(input.style, {
      visibility: "hidden",
      position: "absolute",
      top: "0",
      left: "0",
      width: "0",
      height: "0"
    });
    const messages = element("div");
    messages.setAttribute("aria-live", "polite");
    const pick = owned(element("a", " + \u63D2\u5165\u56FE\u7247", "vr_upload_image"));
    pick.tabIndex = 0;
    pick.setAttribute("role", "button");
    pick.setAttribute("aria-label", "Upload images to Imgur");
    pick.style.paddingLeft = "10px";
    pick.title = "Uploads images to public Imgur hosting.";
    pick.addEventListener("click", () => input.click());
    pick.addEventListener("keydown", (event) => {
      if (event.key === "Enter") input.click();
    });
    const appendPosition = document.querySelector("#reply-box > div > div") ?? textarea.form;
    appendPosition?.append(pick);
    toolbar.append(input, messages);
    textarea.after(toolbar);
    let queue = Promise.resolve();
    let pending = 0;
    let pausedUntil = store2.get("upload-paused-until", 0);
    const paused = () => Math.max(pausedUntil, store2.get("upload-paused-until", 0)) > Date.now();
    function enqueue(files) {
      const images = [...files].filter((file) => file.type.startsWith("image/"));
      if (!images.length) return false;
      if (paused()) {
        messages.textContent = "Imgur uploads paused after rate limiting. Try again later.";
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
          if (paused()) {
            replacePlaceholder(textarea, marker, "");
            row.textContent = "Queued upload cancelled after rate limiting.";
            pending--;
            return;
          }
          row.textContent = `${file.name || "Pasted image"}: uploading...`;
          try {
            const result = await uploadImage(file, options2.imgurClientId, request);
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
            try {
              store2.recordUpload({ ...result, fileName: file.name || "Pasted image" });
            } catch {
              row.append(
                " Upload history could not be saved. Save this deletion link before leaving."
              );
            }
          } catch (error) {
            if (error.rateLimited) {
              pausedUntil = error.retryAt;
              try {
                store2.set("upload-paused-until", error.retryAt);
              } catch {
              }
            }
            replacePlaceholder(textarea, marker, "");
            row.textContent = `${file.name || "Pasted image"}: ${error.message}${error.rateLimited ? "" : " Select the file again to retry."}`;
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
    dialog.root.id = "vx-settings-dialog";
    const form = element("form");
    form.className = "v2p-topic-preview";
    const fields = /* @__PURE__ */ new Map();
    function field(key, label, control) {
      const wrapper = element("div", void 0, "cell");
      const caption = element("label", `${label} `);
      caption.append(control);
      wrapper.append(caption);
      form.append(wrapper);
      fields.set(key, control);
    }
    const names = {
      privacy: "Privacy mode (hide account, logo and tab identity)",
      newTab: "Open topics in a new tab",
      preview: "Topic body previews",
      userCards: "Hover member cards",
      tags: "User tags",
      hotReplies: "Popular replies sidebar",
      autoCheckIn: "Daily check-in on page open / returning to a visible tab",
      upload: "Image upload, paste and drop",
      emoji: "Polish emoji picker"
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
    client.placeholder = "Built-in shared Client ID";
    field("imgurClientId", "Custom Imgur Client ID (optional)", client);
    const message = element("p");
    message.setAttribute("aria-live", "polite");
    const save = element("button", "Save and reload", "normal button special");
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
    const backup = element("div", void 0, "v2p-topic-preview");
    backup.append(
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
    dialog.content.append(form, backup);
    dialog.actions.prepend(
      button("Upload history", () => {
        dialog.close();
        openUploadHistory(store2);
      })
    );
  }
  function installSettings(store2) {
    const footer = owned(element("div", void 0, "v2p-footer"));
    footer.append(element("div", "V2EX Lite \xB7 V2EX Polish", "v2p-footer-text"));
    const links = element("div", void 0, "v2p-footer-links");
    const entry = element("a", "Settings", "v2p-footer-link v2p-hover-btn");
    entry.href = "#";
    entry.addEventListener("click", (event) => {
      event.preventDefault();
      openSettings(store2);
    });
    entry.id = "vx-settings";
    const uploads = element("a", "Upload history", "v2p-footer-link v2p-hover-btn");
    uploads.href = "#";
    uploads.addEventListener("click", (event) => {
      event.preventDefault();
      openUploadHistory(store2);
    });
    links.append(entry, uploads);
    footer.append(links);
    (document.querySelector("#Bottom .content") ?? document.body).append(footer);
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
  var themeCSS = `${theme_default}
${styles_default}`;
  GM_addStyle(themeCSS);
  applyTheme();
  function start() {
    applyTheme();
    const name = currentUser();
    if (options.privacy) {
      for (const icon of document.querySelectorAll('link[rel~="icon"]'))
        icon.href = "https://v2p.leoku.dev/favicon.svg";
      for (const link of document.querySelectorAll('#Top a[href^="/member/"]')) link.remove();
      const logo = document.querySelector("#Logo");
      if (logo) {
        logo.classList.add("v2p-logo");
        logo.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>';
      }
      if (name) {
        const account = [...document.querySelectorAll('#Rightbar a[href^="/member/"]')].find(
          (link) => link.getAttribute("href").toLowerCase() === `/member/${name.toLowerCase()}`
        );
        const box = account?.closest(".box");
        for (const link of box?.querySelectorAll('a[href^="/member/"]') ?? [])
          link.classList.add("v2p-hide-account");
        box?.querySelector(".balance_area")?.classList.add("v2p-hide-balance");
      }
    }
    const getDocument = createHTTP();
    const members = createMembers(store, options);
    const topics = createTopics(options, themeCSS);
    const enhance = (root) => {
      members.enhance(root);
      topics.enhance(root);
      enhanceEmojis(root);
    };
    enhance(document);
    const replies = initReplies({ options, getDocument, enhance });
    installSettings(store);
    initUpload(options, store);
    initEmoji(options);
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
