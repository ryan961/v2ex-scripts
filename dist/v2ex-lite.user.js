// ==UserScript==
// @name         V2EX Lite
// @namespace    https://github.com/ryan961/v2ex-scripts
// @version      0.1.12
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
// @grant        GM_deleteValue
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

ISC License

Copyright (c) 2026 Lucide Icons and Contributors

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

---

The following Lucide icons are derived from the Feather project:

airplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, x-circle, x-octagon, x-square, x, zoom-in, zoom-out

The MIT License (MIT) (for the icons listed above)

Copyright (c) 2013-present Cole Bemis

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
  var theme_default = '@charset "UTF-8";\n/* V2EX Polish c8f1b70; Copyright (c) 2023-present LeoKu and contributors.\n * MIT; see licenses/v2ex-polish-MIT.txt. Font overrides removed as requested.\n */\n:root {\n  --zidx-search: 100;\n  --zidx-tabs: 10;\n  --zidx-tools-card: 10;\n  --zidx-reply-box: 99;\n  --zidx-modal-header: 50;\n  --zidx-modal-mask: 888;\n  --zidx-toast: 999;\n  --zidx-tip: 999;\n  --zidx-popup: 99;\n  --zidx-expand-mask: 10;\n  --zidx-expand-btn: 20;\n  --zidx-rightbar: 99;\n  --v2p-spacing-box: 12px;\n  --v2p-spacing-cell: 10px;\n  --v2p-underline-offset: 0.5ex;\n  --v2p-layout-column-gap: 25px;\n  --v2p-layout-row-gap: 20px;\n  --v2p-nav-height: 55px;\n  --v2p-tp-item-x: 20px;\n  --v2p-tp-item-y: 10px;\n  --v2p-tp-tabs-pd: 10px;\n  --v2p-tp-nested-pd: 15px;\n  --v2p-tp-preview-pd: 20px;\n  --v2p-emoji-size: 21px;\n  --v2p-box-radius: 10px;\n  --v2p-input-radius: 6px;\n  --v2p-button-radius: 6px;\n  --v2p-popup-radius: 6px;\n  --v2p-content-width: 1120px;\n  --v2p-rightbar-width: 270px;\n  --v2p-color-main-50: #f7f9fb;\n  --v2p-color-main-100: #f1f5f9;\n  --v2p-color-main-150: #eaeff5;\n  --v2p-color-main-200: #e2e8f0;\n  --v2p-color-main-300: #cbd5e1;\n  --v2p-color-main-350: #94a3b8cc;\n  --v2p-color-main-400: #94a3b8;\n  --v2p-color-main-500: #64748b;\n  --v2p-color-main-600: #475569;\n  --v2p-color-main-700: #334155;\n  --v2p-color-main-800: #1e293b;\n  --v2p-color-accent-50: oklch(97.9% 0.021 166.113deg);\n  --v2p-color-accent-100: oklch(95% 0.052 163.051deg);\n  --v2p-color-accent-200: oklch(90.5% 0.093 164.15deg);\n  --v2p-color-accent-300: oklch(84.5% 0.143 164.978deg);\n  --v2p-color-accent-400: oklch(76.5% 0.177 163.223deg);\n  --v2p-color-accent-500: oklch(69.6% 0.17 162.48deg);\n  --v2p-color-accent-600: oklch(59.6% 0.145 163.225deg);\n  --v2p-color-accent-700: oklch(50.8% 0.118 165.612deg);\n  --v2p-color-orange-50: #fff7ed;\n  --v2p-color-orange-100: #ffedd5;\n  --v2p-color-orange-400: #fb923c;\n  --v2p-color-background: #f2f3f5;\n  --v2p-color-foreground: var(--v2p-color-main-800);\n  --v2p-color-selection-foreground: var(--v2p-color-main-100);\n  --v2p-color-selection-background: var(--v2p-color-main-700);\n  --v2p-color-selection-background-img: var(--v2p-color-main-500);\n  --v2p-color-font-secondary: var(--v2p-color-main-600);\n  --v2p-color-font-tertiary: var(--v2p-color-main-500);\n  --v2p-color-font-quaternary: var(--v2p-color-main-400);\n  --v2p-color-button-background: var(--v2p-color-main-100);\n  --v2p-color-button-foreground: var(--v2p-color-main-500);\n  --v2p-color-button-background-hover: var(--v2p-color-main-200);\n  --v2p-color-button-foreground-hover: var(--v2p-color-main-600);\n  --v2p-color-button-border: var(--v2p-color-main-300);\n  --v2p-color-button-special-background: var(--v2p-color-accent-50);\n  --v2p-color-button-special-foreground: var(--v2p-color-accent-700);\n  --v2p-color-button-special-border: var(--v2p-color-accent-600);\n  --v2p-color-button-special-foreground-hover: var(--v2p-color-accent-700);\n  --v2p-color-bg-content: #fff;\n  --v2p-color-bg-footer: var(--v2p-color-bg-content);\n  --v2p-color-bg-hover-btn: rgb(226 232 240 / 70%);\n  --v2p-color-bg-subtle: rgb(236 253 245 / 90%);\n  --v2p-color-bg-input: var(--v2p-color-main-50);\n  --v2p-color-bg-search: var(--v2p-color-main-100);\n  --v2p-color-bg-search-active: var(--v2p-color-main-150);\n  --v2p-color-bg-widget: rgb(255 255 255 / 70%);\n  --v2p-color-bg-reply: var(--v2p-color-main-100);\n  --v2p-color-bg-tooltip: var(--v2p-color-bg-content);\n  --v2p-color-bg-tabs: var(--v2p-color-main-100);\n  --v2p-color-bg-tpr: var(--v2p-color-main-100);\n  --v2p-color-bg-avatar: var(--v2p-color-main-300);\n  --v2p-color-bg-block: var(--v2p-color-main-100);\n  --v2p-color-bg-block-darker: var(--v2p-color-main-300);\n  --v2p-color-bg-link: var(--v2p-color-main-100);\n  --v2p-color-bg-link-hover: var(--v2p-color-main-200);\n  --v2p-color-bg-error: #fee2e2;\n  --v2p-color-tabs: var(--v2p-color-foreground);\n  --v2p-color-heart: #ef4444;\n  --v2p-color-heart-fill: #fee2e2;\n  --v2p-color-mask: rgb(0 0 0 / 25%);\n  --v2p-color-divider: var(--v2p-color-main-200);\n  --v2p-color-border: var(--v2p-color-main-200);\n  --v2p-color-input-border: var(--v2p-color-main-300);\n  --v2p-color-input-border-focus: var(--v2p-color-main-400);\n  --v2p-color-border-darker: var(--v2p-color-main-300);\n  --v2p-color-link-visited: var(--v2p-color-main-400);\n  --v2p-color-error: #ef4444;\n  --v2p-color-cell-num: var(--v2p-color-main-350);\n  --v2p-color-badge: var(--v2p-color-bg-content);\n  --v2p-box-shadow: 0 3px 5px 0 rgb(0 0 0 / 4%);\n  --v2p-widget-shadow: 0 9px 24px -3px rgb(0 0 0 / 6%), 0 4px 8px -1px rgb(0 0 0 /12%);\n  --v2p-toast-shadow:\n    0 6px 16px 0 rgb(0 0 0 / 8%), 0 3px 6px -4px rgb(0 0 0 / 12%), 0 9px 28px 8px rgb(0 0 0 / 5%);\n  --color-fade: var(--v2p-color-font-secondary);\n  --color-gray: var(--v2p-color-font-secondary);\n  --link-color: var(--v2p-color-foreground);\n  --link-darker-color: var(--v2p-color-main-600);\n  --link-hover-color: var(--v2p-color-foreground);\n  --link-caution-color: var(--v2p-color-orange-400);\n  --link-visited-color: currentColor;\n  --box-border-color: var(--v2p-color-border);\n  --box-foreground-color: var(--v2p-color-foreground);\n  --box-background-color: var(--v2p-color-bg-content);\n  --box-background-alt-color: var(--v2p-color-main-100);\n  --box-background-hover-color: var(--v2p-color-main-200);\n  --box-border-focus-color: var(--v2p-color-main-200);\n  --box-border-radius: var(--v2p-box-radius);\n  --button-background-color: var(--v2p-color-button-background);\n  --button-foreground-color: var(--v2p-color-button-foreground);\n  --button-hover-color: var(--v2p-color-button-background-hover);\n  --button-background-hover-color: var(--v2p-color-button-background-hover);\n  --button-foreground-hover-color: var(--v2p-color-button-foreground-hover);\n  --button-border-color: var(--v2p-color-main-300);\n  --button-border-hover-color: var(--v2p-color-main-400);\n}\n:root body {\n  --v2p-color-main-50: #f7f9fb;\n  --v2p-color-main-100: #f1f5f9;\n  --v2p-color-main-150: #eaeff5;\n  --v2p-color-main-200: #e2e8f0;\n  --v2p-color-main-300: #cbd5e1;\n  --v2p-color-main-350: #94a3b8cc;\n  --v2p-color-main-400: #94a3b8;\n  --v2p-color-main-500: #64748b;\n  --v2p-color-main-600: #475569;\n  --v2p-color-main-700: #334155;\n  --v2p-color-main-800: #1e293b;\n  --v2p-color-accent-50: oklch(97.9% 0.021 166.113deg);\n  --v2p-color-accent-100: oklch(95% 0.052 163.051deg);\n  --v2p-color-accent-200: oklch(90.5% 0.093 164.15deg);\n  --v2p-color-accent-300: oklch(84.5% 0.143 164.978deg);\n  --v2p-color-accent-400: oklch(76.5% 0.177 163.223deg);\n  --v2p-color-accent-500: oklch(69.6% 0.17 162.48deg);\n  --v2p-color-accent-600: oklch(59.6% 0.145 163.225deg);\n  --v2p-color-accent-700: oklch(50.8% 0.118 165.612deg);\n  --v2p-color-orange-50: #fff7ed;\n  --v2p-color-orange-100: #ffedd5;\n  --v2p-color-orange-400: #fb923c;\n  --v2p-color-background: #f2f3f5;\n  --v2p-color-foreground: var(--v2p-color-main-800);\n  --v2p-color-selection-foreground: var(--v2p-color-main-100);\n  --v2p-color-selection-background: var(--v2p-color-main-700);\n  --v2p-color-selection-background-img: var(--v2p-color-main-500);\n  --v2p-color-font-secondary: var(--v2p-color-main-600);\n  --v2p-color-font-tertiary: var(--v2p-color-main-500);\n  --v2p-color-font-quaternary: var(--v2p-color-main-400);\n  --v2p-color-button-background: var(--v2p-color-main-100);\n  --v2p-color-button-foreground: var(--v2p-color-main-500);\n  --v2p-color-button-background-hover: var(--v2p-color-main-200);\n  --v2p-color-button-foreground-hover: var(--v2p-color-main-600);\n  --v2p-color-button-border: var(--v2p-color-main-300);\n  --v2p-color-button-special-background: var(--v2p-color-accent-50);\n  --v2p-color-button-special-foreground: var(--v2p-color-accent-700);\n  --v2p-color-button-special-border: var(--v2p-color-accent-600);\n  --v2p-color-button-special-foreground-hover: var(--v2p-color-accent-700);\n  --v2p-color-bg-content: #fff;\n  --v2p-color-bg-footer: var(--v2p-color-bg-content);\n  --v2p-color-bg-hover-btn: rgb(226 232 240 / 70%);\n  --v2p-color-bg-subtle: rgb(236 253 245 / 90%);\n  --v2p-color-bg-input: var(--v2p-color-main-50);\n  --v2p-color-bg-search: var(--v2p-color-main-100);\n  --v2p-color-bg-search-active: var(--v2p-color-main-150);\n  --v2p-color-bg-widget: rgb(255 255 255 / 70%);\n  --v2p-color-bg-reply: var(--v2p-color-main-100);\n  --v2p-color-bg-tooltip: var(--v2p-color-bg-content);\n  --v2p-color-bg-tabs: var(--v2p-color-main-100);\n  --v2p-color-bg-tpr: var(--v2p-color-main-100);\n  --v2p-color-bg-avatar: var(--v2p-color-main-300);\n  --v2p-color-bg-block: var(--v2p-color-main-100);\n  --v2p-color-bg-block-darker: var(--v2p-color-main-300);\n  --v2p-color-bg-link: var(--v2p-color-main-100);\n  --v2p-color-bg-link-hover: var(--v2p-color-main-200);\n  --v2p-color-bg-error: #fee2e2;\n  --v2p-color-tabs: var(--v2p-color-foreground);\n  --v2p-color-heart: #ef4444;\n  --v2p-color-heart-fill: #fee2e2;\n  --v2p-color-mask: rgb(0 0 0 / 25%);\n  --v2p-color-divider: var(--v2p-color-main-200);\n  --v2p-color-border: var(--v2p-color-main-200);\n  --v2p-color-input-border: var(--v2p-color-main-300);\n  --v2p-color-input-border-focus: var(--v2p-color-main-400);\n  --v2p-color-border-darker: var(--v2p-color-main-300);\n  --v2p-color-link-visited: var(--v2p-color-main-400);\n  --v2p-color-error: #ef4444;\n  --v2p-color-cell-num: var(--v2p-color-main-350);\n  --v2p-color-badge: var(--v2p-color-bg-content);\n  --v2p-box-shadow: 0 3px 5px 0 rgb(0 0 0 / 4%);\n  --v2p-widget-shadow: 0 9px 24px -3px rgb(0 0 0 / 6%), 0 4px 8px -1px rgb(0 0 0 /12%);\n  --v2p-toast-shadow:\n    0 6px 16px 0 rgb(0 0 0 / 8%), 0 3px 6px -4px rgb(0 0 0 / 12%), 0 9px 28px 8px rgb(0 0 0 / 5%);\n  --color-fade: var(--v2p-color-font-secondary);\n  --color-gray: var(--v2p-color-font-secondary);\n  --link-color: var(--v2p-color-foreground);\n  --link-darker-color: var(--v2p-color-main-600);\n  --link-hover-color: var(--v2p-color-foreground);\n  --link-caution-color: var(--v2p-color-orange-400);\n  --link-visited-color: currentColor;\n  --box-border-color: var(--v2p-color-border);\n  --box-foreground-color: var(--v2p-color-foreground);\n  --box-background-color: var(--v2p-color-bg-content);\n  --box-background-alt-color: var(--v2p-color-main-100);\n  --box-background-hover-color: var(--v2p-color-main-200);\n  --box-border-focus-color: var(--v2p-color-main-200);\n  --box-border-radius: var(--v2p-box-radius);\n  --button-background-color: var(--v2p-color-button-background);\n  --button-foreground-color: var(--v2p-color-button-foreground);\n  --button-hover-color: var(--v2p-color-button-background-hover);\n  --button-background-hover-color: var(--v2p-color-button-background-hover);\n  --button-foreground-hover-color: var(--v2p-color-button-foreground-hover);\n  --button-border-color: var(--v2p-color-main-300);\n  --button-border-hover-color: var(--v2p-color-main-400);\n  color: var(--v2p-color-foreground);\n  text-autospace: normal;\n  background-color: var(--v2p-color-background);\n}\n:root body.v2p-theme-light-default,\n:root body .v2p-theme-light-default {\n  --v2p-color-main-50: #f7f9fb;\n  --v2p-color-main-100: #f1f5f9;\n  --v2p-color-main-150: #eaeff5;\n  --v2p-color-main-200: #e2e8f0;\n  --v2p-color-main-300: #cbd5e1;\n  --v2p-color-main-350: #94a3b8cc;\n  --v2p-color-main-400: #94a3b8;\n  --v2p-color-main-500: #64748b;\n  --v2p-color-main-600: #475569;\n  --v2p-color-main-700: #334155;\n  --v2p-color-main-800: #1e293b;\n  --v2p-color-accent-50: oklch(97.9% 0.021 166.113deg);\n  --v2p-color-accent-100: oklch(95% 0.052 163.051deg);\n  --v2p-color-accent-200: oklch(90.5% 0.093 164.15deg);\n  --v2p-color-accent-300: oklch(84.5% 0.143 164.978deg);\n  --v2p-color-accent-400: oklch(76.5% 0.177 163.223deg);\n  --v2p-color-accent-500: oklch(69.6% 0.17 162.48deg);\n  --v2p-color-accent-600: oklch(59.6% 0.145 163.225deg);\n  --v2p-color-accent-700: oklch(50.8% 0.118 165.612deg);\n  --v2p-color-orange-50: #fff7ed;\n  --v2p-color-orange-100: #ffedd5;\n  --v2p-color-orange-400: #fb923c;\n  --v2p-color-background: #f2f3f5;\n  --v2p-color-foreground: var(--v2p-color-main-800);\n  --v2p-color-selection-foreground: var(--v2p-color-main-100);\n  --v2p-color-selection-background: var(--v2p-color-main-700);\n  --v2p-color-selection-background-img: var(--v2p-color-main-500);\n  --v2p-color-font-secondary: var(--v2p-color-main-600);\n  --v2p-color-font-tertiary: var(--v2p-color-main-500);\n  --v2p-color-font-quaternary: var(--v2p-color-main-400);\n  --v2p-color-button-background: var(--v2p-color-main-100);\n  --v2p-color-button-foreground: var(--v2p-color-main-500);\n  --v2p-color-button-background-hover: var(--v2p-color-main-200);\n  --v2p-color-button-foreground-hover: var(--v2p-color-main-600);\n  --v2p-color-button-border: var(--v2p-color-main-300);\n  --v2p-color-button-special-background: var(--v2p-color-accent-50);\n  --v2p-color-button-special-foreground: var(--v2p-color-accent-700);\n  --v2p-color-button-special-border: var(--v2p-color-accent-600);\n  --v2p-color-button-special-foreground-hover: var(--v2p-color-accent-700);\n  --v2p-color-bg-content: #fff;\n  --v2p-color-bg-footer: var(--v2p-color-bg-content);\n  --v2p-color-bg-hover-btn: rgb(226 232 240 / 70%);\n  --v2p-color-bg-subtle: rgb(236 253 245 / 90%);\n  --v2p-color-bg-input: var(--v2p-color-main-50);\n  --v2p-color-bg-search: var(--v2p-color-main-100);\n  --v2p-color-bg-search-active: var(--v2p-color-main-150);\n  --v2p-color-bg-widget: rgb(255 255 255 / 70%);\n  --v2p-color-bg-reply: var(--v2p-color-main-100);\n  --v2p-color-bg-tooltip: var(--v2p-color-bg-content);\n  --v2p-color-bg-tabs: var(--v2p-color-main-100);\n  --v2p-color-bg-tpr: var(--v2p-color-main-100);\n  --v2p-color-bg-avatar: var(--v2p-color-main-300);\n  --v2p-color-bg-block: var(--v2p-color-main-100);\n  --v2p-color-bg-block-darker: var(--v2p-color-main-300);\n  --v2p-color-bg-link: var(--v2p-color-main-100);\n  --v2p-color-bg-link-hover: var(--v2p-color-main-200);\n  --v2p-color-bg-error: #fee2e2;\n  --v2p-color-tabs: var(--v2p-color-foreground);\n  --v2p-color-heart: #ef4444;\n  --v2p-color-heart-fill: #fee2e2;\n  --v2p-color-mask: rgb(0 0 0 / 25%);\n  --v2p-color-divider: var(--v2p-color-main-200);\n  --v2p-color-border: var(--v2p-color-main-200);\n  --v2p-color-input-border: var(--v2p-color-main-300);\n  --v2p-color-input-border-focus: var(--v2p-color-main-400);\n  --v2p-color-border-darker: var(--v2p-color-main-300);\n  --v2p-color-link-visited: var(--v2p-color-main-400);\n  --v2p-color-error: #ef4444;\n  --v2p-color-cell-num: var(--v2p-color-main-350);\n  --v2p-color-badge: var(--v2p-color-bg-content);\n  --v2p-box-shadow: 0 3px 5px 0 rgb(0 0 0 / 4%);\n  --v2p-widget-shadow: 0 9px 24px -3px rgb(0 0 0 / 6%), 0 4px 8px -1px rgb(0 0 0 /12%);\n  --v2p-toast-shadow:\n    0 6px 16px 0 rgb(0 0 0 / 8%), 0 3px 6px -4px rgb(0 0 0 / 12%), 0 9px 28px 8px rgb(0 0 0 / 5%);\n  --color-fade: var(--v2p-color-font-secondary);\n  --color-gray: var(--v2p-color-font-secondary);\n  --link-color: var(--v2p-color-foreground);\n  --link-darker-color: var(--v2p-color-main-600);\n  --link-hover-color: var(--v2p-color-foreground);\n  --link-caution-color: var(--v2p-color-orange-400);\n  --link-visited-color: currentColor;\n  --box-border-color: var(--v2p-color-border);\n  --box-foreground-color: var(--v2p-color-foreground);\n  --box-background-color: var(--v2p-color-bg-content);\n  --box-background-alt-color: var(--v2p-color-main-100);\n  --box-background-hover-color: var(--v2p-color-main-200);\n  --box-border-focus-color: var(--v2p-color-main-200);\n  --box-border-radius: var(--v2p-box-radius);\n  --button-background-color: var(--v2p-color-button-background);\n  --button-foreground-color: var(--v2p-color-button-foreground);\n  --button-hover-color: var(--v2p-color-button-background-hover);\n  --button-background-hover-color: var(--v2p-color-button-background-hover);\n  --button-foreground-hover-color: var(--v2p-color-button-foreground-hover);\n  --button-border-color: var(--v2p-color-main-300);\n  --button-border-hover-color: var(--v2p-color-main-400);\n}\n:root body #Logo {\n  background-image: url("https://www.v2ex.com/static/img/v2ex@2x.png");\n}\n:root body ::selection {\n  color: var(--v2p-color-selection-foreground);\n  background-color: var(--v2p-color-selection-background);\n}\n:root body img::selection {\n  background-color: var(--v2p-color-selection-background-img);\n}\n:root code,\n:root pre,\n:root table {\n  text-autospace: no-autospace;\n}\n\n/* V2EX Polish c8f1b70; Copyright (c) 2023-present LeoKu and contributors.\n * MIT; see licenses/v2ex-polish-MIT.txt. Font and reply-spacing overrides removed as requested.\n */\n/* V2EX Polish c8f1b70; Copyright (c) 2023-present LeoKu and contributors.\n * MIT; see licenses/v2ex-polish-MIT.txt. Font overrides removed as requested.\n */\n:root {\n  color-scheme: light;\n  background-color: var(--v2p-color-background);\n}\n\nhtml,\nbody {\n  min-height: 100vh;\n}\n\n:root[data-v2p-theme] body {\n  visibility: visible;\n}\n\n@keyframes v2p-boot-reveal {\n  to {\n    visibility: visible;\n  }\n}\nbody {\n  scrollbar-gutter: stable;\n  overflow: auto;\n  visibility: hidden;\n  animation: v2p-boot-reveal 0s 800ms forwards;\n}\nbody.v2p-theme-light-default {\n  visibility: visible;\n}\nbody h1 {\n  font-weight: bold;\n}\nbody a {\n  cursor: default;\n  text-decoration: none;\n}\nbody a[href] {\n  cursor: pointer;\n}\nbody a:hover {\n  text-decoration: underline 1px;\n  text-underline-offset: var(--v2p-underline-offset);\n}\nbody pre {\n  max-width: calc(var(--v2p-content-width) - var(--v2p-rightbar-width) - 2 * var(--v2p-layout-column-gap) - 24px);\n}\nbody #Top {\n  height: var(--v2p-nav-height);\n  border: none;\n  background-color: var(--v2p-color-bg-content);\n}\nbody #Bottom {\n  border: none;\n  color: var(--v2p-color-font-secondary);\n  background-color: var(--v2p-color-bg-footer);\n}\nbody #Bottom .content {\n  flex-direction: column;\n}\nbody #Wrapper {\n  background-color: inherit;\n  background-image: none;\n}\nbody #Wrapper.Night {\n  background-color: inherit;\n  background-image: none;\n}\nbody #Wrapper .content {\n  display: flex;\n  gap: var(--v2p-layout-column-gap);\n  max-width: var(--v2p-content-width);\n}\n#Navcol .nav_item:hover {\n  background-color: var(--box-background-hover-color);\n}\n#Navcol .nav_item:hover:active {\n  box-shadow: none;\n}\n#Navcol .nav_item_current:hover {\n  color: var(--box-foreground-color);\n  background-color: var(--v2p-color-bg-content);\n}\n#Navcol .nav_item_current:active {\n  box-shadow: none;\n}\n\n#Rightcol #page-outline-title {\n  background-color: var(--v2p-color-button-background-hover);\n}\n#Rightcol .page-outline-item:hover {\n  background-color: var(--box-background-hover-color);\n}\n\nbody #Wrapper:has(#Singleton) {\n  padding: 20px 0 0;\n}\nbody #Wrapper:has(#Singleton) #Singleton {\n  overflow: hidden;\n  box-shadow: var(--v2p-box-shadow);\n}\nbody #Leftbar {\n  float: none;\n  order: 1;\n}\nbody #Main {\n  flex: 1;\n  order: 2;\n  max-width: clamp(400px, 92vw, 1200px);\n  margin: 0;\n}\nbody #Rightbar {\n  float: none;\n  order: 3;\n  width: var(--v2p-rightbar-width);\n  margin-right: var(--v2p-layout-column-gap);\n}\n:root[data-v2p-preview] {\n  --v2p-rightbar-toggle-display: flex;\n}\n:root[data-v2p-preview] body {\n  min-width: 450px;\n}\n:root[data-v2p-preview] #Wrapper .content {\n  gap: 0;\n  min-width: 450px;\n}\n:root[data-v2p-preview] #Wrapper #Main {\n  margin: auto;\n}\n:root[data-v2p-preview] #Wrapper #Rightbar {\n  position: fixed;\n  z-index: var(--zidx-rightbar);\n  top: var(--v2p-layout-column-gap);\n  right: 10px;\n  overflow-y: auto;\n  display: none;\n  max-height: calc(100vh - 2 * var(--v2p-layout-column-gap));\n  margin: 0;\n  padding: 10px;\n  border: 1px solid var(--v2p-color-border);\n  border-radius: var(--v2p-box-radius);\n  background-color: var(--v2p-color-bg-content);\n  box-shadow: var(--v2p-widget-shadow);\n}\n:root[data-v2p-preview] #Wrapper #Rightbar.v2p-layout-rightbar-visible {\n  display: block;\n}\n:root[data-v2p-preview] #Wrapper #Rightbar.v2p-layout-rightbar-visible .box {\n  background-color: var(--v2p-color-background);\n  box-shadow: none;\n}\n:root[data-v2p-preview] #Wrapper #Rightbar .v2p-tool-box {\n  border: 1px solid var(--v2p-color-border);\n}\n\n:root[data-v2p-preview="1"] #Top,\n:root[data-v2p-preview="1"] #Bottom {\n  display: none;\n}\n\n@media (width < 900px) {\n  :root[data-v2p-page=topic] {\n    --v2p-rightbar-toggle-display: flex;\n  }\n  :root[data-v2p-page=topic] #Wrapper .content {\n    gap: 0;\n  }\n  :root[data-v2p-page=topic] #Wrapper #Main {\n    margin: auto;\n  }\n  :root[data-v2p-page=topic] #Wrapper #Rightbar {\n    position: fixed;\n    z-index: var(--zidx-rightbar);\n    top: var(--v2p-layout-column-gap);\n    right: 10px;\n    overflow-y: auto;\n    display: none;\n    max-height: calc(100vh - 2 * var(--v2p-layout-column-gap));\n    margin: 0;\n    padding: 10px;\n    border: 1px solid var(--v2p-color-border);\n    border-radius: var(--v2p-box-radius);\n    background-color: var(--v2p-color-bg-content);\n    box-shadow: var(--v2p-widget-shadow);\n  }\n  :root[data-v2p-page=topic] #Wrapper #Rightbar.v2p-layout-rightbar-visible {\n    display: block;\n  }\n  :root[data-v2p-page=topic] #Wrapper #Rightbar.v2p-layout-rightbar-visible .box {\n    background-color: var(--v2p-color-background);\n    box-shadow: none;\n  }\n  :root[data-v2p-page=topic] #Wrapper #Rightbar .v2p-tool-box {\n    border: 1px solid var(--v2p-color-border);\n  }\n}\nbody #search-container {\n  height: 30px;\n  margin: 0 30px;\n  border: none;\n  border-radius: var(--v2p-input-radius);\n  background-color: var(--v2p-color-bg-search);\n}\nbody #search-container::before {\n  top: 0;\n  left: 4px;\n  opacity: 0.6;\n  background-size: 14px 14px;\n  filter: none;\n}\nbody #search-container.active {\n  background-color: var(--v2p-color-bg-search-active);\n}\nbody #search-container #search {\n  font-size: 14px;\n  font-weight: 500;\n}\nbody #search-container #search-result {\n  z-index: var(--zidx-search);\n  top: 42px;\n  border: 1px solid var(--box-border-color);\n  font-size: 14px;\n  color: var(--v2p-color-font-secondary);\n  background: var(--v2p-color-bg-widget);\n  backdrop-filter: blur(16px);\n  box-shadow: var(--v2p-widget-shadow);\n}\nbody #search-container #search-result .fade {\n  color: var(--v2p-color-font-secondary);\n}\nbody #search-container #search-result .search-item {\n  border-radius: var(--v2p-button-radius);\n  font-weight: bold;\n  color: var(--v2p-color-foreground);\n}\nbody #search-container #search-result .search-item.active {\n  color: var(--v2p-color-foreground);\n}\nbody #search-container #search-result .search-item.active.v2p-no-active {\n  background-color: transparent;\n}\nbody .box {\n  border: none;\n  border-radius: var(--box-border-radius);\n  color: var(--box-foreground-color);\n  background-color: var(--v2p-color-bg-content);\n  box-shadow: var(--v2p-box-shadow);\n}\nbody .box .header {\n  font-weight: 500;\n}\nbody .box .header > h1 {\n  font-size: 22px;\n  font-weight: bold;\n}\nbody .box .header .gray {\n  color: var(--color-gray);\n}\nbody .button {\n  --button-hover-shadow:\n    0 1.8px 0 var(--button-border-color), 0 1.8px 0 var(--button-background-color);\n}\nbody .button.normal, body .button.super, body .button.special {\n  cursor: pointer;\n  user-select: none;\n  position: relative;\n  display: inline-flex;\n  gap: 5px;\n  align-items: center;\n  height: 28px;\n  padding: 0 12px;\n  border: 1px solid var(--v2p-color-button-border);\n  border-radius: var(--v2p-button-radius);\n  font-family: inherit;\n  font-size: 14px;\n  font-weight: 500;\n  line-height: 28px;\n  color: var(--v2p-color-button-foreground);\n  text-shadow: none;\n  white-space: nowrap;\n  background: var(--v2p-color-button-background);\n  outline: none;\n  box-shadow: 0 1.8px 0 var(--box-background-hover-color), 0 1.8px 0 var(--button-background-color);\n  transition: color 0.25s, background-color 0.25s, box-shadow 0.25s;\n}\nbody .button.normal.special, body .button.super.special, body .button.special.special {\n  border-color: var(--v2p-color-button-special-border);\n  color: var(--v2p-color-button-special-foreground);\n  background: var(--v2p-color-button-special-background);\n}\nbody .button.normal.v2p-btn-small, body .button.super.v2p-btn-small, body .button.special.v2p-btn-small {\n  height: 24px;\n  padding: 0 10px;\n  border-radius: var(--v2p-button-radius);\n  font-size: 12px;\n}\nbody .button.normal.v2p-btn-large, body .button.super.v2p-btn-large, body .button.special.v2p-btn-large {\n  height: 32px;\n  padding: 0 14px;\n  border-radius: var(--v2p-box-radius);\n  font-size: 16px;\n}\nbody .button.normal:is(:hover:enabled, :active:enabled), body .button.super:is(:hover:enabled, :active:enabled), body .button.special:is(:hover:enabled, :active:enabled) {\n  border: 1px solid var(--v2p-color-button-border);\n  font-weight: 500;\n  color: var(--v2p-color-button-foreground-hover);\n  text-shadow: none;\n  background: var(--v2p-color-button-background-hover);\n  box-shadow: var(--button-hover-shadow);\n}\nbody .button.normal:is(:hover:enabled, :active:enabled).special, body .button.super:is(:hover:enabled, :active:enabled).special, body .button.special:is(:hover:enabled, :active:enabled).special {\n  border-color: var(--v2p-color-button-special-border);\n  color: var(--v2p-color-button-special-foreground-hover);\n  background: var(--v2p-color-button-special-background);\n}\nbody .button.normal:is(.hover_now, .disable_now), body .button.super:is(.hover_now, .disable_now), body .button.special:is(.hover_now, .disable_now) {\n  border: 1px solid var(--v2p-color-button-border);\n  color: var(--v2p-color-button-foreground) !important;\n  text-shadow: none !important;\n  background: var(--button-background-color) !important;\n  box-shadow: 0 1.8px 0 var(--box-background-hover-color) !important, 0 1.8px 0 var(--button-background-color) !important;\n}\nbody .button.normal:is(.hover_now, .disable_now).special, body .button.super:is(.hover_now, .disable_now).special, body .button.special:is(.hover_now, .disable_now).special {\n  border-color: var(--v2p-color-button-special-border);\n}\nbody .button.normal:is(.disable_now, :disabled), body .button.super:is(.disable_now, :disabled), body .button.special:is(.disable_now, :disabled) {\n  pointer-events: none;\n  cursor: default;\n  font-weight: 500;\n  color: var(--v2p-color-button-foreground);\n  text-shadow: none;\n  opacity: 0.8;\n  background: var(--button-background-color);\n  box-shadow: 0 1.8px 0 var(--box-background-hover-color), 0 1.8px 0 var(--button-background-color);\n}\nbody .button.normal kbd, body .button.super kbd, body .button.special kbd {\n  position: relative;\n  right: -4px;\n  padding: 0 3px;\n  border: 1px solid var(--button-border-color);\n  border-radius: var(--v2p-button-radius);\n  font-family: inherit;\n  font-size: 90%;\n  line-height: initial;\n}\nbody .button.special {\n  --button-hover-shadow:\n    0 1.8px 0 var(--v2p-color-accent-200), 0 1.8px 0 var(--v2p-color-accent-100);\n  box-shadow: var(--button-hover-shadow);\n}\nbody .button.special:hover, body .button.special:hover:enabled {\n  color: var(--v2p-color-accent-600);\n  box-shadow: var(--button-hover-shadow);\n}\nbody .button a {\n  color: inherit;\n  text-decoration: none;\n}\nbody .badge {\n  user-select: none;\n  padding: 2px 5px;\n  border: 1px solid var(--v2p-color-accent-400);\n  font-weight: bold;\n}\nbody .badge:first-child {\n  border: 1px solid var(--v2p-color-accent-400);\n  border-top-left-radius: var(--v2p-button-radius);\n  border-bottom-left-radius: var(--v2p-button-radius);\n}\nbody .badge:last-child {\n  border: 1px solid var(--v2p-color-accent-400);\n  border-top-right-radius: var(--v2p-button-radius);\n  border-bottom-right-radius: var(--v2p-button-radius);\n}\nbody .badge.op {\n  color: var(--v2p-color-accent-500);\n  background-color: var(--v2p-color-accent-50);\n}\nbody .badge.mod {\n  color: var(--v2p-color-bg-content);\n  background-color: var(--v2p-color-accent-400);\n}\nbody .badge.you {\n  border: 1px solid var(--v2p-color-orange-400);\n  color: var(--v2p-color-orange-400);\n  background-color: var(--v2p-color-orange-50);\n}\nbody .badge.mini {\n  height: 1.2em;\n  padding: 0 3px;\n  font-size: 12px;\n  font-weight: normal;\n  line-height: 1;\n}\nbody a.node:is(:active, :link, :visited) {\n  padding: 5px 6px;\n  border-radius: var(--v2p-button-radius);\n  font-size: 13px;\n  color: var(--v2p-color-font-secondary);\n  background-color: var(--v2p-color-bg-block);\n}\nbody a.node:is(:active, :link, :visited):hover {\n  color: var(--v2p-color-font-tertiary);\n  background-color: var(--v2p-color-button-background-hover);\n}\nbody .outdated {\n  border-color: var(--v2p-color-border);\n  border-bottom: none;\n  font-size: 12px;\n}\nbody :is(.page_normal, .page_current):is(:link, :visited) {\n  user-select: none;\n  padding: 6px 9px;\n  border: none;\n  border-radius: var(--v2p-button-radius);\n  font-size: 14px;\n}\nbody .page_normal:is(:link, :visited) {\n  font-weight: 500;\n  background-color: var(--v2p-color-bg-content);\n  box-shadow: 0 2px 2px var(--box-background-hover-color);\n  transition: transform 0.25s;\n}\nbody .page_normal:is(:link, :visited):hover {\n  transform: scale(1.1) translateY(-2px);\n}\nbody .page_current:is(:link, :visited) {\n  pointer-events: none;\n  font-weight: bold;\n  background-color: var(--box-background-hover-color);\n  box-shadow: none;\n}\nbody .page_input {\n  display: none;\n}\nbody .dock_area {\n  margin: 12px 0;\n  background: var(--v2p-color-bg-block);\n}\nbody .member-activity-bar {\n  background-color: var(--v2p-color-divider);\n}\nbody .member-activity-bar .member-activity-start {\n  background-color: var(--v2p-color-accent-200);\n}\nbody .member-activity-bar .member-activity-fourth {\n  background-color: var(--v2p-color-accent-400);\n}\nbody .member-activity-bar .member-activity-half {\n  background-color: var(--v2p-color-accent-500);\n}\nbody .member-activity-bar .member-activity-almost {\n  background-color: var(--v2p-color-accent-600);\n}\nbody .member-activity-bar .member-activity-done {\n  background-color: var(--v2p-color-orange-400);\n}\nbody .online {\n  user-select: none;\n  padding: 6px 8px;\n  border-radius: var(--v2p-button-radius);\n  font-size: 13px;\n  color: var(--v2p-color-bg-content);\n  background: var(--v2p-color-accent-400);\n}\nbody #topic_supplement {\n  resize: none;\n  overflow: hidden;\n  height: unset;\n  min-height: 550px !important;\n  max-height: 800px !important;\n  border: 1px solid var(--button-border-color);\n  border-radius: var(--v2p-input-radius);\n  font-size: 15px;\n  color: currentColor;\n  background-color: var(--v2p-color-bg-input);\n  transition: opacity 0.25s;\n  overflow-y: auto;\n}\nbody #topic_supplement::placeholder {\n  font-size: 15px;\n  color: var(--v2p-color-font-tertiary);\n}\nbody #topic_supplement:is(:focus, :focus-within) {\n  border-color: var(--button-border-hover-color);\n  background-color: transparent;\n  outline: none;\n  box-shadow: none;\n}\nbody .item_hot_topic_title {\n  --offset: 2.4px;\n  overflow: hidden;\n  display: -webkit-box;\n  -webkit-box-orient: vertical;\n  -webkit-line-clamp: 2;\n  line-height: 1.4;\n  position: relative;\n  padding: var(--offset) 0;\n  text-shadow: none;\n}\nbody .item_hot_topic_title > a:hover {\n  text-underline-offset: var(--offset);\n}\nbody form textarea#topic_title {\n  resize: none;\n  overflow: hidden;\n  height: unset;\n  min-height: 75px !important;\n  max-height: 800px !important;\n  border: 1px solid var(--button-border-color);\n  border-radius: var(--v2p-input-radius);\n  font-size: 15px;\n  color: currentColor;\n  background-color: var(--v2p-color-bg-input);\n  transition: opacity 0.25s;\n}\nbody form textarea#topic_title::placeholder {\n  font-size: 15px;\n  color: var(--v2p-color-font-tertiary);\n}\nbody form textarea#topic_title:is(:focus, :focus-within) {\n  border-color: var(--button-border-hover-color);\n  background-color: transparent;\n  outline: none;\n  box-shadow: none;\n}\nbody form #topic_title {\n  resize: none;\n  overflow: hidden;\n  height: unset;\n  min-height: 30px !important;\n  max-height: 800px !important;\n  border: 1px solid var(--button-border-color);\n  border-radius: var(--v2p-input-radius);\n  font-size: 15px;\n  color: currentColor;\n  background-color: var(--v2p-color-bg-input);\n  transition: opacity 0.25s;\n}\nbody form #topic_title::placeholder {\n  font-size: 15px;\n  color: var(--v2p-color-font-tertiary);\n}\nbody form #topic_title:is(:focus, :focus-within) {\n  border-color: var(--button-border-hover-color);\n  background-color: transparent;\n  outline: none;\n  box-shadow: none;\n}\nbody form #topic_content {\n  resize: none;\n  overflow: hidden;\n  height: unset;\n  min-height: 120px !important;\n  max-height: 800px !important;\n  border: 1px solid var(--button-border-color);\n  border-radius: var(--v2p-input-radius);\n  font-size: 15px;\n  color: currentColor;\n  background-color: var(--v2p-color-bg-input);\n  transition: opacity 0.25s;\n}\nbody form #topic_content::placeholder {\n  font-size: 15px;\n  color: var(--v2p-color-font-tertiary);\n}\nbody form #topic_content:is(:focus, :focus-within) {\n  border-color: var(--button-border-hover-color);\n  background-color: transparent;\n  outline: none;\n  box-shadow: none;\n}\nbody form[action^="/notes"] .cell {\n  background-color: transparent !important;\n}\nbody #syntax-selector .radio-group {\n  padding: 3px;\n  border-radius: var(--v2p-box-radius);\n  background-color: var(--v2p-color-background);\n  box-shadow: 0 1px 2px var(--v2p-box-shadow) inset;\n}\nbody #syntax-selector .radio-group > input[type=radio]:checked + label {\n  border-radius: var(--v2p-button-radius);\n  color: var(--v2p-color-accent-600);\n  background-color: var(--v2p-color-accent-100);\n  box-shadow: 1px 1px 2px var(--v2p-box-shadow);\n}\nbody #syntax-selector .radio-group > input[type=radio] + label {\n  cursor: pointer;\n  font-size: 13px;\n}\nbody #syntax-selector label {\n  color: var(--v2p-color-foreground);\n}\nbody .snow {\n  color: var(--v2p-color-font-quaternary);\n}\nbody .orange-dot {\n  background: var(--v2p-color-orange-400);\n}\nbody .alt {\n  border: 1px solid var(--button-border-color);\n  background-color: var(--v2p-color-bg-input);\n}\nbody a.btn_hero {\n  border-color: var(--v2p-color-foreground);\n}\nbody a.btn_hero:hover {\n  background-color: var(--v2p-color-foreground);\n}\nbody .cell_ops {\n  background-color: transparent;\n}\nbody :is(.topic_content,\n.reply_content,\n.v2p-topic-preview-content,\n.v2p-topic-preview-addons,\n.v2p-reply-preview,\n.markdown_body) a[href*="v2ex.com/t"],\nbody :is(.topic_content,\n.reply_content,\n.v2p-topic-preview-content,\n.v2p-topic-preview-addons,\n.v2p-reply-preview,\n.markdown_body) a[href*="v2ex.com/t"][href^=http],\nbody :is(.topic_content,\n.reply_content,\n.v2p-topic-preview-content,\n.v2p-topic-preview-addons,\n.v2p-reply-preview,\n.markdown_body) a[href*="v2ex.co/t"],\nbody :is(.topic_content,\n.reply_content,\n.v2p-topic-preview-content,\n.v2p-topic-preview-addons,\n.v2p-reply-preview,\n.markdown_body) a[href*="v2ex.co/t"][href^=http],\nbody :is(.topic_content,\n.reply_content,\n.v2p-topic-preview-content,\n.v2p-topic-preview-addons,\n.v2p-reply-preview,\n.markdown_body) a[href^="/"] {\n  text-decoration: underline 1.5px;\n  text-underline-offset: 0.46ex;\n  color: var(--v2p-color-accent-500);\n  background-color: var(--v2p-color-accent-50);\n}\nbody :is(.topic_content,\n.reply_content,\n.v2p-topic-preview-content,\n.v2p-topic-preview-addons,\n.v2p-reply-preview,\n.markdown_body) a[href*="v2ex.com/t"]:hover,\nbody :is(.topic_content,\n.reply_content,\n.v2p-topic-preview-content,\n.v2p-topic-preview-addons,\n.v2p-reply-preview,\n.markdown_body) a[href*="v2ex.com/t"][href^=http]:hover,\nbody :is(.topic_content,\n.reply_content,\n.v2p-topic-preview-content,\n.v2p-topic-preview-addons,\n.v2p-reply-preview,\n.markdown_body) a[href*="v2ex.co/t"]:hover,\nbody :is(.topic_content,\n.reply_content,\n.v2p-topic-preview-content,\n.v2p-topic-preview-addons,\n.v2p-reply-preview,\n.markdown_body) a[href*="v2ex.co/t"][href^=http]:hover,\nbody :is(.topic_content,\n.reply_content,\n.v2p-topic-preview-content,\n.v2p-topic-preview-addons,\n.v2p-reply-preview,\n.markdown_body) a[href^="/"]:hover {\n  color: var(--v2p-color-accent-500);\n  background-color: var(--v2p-color-accent-50);\n}\nbody :is(.topic_content,\n.reply_content,\n.v2p-topic-preview-content,\n.v2p-topic-preview-addons,\n.v2p-reply-preview,\n.markdown_body) a[href^=http],\nbody :is(.topic_content,\n.reply_content,\n.v2p-topic-preview-content,\n.v2p-topic-preview-addons,\n.v2p-reply-preview,\n.markdown_body) a[href*="/email-protection"],\nbody :is(.topic_content,\n.reply_content,\n.v2p-topic-preview-content,\n.v2p-topic-preview-addons,\n.v2p-reply-preview,\n.markdown_body) a[href^="/member/"] {\n  text-decoration: underline 1.5px;\n  text-underline-offset: 0.46ex;\n  color: currentColor;\n  background-color: var(--v2p-color-bg-link);\n}\nbody :is(.topic_content,\n.reply_content,\n.v2p-topic-preview-content,\n.v2p-topic-preview-addons,\n.v2p-reply-preview,\n.markdown_body) a[href^=http]:hover,\nbody :is(.topic_content,\n.reply_content,\n.v2p-topic-preview-content,\n.v2p-topic-preview-addons,\n.v2p-reply-preview,\n.markdown_body) a[href*="/email-protection"]:hover,\nbody :is(.topic_content,\n.reply_content,\n.v2p-topic-preview-content,\n.v2p-topic-preview-addons,\n.v2p-reply-preview,\n.markdown_body) a[href^="/member/"]:hover {\n  color: currentColor;\n  background-color: var(--v2p-color-bg-link-hover);\n}\nbody :is(.topic_content,\n.reply_content,\n.v2p-topic-preview-content,\n.v2p-topic-preview-addons,\n.v2p-reply-preview,\n.markdown_body) a[href^=http]:has(> .embedded_image),\nbody :is(.topic_content,\n.reply_content,\n.v2p-topic-preview-content,\n.v2p-topic-preview-addons,\n.v2p-reply-preview,\n.markdown_body) a[href*="/email-protection"]:has(> .embedded_image),\nbody :is(.topic_content,\n.reply_content,\n.v2p-topic-preview-content,\n.v2p-topic-preview-addons,\n.v2p-reply-preview,\n.markdown_body) a[href^="/member/"]:has(> .embedded_image) {\n  background-color: transparent;\n}\nbody .CodeMirror {\n  color: currentColor;\n  background-color: var(--v2p-color-bg-input);\n}\nbody .CodeMirror.CodeMirror-focused {\n  background-color: var(--v2p-color-bg-content);\n}\nbody .CodeMirror .CodeMirror-gutters {\n  padding-right: 5px;\n  border-right: 1px solid var(--v2p-color-border-darker);\n  background-color: var(--v2p-color-bg-input);\n}\nbody .CodeMirror .CodeMirror-linenumber {\n  color: var(--v2p-color-font-quaternary);\n}\nbody .CodeMirror .CodeMirror-cursors {\n  background-color: var(--v2p-color-foreground);\n}\nbody .cm-s-one-dark {\n  background-color: var(--v2p-color-bg-input);\n}\nbody #workspace {\n  overflow: hidden;\n  border: 1px solid var(--button-border-color);\n  border-radius: 8px;\n}\nbody .select2-container {\n  width: 200px !important;\n}\nbody .select2-container .select2-selection {\n  height: 33px !important;\n  border: 1px solid var(--v2p-color-border);\n  border-radius: var(--v2p-input-radius) !important;\n  background-color: var(--v2p-color-bg-content);\n}\nbody .select2-container .select2-selection .select2-selection__rendered,\nbody .select2-container .select2-selection .select2-selection__placeholder {\n  display: inline-flex;\n  align-items: center;\n  height: 100%;\n  color: var(--v2p-color-foreground);\n}\nbody .select2-container .select2-dropdown {\n  border: 1px solid var(--box-border-color);\n  border-radius: var(--v2p-popup-radius);\n  font-size: 14px;\n  background: var(--v2p-color-bg-widget);\n  backdrop-filter: blur(16px);\n  box-shadow: var(--v2p-widget-shadow);\n  transform: translateY(5px);\n}\nbody .select2-container .select2-dropdown .select2-search {\n  padding: 5px;\n}\nbody .select2-container .select2-dropdown .select2-search .select2-search__field {\n  padding: 6px 4px;\n  border: 1px solid var(--v2p-color-border);\n  border-radius: var(--v2p-input-radius);\n  background-color: transparent;\n}\nbody .select2-container .select2-dropdown .select2-search .select2-search__field:focus-visible {\n  border-color: var(--v2p-color-font-quaternary);\n  outline: none;\n}\nbody .select2-container .select2-dropdown .select2-results > .select2-results__options {\n  padding: 5px;\n}\nbody .select2-container .select2-dropdown .select2-container--default .select2-results__option--selected {\n  color: currentColor;\n  background-color: var(--v2p-color-accent-100);\n}\nbody .select2-container .select2-results__option {\n  border-radius: var(--v2p-popup-radius);\n}\nbody .select2-container .select2-results__option--highlighted.select2-results__option--selectable {\n  color: currentColor;\n  background-color: var(--v2p-color-button-background-hover);\n}\nbody .select2-container .select2-results__option--selected {\n  color: currentColor !important;\n  background-color: var(--v2p-color-accent-100) !important;\n}\nbody .problem {\n  border-color: var(--v2p-color-orange-400);\n  border-bottom: none;\n  color: currentColor;\n  color: var(--v2p-color-orange-400);\n  background-color: var(--v2p-color-orange-50);\n}\nbody .markdown_body table {\n  border-top: 1px solid var(--v2p-color-border-darker);\n  box-shadow: none;\n}\nbody .markdown_body table tr th,\nbody .markdown_body table tr td {\n  border: 1px solid var(--v2p-color-border-darker);\n}\nbody .markdown_body table tr:nth-child(2n) {\n  background-color: var(--box-background-alt-color);\n}\nbody .markdown_body blockquote {\n  margin-inline: 0;\n  padding: 0 1em;\n  border-left: 3px solid var(--v2p-color-border);\n  color: var(--v2p-color-font-tertiary);\n}\nbody .markdown_body pre,\nbody .markdown_body pre > .hljs {\n  line-height: 1.5;\n  color: var(--v2p-color-foreground);\n  background-color: var(--v2p-color-bg-block);\n}\nbody .social_label:is(:link, :visited, :active) {\n  border-radius: var(--box-border-radius);\n  background-color: var(--v2p-color-button-background);\n  box-shadow: none;\n}\nbody .social_label:is(:link, :visited, :active):hover {\n  background-color: var(--v2p-color-button-background-hover);\n}\nbody .green {\n  color: var(--v2p-color-accent-500);\n}\nbody .message {\n  border: none;\n  color: var(--v2p-color-orange-400);\n  background-color: var(--v2p-color-orange-50);\n}\nbody .balance_area,\nbody a.balance_area:is(:link, :visited) {\n  display: inline-flex;\n  gap: 3px;\n  align-items: center;\n  font-weight: 600;\n  color: var(--v2p-color-foreground);\n  text-shadow: none;\n  background: var(--v2p-color-button-background);\n}\nbody .balance_area:hover,\nbody a.balance_area:is(:link, :visited):hover {\n  background: var(--v2p-color-button-background-hover);\n}\nbody :is(.subtle) {\n  border-left: 3px solid var(--v2p-color-accent-200);\n  background-color: var(--v2p-color-bg-subtle);\n}\nbody :is(.subtle) .topic_content {\n  font-size: 15px;\n}\nbody .onoffswitch label .frame::before {\n  color: #fff;\n  background-color: var(--v2p-color-accent-400);\n}\nbody .onoffswitch label .frame::after {\n  color: var(--v2p-color-font-secondary);\n  background-color: var(--v2p-color-bg-search);\n}\nbody select {\n  padding: 6px 8px;\n  border: 1px solid var(--v2p-color-border);\n  border-radius: var(--v2p-input-radius);\n  color: var(--v2p-color-foreground);\n  background-color: var(--v2p-color-background);\n  cursor: pointer;\n  border-radius: var(--v2p-input-radius);\n  background-color: var(--v2p-color-bg-content);\n}\nbody select:hover {\n  border-color: var(--v2p-color-input-border-focus);\n}\nbody select:focus {\n  border-color: var(--v2p-color-border);\n}\nbody .ml,\nbody .mle,\nbody .mll,\nbody .sl,\nbody .sll,\nbody .sls {\n  padding: 7px 10.5px;\n  border-color: var(--v2p-color-input-border);\n  border-radius: var(--v2p-input-radius);\n  color: var(--v2p-color-foreground);\n  background-color: var(--v2p-color-bg-content);\n}\nbody .ml::placeholder,\nbody .mle::placeholder,\nbody .mll::placeholder,\nbody .sl::placeholder,\nbody .sll::placeholder,\nbody .sls::placeholder {\n  color: var(--v2p-color-font-tertiary);\n}\nbody .ml:focus,\nbody .mle:focus,\nbody .mll:focus,\nbody .sl:focus,\nbody .sll:focus,\nbody .sls:focus {\n  border-color: var(--v2p-color-input-border-focus);\n}\nbody input,\nbody select,\nbody textarea {\n  color: var(--v2p-color-foreground);\n}\nbody .onoffswitch {\n  width: 90px;\n  min-width: 90px;\n  max-width: 90px;\n}\n\n.box .tag::before {\n  color: var(--v2p-color-font-secondary);\n}\n.box .tag:link, .box .tag:visited {\n  border-radius: var(--v2p-button-radius);\n  font-size: 12px;\n  color: var(--v2p-color-font-secondary);\n  background-color: var(--v2p-color-main-100);\n}\n.box .tag > li {\n  opacity: 0.6;\n}\n\n#Top .content {\n  height: 100%;\n}\n#Top .site-nav {\n  height: 100%;\n  padding: 0;\n}\n#Top .tools {\n  display: flex;\n  gap: 8px 14px;\n  align-items: center;\n  justify-content: flex-end;\n  font-size: 14px;\n  font-weight: 400;\n}\n#Top .tools .top {\n  height: 26px;\n  padding: 0 6px;\n  border-radius: var(--v2p-button-radius);\n  line-height: 26px;\n  color: var(--v2p-color-button-foreground);\n  white-space: nowrap;\n}\n#Top .tools .top:hover {\n  color: var(--v2p-color-foreground);\n}\n#Top .tools .top:not(.v2p-hover-btn):hover {\n  background-color: var(--v2p-color-button-background-hover);\n}\n#Top .tools * {\n  margin-left: 0;\n}\n\n#Main .box {\n  overflow: auto;\n}\n#Main .box:not(:has(.cell[id^=r_])) {\n  padding: 0 var(--v2p-spacing-box);\n}\n#Main .box.node-header > .cell {\n  margin: 0 calc(var(--v2p-spacing-box) * -1);\n}\n#Main .box .cell:not([id^=r_]) {\n  padding: var(--v2p-tp-item-x) var(--v2p-tp-item-y);\n}\n#Main .box .cell {\n  background-image: none !important;\n}\n#Main .box .cell_ops {\n  padding: 15px 5px;\n}\n#Main .box:has(form[action="/write"]) .cell:nth-child(1), #Main .box:has(form[action="/write"]) .cell:nth-child(2) {\n  border: none;\n}\n#Main .box:has(form[action="/write"]) .cell:has(#syntax-selector) {\n  padding: 8px 0 !important;\n}\n#Main .box:has(form[action="/write"]) .cell:has(#syntax-selector) .tab-alt-container {\n  gap: 0 8px;\n}\n#Main .box:has(form[action="/write"]) .cell:has(#syntax-selector) .tab-alt {\n  padding: 4px 2px;\n  border-bottom-width: 2px;\n  transition: none;\n}\n#Main .box:has(form[action="/write"]) .cell:has(#syntax-selector) .tab-alt:not(.active):hover {\n  border-color: transparent;\n}\n#Main .box:has(form[action="/write"]) .cell#preview {\n  padding: 2px 5px;\n}\n#Main .topic_buttons {\n  display: flex;\n  flex-wrap: wrap;\n  column-gap: 5px;\n  align-items: center;\n  padding: 8px 0;\n  background: none;\n}\n#Main .topic_buttons .topic_stats {\n  float: none;\n  flex: 1;\n  order: 99;\n  margin-left: 10px;\n  padding: 0 !important;\n  font-size: 12px;\n  text-shadow: none;\n  white-space: nowrap;\n}\n#Main .topic_buttons .topic_thanked {\n  font-size: 12px;\n}\n#Main .topic_buttons a.tb:link {\n  display: flex;\n  flex-direction: row-reverse;\n  column-gap: 5px;\n  align-items: center;\n  padding: 5px;\n  border-radius: var(--v2p-button-radius);\n  text-shadow: none;\n  white-space: nowrap;\n  background: none;\n}\n#Main .topic_buttons a.tb:link:not(.v2p-hover-btn) {\n  color: var(--v2p-color-font-secondary);\n}\n#Main .topic_buttons a.tb:link:hover:not(.v2p-hover-btn) {\n  color: currentColor;\n  background: var(--v2p-color-bg-block);\n}\n#Main .vote:link {\n  border-color: var(--v2p-color-border-darker);\n  border-radius: var(--v2p-button-radius);\n  color: var(--v2p-color-font-tertiary);\n}\n#Main .vote:link:hover {\n  box-shadow: 0 2px 2px var(--v2p-color-main-200);\n}\n#Main .cell .topic-link {\n  color: var(--v2p-color-foreground);\n  text-decoration: none;\n}\n#Main .cell .topic-link:visited {\n  color: var(--v2p-color-link-visited);\n}\n#Main .cell .topic_info {\n  pointer-events: none;\n  user-select: none;\n  position: relative;\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n}\n#Main .cell .topic_info::after {\n  content: "";\n  position: absolute;\n  z-index: 1;\n  inset: 0 0 -6px;\n  background-color: var(--v2p-color-bg-content);\n}\n#Main .cell .topic_info .votes,\n#Main .cell .topic_info .node,\n#Main .cell .topic_info .badges,\n#Main .cell .topic_info strong:first-of-type,\n#Main .cell .topic_info span:first-of-type,\n#Main .cell .topic_info .v2p-topic-actions {\n  pointer-events: auto;\n  position: relative;\n  z-index: 2;\n}\n#Main .cell .topic_info a[href^="/member"] {\n  font-weight: 500;\n  color: var(--v2p-color-font-tertiary);\n  background-color: transparent;\n}\n#Main .cell .count_livid {\n  user-select: none;\n  display: inline-block;\n  padding: 5px 10px;\n  border-radius: var(--v2p-button-radius);\n  font-size: 12px;\n  font-weight: 400;\n  white-space: nowrap;\n  margin-right: 0;\n  color: var(--v2p-color-button-foreground);\n  background-color: var(--v2p-color-bg-block);\n}\n#Main .cell .count_orange {\n  user-select: none;\n  display: inline-block;\n  padding: 5px 10px;\n  border-radius: var(--v2p-button-radius);\n  font-size: 12px;\n  font-weight: 400;\n  white-space: nowrap;\n  font-weight: bold;\n  color: var(--v2p-color-badge);\n  background-color: var(--v2p-color-orange-400);\n}\n#Main .cell .item_title .topic-link {\n  font-size: 15px;\n  font-weight: 500;\n}\n#Main .cell.item tr > td:nth-child(2) {\n  width: 30px;\n}\n#Main .box:has(#Tabs) .cell.item {\n  padding: 15px 10px;\n}\n#Main .reply-threads-c > .cell[id^=r_] {\n  padding: 15px 10px;\n}\n#Main .cell[id^=r_] {\n  --bg-reply: var(--v2p-color-bg-content);\n}\n#Main .cell[id^=r_] .ago {\n  color: var(--v2p-color-font-quaternary);\n}\n#Main .cell[id^=r_] .no {\n  color: var(--v2p-color-cell-num);\n  background-color: transparent;\n}\n#Main #Tabs {\n  user-select: none;\n  position: sticky;\n  z-index: var(--zidx-tabs);\n  top: 0;\n  display: flex;\n  flex-wrap: wrap;\n  gap: 4px 3px;\n  align-items: center;\n  padding: var(--v2p-tp-tabs-pd);\n  border-bottom: 1px solid var(--box-border-color);\n  background-color: var(--v2p-color-bg-content);\n}\n#Main #Tabs .tab_current {\n  margin-right: 0;\n}\n#Main #Tabs .tab {\n  margin: 0;\n}\n#Main #Tabs .tab.v2p-hover-btn::before {\n  inset: 0;\n}\n#Main #SecondaryTabs {\n  padding: 10px;\n  border-radius: var(--v2p-box-radius);\n  background-color: var(--v2p-color-bg-tabs);\n}\n#Main #SecondaryTabs a {\n  color: var(--v2p-color-tabs);\n}\n#Main .topic_content {\n  font-size: 15px;\n  line-height: 1.6;\n}\n#Main .topic_content a[href^="/member"] {\n  position: relative;\n  bottom: 1px;\n  font-size: 13px;\n}\n#Main .topic_content,\n#Main .reply_content {\n  color: currentColor;\n}\n#Main .topic_content a[href^="/member"],\n#Main .reply_content a[href^="/member"] {\n  color: var(--v2p-color-font-tertiary);\n  text-decoration: underline;\n  text-underline-offset: 0.4ex;\n  background-color: transparent;\n}\n#Main .thank_area {\n  font-size: 12px;\n}\n#Main .tab {\n  user-select: none;\n  border-radius: var(--v2p-button-radius);\n  color: var(--v2p-color-foreground);\n  background-color: transparent;\n}\n#Main .tab:not(.v2p-hover-btn):hover {\n  background-color: var(--v2p-color-bg-block);\n}\n#Main .tab_current {\n  user-select: none;\n  border-radius: var(--v2p-button-radius);\n  color: var(--v2p-color-bg-content);\n  background-color: var(--v2p-color-foreground);\n}\n#Main #reply-box.reply-box-sticky {\n  z-index: var(--zidx-reply-box);\n  bottom: 20px;\n  overflow: visible;\n  margin: 0 -10px;\n  padding: 0 22px;\n  border: none;\n  border-radius: var(--box-border-radius);\n  outline: 2px solid var(--v2p-color-border);\n}\n#Main #reply-box .flex-one-row:last-of-type {\n  flex-direction: row-reverse;\n  gap: 10px;\n  justify-content: flex-start;\n}\n#Main #reply-box .flex-one-row:last-of-type .gray {\n  margin-right: auto;\n}\n#Main #reply-box > .cell {\n  font-size: 12px;\n}\n#Main #reply-box > .cell.flex-one-row {\n  min-height: 45px;\n  padding: 0 10px;\n  border: none;\n}\n#Main #reply-box > .cell.flex-row-end {\n  padding: 12px 10px;\n  border: none;\n}\n#Main #reply-box > .cell:has(form) {\n  padding-top: 0;\n}\n#Main #no-comments-yet {\n  border-color: var(--color-gray);\n  color: var(--color-gray);\n}\n#Main #notifications .cell[id^=n]:hover .node {\n  opacity: 1;\n}\n#Main #notifications .cell[id^=n] .node {\n  opacity: 0;\n}\n#Main #notifications .cell[id^=n] .payload {\n  color: var(--v2p-color-foreground);\n  background-color: var(--v2p-color-bg-block);\n}\n#Main #notifications .cell[id^=n] .payload:has(.embedded_video_wrapper) {\n  min-width: 50%;\n}\n#Main #notifications .cell[id^=n] .topic-link:visited {\n  color: var(--v2p-color-font-quaternary);\n}\n#Main .cell_tabs .cell_tab_current {\n  border-color: var(--v2p-color-foreground);\n  font-weight: bold;\n}\n#Main .cell_tabs .cell_tab {\n  color: var(--v2p-color-foreground);\n}\n#Main .cell_tabs .cell_tab:hover {\n  border-color: var(--v2p-color-border-darker);\n}\n#Main .settings.block .block-stat {\n  padding: var(--v2p-spacing-box);\n  background-color: transparent;\n}\n#Main .settings.privacy .privacy-settings-form > div:nth-of-type(2n) {\n  background-color: transparent;\n}\n\n#Rightbar .cell:has(.light-toggle) {\n  font-size: 13px;\n}\n#Rightbar .box .item_node {\n  border-color: var(--v2p-color-border);\n  border-radius: var(--v2p-button-radius);\n  font-size: 12px;\n  color: var(--v2p-color-font-secondary);\n}\n#Rightbar .box .item_node:hover {\n  box-shadow: var(--v2p-box-shadow);\n}\n#Rightbar a.dark:is(:link, :active, :visited, :hover) {\n  color: var(--v2p-color-font-tertiary);\n}\n#Rightbar a.dark:is(:link, :active, :visited, :hover):hover {\n  color: var(--v2p-color-font-secondary);\n}\n\n#Bottom {\n  position: sticky;\n  top: 100%;\n}\n#Bottom a.dark {\n  font-size: 13px;\n  font-weight: 400;\n}\n#Bottom a.dark:is(:link, :active, :visited, :hover) {\n  color: var(--v2p-color-font-tertiary);\n}\n\n.wwads-cn {\n  border: none !important;\n  box-shadow: none !important;\n}\n\n.box:has(a[href^="/advertise"]) {\n  overflow: hidden;\n  border: none !important;\n  box-shadow: none !important;\n}\n.box:has(a[href^="/advertise"]) .sidebar_compliance {\n  background-color: var(--v2p-color-bg-block);\n}\n\n/* V2EX Polish c8f1b70; Copyright (c) 2023-present LeoKu and contributors.\n * MIT; see licenses/v2ex-polish-MIT.txt. Font overrides removed as requested.\n */\nbody {\n  position: relative;\n}\nbody.v2p-modal-open {\n  overflow: hidden;\n}\nbody.v2p-img-preview-enabled .embedded_image {\n  cursor: zoom-in;\n}\nbody.v2p-img-preview-enabled .embedded_image.v2p-emoji-img {\n  cursor: default;\n}\nbody .button.v2p-prev-btn, body .button.v2p-next-btn {\n  padding: 0 15px;\n}\nbody .button.v2p-btn-loading {\n  pointer-events: none;\n}\nbody #Top a:has(#Logo.v2p-logo) {\n  display: inline-flex;\n  align-items: center;\n}\nbody #Logo.v2p-logo {\n  flex-shrink: 0;\n  width: unset;\n  height: 25px;\n  padding: 0 8px;\n  background-image: none !important;\n}\n\n.v2p-hover-btn {\n  cursor: pointer;\n  user-select: none;\n  position: relative;\n  z-index: 1;\n  margin: 0;\n  text-decoration: none;\n  white-space: nowrap;\n  background: none;\n  background-color: transparent;\n  transition: color 0.2s;\n}\n.v2p-hover-btn::before {\n  content: "";\n  position: absolute;\n  z-index: -1;\n  inset: 0 -5px;\n  transform: scale(0.65);\n  border-radius: var(--v2p-button-radius);\n  opacity: 0;\n  background-color: var(--v2p-color-bg-hover-btn);\n  transition: background-color 0.15s, color 0.15s, transform 0.15s, opacity 0.15s;\n}\n.v2p-hover-btn:hover {\n  text-decoration: none;\n}\n.v2p-hover-btn:hover::before {\n  transform: scale(1);\n  opacity: 1;\n}\n\n.v2p-hover-btn-disabled {\n  pointer-events: none;\n  opacity: 0.8;\n}\n\n.v2p-icon-heart {\n  display: inline-flex;\n  width: 16px;\n  height: 16px;\n  color: var(--v2p-color-heart);\n}\n.v2p-icon-heart svg {\n  fill: var(--v2p-color-heart-fill);\n}\n\n#Main .cell[id^=r] .v2p-auto-hide {\n  overflow: hidden;\n  display: inline-flex;\n  width: 0;\n}\n#Main .cell[id^=r]:has(.v2p-topic-reply-ref) .v2p-member-ref {\n  display: none;\n}\n#Main #reply-box .v2p-reply-preview {\n  font-size: 15px;\n  line-height: 1.6;\n}\n#Main .box .v2p-home-filter-hidden {\n  display: none;\n}\n#Main .box .v2p-home-filter-revealed {\n  opacity: 0.35;\n  transition: opacity 0.15s;\n}\n#Main .box .v2p-home-filter-revealed:hover {\n  opacity: 1;\n}\n#Main .box .v2p-filter-counter.cell {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 4px 10px;\n  font-size: 13px;\n  color: var(--v2p-color-font-secondary);\n  background-color: var(--v2p-color-bg-subtle);\n}\n#Main .box .v2p-filter-counter.cell .v2p-filter-show {\n  cursor: pointer;\n  color: var(--v2p-color-accent-500);\n}\n#Main .box .v2p-filter-counter.cell .v2p-filter-show:hover {\n  text-decoration: underline;\n}\n\n#Main .cell:hover .v2p-topic-preview-btn,\n#Main .cell:hover .v2p-topic-ignore-btn,\n#Rightbar .cell:hover .v2p-topic-preview-btn,\n#Rightbar .cell:hover .v2p-topic-ignore-btn {\n  visibility: visible;\n}\n\n.v2p-checkin-mission-panel {\n  padding: 12px 16px;\n  border-top: 1px solid var(--v2p-color-divider);\n  font-size: 13px;\n  color: var(--v2p-color-foreground);\n  background-color: var(--v2p-color-bg-content);\n}\n.v2p-checkin-mission-panel__content {\n  display: flex;\n  gap: 10px;\n  align-items: flex-start;\n}\n.v2p-checkin-mission-panel__mark {\n  display: inline-flex;\n  flex: 0 0 22px;\n  align-items: center;\n  justify-content: center;\n  height: 22px;\n  border-radius: 999px;\n  font-size: 13px;\n  font-weight: 700;\n  color: var(--v2p-color-accent-700);\n  background-color: var(--v2p-color-accent-100);\n}\n.v2p-checkin-mission-panel__copy {\n  display: flex;\n  flex: 1;\n  flex-direction: column;\n  gap: 2px;\n  min-width: 0;\n}\n.v2p-checkin-mission-panel__title {\n  line-height: 22px;\n}\n.v2p-checkin-mission-panel__description {\n  margin: 0;\n  line-height: 1.55;\n  color: var(--v2p-color-font-secondary);\n}\n.v2p-checkin-mission-panel__detail {\n  font-size: 12px;\n  color: var(--v2p-color-font-tertiary);\n}\n.v2p-checkin-mission-panel__actions {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n  margin-top: 10px;\n  margin-left: 32px;\n}\n.v2p-checkin-mission-panel__button {\n  cursor: pointer;\n  padding: 3px 9px;\n  border: 1px solid var(--v2p-color-border);\n  border-radius: var(--v2p-button-radius);\n  font-size: 12px;\n  line-height: 20px;\n  color: var(--v2p-color-font-secondary);\n  text-decoration: none;\n  background-color: var(--v2p-color-bg-content);\n}\n.v2p-checkin-mission-panel__button:hover {\n  color: var(--v2p-color-foreground);\n  text-decoration: none;\n  background-color: var(--v2p-color-bg-hover-btn);\n}\n.v2p-checkin-mission-panel__button:focus-visible {\n  outline: 2px solid var(--v2p-color-accent-500);\n  outline-offset: 2px;\n}\n.v2p-checkin-mission-panel__button:disabled {\n  cursor: default;\n  opacity: 0.65;\n}\n.v2p-checkin-mission-panel__button[data-action=retry]:disabled {\n  cursor: wait;\n}\n.v2p-checkin-mission-panel__button--primary {\n  border-color: var(--v2p-color-accent-300);\n  color: var(--v2p-color-accent-700);\n  background-color: var(--v2p-color-accent-50);\n}\n.v2p-checkin-mission-panel--success {\n  background-color: var(--v2p-color-accent-50);\n}\n.v2p-checkin-mission-panel--waiting .v2p-checkin-mission-panel__mark {\n  color: var(--v2p-color-orange-400);\n  background-color: var(--v2p-color-orange-100);\n}\n.v2p-checkin-mission-panel--error {\n  background-color: var(--v2p-color-orange-50);\n}\n.v2p-checkin-mission-panel--error .v2p-checkin-mission-panel__mark {\n  color: var(--v2p-color-error);\n  background-color: var(--v2p-color-bg-content);\n}\n.v2p-checkin-mission-panel--muted .v2p-checkin-mission-panel__mark {\n  color: var(--v2p-color-font-tertiary);\n  background-color: var(--v2p-color-bg-block);\n}\n\n#Rightbar .v2p-info-row {\n  display: block;\n  font-size: 12px;\n  color: var(--v2p-color-accent-500);\n  text-align: center;\n}\n#Rightbar .v2p-info-row:hover {\n  text-decoration: none;\n  background-color: var(--v2p-color-accent-50);\n}\n#Rightbar .v2p-info-row.v2p-info-row-muted {\n  color: var(--v2p-color-font-secondary);\n}\n#Rightbar .v2p-info-row.v2p-info-row-muted:hover {\n  background-color: var(--v2p-color-bg-block);\n}\n#Rightbar .v2p-topic-preview-btn {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  height: 20px;\n  font-size: 12px;\n  backdrop-filter: blur(8px);\n  box-shadow: 0 0 0 3px var(--v2p-color-bg-content);\n}\n.v2p-tool-box {\n  position: sticky;\n  z-index: var(--zidx-tools-card);\n  top: var(--v2p-layout-row-gap);\n}\n.v2p-tool-box .v2p-tools {\n  display: grid;\n  grid-auto-rows: auto;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 8px 15px;\n  align-items: center;\n  justify-content: center;\n  font-size: 12px;\n  color: var(--v2p-color-font-secondary);\n}\n\n.v2p-tool {\n  display: inline-flex;\n  gap: 0 5px;\n  align-items: center;\n  padding: 3px 0;\n}\n.v2p-tool:hover {\n  color: var(--v2p-color-button-foreground-hover);\n}\n.v2p-tool .v2p-tool-icon {\n  width: 16px;\n  height: 16px;\n}\n\n#Rightbar .v2p-hot-filter-hidden {\n  display: none;\n}\n#Rightbar .v2p-hot-filter-revealed {\n  opacity: 0.35;\n  transition: opacity 0.15s;\n}\n#Rightbar .v2p-hot-filter-revealed:hover {\n  opacity: 1;\n}\n#Rightbar .v2p-hot-filter-counter {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 6px 10px;\n  font-size: 12px;\n  color: var(--v2p-color-font-tertiary);\n}\n#Rightbar .v2p-hot-filter-counter .v2p-filter-show {\n  cursor: pointer;\n  color: var(--v2p-color-accent-500);\n}\n#Rightbar .v2p-hot-filter-counter .v2p-filter-show:hover {\n  text-decoration: underline;\n}\n\n.v2p-toggle-rightbar-btn {\n  cursor: pointer;\n  position: fixed;\n  z-index: 9999;\n  top: 50%;\n  right: 0;\n  transform: translateY(-50%);\n  display: var(--v2p-rightbar-toggle-display, none);\n  align-items: center;\n  justify-content: center;\n  width: 24px;\n  height: 40px;\n  border-radius: var(--v2p-button-radius) 0 0 var(--v2p-button-radius);\n  background: var(--v2p-color-bg-content);\n  box-shadow: var(--v2p-widget-shadow);\n}\n\n.v2p-toggle-rightbar-icon {\n  width: 16px;\n  height: 16px;\n}\n\n.v2p-topic-actions {\n  display: inline-flex;\n  gap: 2px 10px;\n}\n\n.v2p-topic-preview-btn {\n  cursor: pointer;\n  border: 1px solid var(--v2p-color-border-darker);\n  border-radius: var(--v2p-button-radius);\n  font-size: 13px;\n  color: var(--v2p-color-button-foreground);\n  visibility: hidden;\n  background-color: var(--v2p-color-button-background);\n  outline: none;\n  transition: color 0.25s;\n}\n.v2p-topic-preview-btn:is(:hover, :focus) {\n  color: var(--v2p-color-button-foreground-hover);\n  background-color: var(--v2p-color-button-background-hover);\n}\n.v2p-topic-preview-btn:active {\n  transform: scale(0.95);\n  box-shadow: inset 0 0 3px 1px var(--v2p-color-border-darker);\n  transition: all 0.25s;\n}\n\n.v2p-topic-ignore-btn {\n  cursor: pointer;\n  margin-left: 8px;\n  visibility: hidden;\n}\n\n.v2p-topic-preview {\n  font-size: 15px;\n  line-height: 1.6;\n  padding: var(--v2p-tp-preview-pd);\n}\n.v2p-tpr-loading {\n  --tpr-h: 30px;\n  --tpr-h-p: 22px;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  padding: 25px;\n}\n.v2p-tpr-loading .v2p-tpr {\n  border-radius: var(--v2p-button-radius);\n  background-color: var(--v2p-color-bg-tpr);\n}\n.v2p-tpr-loading .v2p-tpr-info {\n  display: flex;\n  gap: 15px;\n  align-items: center;\n}\n.v2p-tpr-info-avatar {\n  width: var(--tpr-h);\n  height: var(--tpr-h);\n}\n\n.v2p-tpr-info-text {\n  width: 50%;\n  height: var(--tpr-h);\n}\n\n.v2p-tpr-loading .v2p-tpr-content {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  padding: 15px 0 20px;\n}\n.v2p-tpr-loading .v2p-tpr-content .v2p-tpr-content-p {\n  height: var(--tpr-h-p);\n}\n.v2p-tpr-loading .v2p-tpr-cmt {\n  display: flex;\n  gap: 15px;\n  padding-top: 15px;\n  border-top: 1px solid var(--v2p-color-border);\n}\n.v2p-tpr-loading .v2p-tpr-cmt .v2p-tpr-cmt-avatar {\n  width: 50px;\n  height: 50px;\n}\n.v2p-tpr-loading .v2p-tpr-cmt .v2p-tpr-cmt-right {\n  display: flex;\n  flex: 1;\n  flex-direction: column;\n  gap: 10px;\n}\n.v2p-tpr-loading .v2p-tpr-cmt .v2p-tpr-cmt-right .v2p-tpr-cmt-header {\n  width: 50%;\n  height: var(--tpr-h);\n}\n.v2p-tpr-loading .v2p-tpr-cmt .v2p-tpr-cmt-right .v2p-tpr-cmt-p {\n  height: var(--tpr-h-p);\n}\n\n.v2p-tp-info-bar {\n  display: flex;\n  gap: 10px;\n  align-items: center;\n  margin-bottom: 10px;\n}\n\n.v2p-tp-info,\n.v2p-tp-read {\n  overflow: hidden;\n  display: inline-flex;\n  gap: 20px;\n  align-items: center;\n  padding: 5px 10px;\n  border-radius: var(--v2p-button-radius);\n  font-size: 13px;\n  background-color: var(--v2p-color-button-background);\n}\n\n.v2p-tp-read {\n  cursor: pointer;\n  user-select: none;\n  gap: 4px;\n}\n.v2p-tp-read:hover {\n  background-color: var(--v2p-color-button-background-hover);\n}\n\n.v2p-tp-read-icon {\n  width: 16px;\n  height: 16px;\n}\n\n.v2p-tp-member {\n  display: inline-flex;\n  gap: 5px;\n  align-items: center;\n  font-weight: bold;\n}\n\n.v2p-tp-avatar {\n  width: 20px;\n  height: 20px;\n  border-radius: var(--v2p-box-radius);\n  background-color: var(--v2p-color-bg-avatar);\n}\n\n.v2p-topic-preview-addons {\n  margin-top: 30px;\n}\n\n#Main.v2p-topic-preview > .box {\n  border: 1px solid var(--v2p-color-border);\n}\n\na.v2p-topic-preview-title-link:hover {\n  text-decoration: underline 1.5px;\n  text-underline-offset: 0.46ex;\n}\n\n.v2p-dot {\n  margin: 0 8px;\n  font-size: 15px;\n  font-weight: 800;\n}\n\n.v2p-paging {\n  background: none !important;\n}\n.v2p-paging.cell {\n  border-bottom: none;\n}\n\n.v2p-modal-mask {\n  position: fixed;\n  z-index: var(--zidx-modal-mask);\n  inset: 0;\n  overflow: hidden;\n  overflow-y: auto;\n  padding: min(2vh, 60px);\n  background-color: var(--v2p-color-mask);\n}\n\n.v2p-popup {\n  border: 1px solid var(--box-border-color);\n  border-radius: var(--v2p-popup-radius);\n  font-size: 14px;\n  background: var(--v2p-color-bg-widget);\n  backdrop-filter: blur(16px);\n  box-shadow: var(--v2p-widget-shadow);\n  position: absolute;\n  z-index: var(--zidx-popup);\n  top: 0;\n  left: 0;\n}\n\n.v2p-popup-content {\n  overflow-y: auto;\n  width: max-content;\n}\n\n.v2p-toast {\n  position: fixed;\n  z-index: var(--zidx-toast);\n  top: 50px;\n  left: 50%;\n  transform: translateX(-50%);\n  padding: 10px 15px;\n  border-radius: var(--v2p-popup-radius);\n  font-size: 14px;\n  color: var(--v2p-color-background);\n  background: var(--v2p-color-foreground);\n  box-shadow: var(--v2p-toast-shadow);\n}\n\n.v2p-modal-main {\n  position: relative;\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n  box-sizing: border-box;\n  width: clamp(450px, 100%, 800px);\n  height: 100%;\n  margin: 0 auto;\n  border-radius: var(--box-border-radius);\n  background-color: var(--v2p-color-bg-content);\n  outline: none;\n}\n.v2p-modal-header {\n  display: flex;\n  gap: 5px 15px;\n  align-items: center;\n  padding: 15px;\n  border-bottom: 1px solid var(--box-border-color);\n  background-color: var(--v2p-color-bg-content);\n}\n\n.v2p-modal-footer {\n  display: flex;\n  gap: 5px 15px;\n  align-items: center;\n  justify-content: flex-end;\n  padding: 15px;\n  border-top: 1px solid var(--box-border-color);\n  background-color: var(--v2p-color-bg-content);\n}\n\n.v2p-modal-title {\n  overflow: hidden;\n  padding: 2px 0;\n  font-size: 16px;\n  font-weight: bold;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.v2p-modal-actions {\n  display: flex;\n  gap: 0 10px;\n  align-items: center;\n  margin-left: auto;\n}\n\n.v2p-modal-content {\n  position: relative;\n  overflow-y: auto;\n  overscroll-behavior-y: contain;\n  flex: 1;\n  outline: none;\n}\n.v2p-modal-content #Main.v2p-topic-preview > .box {\n  border: none;\n  box-shadow: none;\n}\n\n.v2p-modal-comments {\n  position: absolute;\n  inset: 0;\n  overflow-y: auto;\n  padding: 0 20px;\n  visibility: hidden;\n}\n.v2p-modal-comments.v2p-tab-content-active {\n  z-index: 20;\n  visibility: visible;\n}\n\n.v2p-modal-comment-tabs {\n  display: flex;\n  gap: 4px;\n  align-items: center;\n  padding: 4px 5px;\n  border-radius: var(--v2p-button-radius);\n  font-size: 14px;\n  font-weight: normal;\n  background-color: var(--button-background-color);\n}\n.v2p-modal-comment-tabs > [data-tab-key] {\n  cursor: pointer;\n  padding: 4px 5px;\n  border-radius: var(--v2p-button-radius);\n}\n.v2p-modal-comment-tabs > [data-tab-key]:hover {\n  background-color: var(--v2p-color-button-background-hover);\n}\n.v2p-modal-comment-tabs > [data-tab-key].v2p-tab-active {\n  color: var(--v2p-color-foreground);\n  background-color: var(--v2p-color-accent-100);\n}\n\n.v2p-no-pat {\n  padding: 30px 20px;\n  font-size: 15px;\n  text-align: center;\n}\n.v2p-no-pat .v2p-no-pat-title {\n  font-size: 16px;\n  font-weight: bold;\n}\n.v2p-no-pat .v2p-no-pat-desc {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin-top: 15px;\n}\n.v2p-no-pat .v2p-no-pat-block {\n  display: inline-flex;\n  align-items: center;\n  margin: 0 5px;\n  padding: 2px 10px;\n  border-radius: var(--v2p-box-radius);\n  background-color: var(--v2p-color-bg-block);\n}\n.v2p-no-pat .v2p-no-pat-steps {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 20px;\n  max-width: 800px;\n  margin-top: 20px;\n  padding: 20px;\n  border-radius: var(--v2p-box-radius);\n  background-color: var(--v2p-color-bg-block);\n}\n.v2p-no-pat .v2p-no-pat-step {\n  flex: 1;\n}\n.v2p-no-pat .v2p-no-pat-img {\n  width: 100%;\n  border-radius: var(--v2p-box-radius);\n  box-shadow: var(--v2p-widget-shadow);\n}\n.v2p-no-pat .v2p-icon-logo {\n  width: 15px;\n  height: 15px;\n}\n\n.v2p-blocked-reply:not(.v2p-blocked-revealed) > table,\n.v2p-blocked-reply-empty:not(.v2p-blocked-revealed),\n.v2p-ignored-reply:not(.v2p-ignored-revealed) > table {\n  display: none;\n}\n\n.v2p-ignored-reply.v2p-ignored-revealed > .v2p-ignored-placeholder {\n  display: none;\n}\n\n.v2p-ignored-placeholder {\n  padding: 8px 10px;\n  font-size: 12px;\n  color: var(--v2p-color-font-tertiary);\n  text-align: center;\n}\n.v2p-ignored-placeholder .v2p-ignored-toggle {\n  cursor: pointer;\n  color: var(--v2p-color-accent-500);\n}\n.v2p-ignored-placeholder .v2p-ignored-toggle:focus-visible {\n  outline: 2px solid var(--v2p-color-accent-500);\n  outline-offset: 2px;\n}\n\n.v2p-blocked-notice {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n  align-items: center;\n  justify-content: center;\n  padding: 6px 10px;\n  font-size: 12px;\n  color: var(--v2p-color-font-tertiary);\n  background-color: var(--v2p-color-bg-subtle);\n}\n.v2p-blocked-notice .v2p-blocked-toggle {\n  cursor: pointer;\n  color: var(--v2p-color-accent-500);\n}\n.v2p-blocked-notice .v2p-blocked-toggle:focus-visible {\n  outline: 2px solid var(--v2p-color-accent-500);\n  outline-offset: 2px;\n}\n\n.v2p-likes-box {\n  user-select: none;\n  position: relative;\n  top: 3px;\n  display: inline-flex;\n  column-gap: 5px;\n  align-items: center;\n}\n.v2p-likes-box.v2p-thanked {\n  font-weight: bold;\n  color: var(--v2p-color-heart);\n  opacity: 0.8;\n}\n.v2p-likes-box.v2p-thanked .v2p-icon-heart svg {\n  fill: var(--v2p-color-heart);\n}\n\n@supports not selector(:has(*)) {\n  #Main .cell[id^=r] > table:hover .v2p-controls {\n    opacity: 1;\n  }\n}\n@supports selector(:has(*)) {\n  #Main .cell[id^=r]:not(:has(.cell:hover)) > table:hover .v2p-auto-hide {\n    width: auto;\n  }\n  #Main .cell[id^=r]:not(:has(.cell:hover)) > table:hover .v2p-controls {\n    opacity: 1;\n  }\n}\n.v2p-controls {\n  display: inline-flex;\n  column-gap: 15px;\n  align-items: center;\n  margin-right: 15px;\n  font-size: 12px;\n  opacity: 0;\n}\n.v2p-controls > a {\n  text-decoration: none;\n}\n.v2p-control {\n  position: relative;\n  z-index: var(--zidx-popup);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 16px;\n  height: 16px;\n  padding: 4px 0;\n  color: var(--v2p-color-font-tertiary);\n}\n.v2p-control::after {\n  pointer-events: none;\n  z-index: var(--zidx-tip);\n  overflow: hidden;\n  width: max-content;\n  min-width: 30px;\n  padding: 2px 5px;\n  border-radius: var(--v2p-popup-radius);\n  font-size: 12px;\n  color: var(--v2p-color-foreground);\n  text-align: center;\n  white-space: nowrap;\n  background-color: var(--v2p-color-bg-tooltip);\n  box-shadow: var(--v2p-widget-shadow);\n  position: absolute;\n  z-index: var(--zidx-tip);\n  top: -8px;\n  transform: translateY(-100%);\n  opacity: 0;\n  background-color: var(--v2p-color-bg-tooltip);\n}\n.v2p-control:hover {\n  color: var(--v2p-color-font-secondary);\n}\n.v2p-control.v2p-thanked {\n  cursor: default;\n  color: var(--v2p-color-heart);\n}\n.v2p-control.v2p-thank-pending, .v2p-control.v2p-ignore-pending {\n  cursor: wait;\n  opacity: 0.6;\n}\n.v2p-control:focus-visible {\n  border-radius: 2px;\n  outline: 2px solid var(--v2p-color-heart);\n  outline-offset: 2px;\n}\n.v2p-control:hover::after {\n  opacity: 1;\n}\n.v2p-control.v2p-control-hide::after {\n  content: "\u9690\u85CF\u56DE\u590D";\n}\n\n.v2p-control.v2p-control-thank::after {\n  content: "\u611F\u8C22\u56DE\u590D";\n}\n.v2p-control.v2p-control-thank.v2p-thanked::after {\n  content: "\u5DF2\u611F\u8C22";\n}\n\n.v2p-control.v2p-control-reply::after {\n  content: "\u56DE\u590D";\n}\n\n@media (hover: none) {\n  .v2p-controls {\n    opacity: 1;\n  }\n}\n.topic_buttons .v2p-tb.v2p-hover-btn {\n  color: var(--v2p-color-font-secondary);\n}\n.topic_buttons .v2p-tb.v2p-hover-btn::after {\n  display: none;\n}\n.topic_buttons .v2p-tb.v2p-hover-btn:hover {\n  color: currentColor;\n}\n\n.v2p-tb-icon {\n  width: 15px;\n  height: 15px;\n}\n\n.v2p-emoji-container {\n  overflow-y: auto;\n  max-height: 285px;\n  padding: 15px 18px;\n  color: var(--v2p-color-font-secondary);\n}\n\n.v2p-member-card {\n  --v2p-card-spacing: 10px;\n  max-width: 320px;\n  max-height: 420px;\n  padding: 12px;\n  font-size: 13px;\n  text-align: left;\n}\n.v2p-member-card .v2p-info {\n  display: flex;\n  gap: 15px;\n}\n.v2p-member-card .v2p-info-right {\n  padding: 2px 0;\n}\n.v2p-member-card .v2p-avatar-box {\n  overflow: hidden;\n  display: inline-block;\n  width: 73px;\n  height: 73px;\n  border-radius: var(--v2p-box-radius);\n  background-color: var(--button-background-hover-color);\n}\n.v2p-member-card .v2p-avatar {\n  width: 100%;\n  height: 100%;\n}\n.v2p-member-card .v2p-username {\n  font-size: 16px;\n  font-weight: bold;\n}\n.v2p-member-card .v2p-no {\n  margin: 5px 0;\n}\n.v2p-member-card .v2p-no,\n.v2p-member-card .v2p-created-date {\n  width: 160px;\n  height: 16px;\n}\n.v2p-member-card .v2p-loading {\n  border-radius: var(--v2p-button-radius);\n  background-color: var(--button-background-hover-color);\n}\n.v2p-member-card .v2p-bio {\n  overflow: hidden;\n  display: -webkit-box;\n  -webkit-box-orient: vertical;\n  -webkit-line-clamp: 3;\n  line-height: 1.4;\n  padding-top: var(--v2p-card-spacing);\n}\n\n.v2p-member-card-actions {\n  display: flex;\n  gap: 6px;\n  align-items: center;\n  padding: var(--v2p-card-spacing) 0 0;\n}\n\n.v2p-member-topics {\n  margin-top: var(--v2p-card-spacing);\n  padding-top: var(--v2p-card-spacing);\n  border-top: 1px solid var(--box-border-color);\n}\n\n.v2p-member-topics-header {\n  margin-bottom: 8px;\n  font-size: 12px;\n  font-weight: 500;\n  color: var(--v2p-color-font-secondary);\n}\n\n.v2p-member-topics-list {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n\n.v2p-member-topic-item-row {\n  display: flex;\n  gap: 4px;\n  align-items: center;\n}\n.v2p-member-topic-item-row .v2p-topic-preview-btn {\n  max-width: 0;\n  height: 19px;\n  max-height: 0;\n  padding: 0 4px;\n  font-size: 12px;\n  visibility: hidden;\n}\n.v2p-member-topic-item-row:hover .v2p-topic-preview-btn {\n  max-width: unset;\n  max-height: unset;\n  visibility: visible;\n}\n\n.v2p-member-topic-item {\n  overflow: hidden;\n  flex: 1;\n  min-width: 0;\n  padding-left: 2px;\n  border-radius: var(--v2p-button-radius);\n  font-size: 13px;\n  line-height: 1.5;\n  color: var(--v2p-color-font-primary);\n  text-decoration: none;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.v2p-member-topic-item::before {\n  content: "\u25B8";\n  margin-right: 4px;\n  color: var(--v2p-color-font-tertiary);\n}\n.v2p-member-topic-item:hover {\n  text-decoration: none;\n  background-color: var(--v2p-color-bg-link-hover);\n}\n\n.v2p-reply-tags {\n  cursor: pointer;\n  display: inline-flex;\n  margin: 0 0 2px;\n  padding: 0 3px;\n  border-radius: var(--v2p-button-radius);\n  font-size: 12px;\n  background-color: var(--button-background-hover-color);\n}\n\n.v2p-reply-tags-inline {\n  overflow: hidden;\n  max-width: 300px;\n  margin: 0 5px 0 0;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.v2p-emoticons-box {\n  font-size: 15px;\n}\n\n.v2p-emoji-group ~ .v2p-emoji-group {\n  margin-top: 10px;\n}\n\n.v2p-emoji-title {\n  margin: 0 0 10px;\n  font-size: 14px;\n  text-align: left;\n}\n\n.v2p-emoji-list {\n  display: grid;\n  grid-template-columns: repeat(8, 1fr);\n  gap: 5px;\n  font-size: 20px;\n}\n\n.v2p-emoji {\n  cursor: pointer;\n  height: 20px;\n  padding: 3px;\n  border-radius: var(--v2p-button-radius);\n  line-height: 20px;\n}\n.v2p-emoji:hover {\n  background-color: var(--box-background-hover-color);\n}\n.v2p-emoji > img {\n  height: 100%;\n}\n\n.v2p-decode {\n  cursor: copy;\n  position: relative;\n  padding: 2px 4px;\n  font-size: 13px;\n  color: var(--v2p-color-orange-400);\n  text-decoration: none;\n  background-color: var(--v2p-color-orange-50);\n}\n.v2p-decode::after {\n  pointer-events: none;\n  z-index: var(--zidx-tip);\n  overflow: hidden;\n  width: max-content;\n  min-width: 30px;\n  padding: 2px 5px;\n  border-radius: var(--v2p-popup-radius);\n  font-size: 12px;\n  color: var(--v2p-color-foreground);\n  text-align: center;\n  white-space: nowrap;\n  background-color: var(--v2p-color-bg-tooltip);\n  box-shadow: var(--v2p-widget-shadow);\n  content: attr(data-title);\n  position: absolute;\n  top: -8px;\n  left: 50%;\n  transform: translate(-50%, -100%);\n  opacity: 0;\n  background-color: var(--v2p-color-bg-tooltip);\n}\n.v2p-decode:hover {\n  color: var(--v2p-color-orange-400);\n}\n.v2p-decode:hover::after {\n  opacity: 1;\n}\n\n.v2p-reply-content {\n  position: relative;\n}\n.v2p-reply-content .v2p-expand-btn.normal.button {\n  position: absolute;\n  z-index: var(--zidx-expand-btn);\n  bottom: 5px;\n  left: 50%;\n  transform: translateX(-50%);\n  font-size: 12px;\n  font-weight: 400;\n}\n.v2p-reply-content.v2p-collapsed {\n  overflow: hidden;\n  max-height: 250px;\n  padding-bottom: 0;\n}\n.v2p-reply-content.v2p-collapsed::before {\n  pointer-events: none;\n  content: "";\n  position: absolute;\n  z-index: var(--zidx-expand-mask);\n  right: 0;\n  bottom: 0;\n  left: 0;\n  height: 130px;\n  background: linear-gradient(to top, var(--bg-reply) 10px, transparent);\n}\n.v2p-reply-content.v2p-collapsed .reply_content a,\n.v2p-reply-content.v2p-collapsed .reply_content .embedded_video {\n  pointer-events: none;\n}\n.v2p-reply-content.v2p-collapsed .v2p-expand-btn.normal.button {\n  bottom: 10px;\n  transform: translateX(-50%);\n}\n.v2p-reply-content:not(.v2p-collapsed) {\n  overflow: auto;\n  max-height: none;\n  padding-bottom: 40px;\n}\n\n.cell[id^=r] .cell[id^=r] .v2p-reply-content .v2p-expand-btn.normal.button {\n  color: var(--v2p-color-button-foreground);\n  background: var(--v2p-color-button-background-hover);\n  box-shadow: var(--button-hover-shadow);\n}\n\n.v2p-empty-content {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  padding-top: 20px;\n  font-size: 14px;\n  color: var(--v2p-color-font-secondary);\n}\n.v2p-empty-content .v2p-text-emoji {\n  font-size: 20px;\n}\n\n.v2p-topic-reply-ref {\n  margin: 0 -10px 15px;\n  padding: 5px 10px;\n  border-radius: var(--v2p-box-radius);\n  font-size: 13px;\n  color: var(--v2p-color-font-tertiary);\n  background-color: var(--v2p-color-bg-block);\n}\n\n.v2p-topic-reply-box {\n  margin-top: 50px;\n  padding: 30px 0;\n  border-top: 1px solid var(--v2p-color-divider);\n  font-size: 14px;\n  line-height: 1.55;\n  color: var(--v2p-color-font-secondary);\n}\n.v2p-topic-reply ~ .v2p-topic-reply {\n  margin-top: 15px;\n}\n.v2p-topic-reply-member {\n  display: inline;\n  font-weight: bold;\n  color: var(--v2p-color-main-700);\n}\n\n.v2p-topic-reply-avatar {\n  position: relative;\n  top: 2px;\n  overflow: hidden;\n  width: 15px;\n  height: 15px;\n  margin-right: 5px;\n  border-radius: var(--v2p-box-radius);\n  object-fit: cover;\n  background-color: var(--v2p-color-bg-avatar);\n}\n\n.v2p-topic-reply-content {\n  display: inline;\n}\n\n.v2p-topic-reply-tip {\n  margin-top: 20px;\n  font-size: 13px;\n  color: var(--v2p-color-font-quaternary);\n  text-align: center;\n}\n\n.v2p-reply-wrap {\n  resize: none;\n  overflow: hidden;\n  height: unset;\n  min-height: 140px !important;\n  max-height: 800px !important;\n  border: 1px solid var(--button-border-color);\n  border-radius: var(--v2p-input-radius);\n  font-size: 15px;\n  color: currentColor;\n  background-color: var(--v2p-color-bg-input);\n  transition: opacity 0.25s;\n}\n.v2p-reply-wrap::placeholder {\n  font-size: 15px;\n  color: var(--v2p-color-font-tertiary);\n}\n.v2p-reply-wrap:is(:focus, :focus-within) {\n  border-color: var(--button-border-hover-color);\n  background-color: transparent;\n  outline: none;\n  box-shadow: none;\n}\n.v2p-reply-wrap #reply_content {\n  border: none;\n  background-color: transparent;\n}\n.v2p-reply-wrap #reply_content::placeholder {\n  font-size: 14px;\n  color: var(--v2p-color-font-tertiary);\n}\n.v2p-reply-wrap #reply_content:focus {\n  background-color: var(--v2p-color-bg-content);\n  outline: none;\n}\n\n.v2p-reply-upload-bar {\n  cursor: pointer;\n  padding: 6px 10px;\n  border-top: 1px dashed var(--v2p-color-border-darker);\n  font-size: 12px;\n  color: var(--v2p-color-font-tertiary);\n  background-color: var(--v2p-color-bg-input);\n}\n\n.v2p-reply-upload-bar-disabled {\n  pointer-events: none;\n}\n\n.v2p-footer {\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 35px 10px 20px;\n  border-top: 1px solid var(--v2p-color-divider);\n  font-size: 12px;\n  color: var(--v2p-color-font-tertiary);\n}\n.v2p-footer a:hover {\n  text-decoration: none;\n}\n\n.v2p-footer-logo {\n  --logo-size: 16px;\n  position: absolute;\n  top: calc(-1 * (var(--logo-size) + 5px) / 2);\n  left: 50%;\n  transform: translateX(-50%);\n  display: inline-flex;\n  box-sizing: border-box;\n  padding: 3px 25px;\n  background-color: var(--v2p-color-bg-footer);\n}\n.v2p-footer-logo svg {\n  width: var(--logo-size);\n}\n\n.v2p-footer-text {\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-start;\n  width: 240px;\n  color: var(--v2p-color-font-secondary);\n}\n\n.v2p-footer-links {\n  display: inline-flex;\n  gap: 0 8px;\n  align-items: center;\n}\n\n.v2p-footer-link {\n  padding: 4px 5px;\n  color: currentColor;\n}\n\n.v2p-footer-brand {\n  display: inline-flex;\n  gap: 0 15px;\n  align-items: center;\n  justify-content: flex-end;\n  width: 240px;\n}\n.v2p-footer-brand .v2p-github-ref {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 20px;\n  height: 20px;\n  padding: 2px 0;\n}\n\n.v2p-color-mode-toggle {\n  width: 22px;\n  height: 22px;\n  opacity: 0.8;\n}\n.v2p-color-mode-toggle:hover {\n  opacity: 1;\n}\n\n.v2p-reply-tabs {\n  display: flex;\n  gap: 0 6px;\n  align-items: center;\n  font-size: 14px;\n}\n.v2p-reply-tabs .v2p-reply-tab {\n  cursor: pointer;\n  padding: 2px 3px;\n}\n.v2p-reply-tabs .v2p-reply-tab.active {\n  text-decoration: underline;\n  text-decoration-color: var(--v2p-color-font-tertiary);\n  text-decoration-thickness: 2px;\n  text-underline-offset: 4px;\n}\n\n.v2p-select-dropdown {\n  display: flex;\n  flex-direction: column;\n  gap: 1px;\n  padding: 5px;\n  border-radius: var(--v2p-popup-radius);\n  font-size: 12px;\n  text-align: left;\n}\n.v2p-select-item {\n  cursor: pointer;\n  padding: 5px 10px;\n  border-radius: var(--v2p-button-radius);\n  white-space: nowrap;\n}\n.v2p-select-item:hover {\n  background-color: var(--v2p-color-button-background-hover);\n}\n.v2p-select-item.v2p-select-item-active {\n  background-color: var(--v2p-color-accent-50);\n}\n\n.v2p-select-divider {\n  pointer-events: none;\n  height: 1px;\n  margin: 5px 0;\n  background-color: var(--v2p-color-border);\n}\n\n.v2p-preview-retry,\n.v2p-topic-preview-retry,\na.v2p-preview-retry,\na.v2p-topic-preview-retry,\na:link.v2p-preview-retry,\na:link.v2p-topic-preview-retry {\n  text-decoration: underline 1px;\n  text-underline-offset: var(--v2p-underline-offset);\n  cursor: pointer;\n}\n\n.v2p-indent .v2p-member-ref {\n  display: none;\n}\n\n.v2p-member-ref + br {\n  display: none;\n}\n.v2p-member-ref + br + b {\n  display: none;\n}\n.v2p-member-ref.v2p-member-ref-show {\n  display: inline !important;\n}\n\n.v2p-layout-toggle {\n  display: inline-block;\n  width: 18px;\n  height: 18px;\n  padding: 4px 2px;\n  color: var(--v2p-color-font-tertiary);\n}\n\n.v2p-content-layout.v2p-content-layout.content {\n  --v2p-content-width: 2000px;\n}\n.v2p-content-layout.v2p-content-layout.content #Main.v2p-horizontal-layout {\n  display: flex;\n  flex-wrap: wrap;\n  gap: var(--v2p-layout-column-gap);\n  max-width: unset;\n}\n.v2p-left-side {\n  flex: 1;\n  min-width: 0;\n}\n.v2p-left-side > .v2p-left-group {\n  position: sticky;\n  z-index: var(--zidx-reply-box);\n  top: 0;\n  display: flex;\n  flex-direction: column;\n  max-height: calc(100vh - var(--v2p-nav-height) - var(--v2p-layout-row-gap));\n}\n.v2p-left-side > .v2p-left-group .sep,\n.v2p-left-side > .v2p-left-group .sep20,\n.v2p-left-side > .v2p-left-group > #topic-tip-box {\n  flex-shrink: 0;\n}\n.v2p-left-side > .v2p-left-group > .box:has(.topic_buttons) {\n  display: flex;\n  flex: 1;\n  flex-direction: column;\n  min-height: 0;\n}\n.v2p-left-side > .v2p-left-group > .box:has(.topic_buttons) > .header {\n  flex-shrink: 0;\n}\n.v2p-left-side .v2p-left-side-content {\n  overflow: auto;\n  flex: 1;\n  margin-right: calc(var(--v2p-spacing-box) * -1);\n  padding-right: var(--v2p-spacing-box);\n  border-bottom: 1px solid var(--box-border-color);\n}\n\n.v2p-right-side {\n  flex: 1;\n  min-width: 0;\n}\n\n.v2p-register-days {\n  display: inline-flex;\n  align-items: center;\n  margin-left: 2px;\n  padding: 0 2px;\n  border-radius: var(--v2p-button-radius);\n  color: var(--v2p-color-orange-400);\n  background-color: var(--v2p-color-orange-100);\n}\n.v2p-register-days.v2p-register-days-large {\n  display: inline-flex;\n  margin-left: 10px;\n  padding: 2px 5px;\n  border-radius: var(--v2p-button-radius);\n  font-size: 16px;\n  line-height: 1.4;\n}\n\n.v2p-topics-hot-loading {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 50px 0;\n  color: currentColor;\n}\n.v2p-topics-hot-loading .v2p-icon-loading {\n  width: 40px;\n}\n\n.v2p-topics-hot-empty {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  min-height: 84px;\n  margin: 12px 10px 10px;\n  padding: 18px 16px;\n  border: 1px dashed var(--v2p-color-divider);\n  border-radius: var(--v2p-input-radius);\n  font-size: 13px;\n  line-height: 1.6;\n  color: var(--v2p-color-font-tertiary);\n  text-align: center;\n  background-color: var(--v2p-color-bg-subtle);\n}\n\n.v2p-topics-hot-header {\n  display: flex;\n  align-items: center;\n}\n\n.v2p-topics-hot-picker {\n  cursor: pointer;\n  display: inline-flex;\n  gap: 4px;\n  align-items: center;\n  margin-left: auto;\n  padding: 1px 6px;\n  border-radius: var(--v2p-button-radius);\n  font-size: 13px;\n  background-color: var(--v2p-color-button-background);\n}\n.v2p-topics-hot-picker:hover {\n  background-color: var(--v2p-color-button-background-hover);\n}\n.v2p-topics-hot-icon {\n  position: relative;\n  top: -2px;\n  width: 1em;\n  height: 1em;\n}\n\n.v2p-tag-block {\n  margin-bottom: 10px;\n}\n\n@supports (filter: blur(6px)) {\n  .v2p-hide-account {\n    opacity: 0.5;\n    filter: blur(6px);\n  }\n}\n@supports not (filter: blur(6px)) {\n  .v2p-hide-account {\n    opacity: 0;\n  }\n}\n\n@supports (filter: blur(6px)) {\n  .v2p-hide-balance {\n    opacity: 0.5;\n    filter: blur(6px);\n  }\n  .v2p-hide-balance:hover {\n    opacity: 1;\n    filter: none;\n  }\n}\n@supports not (filter: blur(6px)) {\n  .v2p-hide-balance {\n    opacity: 0;\n  }\n  .v2p-hide-balance:hover {\n    opacity: 1;\n  }\n}\n\n.v2p-member-name {\n  display: flex;\n  align-items: center;\n}\n\n.v2p-settings-header.page-content-header {\n  gap: 10px;\n}\n.v2p-settings-header.page-content-header .v2p-settings-icon {\n  width: 40px;\n  height: 40px;\n  margin: 0;\n}\n.v2p-settings-header.page-content-header .v2p-settings-title {\n  padding: 0;\n  white-space: nowrap;\n}\n.v2p-settings-header.page-content-header .v2p-settings-actions {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: flex-end;\n}\n\n.v2p-link-preview-btn {\n  cursor: pointer;\n  user-select: none;\n  display: inline-flex;\n  height: 100%;\n  margin-left: 5px;\n  padding: 0 5px;\n  border-radius: var(--v2p-button-radius);\n  font-size: 12px;\n  color: var(--v2p-color-bg-content);\n  background-color: var(--v2p-color-accent-500);\n}\n.v2p-link-preview-btn:hover {\n  background-color: var(--v2p-color-accent-600);\n}\n\n#node_sidebar.v2p-node-sidebar-flamewar {\n  border: 1px solid var(--v2p-color-orange-400);\n  border-radius: var(--v2p-box-radius);\n  background-color: var(--v2p-color-orange-50);\n}\n\n.v2p-topic-preview-frame {\n  width: 100%;\n  height: 100%;\n  border: none;\n}\n\n.v2p-topic-preview-wrapper {\n  overflow: hidden;\n  width: 100%;\n  height: 100%;\n}\n\n.v2p-sync-dialog-main.v2p-modal-main {\n  height: auto;\n}\n.v2p-sync-dialog-main.v2p-modal-main .v2p-modal-content {\n  padding: var(--v2p-spacing-box);\n}\n.v2p-sync-dialog-message {\n  margin: 0 0 var(--v2p-spacing-cell);\n  font-size: 15px;\n  font-weight: 500;\n  line-height: 1.6;\n  color: var(--v2p-color-foreground);\n}\n\n.v2p-sync-dialog-message-sub {\n  margin: 0 0 calc(var(--v2p-spacing-cell) * 0.75);\n  padding: calc(var(--v2p-spacing-cell) * 0.75) var(--v2p-spacing-cell);\n  border-radius: var(--v2p-input-radius);\n  font-size: 14px;\n  line-height: 1.6;\n  color: var(--v2p-color-font-secondary);\n  background-color: var(--v2p-color-bg-input);\n}\n.v2p-sync-dialog-message-sub strong {\n  font-weight: 600;\n  color: var(--v2p-color-foreground);\n}\n\n.v2p-sync-dialog-message-question {\n  margin: calc(var(--v2p-spacing-cell) * 1.25) 0 var(--v2p-spacing-cell);\n  font-size: 15px;\n  font-weight: 500;\n  line-height: 1.6;\n  color: var(--v2p-color-foreground);\n}\n\n.v2p-sync-dialog-message-tip {\n  margin: calc(var(--v2p-spacing-cell) * 0.5) 0 0;\n  padding: calc(var(--v2p-spacing-cell) * 0.5) var(--v2p-spacing-cell);\n  border-radius: var(--v2p-input-radius);\n  font-size: 13px;\n  line-height: 1.5;\n  color: var(--v2p-color-font-tertiary);\n  background-color: var(--v2p-color-bg-subtle);\n}\n\n.v2p-modal-footer .v2p-sync-skip-btn,\n.v2p-modal-footer .v2p-sync-confirm-btn {\n  height: 32px;\n  padding: 0 16px;\n  font-size: 14px;\n}\n.v2p-modal-footer .v2p-sync-confirm-btn {\n  font-weight: 600;\n}\n\n/* V2EX Polish c8f1b70; Copyright (c) 2023-present LeoKu and contributors.\n * MIT; see licenses/v2ex-polish-MIT.txt. Font overrides removed as requested.\n */\nbody.v2p-theme-minimalist,\n.v2p-theme-minimalist,\n:root[data-v2p-theme=minimalist],\n:root[data-v2p-theme=minimalist] body {\n  --v2p-color-accent-50: oklch(97.9% 0.021 166.113deg);\n  --v2p-color-accent-100: oklch(95% 0.052 163.051deg);\n  --v2p-color-accent-200: oklch(90.5% 0.093 164.15deg);\n  --v2p-color-accent-300: oklch(84.5% 0.143 164.978deg);\n  --v2p-color-accent-400: oklch(76.5% 0.177 163.223deg);\n  --v2p-color-accent-500: oklch(69.6% 0.17 162.48deg);\n  --v2p-color-accent-600: oklch(59.6% 0.145 163.225deg);\n  --v2p-color-accent-700: oklch(50.8% 0.118 165.612deg);\n  --v2p-color-orange-50: #fff7ed;\n  --v2p-color-orange-100: #ffedd5;\n  --v2p-color-orange-400: #fb923c;\n  --v2p-color-background: oklch(97.6% 0.005 253deg);\n  --v2p-color-foreground: oklch(28.2% 0.091 267.935deg);\n  --v2p-color-selection-foreground: currentColor;\n  --v2p-color-selection-background: oklch(93.2% 0.032 255.585deg);\n  --v2p-color-selection-background-img: var(--v2p-color-selection-background);\n  --v2p-color-font-secondary: oklch(from var(--v2p-color-foreground) l c h / 80%);\n  --v2p-color-font-tertiary: oklch(from var(--v2p-color-foreground) l c h / 68%);\n  --v2p-color-font-quaternary: oklch(from var(--v2p-color-foreground) l c h / 57%);\n  --v2p-color-button-background: var(--v2p-color-background);\n  --v2p-color-button-foreground: var(--v2p-color-foreground);\n  --v2p-color-button-background-hover: oklch(from var(--v2p-color-foreground) l c h / 10%);\n  --v2p-color-button-foreground-hover: var(--v2p-color-foreground);\n  --v2p-color-button-special-background: var(--v2p-color-accent-50);\n  --v2p-color-button-special-foreground: var(--v2p-color-accent-700);\n  --v2p-color-button-special-border: var(--v2p-color-accent-600);\n  --v2p-color-bg-content: #fff;\n  --v2p-color-bg-footer: var(--v2p-color-background);\n  --v2p-color-bg-hover-btn: rgb(152 147 165 / 10%);\n  --v2p-color-bg-subtle: oklch(from var(--v2p-color-foreground) l c h / 2%);\n  --v2p-color-bg-input: var(--v2p-color-background);\n  --v2p-color-bg-search: var(--v2p-color-bg-content);\n  --v2p-color-bg-search-active: var(--v2p-color-bg-search);\n  --v2p-color-bg-widget: var(--v2p-color-bg-content);\n  --v2p-color-bg-reply: var(--v2p-color-background);\n  --v2p-color-bg-tooltip: var(--v2p-color-background);\n  --v2p-color-bg-tabs: var(--v2p-color-background);\n  --v2p-color-bg-tpr: var(--v2p-color-background);\n  --v2p-color-bg-avatar: var(--v2p-color-background);\n  --v2p-color-bg-block: var(--v2p-color-background);\n  --v2p-color-bg-block-darker: var(--v2p-color-background);\n  --v2p-color-bg-link: transparent;\n  --v2p-color-bg-link-hover: var(--v2p-color-background);\n  --v2p-color-tabs: var(--v2p-color-foreground);\n  --v2p-color-heart: #ef4444;\n  --v2p-color-heart-fill: #fee2e2;\n  --v2p-color-mask: rgb(0 0 0 / 25%);\n  --v2p-color-divider: lab(30.7907% 22.35 -63.8417 / 20%);\n  --v2p-color-border: var(--v2p-color-divider);\n  --v2p-color-input-border: var(--v2p-color-border);\n  --v2p-color-border-darker: lab(30.7907% 22.35 -63.8417 / 30%);\n  --v2p-color-link-visited: var(--v2p-color-font-secondary);\n  --v2p-color-error: #ef4444;\n  --v2p-color-bg-error: #fee2e2;\n  --v2p-color-cell-num: var(--v2p-color-font-secondary);\n  --v2p-box-radius: 0;\n  --v2p-input-radius: 4px;\n  --v2p-button-radius: var(--v2p-input-radius);\n  --v2p-popup-radius: var(--v2p-input-radius);\n  --v2p-box-shadow: none;\n  --v2p-widget-shadow: 0 2px 8px -2px lab(30.7907% 22.35 -63.8417 / 12%);\n  --v2p-toast-shadow: 0 4px 12px -2px lab(30.7907% 22.35 -63.8417 / 15%);\n  --link-color: var(--v2p-color-foreground);\n  --box-background-alt-color: var(--v2p-color-bg-block);\n  --box-background-hover-color: var(--v2p-color-bg-link-hover);\n  --button-hover-color: var(--v2p-color-button-background-hover);\n  --button-border-color: var(--v2p-color-border);\n  --button-border-hover-color: var(--v2p-color-border-darker);\n  position: relative;\n  visibility: visible;\n}\nbody.v2p-theme-minimalist .v2p-modal-mask,\n.v2p-theme-minimalist .v2p-modal-mask,\n:root[data-v2p-theme=minimalist] .v2p-modal-mask,\n:root[data-v2p-theme=minimalist] body .v2p-modal-mask {\n  background-color: oklch(from var(--v2p-color-bg-content) l c h/60%);\n  background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(30, 64, 175, 0.03) 2px, rgba(30, 64, 175, 0.03) 4px);\n}\nbody.v2p-theme-minimalist #Top,\n.v2p-theme-minimalist #Top,\n:root[data-v2p-theme=minimalist] #Top,\n:root[data-v2p-theme=minimalist] body #Top {\n  background-color: var(--v2p-color-background);\n}\nbody.v2p-theme-minimalist #Wrapper #Main > .box:has(.topic_buttons),\nbody.v2p-theme-minimalist #Wrapper #Main .v2p-left-group .box:has(.topic_buttons),\n.v2p-theme-minimalist #Wrapper #Main > .box:has(.topic_buttons),\n.v2p-theme-minimalist #Wrapper #Main .v2p-left-group .box:has(.topic_buttons),\n:root[data-v2p-theme=minimalist] #Wrapper #Main > .box:has(.topic_buttons),\n:root[data-v2p-theme=minimalist] #Wrapper #Main .v2p-left-group .box:has(.topic_buttons),\n:root[data-v2p-theme=minimalist] body #Wrapper #Main > .box:has(.topic_buttons),\n:root[data-v2p-theme=minimalist] body #Wrapper #Main .v2p-left-group .box:has(.topic_buttons) {\n  border-bottom: 1px solid var(--v2p-color-border) !important;\n}\nbody.v2p-theme-minimalist #Wrapper #Main #SecondaryTabs,\n.v2p-theme-minimalist #Wrapper #Main #SecondaryTabs,\n:root[data-v2p-theme=minimalist] #Wrapper #Main #SecondaryTabs,\n:root[data-v2p-theme=minimalist] body #Wrapper #Main #SecondaryTabs {\n  border-radius: 0;\n}\nbody.v2p-theme-minimalist #Wrapper .box,\n.v2p-theme-minimalist #Wrapper .box,\n:root[data-v2p-theme=minimalist] #Wrapper .box,\n:root[data-v2p-theme=minimalist] body #Wrapper .box {\n  border: 1px solid var(--v2p-color-border);\n}\nbody.v2p-theme-minimalist #Rightbar > .box:has(.member-activity-bar),\n.v2p-theme-minimalist #Rightbar > .box:has(.member-activity-bar),\n:root[data-v2p-theme=minimalist] #Rightbar > .box:has(.member-activity-bar),\n:root[data-v2p-theme=minimalist] body #Rightbar > .box:has(.member-activity-bar) {\n  background-image: linear-gradient(to top, transparent 0%, transparent 50%, lab(30.7907% 22.35 -63.8417 / 0.08) 100%);\n}\nbody.v2p-theme-minimalist .fade,\n.v2p-theme-minimalist .fade,\n:root[data-v2p-theme=minimalist] .fade,\n:root[data-v2p-theme=minimalist] body .fade {\n  color: var(--v2p-color-font-secondary);\n}\nbody.v2p-theme-minimalist .button.special,\n.v2p-theme-minimalist .button.special,\n:root[data-v2p-theme=minimalist] .button.special,\n:root[data-v2p-theme=minimalist] body .button.special {\n  --button-hover-shadow:\n    0 1.8px 0 var(--v2p-color-accent-100), 0 1.8px 0 var(--v2p-color-accent-50);\n}\nbody.v2p-theme-minimalist .button.special:hover, body.v2p-theme-minimalist .button.special:hover:enabled,\n.v2p-theme-minimalist .button.special:hover,\n.v2p-theme-minimalist .button.special:hover:enabled,\n:root[data-v2p-theme=minimalist] .button.special:hover,\n:root[data-v2p-theme=minimalist] .button.special:hover:enabled,\n:root[data-v2p-theme=minimalist] body .button.special:hover,\n:root[data-v2p-theme=minimalist] body .button.special:hover:enabled {\n  --button-hover-shadow:\n    0 1.8px 0 var(--v2p-color-accent-500), 0 1.8px 0 var(--v2p-color-button-special-border);\n  text-shadow: none;\n}\nbody.v2p-theme-minimalist .badge.op,\n.v2p-theme-minimalist .badge.op,\n:root[data-v2p-theme=minimalist] .badge.op,\n:root[data-v2p-theme=minimalist] body .badge.op {\n  border: 1px solid var(--v2p-color-accent-100);\n  color: var(--v2p-color-accent-600);\n  background-color: var(--v2p-color-accent-100);\n}\nbody.v2p-theme-minimalist .badge.mod,\n.v2p-theme-minimalist .badge.mod,\n:root[data-v2p-theme=minimalist] .badge.mod,\n:root[data-v2p-theme=minimalist] body .badge.mod {\n  border: 1px solid var(--v2p-color-accent-600);\n  background-color: var(--v2p-color-accent-600);\n}\nbody.v2p-theme-minimalist .badge.pro,\n.v2p-theme-minimalist .badge.pro,\n:root[data-v2p-theme=minimalist] .badge.pro,\n:root[data-v2p-theme=minimalist] body .badge.pro {\n  border: 1px solid var(--v2p-color-foreground);\n  color: var(--v2p-color-bg-content);\n  background-color: var(--v2p-color-foreground);\n}\nbody.v2p-theme-minimalist .v2p-modal-main,\n.v2p-theme-minimalist .v2p-modal-main,\n:root[data-v2p-theme=minimalist] .v2p-modal-main,\n:root[data-v2p-theme=minimalist] body .v2p-modal-main {\n  border: 2px solid var(--v2p-color-border);\n}\nbody.v2p-theme-minimalist .v2p-modal-main .v2p-modal-header,\n.v2p-theme-minimalist .v2p-modal-main .v2p-modal-header,\n:root[data-v2p-theme=minimalist] .v2p-modal-main .v2p-modal-header,\n:root[data-v2p-theme=minimalist] body .v2p-modal-main .v2p-modal-header {\n  background-image: linear-gradient(to bottom, lab(30.7907% 22.35 -63.8417 / 0.03) 0%, transparent 100%);\n}\nbody.v2p-theme-minimalist .v2p-control::after,\n.v2p-theme-minimalist .v2p-control::after,\n:root[data-v2p-theme=minimalist] .v2p-control::after,\n:root[data-v2p-theme=minimalist] body .v2p-control::after {\n  background-color: var(--v2p-color-background);\n}\nbody.v2p-theme-minimalist .green,\n.v2p-theme-minimalist .green,\n:root[data-v2p-theme=minimalist] .green,\n:root[data-v2p-theme=minimalist] body .green {\n  color: var(--v2p-color-accent-500);\n}\nbody.v2p-theme-minimalist .onoffswitch label .frame::before,\n.v2p-theme-minimalist .onoffswitch label .frame::before,\n:root[data-v2p-theme=minimalist] .onoffswitch label .frame::before,\n:root[data-v2p-theme=minimalist] body .onoffswitch label .frame::before {\n  background-color: var(--v2p-color-accent-500);\n}\nbody.v2p-theme-minimalist .onoffswitch label .frame::after,\n.v2p-theme-minimalist .onoffswitch label .frame::after,\n:root[data-v2p-theme=minimalist] .onoffswitch label .frame::after,\n:root[data-v2p-theme=minimalist] body .onoffswitch label .frame::after {\n  background-color: var(--v2p-color-bg-search);\n}\nbody.v2p-theme-minimalist :is(.subtle),\n.v2p-theme-minimalist :is(.subtle),\n:root[data-v2p-theme=minimalist] :is(.subtle),\n:root[data-v2p-theme=minimalist] body :is(.subtle) {\n  border: none;\n  background-color: transparent;\n  background-image: linear-gradient(to right, lab(30.7907% 22.35 -63.8417 / 0.08) 0%, transparent 100%);\n}\n\n/* V2EX Polish c8f1b70; Copyright (c) 2023-present LeoKu and contributors.\n * MIT; see licenses/v2ex-polish-MIT.txt. Font overrides removed as requested.\n */\nbody.v2p-mobile,\n:root[data-v2p-mobile=true],\n:root[data-v2p-mobile=true] body {\n  --v2p-spacing-cell: 10px;\n}\nbody.v2p-mobile #site-header,\n:root[data-v2p-mobile=true] #site-header,\n:root[data-v2p-mobile=true] body #site-header {\n  border-color: var(--v2p-color-border);\n}\nbody.v2p-mobile #site-header #site-header-menu #menu-body,\n:root[data-v2p-mobile=true] #site-header #site-header-menu #menu-body,\n:root[data-v2p-mobile=true] body #site-header #site-header-menu #menu-body {\n  right: 5px;\n  border: 1px solid var(--v2p-color-border);\n  border-radius: 8px;\n}\nbody.v2p-mobile #Wrapper .content,\n:root[data-v2p-mobile=true] #Wrapper .content,\n:root[data-v2p-mobile=true] body #Wrapper .content {\n  display: block;\n  padding: 0;\n}\nbody.v2p-mobile #Wrapper .content .flex-one-row:first-of-type:not(.cell[id^=r_] .flex-one-row),\n:root[data-v2p-mobile=true] #Wrapper .content .flex-one-row:first-of-type:not(.cell[id^=r_] .flex-one-row),\n:root[data-v2p-mobile=true] body #Wrapper .content .flex-one-row:first-of-type:not(.cell[id^=r_] .flex-one-row) {\n  padding: 8px var(--v2p-spacing-cell) !important;\n}\nbody.v2p-mobile #Wrapper .content .header,\n:root[data-v2p-mobile=true] #Wrapper .content .header,\n:root[data-v2p-mobile=true] body #Wrapper .content .header {\n  padding: 10px var(--v2p-spacing-cell);\n}\nbody.v2p-mobile .box,\n:root[data-v2p-mobile=true] .box,\n:root[data-v2p-mobile=true] body .box {\n  border-radius: 0;\n}\nbody.v2p-mobile .box .cell:not([id^=r_]),\n:root[data-v2p-mobile=true] .box .cell:not([id^=r_]),\n:root[data-v2p-mobile=true] body .box .cell:not([id^=r_]) {\n  padding: var(--v2p-spacing-cell);\n}\nbody.v2p-mobile .box .cell .item,\n:root[data-v2p-mobile=true] .box .cell .item,\n:root[data-v2p-mobile=true] body .box .cell .item {\n  padding-right: 8px;\n}\nbody.v2p-mobile .box .cell .item .item_title,\n:root[data-v2p-mobile=true] .box .cell .item .item_title,\n:root[data-v2p-mobile=true] body .box .cell .item .item_title {\n  padding-top: 4px;\n}\nbody.v2p-mobile .box .cell .item .item_title .topic-link:hover,\n:root[data-v2p-mobile=true] .box .cell .item .item_title .topic-link:hover,\n:root[data-v2p-mobile=true] body .box .cell .item .item_title .topic-link:hover {\n  text-decoration: none;\n}\nbody.v2p-mobile .box .cell .item .count_livid,\n:root[data-v2p-mobile=true] .box .cell .item .count_livid,\n:root[data-v2p-mobile=true] body .box .cell .item .count_livid {\n  user-select: none;\n  display: inline-block;\n  padding: 5px 10px;\n  border-radius: var(--v2p-button-radius);\n  font-size: 12px;\n  font-weight: 400;\n  white-space: nowrap;\n  margin-right: 0;\n  color: var(--v2p-color-button-foreground);\n  background-color: var(--v2p-color-bg-block);\n}\n\n/* V2EX.REP; Copyright (c) 2023-2026 Pipecraft. MIT; see licenses/v2ex-rep-MIT.txt. */\na.icon_button {\n  opacity: 1 !important;\n  visibility: visible;\n  margin-right: 14px;\n}\n\na.icon_button:last-child {\n  margin-right: 0;\n}\n\na.icon_button svg {\n  vertical-align: text-top;\n}\n\nbody .v2p-controls {\n  opacity: 1;\n}\n\nbody .v2p-controls > a.icon_button {\n  margin-right: 0;\n}\n\nbody .v2p-controls div a {\n  margin-right: 15px;\n}\n\nbody .v2p-controls div a:last-child {\n  margin-right: 0;\n}\n\nbody .v2p-controls a[onclick^=replyOne] {\n  opacity: 1 !important;\n}\n\n.sticky_rightbar #Rightbar {\n  position: sticky;\n  top: 0;\n  max-height: 100vh;\n  overflow-y: auto;\n  overflow-x: hidden;\n  --sb-track-color: #00000000;\n  --sb-thumb-color: #33334480;\n  --sb-size: 2px;\n  scrollbar-color: rgba(0, 0, 0, 0) rgba(0, 0, 0, 0);\n  scrollbar-width: thin;\n}\n.sticky_rightbar #Rightbar:hover {\n  scrollbar-color: var(--sb-thumb-color) var(--sb-track-color);\n}\n.sticky_rightbar #Rightbar::-webkit-scrollbar {\n  width: var(--sb-size);\n}\n.sticky_rightbar #Rightbar::-webkit-scrollbar-track {\n  background: rgba(0, 0, 0, 0);\n  border-radius: 10px;\n}\n.sticky_rightbar #Rightbar:hover::-webkit-scrollbar-track {\n  background: var(--sb-track-color);\n}\n.sticky_rightbar #Rightbar::-webkit-scrollbar-thumb {\n  background: rgba(0, 0, 0, 0);\n  border-radius: 10px;\n}\n.sticky_rightbar #Rightbar:hover::-webkit-scrollbar-thumb {\n  background: var(--sb-thumb-color);\n}\n.sticky_rightbar #Rightbar .v2p-tool-box {\n  position: unset;\n}\n\n.related_replies_container .box {\n  border-radius: 0 !important;\n}\n.related_replies_container .related_replies {\n  position: absolute;\n  overflow: visible !important;\n  padding: 0px !important;\n  z-index: 10000;\n  width: 100%;\n  -webkit-box-shadow: 0px 10px 39px 10px rgba(62, 66, 66, 0.22);\n  -moz-box-shadow: 0px 10px 39px 10px rgba(62, 66, 66, 0.22);\n  box-shadow: 0px 10px 39px 10px rgba(62, 66, 66, 0.22) !important;\n}\n.related_replies_container .related_replies_before::before {\n  content: "";\n  display: block;\n  width: 100%;\n  height: 10000px;\n  position: absolute;\n  margin-top: -10000px;\n  background-color: #333344;\n  opacity: 50%;\n}\n.related_replies_container .related_replies_after::after {\n  content: "";\n  display: block;\n  width: 100%;\n  height: 10000px;\n  position: absolute;\n  background-color: #333344;\n  opacity: 50%;\n}\n.related_replies_container.no_replies .related_replies_before::before,\n.related_replies_container.no_replies .related_replies_after::after {\n  display: none;\n}\n.related_replies_container .tabs {\n  position: sticky;\n  top: 0;\n  display: flex;\n  justify-content: center;\n  z-index: 10001;\n  padding: 10px !important;\n}\n.related_replies_container .tabs a {\n  cursor: pointer;\n}\n\na.no {\n  background-color: transparent !important;\n  color: #1484cd !important;\n  border: 1px solid #1484cd;\n  border-radius: 3px !important;\n  opacity: 1 !important;\n}\n\n.cited_floor_number {\n  color: #1484cd !important;\n  cursor: pointer;\n}\n\n.reply_content .cell.cited_reply {\n  scale: 0.85;\n  background-color: #f5f5f5;\n  border: 1px solid var(--box-border-color);\n  white-space: initial;\n}\n.reply_content .cell.cited_reply::after {\n  content: "";\n  display: block;\n  position: absolute;\n  left: 0;\n  bottom: 0;\n  width: 100%;\n  height: 100%;\n  opacity: 0.45;\n  background-color: var(--box-background-color);\n}\n.reply_content .cell.cited_reply:hover::after {\n  display: none;\n}\n.reply_content .cell.cited_reply .vr_wrapper {\n  max-height: 150px;\n  overflow: auto;\n  --sb-track-color: #00000000;\n  --sb-thumb-color: #33334480;\n  --sb-size: 2px;\n  scrollbar-color: var(--sb-thumb-color) var(--sb-track-color);\n  scrollbar-width: thin;\n}\n.reply_content .cell.cited_reply .vr_wrapper::-webkit-scrollbar {\n  width: var(--sb-size);\n}\n.reply_content .cell.cited_reply .vr_wrapper::-webkit-scrollbar-track {\n  background: var(--sb-track-color);\n  border-radius: 10px;\n}\n.reply_content .cell.cited_reply .vr_wrapper::-webkit-scrollbar-thumb {\n  background: var(--sb-thumb-color);\n  border-radius: 10px;\n}\n\n[data-vr-opaticy-of-cited-replies="0"] .reply_content .cell.cited_reply::after {\n  display: none;\n}\n\n[data-vr-opaticy-of-cited-replies="1"] .reply_content .cell.cited_reply::after {\n  opacity: 0.2;\n}\n\n[data-vr-opaticy-of-cited-replies="3"] .reply_content .cell.cited_reply::after {\n  opacity: 0.6;\n}\n\n.v2p-indent .cell.cited_reply,\n.v2p-indent .reply_content + .reply_content,\n.v2p-indent .reply_content + .reply_content + .v2p-expand-btn,\n.v2p-indent .v2p-collapsed:has(.reply_content + .reply_content)::before,\n.comment .comment .cell.cited_reply {\n  display: none !important;\n}\n\n#top_replies .cell .vr_wrapper {\n  position: relative;\n  max-height: 150px;\n  overflow: hidden;\n}\n#top_replies .cell .vr_wrapper::after {\n  content: "";\n  display: block;\n  position: absolute;\n  bottom: 0;\n  width: 100%;\n  height: 5px;\n  opacity: 0.8;\n  background-color: var(--box-background-color);\n}\n\n#top_replies td > .flex-one-row {\n  column-gap: 4px;\n}\n#top_replies td > .flex-one-row > .flex-one-row:first-child {\n  flex: 1 1 100%;\n  flex-wrap: wrap;\n  min-width: 0;\n  row-gap: 2px;\n}\n#top_replies td > .flex-one-row > .flex-one-row:last-child {\n  align-self: baseline;\n  margin-left: auto;\n}\n#top_replies td > .flex-one-row > .flex-one-row:last-child a.no {\n  word-break: keep-all;\n}\n#top_replies td > .flex-one-row strong {\n  flex: 1 1 100%;\n  min-width: 0;\n  overflow-wrap: anywhere;\n}\n#top_replies td > .flex-one-row .ago {\n  line-height: 110%;\n}\n\n.sticky_paging {\n  position: sticky;\n  bottom: 0;\n  background-color: var(--box-background-color) !important;\n  border-top: 1px solid var(--box-border-color);\n  z-index: 90;\n}\n\n.reply-box-sticky {\n  z-index: 91;\n}\n\n.Night .reply_content .cell.cited_reply {\n  background-color: #1d1f21;\n}\n\n.vr_upload_image {\n  cursor: pointer;\n}\n\n.vr_upload_image.vr_button_disabled,\n.vr_upload_image.vr_button_disabled:hover {\n  cursor: default;\n  text-decoration: none;\n  color: var(--color-fade);\n}\n\n.sticky_topic_buttons .topic_buttons,\n.sticky_topic_buttons .topic_buttons_mobile {\n  position: sticky;\n  bottom: 0;\n  background-color: var(--box-background-color) !important;\n  border-top: 1px solid var(--box-border-color);\n}\n.sticky_topic_buttons .header + .cell {\n  border-bottom: none;\n}';

  // src/styles.css
  var styles_default = '[hidden] {\n  display: none !important;\n}\n\n.item_title:has(+ .vx-preview-visible) {\n  display: inline;\n}\n\n.v2p-topic-preview-btn.vx-preview-visible {\n  margin-inline-start: 8px;\n  padding: 1px 6px;\n  visibility: visible;\n}\n\n.thank_area.v2p-controls {\n  position: relative;\n  z-index: 1;\n  display: inline-flex;\n}\n\n#reply-box.reply-box-sticky {\n  isolation: isolate;\n}\n\n.thank_area.v2p-controls > a {\n  visibility: inherit;\n}\n\n.vx-page-start {\n  display: block;\n  height: 0;\n  scroll-margin-top: 12px;\n}\n\n.reply-group .v2p-reply-content {\n  --bg-reply: var(--box-background-alt-color);\n}\n\n.vx-member-popup .v2p-member-topic-item-row:not(:hover, :focus-within) .v2p-topic-preview-btn {\n  display: none;\n}\n\n.vx-member-popup .v2p-member-topic-item-row:focus-within .v2p-topic-preview-btn {\n  max-width: none;\n  max-height: none;\n  visibility: visible;\n}\n\n#vx-settings-dialog {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n#vx-settings-dialog .v2p-modal-main {\n  width: 100%;\n  max-width: 780px;\n  height: auto;\n  max-height: 100%;\n}\n\n#vx-settings-dialog .v2p-modal-content {\n  min-height: 0;\n  padding: 14px;\n}\n\n#vx-settings-dialog fieldset {\n  min-inline-size: 0;\n  margin: 0 0 12px;\n  padding: 10px 12px 12px;\n  border: 1px solid var(--box-border-color);\n  border-radius: var(--box-border-radius);\n}\n\n#vx-settings-dialog legend {\n  padding-inline: 4px;\n  font-weight: 600;\n}\n\n.vx-settings-grid {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 12px 20px;\n}\n\n.vx-settings-option label {\n  display: flex;\n  gap: 8px;\n  align-items: center;\n  justify-content: space-between;\n  font-weight: 600;\n}\n\n.vx-settings-option input {\n  flex: 0 0 auto;\n  margin: 0;\n}\n\n.vx-settings-option input[type="number"] {\n  width: 5em;\n}\n\n.vx-settings-option:has(input[type="text"]) {\n  grid-column: 1 / -1;\n}\n\n.vx-settings-option:has(input[type="text"]) label {\n  flex-wrap: wrap;\n}\n\n.vx-settings-option input[type="text"] {\n  width: min(100%, 26ch);\n  box-sizing: border-box;\n}\n\n#vx-settings-dialog p {\n  margin: 4px 0 0;\n  line-height: 1.45;\n}\n\n#vx-settings-dialog .vx-settings-notice {\n  margin: 0 0 12px;\n}\n\n.vx-settings-backup-actions {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n  margin-top: 8px;\n}\n\n#vx-settings-dialog .v2p-modal-header,\n#vx-settings-dialog .v2p-modal-footer {\n  flex-shrink: 0;\n}\n\n#vx-settings-dialog .v2p-modal-footer [role="status"] {\n  min-width: 0;\n  margin: 0 auto 0 0;\n}\n\n#vx-settings-dialog .v2p-modal-footer button {\n  flex: none;\n}\n\n@media (max-width: 620px) {\n  .vx-settings-grid {\n    grid-template-columns: 1fr;\n  }\n\n  #vx-settings-dialog .v2p-modal-header {\n    flex-wrap: wrap;\n  }\n}\n\n.vx-tag-editor-dialog {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.vx-tag-editor-dialog .v2p-modal-main {\n  width: min(100%, 520px);\n  height: auto;\n  max-height: 100%;\n}\n\n.vx-tag-editor-dialog .v2p-tag-input-wrapper {\n  padding: 16px 20px;\n}\n\n:is(#vx-settings-dialog, .vx-tag-editor-dialog) {\n  --vx-control-radius: 3px;\n  --vx-control-accent: var(--v2p-color-accent-600);\n}\n\n:is(#vx-settings-dialog, .vx-tag-editor-dialog)\n  :is(input[type="text"], input[type="search"], input[type="number"], select, .vx-tag-input) {\n  box-sizing: border-box;\n  min-height: 32px;\n  min-width: 0;\n  padding: 5px 10px;\n  border: 1px solid transparent;\n  border-radius: var(--vx-control-radius);\n  color: var(--v2p-color-foreground);\n  font: inherit;\n  background: var(--v2p-color-bg-input);\n}\n\n:is(#vx-settings-dialog, .vx-tag-editor-dialog)\n  :is(input[type="text"], input[type="search"], input[type="number"], select, .vx-tag-input):hover {\n  border-color: var(--box-border-color);\n}\n\n:is(#vx-settings-dialog, .vx-tag-editor-dialog)\n  :is(input[type="text"], input[type="search"], input[type="number"], select):focus {\n  border-color: var(--vx-control-accent);\n  outline: 2px solid color-mix(in srgb, var(--vx-control-accent) 22%, transparent);\n  outline-offset: 0;\n  background: var(--v2p-color-bg-content);\n}\n\n:is(#vx-settings-dialog, .vx-tag-editor-dialog) .vx-tag-input:focus-within {\n  border-color: var(--vx-control-accent);\n}\n\n#vx-settings-dialog :is(select, input[type="search"]) {\n  max-width: 100%;\n}\n\n#vx-settings-dialog input[type="checkbox"] {\n  accent-color: var(--vx-control-accent);\n}\n\n:is(#vx-settings-dialog, .vx-tag-editor-dialog) button.normal.button {\n  min-height: 30px;\n  max-width: 100%;\n  border-radius: var(--vx-control-radius);\n}\n\n:is(#vx-settings-dialog, .vx-tag-editor-dialog) button:focus-visible {\n  outline: 2px solid var(--vx-control-accent);\n  outline-offset: 2px;\n}\n\n.v2p-tag-input-wrapper [role="alert"]:empty {\n  display: none;\n}\n\n.vx-settings-tag-manager {\n  margin: 0 0 12px;\n  padding: 12px;\n  border: 1px solid var(--box-border-color);\n  border-radius: var(--box-border-radius);\n}\n\n.vx-settings-tag-manager summary {\n  cursor: pointer;\n  font-weight: 600;\n}\n\n.vx-tag-entry,\n.vx-tag-actions {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n  align-items: center;\n}\n\n.vx-tag-filters {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 8px 12px;\n  margin-block: 12px;\n}\n\n.vx-tag-filters label {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr);\n  gap: 4px;\n}\n\n.vx-tag-filters :is(input, select) {\n  width: 100%;\n  margin: 0;\n}\n\n.vx-tag-filters .vx-tag-count {\n  grid-column: 1 / -1;\n  justify-self: end;\n}\n\n@media (max-width: 620px) {\n  .vx-tag-filters {\n    grid-template-columns: minmax(0, 1fr);\n  }\n}\n\n@supports (appearance: base-select) and selector(::picker(select)) {\n  .vx-tag-group,\n  .vx-tag-group::picker(select) {\n    appearance: base-select;\n  }\n\n  .vx-tag-group {\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n  }\n\n  .vx-tag-group::picker(select) {\n    width: anchor-size(width);\n    max-width: calc(100vw - 24px);\n    max-height: min(55vh, 280px);\n    margin-block: 4px;\n    padding: 4px;\n    overflow: auto;\n    border: 1px solid var(--box-border-color);\n    border-radius: var(--vx-control-radius);\n    background: var(--v2p-color-bg-content);\n    color: var(--v2p-color-foreground);\n    box-shadow: var(--v2p-widget-shadow);\n  }\n\n  .vx-tag-group option {\n    padding: 6px 8px;\n    border-radius: var(--vx-control-radius);\n    white-space: normal;\n    overflow-wrap: anywhere;\n  }\n\n  .vx-tag-group option:is(:hover, :focus-visible) {\n    background: var(--v2p-color-bg-input);\n  }\n\n  .vx-tag-group option:checked {\n    color: var(--v2p-color-button-special-foreground);\n    background: var(--v2p-color-button-special-background);\n  }\n}\n\n#vx-settings-dialog .vx-tag-capacity,\n#vx-settings-dialog .vx-storage-help {\n  margin-block: 8px;\n  color: var(--v2p-color-font-secondary);\n}\n\n.vx-tag-count {\n  padding: 3px 8px;\n  border-radius: 12px;\n  background: var(--button-background-hover-color);\n}\n\n.vx-tag-editor:not(:empty) {\n  margin-top: 12px;\n  padding-block: 12px;\n  border-block: 1px solid var(--box-border-color);\n}\n\n.vx-tag-editor h3 {\n  margin: 0 0 10px;\n  overflow-wrap: anywhere;\n}\n\n.vx-tag-editor-meta {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: baseline;\n  justify-content: space-between;\n  gap: 4px 16px;\n  margin-top: 8px;\n  color: var(--v2p-color-font-secondary);\n  font-size: 12px;\n}\n\n.vx-tag-editor-meta p,\n#vx-settings-dialog .vx-tag-editor-meta p {\n  flex: 1 1 15em;\n  margin: 0;\n}\n\n.vx-tag-editor-count {\n  margin-inline-start: auto;\n  white-space: nowrap;\n}\n\n.vx-tag-editor > .vx-tag-actions {\n  justify-content: flex-end;\n  margin-top: 12px;\n}\n\n.vx-tag-fields {\n  display: contents;\n}\n\n.vx-tag-input {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n  align-items: center;\n  max-height: min(38vh, 230px);\n  overflow: auto;\n}\n\n.vx-tag-field {\n  display: inline-flex;\n  box-sizing: border-box;\n  max-width: 100%;\n  align-items: center;\n  gap: 2px;\n  padding-inline: 6px 3px;\n  border-radius: var(--vx-control-radius);\n  background: var(--button-background-hover-color);\n}\n\n.vx-tag-field-editing {\n  flex: 1 1 13em;\n}\n\n.vx-tag-input textarea,\n.vx-tag-input textarea:focus {\n  box-sizing: border-box;\n  min-width: 0;\n  min-height: 24px;\n  padding: 3px 2px;\n  border: 0;\n  outline: 0;\n  box-shadow: none;\n  color: inherit;\n  font: inherit;\n  line-height: 18px;\n  background: transparent;\n  resize: none;\n}\n\n.vx-tag-field textarea {\n  flex: 1 1 auto;\n  width: 100%;\n}\n\n.vx-tag-entry {\n  flex: 1 1 10em;\n  flex-wrap: nowrap;\n  min-width: 0;\n}\n\n.vx-tag-entry textarea {\n  flex: 1 1 0;\n}\n\n.vx-tag-edit-value,\n.vx-tag-remove-value,\n.vx-tag-add,\n.vx-tag-filter {\n  min-width: 0;\n  border: 1px solid transparent;\n  border-radius: var(--vx-control-radius);\n  color: inherit;\n  font: inherit;\n  font-size: 12px;\n  line-height: 20px;\n  background: transparent;\n  cursor: pointer;\n}\n\n.vx-tag-edit-value {\n  padding: 0 2px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.vx-tag-remove-value,\n.vx-tag-add {\n  flex: 0 0 20px;\n  padding: 0;\n  font-size: 16px;\n}\n\n:is(.vx-tag-edit-value, .vx-tag-remove-value, .vx-tag-add):hover {\n  background: var(--v2p-color-button-background-hover);\n}\n\n.vx-tag-list {\n  display: grid;\n  gap: 8px;\n  margin: 12px 0;\n  padding: 0;\n  list-style: none;\n  overflow-wrap: anywhere;\n}\n\n.vx-tag-row,\n.vx-tag-empty {\n  padding: 10px;\n  border: 1px solid var(--box-border-color);\n  border-radius: var(--box-border-radius);\n  background: var(--box-background-color);\n}\n\n.vx-tag-row {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 12px;\n  align-items: center;\n  justify-content: space-between;\n}\n\n.vx-tag-member {\n  flex: 1 1 14em;\n  min-width: 0;\n}\n\n.vx-tag-profile {\n  font-weight: 600;\n  text-decoration: underline;\n  text-underline-offset: 0.16em;\n}\n\n.vx-tag-chips {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 5px;\n  margin: 6px 0 0;\n  padding: 0;\n  list-style: none;\n}\n\n.vx-tag-chips li {\n  min-width: 0;\n  max-width: 100%;\n}\n\n.vx-tag-filter {\n  max-width: 100%;\n  padding: 0 7px;\n  overflow-wrap: anywhere;\n  background: var(--v2p-color-bg-input);\n}\n\n.vx-tag-filter:hover {\n  border-color: var(--box-border-color);\n}\n\n.vx-tag-filter[aria-pressed="true"] {\n  border-color: var(--v2p-color-button-special-border);\n  color: var(--v2p-color-button-special-foreground);\n  background: var(--v2p-color-button-special-background);\n}\n\n.vx-tag-actions .vx-tag-delete.normal.button {\n  color: color-mix(in srgb, var(--v2p-color-error) 70%, var(--v2p-color-foreground));\n}\n\n.vx-tag-actions .vx-tag-delete.normal.button:hover {\n  border-color: var(--v2p-color-error);\n}\n\n.vx-tags {\n  min-width: 0;\n  max-width: min(300px, 100%);\n  gap: 3px;\n  line-height: 1.5;\n  color: var(--v2p-color-foreground);\n}\n\n.topic_info .vx-tags {\n  pointer-events: auto;\n  position: relative;\n  z-index: 2;\n  margin-inline: 8px;\n  margin-block: 0;\n  vertical-align: middle;\n}\n\n.vx-tags-text {\n  overflow: hidden;\n  min-width: 0;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.vx-upload-record {\n  display: flex;\n  gap: 12px;\n  align-items: center;\n}\n\n.vx-upload-record-preview {\n  display: flex;\n  flex: 0 0 min(112px, 32%);\n  height: 80px;\n  overflow: hidden;\n  border: 1px solid var(--box-border-color);\n  border-radius: var(--box-border-radius);\n  background: var(--box-background-alt-color);\n}\n\n.vx-upload-record-preview img {\n  width: 100%;\n  height: 100%;\n  object-fit: contain;\n}\n\n.vx-upload-record-details {\n  min-width: 0;\n  overflow-wrap: anywhere;\n}\n\n.vx-upload-remove {\n  margin-top: 8px;\n}\n\n.vx-upload-history-status:empty {\n  display: none;\n}\n\n.vx-page-actions {\n  position: fixed;\n  z-index: 60;\n  inset-inline-end: max(20px, env(safe-area-inset-right));\n  bottom: max(20px, env(safe-area-inset-bottom));\n  display: grid;\n  padding: 3px;\n  border: 1px solid var(--box-border-color);\n  border-radius: 0;\n  background: var(--v2p-color-bg-widget);\n  box-shadow: 0 4px 16px rgb(0 0 0 / 10%);\n}\n\n.vx-page-actions button {\n  position: relative;\n  display: grid;\n  place-items: center;\n  width: 44px;\n  height: 44px;\n  padding: 0;\n  border: 0;\n  border-radius: 0;\n  color: var(--v2p-color-foreground);\n  font: inherit;\n  background: transparent;\n  cursor: pointer;\n  transition:\n    background-color 0.15s,\n    color 0.15s;\n}\n\n.vx-page-actions button:hover {\n  color: var(--v2p-color-accent-600);\n  background: var(--v2p-color-button-background-hover);\n}\n\n.vx-page-actions button:focus-visible {\n  outline: 2px solid var(--v2p-color-accent-600);\n  outline-offset: 2px;\n}\n\n.vx-page-actions button svg {\n  width: 20px;\n  height: 20px;\n}\n\n.vx-page-action-hint {\n  position: absolute;\n  inset-inline-end: calc(100% + 12px);\n  top: 50%;\n  transform: translateY(-50%);\n  visibility: hidden;\n  width: max-content;\n  max-width: min(160px, calc(100vw - 90px));\n  box-sizing: border-box;\n  padding: 5px 10px;\n  border: 1px solid var(--box-border-color);\n  border-radius: 0;\n  font-size: 12px;\n  line-height: 1.5;\n  overflow-wrap: anywhere;\n  color: var(--v2p-color-foreground);\n  background: var(--v2p-color-bg-widget);\n  box-shadow: 0 2px 8px rgb(0 0 0 / 8%);\n  pointer-events: none;\n}\n\n.vx-page-actions button:is(:hover, :focus-visible) .vx-page-action-hint {\n  visibility: visible;\n}\n\n.v2p-modal-open .vx-page-actions {\n  display: none;\n}\n';

  // src/i18n.js
  var messages = {
    pageActions: [
      "Page shortcuts",
      "\u9875\u9762\u5FEB\u6377\u64CD\u4F5C",
      "\u30DA\u30FC\u30B8\u306E\u30B7\u30E7\u30FC\u30C8\u30AB\u30C3\u30C8",
      "\uD398\uC774\uC9C0 \uB2E8\uCD95 \uC791\uC5C5"
    ],
    backToTop: [
      "Back to top",
      "\u8FD4\u56DE\u9876\u90E8",
      "\u30DA\u30FC\u30B8\u5148\u982D\u3078",
      "\uB9E8 \uC704\uB85C"
    ],
    jumpToReply: ["Reply", "\u56DE\u590D", "\u8FD4\u4FE1", "\uB313\uAE00"],
    removeUploadRecord: [
      "Remove local record",
      "\u79FB\u9664\u672C\u5730\u8BB0\u5F55",
      "\u30ED\u30FC\u30AB\u30EB\u5C65\u6B74\u3092\u524A\u9664",
      "\uB85C\uCEEC \uAE30\uB85D \uC81C\uAC70"
    ],
    confirmRemoveUpload: [
      "Remove this record from upload history?",
      "\u4ECE\u4E0A\u4F20\u5386\u53F2\u4E2D\u79FB\u9664\u8FD9\u6761\u672C\u5730\u8BB0\u5F55\u5417\uFF1F",
      "\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u5C65\u6B74\u304B\u3089\u3053\u306E\u8A18\u9332\u3092\u524A\u9664\u3057\u307E\u3059\u304B\uFF1F",
      "\uC5C5\uB85C\uB4DC \uAE30\uB85D\uC5D0\uC11C \uC774 \uB85C\uCEEC \uAE30\uB85D\uC744 \uC81C\uAC70\uD560\uAE4C\uC694?"
    ],
    uploadRemoved: [
      "Removed from upload history.",
      "\u5DF2\u79FB\u9664\u4E0A\u4F20\u8BB0\u5F55\u3002",
      "\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u5C65\u6B74\u304B\u3089\u524A\u9664\u3057\u307E\u3057\u305F\u3002",
      "\uC5C5\uB85C\uB4DC \uAE30\uB85D\uC5D0\uC11C \uC81C\uAC70\uD588\uC2B5\uB2C8\uB2E4."
    ],
    imgurUploadRemoved: [
      "Removed a history entry for an image deleted on Imgur.",
      "\u5DF2\u6E05\u7406\u4E00\u6761\u5728 Imgur \u5220\u9664\u7684\u56FE\u7247\u8BB0\u5F55\u3002",
      "Imgur \u3067\u524A\u9664\u3055\u308C\u305F\u753B\u50CF\u306E\u5C65\u6B74\u3092\u524A\u9664\u3057\u307E\u3057\u305F\u3002",
      "Imgur\uC5D0\uC11C \uC0AD\uC81C\uB41C \uC774\uBBF8\uC9C0\uC758 \uC5C5\uB85C\uB4DC \uAE30\uB85D\uC744 \uC815\uB9AC\uD588\uC2B5\uB2C8\uB2E4."
    ],
    removeUploadFailed: [
      "Could not remove the upload record. Check the userscript manager\u2019s storage and try again.",
      "\u672A\u80FD\u79FB\u9664\u4E0A\u4F20\u8BB0\u5F55\uFF0C\u8BF7\u68C0\u67E5\u811A\u672C\u7BA1\u7406\u5668\u7684\u5B58\u50A8\u8BBE\u7F6E\u540E\u91CD\u8BD5\u3002",
      "\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u5C65\u6B74\u3092\u524A\u9664\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u4FDD\u5B58\u8A2D\u5B9A\u3092\u78BA\u8A8D\u3057\u3066\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
      "\uC5C5\uB85C\uB4DC \uAE30\uB85D\uC744 \uC81C\uAC70\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uC800\uC7A5 \uC124\uC815\uC744 \uD655\uC778\uD55C \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD558\uC138\uC694."
    ],
    tagGroup: [
      "Tag group",
      "\u6807\u7B7E\u5206\u7EC4",
      "\u30BF\u30B0\u30B0\u30EB\u30FC\u30D7",
      "\uD0DC\uADF8 \uADF8\uB8F9"
    ],
    allTagGroups: [
      "All tags",
      "\u5168\u90E8\u6807\u7B7E",
      "\u3059\u3079\u3066\u306E\u30BF\u30B0",
      "\uBAA8\uB4E0 \uD0DC\uADF8"
    ],
    tagGroupOption: ["{0} ({1})", "{0}\uFF08{1}\uFF09", "{0}\uFF08{1}\uFF09", "{0} ({1})"],
    filteredTaggedCount: [
      "{0} of {1} tagged members",
      "\u663E\u793A {0} / {1} \u4F4D\u5DF2\u6807\u8BB0\u7528\u6237",
      "\u30BF\u30B0\u4ED8\u304D\u30E6\u30FC\u30B6\u30FC {1} \u4EBA\u4E2D {0} \u4EBA",
      "\uD0DC\uADF8\uAC00 \uC788\uB294 \uC0AC\uC6A9\uC790 {1}\uBA85 \uC911 {0}\uBA85"
    ],
    editTagValue: [
      "Edit tag: {0}",
      "\u7F16\u8F91\u6807\u7B7E\uFF1A{0}",
      "\u30BF\u30B0\u3092\u7DE8\u96C6\uFF1A{0}",
      "\uD0DC\uADF8 \uD3B8\uC9D1: {0}"
    ],
    removeTagValue: [
      "Remove tag: {0}",
      "\u79FB\u9664\u6807\u7B7E\uFF1A{0}",
      "\u30BF\u30B0\u3092\u524A\u9664\uFF1A{0}",
      "\uD0DC\uADF8 \uC81C\uAC70: {0}"
    ],
    sourceTopic: [
      "Source topic",
      "\u6765\u6E90\u4E3B\u9898",
      "\u5143\u306E\u30C8\u30D4\u30C3\u30AF",
      "\uC6D0\uBCF8 \uC8FC\uC81C"
    ],
    addTag: [
      "Add tags",
      "\u6DFB\u52A0\u6807\u7B7E",
      "\u30BF\u30B0\u3092\u8FFD\u52A0",
      "\uD0DC\uADF8 \uCD94\uAC00"
    ],
    tagEntry: [
      "Add a tag",
      "\u6DFB\u52A0\u6807\u7B7E",
      "\u30BF\u30B0\u3092\u8FFD\u52A0",
      "\uD0DC\uADF8 \uCD94\uAC00"
    ],
    editableTag: ["Tag {0}", "\u7B2C {0} \u4E2A\u6807\u7B7E", "\u30BF\u30B0 {0}", "\uD0DC\uADF8 {0}"],
    tagUsage: [
      "{0} of {1} tags",
      "{0} / {1} \u4E2A\u6807\u7B7E",
      "\u30BF\u30B0 {0} / {1} \u500B",
      "\uD0DC\uADF8 {0} / {1}\uAC1C"
    ],
    language: [
      "Interface language",
      "\u754C\u9762\u8BED\u8A00",
      "\u8868\u793A\u8A00\u8A9E",
      "\uC778\uD130\uD398\uC774\uC2A4 \uC5B8\uC5B4"
    ],
    languageHelp: [
      "Applies to V2EX Lite after saving and refreshing.",
      "\u4FDD\u5B58\u5E76\u5237\u65B0\u540E\u5E94\u7528\u5230 V2EX Lite \u754C\u9762\u3002",
      "\u4FDD\u5B58\u3057\u3066\u518D\u8AAD\u307F\u8FBC\u307F\u3059\u308B\u3068\u3001V2EX Lite \u306E\u8868\u793A\u306B\u53CD\u6620\u3055\u308C\u307E\u3059\u3002",
      "\uC800\uC7A5 \uD6C4 \uC0C8\uB85C\uACE0\uCE68\uD558\uBA74 V2EX Lite \uD654\uBA74\uC5D0 \uC801\uC6A9\uB429\uB2C8\uB2E4."
    ],
    followSite: [
      "Follow V2EX",
      "\u8DDF\u968F V2EX",
      "V2EX \u306B\u5408\u308F\u305B\u308B",
      "V2EX \uC124\uC815 \uB530\uB974\uAE30"
    ],
    storage: [
      "Data storage",
      "\u6570\u636E\u5B58\u50A8",
      "\u30C7\u30FC\u30BF\u306E\u4FDD\u5B58",
      "\uB370\uC774\uD130 \uC800\uC7A5"
    ],
    storageHelp: [
      "Settings and member tags are saved in the userscript manager on this browser profile. Tags are private to this profile and stored by username. The script does not sync this data across devices or save it to your V2EX account.",
      "\u811A\u672C\u914D\u7F6E\u548C\u7528\u6237\u6807\u7B7E\u4FDD\u5B58\u5728\u5F53\u524D\u6D4F\u89C8\u5668\u914D\u7F6E\u6587\u4EF6\u7684\u811A\u672C\u7BA1\u7406\u5668\u4E2D\u3002\u6807\u7B7E\u6309\u7528\u6237\u540D\u4FDD\u5B58\uFF0C\u4EC5\u5728\u672C\u5730\u663E\u793A\u3002\u811A\u672C\u4E0D\u4F1A\u8DE8\u8BBE\u5907\u540C\u6B65\uFF0C\u4E5F\u4E0D\u4F1A\u5C06\u8FD9\u4E9B\u6570\u636E\u5199\u5165 V2EX \u8D26\u53F7\u3002",
      "\u8A2D\u5B9A\u3068\u30E6\u30FC\u30B6\u30FC\u30BF\u30B0\u306F\u3001\u3053\u306E\u30D6\u30E9\u30A6\u30B6\u30FC\u30D7\u30ED\u30D5\u30A1\u30A4\u30EB\u306E\u30E6\u30FC\u30B6\u30FC\u30B9\u30AF\u30EA\u30D7\u30C8\u7BA1\u7406\u30C4\u30FC\u30EB\u306B\u4FDD\u5B58\u3055\u308C\u307E\u3059\u3002\u30BF\u30B0\u306F\u30E6\u30FC\u30B6\u30FC\u540D\u3054\u3068\u306B\u30ED\u30FC\u30AB\u30EB\u306B\u4FDD\u5B58\u3055\u308C\u3001\u30C7\u30D0\u30A4\u30B9\u9593\u3084 V2EX \u30A2\u30AB\u30A6\u30F3\u30C8\u306B\u306F\u540C\u671F\u3055\u308C\u307E\u305B\u3093\u3002",
      "\uC124\uC815\uACFC \uC0AC\uC6A9\uC790 \uD0DC\uADF8\uB294 \uD604\uC7AC \uBE0C\uB77C\uC6B0\uC800 \uD504\uB85C\uD544\uC758 \uC0AC\uC6A9\uC790 \uC2A4\uD06C\uB9BD\uD2B8 \uAD00\uB9AC\uC790\uC5D0 \uC800\uC7A5\uB429\uB2C8\uB2E4. \uD0DC\uADF8\uB294 \uC0AC\uC6A9\uC790 \uC774\uB984\uBCC4\uB85C \uC774 \uD504\uB85C\uD544\uC5D0\uB9CC \uC800\uC7A5\uB418\uBA70 \uAE30\uAE30 \uAC04 \uB610\uB294 V2EX \uACC4\uC815\uC5D0 \uB3D9\uAE30\uD654\uB418\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4."
    ],
    tagCapacity: [
      "Up to {0} tags per member, {1} characters per tag. The total number of members is limited by local storage. Each backup import accepts up to {2} members.",
      "\u6BCF\u4F4D\u7528\u6237\u6700\u591A {0} \u4E2A\u6807\u7B7E\uFF0C\u6BCF\u4E2A\u6807\u7B7E\u6700\u591A {1} \u4E2A\u5B57\u7B26\u3002\u53EF\u6807\u8BB0\u7684\u7528\u6237\u603B\u6570\u53D6\u51B3\u4E8E\u811A\u672C\u7BA1\u7406\u5668\u7684\u672C\u5730\u5B58\u50A8\u5BB9\u91CF\u3002\u5355\u4EFD\u5907\u4EFD\u6700\u591A\u5BFC\u5165 {2} \u4F4D\u7528\u6237\u3002",
      "\u30E6\u30FC\u30B6\u30FC\u3054\u3068\u306B\u6700\u5927 {0} \u500B\u3001\u30BF\u30B0\u3054\u3068\u306B\u6700\u5927 {1} \u6587\u5B57\u3067\u3059\u3002\u767B\u9332\u3067\u304D\u308B\u30E6\u30FC\u30B6\u30FC\u7DCF\u6570\u306F\u30ED\u30FC\u30AB\u30EB\u30B9\u30C8\u30EC\u30FC\u30B8\u306E\u5BB9\u91CF\u306B\u3088\u308A\u307E\u3059\u30021 \u3064\u306E\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u304B\u3089\u6700\u5927 {2} \u4EBA\u3092\u30A4\u30F3\u30DD\u30FC\u30C8\u3067\u304D\u307E\u3059\u3002",
      "\uC0AC\uC6A9\uC790\uB2F9 \uD0DC\uADF8\uB294 \uCD5C\uB300 {0}\uAC1C, \uD0DC\uADF8\uB2F9 \uAE00\uC790\uB294 \uCD5C\uB300 {1}\uC790\uC785\uB2C8\uB2E4. \uD0DC\uADF8\uB97C \uB2EC \uC218 \uC788\uB294 \uC0AC\uC6A9\uC790 \uC218\uB294 \uB85C\uCEEC \uC800\uC7A5 \uACF5\uAC04\uC5D0 \uB530\uB77C \uB2EC\uB77C\uC9D1\uB2C8\uB2E4. \uBC31\uC5C5 \uD30C\uC77C \uD558\uB098\uB2F9 \uCD5C\uB300 {2}\uBA85\uC758 \uD0DC\uADF8\uB97C \uAC00\uC838\uC62C \uC218 \uC788\uC2B5\uB2C8\uB2E4."
    ],
    taggedCount: [
      "{0} tagged members",
      "\u5DF2\u6807\u8BB0 {0} \u4F4D\u7528\u6237",
      "\u30BF\u30B0\u4ED8\u304D\u30E6\u30FC\u30B6\u30FC {0} \u4EBA",
      "\uD0DC\uADF8\uAC00 \uC788\uB294 \uC0AC\uC6A9\uC790 {0}\uBA85"
    ],
    deleteTags: ["Delete", "\u5220\u9664", "\u524A\u9664", "\uC0AD\uC81C"],
    deleteTagsFor: [
      "Delete tags for {0}",
      "\u5220\u9664 {0} \u7684\u6807\u7B7E",
      "{0} \u306E\u30BF\u30B0\u3092\u524A\u9664",
      "{0}\uB2D8\uC758 \uD0DC\uADF8 \uC0AD\uC81C"
    ],
    confirmDeleteTags: [
      "Delete all tags for {0}?",
      "\u5220\u9664 {0} \u7684\u5168\u90E8\u6807\u7B7E\u5417\uFF1F",
      "{0} \u306E\u30BF\u30B0\u3092\u3059\u3079\u3066\u524A\u9664\u3057\u307E\u3059\u304B\uFF1F",
      "{0}\uB2D8\uC758 \uD0DC\uADF8\uB97C \uBAA8\uB450 \uC0AD\uC81C\uD560\uAE4C\uC694?"
    ],
    tagsDeleted: [
      "Deleted tags for {0}.",
      "\u5DF2\u5220\u9664 {0} \u7684\u6807\u7B7E\u3002",
      "{0} \u306E\u30BF\u30B0\u3092\u524A\u9664\u3057\u307E\u3057\u305F\u3002",
      "{0}\uB2D8\uC758 \uD0DC\uADF8\uB97C \uC0AD\uC81C\uD588\uC2B5\uB2C8\uB2E4."
    ],
    tagDeleteFailed: [
      "Could not delete tags for {0}. Check the userscript manager\u2019s storage and try again.",
      "\u672A\u80FD\u5220\u9664 {0} \u7684\u6807\u7B7E\uFF0C\u8BF7\u68C0\u67E5\u811A\u672C\u7BA1\u7406\u5668\u7684\u5B58\u50A8\u8BBE\u7F6E\u540E\u91CD\u8BD5\u3002",
      "{0} \u306E\u30BF\u30B0\u3092\u524A\u9664\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u30E6\u30FC\u30B6\u30FC\u30B9\u30AF\u30EA\u30D7\u30C8\u7BA1\u7406\u30C4\u30FC\u30EB\u306E\u30B9\u30C8\u30EC\u30FC\u30B8\u8A2D\u5B9A\u3092\u78BA\u8A8D\u3057\u3066\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
      "{0}\uB2D8\uC758 \uD0DC\uADF8\uB97C \uC0AD\uC81C\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uC0AC\uC6A9\uC790 \uC2A4\uD06C\uB9BD\uD2B8 \uAD00\uB9AC\uC790\uC758 \uC800\uC7A5 \uC124\uC815\uC744 \uD655\uC778\uD55C \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD558\uC138\uC694."
    ],
    memberTimeout: [
      "Member profile timed out. Try again later.",
      "\u52A0\u8F7D\u8D85\u65F6\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002",
      "\u8AAD\u307F\u8FBC\u307F\u304C\u30BF\u30A4\u30E0\u30A2\u30A6\u30C8\u3057\u307E\u3057\u305F\u3002",
      "\uBD88\uB7EC\uC624\uAE30 \uC2DC\uAC04\uC774 \uCD08\uACFC\uB418\uC5C8\uC2B5\uB2C8\uB2E4."
    ],
    emojiPopular: ["Popular", "\u6D41\u884C", "\u4EBA\u6C17", "\uC778\uAE30"],
    emojiFaces: ["Faces", "\u5C0F\u9EC4\u8138", "\u9854", "\uC5BC\uAD74"],
    emojiGestures: [
      "Gestures",
      "\u624B\u52BF",
      "\u30B8\u30A7\u30B9\u30C1\u30E3\u30FC",
      "\uC81C\uC2A4\uCC98"
    ],
    emojiCelebration: ["Celebration", "\u5E86\u795D", "\u304A\u795D\u3044", "\uCD95\uD558"],
    emojiOther: ["Other", "\u5176\u4ED6", "\u305D\u306E\u4ED6", "\uAE30\uD0C0"],
    settings: ["Settings", "\u8BBE\u7F6E", "\u8A2D\u5B9A", "\uC124\uC815"],
    save: [
      "Save and refresh",
      "\u4FDD\u5B58\u5E76\u5237\u65B0",
      "\u4FDD\u5B58\u3057\u3066\u518D\u8AAD\u307F\u8FBC\u307F",
      "\uC800\uC7A5 \uD6C4 \uC0C8\uB85C\uACE0\uCE68"
    ],
    close: ["Close", "\u5173\u95ED", "\u9589\u3058\u308B", "\uB2EB\uAE30"],
    browse: [
      "Browsing",
      "\u6D4F\u89C8\u4E0E\u663E\u793A",
      "\u95B2\u89A7\u3068\u8868\u793A",
      "\uD0D0\uC0C9 \uBC0F \uD45C\uC2DC"
    ],
    discussion: [
      "Replies and rewards",
      "\u56DE\u590D\u4E0E\u5956\u52B1",
      "\u8FD4\u4FE1\u3068\u5831\u916C",
      "\uB313\uAE00 \uBC0F \uBCF4\uC0C1"
    ],
    editor: ["Editor", "\u7F16\u8F91\u5668", "\u30A8\u30C7\u30A3\u30BF\u30FC", "\uD3B8\uC9D1\uAE30"],
    loginRequired: [
      "Requires V2EX sign-in",
      "\u9700\u8981\u767B\u5F55 V2EX",
      "V2EX \u3078\u306E\u30ED\u30B0\u30A4\u30F3\u304C\u5FC5\u8981",
      "V2EX \uB85C\uADF8\uC778 \uD544\uC694"
    ],
    guestNotice: [
      "Sign in to use account and editor features. Your saved preferences will apply after sign-in.",
      "\u767B\u5F55 V2EX \u540E\u624D\u80FD\u4F7F\u7528\u8D26\u53F7\u548C\u7F16\u8F91\u5668\u529F\u80FD\uFF0C\u5DF2\u4FDD\u5B58\u7684\u504F\u597D\u4F1A\u5728\u767B\u5F55\u540E\u751F\u6548\u3002",
      "\u30A2\u30AB\u30A6\u30F3\u30C8\u3084\u6295\u7A3F\u7DE8\u96C6\u306E\u6A5F\u80FD\u3092\u4F7F\u3046\u306B\u306F\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u4FDD\u5B58\u3057\u305F\u8A2D\u5B9A\u306F\u30ED\u30B0\u30A4\u30F3\u5F8C\u306B\u9069\u7528\u3055\u308C\u307E\u3059\u3002",
      "\uACC4\uC815 \uBC0F \uD3B8\uC9D1\uAE30 \uAE30\uB2A5\uC744 \uC0AC\uC6A9\uD558\uB824\uBA74 \uB85C\uADF8\uC778\uD558\uC138\uC694. \uC800\uC7A5\uB41C \uC124\uC815\uC740 \uB85C\uADF8\uC778 \uD6C4 \uC801\uC6A9\uB429\uB2C8\uB2E4."
    ],
    privacy: [
      "Privacy screen",
      "\u9632\u7AA5\u5C4F",
      "\u30D7\u30E9\u30A4\u30D0\u30B7\u30FC\u8868\u793A",
      "\uD654\uBA74 \uAC1C\uC778\uC815\uBCF4 \uBCF4\uD638"
    ],
    privacyHelp: [
      "Hide account details and balance and replace the site logo.",
      "\u906E\u6321\u8D26\u53F7\u548C\u4F59\u989D\uFF0C\u5E76\u66FF\u6362\u7AD9\u70B9\u6807\u8BC6\u3002",
      "\u30A2\u30AB\u30A6\u30F3\u30C8\u60C5\u5831\u3068\u6B8B\u9AD8\u3092\u96A0\u3057\u3001\u30B5\u30A4\u30C8\u30ED\u30B4\u3092\u5DEE\u3057\u66FF\u3048\u307E\u3059\u3002",
      "\uACC4\uC815 \uC815\uBCF4\uC640 \uC794\uC561\uC744 \uC228\uAE30\uACE0 \uC0AC\uC774\uD2B8 \uB85C\uACE0\uB97C \uBC14\uAFC9\uB2C8\uB2E4."
    ],
    newTab: [
      "Open topics in a new tab",
      "\u5728\u65B0\u6807\u7B7E\u9875\u6253\u5F00\u4E3B\u9898",
      "\u30C8\u30D4\u30C3\u30AF\u3092\u65B0\u3057\u3044\u30BF\u30D6\u3067\u958B\u304F",
      "\uC0C8 \uD0ED\uC5D0\uC11C \uC8FC\uC81C \uC5F4\uAE30"
    ],
    newTabHelp: [
      "Applies to topic titles and links on member cards.",
      "\u9002\u7528\u4E8E\u4E3B\u9898\u6807\u9898\u548C\u7528\u6237\u5361\u7247\u91CC\u7684\u4E3B\u9898\u94FE\u63A5\u3002",
      "\u30C8\u30D4\u30C3\u30AF\u306E\u30BF\u30A4\u30C8\u30EB\u3068\u30E6\u30FC\u30B6\u30FC\u30AB\u30FC\u30C9\u5185\u306E\u30EA\u30F3\u30AF\u306B\u9069\u7528\u3057\u307E\u3059\u3002",
      "\uC8FC\uC81C \uC81C\uBAA9\uACFC \uC0AC\uC6A9\uC790 \uCE74\uB4DC\uC758 \uC8FC\uC81C \uB9C1\uD06C\uC5D0 \uC801\uC6A9\uB429\uB2C8\uB2E4."
    ],
    preview: [
      "Preview",
      "\u9884\u89C8",
      "\u30D7\u30EC\u30D3\u30E5\u30FC",
      "\uBBF8\uB9AC\uBCF4\uAE30"
    ],
    previewHelp: [
      "Show a preview button beside topic titles and open topics in a dialog.",
      "\u4E3B\u9898\u6807\u9898\u540E\u663E\u793A\u9884\u89C8\u6309\u94AE\uFF0C\u5728\u5F39\u7A97\u5185\u6253\u5F00\u4E3B\u9898\u3002",
      "\u30C8\u30D4\u30C3\u30AF\u306E\u30BF\u30A4\u30C8\u30EB\u6A2A\u306E\u30DC\u30BF\u30F3\u304B\u3089\u3001\u30C0\u30A4\u30A2\u30ED\u30B0\u3067\u5185\u5BB9\u3092\u8868\u793A\u3057\u307E\u3059\u3002",
      "\uC8FC\uC81C \uC81C\uBAA9 \uC606 \uBC84\uD2BC\uC744 \uB20C\uB7EC \uB300\uD654\uC0C1\uC790\uC5D0\uC11C \uC8FC\uC81C\uB97C \uC5FD\uB2C8\uB2E4."
    ],
    openTopic: [
      "Open topic",
      "\u8FDB\u5165\u4E3B\u9898",
      "\u30C8\u30D4\u30C3\u30AF\u3092\u958B\u304F",
      "\uC8FC\uC81C \uC5F4\uAE30"
    ],
    userCards: [
      "Member hover cards",
      "\u7528\u6237\u60AC\u6D6E\u5361\u7247",
      "\u30E6\u30FC\u30B6\u30FC\u30DB\u30D0\u30FC\u30AB\u30FC\u30C9",
      "\uC0AC\uC6A9\uC790 \uD638\uBC84 \uCE74\uB4DC"
    ],
    userCardsHelp: [
      "Hover over an avatar to see the profile and recent topics.",
      "\u60AC\u505C\u5934\u50CF\u67E5\u770B\u7528\u6237\u8D44\u6599\u548C\u6700\u8FD1\u53D1\u5E16\u3002",
      "\u30A2\u30D0\u30BF\u30FC\u306B\u30AB\u30FC\u30BD\u30EB\u3092\u5408\u308F\u305B\u3066\u30D7\u30ED\u30D5\u30A3\u30FC\u30EB\u3068\u6700\u8FD1\u306E\u6295\u7A3F\u3092\u8868\u793A\u3057\u307E\u3059\u3002",
      "\uC544\uBC14\uD0C0\uC5D0 \uB9C8\uC6B0\uC2A4\uB97C \uC62C\uB824 \uD504\uB85C\uD544\uACFC \uCD5C\uADFC \uAC8C\uC2DC\uBB3C\uC744 \uBD05\uB2C8\uB2E4."
    ],
    tags: [
      "Member tags",
      "\u7528\u6237\u6807\u7B7E",
      "\u30E6\u30FC\u30B6\u30FC\u30BF\u30B0",
      "\uC0AC\uC6A9\uC790 \uD0DC\uADF8"
    ],
    tagsHelp: [
      "Add tags from a member card or select an existing tag to edit it.",
      "\u4ECE\u7528\u6237\u5361\u7247\u6DFB\u52A0\u6807\u7B7E\uFF0C\u70B9\u51FB\u5DF2\u6709\u6807\u7B7E\u53EF\u7F16\u8F91\u3002",
      "\u30E6\u30FC\u30B6\u30FC\u30AB\u30FC\u30C9\u304B\u3089\u30BF\u30B0\u3092\u8FFD\u52A0\u3057\u3001\u65E2\u5B58\u306E\u30BF\u30B0\u3092\u9078\u3093\u3067\u7DE8\u96C6\u3057\u307E\u3059\u3002",
      "\uC0AC\uC6A9\uC790 \uCE74\uB4DC\uC5D0\uC11C \uD0DC\uADF8\uB97C \uCD94\uAC00\uD558\uAC70\uB098 \uAE30\uC874 \uD0DC\uADF8\uB97C \uB20C\uB7EC \uD3B8\uC9D1\uD569\uB2C8\uB2E4."
    ],
    hotReplies: [
      "Top replies on this page",
      "\u5F53\u524D\u9875\u70ED\u95E8\u56DE\u590D",
      "\u3053\u306E\u30DA\u30FC\u30B8\u306E\u4EBA\u6C17\u8FD4\u4FE1",
      "\uD604\uC7AC \uD398\uC774\uC9C0 \uC778\uAE30 \uB313\uAE00"
    ],
    hotRepliesHelp: [
      "Rank loaded replies by the number of thanks.",
      "\u6309\u5DF2\u52A0\u8F7D\u56DE\u590D\u7684\u611F\u8C22\u6570\u6392\u5E8F\u3002",
      "\u8AAD\u307F\u8FBC\u3093\u3060\u8FD4\u4FE1\u3092\u611F\u8B1D\u306E\u6570\u3067\u4E26\u3079\u66FF\u3048\u307E\u3059\u3002",
      "\uBD88\uB7EC\uC628 \uB313\uAE00\uC744 \uAC10\uC0AC \uC218\uB85C \uC815\uB82C\uD569\uB2C8\uB2E4."
    ],
    autoFold: [
      "Collapse long replies",
      "\u957F\u56DE\u590D\u4F18\u5316",
      "\u9577\u3044\u8FD4\u4FE1\u3092\u6298\u308A\u305F\u305F\u3080",
      "\uAE34 \uB313\uAE00 \uC811\uAE30"
    ],
    autoFoldHelp: [
      "Fold long replies automatically. Expand any reply to read it in full.",
      "\u81EA\u52A8\u6298\u53E0\u5197\u957F\u56DE\u590D\uFF0C\u70B9\u51FB\u5373\u53EF\u5C55\u5F00\u5168\u6587\u3002",
      "\u9577\u3044\u8FD4\u4FE1\u3092\u81EA\u52D5\u3067\u6298\u308A\u305F\u305F\u307F\u3001\u30DC\u30BF\u30F3\u3067\u5168\u6587\u3092\u8868\u793A\u3057\u307E\u3059\u3002",
      "\uAE34 \uB313\uAE00\uC744 \uC790\uB3D9\uC73C\uB85C \uC811\uC2B5\uB2C8\uB2E4. \uBC84\uD2BC\uC744 \uB20C\uB7EC \uC804\uCCB4\uB97C \uC77D\uC744 \uC218 \uC788\uC2B5\uB2C8\uB2E4."
    ],
    expandReply: [
      "Expand reply",
      "\u5C55\u5F00\u56DE\u590D",
      "\u8FD4\u4FE1\u3092\u5C55\u958B",
      "\uB313\uAE00 \uD3BC\uCE58\uAE30"
    ],
    collapseReply: [
      "Collapse reply",
      "\u6536\u8D77\u56DE\u590D",
      "\u8FD4\u4FE1\u3092\u6298\u308A\u305F\u305F\u3080",
      "\uB313\uAE00 \uC811\uAE30"
    ],
    preloadPages: [
      "Extra reply pages to preload",
      "\u81EA\u52A8\u8FFD\u52A0\u56DE\u590D\u9875\u6570",
      "\u8FD4\u4FE1\u306E\u5148\u8AAD\u307F\u30DA\u30FC\u30B8\u6570",
      "\uBBF8\uB9AC \uBD88\uB7EC\uC62C \uB313\uAE00 \uD398\uC774\uC9C0 \uC218"
    ],
    preloadPagesHelp: [
      "Preload 0\u20135 following pages. At 0, pages still load when selected.",
      "\u81EA\u52A8\u52A0\u8F7D\u540E\u7EED 0\uFF5E5 \u9875\u3002\u8BBE\u4E3A 0 \u65F6\u4ECD\u53EF\u70B9\u51FB\u9875\u7801\u52A0\u8F7D\u3002",
      "\u6B21\u306E\u30DA\u30FC\u30B8\u3092 0\uFF5E5 \u30DA\u30FC\u30B8\u5148\u8AAD\u307F\u3057\u307E\u3059\u30020 \u3067\u3082\u30DA\u30FC\u30B8\u756A\u53F7\u304B\u3089\u8AAD\u307F\u8FBC\u3081\u307E\u3059\u3002",
      "\uB2E4\uC74C \uD398\uC774\uC9C0\uB97C 0~5\uAC1C \uBBF8\uB9AC \uBD88\uB7EC\uC635\uB2C8\uB2E4. 0\uC774\uC5B4\uB3C4 \uD398\uC774\uC9C0\uB97C \uC120\uD0DD\uD574 \uBD88\uB7EC\uC62C \uC218 \uC788\uC2B5\uB2C8\uB2E4."
    ],
    autoCheckIn: [
      "Collect daily reward automatically",
      "\u81EA\u52A8\u9886\u53D6\u6BCF\u65E5\u5956\u52B1",
      "\u30ED\u30B0\u30A4\u30F3\u5831\u916C\u3092\u81EA\u52D5\u53D7\u53D6",
      "\uC77C\uC77C \uBCF4\uC0C1 \uC790\uB3D9 \uBC1B\uAE30"
    ],
    autoCheckInHelp: [
      "Check when the tab is visible, with up to three attempts per day.",
      "\u6807\u7B7E\u9875\u53EF\u89C1\u65F6\u68C0\u67E5\uFF0C\u6BCF\u5929\u6700\u591A\u5C1D\u8BD5\u4E09\u6B21\u3002",
      "\u30BF\u30D6\u306E\u8868\u793A\u6642\u306B\u78BA\u8A8D\u3057\u30011 \u65E5\u306B\u6700\u5927 3 \u56DE\u8A66\u884C\u3057\u307E\u3059\u3002",
      "\uD0ED\uC774 \uD45C\uC2DC\uB420 \uB54C \uD655\uC778\uD558\uBA70 \uD558\uB8E8 \uCD5C\uB300 3\uD68C \uC2DC\uB3C4\uD569\uB2C8\uB2E4."
    ],
    upload: [
      "Image uploads",
      "\u56FE\u7247\u4E0A\u4F20",
      "\u753B\u50CF\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9",
      "\uC774\uBBF8\uC9C0 \uC5C5\uB85C\uB4DC"
    ],
    uploadHelp: [
      "Select, paste, or drop images to upload to public Imgur hosting. Deletion links are stored locally.",
      "\u652F\u6301\u9009\u62E9\u3001\u7C98\u8D34\u548C\u62D6\u62FD\uFF0C\u56FE\u7247\u53D1\u9001\u81F3 Imgur \u516C\u5F00\u56FE\u5E8A\u3002\u5220\u9664\u5165\u53E3\u4FDD\u5B58\u5728\u672C\u5730\u3002",
      "\u753B\u50CF\u306E\u9078\u629E\u30FB\u8CBC\u308A\u4ED8\u3051\u30FB\u30C9\u30ED\u30C3\u30D7\u3067 Imgur \u306B\u516C\u958B\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u3057\u307E\u3059\u3002\u524A\u9664\u30EA\u30F3\u30AF\u306F\u30ED\u30FC\u30AB\u30EB\u306B\u4FDD\u5B58\u3057\u307E\u3059\u3002",
      "\uC774\uBBF8\uC9C0\uB97C \uC120\uD0DD\uD558\uAC70\uB098 \uBD99\uC5EC\uB123\uAC70\uB098 \uB04C\uC5B4 Imgur\uC5D0 \uACF5\uAC1C \uC5C5\uB85C\uB4DC\uD569\uB2C8\uB2E4. \uC0AD\uC81C \uB9C1\uD06C\uB294 \uB85C\uCEEC\uC5D0 \uC800\uC7A5\uB429\uB2C8\uB2E4."
    ],
    emoji: [
      "Polish emoji picker",
      "Polish \u8868\u60C5\u9009\u62E9\u5668",
      "Polish \u7D75\u6587\u5B57\u30D4\u30C3\u30AB\u30FC",
      "Polish \uC774\uBAA8\uD2F0\uCF58 \uC120\uD0DD\uAE30"
    ],
    emojiHelp: [
      "Show a picker next to Reply and convert selected image emoji codes on submission.",
      "\u5728\u56DE\u590D\u6309\u94AE\u65C1\u663E\u793A\u8868\u60C5\u5165\u53E3\uFF0C\u63D0\u4EA4\u65F6\u8F6C\u6362\u56FE\u7247\u8868\u60C5\u4EE3\u7801\u3002",
      "\u8FD4\u4FE1\u30DC\u30BF\u30F3\u306E\u6A2A\u306B\u30D4\u30C3\u30AB\u30FC\u3092\u8868\u793A\u3057\u3001\u9001\u4FE1\u6642\u306B\u753B\u50CF\u7D75\u6587\u5B57\u306E\u30B3\u30FC\u30C9\u3092\u5909\u63DB\u3057\u307E\u3059\u3002",
      "\uB313\uAE00 \uBC84\uD2BC \uC606\uC5D0 \uC120\uD0DD\uAE30\uB97C \uD45C\uC2DC\uD558\uACE0 \uC81C\uCD9C\uD560 \uB54C \uC774\uBBF8\uC9C0 \uC774\uBAA8\uD2F0\uCF58 \uCF54\uB4DC\uB97C \uBCC0\uD658\uD569\uB2C8\uB2E4."
    ],
    imgurClientId: [
      "Custom Imgur Client ID (optional)",
      "\u81EA\u5B9A\u4E49 Imgur Client ID\uFF08\u53EF\u9009\uFF09",
      "\u30AB\u30B9\u30BF\u30E0 Imgur Client ID\uFF08\u4EFB\u610F\uFF09",
      "\uC0AC\uC6A9\uC790 \uC9C0\uC815 Imgur Client ID(\uC120\uD0DD)"
    ],
    imgurClientIdHelp: [
      "Uses a shared application ID by default. Leave Client Secret out of this field.",
      "\u9ED8\u8BA4\u4F7F\u7528\u5171\u4EAB\u5E94\u7528 ID\u3002\u8BF7\u52FF\u586B\u5199 Client Secret\u3002",
      "\u65E2\u5B9A\u3067\u306F\u5171\u6709\u30A2\u30D7\u30EA ID \u3092\u4F7F\u7528\u3057\u307E\u3059\u3002Client Secret \u306F\u5165\u529B\u3057\u306A\u3044\u3067\u304F\u3060\u3055\u3044\u3002",
      "\uAE30\uBCF8\uAC12\uC740 \uACF5\uC720 \uC571 ID\uC785\uB2C8\uB2E4. Client Secret\uC740 \uC785\uB825\uD558\uC9C0 \uB9C8\uC138\uC694."
    ],
    sharedClient: [
      "Use the built-in shared Client ID",
      "\u7559\u7A7A\u4F7F\u7528\u5185\u7F6E\u5171\u4EAB Client ID",
      "\u7A7A\u6B04\u3067\u5171\u6709 Client ID \u3092\u4F7F\u7528",
      "\uBE44\uC6CC \uB450\uBA74 \uB0B4\uC7A5 \uACF5\uC720 Client ID \uC0AC\uC6A9"
    ],
    backup: [
      "Local backup and Polish tag migration",
      "\u672C\u5730\u5907\u4EFD\u4E0E Polish \u6807\u7B7E\u8FC1\u79FB",
      "\u30ED\u30FC\u30AB\u30EB\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3068 Polish \u30BF\u30B0\u79FB\u884C",
      "\uB85C\uCEEC \uBC31\uC5C5 \uBC0F Polish \uD0DC\uADF8 \uC774\uC804"
    ],
    backupHelp: [
      "Export contains plaintext tags and preferences. Import merges tags only, keeping existing entries. Keep the backup private. Maximum file size: 2 MB.",
      "\u5907\u4EFD\u5305\u542B\u660E\u6587\u6807\u7B7E\u548C\u8BBE\u7F6E\uFF0C\u8BF7\u79C1\u4E0B\u4FDD\u5B58\u3002\u5BFC\u5165\u4EC5\u5408\u5E76\u6807\u7B7E\uFF0C\u672C\u5730\u6761\u76EE\u4F18\u5148\u3002\u6587\u4EF6\u6700\u5927 2 MB\u3002",
      "\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u306B\u306F\u5E73\u6587\u306E\u30BF\u30B0\u3068\u8A2D\u5B9A\u304C\u542B\u307E\u308C\u307E\u3059\u3002\u30A4\u30F3\u30DD\u30FC\u30C8\u306F\u30BF\u30B0\u306E\u307F\u3092\u7D71\u5408\u3057\u3001\u65E2\u5B58\u306E\u9805\u76EE\u3092\u512A\u5148\u3057\u307E\u3059\u3002\u30D5\u30A1\u30A4\u30EB\u306F\u6700\u5927 2 MB \u3067\u3059\u3002",
      "\uB0B4\uBCF4\uB0B8 \uD30C\uC77C\uC5D0 \uD3C9\uBB38 \uD0DC\uADF8\uC640 \uC124\uC815\uC774 \uD3EC\uD568\uB429\uB2C8\uB2E4. \uAC00\uC838\uC624\uAE30\uB294 \uAE30\uC874 \uD56D\uBAA9\uC744 \uC720\uC9C0\uD558\uACE0 \uD0DC\uADF8\uB9CC \uBCD1\uD569\uD569\uB2C8\uB2E4. \uD30C\uC77C\uC740 \uCD5C\uB300 2 MB\uC785\uB2C8\uB2E4."
    ],
    exportBackup: [
      "Export JSON backup",
      "\u5BFC\u51FA JSON \u5907\u4EFD",
      "JSON \u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3092\u51FA\u529B",
      "JSON \uBC31\uC5C5 \uB0B4\uBCF4\uB0B4\uAE30"
    ],
    importBackup: [
      "Import tag JSON",
      "\u5BFC\u5165\u6807\u7B7E JSON",
      "\u30BF\u30B0\u306E JSON \u3092\u53D6\u308A\u8FBC\u3080",
      "\uD0DC\uADF8 JSON \uAC00\uC838\uC624\uAE30"
    ],
    selectBackup: [
      "Select a tag backup file",
      "\u9009\u62E9\u6807\u7B7E\u5907\u4EFD\u6587\u4EF6",
      "\u30BF\u30B0\u306E\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u30D5\u30A1\u30A4\u30EB\u3092\u9078\u629E",
      "\uD0DC\uADF8 \uBC31\uC5C5 \uD30C\uC77C \uC120\uD0DD"
    ],
    backupSize: [
      "Backup files must be 2 MB or smaller.",
      "\u5907\u4EFD\u6587\u4EF6\u4E0D\u80FD\u8D85\u8FC7 2 MB\u3002",
      "\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u30D5\u30A1\u30A4\u30EB\u306F 2 MB \u4EE5\u4E0B\u306B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
      "\uBC31\uC5C5 \uD30C\uC77C\uC740 2 MB \uC774\uD558\uC5EC\uC57C \uD569\uB2C8\uB2E4."
    ],
    backupFormat: [
      "Invalid backup format.",
      "\u5907\u4EFD\u6587\u4EF6\u683C\u5F0F\u4E0D\u6B63\u786E\u3002",
      "\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u5F62\u5F0F\u304C\u7121\u52B9\u3067\u3059\u3002",
      "\uBC31\uC5C5 \uD30C\uC77C \uD615\uC2DD\uC774 \uC798\uBABB\uB418\uC5C8\uC2B5\uB2C8\uB2E4."
    ],
    backupVersion: [
      "Unsupported backup version.",
      "\u4E0D\u652F\u6301\u6B64\u5907\u4EFD\u7248\u672C\u3002",
      "\u3053\u306E\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u306E\u30D0\u30FC\u30B8\u30E7\u30F3\u306B\u306F\u5BFE\u5FDC\u3057\u3066\u3044\u307E\u305B\u3093\u3002",
      "\uC9C0\uC6D0\uD558\uC9C0 \uC54A\uB294 \uBC31\uC5C5 \uBC84\uC804\uC785\uB2C8\uB2E4."
    ],
    backupNoTags: [
      "No member tags found in the backup.",
      "\u5907\u4EFD\u4E2D\u672A\u627E\u5230\u7528\u6237\u6807\u7B7E\u3002",
      "\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u306B\u30E6\u30FC\u30B6\u30FC\u30BF\u30B0\u304C\u3042\u308A\u307E\u305B\u3093\u3002",
      "\uBC31\uC5C5\uC5D0\uC11C \uC0AC\uC6A9\uC790 \uD0DC\uADF8\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4."
    ],
    backupTooMany: [
      "A backup can contain up to {0} members.",
      "\u5907\u4EFD\u4E2D\u7684\u7528\u6237\u6570\u4E0D\u80FD\u8D85\u8FC7 {0}\u3002",
      "\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u306E\u30E6\u30FC\u30B6\u30FC\u6570\u306F\u6700\u5927 {0} \u4EBA\u3067\u3059\u3002",
      "\uBC31\uC5C5\uC5D0 \uCD5C\uB300 {0}\uBA85\uC758 \uC0AC\uC6A9\uC790\uB97C \uD3EC\uD568\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4."
    ],
    invalidJSON: [
      "Invalid JSON format.",
      "JSON \u683C\u5F0F\u4E0D\u6B63\u786E\u3002",
      "JSON \u306E\u5F62\u5F0F\u304C\u7121\u52B9\u3067\u3059\u3002",
      "JSON \uD615\uC2DD\uC774 \uC798\uBABB\uB418\uC5C8\uC2B5\uB2C8\uB2E4."
    ],
    importFailed: [
      "Import failed: {0}",
      "\u5BFC\u5165\u5931\u8D25\uFF1A{0}",
      "\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F\uFF1A{0}",
      "\uAC00\uC838\uC624\uAE30 \uC2E4\uD328: {0}"
    ],
    imported: [
      "Tags imported for {0} members. Refresh to see the changes.",
      "\u5DF2\u5BFC\u5165 {0} \u4E2A\u7528\u6237\u7684\u6807\u7B7E\uFF0C\u5237\u65B0\u540E\u663E\u793A\u66F4\u65B0\u3002",
      "{0} \u4EBA\u5206\u306E\u30BF\u30B0\u3092\u30A4\u30F3\u30DD\u30FC\u30C8\u3057\u307E\u3057\u305F\u3002\u518D\u8AAD\u307F\u8FBC\u307F\u3059\u308B\u3068\u53CD\u6620\u3055\u308C\u307E\u3059\u3002",
      "\uC0AC\uC6A9\uC790 {0}\uBA85\uC758 \uD0DC\uADF8\uB97C \uAC00\uC838\uC654\uC2B5\uB2C8\uB2E4. \uC0C8\uB85C\uACE0\uCE68\uD558\uC5EC \uBCC0\uACBD \uC0AC\uD56D\uC744 \uD655\uC778\uD558\uC138\uC694."
    ],
    saveFailed: [
      "Could not save. Check the userscript manager\u2019s storage and retry.",
      "\u4FDD\u5B58\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u811A\u672C\u7BA1\u7406\u5668\u7684\u672C\u5730\u5B58\u50A8\u540E\u91CD\u8BD5\u3002",
      "\u4FDD\u5B58\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u30B9\u30AF\u30EA\u30D7\u30C8\u7BA1\u7406\u30C4\u30FC\u30EB\u306E\u30B9\u30C8\u30EC\u30FC\u30B8\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
      "\uC800\uC7A5\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4. \uC2A4\uD06C\uB9BD\uD2B8 \uAD00\uB9AC\uC790\uC758 \uC800\uC7A5 \uACF5\uAC04\uC744 \uD655\uC778\uD558\uC138\uC694."
    ],
    uploadHistory: [
      "Upload history",
      "\u4E0A\u4F20\u8BB0\u5F55",
      "\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u5C65\u6B74",
      "\uC5C5\uB85C\uB4DC \uAE30\uB85D"
    ],
    noUploads: [
      "No uploads yet.",
      "\u6682\u65E0\u4E0A\u4F20\u8BB0\u5F55\u3002",
      "\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u5C65\u6B74\u306F\u3042\u308A\u307E\u305B\u3093\u3002",
      "\uC5C5\uB85C\uB4DC \uAE30\uB85D\uC774 \uC5C6\uC2B5\uB2C8\uB2E4."
    ],
    deleteImage: [
      "Delete image",
      "\u5220\u9664\u56FE\u7247",
      "\u753B\u50CF\u3092\u524A\u9664",
      "\uC774\uBBF8\uC9C0 \uC0AD\uC81C"
    ],
    retry: ["Retry", "\u91CD\u8BD5", "\u518D\u8A66\u884C", "\uB2E4\uC2DC \uC2DC\uB3C4"],
    loadingPage: [
      "Loading page {0}\u2026",
      "\u6B63\u5728\u52A0\u8F7D\u7B2C {0} \u9875\u2026",
      "{0} \u30DA\u30FC\u30B8\u3092\u8AAD\u307F\u8FBC\u307F\u4E2D\u2026",
      "{0} \uD398\uC774\uC9C0 \uBD88\uB7EC\uC624\uB294 \uC911\u2026"
    ],
    pageFailed: [
      "Could not load page {0}: {1}",
      "\u7B2C {0} \u9875\u52A0\u8F7D\u5931\u8D25\uFF1A{1}",
      "{0} \u30DA\u30FC\u30B8\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F\uFF1A{1}",
      "{0} \uD398\uC774\uC9C0 \uBD88\uB7EC\uC624\uAE30 \uC2E4\uD328: {1}"
    ],
    noReplies: [
      "No replies found. Open the original page to check.",
      "\u672A\u627E\u5230\u56DE\u590D\uFF0C\u8BF7\u76F4\u63A5\u6253\u5F00\u539F\u9875\u9762\u68C0\u67E5\u3002",
      "\u8FD4\u4FE1\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3002\u5143\u306E\u30DA\u30FC\u30B8\u3092\u958B\u3044\u3066\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
      "\uB313\uAE00\uC744 \uCC3E\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uC6D0\uB798 \uD398\uC774\uC9C0\uB97C \uC5F4\uC5B4 \uD655\uC778\uD558\uC138\uC694."
    ],
    jumpPage: [
      "Jump to page {0}",
      "\u5B9A\u4F4D\u5230\u7B2C {0} \u9875",
      "{0} \u30DA\u30FC\u30B8\u3078\u79FB\u52D5",
      "{0} \uD398\uC774\uC9C0\uB85C \uC774\uB3D9"
    ],
    loadPage: [
      "Load and jump to page {0}",
      "\u52A0\u8F7D\u5E76\u5B9A\u4F4D\u5230\u7B2C {0} \u9875",
      "{0} \u30DA\u30FC\u30B8\u3092\u8AAD\u307F\u8FBC\u3093\u3067\u79FB\u52D5",
      "{0} \uD398\uC774\uC9C0\uB97C \uBD88\uB7EC\uC640 \uC774\uB3D9"
    ],
    pageNumber: [
      "Jump to a page",
      "\u8DF3\u8F6C\u9875\u7801",
      "\u30DA\u30FC\u30B8\u756A\u53F7\u3067\u79FB\u52D5",
      "\uD398\uC774\uC9C0 \uBC88\uD638\uB85C \uC774\uB3D9"
    ],
    previousPage: [
      "Previous page",
      "\u4E0A\u4E00\u9875",
      "\u524D\u306E\u30DA\u30FC\u30B8",
      "\uC774\uC804 \uD398\uC774\uC9C0"
    ],
    nextPage: [
      "Next page",
      "\u4E0B\u4E00\u9875",
      "\u6B21\u306E\u30DA\u30FC\u30B8",
      "\uB2E4\uC74C \uD398\uC774\uC9C0"
    ],
    replyPages: [
      "Reply pagination",
      "\u56DE\u590D\u5206\u9875",
      "\u8FD4\u4FE1\u30DA\u30FC\u30B8",
      "\uB313\uAE00 \uD398\uC774\uC9C0"
    ],
    hideReply: [
      "Hide reply",
      "\u9690\u85CF\u56DE\u590D",
      "\u8FD4\u4FE1\u3092\u975E\u8868\u793A",
      "\uB313\uAE00 \uC228\uAE30\uAE30"
    ],
    thankReply: [
      "Thank reply",
      "\u611F\u8C22\u56DE\u590D",
      "\u8FD4\u4FE1\u306B\u611F\u8B1D",
      "\uB313\uAE00\uC5D0 \uAC10\uC0AC\uD558\uAE30"
    ],
    thanked: ["Thanks sent", "\u5DF2\u611F\u8C22", "\u611F\u8B1D\u6E08\u307F", "\uAC10\uC0AC\uD568"],
    confirmHide: [
      "Hide this reply?",
      "\u786E\u5B9A\u8981\u9690\u85CF\u8FD9\u6761\u56DE\u590D\u5417\uFF1F",
      "\u3053\u306E\u8FD4\u4FE1\u3092\u975E\u8868\u793A\u306B\u3057\u307E\u3059\u304B\uFF1F",
      "\uC774 \uB313\uAE00\uC744 \uC228\uAE38\uAE4C\uC694?"
    ],
    confirmThank: [
      "Spend {0} copper to thank @{1} for this reply?",
      "\u786E\u8BA4\u82B1\u8D39 {0} \u4E2A\u94DC\u5E01\u5411 @{1} \u7684\u8FD9\u6761\u56DE\u590D\u53D1\u9001\u611F\u8C22\uFF1F",
      "\u9285\u8CA8 {0} \u679A\u3092\u4F7F\u3063\u3066 @{1} \u306E\u8FD4\u4FE1\u306B\u611F\u8B1D\u3057\u307E\u3059\u304B\uFF1F",
      "\uAD6C\uB9AC {0}\uAC1C\uB97C \uC0AC\uC6A9\uD574 @{1}\uB2D8\uC758 \uB313\uAE00\uC5D0 \uAC10\uC0AC\uD560\uAE4C\uC694?"
    ],
    confirmThankUnknown: [
      "Thank @{0} for this reply? This costs copper.",
      "\u786E\u8BA4\u5411 @{0} \u7684\u8FD9\u6761\u56DE\u590D\u53D1\u9001\u611F\u8C22\uFF1F\u6B64\u64CD\u4F5C\u4F1A\u82B1\u8D39\u94DC\u5E01\u3002",
      "@{0} \u306E\u8FD4\u4FE1\u306B\u611F\u8B1D\u3057\u307E\u3059\u304B\uFF1F\u9285\u8CA8\u3092\u6D88\u8CBB\u3057\u307E\u3059\u3002",
      "@{0}\uB2D8\uC758 \uB313\uAE00\uC5D0 \uAC10\uC0AC\uD560\uAE4C\uC694? \uAD6C\uB9AC\uAC00 \uC18C\uBAA8\uB429\uB2C8\uB2E4."
    ],
    actionFailed: [
      "V2EX could not complete the action. Refresh and try again.",
      "\u539F\u7AD9\u64CD\u4F5C\u672A\u80FD\u5B8C\u6210\uFF0C\u8BF7\u5237\u65B0\u9875\u9762\u540E\u518D\u8BD5\u3002",
      "V2EX \u3067\u64CD\u4F5C\u3092\u5B8C\u4E86\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u518D\u8AAD\u307F\u8FBC\u307F\u3057\u3066\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
      "V2EX\uC5D0\uC11C \uC791\uC5C5\uC744 \uC644\uB8CC\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uC0C8\uB85C\uACE0\uCE68 \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD558\uC138\uC694."
    ],
    editTags: [
      "Edit tags for {0}",
      "\u8BBE\u7F6E\u7528\u6237\u6807\u7B7E\uFF1A{0}",
      "{0} \u306E\u30BF\u30B0\u3092\u7DE8\u96C6",
      "{0}\uB2D8\uC758 \uD0DC\uADF8 \uD3B8\uC9D1"
    ],
    manageTags: [
      "Manage member tags",
      "\u7BA1\u7406\u7528\u6237\u6807\u7B7E",
      "\u30E6\u30FC\u30B6\u30FC\u30BF\u30B0\u3092\u7BA1\u7406",
      "\uC0AC\uC6A9\uC790 \uD0DC\uADF8 \uAD00\uB9AC"
    ],
    searchTags: [
      "Search by username or tag",
      "\u6309\u7528\u6237\u540D\u6216\u6807\u7B7E\u641C\u7D22",
      "\u30E6\u30FC\u30B6\u30FC\u540D\u30FB\u30BF\u30B0\u3067\u691C\u7D22",
      "\uC0AC\uC6A9\uC790 \uC774\uB984 \uB610\uB294 \uD0DC\uADF8\uB85C \uAC80\uC0C9"
    ],
    noMatchingTags: [
      "No matching member tags.",
      "\u6CA1\u6709\u5339\u914D\u7684\u7528\u6237\u6807\u7B7E\u3002",
      "\u8A72\u5F53\u3059\u308B\u30E6\u30FC\u30B6\u30FC\u30BF\u30B0\u304C\u3042\u308A\u307E\u305B\u3093\u3002",
      "\uC77C\uCE58\uD558\uB294 \uC0AC\uC6A9\uC790 \uD0DC\uADF8\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4."
    ],
    moreTags: [
      "Show more",
      "\u663E\u793A\u66F4\u591A",
      "\u3055\u3089\u306B\u8868\u793A",
      "\uB354 \uBCF4\uAE30"
    ],
    edit: ["Edit", "\u7F16\u8F91", "\u7DE8\u96C6", "\uD3B8\uC9D1"],
    cancel: ["Cancel", "\u53D6\u6D88", "\u30AD\u30E3\u30F3\u30BB\u30EB", "\uCDE8\uC18C"],
    tagsSaved: [
      "Tags saved for {0}.",
      "\u5DF2\u4FDD\u5B58 {0} \u7684\u6807\u7B7E\u3002",
      "{0} \u306E\u30BF\u30B0\u3092\u4FDD\u5B58\u3057\u307E\u3057\u305F\u3002",
      "{0}\uB2D8\uC758 \uD0DC\uADF8\uB97C \uC800\uC7A5\uD588\uC2B5\uB2C8\uB2E4."
    ],
    tagInstructions: [
      "Enter to add. Paste a comma- or line-separated list. Click a tag to edit it.",
      "\u56DE\u8F66\u6DFB\u52A0\uFF0C\u652F\u6301\u7C98\u8D34\u591A\u884C\u6216\u7528\u9017\u53F7\u5206\u9694\u3002\u70B9\u51FB\u6807\u7B7E\u53EF\u7F16\u8F91\u3002",
      "Enter \u3067\u8FFD\u52A0\u3002\u30AB\u30F3\u30DE\u304B\u6539\u884C\u3067\u533A\u5207\u3063\u3066\u8CBC\u308A\u4ED8\u3051\u3089\u308C\u307E\u3059\u3002\u30AF\u30EA\u30C3\u30AF\u3067\u7DE8\u96C6\u3067\u304D\u307E\u3059\u3002",
      "Enter\uB85C \uCD94\uAC00\uD558\uC138\uC694. \uC27C\uD45C\uB098 \uC904\uBC14\uAFC8\uC73C\uB85C \uAD6C\uBD84\uD574 \uBD99\uC5EC\uB123\uC744 \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uD0DC\uADF8\uB97C \uD074\uB9AD\uD574 \uD3B8\uC9D1\uD558\uC138\uC694."
    ],
    saveTags: [
      "Save tags",
      "\u4FDD\u5B58\u6807\u7B7E",
      "\u30BF\u30B0\u3092\u4FDD\u5B58",
      "\uD0DC\uADF8 \uC800\uC7A5"
    ],
    tagLimit: [
      "Each member can have up to {0} tags.",
      "\u6BCF\u4F4D\u7528\u6237\u6700\u591A\u8BBE\u7F6E {0} \u4E2A\u6807\u7B7E\u3002",
      "\u30E6\u30FC\u30B6\u30FC\u3054\u3068\u306B\u6700\u5927 {0} \u500B\u306E\u30BF\u30B0\u3092\u8A2D\u5B9A\u3067\u304D\u307E\u3059\u3002",
      "\uC0AC\uC6A9\uC790\uB2F9 \uD0DC\uADF8\uB97C \uCD5C\uB300 {0}\uAC1C \uC124\uC815\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4."
    ],
    tagFormat: [
      "Invalid tag. Each tag can have up to {0} characters.",
      "\u6807\u7B7E\u683C\u5F0F\u6709\u8BEF\uFF0C\u6BCF\u4E2A\u6807\u7B7E\u6700\u591A {0} \u4E2A\u5B57\u7B26\u3002",
      "\u30BF\u30B0\u306E\u5F62\u5F0F\u304C\u7121\u52B9\u3067\u3059\u3002\u30BF\u30B0\u306F {0} \u6587\u5B57\u4EE5\u4E0B\u306B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
      "\uD0DC\uADF8 \uD615\uC2DD\uC774 \uC798\uBABB\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uAC01 \uD0DC\uADF8\uB294 \uCD5C\uB300 {0}\uC790\uC785\uB2C8\uB2E4."
    ],
    badUsername: [
      "Invalid username.",
      "\u7528\u6237\u540D\u683C\u5F0F\u4E0D\u6B63\u786E\u3002",
      "\u30E6\u30FC\u30B6\u30FC\u540D\u306E\u5F62\u5F0F\u304C\u7121\u52B9\u3067\u3059\u3002",
      "\uC0AC\uC6A9\uC790 \uC774\uB984 \uD615\uC2DD\uC774 \uC798\uBABB\uB418\uC5C8\uC2B5\uB2C8\uB2E4."
    ],
    memberNumber: [
      "V2EX member #{0}",
      "V2EX \u7B2C {0} \u53F7\u4F1A\u5458",
      "V2EX \u4F1A\u54E1\u756A\u53F7 {0}",
      "V2EX \uD68C\uC6D0 \uBC88\uD638 {0}"
    ],
    joined: [
      "Joined {0}",
      "\u52A0\u5165\u4E8E {0}",
      "\u53C2\u52A0\u65E5 {0}",
      "\uAC00\uC785\uC77C {0}"
    ],
    recentMember: [
      "Joined within {0} days",
      "{0} \u5929\u5185\u6CE8\u518C",
      "\u767B\u9332\u304B\u3089 {0} \u65E5\u4EE5\u5185",
      "\uAC00\uC785 {0}\uC77C \uC774\uB0B4"
    ],
    recentTopics: [
      "Recent topics",
      "\u6700\u8FD1\u53D1\u5E16",
      "\u6700\u8FD1\u306E\u6295\u7A3F",
      "\uCD5C\uADFC \uAC8C\uC2DC\uBB3C"
    ],
    addTags: [
      "Add member tags",
      "\u6DFB\u52A0\u7528\u6237\u6807\u7B7E",
      "\u30E6\u30FC\u30B6\u30FC\u30BF\u30B0\u3092\u8FFD\u52A0",
      "\uC0AC\uC6A9\uC790 \uD0DC\uADF8 \uCD94\uAC00"
    ],
    blockMember: [
      "Block member",
      "\u5C4F\u853D\u8BE5\u7528\u6237",
      "\u30E6\u30FC\u30B6\u30FC\u3092\u30D6\u30ED\u30C3\u30AF",
      "\uC0AC\uC6A9\uC790 \uCC28\uB2E8"
    ],
    confirmBlock: [
      "Block {0}?",
      "\u786E\u5B9A\u8981\u5C4F\u853D\u7528\u6237 {0} \u5417\uFF1F",
      "{0} \u3092\u30D6\u30ED\u30C3\u30AF\u3057\u307E\u3059\u304B\uFF1F",
      "{0}\uB2D8\uC744 \uCC28\uB2E8\uD560\uAE4C\uC694?"
    ],
    blocking: [
      "Blocking\u2026",
      "\u5C4F\u853D\u4E2D\u2026",
      "\u30D6\u30ED\u30C3\u30AF\u4E2D\u2026",
      "\uCC28\uB2E8 \uC911\u2026"
    ],
    blocked: [
      "Member blocked",
      "\u5DF2\u5C4F\u853D\u8BE5\u7528\u6237",
      "\u30E6\u30FC\u30B6\u30FC\u3092\u30D6\u30ED\u30C3\u30AF\u6E08\u307F",
      "\uC0AC\uC6A9\uC790 \uCC28\uB2E8\uB428"
    ],
    show: ["Show", "\u663E\u793A", "\u8868\u793A", "\uD45C\uC2DC"],
    hide: ["Hide", "\u9690\u85CF", "\u975E\u8868\u793A", "\uC228\uAE30\uAE30"],
    memberPageFailed: [
      "Could not load the profile. Check your sign-in or verification status.",
      "\u7528\u6237\u9875\u9762\u52A0\u8F7D\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u767B\u5F55\u6216\u9A8C\u8BC1\u72B6\u6001\u3002",
      "\u30D7\u30ED\u30D5\u30A3\u30FC\u30EB\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u30ED\u30B0\u30A4\u30F3\u3084\u8A8D\u8A3C\u306E\u72B6\u614B\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
      "\uD504\uB85C\uD544\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uB85C\uADF8\uC778 \uB610\uB294 \uC778\uC99D \uC0C1\uD0DC\uB97C \uD655\uC778\uD558\uC138\uC694."
    ],
    memberPageUnexpected: [
      "Unexpected member page.",
      "\u7528\u6237\u9875\u9762\u5185\u5BB9\u5F02\u5E38\u3002",
      "\u30E6\u30FC\u30B6\u30FC\u30DA\u30FC\u30B8\u306E\u5185\u5BB9\u304C\u4E88\u671F\u3057\u305F\u5F62\u5F0F\u3068\u7570\u306A\u308A\u307E\u3059\u3002",
      "\uC608\uC0C1\uD558\uC9C0 \uBABB\uD55C \uC0AC\uC6A9\uC790 \uD398\uC774\uC9C0\uC785\uB2C8\uB2E4."
    ],
    memberMissing: [
      "Member not found.",
      "\u67E5\u65E0\u6B64\u7528\u6237\u3002",
      "\u30E6\u30FC\u30B6\u30FC\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3002",
      "\uC0AC\uC6A9\uC790\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4."
    ],
    memberFetchFailed: [
      "Could not load member information.",
      "\u83B7\u53D6\u7528\u6237\u4FE1\u606F\u5931\u8D25\u3002",
      "\u30E6\u30FC\u30B6\u30FC\u60C5\u5831\u3092\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002",
      "\uC0AC\uC6A9\uC790 \uC815\uBCF4\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4."
    ],
    memberMismatch: [
      "Member information does not match the request.",
      "\u7528\u6237\u4FE1\u606F\u4E0E\u8BF7\u6C42\u4E0D\u4E00\u81F4\u3002",
      "\u53D6\u5F97\u3057\u305F\u30E6\u30FC\u30B6\u30FC\u60C5\u5831\u304C\u30EA\u30AF\u30A8\u30B9\u30C8\u3068\u4E00\u81F4\u3057\u307E\u305B\u3093\u3002",
      "\uC0AC\uC6A9\uC790 \uC815\uBCF4\uAC00 \uC694\uCCAD\uACFC \uC77C\uCE58\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4."
    ],
    blockUnavailable: [
      "Block action unavailable. The member may already be blocked or your session may have expired.",
      "\u672A\u627E\u5230\u5C4F\u853D\u6309\u94AE\uFF0C\u7528\u6237\u53EF\u80FD\u5DF2\u88AB\u5C4F\u853D\uFF0C\u6216\u767B\u5F55\u5DF2\u5931\u6548\u3002",
      "\u30D6\u30ED\u30C3\u30AF\u30DC\u30BF\u30F3\u304C\u3042\u308A\u307E\u305B\u3093\u3002\u30D6\u30ED\u30C3\u30AF\u6E08\u307F\u304B\u3001\u30ED\u30B0\u30A4\u30F3\u306E\u6709\u52B9\u671F\u9650\u304C\u5207\u308C\u305F\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059\u3002",
      "\uCC28\uB2E8 \uBC84\uD2BC\uC774 \uC5C6\uC2B5\uB2C8\uB2E4. \uC774\uBBF8 \uCC28\uB2E8\uD588\uAC70\uB098 \uC138\uC158\uC774 \uB9CC\uB8CC\uB418\uC5C8\uC744 \uC218 \uC788\uC2B5\uB2C8\uB2E4."
    ],
    blockFailed: [
      "Could not block this member. Refresh and try again.",
      "\u5C4F\u853D\u64CD\u4F5C\u5931\u8D25\uFF0C\u8BF7\u5237\u65B0\u540E\u91CD\u8BD5\u3002",
      "\u30D6\u30ED\u30C3\u30AF\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u518D\u8AAD\u307F\u8FBC\u307F\u3057\u3066\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
      "\uC0AC\uC6A9\uC790 \uCC28\uB2E8\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4. \uC0C8\uB85C\uACE0\uCE68 \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD558\uC138\uC694."
    ],
    blockUnconfirmed: [
      "Could not verify the block. Refresh the member profile to check.",
      "\u672A\u80FD\u786E\u8BA4\u5C4F\u853D\u7ED3\u679C\uFF0C\u8BF7\u5237\u65B0\u7528\u6237\u9875\u9762\u68C0\u67E5\u3002",
      "\u30D6\u30ED\u30C3\u30AF\u3092\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u30D7\u30ED\u30D5\u30A3\u30FC\u30EB\u3092\u518D\u8AAD\u307F\u8FBC\u307F\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
      "\uCC28\uB2E8 \uACB0\uACFC\uB97C \uD655\uC778\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uC0AC\uC6A9\uC790 \uD504\uB85C\uD544\uC744 \uC0C8\uB85C\uACE0\uCE68\uD558\uC138\uC694."
    ],
    insertEmoji: [
      "Insert emoji",
      "\u63D2\u5165\u8868\u60C5",
      "\u7D75\u6587\u5B57\u3092\u633F\u5165",
      "\uC774\uBAA8\uD2F0\uCF58 \uC0BD\uC785"
    ],
    checkInManual: [
      "Automatic rewards require Web Locks. Open /mission/daily to collect manually.",
      "\u81EA\u52A8\u9886\u5956\u529F\u80FD\u9700\u8981 Web Locks\uFF0C\u53EF\u6253\u5F00 /mission/daily \u624B\u52A8\u9886\u53D6\u3002",
      "\u5831\u916C\u306E\u81EA\u52D5\u53D7\u53D6\u306B\u306F Web Locks \u304C\u5FC5\u8981\u3067\u3059\u3002/mission/daily \u304B\u3089\u624B\u52D5\u3067\u53D7\u3051\u53D6\u308C\u307E\u3059\u3002",
      "\uC790\uB3D9 \uBCF4\uC0C1 \uBC1B\uAE30\uC5D0\uB294 Web Locks\uAC00 \uD544\uC694\uD569\uB2C8\uB2E4. /mission/daily\uC5D0\uC11C \uC9C1\uC811 \uBC1B\uC73C\uC138\uC694."
    ],
    accountChanged: [
      "Account changed or signed out.",
      "\u8D26\u53F7\u5DF2\u66F4\u6362\u6216\u5DF2\u9000\u51FA\u767B\u5F55\u3002",
      "\u30A2\u30AB\u30A6\u30F3\u30C8\u304C\u5909\u66F4\u3055\u308C\u305F\u304B\u3001\u30ED\u30B0\u30A2\u30A6\u30C8\u3057\u307E\u3057\u305F\u3002",
      "\uACC4\uC815\uC774 \uBCC0\uACBD\uB418\uC5C8\uAC70\uB098 \uB85C\uADF8\uC544\uC6C3\uD588\uC2B5\uB2C8\uB2E4."
    ],
    rewardLinkMissing: [
      "Daily reward link not found.",
      "\u672A\u627E\u5230\u6BCF\u65E5\u5956\u52B1\u9886\u53D6\u5165\u53E3\u3002",
      "\u30ED\u30B0\u30A4\u30F3\u5831\u916C\u306E\u30EA\u30F3\u30AF\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3002",
      "\uC77C\uC77C \uBCF4\uC0C1 \uB9C1\uD06C\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4."
    ],
    rewardUnconfirmed: [
      "Could not confirm the daily reward.",
      "\u672A\u80FD\u786E\u8BA4\u6BCF\u65E5\u5956\u52B1\u9886\u53D6\u7ED3\u679C\u3002",
      "\u30ED\u30B0\u30A4\u30F3\u5831\u916C\u306E\u53D7\u53D6\u3092\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002",
      "\uC77C\uC77C \uBCF4\uC0C1 \uC218\uB839 \uACB0\uACFC\uB97C \uD655\uC778\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4."
    ],
    rewardReceived: [
      "Daily reward received.",
      "\u5DF2\u9886\u53D6\u6BCF\u65E5\u5956\u52B1\u3002",
      "\u30ED\u30B0\u30A4\u30F3\u5831\u916C\u3092\u53D7\u3051\u53D6\u308A\u307E\u3057\u305F\u3002",
      "\uC77C\uC77C \uBCF4\uC0C1\uC744 \uBC1B\uC558\uC2B5\uB2C8\uB2E4."
    ],
    checkInError: [
      "Daily reward: {0}",
      "\u6BCF\u65E5\u5956\u52B1\uFF1A{0}",
      "\u30ED\u30B0\u30A4\u30F3\u5831\u916C\uFF1A{0}",
      "\uC77C\uC77C \uBCF4\uC0C1: {0}"
    ],
    requestOrigin: [
      "Cross-origin page request blocked.",
      "\u5DF2\u963B\u6B62\u8DE8\u7AD9\u9875\u9762\u8BF7\u6C42\u3002",
      "\u5225\u306E\u30AA\u30EA\u30B8\u30F3\u3078\u306E\u30DA\u30FC\u30B8\u30EA\u30AF\u30A8\u30B9\u30C8\u3092\u62D2\u5426\u3057\u307E\u3057\u305F\u3002",
      "\uB2E4\uB978 \uCD9C\uCC98\uC5D0 \uB300\uD55C \uD398\uC774\uC9C0 \uC694\uCCAD\uC774 \uCC28\uB2E8\uB418\uC5C8\uC2B5\uB2C8\uB2E4."
    ],
    requestHTTP: [
      "V2EX returned HTTP {0}.",
      "V2EX \u8FD4\u56DE HTTP {0}\u3002",
      "V2EX \u304C HTTP {0} \u3092\u8FD4\u3057\u307E\u3057\u305F\u3002",
      "V2EX\uAC00 HTTP {0}\uC744 \uBC18\uD658\uD588\uC2B5\uB2C8\uB2E4."
    ],
    requestRedirected: [
      "V2EX redirected this request. Open the original page first.",
      "V2EX \u91CD\u5B9A\u5411\u4E86\u8BF7\u6C42\uFF0C\u8BF7\u5148\u76F4\u63A5\u6253\u5F00\u539F\u9875\u9762\u3002",
      "V2EX \u304C\u30EA\u30AF\u30A8\u30B9\u30C8\u3092\u30EA\u30C0\u30A4\u30EC\u30AF\u30C8\u3057\u307E\u3057\u305F\u3002\u5143\u306E\u30DA\u30FC\u30B8\u3092\u76F4\u63A5\u958B\u3044\u3066\u304F\u3060\u3055\u3044\u3002",
      "V2EX\uAC00 \uC694\uCCAD\uC744 \uB9AC\uB514\uB809\uC158\uD588\uC2B5\uB2C8\uB2E4. \uC6D0\uB798 \uD398\uC774\uC9C0\uB97C \uBA3C\uC800 \uC5EC\uC138\uC694."
    ],
    requestUnexpected: [
      "Unexpected page. Complete sign-in or verification on V2EX first.",
      "\u9875\u9762\u5185\u5BB9\u5F02\u5E38\uFF0C\u8BF7\u5148\u5728 V2EX \u5B8C\u6210\u767B\u5F55\u6216\u9A8C\u8BC1\u3002",
      "\u4E88\u671F\u3057\u306A\u3044\u30DA\u30FC\u30B8\u304C\u8FD4\u3055\u308C\u307E\u3057\u305F\u3002V2EX \u3067\u30ED\u30B0\u30A4\u30F3\u3084\u8A8D\u8A3C\u3092\u5B8C\u4E86\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
      "\uC608\uC0C1\uD558\uC9C0 \uBABB\uD55C \uD398\uC774\uC9C0\uC785\uB2C8\uB2E4. V2EX\uC5D0\uC11C \uB85C\uADF8\uC778 \uB610\uB294 \uC778\uC99D\uC744 \uBA3C\uC800 \uC644\uB8CC\uD558\uC138\uC694."
    ],
    invalidClient: [
      "Invalid Imgur Client ID.",
      "Imgur Client ID \u65E0\u6548\u3002",
      "Imgur Client ID \u304C\u7121\u52B9\u3067\u3059\u3002",
      "Imgur Client ID\uAC00 \uC798\uBABB\uB418\uC5C8\uC2B5\uB2C8\uB2E4."
    ],
    imageFormat: [
      "Use a PNG, JPEG, GIF or WebP image up to 10 MB.",
      "\u8BF7\u9009\u62E9\u4E0D\u8D85\u8FC7 10 MB \u7684 PNG\u3001JPEG\u3001GIF \u6216 WebP \u56FE\u7247\u3002",
      "PNG\u3001JPEG\u3001GIF\u3001WebP \u306E\u753B\u50CF\u3092 10 MB \u4EE5\u4E0B\u3067\u9078\u3093\u3067\u304F\u3060\u3055\u3044\u3002",
      "10 MB \uC774\uD558\uC758 PNG, JPEG, GIF \uB610\uB294 WebP \uC774\uBBF8\uC9C0\uB97C \uC0AC\uC6A9\uD558\uC138\uC694."
    ],
    imgurRateLimit: [
      "Imgur rate limit reached. Upload queue paused.",
      "\u5DF2\u8FBE\u5230 Imgur \u9650\u6D41\u9608\u503C\uFF0C\u4E0A\u4F20\u961F\u5217\u5DF2\u6682\u505C\u3002",
      "Imgur \u306E\u5229\u7528\u5236\u9650\u306B\u9054\u3057\u305F\u305F\u3081\u3001\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u3092\u4E00\u6642\u505C\u6B62\u3057\u307E\u3057\u305F\u3002",
      "Imgur \uC0AC\uC6A9 \uD55C\uB3C4\uC5D0 \uB3C4\uB2EC\uD558\uC5EC \uC5C5\uB85C\uB4DC \uB300\uAE30\uC5F4\uC744 \uC77C\uC2DC \uC911\uC9C0\uD588\uC2B5\uB2C8\uB2E4."
    ],
    imgurHTTP: [
      "Imgur upload failed (HTTP {0}).",
      "Imgur \u4E0A\u4F20\u5931\u8D25\uFF08HTTP {0}\uFF09\u3002",
      "Imgur \u3078\u306E\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u306B\u5931\u6557\u3057\u307E\u3057\u305F\uFF08HTTP {0}\uFF09\u3002",
      "Imgur \uC5C5\uB85C\uB4DC \uC2E4\uD328(HTTP {0})."
    ],
    imgurNetwork: [
      "Imgur network error.",
      "Imgur \u7F51\u7EDC\u8BF7\u6C42\u5931\u8D25\u3002",
      "Imgur \u3078\u306E\u63A5\u7D9A\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002",
      "Imgur \uB124\uD2B8\uC6CC\uD06C \uC624\uB958\uC785\uB2C8\uB2E4."
    ],
    imgurTimeout: [
      "Imgur upload timed out. Check Imgur before retrying.",
      "Imgur \u4E0A\u4F20\u8D85\u65F6\uFF0C\u91CD\u8BD5\u524D\u8BF7\u5148\u68C0\u67E5\u662F\u5426\u5DF2\u4E0A\u4F20\u3002",
      "Imgur \u3078\u306E\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u304C\u30BF\u30A4\u30E0\u30A2\u30A6\u30C8\u3057\u307E\u3057\u305F\u3002\u518D\u8A66\u884C\u3059\u308B\u524D\u306B Imgur \u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
      "Imgur \uC5C5\uB85C\uB4DC \uC2DC\uAC04\uC774 \uCD08\uACFC\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uB2E4\uC2DC \uC2DC\uB3C4\uD558\uAE30 \uC804\uC5D0 Imgur\uB97C \uD655\uC778\uD558\uC138\uC694."
    ],
    imgurAborted: [
      "Imgur upload aborted.",
      "Imgur \u4E0A\u4F20\u5DF2\u4E2D\u6B62\u3002",
      "Imgur \u3078\u306E\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u3092\u4E2D\u6B62\u3057\u307E\u3057\u305F\u3002",
      "Imgur \uC5C5\uB85C\uB4DC\uAC00 \uC911\uB2E8\uB418\uC5C8\uC2B5\uB2C8\uB2E4."
    ],
    imgurResponse: [
      "Unexpected response from Imgur.",
      "Imgur \u8FD4\u56DE\u4E86\u65E0\u6CD5\u8BC6\u522B\u7684\u54CD\u5E94\u3002",
      "Imgur \u304B\u3089\u4E88\u671F\u3057\u306A\u3044\u5FDC\u7B54\u304C\u8FD4\u3055\u308C\u307E\u3057\u305F\u3002",
      "Imgur\uC5D0\uC11C \uC608\uC0C1\uD558\uC9C0 \uBABB\uD55C \uC751\uB2F5\uC744 \uBC1B\uC558\uC2B5\uB2C8\uB2E4."
    ],
    insertImage: [
      "Insert image",
      "\u63D2\u5165\u56FE\u7247",
      "\u753B\u50CF\u3092\u633F\u5165",
      "\uC774\uBBF8\uC9C0 \uC0BD\uC785"
    ],
    uploadToImgur: [
      "Upload images to public Imgur hosting",
      "\u5C06\u56FE\u7247\u4E0A\u4F20\u81F3 Imgur \u516C\u5F00\u56FE\u5E8A",
      "\u753B\u50CF\u3092 Imgur \u306B\u516C\u958B\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9",
      "\uC774\uBBF8\uC9C0\uB97C Imgur\uC5D0 \uACF5\uAC1C \uC5C5\uB85C\uB4DC"
    ],
    uploadPaused: [
      "Imgur uploads paused after rate limiting. Try again later.",
      "\u56E0 Imgur \u9650\u6D41\u6682\u505C\u4E0A\u4F20\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5\u3002",
      "Imgur \u306E\u5229\u7528\u5236\u9650\u306B\u3088\u308A\u4E00\u6642\u505C\u6B62\u4E2D\u3067\u3059\u3002\u5F8C\u3067\u3082\u3046\u4E00\u5EA6\u304A\u8A66\u3057\u304F\u3060\u3055\u3044\u3002",
      "Imgur \uC0AC\uC6A9 \uD55C\uB3C4\uB85C \uC5C5\uB85C\uB4DC\uAC00 \uC911\uC9C0\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uB098\uC911\uC5D0 \uB2E4\uC2DC \uC2DC\uB3C4\uD558\uC138\uC694."
    ],
    queueLimit: [
      "Queue limit: 10 images. Wait for current uploads to finish.",
      "\u961F\u5217\u6700\u591A 10 \u5F20\u56FE\u7247\uFF0C\u8BF7\u7B49\u5F85\u5F53\u524D\u4E0A\u4F20\u7ED3\u675F\u3002",
      "\u5F85\u6A5F\u3067\u304D\u308B\u753B\u50CF\u306F\u6700\u5927 10 \u679A\u3067\u3059\u3002\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u306E\u5B8C\u4E86\u3092\u304A\u5F85\u3061\u304F\u3060\u3055\u3044\u3002",
      "\uB300\uAE30\uC5F4\uC740 \uCD5C\uB300 10\uAC1C \uC774\uBBF8\uC9C0\uAE4C\uC9C0 \uC9C0\uC6D0\uD569\uB2C8\uB2E4. \uC9C4\uD589 \uC911\uC778 \uC5C5\uB85C\uB4DC\uAC00 \uB05D\uB0A0 \uB54C\uAE4C\uC9C0 \uAE30\uB2E4\uB9AC\uC138\uC694."
    ],
    pastedImage: [
      "Pasted image",
      "\u7C98\u8D34\u7684\u56FE\u7247",
      "\u8CBC\u308A\u4ED8\u3051\u305F\u753B\u50CF",
      "\uBD99\uC5EC\uB123\uC740 \uC774\uBBF8\uC9C0"
    ],
    queued: [
      "{0}: queued",
      "{0}\uFF1A\u7B49\u5F85\u4E0A\u4F20",
      "{0}\uFF1A\u5F85\u6A5F\u4E2D",
      "{0}: \uB300\uAE30 \uC911"
    ],
    cancelQueued: [
      "Queued upload cancelled after rate limiting.",
      "\u56E0\u9650\u6D41\u5DF2\u53D6\u6D88\u8BE5\u6392\u961F\u4E0A\u4F20\u3002",
      "\u5229\u7528\u5236\u9650\u306B\u3088\u308A\u5F85\u6A5F\u4E2D\u306E\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u3092\u53D6\u308A\u6D88\u3057\u307E\u3057\u305F\u3002",
      "\uC0AC\uC6A9 \uD55C\uB3C4\uB85C \uB300\uAE30 \uC911\uC778 \uC5C5\uB85C\uB4DC\uAC00 \uCDE8\uC18C\uB418\uC5C8\uC2B5\uB2C8\uB2E4."
    ],
    uploading: [
      "{0}: uploading\u2026",
      "{0}\uFF1A\u4E0A\u4F20\u4E2D\u2026",
      "{0}\uFF1A\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u4E2D\u2026",
      "{0}: \uC5C5\uB85C\uB4DC \uC911\u2026"
    ],
    uploaded: [
      "Uploaded: ",
      "\u5DF2\u4E0A\u4F20\uFF1A",
      "\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u5B8C\u4E86\uFF1A",
      "\uC5C5\uB85C\uB4DC \uC644\uB8CC: "
    ],
    draftMarkerRemoved: [
      "Draft marker removed. Copy the URL: ",
      "\u8349\u7A3F\u5360\u4F4D\u7B26\u5DF2\u79FB\u9664\uFF0C\u8BF7\u590D\u5236\u94FE\u63A5\uFF1A",
      "\u4E0B\u66F8\u304D\u306E\u633F\u5165\u4F4D\u7F6E\u304C\u524A\u9664\u3055\u308C\u307E\u3057\u305F\u3002URL \u3092\u30B3\u30D4\u30FC\u3057\u3066\u304F\u3060\u3055\u3044\uFF1A",
      "\uCD08\uC548\uC758 \uC790\uB9AC \uD45C\uC2DC\uC790\uAC00 \uC0AD\uC81C\uB418\uC5C8\uC2B5\uB2C8\uB2E4. URL\uC744 \uBCF5\uC0AC\uD558\uC138\uC694: "
    ],
    saveDelete: [
      "Save deletion link",
      "\u4FDD\u5B58\u5220\u9664\u94FE\u63A5",
      "\u524A\u9664\u30EA\u30F3\u30AF\u3092\u4FDD\u5B58",
      "\uC0AD\uC81C \uB9C1\uD06C \uC800\uC7A5"
    ],
    uploadRecordFailed: [
      "Could not save upload history. Save the deletion link before leaving.",
      "\u65E0\u6CD5\u4FDD\u5B58\u4E0A\u4F20\u8BB0\u5F55\uFF0C\u79BB\u5F00\u524D\u8BF7\u4FDD\u5B58\u5220\u9664\u94FE\u63A5\u3002",
      "\u5C65\u6B74\u3092\u4FDD\u5B58\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u3053\u306E\u30DA\u30FC\u30B8\u3092\u96E2\u308C\u308B\u524D\u306B\u524A\u9664\u30EA\u30F3\u30AF\u3092\u4FDD\u5B58\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
      "\uC5C5\uB85C\uB4DC \uAE30\uB85D\uC744 \uC800\uC7A5\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uD398\uC774\uC9C0\uB97C \uB5A0\uB098\uAE30 \uC804\uC5D0 \uC0AD\uC81C \uB9C1\uD06C\uB97C \uC800\uC7A5\uD558\uC138\uC694."
    ],
    selectAgain: [
      "Select the file again to retry.",
      "\u5982\u9700\u91CD\u8BD5\uFF0C\u8BF7\u91CD\u65B0\u9009\u62E9\u6587\u4EF6\u3002",
      "\u518D\u8A66\u884C\u3059\u308B\u306B\u306F\u30D5\u30A1\u30A4\u30EB\u3092\u9078\u629E\u3057\u76F4\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
      "\uB2E4\uC2DC \uC2DC\uB3C4\uD558\uB824\uBA74 \uD30C\uC77C\uC744 \uB2E4\uC2DC \uC120\uD0DD\uD558\uC138\uC694."
    ],
    finishUploads: [
      "Wait for uploads or remove unfinished upload markers before submitting.",
      "\u63D0\u4EA4\u524D\u8BF7\u7B49\u5F85\u4E0A\u4F20\u5B8C\u6210\uFF0C\u6216\u79FB\u9664\u5C1A\u672A\u5B8C\u6210\u7684\u4E0A\u4F20\u5360\u4F4D\u7B26\u3002",
      "\u9001\u4FE1\u524D\u306B\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u306E\u5B8C\u4E86\u3092\u5F85\u3064\u304B\u3001\u672A\u5B8C\u4E86\u306E\u633F\u5165\u4F4D\u7F6E\u3092\u524A\u9664\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
      "\uC81C\uCD9C\uD558\uAE30 \uC804\uC5D0 \uC5C5\uB85C\uB4DC\uB97C \uAE30\uB2E4\uB9AC\uAC70\uB098 \uC644\uB8CC\uB418\uC9C0 \uC54A\uC740 \uC790\uB9AC \uD45C\uC2DC\uC790\uB97C \uC0AD\uC81C\uD558\uC138\uC694."
    ]
  };
  var DEFAULT_LANGUAGE = "zh";
  var LANGUAGE_NAMES = Object.freeze({
    zh: "\u7B80\u4F53\u4E2D\u6587",
    en: "English",
    ja: "\u65E5\u672C\u8A9E",
    ko: "\uD55C\uAD6D\uC5B4"
  });
  var preference = DEFAULT_LANGUAGE;
  function setLanguage(language) {
    preference = language;
  }
  function siteLocale(doc = globalThis.document) {
    const cookie = /(?:^|;\s*)V2EX_LANG=([^;]*)/i.exec(doc?.cookie ?? "")?.[1];
    const locale = (cookie ?? doc?.documentElement.lang ?? "").toLowerCase();
    if (/^en(?:us|[-_]|$)/.test(locale)) return "en";
    if (/^ja(?:jp|[-_]|$)/.test(locale)) return "ja";
    if (/^ko(?:kr|[-_]|$)/.test(locale)) return "ko";
    return "zh";
  }
  function interfaceLanguage() {
    return preference === "site" ? siteLocale() : preference;
  }
  function t(key, ...args) {
    const index = { en: 0, zh: 1, ja: 2, ko: 3 }[interfaceLanguage()];
    return messages[key][index].replace(/\{(\d+)\}/g, (_, i) => args[Number(i)] ?? "");
  }

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
  async function detectOverflow(state, options) {
    var _await$platform$isEle;
    if (options === void 0) {
      options = {};
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
    } = evaluate(options, state);
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
  var flip = function(options) {
    if (options === void 0) {
      options = {};
    }
    return {
      name: "flip",
      options,
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
        } = evaluate(options, state);
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
  async function convertValueToCoords(state, options) {
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
    const rawValue = evaluate(options, state);
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
  var offset = function(options) {
    if (options === void 0) {
      options = 0;
    }
    return {
      name: "offset",
      options,
      async fn(state) {
        var _middlewareData$offse, _middlewareData$arrow;
        const {
          x,
          y,
          placement,
          middlewareData
        } = state;
        const diffCoords = await convertValueToCoords(state, options);
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
  var shift = function(options) {
    if (options === void 0) {
      options = {};
    }
    return {
      name: "shift",
      options,
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
        } = evaluate(options, state);
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
  var computePosition2 = (reference, floating, options) => {
    const cache = /* @__PURE__ */ new Map();
    const mergedOptions = options != null ? options : {};
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
  function isV2EXPage(doc) {
    return Boolean(doc?.querySelector("#Top") && doc.querySelector("#Main"));
  }
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
    const close = button(t("close"), closeModal);
    close.classList.add("v2p-modal-close-btn");
    close.append(element("kbd", "Esc"));
    close.setAttribute("aria-label", `${t("close")} ${title}`);
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
        if (url.origin !== location.origin) throw new Error(t("requestOrigin"));
        const response = await fetcher(url.href, {
          credentials: "same-origin",
          signal: AbortSignal.timeout(15e3)
        });
        if (!response.ok) throw new Error(t("requestHTTP", response.status));
        const final = new URL(response.url || url.href);
        const rewardRedirect = url.pathname === "/mission/daily/redeem" && final.pathname === "/mission/daily";
        if (final.origin !== url.origin || final.pathname !== url.pathname && !rewardRedirect)
          throw new Error(t("requestRedirected"));
        const doc = new DOMParser().parseFromString(await response.text(), "text/html");
        if (!doc.querySelector("#Main")) throw new Error(t("requestUnexpected"));
        syncOnce(doc);
        return doc;
      });
      tail = task.catch(() => {
      });
      return task;
    };
  }

  // src/emoji.js
  var groupLabels = {
    "\u6D41\u884C": "emojiPopular",
    "\u5C0F\u9EC4\u8138": "emojiFaces",
    "\u624B\u52BF": "emojiGestures",
    "\u5E86\u795D": "emojiCelebration",
    "\u5176\u4ED6": "emojiOther"
  };
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
  function initEmoji(options) {
    const textarea = document.querySelector(
      'textarea#reply_content, #reply-box textarea, textarea[name="content"]'
    );
    if (!textarea || !options.emoji) return;
    const submit = textarea.form?.querySelector('input[type="submit"],button[type="submit"]');
    if (!submit) return;
    const trigger = owned(button("", () => {
    }));
    trigger.setAttribute("aria-label", t("insertEmoji"));
    trigger.title = t("insertEmoji");
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
          const title = groupLabels[group.title] ? t(groupLabels[group.title]) : group.title;
          section.append(element("div", title, "v2p-emoji-title"), list);
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
  var TAG_LIMITS = Object.freeze({ perMember: 20, length: 80, importMembers: 2e4 });
  var DEFAULTS = Object.freeze({
    language: DEFAULT_LANGUAGE,
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
    autoFold: true,
    imgurClientId: ""
  });
  var validName = /^[a-z0-9_-]{1,64}$/i;
  function normalizeOptions(input = {}) {
    const output = { ...DEFAULTS };
    if (!input || typeof input !== "object") return output;
    if (typeof input.language === "string" && (input.language === "site" || Object.hasOwn(LANGUAGE_NAMES, input.language))) {
      output.language = input.language;
    }
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
    if (!Array.isArray(raw) || raw.length > TAG_LIMITS.perMember)
      throw new Error(t("tagLimit", TAG_LIMITS.perMember));
    const result = [];
    for (const item of raw) {
      const text = typeof item === "string" ? item.trim() : item?.name?.trim?.();
      if (typeof text !== "string" || text.length > TAG_LIMITS.length)
        throw new Error(t("tagFormat", TAG_LIMITS.length));
      if (text && !result.includes(text)) result.push(text);
    }
    return result;
  }
  function parseImport(text) {
    if (text.length > 2e6) throw new Error(t("backupSize"));
    const data = JSON.parse(text.replace(/^V2EX_Polish_settings\s*/, ""));
    if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error(t("backupFormat"));
    if (data.schema !== void 0 && data.schema !== 1) throw new Error(t("backupVersion"));
    const source = data.members ?? data["member-tag"];
    if (!source || typeof source !== "object" || Array.isArray(source))
      throw new Error(t("backupNoTags"));
    const entries = Object.entries(source);
    if (entries.length > TAG_LIMITS.importMembers)
      throw new Error(t("backupTooMany", TAG_LIMITS.importMembers.toLocaleString("en")));
    const members = /* @__PURE__ */ Object.create(null);
    for (const [name, entry] of entries) {
      if (!validName.test(name)) throw new Error(`${t("badUsername")} ${name}`);
      members[name.toLowerCase()] = normalizeTags(
        Array.isArray(entry) || typeof entry === "string" ? entry : entry?.tags
      );
    }
    return { members, options: data.schema === 1 ? normalizeOptions(data.options) : null };
  }
  function createStorage(api) {
    const cache = /* @__PURE__ */ new Map();
    const memberPrefix = `${PREFIX}member:`;
    const keyFor = (name) => memberPrefix + name.toLowerCase();
    const memberKeys = () => api.keys().filter((key) => key.startsWith(memberPrefix));
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
      taggedMembers() {
        return memberKeys().map((key) => ({
          name: key.slice(memberPrefix.length),
          tags: normalizeTags(api.get(key, []))
        })).filter(({ name, tags }) => validName.test(name) && tags.length).sort((a, b) => a.name.localeCompare(b.name));
      },
      setTags(name, value) {
        if (!validName.test(name)) throw new Error(t("badUsername"));
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
        for (const key of memberKeys()) members[key.slice(memberPrefix.length)] = api.get(key);
        const { imgurClientId: _clientId, ...options } = this.options();
        return JSON.stringify(
          { schema: 1, exportedAt: (/* @__PURE__ */ new Date()).toISOString(), options, members },
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
      removeUpload(id) {
        if (typeof id !== "string" || !/^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/i.test(id))
          throw new Error(t("removeUploadFailed"));
        api.delete(`${PREFIX}upload:${id}`);
      },
      uploads() {
        return api.keys().filter((key) => key.startsWith(`${PREFIX}upload:`)).map((key) => api.get(key)).filter(Boolean).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      }
    };
  }

  // src/member-data.js
  function parseMemberTopics(doc) {
    const topics = [];
    for (const row of [...doc.querySelectorAll(".cell.item")].slice(0, 5)) {
      const link = row.querySelector(".item_title .topic-link");
      if (!link?.textContent.trim()) continue;
      try {
        const url = new URL(link.getAttribute("href"), location.href);
        if (url.origin === location.origin && /^\/t\/\d+\/?$/.test(url.pathname))
          topics.push({ title: link.textContent.trim(), url: url.href });
      } catch {
      }
    }
    return topics;
  }
  async function fetchMemberPage(name, signal, fetcher = fetch) {
    if (!/^[a-z0-9_-]{1,64}$/i.test(name)) throw new Error(t("badUsername"));
    const path = `/member/${encodeURIComponent(name)}`;
    const response = await fetcher(path, { credentials: "same-origin", signal, cache: "no-store" });
    const final = new URL(response.url || path, location.href);
    if (!response.ok || final.origin !== location.origin || final.pathname.toLowerCase() !== path.toLowerCase())
      throw new Error(t("memberPageFailed"));
    const doc = new DOMParser().parseFromString(await response.text(), "text/html");
    if (!doc.querySelector("#Main")) throw new Error(t("memberPageUnexpected"));
    syncOnce(doc);
    return doc;
  }
  async function fetchMember(name, signal, fetcher = fetch) {
    const [data, page] = await Promise.all([
      fetcher(`/api/members/show.json?username=${encodeURIComponent(name)}`, {
        credentials: "same-origin",
        signal
      }).then(async (response) => {
        if (!response.ok) {
          const error = new Error(
            response.status === 404 ? t("memberMissing") : t("memberFetchFailed")
          );
          error.status = response.status;
          throw error;
        }
        const result = await response.json();
        if (typeof result.username !== "string" || result.username.toLowerCase() !== name.toLowerCase())
          throw new Error(t("memberMismatch"));
        return result;
      }),
      fetchMemberPage(name, signal, fetcher).catch((error) => {
        if (signal.aborted) throw error;
        return null;
      })
    ]);
    return { ...data, topics: page ? parseMemberTopics(page) : [] };
  }
  function blockPath(doc) {
    for (const control of doc.querySelectorAll(
      '#Main input[type="button"][onclick], #Main button[onclick]'
    )) {
      const path = /location\.href\s*=\s*['"](\/block\/\d+\?once=\d+)['"]/.exec(
        control.getAttribute("onclick")
      )?.[1];
      if (path) return path;
    }
    return null;
  }
  async function blockMember(name, fetcher = fetch) {
    const signal = AbortSignal.timeout(1e4);
    const page = await fetchMemberPage(name, signal, fetcher);
    const path = blockPath(page);
    if (!path) throw new Error(t("blockUnavailable"));
    const response = await fetcher(path, { credentials: "same-origin", signal });
    const final = new URL(response.url || path, location.href);
    if (!response.ok || final.origin !== location.origin || ![path.split("?")[0], `/member/${name}`].includes(final.pathname))
      throw new Error(t("blockFailed"));
    const result = new DOMParser().parseFromString(await response.text(), "text/html");
    syncOnce(result);
    const verified = await fetchMemberPage(name, signal, fetcher);
    if (blockPath(verified)) throw new Error(t("blockUnconfirmed"));
  }

  // src/members.js
  function createMembers(store, options, topics, currentAccount) {
    const registered = /* @__PURE__ */ new WeakSet(), byName = /* @__PURE__ */ new Map();
    function updateTags(name, tags) {
      store.setTags(name, tags);
      draw(name);
    }
    function createTagEditor(name, onSave, tags = store.getTags(name)) {
      const form = element("div", void 0, "v2p-tag-input-wrapper");
      const meta = element("div", void 0, "vx-tag-editor-meta");
      const count = element("span", void 0, "vx-tag-editor-count");
      const box = element("div", void 0, "vx-tag-input");
      const fields = element("div", void 0, "vx-tag-fields");
      const hint = element("p", t("tagInstructions"));
      hint.id = `vx-tag-hint-${crypto.randomUUID()}`;
      const input = element("textarea");
      input.rows = 1;
      input.placeholder = t("tagEntry");
      input.setAttribute("aria-label", t("addTag"));
      input.setAttribute("aria-describedby", hint.id);
      const entry = element("div", void 0, "vx-tag-entry");
      const error = element("p");
      error.setAttribute("role", "alert");
      function syncLabels() {
        count.textContent = t("tagUsage", fields.childElementCount, TAG_LIMITS.perMember);
        [...fields.children].forEach((row, index) => {
          row.querySelector("textarea").setAttribute("aria-label", t("editableTag", index + 1));
        });
      }
      function showTags(values) {
        fields.replaceChildren();
        for (const tag of values) {
          let updateLabels = function(value) {
            edit2.textContent = value;
            edit2.title = value;
            edit2.setAttribute("aria-label", t("editTagValue", value));
            remove.setAttribute("aria-label", t("removeTagValue", value));
          }, finish = function(commit) {
            if (field.hidden) return;
            const value = commit && field.value.trim() || field.defaultValue;
            field.defaultValue = field.value = value;
            field.hidden = true;
            edit2.hidden = false;
            row.classList.remove("vx-tag-field-editing");
            updateLabels(value);
          };
          const row = element("div", void 0, "vx-tag-field");
          const field = element("textarea");
          field.rows = 1;
          field.defaultValue = tag;
          field.maxLength = TAG_LIMITS.length;
          field.hidden = true;
          const edit2 = button(tag, () => {
            edit2.hidden = true;
            row.classList.add("vx-tag-field-editing");
            field.hidden = false;
            field.focus();
            field.select();
          });
          edit2.className = "vx-tag-edit-value";
          const remove = button("\xD7", () => {
            const next = row.nextElementSibling ?? row.previousElementSibling;
            row.remove();
            syncLabels();
            error.textContent = "";
            (next?.querySelector(".vx-tag-edit-value") ?? input).focus();
          });
          remove.className = "vx-tag-remove-value";
          field.addEventListener("blur", () => finish(true));
          field.addEventListener("keydown", (event) => {
            if (event.isComposing || event.key !== "Enter" && event.key !== "Escape") return;
            event.preventDefault();
            event.stopPropagation();
            finish(event.key === "Enter");
            edit2.focus();
          });
          updateLabels(tag);
          row.append(edit2, field, remove);
          fields.append(row);
        }
        syncLabels();
      }
      function readTags() {
        const values = [...fields.querySelectorAll("textarea")].map(
          (field) => field.value.trim() || field.defaultValue
        );
        values.push(...input.value.split(/[,\uFF0C\n]/).map((tag) => tag.trim()));
        return normalizeTags([...new Set(values.filter(Boolean))]);
      }
      const add = button("+", () => {
        if (!input.value.trim()) {
          input.focus();
          return;
        }
        try {
          showTags(readTags());
          input.value = "";
          error.textContent = "";
        } catch (cause) {
          error.textContent = cause.message;
        }
        input.focus();
      });
      add.className = "vx-tag-add";
      add.title = t("addTag");
      add.setAttribute("aria-label", add.title);
      const save = button(t("saveTags"), () => {
        try {
          updateTags(name, readTags());
        } catch (cause) {
          error.textContent = cause.message;
          return;
        }
        onSave();
      });
      save.classList.add("special");
      input.addEventListener("keydown", (event) => {
        if (event.isComposing || event.ctrlKey || event.metaKey || event.altKey) return;
        if (![",", "\uFF0C", "Enter"].includes(event.key) || event.key === "Enter" && event.shiftKey)
          return;
        event.preventDefault();
        add.click();
      });
      input.addEventListener("paste", (event) => {
        const text = event.clipboardData?.getData("text");
        if (!text || !/[,\uFF0C\r\n]/.test(text)) return;
        event.preventDefault();
        input.setRangeText(text, input.selectionStart, input.selectionEnd, "end");
        add.click();
      });
      form.addEventListener("input", () => error.textContent = "");
      showTags(tags);
      entry.append(input, add);
      box.append(fields, entry);
      meta.append(hint, count);
      form.append(box, meta, error);
      return { form, input, save };
    }
    function edit(name) {
      const dialog = modal(t("editTags", name), true);
      dialog.root.classList.add("vx-tag-editor-dialog");
      const { form, input, save } = createTagEditor(name, dialog.close);
      dialog.content.append(form);
      dialog.footer.append(save);
      input.focus();
    }
    function draw(name, only) {
      const groups = byName.get(name.toLowerCase());
      for (const group of only ? [only] : groups ?? []) {
        if (!group.isConnected) {
          groups?.delete(group);
          continue;
        }
        const tags = store.getTags(name);
        group.replaceChildren();
        if (tags.length)
          group.append(element("b", "#"), element("span", tags.join("\uFF0C"), "vx-tags-text"));
        group.title = tags.join("\uFF0C");
        group.hidden = !tags.length;
      }
    }
    function enhance(root) {
      if (!options.tags) return;
      for (const link of matching(root, 'strong a[href^="/member/"], .header a[href^="/member/"]')) {
        const name = memberName(link);
        const topicInfo = link.closest(".topic_info");
        if (!name || !link.textContent.trim() || registered.has(link) || link.closest("[data-vx-owned],#Rightbar,#Bottom") || topicInfo && topicInfo.querySelector('strong a[href^="/member/"]') !== link)
          continue;
        registered.add(link);
        const key = name.toLowerCase();
        const group = owned(
          element("div", void 0, "vx-tags v2p-reply-tags v2p-reply-tags-inline")
        );
        group.setAttribute("role", "button");
        group.tabIndex = 0;
        group.setAttribute("aria-label", t("editTags", name));
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
          store.watchTags(name, () => draw(name));
        }
        byName.get(key).add(group);
        draw(name, group);
      }
    }
    if (options.userCards || options.tags) initCards();
    function initCards() {
      const cache = /* @__PURE__ */ new Map();
      const popup = owned(element("div", void 0, "v2p-popup vx-member-popup"));
      popup.hidden = true;
      const content = element("div", void 0, "v2p-popup-content");
      popup.append(content);
      (document.querySelector("#Wrapper") ?? document.body).append(popup);
      let timer, closeTimer, active, controller, sequence = 0;
      function hide2() {
        clearTimeout(timer);
        clearTimeout(closeTimer);
        controller?.abort();
        popup.hidden = true;
        active = null;
        sequence++;
      }
      function render(name, data = null, initialAvatar) {
        const card = element("div", void 0, "v2p-member-card");
        const info = element("div", void 0, "v2p-info"), left = element("div", void 0, "v2p-info-left"), right = element("div", void 0, "v2p-info-right");
        const avatar = safeURL(
          data?.avatar_large ?? data?.avatar_normal ?? initialAvatar,
          location.href,
          true
        );
        const avatarLink = element("a", void 0, "v2p-avatar-box");
        avatarLink.href = `/member/${name}`;
        if (avatar) {
          const image = element("img", void 0, "v2p-avatar");
          image.src = avatar;
          image.alt = name;
          avatarLink.append(image);
        }
        left.append(avatarLink);
        const username = element("div", void 0, "v2p-username"), link = element("a", name);
        link.href = `/member/${name}`;
        for (const target of [avatarLink, link]) {
          target.target = options.newTab ? "_blank" : "_self";
          target.rel = "noopener noreferrer";
        }
        username.append(link);
        const number = element("div", data ? t("memberNumber", data.id) : "", "v2p-no");
        const created = new Date(Number(data?.created) * 1e3);
        const date = data && Number.isFinite(created.getTime()) ? `${created.getFullYear()}-${String(created.getMonth() + 1).padStart(2, "0")}-${String(created.getDate()).padStart(2, "0")}` : "";
        const joined = element("div", date ? t("joined", date) : "", "v2p-created-date");
        if (!data) {
          number.classList.add("v2p-loading");
          joined.classList.add("v2p-loading");
        }
        right.append(username, number, joined);
        const days = Math.ceil((Date.now() / 1e3 - Number(data?.created)) / 86400);
        if (data && days >= 0 && days <= 30) {
          const recent = element("div", t("recentMember", days <= 15 ? 15 : 30), "v2p-register-days");
          recent.style.margin = "5px 0";
          right.append(recent);
        }
        info.append(left, right);
        card.append(info);
        if (data?.bio?.trim()) card.append(element("div", data.bio, "v2p-bio"));
        if (data?.topics?.length) {
          const section = element("div", void 0, "v2p-member-topics");
          const list = element("div", void 0, "v2p-member-topics-list");
          section.append(element("div", t("recentTopics"), "v2p-member-topics-header"), list);
          for (const topic of data.topics) {
            const row = element("div", void 0, "v2p-member-topic-item-row");
            const topicLink = element("a", topic.title, "v2p-member-topic-item");
            topicLink.href = topic.url;
            topicLink.title = topic.title;
            topicLink.target = options.newTab ? "_blank" : "_self";
            topicLink.rel = "noopener noreferrer";
            row.append(topicLink);
            list.append(row);
          }
          card.append(section);
          topics?.enhance(section);
        }
        const actions = element("div", void 0, "v2p-member-card-actions");
        if (options.tags) {
          const control = button(t("addTags"), () => {
            hide2();
            edit(name);
          });
          control.classList.add("v2p-btn-small");
          actions.append(control);
        }
        const block = button(t("blockMember"), async () => {
          if (block.disabled || !window.confirm(t("confirmBlock", name))) return;
          block.disabled = true;
          block.classList.add("v2p-btn-loading");
          block.textContent = t("blocking");
          try {
            await blockMember(name);
            for (const row of document.querySelectorAll('.cell[id^="r_"]')) {
              if (!row.closest("#Main") || memberName(row.querySelector('strong a[href^="/member/"]'))?.toLowerCase() !== name.toLowerCase())
                continue;
              if (row.querySelector(":scope > .v2p-blocked-notice")) continue;
              row.classList.add("v2p-blocked-reply");
              const notice = owned(element("div", `${t("blocked")} \xB7 `, "v2p-blocked-notice"));
              const toggle = element("a", t("show"), "v2p-blocked-toggle");
              toggle.tabIndex = 0;
              toggle.setAttribute("role", "button");
              const reveal = () => {
                const visible = row.classList.toggle("v2p-blocked-revealed");
                toggle.textContent = visible ? t("hide") : t("show");
              };
              toggle.addEventListener("click", reveal);
              toggle.addEventListener("keydown", (event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  reveal();
                }
              });
              notice.append(toggle);
              row.prepend(notice);
            }
            hide2();
          } catch (error) {
            block.disabled = false;
            block.classList.remove("v2p-btn-loading");
            block.textContent = t("blockMember");
            content.append(element("p", error.message));
          }
        });
        block.classList.add("v2p-btn-small");
        if (currentAccount && currentAccount.toLowerCase() !== name.toLowerCase())
          actions.append(block);
        if (actions.childElementCount) card.append(actions);
        content.replaceChildren(card);
      }
      function position(anchor) {
        const request = sequence;
        void computePosition2(anchor, popup, {
          placement: "right-start",
          middleware: [offset2({ mainAxis: 8, crossAxis: -4 }), flip2(), shift2({ padding: 8 })]
        }).then(({ x, y }) => {
          if (request !== sequence) return;
          popup.style.left = `${x}px`;
          popup.style.top = `${y}px`;
        }).catch(() => {
          if (request === sequence) hide2();
        });
      }
      document.addEventListener("pointerover", (event) => {
        if (popup.contains(event.target)) {
          clearTimeout(closeTimer);
          return;
        }
        if (event.target.closest?.(".v2p-modal-mask")) return;
        const link = event.target.closest?.('a[href^="/member/"]'), image = event.target.closest?.("img.avatar");
        const name = memberName(link) ?? (/^[a-z0-9_-]{1,64}$/i.test(image?.alt ?? "") ? image.alt : null), anchor = link ?? image;
        if (!name || !anchor || anchor === active) return;
        hide2();
        active = anchor;
        const request = sequence;
        timer = setTimeout(async () => {
          const initialAvatar = image?.src ?? link?.querySelector("img")?.src ?? anchor.closest(".cell,.header,.box")?.querySelector("img.avatar")?.src;
          render(name, null, initialAvatar);
          popup.hidden = false;
          position(anchor);
          if (!options.userCards) return;
          const key = name.toLowerCase(), cached = cache.get(key);
          if (cached?.expires > Date.now()) {
            if (cached.banned) content.replaceChildren(element("span", t("memberMissing")));
            else render(name, cached.data, initialAvatar);
            position(anchor);
            return;
          }
          const task = new AbortController();
          controller = task;
          const timeout = setTimeout(() => task.abort(), 1e4);
          try {
            const data = await fetchMember(name, task.signal);
            if (request !== sequence || task.signal.aborted) return;
            if (cache.size >= 100) cache.delete(cache.keys().next().value);
            cache.set(key, { data, expires: Date.now() + 6e5 });
            render(name, data, initialAvatar);
            position(anchor);
          } catch (error) {
            task.abort();
            if (request !== sequence) return;
            if (error.status === 404) {
              if (cache.size >= 100) cache.delete(cache.keys().next().value);
              cache.set(key, { banned: true, expires: Date.now() + 6e5 });
            }
            content.replaceChildren(
              element("span", error.name === "AbortError" ? t("memberTimeout") : error.message)
            );
          } finally {
            clearTimeout(timeout);
            if (controller === task) controller = null;
          }
        }, 350);
      });
      document.addEventListener("pointerout", (event) => {
        if (!active || !active.contains(event.target) && !popup.contains(event.target)) return;
        if (event.relatedTarget && (popup.contains(event.relatedTarget) || active.contains(event.relatedTarget)))
          return;
        closeTimer = setTimeout(hide2, 350);
      });
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") hide2();
      });
      window.addEventListener("scroll", hide2, { passive: true });
    }
    return { enhance, edit, createTagEditor, updateTags };
  }

  // src/folding.js
  var readableHeight = 250;
  var foldThreshold = 550 - readableHeight;
  function createReplyFolding(enabled = true, doc = document) {
    const view = doc.defaultView, watched = /* @__PURE__ */ new Set(), completed = /* @__PURE__ */ new WeakSet();
    if (!enabled) return { enhance() {
    }, destroy() {
    } };
    const observer = typeof view.ResizeObserver === "function" ? new view.ResizeObserver((entries) => {
      for (const { target } of entries) check(target);
    }) : null;
    function check(content) {
      if (!content.isConnected || content.parentElement?.classList.contains("v2p-reply-content"))
        return;
      if (content.getBoundingClientRect().height < foldThreshold) return;
      observer?.unobserve(content);
      watched.delete(content);
      content.removeEventListener("load", onLoad, true);
      completed.add(content);
      const wrapper = owned(element("div", void 0, "v2p-reply-content v2p-collapsed"));
      const control = button(t("expandReply"), () => {
        const collapsed = wrapper.classList.toggle("v2p-collapsed");
        control.textContent = collapsed ? t("expandReply") : t("collapseReply");
        control.setAttribute("aria-expanded", String(!collapsed));
      });
      control.classList.add("v2p-expand-btn");
      control.setAttribute("aria-expanded", "false");
      content.before(wrapper);
      wrapper.append(content, control);
    }
    function onLoad(event) {
      check(event.currentTarget);
    }
    function enhance(root) {
      const contents = new Set(matching(root, ".reply_content"));
      const parent = root.closest?.(".reply_content");
      if (parent) contents.add(parent);
      for (const content of contents) {
        if (!content.closest("#Main") || completed.has(content) || content.parentElement?.classList.contains("v2p-reply-content"))
          continue;
        if (content.textContent.length < 300 && !content.querySelector("img,pre,blockquote,ul,ol,table"))
          continue;
        if (!watched.has(content)) {
          watched.add(content);
          observer?.observe(content);
          content.addEventListener("load", onLoad, true);
        }
        check(content);
      }
    }
    function onResize() {
      for (const content of watched) {
        if (content.isConnected) check(content);
        else {
          observer?.unobserve(content);
          watched.delete(content);
        }
      }
    }
    function destroy() {
      observer?.disconnect();
      for (const content of watched) content.removeEventListener("load", onLoad, true);
      watched.clear();
      view.removeEventListener("resize", onResize);
    }
    if (!observer) view.addEventListener("resize", onResize, { passive: true });
    view.addEventListener("pagehide", (event) => {
      if (!event.persisted) destroy();
    });
    return { enhance, destroy };
  }

  // src/icons.js
  var paths = {
    "arrow-up": '<path d="m5 12 7-7 7 7M12 19V5"/>',
    "message-square": '<path d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>',
    heart: '<path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/>',
    "eye-off": '<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/>'
  };
  function icon(name) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    for (const [key, value] of Object.entries({
      width: "100%",
      height: "100%",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "2",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true"
    }))
      svg.setAttribute(key, value);
    svg.innerHTML = paths[name];
    return svg;
  }

  // src/reply-actions.js
  var REPLY = '.cell[id^="r_"]';
  var importedActions = /* @__PURE__ */ new WeakMap();
  var boundActions = /* @__PURE__ */ new WeakSet();
  function captureImportedActions(root, base) {
    for (const anchor of root.querySelectorAll("a[onclick]")) {
      if (anchor.closest(".reply_content")) continue;
      const row = anchor.closest(REPLY);
      const id = Number(/^r_(\d+)$/.exec(row?.id ?? "")?.[1]);
      if (!Number.isSafeInteger(id) || id <= 0) continue;
      const author = [...row.querySelectorAll('strong a[href^="/member/"]')].find(
        (link) => link.closest(REPLY) === row
      );
      const name = memberName(author);
      if (!name) continue;
      const source = anchor.getAttribute("onclick") ?? "";
      let kind;
      if (Number(/\bthankReply\(\s*(\d+)\s*\)/.exec(source)?.[1]) === id) kind = "thank";
      else if (Number(/\bignoreReply\(\s*(\d+)\s*,/.exec(source)?.[1]) === id) kind = "hide";
      else {
        const match = /\breplyOne\(\s*(['"])([a-z0-9_-]{1,64})\1\s*,\s*(\d+)\s*\)/i.exec(source);
        if (match && match[2].toLowerCase() === name.toLowerCase() && Number(match[3]) === id)
          kind = "reply";
      }
      if (!kind) continue;
      if (kind !== "reply" && anchor.closest(".thank_area")?.closest(REPLY) !== row) continue;
      const cost = /(?:Spend|\u82b1\u8d39)\s*(\d+)/i.exec(source)?.[1];
      const url = new URL(base);
      url.hash = row.id;
      anchor.href = url.href;
      importedActions.set(anchor, { kind, id, name, cost });
    }
  }
  function bindImportedAction(anchor, action, pageWindow) {
    if (boundActions.has(anchor)) return;
    boundActions.add(anchor);
    let pending = false;
    anchor.addEventListener("click", async (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0)
        return;
      const method = { thank: "thankReply", hide: "ignoreReply", reply: "replyOne" }[action.kind];
      if (typeof pageWindow?.[method] !== "function") return;
      event.preventDefault();
      if (pending || anchor.closest(".thank_area")?.classList.contains("thanked") && action.kind === "thank")
        return;
      if (action.kind !== "reply") {
        const prompt = action.kind === "hide" ? t("confirmHide") : action.cost ? t("confirmThank", action.cost, action.name) : t("confirmThankUnknown", action.name);
        if (!window.confirm(prompt)) return;
      }
      pending = true;
      try {
        if (action.kind === "hide") {
          const fresh = typeof pageWindow.fetchOnce === "function" ? await pageWindow.fetchOnce({ fresh: true }) : pageWindow.once;
          const token = /^\d+$/.test(String(fresh ?? "")) ? String(fresh) : String(pageWindow.once ?? "");
          if (!/^\d+$/.test(token)) throw new Error(t("accountChanged"));
          await pageWindow.ignoreReply(action.id, token);
        } else if (action.kind === "thank") {
          const result = pageWindow.thankReply(action.id);
          await (result ?? new Promise((resolve) => setTimeout(resolve, 1500)));
        } else await pageWindow.replyOne(action.name, action.id);
      } catch {
        window.alert(t("actionFailed"));
      } finally {
        pending = false;
      }
    });
  }
  function enhanceReplyActions(root, pageWindow = globalThis.unsafeWindow) {
    for (const anchor of matching(root, 'a[href*="#r_"]')) {
      const action = importedActions.get(anchor);
      if (action) bindImportedAction(anchor, action, pageWindow);
    }
    for (const area of matching(root, ".thank_area")) {
      const reply = area.closest(REPLY);
      if (!reply?.closest("#Main")) continue;
      area.classList.add("v2p-controls");
      for (const node of [...area.childNodes]) if (node.nodeType === 3) node.remove();
      for (const anchor of area.querySelectorAll("a")) {
        const source = `${anchor.getAttribute("href") ?? ""} ${anchor.getAttribute("onclick") ?? ""}`;
        const action = importedActions.get(anchor)?.kind ?? (/ignoreReply\s*\(|\/ignore\/reply\//.test(source) ? "hide" : /thankReply\s*\(|\/thank\/reply\//.test(source) ? "thank" : null);
        if (!action || anchor.querySelector(".v2p-control")) continue;
        const control = owned(
          element("span", void 0, `v2p-control v2p-hover-btn v2p-control-${action}`)
        );
        control.append(icon(action === "hide" ? "eye-off" : "heart"));
        anchor.classList.remove("thank");
        anchor.style.removeProperty("color");
        anchor.title = action === "hide" ? t("hideReply") : t("thankReply");
        anchor.setAttribute("aria-label", anchor.title);
        anchor.replaceChildren(control);
      }
      if (area.classList.contains("thanked") && !area.querySelector(".v2p-control-thank")) {
        for (const node of [...area.childNodes]) if (node.nodeType === 3) node.remove();
        const thanked = owned(
          element("span", void 0, "v2p-control v2p-control-thank v2p-thanked")
        );
        thanked.setAttribute("aria-label", t("thanked"));
        thanked.setAttribute("aria-disabled", "true");
        thanked.append(icon("heart"));
        area.append(thanked);
      }
      if (area.classList.contains("thanked")) {
        for (const likes of reply.querySelectorAll(".v2p-likes-box"))
          if (likes.closest(REPLY) === reply) likes.classList.add("v2p-thanked");
      }
    }
    for (const image of matching(root, 'img[alt="\u2764\uFE0F"], img[src*="/heart.png"]')) {
      const reply = image.closest(REPLY);
      if (!reply?.closest("#Main") || image.closest(".reply_content")) continue;
      const likes = image.closest(".small.fade");
      if (!likes) continue;
      likes.classList.add("v2p-likes-box");
      if ([...reply.querySelectorAll(".thank_area.thanked")].some(
        (area) => area.closest(REPLY) === reply
      ))
        likes.classList.add("v2p-thanked");
      const heart = owned(element("span", void 0, "v2p-icon-heart"));
      heart.append(icon("heart"));
      image.replaceWith(heart);
    }
  }

  // src/preview.js
  function createTopics(options, themeCSS2 = "") {
    const seen = /* @__PURE__ */ new WeakSet();
    return {
      enhance(root) {
        for (const link of matching(
          root,
          ".item_title a[href], a.topic-link[href], .item_hot_topic_title > a[href], a.v2p-member-topic-item[href]"
        )) {
          if (seen.has(link)) continue;
          seen.add(link);
          const url = new URL(link.href, location.href);
          if (url.origin !== location.origin || !/^\/t\/\d+\/?$/.test(url.pathname)) continue;
          if (options.newTab) {
            link.target = "_blank";
            link.rel = "noopener noreferrer";
          }
          if (!options.preview) continue;
          const trigger = owned(
            button(t("preview"), () => {
              const dialog = modal(link.textContent);
              const titleLink = element("a", link.textContent, "v2p-topic-preview-title-link");
              titleLink.title = link.textContent;
              titleLink.href = url.href;
              titleLink.target = options.newTab ? "_blank" : "_self";
              titleLink.rel = "noopener noreferrer";
              dialog.title.replaceChildren(titleLink);
              const original = element("a", t("openTopic"), "normal button special");
              original.href = url.href;
              original.target = options.newTab ? "_blank" : "_self";
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
                  if (!isV2EXPage(doc)) return;
                  applyTheme(doc, true);
                  const style = doc.createElement("style");
                  style.textContent = themeCSS2;
                  doc.head.append(style);
                  enhanceEmojis(doc);
                  const view = doc.defaultView;
                  enhanceReplyActions(doc, view);
                  const observer = new view.MutationObserver((records) => {
                    for (const { target } of records) {
                      const area = target.closest(".thank_area");
                      if (area) enhanceReplyActions(area, view);
                    }
                  });
                  observer.observe(doc.querySelector("#Main"), { childList: true, subtree: true });
                  view.addEventListener("pagehide", () => observer.disconnect(), { once: true });
                  createReplyFolding(options.autoFold, doc).enhance(doc);
                  syncOnce(doc);
                } catch {
                }
              });
            })
          );
          trigger.className = "v2p-topic-preview-btn";
          const title = link.closest(".item_title");
          if (title) {
            trigger.classList.add("vx-preview-visible");
            title.after(trigger);
          } else if (link.parentElement.matches(".v2p-member-topic-item-row")) {
            link.after(trigger);
          } else if (link.parentElement.matches(".item_hot_topic_title")) {
            link.parentElement.append(trigger);
          }
        }
      }
    };
  }

  // src/pagination.js
  function createPagination({
    container,
    first,
    toolbar,
    pages,
    current,
    total: initialTotal,
    loadPage
  }) {
    let reading = current, total = initialTotal, loading = [], signature = "", scheduled = false, navigation = 0, lastJump;
    const candidates = [...container.children].filter(
      (node) => !node.matches('.cell[id^="r_"]') && node.querySelector(".page_current,.page_normal,.page_input")
    );
    const bottom = candidates.findLast((node) => first.compareDocumentPosition(node) & 4) ?? owned(element("div", void 0, "cell ps_container"));
    container.append(bottom);
    bottom.before(toolbar);
    const bars = [.../* @__PURE__ */ new Set([...candidates, bottom])];
    for (const bar of bars) owned(bar);
    function pageURL(page) {
      const url = new URL(location.href);
      url.searchParams.set("p", String(page));
      url.hash = "";
      return url.href;
    }
    function setReading(page) {
      if (reading === page) return;
      reading = page;
      refresh(total, loading);
    }
    async function navigate(page) {
      if (!Number.isInteger(page) || page < 1 || page > total) return false;
      const ticket = ++navigation;
      if (!pages.has(page) && !await loadPage(page)) return false;
      if (ticket !== navigation) return false;
      setReading(page);
      lastJump = pages.get(page);
      lastJump?.scrollIntoView({ block: "start" });
      return true;
    }
    function controls() {
      const visible = total <= 9 ? Array.from({ length: total }, (_, i) => i + 1) : [
        .../* @__PURE__ */ new Set([
          1,
          total,
          ...Array.from({ length: 5 }, (_, i) => reading + i - 2).filter(
            (p) => p > 1 && p < total
          )
        ])
      ].sort((a, b) => a - b);
      const table = element("table");
      table.setAttribute("cellpadding", "0");
      table.setAttribute("cellspacing", "0");
      table.setAttribute("border", "0");
      table.style.width = "100%";
      const body = element("tbody"), row = element("tr"), numbers = element("td"), arrows = element("td");
      numbers.style.width = "92%";
      arrows.style.width = "8%";
      arrows.align = "right";
      let previous = 0;
      for (const page of visible) {
        if (previous && page > previous + 1) numbers.append(element("span", " \u2026 "));
        const link = element("a", String(page), page === reading ? "page_current" : "page_normal");
        link.href = pageURL(page);
        link.dataset.vxPage = String(page);
        link.title = pages.has(page) ? t("jumpPage", page) : t("loadPage", page);
        if (page === reading) link.setAttribute("aria-current", "page");
        if (loading.includes(page)) link.setAttribute("aria-busy", "true");
        link.addEventListener("click", (event) => {
          if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0)
            return;
          event.preventDefault();
          void navigate(page);
        });
        numbers.append(link, " ");
        previous = page;
      }
      const input = element("input");
      input.type = "number";
      input.className = "page_input";
      input.autocomplete = "off";
      input.value = String(reading);
      input.min = "1";
      input.max = String(total);
      input.setAttribute("aria-label", t("pageNumber"));
      input.addEventListener("keydown", (event) => {
        if (event.key !== "Enter") return;
        event.preventDefault();
        const page = Number(input.value);
        void navigate(page);
      });
      numbers.append(input);
      const inner = element("table"), innerBody = element("tbody"), innerRow = element("tr");
      inner.setAttribute("cellpadding", "0");
      inner.setAttribute("cellspacing", "0");
      inner.setAttribute("border", "0");
      inner.style.width = "100%";
      for (const [direction, text] of [
        [-1, "\u276E"],
        [1, "\u276F"]
      ]) {
        const page = reading + direction, disabled = page < 1 || page > total;
        const cell = element(
          "td",
          text,
          `super ${direction === 1 ? "normal_page_right" : "normal"} button`
        );
        Object.assign(cell.style, {
          display: "table-cell",
          width: "50%",
          textAlign: "center",
          opacity: disabled ? "0.4" : ""
        });
        if (direction < 0)
          Object.assign(cell.style, {
            borderRight: "none",
            borderTopRightRadius: "0",
            borderBottomRightRadius: "0"
          });
        else Object.assign(cell.style, { borderTopLeftRadius: "0", borderBottomLeftRadius: "0" });
        cell.tabIndex = disabled ? -1 : 0;
        cell.setAttribute("role", "button");
        cell.setAttribute("aria-disabled", String(disabled));
        if (loading.includes(page)) cell.setAttribute("aria-busy", "true");
        cell.dataset.vxDirection = String(direction);
        cell.title = direction < 0 ? t("previousPage") : t("nextPage");
        cell.setAttribute("aria-label", cell.title);
        const go = () => {
          if (!disabled) void navigate(page);
        };
        cell.addEventListener("click", go);
        cell.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            go();
          }
        });
        innerRow.append(cell);
      }
      innerBody.append(innerRow);
      inner.append(innerBody);
      arrows.append(inner);
      row.append(numbers, arrows);
      body.append(row);
      table.append(body);
      return table;
    }
    function refresh(nextTotal = total, nextLoading = loading) {
      total = nextTotal;
      loading = nextLoading;
      const key = `${reading}:${total}:${loading.join(",")}:${[...pages.keys()].join(",")}`;
      if (key === signature) return;
      signature = key;
      for (const bar of bars) {
        bar.hidden = total <= 1;
        bar.dataset.vxPagination = "";
        bar.setAttribute("aria-label", t("replyPages"));
        const focused = document.activeElement;
        let selector;
        if (bar.contains(focused)) {
          if (focused.matches(".page_input")) selector = ".page_input";
          else if (focused.dataset.vxPage) selector = `[data-vx-page="${focused.dataset.vxPage}"]`;
          else if (focused.dataset.vxDirection)
            selector = `[data-vx-direction="${focused.dataset.vxDirection}"]`;
        }
        bar.replaceChildren(controls());
        if (selector) {
          const replacement = bar.querySelector(selector);
          if (replacement?.matches(".page_input")) replacement.value = focused.value;
          replacement?.focus({ preventScroll: true });
        }
      }
    }
    function trackReading() {
      const threshold = Math.min(100, window.innerHeight / 4);
      if (lastJump) {
        const top = lastJump.getBoundingClientRect().top;
        const bottom2 = document.documentElement.scrollHeight - window.innerHeight;
        if (top > threshold && top < window.innerHeight && bottom2 > 0 && window.scrollY >= bottom2 - 1)
          return;
        lastJump = null;
      }
      const ordered = [...pages].sort(([a], [b]) => a - b);
      let page = ordered[0]?.[0] ?? current;
      for (const [number, marker] of ordered)
        if (marker.isConnected && marker.getBoundingClientRect().top <= threshold) page = number;
      setReading(page);
    }
    function schedule() {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(() => {
        scheduled = false;
        trackReading();
      });
    }
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    container.addEventListener("load", schedule, true);
    container.addEventListener("click", (event) => {
      if (event.target.closest?.(".v2p-expand-btn")) schedule();
    });
    const observer = typeof window.ResizeObserver === "function" ? new window.ResizeObserver(schedule) : null;
    observer?.observe(container);
    window.addEventListener("pagehide", (event) => {
      if (!event.persisted) observer?.disconnect();
    });
    refresh();
    return {
      bottom,
      navigate,
      refresh,
      trackReading,
      get reading() {
        return reading;
      }
    };
  }

  // src/replies.js
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
    const pages = [1];
    for (const link of doc.querySelectorAll("a.page_normal[href], a.page_current[href]")) {
      const url = new URL(link.getAttribute("href"), location.href);
      const page = Number(url.searchParams.get("p"));
      if (url.origin === location.origin && url.pathname === path && Number.isInteger(page) && page > 0 && page <= 1e5)
        pages.push(page);
    }
    for (const input of doc.querySelectorAll("input.page_input[max]"))
      if (Number.isInteger(Number(input.max)) && Number(input.max) > 0 && Number(input.max) <= 1e5)
        pages.push(Number(input.max));
    return Math.max(...pages);
  }
  function importReply(row, base) {
    const copy = row.cloneNode(true);
    captureImportedActions(copy, base);
    for (const node of copy.querySelectorAll(
      "script,style,iframe,object,embed,link,meta,base,form,input,button"
    ))
      node.remove();
    for (const node of [copy, ...copy.querySelectorAll("*")]) {
      for (const attr of [...node.attributes]) {
        if (/^on/i.test(attr.name) || attr.name.startsWith("data-vx-") || ["srcdoc", "style", "srcset", "name"].includes(attr.name))
          node.removeAttribute(attr.name);
      }
      for (const attr of ["href", "src"]) {
        if (!node.hasAttribute(attr)) continue;
        const value = safeURL(node.getAttribute(attr), base, attr === "src");
        if (value) {
          const url = new URL(value);
          node.setAttribute(
            attr,
            attr === "href" && url.origin === location.origin && /^\/member\/[^/]+\/?$/.test(url.pathname) && !url.search && !url.hash ? url.pathname : value
          );
        } else node.removeAttribute(attr);
      }
      if (node.tagName === "IMG") node.loading = "lazy";
    }
    return copy;
  }
  function cloneTopReply(reply) {
    const cloned = reply.node.cloneNode(true);
    cloned.id = `top_${reply.id}`;
    for (const child of cloned.querySelectorAll(".cell,.v2p-topic-reply-ref,.nested,.thank_area"))
      child.remove();
    for (const wrapper of cloned.querySelectorAll(".v2p-reply-content")) {
      const content = wrapper.querySelector(".reply_content");
      if (content) wrapper.replaceWith(content);
    }
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
  function initReplies({ options, getDocument, enhance }) {
    if (!/^\/t\/\d+\/?$/.test(location.pathname)) return null;
    const first = document.querySelector(`#Main ${REPLY}`);
    if (!first) return null;
    const container = first.parentElement, replies = /* @__PURE__ */ new Map(), pages = /* @__PURE__ */ new Map(), inFlight = /* @__PURE__ */ new Map();
    const requested = Number(new URL(location.href).searchParams.get("p"));
    const current = Number.isInteger(requested) && requested >= 1 && requested <= 1e5 ? requested : 1;
    let total = Math.max(current, pageCount(document, location.pathname)), signature = "", panel, error;
    const toolbar = owned(element("div", void 0, "cell"));
    toolbar.dataset.vxPaging = "";
    const status = element("span");
    status.setAttribute("role", "status");
    const retry = button(t("retry"), () => {
      if (error) void paging.navigate(error.page);
    });
    toolbar.append(status, retry);
    const firstMarker = owned(element("span", void 0, "vx-page-start"));
    firstMarker.dataset.vxPageStart = String(current);
    first.before(firstMarker);
    pages.set(current, firstMarker);
    const paging = createPagination({ container, first, toolbar, pages, current, total, loadPage });
    function render() {
      toolbar.hidden = !inFlight.size && !error;
      status.textContent = inFlight.size ? `${t("loadingPage", inFlight.keys().next().value)} ` : error ? `${t("pageFailed", error.page, error.message)} ` : "";
      retry.hidden = !error;
      retry.disabled = !!error && inFlight.has(error.page);
      paging.refresh(total, [...inFlight.keys()]);
      if (!options.hotReplies) return;
      const ranked = rankReplies(replies.values());
      const key = ranked.map((reply) => `${reply.id}:${reply.thanks}`).join("|");
      if (key === signature && panel) return;
      signature = key;
      if (panel?.previousElementSibling?.matches("[data-vx-hot-gap]"))
        panel.previousElementSibling.remove();
      panel?.remove();
      panel = null;
      if (!ranked.length) return;
      panel = owned(element("div", void 0, "box"));
      panel.id = "top_replies";
      const header = element("div", void 0, "cell");
      header.title = t("hotRepliesHelp");
      header.append(element("div", void 0, "fr"), element("span", t("hotReplies"), "fade"));
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
    function loadPage(page) {
      if (!Number.isInteger(page) || page < 1 || page > total) return Promise.resolve(false);
      if (pages.has(page)) return Promise.resolve(true);
      if (inFlight.has(page)) return inFlight.get(page);
      if (error?.page === page) error = null;
      const task = Promise.resolve().then(async () => {
        try {
          const url = new URL(location.href);
          url.search = "";
          url.searchParams.set("p", String(page));
          url.hash = "";
          const doc = await getDocument(url.href);
          const rows = [...doc.querySelectorAll(`#Main ${REPLY}`)];
          if (!rows.length) throw new Error(t("noReplies"));
          total = Math.max(total, pageCount(doc, location.pathname));
          const fragment = document.createDocumentFragment(), added = [];
          const marker = owned(element("span", void 0, "vx-page-start"));
          marker.dataset.vxPageStart = String(page);
          fragment.append(marker);
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
          const next = [...pages].sort(([a], [b]) => a - b).find(([number]) => number > page)?.[1] ?? toolbar;
          next.before(fragment);
          pages.set(page, marker);
          for (const row of added) enhance(row);
          return true;
        } catch (failure) {
          error = { page, message: failure.message };
          return false;
        }
      }).finally(() => {
        inFlight.delete(page);
        render();
      });
      inFlight.set(page, task);
      render();
      return task;
    }
    add(document);
    render();
    return {
      add,
      replies,
      paging,
      get loaded() {
        return new Set(pages.keys());
      },
      update(node) {
        enhanceReplyActions(node);
        const reply = replies.get(node.id);
        if (reply) {
          const count = thanksCount(node);
          if (count !== reply.thanks) {
            reply.thanks = count;
            render();
          }
        }
      },
      async preload() {
        for (let page = current + 1; page <= Math.min(total, current + options.preloadPages); page++)
          if (!await loadPage(page)) break;
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
    store,
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
        onStatus(t("checkInManual"));
        return;
      }
      running = true;
      try {
        await locks.request("v2ex-lite:check-in", { ifAvailable: true }, async (lock) => {
          if (!lock) return;
          const time = now();
          const day = dayKey(time);
          const key = `daily:${name.toLowerCase()}`;
          let state = store.get(key);
          if (!canAttempt(state, day, time)) return;
          const lease = store.get("daily-lease");
          if (lease?.until > time) return;
          const owner = crypto.randomUUID();
          store.set("daily-lease", { owner, until: time + 45e3 });
          if (store.get("daily-lease")?.owner !== owner) return;
          state = {
            day,
            attempts: state?.day === day ? state.attempts + 1 : 1,
            success: false,
            nextAt: time + 6e4
          };
          store.set(key, state);
          try {
            const doc = await getDocument("/mission/daily");
            if (currentUser(doc)?.toLowerCase() !== name.toLowerCase())
              throw new Error(t("accountChanged"));
            if (!redeemed(doc)) {
              const link = doc.querySelector('a[href^="/mission/daily/redeem?once="]');
              const inline2 = [...doc.querySelectorAll("input[onclick], button[onclick]")].map(
                (node) => /["'](\/mission\/daily\/redeem\?once=\d+)["']/.exec(
                  node.getAttribute("onclick")
                )?.[1]
              ).find(Boolean);
              const path = link?.getAttribute("href") ?? inline2;
              if (!path || !/^\/mission\/daily\/redeem\?once=\d+$/.test(path))
                throw new Error(t("rewardLinkMissing"));
              const result = await getDocument(path);
              if (!redeemed(result)) throw new Error(t("rewardUnconfirmed"));
            }
            store.set(key, { ...state, success: true, nextAt: 0 });
            onStatus(t("rewardReceived"));
          } catch (error) {
            store.set(key, { ...state, nextAt: time + (state.attempts === 1 ? 6e4 : 3e5) });
            onStatus(t("checkInError", error.message));
          } finally {
            if (store.get("daily-lease")?.owner === owner)
              store.set("daily-lease", { owner, until: 0 });
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
    if (!/^[a-z0-9]{1,64}$/i.test(clientId)) return Promise.reject(new Error(t("invalidClient")));
    if (!/^image\/(png|jpeg|gif|webp)$/.test(file.type) || file.size > 10 * 1024 * 1024 || file.size === 0) {
      return Promise.reject(new Error(t("imageFormat")));
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
              const error = new Error(t("imgurRateLimit"));
              error.rateLimited = true;
              error.retryAt = Date.now() + (Number.isFinite(delay) && delay > 0 ? delay : 36e5);
              throw error;
            }
            let body;
            try {
              body = JSON.parse(response.responseText);
            } catch {
              throw new Error(t("imgurResponse"));
            }
            const link = safeURL(body.data?.link, "https://i.imgur.com", true);
            if (response.status < 200 || response.status >= 300 || body.success !== true || !link || new URL(link).hostname !== "i.imgur.com") {
              throw new Error(t("imgurHTTP", response.status));
            }
            resolve({
              link,
              deleteHash: /^[a-z0-9]+$/i.test(body.data?.deletehash ?? "") ? body.data.deletehash : null
            });
          } catch (error) {
            reject(error);
          }
        },
        onerror: () => reject(new Error(t("imgurNetwork"))),
        ontimeout: () => reject(new Error(t("imgurTimeout"))),
        onabort: () => reject(new Error(t("imgurAborted")))
      });
    });
  }
  function sourceTopicURL(value) {
    const href = safeURL(value, location.href, true);
    if (!href) return null;
    const url = new URL(href);
    if (!/(^|\.)v2ex\.com$/i.test(url.hostname) || !/^\/t\/\d+\/?$/.test(url.pathname)) return null;
    return url.origin + url.pathname.replace(/\/$/, "");
  }
  function openUploadHistory(store) {
    const dialog = modal(t("uploadHistory"));
    const content = element("div", void 0, "v2p-topic-preview");
    const records = store.uploads();
    const status = element("p", void 0, "vx-upload-history-status");
    status.setAttribute("role", "status");
    const empty = element("p", t("noUploads"));
    empty.hidden = records.length > 0;
    content.append(status, empty);
    function removeRecord(record, row, message) {
      if (!row.isConnected) return;
      try {
        store.removeUpload(record.id);
      } catch {
        status.textContent = t("removeUploadFailed");
        return;
      }
      if (row.contains(document.activeElement)) dialog.main.focus();
      row.remove();
      empty.hidden = !!content.querySelector(".vx-upload-record");
      status.textContent = t(message);
    }
    for (const record of records) {
      const row = element("div", void 0, "cell vx-upload-record");
      const details = element("div", void 0, "vx-upload-record-details");
      details.append(element("p", `${record.createdAt} \xB7 ${record.fileName}`));
      const url = safeURL(record.link, "https://i.imgur.com", true);
      if (url && new URL(url).origin === "https://i.imgur.com") {
        const link = element("a", url);
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        const preview = link.cloneNode(false);
        preview.className = "vx-upload-record-preview";
        const image = element("img");
        image.alt = record.fileName || t("preview");
        image.setAttribute("loading", "lazy");
        image.setAttribute("decoding", "async");
        image.setAttribute("referrerpolicy", "no-referrer");
        const thumbnail = new URL(url);
        thumbnail.pathname = thumbnail.pathname.replace(
          /^\/([a-z0-9]+)\.(jpe?g|png|gif|webp)$/i,
          "/$1m.$2"
        );
        image.addEventListener("error", () => {
          if (image.src === url) preview.remove();
          else image.src = url;
        });
        if (record.id) {
          image.addEventListener(
            "load",
            async () => {
              try {
                const result = await fetch(url, {
                  method: "HEAD",
                  credentials: "omit",
                  cache: "no-store",
                  referrerPolicy: "no-referrer",
                  signal: AbortSignal.timeout(5e3)
                });
                if (result.redirected && result.url === "https://i.imgur.com/removed.png")
                  removeRecord(record, row, "imgurUploadRemoved");
              } catch {
              }
            },
            { once: true }
          );
        }
        image.src = thumbnail.href;
        preview.append(image);
        row.append(preview);
        details.append(link);
      }
      if (/^[a-z0-9]+$/i.test(record.deleteHash ?? "")) {
        const link = element("a", t("deleteImage"));
        link.href = `https://imgur.com/delete/${record.deleteHash}`;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        details.append(" \xB7 ", link);
      }
      const source = sourceTopicURL(record.sourceTopic?.url);
      if (source) {
        const context = element("p");
        const title = record.sourceTopic.title;
        const link = element("a", typeof title === "string" && title.trim() ? title : source);
        link.href = source;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        context.append(element("strong", t("sourceTopic")), " ", link);
        details.append(context);
      }
      if (record.id) {
        const remove = button(t("removeUploadRecord"), () => {
          if (window.confirm(t("confirmRemoveUpload"))) removeRecord(record, row, "uploadRemoved");
        });
        remove.classList.add("vx-upload-remove");
        details.append(remove);
      }
      row.append(details);
      content.append(row);
    }
    dialog.content.append(content);
  }
  function initUpload(options, store, request = GM_xmlhttpRequest) {
    const textarea = document.querySelector(
      'textarea#reply_content, #reply-box textarea, textarea[name="content"]'
    );
    if (!textarea || !options.upload) return;
    const sourceURL = sourceTopicURL(location.href);
    const sourceTopic = sourceURL ? {
      title: document.querySelector("#Main .header h1")?.textContent.trim() || document.title.trim(),
      url: sourceURL
    } : null;
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
    const messages2 = element("div");
    messages2.setAttribute("aria-live", "polite");
    const pick = owned(element("a", ` + ${t("insertImage")}`, "vr_upload_image"));
    pick.tabIndex = 0;
    pick.setAttribute("role", "button");
    pick.setAttribute("aria-label", t("uploadToImgur"));
    pick.style.paddingLeft = "10px";
    pick.title = t("uploadToImgur");
    pick.addEventListener("click", () => input.click());
    pick.addEventListener("keydown", (event) => {
      if (event.key === "Enter") input.click();
    });
    const appendPosition = document.querySelector("#reply-box > div > div") ?? textarea.form;
    appendPosition?.append(pick);
    toolbar.append(input, messages2);
    textarea.after(toolbar);
    let queue = Promise.resolve();
    let pending = 0;
    let pausedUntil = store.get("upload-paused-until", 0);
    const paused = () => Math.max(pausedUntil, store.get("upload-paused-until", 0)) > Date.now();
    function enqueue(files) {
      const images = [...files].filter((file) => file.type.startsWith("image/"));
      if (!images.length) return false;
      if (paused()) {
        messages2.textContent = t("uploadPaused");
        return false;
      }
      if (images.length + pending > 10) {
        messages2.textContent = t("queueLimit");
        return false;
      }
      for (const file of images) {
        pending++;
        const marker = `[vx-upload:${crypto.randomUUID()}]`;
        textarea.setRangeText(`
${marker}
`, textarea.selectionEnd, textarea.selectionEnd, "end");
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
        const row = element("p", t("queued", file.name || t("pastedImage")));
        messages2.append(row);
        while (messages2.children.length > 20) messages2.firstElementChild.remove();
        queue = queue.then(async () => {
          if (paused()) {
            replacePlaceholder(textarea, marker, "");
            row.textContent = t("cancelQueued");
            pending--;
            return;
          }
          row.textContent = t("uploading", file.name || t("pastedImage"));
          try {
            const result = await uploadImage(file, options.imgurClientId, request);
            const replaced = replacePlaceholder(textarea, marker, result.link);
            row.textContent = replaced ? t("uploaded") : t("draftMarkerRemoved");
            const link = element("a", result.link);
            link.href = result.link;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            row.append(link);
            if (result.deleteHash) {
              const deletion = element("a", ` ${t("saveDelete")}`);
              deletion.href = `https://imgur.com/delete/${result.deleteHash}`;
              deletion.target = "_blank";
              deletion.rel = "noopener noreferrer";
              row.append(deletion);
            }
            try {
              const record = { ...result, fileName: file.name || t("pastedImage") };
              if (sourceTopic) record.sourceTopic = sourceTopic;
              store.recordUpload(record);
            } catch {
              row.append(` ${t("uploadRecordFailed")}`);
            }
          } catch (error) {
            if (error.rateLimited) {
              pausedUntil = error.retryAt;
              try {
                store.set("upload-paused-until", error.retryAt);
              } catch {
              }
            }
            replacePlaceholder(textarea, marker, "");
            row.textContent = `${file.name || t("pastedImage")}: ${error.message}${error.rateLimited ? "" : ` ${t("selectAgain")}`}`;
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
          messages2.append(element("p", t("finishUploads")));
        }
      },
      true
    );
  }

  // src/tag-manager.js
  var pageSize = 50;
  function createTagManager(store, { createTagEditor, updateTags }) {
    const root = element("div", void 0, "vx-tag-manager");
    const capacity = element(
      "p",
      t(
        "tagCapacity",
        TAG_LIMITS.perMember,
        TAG_LIMITS.length,
        TAG_LIMITS.importMembers.toLocaleString("en")
      ),
      "vx-tag-capacity"
    );
    const toolbar = element("div", void 0, "vx-tag-filters");
    const label = element("label", t("searchTags"));
    const search = element("input");
    search.type = "search";
    label.append(search);
    const groupLabel = element("label", t("tagGroup"));
    const group = element("select", void 0, "vx-tag-group");
    groupLabel.append(group);
    const count = element("span", void 0, "vx-tag-count");
    count.setAttribute("aria-live", "polite");
    toolbar.append(label, groupLabel, count);
    const status = element("p");
    status.setAttribute("role", "status");
    const editor = element("div", void 0, "vx-tag-editor");
    const list = element("ul", void 0, "vx-tag-list");
    const more = button(t("moreTags"), () => {
      const previousLimit = limit;
      limit += pageSize;
      render();
      list.children[previousLimit]?.querySelector(".vx-tag-profile")?.focus();
    });
    let members = [], limit = pageSize, editing = null;
    root.append(capacity, toolbar, status, editor, list, more);
    function closeEditor() {
      editor.replaceChildren();
      editing = null;
      search.focus();
    }
    function deleteTags(name) {
      if (!window.confirm(t("confirmDeleteTags", name))) return;
      try {
        updateTags(name, []);
      } catch {
        status.textContent = t("tagDeleteFailed", name);
        return;
      }
      if (editing === name) closeEditor();
      status.textContent = t("tagsDeleted", name);
      refresh();
      search.focus();
    }
    function render() {
      const query = search.value.trim().toLowerCase();
      const matching2 = members.filter(
        ({ name, tags }) => (!group.value || tags.includes(group.value)) && (name.includes(query) || tags.some((tag) => tag.toLowerCase().includes(query)))
      );
      count.textContent = query || group.value ? t("filteredTaggedCount", matching2.length, members.length) : t("taggedCount", members.length);
      list.replaceChildren();
      more.hidden = matching2.length <= limit;
      if (!matching2.length) list.append(element("li", t("noMatchingTags"), "vx-tag-empty"));
      for (const { name, tags } of matching2.slice(0, limit)) {
        const row = element("li", void 0, "vx-tag-row");
        const text = element("div", void 0, "vx-tag-member");
        const profile = element("a", name, "vx-tag-profile");
        profile.href = `/member/${encodeURIComponent(name)}`;
        profile.target = "_blank";
        profile.rel = "noopener noreferrer";
        const chips = element("ul", void 0, "vx-tag-chips");
        for (const tag of tags) {
          const filter = button(tag, () => {
            group.value = group.value === tag ? "" : tag;
            filterList();
            group.focus();
          });
          filter.className = "vx-tag-filter";
          filter.setAttribute("aria-pressed", String(group.value === tag));
          const chip = element("li");
          chip.append(filter);
          chips.append(chip);
        }
        text.append(profile, chips);
        const edit = button(t("edit"), () => {
          if (editing === name) {
            editor.querySelector(".vx-tag-entry textarea").focus();
            return;
          }
          status.textContent = "";
          const { form, input, save } = createTagEditor(
            name,
            () => {
              closeEditor();
              status.textContent = t("tagsSaved", name);
              refresh();
            },
            tags
          );
          const actions2 = element("div", void 0, "vx-tag-actions");
          actions2.append(button(t("cancel"), closeEditor), save);
          editor.replaceChildren(element("h3", t("editTags", name)), form, actions2);
          editing = name;
          input.focus();
        });
        edit.setAttribute("aria-label", t("editTags", name));
        const remove = button(t("deleteTags"), () => deleteTags(name));
        remove.classList.add("vx-tag-delete");
        remove.setAttribute("aria-label", t("deleteTagsFor", name));
        const actions = element("div", void 0, "vx-tag-actions");
        actions.append(edit, remove);
        row.append(text, actions);
        list.append(row);
      }
    }
    function refresh() {
      const selected = group.value;
      members = store.taggedMembers();
      const groups = /* @__PURE__ */ new Map();
      for (const { tags } of members)
        for (const tag of tags) groups.set(tag, (groups.get(tag) ?? 0) + 1);
      const all = element("option", t("allTagGroups"));
      all.value = "";
      group.replaceChildren(all);
      for (const [tag, size2] of [...groups].sort(([a], [b]) => a.localeCompare(b))) {
        const option = element("option", t("tagGroupOption", tag, size2));
        option.value = tag;
        group.append(option);
      }
      group.value = groups.has(selected) ? selected : "";
      if (selected && !group.value) limit = pageSize;
      render();
    }
    function filterList() {
      limit = pageSize;
      render();
    }
    group.addEventListener("change", filterList);
    search.addEventListener("input", filterList);
    search.addEventListener("keydown", (event) => {
      if (event.key === "Enter") event.preventDefault();
    });
    return { root, refresh };
  }

  // src/settings.js
  function openSettings(store, signedIn = Boolean(currentUser()), tagActions) {
    if (document.querySelector("#vx-settings-dialog")) return;
    const options = store.options();
    const dialog = modal(`V2EX Lite ${t("settings")}`, true);
    dialog.root.id = "vx-settings-dialog";
    dialog.root.lang = interfaceLanguage();
    const form = element("form");
    form.id = "vx-settings-form";
    const fields = /* @__PURE__ */ new Map();
    const groups = {
      browse: ["language", "privacy", "newTab", "preview", "userCards", "tags"],
      discussion: ["hotReplies", "autoFold", "preloadPages", "autoCheckIn"],
      editor: ["emoji", "upload", "imgurClientId"]
    };
    const requiresLogin = /* @__PURE__ */ new Set(["autoCheckIn", "emoji", "upload", "imgurClientId"]);
    for (const [group, keys] of Object.entries(groups)) {
      const section = element("fieldset");
      section.append(element("legend", t(group)));
      const grid = element("div", void 0, "vx-settings-grid");
      for (const key of keys) {
        const login = requiresLogin.has(key);
        const wrapper = element("div", void 0, "vx-settings-option");
        const caption = element("label", t(key));
        const control = element(key === "language" ? "select" : "input");
        control.id = `vx-option-${key}`;
        control.name = key;
        control.disabled = login && !signedIn;
        if (key === "language") {
          for (const [value, name] of [
            ...Object.entries(LANGUAGE_NAMES),
            ["site", t("followSite")]
          ]) {
            const option = element("option", name);
            option.value = value;
            if (value !== "site") option.lang = value;
            control.append(option);
          }
          control.value = options.language;
        } else if (key === "preloadPages") {
          Object.assign(control, { type: "number", min: "0", max: "5", step: "1", required: true });
          control.value = String(options[key]);
        } else if (key === "imgurClientId") {
          Object.assign(control, { type: "text", autocomplete: "off", pattern: "[A-Za-z0-9]{0,64}" });
          control.value = options[key];
          control.placeholder = t("sharedClient");
        } else {
          control.type = "checkbox";
          control.checked = !control.disabled && options[key];
        }
        const help = element("p", t(`${key}Help`));
        help.id = `${control.id}-help`;
        if (login) help.append(" ", element("strong", t("loginRequired")));
        control.setAttribute("aria-describedby", help.id);
        caption.append(control);
        wrapper.append(caption, help);
        grid.append(wrapper);
        fields.set(key, control);
      }
      section.append(grid);
      form.append(section);
    }
    const message = element("p");
    message.setAttribute("role", "status");
    const save = element("button", t("save"), "normal button special");
    save.type = "submit";
    save.setAttribute("form", form.id);
    dialog.footer.append(message, save);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.checkValidity()) return;
      const next = { ...options };
      for (const [key, control] of fields) {
        if (control.disabled) continue;
        next[key] = control.type === "checkbox" ? control.checked : control.value;
      }
      next.preloadPages = Number(next.preloadPages);
      try {
        store.saveOptions(next);
        location.reload();
      } catch {
        message.textContent = t("saveFailed");
      }
    });
    const file = element("input");
    file.type = "file";
    file.accept = ".json,application/json,text/plain";
    file.hidden = true;
    let manager;
    file.setAttribute("aria-label", t("selectBackup"));
    file.addEventListener("change", async () => {
      try {
        if (!file.files[0]) return;
        if (file.files[0].size > 2e6) throw new Error(t("backupSize"));
        const count = store.import(await file.files[0].text());
        manager?.refresh();
        message.textContent = t("imported", count);
      } catch (error) {
        message.textContent = t(
          "importFailed",
          error instanceof SyntaxError ? t("invalidJSON") : error.message
        );
      } finally {
        file.value = "";
      }
    });
    const backup = element("fieldset");
    const buttons = element("div", void 0, "vx-settings-backup-actions");
    buttons.append(
      button(t("exportBackup"), () => {
        const url = URL.createObjectURL(new Blob([store.export()], { type: "application/json" }));
        const anchor = element("a");
        anchor.href = url;
        anchor.download = "v2ex-lite-backup.json";
        anchor.click();
        setTimeout(() => URL.revokeObjectURL(url), 1e3);
      }),
      button(t("importBackup"), () => file.click()),
      file
    );
    backup.append(
      element("legend", t("backup")),
      element("strong", t("storage")),
      element("p", t("storageHelp"), "vx-storage-help"),
      element("p", t("backupHelp")),
      buttons
    );
    if (tagActions) {
      const details = element("details", void 0, "vx-settings-tag-manager");
      details.append(element("summary", t("manageTags")));
      details.addEventListener("toggle", () => {
        if (!details.open) return;
        if (!manager) {
          manager = createTagManager(store, tagActions);
          details.append(manager.root);
        }
        manager.refresh();
      });
      form.append(details);
    }
    form.append(backup);
    if (!signedIn) dialog.content.append(element("p", t("guestNotice"), "vx-settings-notice"));
    dialog.content.append(form);
    dialog.actions.prepend(
      button(t("uploadHistory"), () => {
        dialog.close();
        openUploadHistory(store);
      })
    );
  }
  function installSettings(store, signedIn, tagActions) {
    const open = () => openSettings(store, signedIn, tagActions);
    GM_registerMenuCommand(`V2EX Lite ${t("settings")}`, open);
    const host = document.querySelector("#Bottom .content");
    if (!host) return;
    const footer = owned(element("div", void 0, "v2p-footer"));
    footer.append(element("div", "V2EX Lite", "v2p-footer-text"));
    const links = element("div", void 0, "v2p-footer-links");
    const entry = element("a", t("settings"), "v2p-footer-link v2p-hover-btn");
    entry.href = "#";
    entry.addEventListener("click", (event) => {
      event.preventDefault();
      open();
    });
    entry.id = "vx-settings";
    const uploads = element("a", t("uploadHistory"), "v2p-footer-link v2p-hover-btn");
    uploads.href = "#";
    uploads.addEventListener("click", (event) => {
      event.preventDefault();
      openUploadHistory(store);
    });
    links.append(entry, uploads);
    footer.append(links);
    host.append(footer);
  }

  // src/page-actions.js
  function installPageActions(signedIn, pageWindow = globalThis.unsafeWindow) {
    const controls = owned(element("div", void 0, "vx-page-actions"));
    controls.setAttribute("role", "group");
    controls.setAttribute("aria-label", t("pageActions"));
    const top = button("", () => {
      const rightbar = document.querySelector("#Rightbar");
      if (rightbar) rightbar.scrollTop = 0;
      window.scrollTo({ top: 0 });
    });
    top.className = "vx-back-to-top";
    top.setAttribute("aria-label", t("backToTop"));
    const topHint = element("span", t("backToTop"), "vx-page-action-hint");
    topHint.setAttribute("aria-hidden", "true");
    top.append(icon("arrow-up"), topHint);
    controls.append(top);
    const editor = signedIn && /^\/t\/\d+\/?$/.test(location.pathname) ? document.querySelector(
      "#Main #reply-box textarea:enabled:not([readonly]), #Main textarea#reply_content:enabled:not([readonly])"
    ) : null;
    if (editor) {
      const reply = button("", () => {
        const replyBox = editor.closest("#reply-box");
        if (replyBox) {
          if (typeof pageWindow?.setReplyBoxSticky === "function") pageWindow.setReplyBoxSticky();
          else {
            replyBox.classList.add("reply-box-sticky");
            const undock = replyBox.querySelector("#undock-button");
            if (undock) undock.style.display = "inline-block";
          }
        }
        editor.focus({ preventScroll: true });
      });
      reply.className = "vx-quick-reply";
      reply.setAttribute("aria-label", t("jumpToReply"));
      const replyHint = element("span", t("jumpToReply"), "vx-page-action-hint");
      replyHint.setAttribute("aria-hidden", "true");
      reply.append(icon("message-square"), replyHint);
      controls.append(reply);
    }
    const sync = () => {
      const nearTop = window.scrollY < 160;
      top.hidden = nearTop;
      controls.hidden = nearTop && !editor;
    };
    document.body.append(controls);
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("pageshow", sync);
    sync();
  }

  // src/main.js
  var themeCSS = `${theme_default}
${styles_default}`;
  var themeReady = false;
  function prepareTheme() {
    if (!themeReady && isV2EXPage(document)) {
      GM_addStyle(themeCSS);
      applyTheme();
      themeReady = true;
    }
    return themeReady;
  }
  function start() {
    if (!isV2EXPage(document)) return;
    prepareTheme();
    const store = createStorage({
      get: GM_getValue,
      set: GM_setValue,
      delete: GM_deleteValue,
      keys: GM_listValues,
      listen: GM_addValueChangeListener
    });
    const options = store.options();
    setLanguage(options.language);
    const name = currentUser();
    if (options.privacy) {
      for (const icon2 of document.querySelectorAll('link[rel~="icon"]'))
        icon2.href = "https://v2p.leoku.dev/favicon.svg";
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
    const topics = createTopics(options, themeCSS);
    const members = createMembers(store, options, topics, name);
    const folding = createReplyFolding(options.autoFold);
    const enhance = (root) => {
      members.enhance(root);
      topics.enhance(root);
      enhanceEmojis(root);
      enhanceReplyActions(root);
      folding.enhance(root);
    };
    enhance(document);
    const replies = initReplies({ options, getDocument, enhance });
    installSettings(store, Boolean(name), members);
    installPageActions(Boolean(name));
    if (name) {
      initUpload(options, store);
      initEmoji(options);
    }
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
          for (const node of changed) {
            folding.enhance(node);
            replies?.update(node);
          }
          roots.clear();
          changed.clear();
        });
      });
      observer.observe(main, { childList: true, subtree: true, characterData: true });
    }
    if (name && options.autoCheckIn) {
      const report = (message) => {
        const entry = document.querySelector("#vx-settings");
        if (entry) entry.title = message;
        console.info(`[V2EX Lite] ${message}`);
      };
      const checkIn = createCheckIn({ store, getDocument, onStatus: report });
      const runDaily = () => {
        if (document.visibilityState === "visible")
          void checkIn(name).catch((error) => report(error.message));
      };
      document.addEventListener("visibilitychange", runDaily);
      runDaily();
    }
    void replies?.preload();
  }
  if (document.readyState === "loading") {
    const observer = new MutationObserver(() => {
      if (prepareTheme()) observer.disconnect();
    });
    if (!prepareTheme()) observer.observe(document, { childList: true, subtree: true });
    document.addEventListener(
      "DOMContentLoaded",
      () => {
        observer.disconnect();
        start();
      },
      { once: true }
    );
  } else start();
})();
