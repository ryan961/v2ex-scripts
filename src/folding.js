import { t } from "./i18n.js";
import { button, element, matching, owned } from "./dom.js";

const readableHeight = 250;
const foldThreshold = 550 - readableHeight;

export function createReplyFolding(enabled = true, doc = document) {
  const view = doc.defaultView,
    watched = new Set(),
    completed = new WeakSet();
  if (!enabled) return { enhance() {}, destroy() {} };
  const observer =
    typeof view.ResizeObserver === "function"
      ? new view.ResizeObserver((entries) => {
          for (const { target } of entries) check(target);
        })
      : null;
  function check(content) {
    if (!content.isConnected || content.parentElement?.classList.contains("v2p-reply-content"))
      return;
    if (content.getBoundingClientRect().height < foldThreshold) return;
    observer?.unobserve(content);
    watched.delete(content);
    content.removeEventListener("load", onLoad, true);
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
    check(event.currentTarget);
  }
  function enhance(root) {
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
        !content.querySelector("img,pre,blockquote,ul,ol,table")
      )
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
