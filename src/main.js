import css from "./styles.css";
import minimalist from "./polish-minimalist.css";
import { createStorage } from "./storage.js";
import { createHTTP, currentUser } from "./dom.js";
import { createMembers } from "./members.js";
import { createTopics } from "./preview.js";
import { initReplies, REPLY } from "./replies.js";
import { createCheckIn } from "./check-in.js";
import { initUpload } from "./upload.js";
import { installSettings } from "./settings.js";

const store = createStorage({
  get: GM_getValue,
  set: GM_setValue,
  keys: GM_listValues,
  listen: GM_addValueChangeListener,
});
const options = store.options();
GM_addStyle(`${minimalist}\n${css}`);
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
    for (const icon of document.querySelectorAll('link[rel~="icon"]')) icon.remove();
    const icon = document.createElement("link");
    icon.rel = "icon";
    icon.href = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect x="3" y="3" width="26" height="26" rx="5" fill="#657581"/><path d="M9 11h14v2H9zm0 6h14v2H9z" fill="white"/></svg>')}`;
    document.head.append(icon);
    if (name) {
      const account = [...document.querySelectorAll('#Rightbar a[href^="/member/"]')].find(
        (link) => link.getAttribute("href").toLowerCase() === `/member/${name.toLowerCase()}`,
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
