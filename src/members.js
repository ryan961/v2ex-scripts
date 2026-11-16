import { button, element, matching, memberName, modal, owned, safeURL } from "./dom.js";
import { computePosition, flip, offset, shift } from "@floating-ui/dom";

export function createMembers(store, options) {
  const registered = new WeakSet(),
    byName = new Map();
  function edit(name) {
    const dialog = modal(`Tags: ${name}`, true);
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
    const label = element("label", "Separate tags with commas (up to 20). ");
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
      button("Save", () => {
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
      group.textContent = tags.join("\uFF0C");
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
        element("span", undefined, "vx-tags v2p-reply-tags v2p-reply-tags-inline"),
      );
      group.setAttribute("role", "button");
      group.tabIndex = 0;
      group.setAttribute("aria-label", `Edit tags for ${name}`);
      group.addEventListener("click", () => edit(name));
      group.addEventListener("keydown", (event) => {
        if (event.key === "Enter") edit(name);
      });
      link.after(group);
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
    document.body.append(popup);
    let timer,
      closeTimer,
      active,
      sequence = 0;
    function hide() {
      clearTimeout(timer);
      popup.hidden = true;
      active = null;
      sequence++;
    }
    async function get(name) {
      const key = name.toLowerCase(),
        cached = cache.get(key);
      if (cached?.expires > Date.now()) return cached.promise;
      const promise = fetch(`/api/members/show.json?username=${encodeURIComponent(name)}`, {
        credentials: "same-origin",
        signal: AbortSignal.timeout(10_000),
      })
        .then(async (response) => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const data = await response.json();
          if (!data.username) throw new Error("Member unavailable.");
          return data;
        })
        .catch((error) => {
          cache.delete(key);
          throw error;
        });
      if (cache.size >= 100) cache.delete(cache.keys().next().value);
      cache.set(key, { promise, expires: Date.now() + 600_000 });
      return promise;
    }
    function render(name, data = {}) {
      const card = element("div", undefined, "v2p-member-card");
      const info = element("div", undefined, "v2p-info"),
        left = element("div", undefined, "v2p-info-left"),
        right = element("div", undefined, "v2p-info-right");
      const avatar = safeURL(data.avatar_large ?? data.avatar_normal, location.href, true);
      if (avatar) {
        const link = element("a", undefined, "v2p-avatar-box");
        link.href = `/member/${name}`;
        const image = element("img", undefined, "v2p-avatar");
        image.src = avatar;
        image.alt = name;
        link.append(image);
        left.append(link);
      }
      const username = element("div", undefined, "v2p-username"),
        link = element("a", name);
      link.href = `/member/${name}`;
      username.append(link);
      right.append(username);
      right.append(
        element("div", data.id ? `V2EX member #${data.id}` : "Loading member...", "v2p-no"),
      );
      right.append(
        element(
          "div",
          data.created ? `Joined: ${new Date(data.created * 1000).toLocaleDateString()}` : "",
          "v2p-created-date",
        ),
      );
      info.append(left, right);
      card.append(info);
      if (data.bio) card.append(element("div", data.bio, "v2p-bio"));
      if (options.tags) {
        const actions = element("div", undefined, "v2p-member-card-actions");
        const control = button("Set user tags", () => {
          hide();
          edit(name);
        });
        control.classList.add("v2p-btn-small");
        actions.append(control);
        card.append(actions);
      }
      content.replaceChildren(card);
    }
    function position(anchor) {
      void computePosition(anchor, popup, {
        placement: "bottom-start",
        middleware: [offset({ mainAxis: 5, crossAxis: 5 }), flip(), shift({ padding: 8 })],
      })
        .then(({ x, y }) => {
          popup.style.left = `${x}px`;
          popup.style.top = `${y}px`;
        })
        .catch(hide);
    }
    document.addEventListener("pointerover", (event) => {
      clearTimeout(closeTimer);
      if (popup.contains(event.target) || event.target.closest?.(".v2p-modal-mask")) return;
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
        render(name);
        popup.hidden = false;
        position(anchor);
        if (!options.userCards) return;
        try {
          const data = await get(name);
          if (request !== sequence) return;
          render(name, data);
          position(anchor);
        } catch (error) {
          if (request === sequence) content.append(element("p", error.message));
        }
      }, 350);
    });
    document.addEventListener("pointerout", (event) => {
      if (
        event.relatedTarget &&
        (popup.contains(event.relatedTarget) || active?.contains(event.relatedTarget))
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
