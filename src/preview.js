import { t } from "./i18n.js";
import { button, element, isV2EXPage, matching, modal, owned, syncOnce } from "./dom.js";
import { applyTheme, THEME_STYLE_ID } from "./theme.js";
import { enhanceEmojis } from "./emoji.js";
import { createReplyFolding } from "./folding.js";
import { enhanceReplyActions } from "./reply-actions.js";
import { enhanceImages, installImageViewer } from "./image-viewer.js";

export function createTopics(options, themeCSS = "") {
  const seen = new WeakSet();
  return {
    enhance(root) {
      for (const link of matching(
        root,
        ".item_title a[href], a.topic-link[href], .item_hot_topic_title > a[href], a.v2p-member-topic-item[href]",
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
            const frame = element("iframe", undefined, "v2p-topic-preview-frame");
            frame.title = link.textContent;
            frame.style.visibility = "hidden";
            const previewURL = new URL(url.href);
            previewURL.searchParams.set("v2p-preview", "1");
            frame.src = previewURL.href;
            const wrapper = element("div", undefined, "v2p-topic-preview-wrapper");
            wrapper.append(frame);
            dialog.content.append(wrapper);
            const onPreviewKey = (event) => {
              if (
                event.key === "Escape" &&
                !event.defaultPrevented &&
                dialog.root.isConnected &&
                !dialog.root.hasAttribute("inert")
              ) {
                event.preventDefault();
                dialog.close();
              }
            };
            frame.addEventListener("load", () => {
              try {
                const doc = frame.contentDocument;
                doc?.addEventListener("keydown", onPreviewKey);
                if (!isV2EXPage(doc)) return;
                applyTheme(doc, true, options.theme);
                if (!doc.getElementById(THEME_STYLE_ID)) {
                  const style = doc.createElement("style");
                  style.id = THEME_STYLE_ID;
                  style.textContent = themeCSS;
                  doc.head.append(style);
                }
                enhanceEmojis(doc);
                enhanceImages(doc);
                const main = doc.getElementById("Main");
                installImageViewer(main);
                const view = doc.defaultView;
                enhanceReplyActions(doc, view);
                const observer = new view.MutationObserver((records) => {
                  for (const { target, addedNodes } of records) {
                    const area = target.closest(".thank_area");
                    if (area) enhanceReplyActions(area, view);
                    for (const node of addedNodes) if (node.nodeType === 1) enhanceImages(node);
                  }
                });
                observer.observe(main, { childList: true, subtree: true });
                view.addEventListener("pagehide", () => observer.disconnect(), { once: true });
                createReplyFolding(options.autoFold, doc).enhance(doc);
                syncOnce(doc);
              } catch {
                /* A sign-in redirect may leave the same-origin frame. */
              } finally {
                frame.style.removeProperty("visibility");
              }
            });
          }),
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
    },
  };
}
