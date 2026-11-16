import { button, element, matching, memberName, owned, safeURL } from "./dom.js";
import { icon } from "./icons.js";

export const REPLY = '.cell[id^="r_"]';

export function enhanceReplyActions(root) {
  for (const area of matching(root, ".thank_area")) {
    const reply = area.closest(REPLY);
    if (!reply?.closest("#Main")) continue;
    area.classList.add("v2p-controls");
    for (const node of [...area.childNodes]) if (node.nodeType === 3) node.remove();
    for (const anchor of area.querySelectorAll("a")) {
      const source = `${anchor.getAttribute("href") ?? ""} ${anchor.getAttribute("onclick") ?? ""}`;
      const action = /ignoreReply\s*\(|\/ignore\/reply\//.test(source)
        ? "hide"
        : /thankReply\s*\(|\/thank\/reply\//.test(source)
          ? "thank"
          : null;
      if (!action || anchor.querySelector(".v2p-control")) continue;
      const control = owned(
        element("span", undefined, `v2p-control v2p-hover-btn v2p-control-${action}`),
      );
      control.append(icon(action === "hide" ? "eye-off" : "heart"));
      anchor.classList.remove("thank");
      anchor.style.removeProperty("color");
      anchor.setAttribute(
        "aria-label",
        action === "hide" ? "\u9690\u85cf\u56de\u590d" : "\u611f\u8c22\u56de\u590d",
      );
      anchor.replaceChildren(control);
    }
    if (area.classList.contains("thanked") && !area.querySelector(".v2p-control-thank")) {
      for (const node of [...area.childNodes]) if (node.nodeType === 3) node.remove();
      const thanked = owned(
        element("span", undefined, "v2p-control v2p-control-thank v2p-thanked"),
      );
      thanked.setAttribute("aria-label", "\u5df2\u611f\u8c22");
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

export function thanksCount(node) {
  const header = node.querySelector(".flex-one-row") ?? node;
  const heart = [
    ...header.querySelectorAll('img[alt="\u2764\uFE0F"],img[src*="heart"],.v2p-icon-heart'),
  ].find((image) => image.closest(REPLY) === node && !image.closest(".reply_content"));
  const text =
    heart?.nextSibling?.textContent ?? node.querySelector(".thank_count")?.textContent ?? "";
  return Number.parseInt(text.replace(/,/g, "").match(/\d+/)?.[0] ?? "0", 10);
}

export function parseReply(node) {
  if (!/^r_\d+$/.test(node.id)) return null;
  return {
    id: node.id,
    node,
    name: memberName(node.querySelector('strong a[href^="/member/"]')) ?? "unknown",
    floor:
      Number.parseInt(node.querySelector(".no")?.textContent ?? "0", 10) ||
      Number(node.id.slice(2)),
    thanks: thanksCount(node),
  };
}

export function rankReplies(replies, limit = Infinity) {
  return [...replies]
    .filter((reply) => reply.thanks > 0)
    .sort((a, b) => b.thanks - a.thanks || a.floor - b.floor)
    .slice(0, limit);
}

export function pageCount(doc, path) {
  const pages = [Number(new URL(location.href).searchParams.get("p")) || 1];
  for (const link of doc.querySelectorAll('a[href*="p="]')) {
    const url = new URL(link.getAttribute("href"), location.href);
    const page = Number(url.searchParams.get("p"));
    if (
      url.origin === location.origin &&
      url.pathname === path &&
      Number.isInteger(page) &&
      page > 0 &&
      page <= 100_000
    )
      pages.push(page);
  }
  for (const input of doc.querySelectorAll("input.page_input[max]"))
    if (Number(input.max) > 0 && Number(input.max) <= 100_000) pages.push(Number(input.max));
  return Math.max(...pages);
}

export function importReply(row, base) {
  const copy = row.cloneNode(true);
  for (const node of copy.querySelectorAll(
    "script,style,iframe,object,embed,link,meta,base,form,input,button",
  ))
    node.remove();
  for (const node of [copy, ...copy.querySelectorAll("*")]) {
    for (const attr of [...node.attributes]) {
      if (/^on/i.test(attr.name) || ["srcdoc", "style", "srcset", "name"].includes(attr.name))
        node.removeAttribute(attr.name);
    }
    for (const attr of ["href", "src"]) {
      if (!node.hasAttribute(attr)) continue;
      const value = safeURL(node.getAttribute(attr), base, attr === "src");
      if (value) node.setAttribute(attr, value);
      else node.removeAttribute(attr);
    }
    if (node.tagName === "IMG") node.loading = "lazy";
  }
  for (const actions of copy.querySelectorAll(".thank_area,.v2p-controls")) actions.remove();
  return copy;
}

// Ported from V2EX.REP show-top-replies.ts and cloneReplyElement; see third-party notices.
export function cloneTopReply(reply) {
  const cloned = reply.node.cloneNode(true);
  cloned.id = `top_${reply.id}`;
  for (const child of cloned.querySelectorAll(".cell,.v2p-topic-reply-ref,.nested")) child.remove();
  const floor = cloned.querySelector(".no");
  const toolbox = cloned.querySelector(".fr") ?? floor?.parentElement;
  if (floor && toolbox) {
    const jump = element("a", floor.textContent, "no");
    jump.href = `#${reply.id}`;
    jump.addEventListener("click", (event) => {
      event.preventDefault();
      reply.node.scrollIntoView({ block: "start" });
    });
    toolbox.replaceChildren(jump);
  }
  for (const node of cloned.querySelectorAll("[id]")) node.removeAttribute("id");
  const table = cloned.firstElementChild;
  if (table?.tagName === "TABLE") {
    const wrapper = element("div", undefined, "vr_wrapper");
    table.after(wrapper);
    wrapper.append(table);
  }
  const info = cloned.querySelector("td > .flex-one-row .flex-one-row:first-child");
  if (info) {
    const wrapper = element("div", undefined, "flex-one-row gap10");
    wrapper.style.width = "100%";
    for (const child of [...info.children]) if (child.tagName !== "STRONG") wrapper.append(child);
    info.append(wrapper);
  }
  return cloned;
}

export function initReplies({ options, getDocument, enhance }) {
  if (!/^\/t\/\d+\/?$/.test(location.pathname)) return null;
  const first = document.querySelector(`#Main ${REPLY}`);
  if (!first) return null;
  const container = first.parentElement;
  const replies = new Map();
  const current = Number(new URL(location.href).searchParams.get("p")) || 1;
  const loaded = new Set([current]);
  let total = pageCount(document, location.pathname),
    next = current + 1,
    busy = false,
    signature = "";
  let panel;
  const toolbar = owned(element("div", undefined, "cell"));
  toolbar.dataset.vxPaging = "";
  const status = element("span");
  status.setAttribute("role", "status");
  const loadButton = button("Load next page", () => void loadNext());
  toolbar.append(status, loadButton);
  container.append(toolbar);

  function render() {
    toolbar.hidden = !busy && next > total;
    loadButton.hidden = next > total;
    loadButton.disabled = busy;
    if (!options.hotReplies) return;
    const ranked = rankReplies(replies.values());
    const key = ranked.map((reply) => `${reply.id}:${reply.thanks}`).join("|");
    if (key === signature && panel) return;
    signature = key;
    panel?.previousElementSibling?.matches("[data-vx-hot-gap]") &&
      panel.previousElementSibling.remove();
    panel?.remove();
    panel = null;
    if (!ranked.length) return;
    panel = owned(element("div", undefined, "box"));
    panel.id = "top_replies";
    const header = element("div", undefined, "cell");
    header.title = "Ranked by thanks on loaded pages.";
    header.append(
      element("div", undefined, "fr"),
      element("span", "\u5f53\u524d\u9875\u70ed\u95e8\u56de\u590d", "fade"),
    );
    panel.append(header, ...ranked.map(cloneTopReply));
    const anchor = document.querySelector("#Rightbar .box");
    if (anchor) {
      const gap = owned(element("div", undefined, "sep20"));
      gap.dataset.vxHotGap = "";
      anchor.after(gap, panel);
      document.querySelector("#Wrapper")?.classList.add("sticky_rightbar");
    }
  }

  function add(root) {
    let changed = false;
    for (const node of matching(root, REPLY)) {
      if (!node.closest("#Main") || replies.has(node.id)) continue;
      const reply = parseReply(node);
      if (!reply) continue;
      replies.set(reply.id, reply);
      changed = true;
    }
    if (changed) render();
  }

  async function loadNext() {
    if (busy || next > total) return false;
    busy = true;
    status.textContent = "Loading replies... ";
    render();
    const page = next;
    try {
      const url = new URL(location.href);
      url.search = "";
      url.searchParams.set("p", String(page));
      const doc = await getDocument(url.href);
      const rows = [...doc.querySelectorAll(`#Main ${REPLY}`)];
      if (!rows.length) throw new Error("No replies found. Open this page directly to verify it.");
      total = Math.max(total, pageCount(doc, location.pathname));
      const fragment = document.createDocumentFragment();
      const added = [];
      for (const row of rows) {
        if (replies.has(row.id)) continue;
        const clean = importReply(row, url.href);
        for (const child of [...clean.querySelectorAll(REPLY)])
          if (replies.has(child.id)) child.remove();
        for (const node of matching(clean, REPLY)) {
          const reply = parseReply(node);
          if (reply) replies.set(reply.id, reply);
        }
        clean.dataset.vxLoaded = "";
        fragment.append(clean);
        added.push(clean);
      }
      toolbar.before(fragment);
      for (const row of added) enhance(row);
      loaded.add(page);
      next++;
      status.textContent = "";
      return true;
    } catch (error) {
      status.textContent = `Could not load replies: ${error.message} `;
      return false;
    } finally {
      busy = false;
      render();
    }
  }

  add(document);
  render();
  return {
    add,
    replies,
    loaded,
    update(node) {
      enhanceReplyActions(node);
      const reply = replies.get(node.id);
      if (reply && !node.hasAttribute("data-vx-loaded")) {
        const count = thanksCount(node);
        if (count !== reply.thanks) {
          reply.thanks = count;
          render();
        }
      }
    },
    async preload() {
      for (let index = 0; index < options.preloadPages; index++) if (!(await loadNext())) break;
    },
  };
}
