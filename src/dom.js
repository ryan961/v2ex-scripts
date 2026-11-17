import { t } from "./i18n.js";

export function isV2EXPage(doc) {
  return Boolean(doc?.querySelector("#Top") && doc.querySelector("#Main"));
}

export function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

export function button(text, onClick) {
  const node = element("button", text, "normal button");
  node.type = "button";
  node.addEventListener("click", onClick);
  return node;
}

export function owned(node) {
  node.dataset.vxOwned = "";
  return node;
}

export function matching(root, selector) {
  return [...(root.matches?.(selector) ? [root] : []), ...root.querySelectorAll(selector)];
}

export function memberName(link) {
  if (!link?.getAttribute) return null;
  const path = link.getAttribute("href");
  return /^\/member\/([a-z0-9_-]{1,64})\/?$/i.exec(path ?? "")?.[1] ?? null;
}

export function currentUser(doc = document) {
  const links = doc.querySelectorAll(
    '#Top .tools a[href^="/member/"], #Top a.top[href^="/member/"]',
  );
  const top = [...links].map(memberName).find(Boolean);
  if (top) return top;
  const accountBox = doc.querySelector(
    '#Rightbar .box:has(a[href="/balance"]), #Rightbar .box:has(a[href="/my/nodes"])',
  );
  return memberName(accountBox?.querySelector('a[href^="/member/"]'));
}

export function safeURL(value, base, image = false) {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const url = new URL(value, base);
    if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) return null;
    if (image && url.protocol !== "https:") return null;
    return url.href;
  } catch {
    return null;
  }
}

const allowedTags = new Set(
  "A ABBR B BLOCKQUOTE BR CODE DEL DETAILS DIV EM H1 H2 H3 H4 H5 H6 HR I IMG LI OL P PRE S SMALL SPAN STRONG SUB SUMMARY SUP TABLE TBODY TD TH THEAD TR U UL".split(
    " ",
  ),
);

export function safeContent(source, base) {
  const fragment = document.createDocumentFragment();
  function append(parent, child) {
    if (child.nodeType === 3) {
      parent.append(document.createTextNode(child.textContent));
      return;
    }
    if (child.nodeType !== 1 || !allowedTags.has(child.tagName)) return;
    const copy = document.createElement(child.tagName.toLowerCase());
    if (child.tagName === "A") {
      const url = safeURL(child.getAttribute("href"), base);
      if (url) {
        copy.href = url;
        copy.target = "_blank";
        copy.rel = "noopener noreferrer";
      }
    }
    if (child.tagName === "IMG") {
      const url = safeURL(child.getAttribute("src"), base, true);
      if (!url) return;
      copy.src = url;
      copy.alt = child.getAttribute("alt") ?? "";
      copy.loading = "lazy";
      copy.referrerPolicy = "no-referrer";
    }
    for (const node of child.childNodes) append(copy, node);
    parent.append(copy);
  }
  for (const child of source.childNodes) append(fragment, child);
  return fragment;
}

export function modal(title, hasFooter = false) {
  const previousModal = [...document.querySelectorAll(".v2p-modal-mask")].at(-1);
  const mask = owned(element("div", undefined, "v2p-modal-mask"));
  const main = element("div", undefined, "v2p-modal-main");
  main.setAttribute("role", "dialog");
  main.setAttribute("aria-modal", "true");
  main.tabIndex = -1;
  const heading = element("div", title, "v2p-modal-title");
  heading.id = `vx-modal-${crypto.randomUUID()}`;
  main.setAttribute("aria-labelledby", heading.id);
  const actions = element("div", undefined, "v2p-modal-actions");
  const header = element("div", undefined, "v2p-modal-header");
  const content = element("div", undefined, "v2p-modal-content");
  const footer = element("div", undefined, hasFooter ? "v2p-modal-footer" : undefined);
  const previous = document.activeElement;
  const closeModal = () => {
    mask.remove();
    document.removeEventListener("keydown", onKey);
    previousModal?.removeAttribute("inert");
    if (!document.querySelector(".v2p-modal-mask"))
      document.body.classList.remove("v2p-modal-open");
    previous?.focus?.({ preventScroll: true });
  };
  const onKey = (event) => {
    if (mask.hasAttribute("inert")) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeModal();
    }
    if (event.key === "Tab") {
      const controls = [
        ...main.querySelectorAll('a[href],button,input,select,textarea,[tabindex="0"]'),
      ].filter((node) => !node.disabled && !node.hidden);
      const first = controls[0],
        last = controls.at(-1);
      if (event.shiftKey && (document.activeElement === first || document.activeElement === main)) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
  };
  const close = button(t("close"), closeModal);
  close.classList.add("v2p-modal-close-btn");
  close.append(element("kbd", "Esc"));
  close.setAttribute("aria-label", `${t("close")} ${title}`);
  actions.append(close);
  header.append(heading, actions);
  main.append(header, content, footer);
  mask.append(main);
  let down;
  mask.addEventListener("mousedown", (event) => {
    down = event.target;
  });
  mask.addEventListener("mouseup", (event) => {
    if (down === mask && event.target === mask) closeModal();
  });
  document.addEventListener("keydown", onKey);
  previousModal?.setAttribute("inert", "");
  document.body.append(mask);
  document.body.classList.add("v2p-modal-open");
  main.focus({ preventScroll: true });
  return { root: mask, main, title: heading, actions, content, footer, close: closeModal };
}

export function syncOnce(doc, pageWindow = globalThis.unsafeWindow) {
  const input = doc.querySelector('input[name="once"]');
  const scriptToken = [...doc.scripts]
    .map((script) => /\bvar\s+once\s*=\s*["'](\d+)["']/.exec(script.textContent)?.[1])
    .find(Boolean);
  const token = input?.value ?? scriptToken;
  if (!token || !/^\d+$/.test(token)) return;
  for (const field of document.querySelectorAll('form input[name="once"]')) field.value = token;
  if (pageWindow && "once" in pageWindow) pageWindow.once = token;
}

export function createHTTP(fetcher = fetch) {
  let tail = Promise.resolve();
  return (path) => {
    const task = tail.then(async () => {
      const url = new URL(path, location.href);
      if (url.origin !== location.origin) throw new Error(t("requestOrigin"));
      const response = await fetcher(url.href, {
        credentials: "same-origin",
        signal: AbortSignal.timeout(15_000),
      });
      if (!response.ok) throw new Error(t("requestHTTP", response.status));
      const final = new URL(response.url || url.href);
      const rewardRedirect =
        url.pathname === "/mission/daily/redeem" && final.pathname === "/mission/daily";
      if (final.origin !== url.origin || (final.pathname !== url.pathname && !rewardRedirect))
        throw new Error(t("requestRedirected"));
      const doc = new DOMParser().parseFromString(await response.text(), "text/html");
      if (!doc.querySelector("#Main")) throw new Error(t("requestUnexpected"));
      syncOnce(doc);
      return doc;
    });
    // The queue only needs completion, not the last parsed document.
    tail = task.then(
      () => undefined,
      () => undefined,
    );
    return task;
  };
}
