import { t } from "./i18n.js";
import { button, element, matching, memberName, modal, owned, safeURL } from "./dom.js";
import { computePosition, flip, offset, shift } from "@floating-ui/dom";
import { blockMember, fetchMember, setMemberFollow } from "./member-data.js";
import { normalizeTags, TAG_LIMITS } from "./storage.js";

export function createMembers(store, options, topics, currentAccount) {
  const registered = new WeakSet(),
    byName = new Map();
  function updateTags(name, tags) {
    store.setTags(name, tags);
    draw(name);
  }
  function createTagEditor(name, onSave, tags = store.getTags(name)) {
    const form = element("div", undefined, "v2p-tag-input-wrapper");
    const meta = element("div", undefined, "vx-tag-editor-meta");
    const count = element("span", undefined, "vx-tag-editor-count");
    const box = element("div", undefined, "vx-tag-input");
    const fields = element("div", undefined, "vx-tag-fields");
    const hint = element("p", t("tagInstructions"));
    hint.id = `vx-tag-hint-${crypto.randomUUID()}`;
    const input = element("textarea");
    input.rows = 1;
    input.placeholder = t("tagEntry");
    input.setAttribute("aria-label", t("addTag"));
    input.setAttribute("aria-describedby", hint.id);
    const entry = element("div", undefined, "vx-tag-entry");
    const error = element("p");
    error.setAttribute("role", "alert");
    function syncLabels() {
      count.textContent = t("tagUsage", fields.childElementCount, TAG_LIMITS.perMember);
      [...fields.children].forEach((row, index) => {
        row.querySelector("textarea").setAttribute("aria-label", t("editableTag", index + 1));
      });
    }
    function showTags(values) {
      fields.replaceChildren();
      for (const tag of values) {
        const row = element("div", undefined, "vx-tag-field");
        const field = element("textarea");
        field.rows = 1;
        field.defaultValue = tag;
        field.maxLength = TAG_LIMITS.length;
        field.hidden = true;
        const edit = button(tag, () => {
          edit.hidden = true;
          row.classList.add("vx-tag-field-editing");
          field.hidden = false;
          field.focus();
          field.select();
        });
        edit.className = "vx-tag-edit-value";
        const remove = button("\u00d7", () => {
          const next = row.nextElementSibling ?? row.previousElementSibling;
          row.remove();
          syncLabels();
          error.textContent = "";
          (next?.querySelector(".vx-tag-edit-value") ?? input).focus();
        });
        remove.className = "vx-tag-remove-value";
        function updateLabels(value) {
          edit.textContent = value;
          edit.title = value;
          edit.setAttribute("aria-label", t("editTagValue", value));
          remove.setAttribute("aria-label", t("removeTagValue", value));
        }
        function finish(commit) {
          if (field.hidden) return;
          const value = (commit && field.value.trim()) || field.defaultValue;
          field.defaultValue = field.value = value;
          field.hidden = true;
          edit.hidden = false;
          row.classList.remove("vx-tag-field-editing");
          updateLabels(value);
        }
        field.addEventListener("blur", () => finish(true));
        field.addEventListener("keydown", (event) => {
          if (event.isComposing || (event.key !== "Enter" && event.key !== "Escape")) return;
          event.preventDefault();
          event.stopPropagation();
          finish(event.key === "Enter");
          edit.focus();
        });
        updateLabels(tag);
        row.append(edit, field, remove);
        fields.append(row);
      }
      syncLabels();
    }
    function readTags() {
      const values = [...fields.querySelectorAll("textarea")].map(
        (field) => field.value.trim() || field.defaultValue,
      );
      values.push(...input.value.split(/[,\uFF0C\n]/).map((tag) => tag.trim()));
      return normalizeTags([...new Set(values.filter(Boolean))]);
    }
    const add = button("+", () => {
      if (!input.value.trim()) {
        input.focus();
        return;
      }
      try {
        showTags(readTags());
        input.value = "";
        error.textContent = "";
      } catch (cause) {
        error.textContent = cause.message;
      }
      input.focus();
    });
    add.className = "vx-tag-add";
    add.title = t("addTag");
    add.setAttribute("aria-label", add.title);
    const save = button(t("saveTags"), () => {
      try {
        updateTags(name, readTags());
      } catch (cause) {
        error.textContent = cause.message;
        return;
      }
      onSave();
    });
    save.classList.add("special");
    input.addEventListener("keydown", (event) => {
      if (event.isComposing || event.ctrlKey || event.metaKey || event.altKey) return;
      if (
        ![",", "\uFF0C", "Enter"].includes(event.key) ||
        (event.key === "Enter" && event.shiftKey)
      )
        return;
      event.preventDefault();
      add.click();
    });
    input.addEventListener("paste", (event) => {
      const text = event.clipboardData?.getData("text");
      if (!text || !/[,\uFF0C\r\n]/.test(text)) return;
      event.preventDefault();
      input.setRangeText(text, input.selectionStart, input.selectionEnd, "end");
      add.click();
    });
    form.addEventListener("input", () => (error.textContent = ""));
    showTags(tags);
    entry.append(input, add);
    box.append(fields, entry);
    meta.append(hint, count);
    form.append(box, meta, error);
    return { form, input, save };
  }
  function edit(name) {
    const dialog = modal(t("editTags", name), true);
    dialog.root.classList.add("vx-tag-editor-dialog");
    const { form, input, save } = createTagEditor(name, dialog.close);
    dialog.content.append(form);
    dialog.footer.append(save);
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
      if (tags.length)
        group.append(element("b", "#"), element("span", tags.join("\uFF0C"), "vx-tags-text"));
      group.title = tags.join("\uFF0C");
      group.hidden = !tags.length;
    }
  }
  function enhance(root) {
    if (!options.tags) return;
    for (const link of matching(root, 'strong a[href^="/member/"], .header a[href^="/member/"]')) {
      const name = memberName(link);
      const topicInfo = link.closest(".topic_info");
      if (
        !name ||
        !link.textContent.trim() ||
        registered.has(link) ||
        link.closest("[data-vx-owned],#Rightbar,#Bottom") ||
        (topicInfo && topicInfo.querySelector('strong a[href^="/member/"]') !== link)
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
    const popup = owned(element("div", undefined, "v2p-popup vx-member-popup"));
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
      if (data?.activityRank) {
        const rank = element("a", t("activityRank", data.activityRank), "vx-member-rank");
        rank.href = "/top/dau";
        rank.target = options.newTab ? "_blank" : "_self";
        rank.rel = "noopener noreferrer";
        right.append(rank);
      }
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
      if (data?.replies?.length) {
        const section = element("div", undefined, "v2p-member-topics vx-member-replies");
        const list = element("div", undefined, "v2p-member-topics-list");
        section.append(element("div", t("recentReplies"), "v2p-member-topics-header"), list);
        for (const reply of data.replies) {
          const row = element("a", undefined, "vx-member-reply");
          row.href = reply.url;
          row.target = options.newTab ? "_blank" : "_self";
          row.rel = "noopener noreferrer";
          row.append(element("span", reply.title, "vx-member-reply-title"));
          if (reply.text) row.append(element("span", reply.text, "vx-member-reply-text"));
          if (reply.time) row.append(element("span", reply.time, "vx-member-reply-time"));
          list.append(row);
        }
        card.append(section);
      }
      const actions = element("div", undefined, "v2p-member-card-actions");
      if (
        currentAccount &&
        currentAccount.toLowerCase() !== name.toLowerCase() &&
        typeof data?.following === "boolean"
      ) {
        const feedback = element("p");
        feedback.setAttribute("role", "alert");
        feedback.hidden = true;
        const follow = button(t(data.following ? "unfollowMember" : "followMember"), async () => {
          if (follow.disabled) return;
          const next = !data.following;
          if (!window.confirm(t(next ? "confirmFollow" : "confirmUnfollow", name))) return;
          follow.disabled = true;
          feedback.hidden = true;
          follow.classList.add("v2p-btn-loading");
          follow.textContent = t("updatingFollow");
          try {
            data.following = await setMemberFollow(name, next, currentAccount);
            follow.setAttribute("aria-pressed", String(data.following));
          } catch (error) {
            feedback.textContent = error.message;
            feedback.hidden = false;
            actions.after(feedback);
          } finally {
            follow.disabled = false;
            follow.classList.remove("v2p-btn-loading");
            follow.textContent = t(data.following ? "unfollowMember" : "followMember");
          }
        });
        follow.classList.add("v2p-btn-small", "vx-member-follow");
        follow.setAttribute("aria-pressed", String(data.following));
        actions.append(follow);
      }
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
        middleware: [
          offset({ mainAxis: 8, crossAxis: -4 }),
          flip(),
          shift({ padding: 8, crossAxis: true }),
        ],
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
  return { enhance, edit, createTagEditor, updateTags };
}
