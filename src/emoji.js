import { computePosition, flip, offset, shift } from "@floating-ui/dom";
import groups from "./vendor/polish/emoticons.json" with { type: "json" };
import { button, element, matching, owned } from "./dom.js";

const pictures = new Map(
  groups
    .flatMap((group) => group.items)
    .filter((item) => item.url)
    .map((item) => [item.url, item.image]),
);
const tokens = new Map(
  groups
    .flatMap((group) => group.items)
    .filter((item) => item.url)
    .map((item) => [item.value, item.url]),
);
const emojiSources = new Set([...pictures.keys(), ...pictures.values()]);

export function transformEmoji(text) {
  return text.replace(/\[[^\]]+\]/g, (token) =>
    tokens.has(token) ? `${tokens.get(token)} ` : token,
  );
}

export function enhanceEmojis(root) {
  for (const image of matching(root, "img.embedded_image")) {
    const high = pictures.get(image.getAttribute("src"));
    if (high) image.src = high;
    if (emojiSources.has(image.getAttribute("src"))) {
      image.classList.add("v2p-emoji-img");
      image.style.width = "var(--v2p-emoji-size)";
      image.style.height = "var(--v2p-emoji-size)";
    }
  }
}

export function initEmoji(options) {
  const textarea = document.querySelector(
    'textarea#reply_content, #reply-box textarea, textarea[name="content"]',
  );
  if (!textarea || !options.emoji) return;
  const submit = textarea.form?.querySelector('input[type="submit"],button[type="submit"]');
  if (!submit) return;
  const trigger = owned(button("", () => {}));
  trigger.setAttribute("aria-label", "Insert emoji");
  trigger.title = "Insert emoji";
  trigger.innerHTML =
    '<span style="width:18px;height:18px"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></svg></span>';
  submit.after(trigger);
  const popup = owned(element("div", undefined, "v2p-popup"));
  popup.hidden = true;
  popup.append(element("div", undefined, "v2p-popup-content"));
  (document.querySelector("#reply-box") ?? textarea.form).append(popup);
  let rendered = false,
    selection = [textarea.selectionStart, textarea.selectionEnd];
  const remember = () => {
    selection = [textarea.selectionStart, textarea.selectionEnd];
  };
  textarea.addEventListener("select", remember);
  textarea.addEventListener("keyup", remember);
  textarea.addEventListener("click", remember);
  textarea.addEventListener("input", remember);
  const close = () => {
    popup.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
  };
  trigger.setAttribute("aria-expanded", "false");
  trigger.addEventListener("click", () => {
    if (!popup.hidden) {
      close();
      return;
    }
    if (!rendered) {
      rendered = true;
      const container = element("div", undefined, "v2p-emoji-container"),
        box = element("div", undefined, "v2p-emoticons-box");
      for (const group of groups) {
        const section = element("div", undefined, "v2p-emoji-group"),
          list = element("div", undefined, "v2p-emoji-list");
        section.append(element("div", group.title, "v2p-emoji-title"), list);
        for (const item of group.items) {
          const choice = element("span", item.image ? undefined : item.value, "v2p-emoji");
          choice.title = item.value;
          choice.tabIndex = 0;
          choice.setAttribute("role", "button");
          choice.setAttribute("aria-label", item.value);
          if (item.image) {
            const image = element("img");
            image.src = item.image;
            image.alt = item.value;
            image.loading = "lazy";
            choice.append(image);
          }
          const insert = () => {
            textarea.setRangeText(item.value, ...selection, "end");
            textarea.dispatchEvent(new Event("input", { bubbles: true }));
            textarea.focus();
            remember();
          };
          choice.addEventListener("click", insert);
          choice.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              insert();
            }
          });
          list.append(choice);
        }
        box.append(section);
      }
      container.append(box);
      popup.append(container);
    }
    popup.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    void computePosition(trigger, popup, {
      placement: "right-end",
      middleware: [offset({ mainAxis: 5, crossAxis: 5 }), flip(), shift({ padding: 8 })],
    })
      .then(({ x, y }) => {
        popup.style.left = `${x}px`;
        popup.style.top = `${y}px`;
      })
      .catch(close);
    textarea.focus();
  });
  document.addEventListener("click", (event) => {
    if (!popup.contains(event.target) && !trigger.contains(event.target)) close();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !popup.hidden) {
      event.preventDefault();
      close();
    }
  });
  textarea.form?.addEventListener(
    "submit",
    (event) => {
      if (!event.defaultPrevented) textarea.value = transformEmoji(textarea.value);
    },
    true,
  );
}
