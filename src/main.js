import { applyTheme } from "./theme.js";
import polishCSS from "./theme.scss";
import integrationCSS from "./styles.css";
import { enhanceEmojis, initEmoji } from "./emoji.js";
import { createStorage } from "./storage.js";
import { createHTTP, currentUser, isV2EXPage } from "./dom.js";
import { createMembers } from "./members.js";
import { createTopics } from "./preview.js";
import { enhanceReplyActions, initReplies, REPLY } from "./replies.js";
import { createCheckIn } from "./check-in.js";
import { initUpload } from "./upload.js";
import { createReplyFolding } from "./folding.js";
import { installSettings } from "./settings.js";

function start() {
  if (!isV2EXPage(document)) return;
  const store = createStorage({
    get: GM_getValue,
    set: GM_setValue,
    keys: GM_listValues,
    listen: GM_addValueChangeListener,
  });
  const options = store.options();
  const themeCSS = `${polishCSS}\n${integrationCSS}`;
  GM_addStyle(themeCSS);
  applyTheme();
  const name = currentUser();
  if (options.privacy) {
    for (const icon of document.querySelectorAll('link[rel~="icon"]'))
      icon.href = "https://v2p.leoku.dev/favicon.svg";
    for (const link of document.querySelectorAll('#Top a[href^="/member/"]')) link.remove();
    const logo = document.querySelector("#Logo");
    if (logo) {
      logo.classList.add("v2p-logo");
      logo.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>';
    }
    if (name) {
      const account = [...document.querySelectorAll('#Rightbar a[href^="/member/"]')].find(
        (link) => link.getAttribute("href").toLowerCase() === `/member/${name.toLowerCase()}`,
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
  installSettings(store, Boolean(name), members.createTagEditor);
  if (name) {
    initUpload(options, store);
    initEmoji(options);
  }
  const main = document.querySelector("#Main");
  if (main) {
    const roots = new Set();
    const changed = new Set();
    let scheduled = false;
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        const target =
          mutation.target.nodeType === 1 ? mutation.target : mutation.target.parentElement;
        if (target?.closest("[data-vx-owned]")) continue;
        const reply = target?.closest(REPLY);
        if (reply) changed.add(reply);
        for (const node of mutation.addedNodes) {
          if (node.nodeType === 1 && !node.matches("[data-vx-owned]")) roots.add(node);
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

if (document.readyState === "loading")
  document.addEventListener("DOMContentLoaded", start, { once: true });
else start();
