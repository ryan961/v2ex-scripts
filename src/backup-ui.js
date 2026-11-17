import { button, currentUser, element } from "./dom.js";
import { interfaceLanguage, t } from "./i18n.js";
import { BACKUP_BYTES, TAG_LIMITS, byteLength } from "./storage.js";
import {
  backupParts,
  encodeBackup,
  MAX_PARTS,
  NOTE_BYTES,
  NOTE_MARK,
  readBackupParts,
  singleBackup,
} from "./backup-format.js";
import { notesBackup } from "./backup-notes.js";

const methods = { local: "backupLocal", notes: "backupNotes" };

function select(label, choices, value) {
  const control = element("select");
  for (const [id, caption] of Object.entries(choices)) {
    const option = element("option", caption);
    option.value = id;
    control.append(option);
  }
  control.value = Object.hasOwn(choices, value) ? value : Object.keys(choices)[0];
  const field = element("label", label, "vx-backup-method");
  field.append(control);
  return { control, field };
}

function checkbox(label, checked, disabled = false) {
  const input = element("input");
  Object.assign(input, { type: "checkbox", checked, disabled });
  const field = element("label");
  field.append(input, ` ${label}`);
  return { input, field };
}

function download(text, name) {
  const link = element("a");
  link.download = name;
  link.href = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

export function createBackup(
  store,
  { onTags, onRestored, signedIn = Boolean(currentUser()) } = {},
) {
  const root = element("fieldset", undefined, "vx-backup");
  const mode = select(
    t("backupMode"),
    Object.fromEntries(Object.entries(methods).map(([key, value]) => [key, t(value)])),
    store.get("backup:mode", "local"),
  );
  const usage = element("p");
  const details = element("div", undefined, "vx-backup-fields");
  const files = element("div", undefined, "vx-backup-fields");
  const status = element("p");
  status.setAttribute("role", "status");
  const input = element("input");
  Object.assign(input, {
    type: "file",
    multiple: true,
    hidden: true,
    accept: ".json,application/json,text/plain",
  });
  input.setAttribute("aria-label", t("selectBackup"));
  const actions = element("div", undefined, "vx-settings-backup-actions");
  const preview = element("div", undefined, "vx-backup-fields");
  let busy = false;

  function refresh() {
    const snapshot = store.snapshot();
    const notes = mode.control.value === "notes";
    usage.textContent = t(
      "backupUsage",
      ...[
        byteLength(encodeBackup(snapshot, notes ? NOTE_MARK : "")),
        notes ? NOTE_BYTES : BACKUP_BYTES,
        Object.keys(snapshot.members).length,
        TAG_LIMITS.importMembers,
      ].map((number) => number.toLocaleString(interfaceLanguage())),
    );
    details.replaceChildren();
    actions.replaceChildren(...(notes ? [saveNote, restoreNote] : [exportFile, importFile]));
    if (notes) {
      details.append(element("p", t("backupNotesHelp")));
      if (!signedIn) details.append(element("strong", t("loginRequired")));
    }
  }

  async function run(action) {
    if (busy) return;
    busy = true;
    status.textContent = "";
    mode.control.disabled = true;
    for (const control of [exportFile, importFile, saveNote, restoreNote]) control.disabled = true;
    try {
      await action();
    } catch (error) {
      status.textContent = error instanceof SyntaxError ? t("invalidJSON") : error.message;
    } finally {
      busy = false;
      mode.control.disabled = false;
      for (const control of [exportFile, importFile, saveNote, restoreNote])
        control.disabled = false;
      saveNote.disabled = restoreNote.disabled = !signedIn;
    }
  }

  function showRestore(data) {
    if (!root.isConnected) return;
    const changes = store.previewRestore(data);
    const tags = checkbox(
      t("backupRestoreTags"),
      Boolean(changes.added || changes.deleted),
      !changes.added && !changes.deleted,
    );
    const settings = checkbox(t("backupRestoreSettings"), false, !data.options);
    const local = store.options();
    const changedSettings = Object.keys(data.options ?? {}).filter(
      (key) => key !== "imgurClientId" && data.options[key] !== local[key],
    );
    const apply = button(t("backupRestoreApply"), () => {
      if (busy) return;
      try {
        store.restore(data, { tags: tags.input.checked, settings: settings.input.checked, onTags });
        onRestored?.(settings.input.checked);
        preview.replaceChildren();
        status.textContent = t("backupApplied");
        refresh();
      } catch {
        status.textContent = t("backupApplyFailed");
      }
    });
    const update = () => (apply.disabled = !tags.input.checked && !settings.input.checked);
    tags.input.addEventListener("change", update);
    settings.input.addEventListener("change", update);
    update();
    preview.replaceChildren(
      element("strong", t("backupPreview")),
      element("p", t("backupSummary", changes.added, changes.deleted, changes.conflicts)),
      tags.field,
      settings.field,
      apply,
    );
    if (changedSettings.length)
      settings.field.append(` (${changedSettings.map((key) => t(key)).join(", ")})`);
    preview.scrollIntoView?.({ block: "nearest" });
  }

  const exportFile = button(
    t("exportBackup"),
    () =>
      void run(() => {
        const parts = backupParts(store.snapshot());
        files.replaceChildren();
        if (parts.length === 1) download(parts[0], "v2ex-lite-backup.json");
        else {
          files.append(element("p", t("backupPartDownloads", parts.length)));
          for (const [index, part] of parts.entries()) {
            const name = `v2ex-lite-backup-${index + 1}-of-${parts.length}.json`;
            files.append(button(name, () => download(part, name)));
          }
        }
      }),
  );
  const importFile = button(t("importBackup"), () => input.click());
  input.addEventListener(
    "change",
    () =>
      void run(async () => {
        const selected = [...input.files];
        input.value = "";
        if (!selected.length) return;
        preview.replaceChildren();
        if (selected.length > MAX_PARTS) throw new Error(t("backupPartLimit", MAX_PARTS));
        if (selected.some((file) => file.size > BACKUP_BYTES)) throw new Error(t("backupSize"));
        const texts = [];
        for (const file of selected) texts.push(await file.text());
        showRestore(readBackupParts(texts));
      }),
  );
  const saveNote = button(
    t("backupToNotes"),
    () =>
      void run(async () => {
        const text = singleBackup(store.snapshot(), NOTE_MARK, NOTE_BYTES);
        const saved = await notesBackup(currentUser(), text, {
          approve: (account) => root.isConnected && window.confirm(t("backupApproveNote", account)),
        });
        if (saved) status.textContent = t("backupSaved");
      }),
  );
  const restoreNote = button(
    t("backupFromNotes"),
    () =>
      void run(async () => {
        preview.replaceChildren();
        showRestore(await notesBackup(currentUser()));
      }),
  );
  saveNote.disabled = restoreNote.disabled = !signedIn;
  mode.control.addEventListener("change", () => {
    store.set("backup:mode", mode.control.value);
    status.textContent = "";
    files.replaceChildren();
    preview.replaceChildren();
    refresh();
  });

  root.append(
    element("legend", t("backup")),
    element("p", t("storageHelp"), "vx-storage-help"),
    element("p", t("backupHelp")),
    mode.field,
    usage,
    details,
    actions,
    input,
    files,
    preview,
    status,
  );
  refresh();
  return root;
}
