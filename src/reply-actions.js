import { t } from "./i18n.js";
import { element, matching, memberName, owned } from "./dom.js";
import { icon } from "./icons.js";

export const REPLY = '.cell[id^="r_"]';

const importedActions = new WeakMap();
const boundActions = new WeakSet();

export function captureImportedActions(root, base) {
  for (const anchor of root.querySelectorAll("a[onclick]")) {
    if (anchor.closest(".reply_content")) continue;
    const row = anchor.closest(REPLY);
    const id = Number(/^r_(\d+)$/.exec(row?.id ?? "")?.[1]);
    if (!Number.isSafeInteger(id) || id <= 0) continue;
    const author = [...row.querySelectorAll('strong a[href^="/member/"]')].find(
      (link) => link.closest(REPLY) === row,
    );
    const name = memberName(author);
    if (!name) continue;
    const source = anchor.getAttribute("onclick") ?? "";
    let kind;
    if (Number(/\bthankReply\(\s*(\d+)\s*\)/.exec(source)?.[1]) === id) kind = "thank";
    else if (Number(/\bignoreReply\(\s*(\d+)\s*,/.exec(source)?.[1]) === id) kind = "hide";
    else {
      const match = /\breplyOne\(\s*(['"])([a-z0-9_-]{1,64})\1\s*,\s*(\d+)\s*\)/i.exec(source);
      if (match && match[2].toLowerCase() === name.toLowerCase() && Number(match[3]) === id)
        kind = "reply";
    }
    if (!kind) continue;
    if (kind !== "reply" && anchor.closest(".thank_area")?.closest(REPLY) !== row) continue;
    const cost = /(?:Spend|\u82b1\u8d39)\s*(\d+)/i.exec(source)?.[1];
    const url = new URL(base);
    url.hash = row.id;
    anchor.href = url.href;
    importedActions.set(anchor, { kind, id, name, cost });
  }
}

function bindImportedAction(anchor, action, pageWindow) {
  if (boundActions.has(anchor)) return;
  boundActions.add(anchor);
  let pending = false;
  anchor.addEventListener("click", async (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0)
      return;
    const method = { thank: "thankReply", hide: "ignoreReply", reply: "replyOne" }[action.kind];
    if (typeof pageWindow?.[method] !== "function") return;
    event.preventDefault();
    if (
      pending ||
      (anchor.closest(".thank_area")?.classList.contains("thanked") && action.kind === "thank")
    )
      return;
    if (action.kind !== "reply") {
      const prompt =
        action.kind === "hide"
          ? t("confirmHide")
          : action.cost
            ? t("confirmThank", action.cost, action.name)
            : t("confirmThankUnknown", action.name);
      if (!window.confirm(prompt)) return;
    }
    pending = true;
    try {
      if (action.kind === "hide") {
        const fresh =
          typeof pageWindow.fetchOnce === "function"
            ? await pageWindow.fetchOnce({ fresh: true })
            : pageWindow.once;
        const token = /^\d+$/.test(String(fresh ?? ""))
          ? String(fresh)
          : String(pageWindow.once ?? "");
        if (!/^\d+$/.test(token)) throw new Error(t("accountChanged"));
        await pageWindow.ignoreReply(action.id, token);
      } else if (action.kind === "thank") {
        const result = pageWindow.thankReply(action.id);
        // shortcut: native thankReply can return before its request; allow retries after a short cooldown.
        await (result ?? new Promise((resolve) => setTimeout(resolve, 1500)));
      } else await pageWindow.replyOne(action.name, action.id);
    } catch {
      window.alert(t("actionFailed"));
    } finally {
      pending = false;
    }
  });
}

export function enhanceReplyActions(root, pageWindow = globalThis.unsafeWindow) {
  for (const anchor of matching(root, 'a[href*="#r_"]')) {
    const action = importedActions.get(anchor);
    if (action) bindImportedAction(anchor, action, pageWindow);
  }
  for (const area of matching(root, ".thank_area")) {
    const reply = area.closest(REPLY);
    if (!reply?.closest("#Main")) continue;
    area.classList.add("v2p-controls");
    for (const node of [...area.childNodes]) if (node.nodeType === 3) node.remove();
    for (const anchor of area.querySelectorAll("a")) {
      const source = `${anchor.getAttribute("href") ?? ""} ${anchor.getAttribute("onclick") ?? ""}`;
      const action =
        importedActions.get(anchor)?.kind ??
        (/ignoreReply\s*\(|\/ignore\/reply\//.test(source)
          ? "hide"
          : /thankReply\s*\(|\/thank\/reply\//.test(source)
            ? "thank"
            : null);
      if (!action || anchor.querySelector(".v2p-control")) continue;
      const control = owned(
        element("span", undefined, `v2p-control v2p-hover-btn v2p-control-${action}`),
      );
      control.append(icon(action === "hide" ? "eye-off" : "heart"));
      anchor.classList.remove("thank");
      anchor.style.removeProperty("color");
      anchor.title = action === "hide" ? t("hideReply") : t("thankReply");
      anchor.setAttribute("aria-label", anchor.title);
      anchor.replaceChildren(control);
    }
    if (area.classList.contains("thanked") && !area.querySelector(".v2p-control-thank")) {
      for (const node of [...area.childNodes]) if (node.nodeType === 3) node.remove();
      const thanked = owned(
        element("span", undefined, "v2p-control v2p-control-thank v2p-thanked"),
      );
      thanked.setAttribute("aria-label", t("thanked"));
      thanked.setAttribute("aria-disabled", "true");
      thanked.append(icon("heart"));
      area.append(thanked);
    }
    if (area.classList.contains("thanked"))
      for (const likes of reply.querySelectorAll(".v2p-likes-box"))
        if (likes.closest(REPLY) === reply) likes.classList.add("v2p-thanked");
  }
  for (const image of matching(root, 'img[alt="\u2764\uFE0F"], img[src*="/heart.png"]')) {
    const reply = image.closest(REPLY);
    if (!reply?.closest("#Main") || image.closest(".reply_content")) continue;
    const likes = image.closest(".small.fade");
    if (!likes) continue;
    likes.classList.add("v2p-likes-box");
    if (
      [...reply.querySelectorAll(".thank_area.thanked")].some(
        (area) => area.closest(REPLY) === reply,
      )
    )
      likes.classList.add("v2p-thanked");
    const heart = owned(element("span", undefined, "v2p-icon-heart"));
    heart.append(icon("heart"));
    image.replaceWith(heart);
  }
}
