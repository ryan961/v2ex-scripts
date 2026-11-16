import { t } from "./i18n.js";
import { button, element, matching, memberName, modal, owned, safeURL } from "./dom.js";
import { computePosition, flip, offset, shift } from "@floating-ui/dom";
import { blockMember, fetchMember } from "./member-data.js";

export function createMembers(store, options, topics, currentAccount) {
  const registered = new WeakSet(),
    byName = new Map();
  function edit(name) {
    const dialog = modal(t("editTags", name), true);
    Object.assign(dialog.root.style, {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    });
    dialog.main.style.height = "auto";
    const form = element("div", undefined, "v2p-tag-input-wrapper");
    Object.assign(form.style, {
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "15px",
    });
    const label = element("label", t("tagInstructions"));
    const input = element("textarea");
    input.className = "sl";
    input.rows = 4;
    input.style.width = "100%";
    input.value = store.getTags(name).join(", ");
    label.append(input);
    const error = element("p");
    form.append(label, error);
    dialog.content.append(form);
    dialog.footer.append(
      button(t("saveTags"), () => {
        try {
          store.setTags(name, input.value);
          draw(name);
          dialog.close();
        } catch (cause) {
          error.textContent = cause.message;
        }
      }),
    );
    input.focus();
  }
  function draw(name, only) {
    const groups = byName.get(name.toLowerCase());
    for (const group of only ? [only] : (groups ?? [])) {
      if (!group.isConnected) {
        groups?.delete(group);
        continue;
      }
      const tags = store.getTags(name);
      group.replaceChildren();
      if (tags.length) group.append(element("b", "#"), `\u00A0${tags.join("\uFF0C")}`);
      group.title = tags.join("\uFF0C");
      group.hidden = !tags.length;
    }
  }
  function enhance(root) {
    if (!options.tags) return;
    for (const link of matching(root, 'strong a[href^="/member/"], .header a[href^="/member/"]')) {
      const name = memberName(link);
      if (
        !name ||
        !link.textContent.trim() ||
        registered.has(link) ||
        link.closest("[data-vx-owned],#Rightbar,#Bottom")
      )
        continue;
      registered.add(link);
      const key = name.toLowerCase();
      const group = owned(
        element("div", undefined, "vx-tags v2p-reply-tags v2p-reply-tags-inline"),
      );
      group.setAttribute("role", "button");
      group.tabIndex = 0;
      group.setAttribute("aria-label", t("editTags", name));
      group.addEventListener("click", () => edit(name));
      group.addEventListener("keydown", (event) => {
        if (event.key === "Enter") edit(name);
      });
      const header = link.closest(".header");
      const author = link.closest("strong");
      const badges = author?.parentElement.querySelector(":scope > .badges");
      if (header) {
        group.classList.remove("v2p-reply-tags-inline");
        header.append(group);
      } else if (badges) badges.before(group);
      else (author ?? link).after(group);
      if (!byName.has(key)) {
        byName.set(key, new Set());
        store.watchTags(name, () => draw(name));
      }
      byName.get(key).add(group);
      draw(name, group);
    }
  }
  if (options.userCards || options.tags) initCards();
  function initCards() {
    const cache = new Map();
    const popup = owned(element("div", undefined, "v2p-popup"));
    popup.hidden = true;
    const content = element("div", undefined, "v2p-popup-content");
    popup.append(content);
    (document.querySelector("#Wrapper") ?? document.body).append(popup);
    let timer,
      closeTimer,
      active,
      controller,
      sequence = 0;

    function hide() {
      clearTimeout(timer);
      clearTimeout(closeTimer);
      controller?.abort();
      popup.hidden = true;
      active = null;
      sequence++;
    }

    function render(name, data = null, initialAvatar) {
      const card = element("div", undefined, "v2p-member-card");
      const info = element("div", undefined, "v2p-info"),
        left = element("div", undefined, "v2p-info-left"),
        right = element("div", undefined, "v2p-info-right");
      const avatar = safeURL(
        data?.avatar_large ?? data?.avatar_normal ?? initialAvatar,
        location.href,
        true,
      );
      const avatarLink = element("a", undefined, "v2p-avatar-box");
      avatarLink.href = `/member/${name}`;
      if (avatar) {
        const image = element("img", undefined, "v2p-avatar");
        image.src = avatar;
        image.alt = name;
        avatarLink.append(image);
      }
      left.append(avatarLink);
      const username = element("div", undefined, "v2p-username"),
        link = element("a", name);
      link.href = `/member/${name}`;
      for (const target of [avatarLink, link]) {
        target.target = options.newTab ? "_blank" : "_self";
        target.rel = "noopener noreferrer";
      }
      username.append(link);
      const number = element("div", data ? t("memberNumber", data.id) : "", "v2p-no");
      const created = new Date(Number(data?.created) * 1000);
      const date =
        data && Number.isFinite(created.getTime())
          ? `${created.getFullYear()}-${String(created.getMonth() + 1).padStart(2, "0")}-${String(created.getDate()).padStart(2, "0")}`
          : "";
      const joined = element("div", date ? t("joined", date) : "", "v2p-created-date");
      if (!data) {
        number.classList.add("v2p-loading");
        joined.classList.add("v2p-loading");
      }
      right.append(username, number, joined);
      const days = Math.ceil((Date.now() / 1000 - Number(data?.created)) / 86400);
      if (data && days >= 0 && days <= 30) {
        const recent = element("div", t("recentMember", days <= 15 ? 15 : 30), "v2p-register-days");
        recent.style.margin = "5px 0";
        right.append(recent);
      }
      info.append(left, right);
      card.append(info);
      if (data?.bio?.trim()) card.append(element("div", data.bio, "v2p-bio"));
      if (data?.topics?.length) {
        const section = element("div", undefined, "v2p-member-topics");
        const list = element("div", undefined, "v2p-member-topics-list");
        section.append(element("div", t("recentTopics"), "v2p-member-topics-header"), list);
        for (const topic of data.topics) {
          const row = element("div", undefined, "v2p-member-topic-item-row");
          const topicLink = element("a", topic.title, "v2p-member-topic-item");
          topicLink.href = topic.url;
          topicLink.title = topic.title;
          topicLink.target = options.newTab ? "_blank" : "_self";
          topicLink.rel = "noopener noreferrer";
          row.append(topicLink);
          list.append(row);
        }
        card.append(section);
        topics?.enhance(section);
      }
      const actions = element("div", undefined, "v2p-member-card-actions");
      if (options.tags) {
        const control = button(t("addTags"), () => {
          hide();
          edit(name);
        });
        control.classList.add("v2p-btn-small");
        actions.append(control);
      }
      const block = button(t("blockMember"), async () => {
        if (block.disabled || !window.confirm(t("confirmBlock", name))) return;
        block.disabled = true;
        block.classList.add("v2p-btn-loading");
        block.textContent = t("blocking");
        try {
          await blockMember(name);
          for (const row of document.querySelectorAll('.cell[id^="r_"]')) {
            if (
              !row.closest("#Main") ||
              memberName(row.querySelector('strong a[href^="/member/"]'))?.toLowerCase() !==
                name.toLowerCase()
            )
              continue;
            if (row.querySelector(":scope > .v2p-blocked-notice")) continue;
            row.classList.add("v2p-blocked-reply");
            const notice = owned(element("div", `${t("blocked")} \u00b7 `, "v2p-blocked-notice"));
            const toggle = element("a", t("show"), "v2p-blocked-toggle");
            toggle.tabIndex = 0;
            toggle.setAttribute("role", "button");
            const reveal = () => {
              const visible = row.classList.toggle("v2p-blocked-revealed");
              toggle.textContent = visible ? t("hide") : t("show");
            };
            toggle.addEventListener("click", reveal);
            toggle.addEventListener("keydown", (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                reveal();
              }
            });
            notice.append(toggle);
            row.prepend(notice);
          }
          hide();
        } catch (error) {
          block.disabled = false;
          block.classList.remove("v2p-btn-loading");
          block.textContent = t("blockMember");
          content.append(element("p", error.message));
        }
      });
      block.classList.add("v2p-btn-small");
      if (currentAccount && currentAccount.toLowerCase() !== name.toLowerCase())
        actions.append(block);
      if (actions.childElementCount) card.append(actions);
      content.replaceChildren(card);
    }

    function position(anchor) {
      const request = sequence;
      void computePosition(anchor, popup, {
        placement: "right-start",
        middleware: [offset({ mainAxis: 8, crossAxis: -4 }), flip(), shift({ padding: 8 })],
      })
        .then(({ x, y }) => {
          if (request !== sequence) return;
          popup.style.left = `${x}px`;
          popup.style.top = `${y}px`;
        })
        .catch(() => {
          if (request === sequence) hide();
        });
    }

    document.addEventListener("pointerover", (event) => {
      if (popup.contains(event.target)) {
        clearTimeout(closeTimer);
        return;
      }
      if (event.target.closest?.(".v2p-modal-mask")) return;
      const link = event.target.closest?.('a[href^="/member/"]'),
        image = event.target.closest?.("img.avatar");
      const name =
          memberName(link) ?? (/^[a-z0-9_-]{1,64}$/i.test(image?.alt ?? "") ? image.alt : null),
        anchor = link ?? image;
      if (!name || !anchor || anchor === active) return;
      hide();
      active = anchor;
      const request = sequence;
      timer = setTimeout(async () => {
        const initialAvatar =
          image?.src ??
          link?.querySelector("img")?.src ??
          anchor.closest(".cell,.header,.box")?.querySelector("img.avatar")?.src;
        render(name, null, initialAvatar);
        popup.hidden = false;
        position(anchor);
        if (!options.userCards) return;
        const key = name.toLowerCase(),
          cached = cache.get(key);
        if (cached?.expires > Date.now()) {
          if (cached.banned) content.replaceChildren(element("span", t("memberMissing")));
          else render(name, cached.data, initialAvatar);
          position(anchor);
          return;
        }
        const task = new AbortController();
        controller = task;
        const timeout = setTimeout(() => task.abort(), 10_000);
        try {
          const data = await fetchMember(name, task.signal);
          if (request !== sequence || task.signal.aborted) return;
          if (cache.size >= 100) cache.delete(cache.keys().next().value);
          cache.set(key, { data, expires: Date.now() + 600_000 });
          render(name, data, initialAvatar);
          position(anchor);
        } catch (error) {
          task.abort();
          if (request !== sequence) return;
          if (error.status === 404) {
            if (cache.size >= 100) cache.delete(cache.keys().next().value);
            cache.set(key, { banned: true, expires: Date.now() + 600_000 });
          }
          content.replaceChildren(
            element("span", error.name === "AbortError" ? t("memberTimeout") : error.message),
          );
        } finally {
          clearTimeout(timeout);
          if (controller === task) controller = null;
        }
      }, 350);
    });
    document.addEventListener("pointerout", (event) => {
      if (!active || (!active.contains(event.target) && !popup.contains(event.target))) return;
      if (
        event.relatedTarget &&
        (popup.contains(event.relatedTarget) || active.contains(event.relatedTarget))
      )
        return;
      closeTimer = setTimeout(hide, 350);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") hide();
    });
    window.addEventListener("scroll", hide, { passive: true });
  }
  return { enhance, edit };
}
