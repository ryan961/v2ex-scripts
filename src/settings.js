import { button, element, modal, owned } from "./dom.js";
import { openUploadHistory } from "./upload.js";

export function openSettings(store) {
  if (document.querySelector("#vx-settings-dialog")) return;
  const options = store.options();
  const dialog = modal("V2EX Lite settings");
  dialog.root.id = "vx-settings-dialog";
  const form = element("form");
  form.className = "v2p-topic-preview";
  const fields = new Map();
  function field(key, label, control) {
    const wrapper = element("div", undefined, "cell");
    const caption = element("label", `${label} `);
    caption.append(control);
    wrapper.append(caption);
    form.append(wrapper);
    fields.set(key, control);
  }
  const names = {
    privacy: "Privacy mode (hide account, logo and tab identity)",
    newTab: "Open topics in a new tab",
    preview: "Topic body previews",
    userCards: "Hover member cards",
    tags: "User tags",
    hotReplies: "Popular replies sidebar",
    autoCheckIn: "Daily check-in on page open / returning to a visible tab",
    upload: "Image upload, paste and drop",
    emoji: "Polish emoji picker",
  };
  for (const [key, label] of Object.entries(names)) {
    const input = element("input");
    input.type = "checkbox";
    input.checked = options[key];
    field(key, label, input);
  }
  const pages = element("input");
  pages.type = "number";
  pages.min = "0";
  pages.max = "5";
  pages.step = "1";
  pages.value = String(options.preloadPages);
  field("preloadPages", "Additional reply pages (0-5)", pages);
  const client = element("input");
  client.type = "text";
  client.autocomplete = "off";
  client.pattern = "[A-Za-z0-9]{0,64}";
  client.value = options.imgurClientId;
  client.placeholder = "Built-in shared Client ID";
  field("imgurClientId", "Custom Imgur Client ID (optional)", client);
  const message = element("p");
  message.setAttribute("aria-live", "polite");
  const save = element("button", "Save and reload", "normal button special");
  save.type = "submit";
  form.append(save);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const next = { ...options };
    for (const [key, control] of fields)
      next[key] = control.type === "checkbox" ? control.checked : control.value;
    next.preloadPages = Number(next.preloadPages);
    store.saveOptions(next);
    location.reload();
  });
  const file = element("input");
  file.type = "file";
  file.accept = ".json,application/json,text/plain";
  file.hidden = true;
  file.addEventListener("change", async () => {
    try {
      if (!file.files[0]) return;
      if (file.files[0].size > 2_000_000) throw new Error("Backup exceeds 2 MB.");
      const count = store.import(await file.files[0].text());
      message.textContent = `Imported ${count} users; existing local entries kept. Reload to display changes.`;
    } catch (error) {
      message.textContent = error.message;
    } finally {
      file.value = "";
    }
  });
  const backup = element("div", undefined, "v2p-topic-preview");
  backup.append(
    element("h3", "Local backup / Polish migration"),
    element(
      "p",
      "Backups contain plain-text tags and settings. Keep them private. Imports merge tags; local entries win. Settings and Client ID are kept.",
    ),
    button("Export JSON", () => {
      const url = URL.createObjectURL(new Blob([store.export()], { type: "application/json" }));
      const anchor = element("a");
      anchor.href = url;
      anchor.download = "v2ex-lite-backup.json";
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }),
    button("Import tags JSON", () => file.click()),
    file,
    message,
  );
  dialog.content.append(form, backup);
  dialog.actions.prepend(
    button("Upload history", () => {
      dialog.close();
      openUploadHistory(store);
    }),
  );
}

export function installSettings(store) {
  const footer = owned(element("div", undefined, "v2p-footer"));
  footer.append(element("div", "V2EX Lite · V2EX Polish", "v2p-footer-text"));
  const links = element("div", undefined, "v2p-footer-links");
  const entry = element("a", "Settings", "v2p-footer-link v2p-hover-btn");
  entry.href = "#";
  entry.addEventListener("click", (event) => {
    event.preventDefault();
    openSettings(store);
  });
  entry.id = "vx-settings";
  const uploads = element("a", "Upload history", "v2p-footer-link v2p-hover-btn");
  uploads.href = "#";
  uploads.addEventListener("click", (event) => {
    event.preventDefault();
    openUploadHistory(store);
  });
  links.append(entry, uploads);
  footer.append(links);
  (document.querySelector("#Bottom .content") ?? document.body).append(footer);
  GM_registerMenuCommand("V2EX Lite settings", () => openSettings(store));
}
