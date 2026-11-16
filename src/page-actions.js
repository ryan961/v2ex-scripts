import { button, element, owned } from "./dom.js";
import { t } from "./i18n.js";

export function installPageActions(signedIn) {
  const controls = owned(element("div", undefined, "vx-page-actions"));
  controls.setAttribute("role", "group");
  controls.setAttribute("aria-label", t("pageActions"));

  const top = button("\u2191", () => window.scrollTo({ top: 0 }));
  top.className = "vx-back-to-top";
  top.title = t("backToTop");
  top.setAttribute("aria-label", top.title);
  controls.append(top);

  const editor =
    signedIn && /^\/t\/\d+\/?$/.test(location.pathname)
      ? document.querySelector(
          "#Main #reply-box textarea:enabled:not([readonly]), #Main textarea#reply_content:enabled:not([readonly])",
        )
      : null;
  if (editor) {
    const reply = button(t("jumpToReply"), () => {
      editor.scrollIntoView({ block: "center" });
      editor.focus({ preventScroll: true });
    });
    reply.className = "vx-quick-reply";
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
