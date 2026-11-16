import { button, element } from "./dom.js";
import { t } from "./i18n.js";

const pageSize = 50;

export function createTagManager(store, createTagEditor) {
  const root = element("div", undefined, "vx-tag-manager");
  const label = element("label", t("searchTags"));
  const search = element("input");
  search.type = "search";
  label.append(" ", search);
  const status = element("p");
  status.setAttribute("role", "status");
  const editor = element("div");
  const list = element("ul", undefined, "vx-tag-list");
  const more = button(t("moreTags"), () => {
    const previousLimit = limit;
    limit += pageSize;
    render();
    list.children[previousLimit]?.querySelector("button")?.focus();
  });
  let members = [],
    limit = pageSize;
  root.append(label, status, editor, list, more);

  function render() {
    const query = search.value.trim().toLowerCase();
    const matching = members.filter(
      ({ name, tags }) =>
        name.includes(query) || tags.some((tag) => tag.toLowerCase().includes(query)),
    );
    list.replaceChildren();
    more.hidden = matching.length <= limit;
    if (!matching.length) list.append(element("li", t("noMatchingTags")));
    for (const { name, tags } of matching.slice(0, limit)) {
      const row = element("li", undefined, "cell");
      const text = element("div");
      text.append(element("strong", name), element("p", tags.join(", ")));
      const edit = button(t("edit"), () => {
        status.textContent = "";
        const finish = () => {
          editor.replaceChildren();
          search.focus();
        };
        const { form, input, save } = createTagEditor(
          name,
          () => {
            finish();
            status.textContent = t("tagsSaved", name);
            refresh();
          },
          tags,
        );
        const actions = element("div", undefined, "vx-settings-backup-actions");
        actions.append(save, button(t("cancel"), finish));
        editor.replaceChildren(element("h3", t("editTags", name)), form, actions);
        input.focus();
      });
      edit.setAttribute("aria-label", t("editTags", name));
      row.append(text, edit);
      list.append(row);
    }
  }
  function refresh() {
    members = store.taggedMembers();
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
