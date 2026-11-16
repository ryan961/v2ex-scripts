import { button, element, matching, modal, owned, syncOnce } from "./dom.js";
import { applyTheme } from "./theme.js";
import { enhanceEmojis } from "./emoji.js";

export function createTopics(options, themeCSS = "") {
  const seen = new WeakSet();
  return {
    enhance(root) {
      for (const link of matching(
        root,
        ".item_title a[href], a.topic-link[href], .item_hot_topic_title > a[href]",
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
          button("\u9884\u89c8", () => {
            const dialog = modal(link.textContent);
            const titleLink = element("a", link.textContent, "v2p-topic-preview-title-link");
            titleLink.title = link.textContent;
            titleLink.href = url.href;
            titleLink.target = options.newTab ? "_blank" : "_self";
            titleLink.rel = "noopener noreferrer";
            dialog.title.replaceChildren(titleLink);
            const original = element("a", "\u8fdb\u5165\u4e3b\u9898", "normal button special");
            original.href = url.href;
            original.target = options.newTab ? "_blank" : "_self";
            original.rel = "noopener noreferrer";
            dialog.actions.prepend(original);
            const frame = element("iframe", undefined, "v2p-topic-preview-frame");
            frame.title = link.textContent;
            const previewURL = new URL(url.href);
            previewURL.searchParams.set("v2p-preview", "1");
            frame.src = previewURL.href;
            const wrapper = element("div", undefined, "v2p-topic-preview-wrapper");
            wrapper.append(frame);
            dialog.content.append(wrapper);
            frame.addEventListener("load", () => {
              try {
                const doc = frame.contentDocument;
                if (!doc?.querySelector("#Main")) return;
                applyTheme(doc, true);
                const style = doc.createElement("style");
                style.textContent = themeCSS;
                doc.head.append(style);
                enhanceEmojis(doc);
                syncOnce(doc);
              } catch {
                /* A sign-in redirect may leave the same-origin frame. */
              }
            });
          }),
        );
        trigger.className = "v2p-topic-preview-btn";
        const item = link.closest(".cell");
        const info = item?.querySelector(".topic_info");
        if (info) {
          const actions = owned(element("span", undefined, "v2p-topic-actions"));
          actions.append(trigger);
          const anchor = info.querySelector(":scope > span:first-of-type");
          if (anchor) anchor.after(actions);
          else info.append(actions);
        } else link.parentElement.append(trigger);
      }
    },
  };
}
