import { t } from "./i18n.js";
import { button, element, matching, memberName, owned, safeURL } from "./dom.js";
import { captureImportedActions, enhanceReplyActions, REPLY } from "./reply-actions.js";
import { createPagination } from "./pagination.js";

export { enhanceReplyActions, REPLY } from "./reply-actions.js";

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
  const pages = [1];
  for (const link of doc.querySelectorAll("a.page_normal[href], a.page_current[href]")) {
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
    if (
      Number.isInteger(Number(input.max)) &&
      Number(input.max) > 0 &&
      Number(input.max) <= 100_000
    )
      pages.push(Number(input.max));
  return Math.max(...pages);
}

export function importReply(row, base) {
  const copy = row.cloneNode(true);
  captureImportedActions(copy, base);
  for (const node of copy.querySelectorAll(
    "script,style,iframe,object,embed,link,meta,base,form,input,button",
  )) {
    const treeRow = node.closest(`${REPLY}[data-depth]`);
    if (
      node.matches("button.reply-toggle,button.reply-tree-more") &&
      /^\d{1,5}$/.test(treeRow?.dataset.depth ?? "") &&
      (node.classList.contains("reply-tree-more") || node.parentElement === treeRow) &&
      !node.closest(".reply_content")
    ) {
      // Native tree actions are delegated; rebuild only their inert controls.
      const toggle = element("button", node.textContent);
      toggle.type = "button";
      toggle.className = ["reply-toggle", "reply-toggle-big", "reply-tree-more"]
        .filter((name) => node.classList.contains(name))
        .join(" ");
      for (const name of ["aria-expanded", "aria-label", "title"])
        if (node.hasAttribute(name)) toggle.setAttribute(name, node.getAttribute(name));
      node.replaceWith(toggle);
    } else node.remove();
  }
  for (const node of [copy, ...copy.querySelectorAll("*")]) {
    const treeRow = node.matches(`${REPLY}[data-depth]`);
    const treeLine =
      node.matches(".reply-tree-line") && node.parentElement?.matches(`${REPLY}[data-depth]`);
    const depth = treeRow && !node.closest(".reply_content") ? node.dataset.depth : "";
    const displayDepth = treeRow ? node.style.getPropertyValue("--depth").trim() : "";
    const level =
      treeLine && !node.closest(".reply_content")
        ? node.style.getPropertyValue("--level").trim()
        : "";
    for (const attr of [...node.attributes]) {
      if (
        /^on/i.test(attr.name) ||
        attr.name.startsWith("data-vx-") ||
        ["srcdoc", "style", "srcset", "name"].includes(attr.name)
      )
        node.removeAttribute(attr.name);
    }
    if (/^\d{1,5}$/.test(depth))
      node.style.setProperty("--depth", /^\d{1,5}$/.test(displayDepth) ? displayDepth : depth);
    if (/^\d{1,5}$/.test(level)) node.style.setProperty("--level", level);
    for (const attr of ["href", "src"]) {
      if (!node.hasAttribute(attr)) continue;
      const value = safeURL(node.getAttribute(attr), base, attr === "src");
      if (value) {
        const url = new URL(value);
        node.setAttribute(
          attr,
          attr === "href" &&
            url.origin === location.origin &&
            /^\/member\/[^/]+\/?$/.test(url.pathname) &&
            !url.search &&
            !url.hash
            ? url.pathname
            : value,
        );
      } else node.removeAttribute(attr);
    }
    if (node.tagName === "IMG") node.loading = "lazy";
  }
  return copy;
}

// Ported from V2EX.REP show-top-replies.ts and cloneReplyElement; see third-party notices.
export function cloneTopReply(reply) {
  const cloned = reply.node.cloneNode(true);
  cloned.id = `top_${reply.id}`;
  for (const child of cloned.querySelectorAll(
    ".cell,.v2p-topic-reply-ref,.nested,.thank_area,.reply-toggle,.reply-tree-line,.reply-tree-join,.reply-tree-more",
  ))
    child.remove();
  for (const wrapper of cloned.querySelectorAll(".v2p-reply-content")) {
    const content = wrapper.querySelector(".reply_content");
    if (content) wrapper.replaceWith(content);
  }
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
    toolbox.classList.add("vx-hot-meta");
    const likes = cloned.querySelector(".v2p-likes-box");
    if (likes) toolbox.prepend(likes);
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
  const container = first.parentElement,
    replies = new Map(),
    pages = new Map(),
    inFlight = new Map();
  const requested = Number(new URL(location.href).searchParams.get("p"));
  const current =
    Number.isInteger(requested) && requested >= 1 && requested <= 100_000 ? requested : 1;
  let total = Math.max(current, pageCount(document, location.pathname)),
    signature = "",
    panel,
    error;
  const toolbar = owned(element("div", undefined, "cell"));
  toolbar.dataset.vxPaging = "";
  const status = element("span");
  status.setAttribute("role", "status");
  const retry = button(t("retry"), () => {
    if (error) void paging.navigate(error.page);
  });
  toolbar.append(status, retry);
  const firstMarker = owned(element("span", undefined, "vx-page-start"));
  firstMarker.dataset.vxPageStart = String(current);
  first.before(firstMarker);
  pages.set(current, firstMarker);
  const paging = createPagination({ container, first, toolbar, pages, current, total, loadPage });
  const topClones = new Map();

  function render() {
    toolbar.hidden = !inFlight.size && !error;
    status.textContent = inFlight.size
      ? `${t("loadingPage", inFlight.keys().next().value)} `
      : error
        ? `${t("pageFailed", error.page, error.message)} `
        : "";
    retry.hidden = !error;
    retry.disabled = !!error && inFlight.has(error.page);
    paging.refresh(total, [...inFlight.keys()]);
    if (!options.hotReplies) return;
    const ranked = rankReplies(
      [...replies.values()].filter(
        ({ node }) =>
          !node.hidden &&
          node.style.display !== "none" &&
          !node.classList.contains("v2p-blocked-reply"),
      ),
    );
    const key = ranked.map((reply) => `${reply.id}:${reply.thanks}`).join("|");
    if (key === signature && panel && !ranked.some(({ id }) => topClones.get(id)?.dirty)) return;
    signature = key;
    if (!ranked.length) {
      if (panel?.previousElementSibling?.matches("[data-vx-hot-gap]"))
        panel.previousElementSibling.remove();
      panel?.remove();
      panel = null;
      topClones.clear();
      return;
    }
    const anchor = document.querySelector("#Rightbar .box");
    if (!anchor) return;
    if (!panel) {
      panel = owned(element("div", undefined, "box"));
      panel.id = "top_replies";
      const header = element("div", undefined, "cell");
      header.title = t("hotRepliesHelp");
      header.append(element("div", undefined, "fr"), element("span", t("hotReplies"), "fade"));
      panel.append(header);
      const gap = owned(element("div", undefined, "sep20"));
      gap.dataset.vxHotGap = "";
      anchor.after(gap, panel);
      if (options.theme !== "native")
        document.querySelector("#Wrapper")?.classList.add("sticky_rightbar");
    }
    const rankedIds = new Set(ranked.map((reply) => reply.id));
    for (const [id, cloned] of topClones) {
      if (rankedIds.has(id)) continue;
      cloned.node.remove();
      topClones.delete(id);
    }
    let previous = panel.firstElementChild;
    for (const reply of ranked) {
      let cloned = topClones.get(reply.id);
      if (!cloned || cloned.thanks !== reply.thanks || cloned.dirty) {
        const node = cloneTopReply(reply);
        cloned?.node.replaceWith(node);
        cloned = { node, thanks: reply.thanks };
        topClones.set(reply.id, cloned);
      }
      if (previous.nextElementSibling !== cloned.node) previous.after(cloned.node);
      previous = cloned.node;
    }
  }
  function add(root) {
    let changed = false;
    for (const node of matching(root, REPLY)) {
      if (!node.closest("#Main") || replies.get(node.id)?.node.isConnected) continue;
      const reply = parseReply(node);
      if (!reply) continue;
      replies.set(reply.id, reply);
      const cloned = topClones.get(reply.id);
      if (cloned) cloned.dirty = true;
      changed = true;
    }
    if (changed) render();
  }
  function loadPage(page) {
    if (!Number.isInteger(page) || page < 1 || page > total) return Promise.resolve(false);
    if (pages.has(page)) return Promise.resolve(true);
    if (inFlight.has(page)) return inFlight.get(page);
    if (error?.page === page) error = null;
    const task = Promise.resolve()
      .then(async () => {
        try {
          const url = new URL(location.href);
          url.search = "";
          url.searchParams.set("p", String(page));
          url.hash = "";
          const doc = await getDocument(url.href);
          const rows = [...doc.querySelectorAll(`#Main ${REPLY}`)];
          if (!rows.length) throw new Error(t("noReplies"));
          total = Math.max(total, pageCount(doc, location.pathname));
          const fragment = document.createDocumentFragment(),
            added = [];
          const marker = owned(element("span", undefined, "vx-page-start"));
          marker.dataset.vxPageStart = String(page);
          fragment.append(marker);
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
          const next =
            [...pages].sort(([a], [b]) => a - b).find(([number]) => number > page)?.[1] ?? toolbar;
          next.before(fragment);
          pages.set(page, marker);
          for (const row of added) enhance(row);
          return true;
        } catch (failure) {
          error = { page, message: failure.message };
          return false;
        }
      })
      .finally(() => {
        inFlight.delete(page);
        render();
      });
    inFlight.set(page, task);
    render();
    return task;
  }
  add(document);
  render();
  return {
    add,
    replies,
    paging,
    get loaded() {
      return new Set(pages.keys());
    },
    invalidate(node) {
      const cloned = topClones.get(node.id);
      if (!cloned) return false;
      cloned.dirty = true;
      return true;
    },
    update(nodes) {
      let changed = false;
      for (const node of nodes) {
        const reply = replies.get(node.id);
        if (reply?.node !== node) continue;
        if (!node.isConnected || !node.closest("#Main")) replies.delete(node.id);
        else {
          enhanceReplyActions(node);
          reply.thanks = thanksCount(node);
        }
        changed = true;
      }
      if (changed) render();
    },
    async preload() {
      for (let page = current + 1; page <= Math.min(total, current + options.preloadPages); page++)
        if (!(await loadPage(page))) break;
    },
  };
}
