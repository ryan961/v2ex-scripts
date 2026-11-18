import { t } from "./i18n.js";
import { button, element, matching, owned } from "./dom.js";

const readableHeight = 250;
const foldThreshold = 550 - readableHeight;

export function createReplyFolding(enabled = true, doc = document) {
  const view = doc.defaultView,
    watched = new Set(),
    pending = new Set(),
    completed = new WeakSet();
  if (!enabled) return { enhance() {}, destroy() {} };
  let frame = null,
    destroyed = false;
  const observer =
    typeof view.ResizeObserver === "function"
      ? new view.ResizeObserver((entries) => {
          for (const { target } of entries) schedule(target);
        })
      : null;
  function unwatch(content) {
    observer?.unobserve(content);
    watched.delete(content);
    pending.delete(content);
    content.removeEventListener("load", onLoad, true);
  }
  function flush() {
    frame = null;
    const measurements = [];
    for (const content of pending) {
      if (!content.isConnected || content.parentElement?.classList.contains("v2p-reply-content")) {
        unwatch(content);
        continue;
      }
      measurements.push([content, content.getBoundingClientRect().height]);
    }
    pending.clear();
    // Measure the whole batch before inserting wrappers to avoid repeated style and layout work.
    for (const [content, height] of measurements) if (height >= foldThreshold) fold(content);
  }
  function schedule(content) {
    if (destroyed || !watched.has(content)) return;
    pending.add(content);
    if (frame === null) frame = view.requestAnimationFrame(flush);
  }
  function fold(content) {
    unwatch(content);
    completed.add(content);
    const wrapper = owned(element("div", undefined, "v2p-reply-content v2p-collapsed"));
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
    schedule(event.currentTarget);
  }
  function enhance(root) {
    if (destroyed) return;
    const contents = new Set(matching(root, ".reply_content"));
    const parent = root.closest?.(".reply_content");
    if (parent) contents.add(parent);
    for (const content of contents) {
      if (
        !content.closest("#Main") ||
        completed.has(content) ||
        content.parentElement?.classList.contains("v2p-reply-content")
      )
        continue;
      if (
        content.textContent.length < 300 &&
        !content.querySelector("img,pre,blockquote,ul,ol,table,br,p,div")
      )
        continue;
      if (!watched.has(content)) {
        watched.add(content);
        observer?.observe(content);
        content.addEventListener("load", onLoad, true);
      }
      schedule(content);
    }
  }
  function onResize() {
    for (const content of watched) {
      if (content.isConnected) schedule(content);
      else unwatch(content);
    }
  }
  function destroy() {
    destroyed = true;
    observer?.disconnect();
    if (frame !== null) view.cancelAnimationFrame(frame);
    frame = null;
    pending.clear();
    for (const content of watched) content.removeEventListener("load", onLoad, true);
    watched.clear();
    view.removeEventListener("resize", onResize);
    view.removeEventListener("pagehide", onPageHide);
  }
  function onPageHide(event) {
    if (!event.persisted) destroy();
  }
  if (!observer) view.addEventListener("resize", onResize, { passive: true });
  view.addEventListener("pagehide", onPageHide);
  return { enhance, destroy };
}
