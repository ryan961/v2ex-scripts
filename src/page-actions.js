import { button, element, owned } from "./dom.js";
import { t } from "./i18n.js";
import { icon } from "./icons.js";

export function installPageActions(signedIn, pageWindow = globalThis.unsafeWindow) {
  const controls = owned(element("div", undefined, "vx-page-actions"));
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

  const editor =
    signedIn && /^\/t\/\d+\/?$/.test(location.pathname)
      ? document.querySelector(
          "#Main #reply-box textarea:enabled:not([readonly]), #Main textarea#reply_content:enabled:not([readonly])",
        )
      : null;
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
