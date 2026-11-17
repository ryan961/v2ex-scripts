import { element, matching, modal, safeURL } from "./dom.js";
import { t } from "./i18n.js";

const imageSelector =
  ":is(.topic_content, .reply_content, .subtle .markdown_body) img:not(.v2p-emoji-img)";

export function enhanceImages(root) {
  for (const image of matching(root, imageSelector)) {
    if (image.closest("a, button")) continue;
    image.tabIndex = 0;
    image.setAttribute("role", "button");
    image.setAttribute("aria-label", image.alt || t("imagePreview"));
  }
}

function activateImage(event) {
  if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey)
    return;
  const target = event.target;
  const byKey = event.type === "keydown";
  if (byKey) {
    if (
      event.repeat ||
      !["Enter", " "].includes(event.key) ||
      !target.matches?.('img[role="button"]')
    )
      return;
  } else if (event.button !== 0) return;

  let source = target;
  if (target.matches?.("a[href]") && target.childElementCount === 1 && !target.textContent.trim())
    source = target.querySelector("img");
  if (!source?.matches?.(imageSelector) || source.closest("button")) return;

  const base = source.baseURI;
  const thumbnail = safeURL(source.currentSrc || source.src, base);
  if (!thumbnail) return;
  const link = source.closest("a[href]");
  const original = link && safeURL(link.href, base);
  if (link && original !== thumbnail && original !== source.src) {
    if (!original || !/\.(avif|bmp|gif|ico|jpe?g|png|svg|webp)$/i.test(new URL(original).pathname))
      return;
  }

  event.preventDefault();
  event.stopPropagation();
  (link ?? source).focus({ preventScroll: true });
  const viewer = modal(t("imagePreview"));
  viewer.root.classList.add("vx-image-viewer");
  const image = element("img");
  image.alt = source.alt;
  image.referrerPolicy = "no-referrer";
  image.addEventListener("error", () => {
    if (image.src !== thumbnail) image.src = thumbnail;
    else {
      const status = element("p", t("imageLoadFailed"));
      status.setAttribute("role", "status");
      image.replaceWith(status);
    }
  });
  viewer.content.append(image);
  image.src = original || thumbnail;
}

export function installImageViewer(main) {
  main.addEventListener("click", activateImage, true);
  main.addEventListener("keydown", activateImage, true);
}
