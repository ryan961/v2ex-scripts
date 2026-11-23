import { button, element } from "./dom.js";
import { t } from "./i18n.js";

const visibleTagCount = 3;

export function createTagChips(tags, { selected, onSelect, onToggle } = {}) {
  const list = element("ul", undefined, "vx-tag-chips");
  list.setAttribute("aria-label", t("tags"));
  if (selected && tags.indexOf(selected) >= visibleTagCount)
    tags = [selected, ...tags.filter((tag) => tag !== selected)];

  function chip(tag) {
    const value = onSelect ? button(tag, () => onSelect(tag)) : element("span", tag);
    value.className = onSelect ? "vx-tag-chip vx-tag-filter" : "vx-tag-chip";
    if (onSelect) value.setAttribute("aria-pressed", String(selected === tag));
    const item = element("li");
    item.append(value);
    return item;
  }

  list.append(...tags.slice(0, visibleTagCount).map(chip));
  const remaining = tags.length - visibleTagCount;
  if (remaining <= 0) return list;

  let extra;
  const summary = `+${remaining}`;
  const toggle = button(summary, () => {
    const expanded = toggle.getAttribute("aria-expanded") === "false";
    extra ??= tags.slice(visibleTagCount).map(chip);
    if (expanded) list.append(...extra);
    else for (const item of extra) item.remove();
    toggle.textContent = expanded ? t("hideExtraTags") : summary;
    toggle.title = expanded ? t("hideExtraTags") : t("showExtraTags", remaining);
    toggle.setAttribute("aria-label", toggle.title);
    toggle.setAttribute("aria-expanded", String(expanded));
    onToggle?.();
  });
  toggle.className = "vx-tag-chip vx-tag-more";
  toggle.title = t("showExtraTags", remaining);
  toggle.setAttribute("aria-label", toggle.title);
  toggle.setAttribute("aria-expanded", "false");
  const item = element("li");
  item.append(toggle);
  list.append(item);
  return list;
}
