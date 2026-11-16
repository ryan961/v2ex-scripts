import { button, element, matching, memberName, modal, owned, safeURL } from "./dom.js";

export function createMembers(store, options) {
  const registered = new WeakSet();
  const byName = new Map();

  function draw(name, only) {
    const groups = byName.get(name.toLowerCase());
    for (const group of only ? [only] : (groups ?? [])) {
      if (!group.isConnected) {
        groups?.delete(group);
        continue;
      }
      group.replaceChildren();
      for (const tag of store.getTags(name)) group.append(element("span", tag, "vx-tag"));
      const edit = button("tag", () => {
        const dialog = modal(`Tags: ${name}`);
        const label = element("label", "Separate tags with commas (up to 20). ");
        const input = element("input");
        input.value = store.getTags(name).join(", ");
        label.append(input);
        const message = element("p");
        dialog.append(
          label,
          button("Save", () => {
            try {
              store.setTags(name, input.value);
              draw(name);
              dialog.close();
            } catch (error) {
              message.textContent = error.message;
            }
          }),
          message,
        );
        input.focus();
      });
      edit.setAttribute("aria-label", `Edit tags for ${name}`);
      group.append(edit);
    }
  }

  function enhance(root) {
    if (!options.tags) return;
    for (const link of matching(root, 'a[href^="/member/"]')) {
      const name = memberName(link);
      if (
        !name ||
        !link.textContent.trim() ||
        registered.has(link) ||
        link.closest("[data-vx-owned], #Top, #Rightbar, #Bottom")
      )
        continue;
      registered.add(link);
      const key = name.toLowerCase();
      const group = owned(element("span", undefined, "vx-tags"));
      link.after(group);
      if (!byName.has(key)) {
        byName.set(key, new Set());
        store.watchTags(name, () => draw(name));
      }
      byName.get(key).add(group);
      draw(name, group);
    }
  }

  if (options.userCards) initCards();

  function initCards() {
    const cache = new Map();
    const card = owned(element("aside", undefined, "vx-card"));
    card.hidden = true;
    card.setAttribute("aria-label", "Member information");
    document.body.append(card);
    let timer;
    let closeTimer;
    let active = null;
    let sequence = 0;

    function resolve(target) {
      const link = target.closest?.('a[href^="/member/"]');
      const name =
        memberName(link) ??
        (/^[a-z0-9_-]{1,64}$/i.test(target.closest?.("img.avatar")?.alt ?? "")
          ? target.closest("img.avatar").alt
          : null);
      return name ? { name, anchor: link ?? target } : null;
    }
    function hide() {
      clearTimeout(timer);
      card.hidden = true;
      active = null;
      sequence++;
    }
    async function get(name) {
      const key = name.toLowerCase();
      if (cache.has(key) && cache.get(key).expires > Date.now()) return cache.get(key).promise;
      const promise = fetch(`/api/members/show.json?username=${encodeURIComponent(name)}`, {
        credentials: "same-origin",
        signal: AbortSignal.timeout(10_000),
      })
        .then(async (response) => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const member = await response.json();
          if (!member.username || member.status === "not-found")
            throw new Error("Member not found.");
          return member;
        })
        .catch((error) => {
          cache.delete(key);
          throw error;
        });
      if (cache.size >= 100) cache.delete(cache.keys().next().value);
      cache.set(key, { promise, expires: Date.now() + 600_000 });
      return promise;
    }
    document.addEventListener("pointerover", (event) => {
      clearTimeout(closeTimer);
      if (card.contains(event.target)) return;
      const match = resolve(event.target);
      if (!match || match.anchor === active) return;
      hide();
      active = match.anchor;
      const request = sequence;
      timer = setTimeout(async () => {
        const rect = match.anchor.getBoundingClientRect();
        card.style.left = `${Math.max(8, Math.min(rect.left, innerWidth - 320))}px`;
        card.style.top = `${Math.max(8, Math.min(rect.bottom + 6, innerHeight - 250))}px`;
        card.replaceChildren(element("strong", match.name), element("p", "Loading member..."));
        card.hidden = false;
        try {
          const member = await get(match.name);
          if (request !== sequence) return;
          card.replaceChildren(element("strong", member.username));
          for (const key of ["bio", "location", "website"]) {
            if (typeof member[key] === "string" && member[key])
              card.append(element("p", member[key].slice(0, 1000)));
          }
          if (Number.isFinite(member.created))
            card.append(
              element("p", `Joined: ${new Date(member.created * 1000).toLocaleDateString()}`),
            );
          const avatar = safeURL(member.avatar_large ?? member.avatar_normal, location.href, true);
          if (avatar) {
            const image = element("img");
            image.src = avatar;
            image.alt = member.username;
            image.width = 48;
            card.prepend(image);
          }
        } catch (error) {
          if (request === sequence) card.replaceChildren(element("p", `Member: ${error.message}`));
        }
      }, 350);
    });
    document.addEventListener("pointerout", (event) => {
      if (
        event.relatedTarget &&
        (card.contains(event.relatedTarget) || active?.contains(event.relatedTarget))
      )
        return;
      closeTimer = setTimeout(hide, 150);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") hide();
    });
    window.addEventListener("scroll", hide, { passive: true });
  }

  return { enhance };
}
