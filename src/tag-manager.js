import { button, element } from "./dom.js";
import { t } from "./i18n.js";
import { icon } from "./icons.js";
import { TAG_LIMITS } from "./storage.js";
import { createTagChips } from "./tag-chips.js";

const pageSize = 50;

export function createTagManager(store, { createTagEditor, updateTags }) {
  const root = element("div", undefined, "vx-tag-manager");
  const capacity = element(
    "p",
    t(
      "tagCapacity",
      TAG_LIMITS.perMember,
      TAG_LIMITS.length,
      TAG_LIMITS.importMembers.toLocaleString("en"),
    ),
    "vx-tag-capacity",
  );
  const toolbar = element("div", undefined, "vx-tag-filters");
  const label = element("label", t("searchTags"));
  const search = element("input");
  search.type = "search";
  label.append(search);
  const groupLabel = element("label", t("tagGroup"));
  const group = element("select", undefined, "vx-tag-group");
  groupLabel.append(group);
  const count = element("span", undefined, "vx-tag-count");
  count.setAttribute("aria-live", "polite");
  toolbar.append(label, groupLabel, count);
  const status = element("p");
  status.setAttribute("role", "status");
  const editor = element("div", undefined, "vx-tag-editor");
  const list = element("ul", undefined, "vx-tag-list");
  const more = button(t("moreTags"), () => {
    const previousLimit = limit;
    limit += pageSize;
    render();
    list.children[previousLimit]?.querySelector(".vx-tag-profile")?.focus();
  });
  let members = [],
    limit = pageSize,
    editing = null;
  root.append(capacity, toolbar, status, editor, list, more);

  function closeEditor() {
    editor.replaceChildren();
    editing = null;
    search.focus();
  }

  function deleteTags(name) {
    if (!window.confirm(t("confirmDeleteTags", name))) return;
    try {
      updateTags(name, []);
    } catch {
      status.textContent = t("tagDeleteFailed", name);
      return;
    }
    if (editing === name) closeEditor();
    status.textContent = t("tagsDeleted", name);
    refresh();
    search.focus();
  }

  function render() {
    const query = search.value.trim().toLowerCase();
    const matching = members.filter(
      ({ name, tags }) =>
        (!group.value || tags.includes(group.value)) &&
        (name.includes(query) || tags.some((tag) => tag.toLowerCase().includes(query))),
    );
    count.textContent =
      query || group.value
        ? t("filteredTaggedCount", matching.length, members.length)
        : t("taggedCount", members.length);
    list.replaceChildren();
    more.hidden = matching.length <= limit;
    if (!matching.length) list.append(element("li", t("noMatchingTags"), "vx-tag-empty"));
    for (const { name, tags } of matching.slice(0, limit)) {
      const card = element("li", undefined, "vx-tag-card");
      const header = element("div", undefined, "vx-tag-card-header");
      const profile = element("a", name, "vx-tag-profile");
      profile.href = `/member/${encodeURIComponent(name)}`;
      profile.target = "_blank";
      profile.rel = "noopener noreferrer";
      profile.title = name;
      const chips = createTagChips(tags, {
        selected: group.value,
        onSelect(tag) {
          group.value = group.value === tag ? "" : tag;
          filterList();
          group.focus();
        },
      });
      const edit = button("", () => {
        if (editing === name) {
          editor.querySelector(".vx-tag-entry textarea").focus();
          return;
        }
        status.textContent = "";
        const { form, input, save } = createTagEditor(
          name,
          () => {
            closeEditor();
            status.textContent = t("tagsSaved", name);
            refresh();
          },
          tags,
        );
        const actions = element("div", undefined, "vx-tag-actions");
        actions.append(button(t("cancel"), closeEditor), save);
        editor.replaceChildren(element("h3", t("editTags", name)), form, actions);
        editing = name;
        input.focus();
      });
      const remove = button("", () => deleteTags(name));
      for (const [control, symbol, label] of [
        [edit, "edit", t("editTags", name)],
        [remove, "trash", t("deleteTagsFor", name)],
      ]) {
        control.append(icon(symbol));
        control.title = label;
        control.setAttribute("aria-label", label);
      }
      remove.classList.add("vx-tag-delete");
      const actions = element("div", undefined, "vx-tag-actions");
      actions.append(edit, remove);
      header.append(profile, actions);
      card.append(header, chips);
      list.append(card);
    }
  }
  function refresh() {
    const selected = group.value;
    members = store.taggedMembers();
    const groups = new Map();
    for (const { tags } of members)
      for (const tag of tags) groups.set(tag, (groups.get(tag) ?? 0) + 1);
    const all = element("option", t("allTagGroups"));
    all.value = "";
    group.replaceChildren(all);
    for (const [tag, size] of [...groups].sort(([a], [b]) => a.localeCompare(b))) {
      const option = element("option", t("tagGroupOption", tag, size));
      option.value = tag;
      group.append(option);
    }
    group.value = groups.has(selected) ? selected : "";
    if (selected && !group.value) limit = pageSize;
    render();
  }
  function filterList() {
    limit = pageSize;
    render();
  }
  group.addEventListener("change", filterList);
  search.addEventListener("input", filterList);
  search.addEventListener("keydown", (event) => {
    if (event.key === "Enter") event.preventDefault();
  });
  return { root, refresh };
}
