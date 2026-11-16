import { button, element, matching, memberName, owned, safeContent } from "./dom.js";

export const REPLY = '.cell[id^="r_"]';

export function thanksCount(node) {
  const header = node.querySelector(".flex-one-row") ?? node;
  const heart = [
    ...header.querySelectorAll('img[alt="\u2764\uFE0F"], img[src*="heart"], .v2p-icon-heart'),
  ].find((image) => image.closest(REPLY) === node && !image.closest(".reply_content"));
  const text =
    heart?.parentElement.textContent ??
    node.querySelector(".thank_area .thank_count, .thank_count")?.textContent ??
    "";
  return Number.parseInt(text.replace(/,/g, "").match(/\d+/)?.[0] ?? "0", 10);
}

export function parseReply(node) {
  if (!/^r_\d+$/.test(node.id)) return null;
  const author = node.querySelector('strong a[href^="/member/"]');
  return {
    id: node.id,
    node,
    name: memberName(author) ?? "unknown",
    floor:
      Number.parseInt(node.querySelector(".no")?.textContent ?? "0", 10) ||
      Number(node.id.slice(2)),
    thanks: thanksCount(node),
  };
}

export function rankReplies(replies, limit = 10) {
  return [...replies]
    .filter((reply) => reply.thanks > 0)
    .sort((left, right) => right.thanks - left.thanks || left.floor - right.floor)
    .slice(0, limit);
}

export function pageCount(doc, topicPath) {
  const pages = [Number(new URL(location.href).searchParams.get("p")) || 1];
  for (const link of doc.querySelectorAll('a[href*="p="]')) {
    const url = new URL(link.getAttribute("href"), location.href);
    if (url.origin !== location.origin || url.pathname !== topicPath) continue;
    const page = Number(url.searchParams.get("p"));
    if (Number.isInteger(page) && page > 0 && page <= 100_000) pages.push(page);
  }
  const input = doc.querySelector("input.page_input[max]");
  if (input && Number(input.max) > 0 && Number(input.max) <= 100_000) pages.push(Number(input.max));
  return Math.max(...pages);
}

export function initReplies({ options, getDocument, enhance }) {
  if (!/^\/t\/\d+\/?$/.test(location.pathname)) return null;
  const first = document.querySelector(REPLY);
  if (!first) return null;
  const container = first.parentElement;
  const replies = new Map();
  const current = Number(new URL(location.href).searchParams.get("p")) || 1;
  const loaded = new Set([current]);
  let total = pageCount(document, location.pathname);
  let next = current + 1;
  let busy = false;
  let limit = 10;
  let signature = "";
  const panel = owned(element("section", undefined, "box vx-hot"));
  panel.id = "vx-hot";
  const summary = element("p");
  const list = element("div");
  const more = button("Show more", () => {
    limit += 10;
    render();
  });
  panel.append(element("h3", "Popular replies"), summary, list, more);
  if (options.hotReplies)
    (document.querySelector("#Rightbar") ?? container.parentElement).append(panel);

  const toolbar = owned(element("div", undefined, "vx-toolbar"));
  const status = element("span");
  const loadButton = button("Load next page", () => void loadNext());
  toolbar.append(status, loadButton);
  first.before(toolbar);

  function render() {
    status.textContent = `Loaded ${loaded.size}/${total} pages (${[...loaded].sort((a, b) => a - b).join(", ")}); ${replies.size} replies. `;
    loadButton.disabled = busy || next > total;
    loadButton.hidden = next > total;
    if (!options.hotReplies) return;
    summary.textContent = "Ranked by thanks on loaded pages only.";
    const ranked = rankReplies(replies.values(), limit);
    const nextSignature =
      ranked.map((reply) => `${reply.id}:${reply.thanks}`).join("|") + `:${limit}`;
    if (nextSignature === signature) return;
    signature = nextSignature;
    const fragment = document.createDocumentFragment();
    for (const reply of ranked) {
      const item = element("article", undefined, "vx-hot-item");
      const jump = element("a", `#${reply.floor} ${reply.name} - ${reply.thanks} thanks`);
      jump.href = `#${reply.id}`;
      const content = element("details");
      content.append(
        element(
          "summary",
          (reply.node.querySelector(".reply_content")?.textContent ?? "").slice(0, 140) ||
            "Read reply",
        ),
      );
      content.addEventListener("toggle", () => {
        if (content.open && !content.dataset.loaded) {
          content.dataset.loaded = "true";
          const body = reply.node.querySelector(".reply_content");
          if (body) content.append(safeContent(body, location.href));
        }
      });
      item.append(jump, content);
      fragment.append(item);
    }
    if (!ranked.length) fragment.append(element("p", "No thanked replies on loaded pages."));
    list.replaceChildren(fragment);
    more.hidden = rankReplies(replies.values(), limit + 1).length <= limit;
  }

  function add(root) {
    let changed = false;
    for (const node of matching(root, REPLY)) {
      if (replies.has(node.id)) continue;
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
    render();
    const page = next;
    try {
      const url = new URL(location.href);
      url.search = "";
      url.searchParams.set("p", String(page));
      const doc = await getDocument(url.href);
      const rows = [...doc.querySelectorAll(REPLY)];
      if (!rows.length) throw new Error("No replies found. Open this page directly to verify it.");
      total = Math.max(total, pageCount(doc, location.pathname));
      const fragment = document.createDocumentFragment();
      const divider = owned(element("p", `Page ${page}`, "vx-page"));
      const source = element("a", " Open original page");
      source.href = url.href;
      divider.append(source);
      fragment.append(divider);
      const added = [];
      for (const row of rows) {
        if (replies.has(row.id)) continue;
        // Fetched replies are read-only; never import remote scripts or inline action handlers.
        const clean = element("div", undefined, "cell vx-loaded-reply");
        clean.id = row.id;
        const reply = parseReply(row);
        if (!reply) continue;
        const meta = element("div");
        const author = element("strong");
        const member = element("a", reply.name);
        member.href = `/member/${reply.name}`;
        author.append(member);
        meta.append(
          author,
          " ",
          element("span", String(reply.floor), "no"),
          ` - ${reply.thanks} thanks`,
        );
        const body = element("div", undefined, "reply_content");
        const original = row.querySelector(".reply_content");
        if (original) body.append(safeContent(original, url.href));
        clean.append(meta, body);
        fragment.append(clean);
        replies.set(clean.id, { ...reply, node: clean });
        added.push(clean);
      }
      const last = [...replies.values()]
        .map((reply) => reply.node)
        .filter((node) => node.parentElement === container)
        .at(-1);
      if (last) last.after(fragment);
      else container.append(fragment);
      for (const row of added) enhance(row);
      loaded.add(page);
      next++;
      return true;
    } catch (error) {
      status.textContent = `Page ${page} failed: ${error.message} `;
      return false;
    } finally {
      busy = false;
      loadButton.disabled = next > total;
      if (loaded.has(page)) render();
    }
  }

  add(document);
  render();
  return {
    add,
    update(node) {
      const reply = replies.get(node.id);
      if (reply && !node.classList.contains("vx-loaded-reply")) {
        const count = thanksCount(node);
        if (count !== reply.thanks) {
          reply.thanks = count;
          render();
        }
      }
    },
    async preload() {
      for (let index = 0; index < options.preloadPages; index++) {
        if (!(await loadNext())) break;
      }
    },
    replies,
  };
}
