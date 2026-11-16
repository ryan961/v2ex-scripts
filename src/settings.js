import { button, currentUser, element, modal, owned } from "./dom.js";
import { t } from "./i18n.js";
import { createTagManager } from "./tag-manager.js";
import { openUploadHistory } from "./upload.js";

export function openSettings(store, signedIn = Boolean(currentUser()), createTagEditor) {
  if (document.querySelector("#vx-settings-dialog")) return;
  const options = store.options();
  const dialog = modal(`V2EX Lite ${t("settings")}`, true);
  dialog.root.id = "vx-settings-dialog";
  const form = element("form");
  form.id = "vx-settings-form";
  const fields = new Map();
  const groups = {
    browse: ["privacy", "newTab", "preview", "userCards", "tags"],
    discussion: ["hotReplies", "autoFold", "preloadPages", "autoCheckIn"],
    editor: ["emoji", "upload", "imgurClientId"],
  };
  const requiresLogin = new Set(["autoCheckIn", "emoji", "upload", "imgurClientId"]);
  for (const [group, keys] of Object.entries(groups)) {
    const section = element("fieldset");
    section.append(element("legend", t(group)));
    const grid = element("div", undefined, "vx-settings-grid");
    for (const key of keys) {
      const login = requiresLogin.has(key);
      const wrapper = element("div", undefined, "vx-settings-option");
      const caption = element("label", t(key));
      const control = element("input");
      control.id = `vx-option-${key}`;
      control.name = key;
      control.disabled = login && !signedIn;
      if (key === "preloadPages") {
        Object.assign(control, { type: "number", min: "0", max: "5", step: "1", required: true });
        control.value = String(options[key]);
      } else if (key === "imgurClientId") {
        Object.assign(control, { type: "text", autocomplete: "off", pattern: "[A-Za-z0-9]{0,64}" });
        control.value = options[key];
        control.placeholder = t("sharedClient");
      } else {
        control.type = "checkbox";
        control.checked = !control.disabled && options[key];
      }
      const help = element("p", t(`${key}Help`));
      help.id = `${control.id}-help`;
      if (login) help.append(" ", element("strong", t("loginRequired")));
      control.setAttribute("aria-describedby", help.id);
      caption.append(control);
      wrapper.append(caption, help);
      grid.append(wrapper);
      fields.set(key, control);
    }
    section.append(grid);
    form.append(section);
  }
  const message = element("p");
  message.setAttribute("role", "status");
  const save = element("button", t("save"), "normal button special");
  save.type = "submit";
  save.setAttribute("form", form.id);
  dialog.footer.append(message, save);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.checkValidity()) return;
    const next = { ...options };
    for (const [key, control] of fields) {
      if (control.disabled) continue;
      next[key] = control.type === "checkbox" ? control.checked : control.value;
    }
    next.preloadPages = Number(next.preloadPages);
    try {
      store.saveOptions(next);
      location.reload();
    } catch {
      message.textContent = t("saveFailed");
    }
  });
  const file = element("input");
  file.type = "file";
  file.accept = ".json,application/json,text/plain";
  file.hidden = true;
  let manager;
  file.setAttribute("aria-label", t("selectBackup"));
  file.addEventListener("change", async () => {
    try {
      if (!file.files[0]) return;
      if (file.files[0].size > 2_000_000) throw new Error(t("backupSize"));
      const count = store.import(await file.files[0].text());
      manager?.refresh();
      message.textContent = t("imported", count);
    } catch (error) {
      message.textContent = t(
        "importFailed",
        error instanceof SyntaxError ? t("invalidJSON") : error.message,
      );
    } finally {
      file.value = "";
    }
  });
  const backup = element("fieldset");
  const buttons = element("div", undefined, "vx-settings-backup-actions");
  buttons.append(
    button(t("exportBackup"), () => {
      const url = URL.createObjectURL(new Blob([store.export()], { type: "application/json" }));
      const anchor = element("a");
      anchor.href = url;
      anchor.download = "v2ex-lite-backup.json";
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }),
    button(t("importBackup"), () => file.click()),
    file,
  );
  backup.append(element("legend", t("backup")), element("p", t("backupHelp")), buttons);
  if (createTagEditor) {
    const details = element("details", undefined, "vx-settings-tag-manager");
    details.append(element("summary", t("manageTags")));
    details.addEventListener("toggle", () => {
      if (!details.open) return;
      if (!manager) {
        manager = createTagManager(store, createTagEditor);
        details.append(manager.root);
      }
      manager.refresh();
    });
    backup.append(details);
  }
  form.append(backup);
  if (!signedIn) dialog.content.append(element("p", t("guestNotice"), "vx-settings-notice"));
  dialog.content.append(form);
  dialog.actions.prepend(
    button(t("uploadHistory"), () => {
      dialog.close();
      openUploadHistory(store);
    }),
  );
}

export function installSettings(store, signedIn, createTagEditor) {
  const open = () => openSettings(store, signedIn, createTagEditor);
  GM_registerMenuCommand(`V2EX Lite ${t("settings")}`, open);
  const host = document.querySelector("#Bottom .content");
  if (!host) return;
  const footer = owned(element("div", undefined, "v2p-footer"));
  footer.append(element("div", "V2EX Lite", "v2p-footer-text"));
  const links = element("div", undefined, "v2p-footer-links");
  const entry = element("a", t("settings"), "v2p-footer-link v2p-hover-btn");
  entry.href = "#";
  entry.addEventListener("click", (event) => {
    event.preventDefault();
    open();
  });
  entry.id = "vx-settings";
  const uploads = element("a", t("uploadHistory"), "v2p-footer-link v2p-hover-btn");
  uploads.href = "#";
  uploads.addEventListener("click", (event) => {
    event.preventDefault();
    openUploadHistory(store);
  });
  links.append(entry, uploads);
  footer.append(links);
  host.append(footer);
}
