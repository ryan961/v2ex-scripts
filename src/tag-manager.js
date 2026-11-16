import { button, element } from "./dom.js";
import { t } from "./i18n.js";
import { TAG_LIMITS } from "./storage.js";

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
  const toolbar = element("div", undefined, "vx-tag-toolbar");
  const label = element("label", t("searchTags"));
  const search = element("input");
  search.type = "search";
  search.className = "sl";
  label.append(search);
  const count = element("span", undefined, "vx-tag-count");
  toolbar.append(label, count);
  const status = element("p");
  status.setAttribute("role", "status");
  const editor = element("div", undefined, "vx-tag-editor");
  const list = element("ul", undefined, "vx-tag-list");
  const more = button(t("moreTags"), () => {
    const previousLimit = limit;
    limit += pageSize;
    render();
    list.children[previousLimit]?.querySelector("button")?.focus();
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
        name.includes(query) || tags.some((tag) => tag.toLowerCase().includes(query)),
    );
    list.replaceChildren();
    more.hidden = matching.length <= limit;
    if (!matching.length) list.append(element("li", t("noMatchingTags"), "vx-tag-empty"));
    for (const { name, tags } of matching.slice(0, limit)) {
      const row = element("li", undefined, "vx-tag-row");
      const text = element("div", undefined, "vx-tag-member");
      const profile = element("a", name, "vx-tag-profile");
      profile.href = `/member/${encodeURIComponent(name)}`;
      profile.target = "_blank";
      profile.rel = "noopener noreferrer";
      const chips = element("ul", undefined, "vx-tag-chips");
      for (const tag of tags) chips.append(element("li", tag));
      text.append(profile, chips);
      const edit = button(t("edit"), () => {
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
      edit.setAttribute("aria-label", t("editTags", name));
      const remove = button(t("deleteTags"), () => deleteTags(name));
      remove.classList.add("vx-tag-delete");
      remove.setAttribute("aria-label", t("deleteTagsFor", name));
      const actions = element("div", undefined, "vx-tag-actions");
      actions.append(edit, remove);
      row.append(text, actions);
      list.append(row);
    }
  }
  function refresh() {
    members = store.taggedMembers();
    count.textContent = t("taggedCount", members.length);
    render();
  }
  search.addEventListener("input", () => {
    limit = pageSize;
    render();
  });
  search.addEventListener("keydown", (event) => {
    if (event.key === "Enter") event.preventDefault();
  });
  return { root, refresh };
}
