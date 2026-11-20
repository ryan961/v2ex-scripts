import { t } from "./i18n.js";
import {
  button,
  currentUser,
  element,
  isV2EXPage,
  matching,
  modal,
  owned,
  syncOnce,
} from "./dom.js";
import { applyTheme, THEME_STYLE_ID } from "./theme.js";
import { enhanceEmojis, initEmoji } from "./emoji.js";
import { createReplyFolding } from "./folding.js";
import { enhanceReplyActions } from "./reply-actions.js";
import { enhanceImages, imageMutationRoot, installImageViewer } from "./image-viewer.js";

export const PREVIEW_READY = "vx-preview-ready";
const contentLink = ":is(.topic_content, .reply_content, .subtle .markdown_body) a[href]";

function openCrossOriginLink(event) {
  if (event.defaultPrevented || event.button !== 0) return;
  const link = event.target.closest?.(contentLink);
  if (!link || link.hasAttribute("download")) return;
  if (link.target && link.target.toLowerCase() !== "_self") return;
  if (
    !["http:", "https:"].includes(link.protocol) ||
    link.origin === link.ownerDocument.location.origin
  )
    return;
  link.target = "_blank";
  link.relList.add("noopener");
}

export function createTopics(options, themeCSS = "") {
  const seen = new WeakSet();
  const imageProxy = options.imgurProxy ? options.imgurProxyURL : "";
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
            let enhancedDocument;
            const enhancePreview = () => {
              try {
                const doc = frame.contentDocument;
                if (!doc || doc === enhancedDocument) return;
                // The picker handles Escape on the document before the event reaches the window.
                doc.defaultView?.addEventListener("keydown", onPreviewKey);
                if (!isV2EXPage(doc)) return;
                enhancedDocument = doc;
                applyTheme(doc, true, options.theme);
                if (!doc.getElementById(THEME_STYLE_ID)) {
                  const style = doc.createElement("style");
                  style.id = THEME_STYLE_ID;
                  style.textContent = themeCSS;
                  doc.head.append(style);
                }
                enhanceEmojis(doc);
                if (options.emoji && currentUser(doc)) initEmoji(options, doc);
                enhanceImages(doc, imageProxy);
                const main = doc.getElementById("Main");
                installImageViewer(main, imageProxy);
                main.addEventListener("click", openCrossOriginLink);
                const view = doc.defaultView;
                enhanceReplyActions(doc, view);
                const observer = new view.MutationObserver((records) => {
                  let images;
                  for (const { type, target, addedNodes } of records) {
                    if (type === "attributes") {
                      const image = imageMutationRoot(target);
                      if (image) (images ??= new Set()).add(image);
                      continue;
                    }
                    const area = target.closest(".thank_area");
                    if (area) enhanceReplyActions(area, view);
                    for (const node of addedNodes)
                      if (node.nodeType === 1) enhanceImages(node, imageProxy);
                  }
                  if (images) {
                    for (const image of images)
                      if (main.contains(image)) enhanceImages(image, imageProxy);
                  }
                });
                observer.observe(main, {
                  childList: true,
                  subtree: true,
                  ...(imageProxy && { attributes: true, attributeFilter: ["src", "srcset"] }),
                });
                view.addEventListener("pagehide", () => observer.disconnect(), { once: true });
                createReplyFolding(options.autoFold, doc).enhance(doc);
                syncOnce(doc);
              } catch {
                /* A sign-in redirect may leave the same-origin frame. */
              } finally {
                frame.style.removeProperty("visibility");
              }
            };
            frame.addEventListener("load", enhancePreview);
            if (imageProxy) frame.addEventListener(PREVIEW_READY, enhancePreview);
            dialog.content.append(wrapper);
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
