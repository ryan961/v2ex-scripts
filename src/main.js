import { applyTheme, THEME_STYLE_ID } from "./theme.js";
import { themeStyles } from "./theme-styles.js";
import { enhanceEmojis, initEmoji } from "./emoji.js";
import { createStorage, PREFIX } from "./storage.js";
import { setLanguage } from "./i18n.js";
import { createHTTP, currentUser, isV2EXPage, matching } from "./dom.js";
import { createMembers } from "./members.js";
import { createTopics, PREVIEW_READY } from "./preview.js";
import { enhanceReplyActions, initReplies, REPLY } from "./replies.js";
import { createCheckIn } from "./check-in.js";
import { initUpload } from "./upload.js";
import { createReplyFolding } from "./folding.js";
import { installSettings } from "./settings.js";
import { installPageActions } from "./page-actions.js";
import { enhanceImages, imageMutationRoot, installImageViewer } from "./image-viewer.js";

let themeCSS;
const previewFrame = window.frameElement?.matches("iframe.v2p-topic-preview-frame")
  ? window.frameElement
  : null;
let themeReady = false;

function preparePrivacy() {
  // Protect streamed account markup before the rest of the page finishes loading.
  document.documentElement.dataset.vxPrivacy = "";
  for (const icon of document.querySelectorAll('link[rel~="icon"]')) {
    if (icon.href !== "https://v2p.leoku.dev/favicon.svg")
      icon.href = "https://v2p.leoku.dev/favicon.svg";
  }
  const logo = document.getElementById("Logo");
  if (logo && !logo.classList.contains("v2p-logo")) {
    logo.classList.add("v2p-logo");
    logo.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>';
  }
}

function prepareTheme() {
  if (!themeReady && (document.querySelector("body > #Top #Logo") || isV2EXPage(document))) {
    let theme;
    let privacy = false;
    if (previewFrame) theme = previewFrame.ownerDocument.documentElement.dataset.vxTheme;
    else {
      try {
        const options = GM_getValue(`${PREFIX}options`, {});
        theme = options?.theme;
        privacy = options?.privacy === true;
      } catch {
        // A storage failure must not prevent the fallback theme from loading.
      }
    }
    if (privacy) preparePrivacy();
    applyTheme(document, Boolean(previewFrame), theme);
    themeCSS = themeStyles(document.documentElement.dataset.vxTheme);
    if (!document.getElementById(THEME_STYLE_ID)) {
      const style = GM_addStyle(themeCSS);
      if (style) style.id = THEME_STYLE_ID;
    }
    previewFrame?.style.removeProperty("visibility");
    themeReady = true;
  }
  return themeReady;
}

function start() {
  previewFrame?.style.removeProperty("visibility");
  if (!isV2EXPage(document)) return;
  prepareTheme();
  if (previewFrame) {
    previewFrame.dispatchEvent(new Event(PREVIEW_READY));
    return;
  }
  const store = createStorage({
    get: GM_getValue,
    set: GM_setValue,
    delete: GM_deleteValue,
    keys: GM_listValues,
    listen: GM_addValueChangeListener,
  });
  const options = store.options();
  setLanguage(options.language);
  const name = currentUser();
  if (options.privacy) preparePrivacy();
  const getDocument = createHTTP();
  const topics = createTopics(options, themeCSS);
  const members = createMembers(store, options, topics, name);
  const folding = createReplyFolding(options.autoFold);
  const main = document.getElementById("Main");
  const isTopic = document.documentElement.dataset.v2pPage === "topic";
  const imageProxy = isTopic && options.imgurProxy ? options.imgurProxyURL : "";
  const imageAttributes = imageProxy ? ["src", "srcset"] : [];
  if (isTopic) installImageViewer(main, imageProxy);
  const enhance = (root) => {
    members.enhance(root);
    topics.enhance(root);
    enhanceEmojis(root);
    if (isTopic) enhanceImages(root, imageProxy);
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
  if (main) {
    const roots = new Set();
    const changed = new Set();
    let scheduled = false;
    const observer = new MutationObserver((mutations) => {
      let images;
      for (const mutation of mutations) {
        const target =
          mutation.target.nodeType === 1 ? mutation.target : mutation.target.parentElement;
        if (mutation.type === "attributes") {
          if (imageAttributes.includes(mutation.attributeName)) {
            const image = imageMutationRoot(target);
            if (image) (images ??= new Set()).add(image);
          } else if (target?.matches(REPLY)) changed.add(target);
          continue;
        }
        const reply = target?.closest(REPLY);
        if (reply) {
          replies?.invalidate(reply);
          changed.add(reply);
        }
        for (const node of mutation.removedNodes)
          if (node.nodeType === 1)
            for (const removed of matching(node, REPLY)) changed.add(removed);
        if (target?.closest("[data-vx-owned]")) continue;
        for (const node of mutation.addedNodes) {
          if (node.nodeType === 1 && !node.matches("[data-vx-owned]")) roots.add(node);
        }
      }
      if (images) {
        for (const image of images) {
          if (!main.contains(image)) continue;
          enhanceImages(image, imageProxy);
          const reply = image.closest(".reply_content")?.closest(REPLY);
          if (reply && replies?.invalidate(reply)) changed.add(reply);
        }
      }
      if (scheduled || (!roots.size && !changed.size)) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        for (const root of roots) {
          if (root.isConnected) {
            enhance(root);
            replies?.add(root);
          }
        }
        for (const node of changed) if (node.isConnected) folding.enhance(node);
        replies?.update(changed);
        roots.clear();
        changed.clear();
      });
    });
    observer.observe(main, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["class", "style", "hidden", ...imageAttributes],
    });
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

if (window.self === window.top || previewFrame) {
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
      { once: true },
    );
  } else start();
}
