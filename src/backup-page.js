import { githubBackup, webdavBackup } from "./backup-remote.js";
import { uploadDrive, listDrive, downloadDrive, DRIVE_SCOPE } from "./backup-drive.js";
import { BACKUP_BYTES, TAG_LIMITS } from "./storage.js";
import { readRemoteBackup, singleBackup } from "./backup-format.js";
import { LANGUAGE_NAMES, setLanguage, t as translate } from "./i18n.js";

const messages = {
  backupToolHelp: [
    "Select the provider and an exported JSON file to upload. GitHub and WebDAV replace their previous backup. Google Drive adds a new snapshot. Download a file here, then import it in V2EX Lite. Credentials stay in this page until it closes.",
    "\u9009\u62e9\u4e91\u7aef\u548c\u5df2\u5bfc\u51fa\u7684 JSON \u4e0a\u4f20\u3002GitHub \u548c WebDAV \u4f1a\u66ff\u6362\u4e0a\u4e00\u6b21\u5907\u4efd\uff0cGoogle Drive \u4f1a\u65b0\u589e\u5feb\u7167\u3002\u4e0b\u8f7d\u540e\u5728 V2EX Lite \u5bfc\u5165\u3002\u51ed\u636e\u53ea\u5728\u5f53\u524d\u5de5\u5177\u9875\u4f7f\u7528\u3002",
    "\u4fdd\u5b58\u5148\u3068 JSON \u3092\u9078\u629e\u3057\u3066\u304f\u3060\u3055\u3044\u3002GitHub \u3068 WebDAV \u306f\u524d\u56de\u5206\u3092\u66f4\u65b0\u3057\u3001Google Drive \u306f\u65b0\u898f\u4fdd\u5b58\u3057\u307e\u3059\u3002\u8a8d\u8a3c\u60c5\u5831\u306f\u3053\u306e\u30da\u30fc\u30b8\u3060\u3051\u3067\u4f7f\u7528\u3057\u307e\u3059\u3002",
    "\uc800\uc7a5\uc18c\uc640 JSON\uc744 \uc120\ud0dd\ud558\uc138\uc694. GitHub\uc640 WebDAV\ub294 \uae30\uc874 \ubc31\uc5c5\uc744 \uac31\uc2e0\ud558\uace0 Google Drive\ub294 \uc0c8 \ud30c\uc77c\uc744 \uc800\uc7a5\ud569\ub2c8\ub2e4. \uc778\uc99d \uc815\ubcf4\ub294 \uc774 \ud398\uc774\uc9c0\uc5d0\uc11c\ub9cc \uc0ac\uc6a9\ud569\ub2c8\ub2e4.",
  ],
  backupRepository: [
    "Private repository",
    "\u79c1\u6709\u4ed3\u5e93",
    "\u975e\u516c\u958b\u30ea\u30dd\u30b8\u30c8\u30ea",
    "\ube44\uacf5\uac1c \uc800\uc7a5\uc18c",
  ],
  backupToken: [
    "GitHub token with Contents read/write access",
    "GitHub \u4ee4\u724c\uff08Contents \u8bfb\u5199\u6743\u9650\uff09",
    "GitHub \u30c8\u30fc\u30af\u30f3\uff08Contents \u8aad\u307f\u66f8\u304d\uff09",
    "GitHub \ud1a0\ud070(Contents \uc77d\uae30 \ubc0f \uc4f0\uae30)",
  ],
  backupUsername: [
    "Username",
    "\u7528\u6237\u540d",
    "\u30e6\u30fc\u30b6\u30fc\u540d",
    "\uc0ac\uc6a9\uc790 \uc774\ub984",
  ],
  backupPassword: [
    "Password",
    "\u5bc6\u7801",
    "\u30d1\u30b9\u30ef\u30fc\u30c9",
    "\ube44\ubc00\ubc88\ud638",
  ],
  backupWebDAVSetup: [
    "Use an HTTPS JSON URL. Allow this origin and expose the ETag header in your server's CORS settings.",
    "\u4f7f\u7528 HTTPS JSON \u6587\u4ef6\u5730\u5740\u3002\u5728\u670d\u52a1\u7aef CORS \u914d\u7f6e\u4e2d\u5141\u8bb8\u5f53\u524d\u5de5\u5177\u7684\u6765\u6e90\uff0c\u5e76\u66b4\u9732 ETag \u54cd\u5e94\u5934\u3002",
    "HTTPS \u306e JSON URL \u3092\u4f7f\u7528\u3057\u3001\u3053\u306e\u30aa\u30ea\u30b8\u30f3\u3092\u8a31\u53ef\u3057\u3066 ETag \u3092\u516c\u958b\u3057\u3066\u304f\u3060\u3055\u3044\u3002",
    "HTTPS JSON URL\uc744 \uc0ac\uc6a9\ud558\uace0 \uc11c\ubc84 CORS\uc5d0\uc11c \uc774 \ucd9c\ucc98\ub97c \ud5c8\uc6a9\ud558\uace0 ETag \ud5e4\ub354\ub97c \ub178\ucd9c\ud558\uc138\uc694.",
  ],
  backupGoogleSetup: [
    "Enable Drive API in your Google Cloud project and authorize this page's origin for a Web OAuth client. Use the same client on each device.",
    "\u5728 Google Cloud \u9879\u76ee\u4e2d\u542f\u7528 Drive API\uff0c\u4e3a Web OAuth \u5ba2\u6237\u7aef\u767b\u8bb0\u5f53\u524d\u5de5\u5177\u9875\u6765\u6e90\u3002\u5404\u8bbe\u5907\u4f7f\u7528\u540c\u4e00\u4e2a\u5ba2\u6237\u7aef\u3002",
    "Drive API \u3092\u6709\u52b9\u306b\u3057\u3001\u3053\u306e\u30aa\u30ea\u30b8\u30f3\u3092 Web OAuth \u30af\u30e9\u30a4\u30a2\u30f3\u30c8\u306b\u767b\u9332\u3057\u3066\u304f\u3060\u3055\u3044\u3002\u5404\u7aef\u672b\u3067\u540c\u3058\u30af\u30e9\u30a4\u30a2\u30f3\u30c8\u3092\u4f7f\u3044\u307e\u3059\u3002",
    "Drive API\ub97c \ucf1c\uace0 \ud604\uc7ac \ud398\uc774\uc9c0 \ucd9c\ucc98\ub97c \uc6f9 OAuth \ud074\ub77c\uc774\uc5b8\ud2b8\uc5d0 \ub4f1\ub85d\ud558\uc138\uc694. \ubaa8\ub4e0 \uae30\uae30\uc5d0\uc11c \uac19\uc740 \ud074\ub77c\uc774\uc5b8\ud2b8\ub97c \uc0ac\uc6a9\ud558\uc138\uc694.",
  ],
  backupGoogleAuthorize: [
    "Authorize Google Drive",
    "\u6388\u6743 Google Drive",
    "Google Drive \u3092\u8a31\u53ef",
    "Google Drive \uc2b9\uc778",
  ],
  backupGoogleList: [
    "List recent backups",
    "\u5217\u51fa\u6700\u8fd1\u5907\u4efd",
    "\u6700\u8fd1\u306e\u30d0\u30c3\u30af\u30a2\u30c3\u30d7\u3092\u8868\u793a",
    "\ucd5c\uadfc \ubc31\uc5c5 \ubaa9\ub85d",
  ],
  backupGoogleFile: [
    "Snapshot from the latest 100",
    "\u4ece\u6700\u8fd1 100 \u4efd\u5feb\u7167\u4e2d\u9009\u62e9",
    "\u6700\u65b0 100 \u4ef6\u304b\u3089\u9078\u629e",
    "\ucd5c\uadfc 100\uac1c \ubc31\uc5c5 \uc911 \uc120\ud0dd",
  ],
  backupGoogleUnavailable: [
    "Could not load Google authorization.",
    "\u65e0\u6cd5\u52a0\u8f7d Google \u6388\u6743\u7ec4\u4ef6\u3002",
    "Google \u8a8d\u8a3c\u3092\u8aad\u307f\u8fbc\u3081\u307e\u305b\u3093\u3067\u3057\u305f\u3002",
    "Google \uc778\uc99d\uc744 \ubd88\ub7ec\uc624\uc9c0 \ubabb\ud588\uc2b5\ub2c8\ub2e4.",
  ],
  backupGoogleConnected: [
    "Google Drive authorized.",
    "Google Drive \u5df2\u6388\u6743\u3002",
    "Google Drive \u304c\u8a31\u53ef\u3055\u308c\u307e\u3057\u305f\u3002",
    "Google Drive\uac00 \uc2b9\uc778\ub418\uc5c8\uc2b5\ub2c8\ub2e4.",
  ],
  backupCloudCapacity: [
    "Selected: {0} bytes. Maximum: {1} bytes and {2} member records per file.",
    "\u5df2\u9009 {0} \u5b57\u8282\u3002\u5355\u4efd\u4e0a\u9650 {1} \u5b57\u8282\u548c {2} \u6761\u7528\u6237\u8bb0\u5f55\u3002",
    "\u9078\u629e {0} \u30d0\u30a4\u30c8\u3002\u4e0a\u9650 {1} \u30d0\u30a4\u30c8\u3001{2} \u4ef6\u3002",
    "\uc120\ud0dd {0}\ubc14\uc774\ud2b8. \ud30c\uc77c \ud55c\ub3c4 {1}\ubc14\uc774\ud2b8, \uc0ac\uc6a9\uc790 {2}\uba85.",
  ],
  backupCloudUpload: [
    "Upload backup",
    "\u4e0a\u4f20\u5907\u4efd",
    "\u30d0\u30c3\u30af\u30a2\u30c3\u30d7\u3092\u30a2\u30c3\u30d7\u30ed\u30fc\u30c9",
    "\ubc31\uc5c5 \uc5c5\ub85c\ub4dc",
  ],
  backupCloudDownload: [
    "Download backup",
    "\u4e0b\u8f7d\u5907\u4efd",
    "\u30d0\u30c3\u30af\u30a2\u30c3\u30d7\u3092\u30c0\u30a6\u30f3\u30ed\u30fc\u30c9",
    "\ubc31\uc5c5 \ub2e4\uc6b4\ub85c\ub4dc",
  ],
};

const params = new URLSearchParams(location.search);
const language = Object.hasOwn(LANGUAGE_NAMES, params.get("lang")) ? params.get("lang") : "zh";
document.documentElement.lang = language;
setLanguage(language);
const t = (key, ...args) =>
  messages[key]?.[["en", "zh", "ja", "ko"].indexOf(language)]?.replace(
    /\{(\d+)\}/g,
    (_, i) => args[i] ?? "",
  ) ?? translate(key, ...args);
const byId = (id) => document.getElementById(id);
for (const node of document.querySelectorAll("[data-message]"))
  node.textContent = t(node.dataset.message);
const mode = byId("provider");
const status = byId("status");
const source = byId("backup-file");
const driveFiles = byId("drive-files");
const authorize = byId("authorize");
const upload = byId("upload");
const download = byId("download");
const loadFiles = byId("list");
let token;
let busy = false;
let authorizing = false;
let sdk;

function snapshot(data) {
  const { imgurClientId: _localOnly, ...options } = data.options;
  return singleBackup({
    schema: 1,
    exportedAt: new Date().toISOString(),
    options,
    members: data.members,
  });
}

function showCapacity() {
  const bytes = source.files[0]?.size ?? 0;
  byId("capacity").textContent = t(
    "backupCloudCapacity",
    bytes.toLocaleString(language),
    BACKUP_BYTES.toLocaleString(language),
    TAG_LIMITS.importMembers.toLocaleString(language),
  );
}

function updateControls() {
  const drive = mode.value === "drive";
  const authorized = token?.expires > Date.now();
  mode.disabled = busy || authorizing;
  for (const field of document.querySelectorAll("input, #drive-files"))
    field.disabled = busy || authorizing;
  authorize.disabled = busy || authorizing;
  upload.disabled =
    busy || !source.files.length || source.files[0].size > BACKUP_BYTES || (drive && !authorized);
  loadFiles.disabled = busy || !authorized;
  download.disabled = busy || (drive && (!authorized || !driveFiles.value));
}

function loadGoogle() {
  if (!sdk) {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.addEventListener("load", updateControls);
    script.addEventListener("error", () => {
      sdk = null;
      script.remove();
      status.textContent = t("backupGoogleUnavailable");
    });
    document.head.append(script);
    sdk = script;
  }
}

function selectProvider() {
  for (const fields of document.querySelectorAll("[data-provider]"))
    fields.hidden = fields.dataset.provider !== mode.value;
  if (mode.value === "drive") loadGoogle();
  status.textContent = "";
  updateControls();
}

async function run(action) {
  if (busy) return;
  busy = true;
  updateControls();
  status.textContent = "";
  try {
    await action();
  } catch (error) {
    status.textContent = error instanceof SyntaxError ? t("invalidJSON") : error.message;
  } finally {
    busy = false;
    updateControls();
  }
}

function remote(text) {
  switch (mode.value) {
    case "github":
      return githubBackup(
        { repo: byId("repository").value.trim(), token: byId("github-token").value.trim() },
        text,
      );
    case "webdav":
      return webdavBackup(
        {
          url: byId("webdav-url").value.trim(),
          user: byId("webdav-username").value,
          password: byId("webdav-password").value,
        },
        text,
      );
    case "drive":
      if (!token || token.expires <= Date.now()) throw new Error(t("backupGoogleAuthorize"));
      return text === undefined
        ? downloadDrive(token.value, driveFiles.value)
        : uploadDrive(token.value, text);
  }
}

authorize.addEventListener("click", () => {
  if (!window.google?.accounts?.oauth2) {
    loadGoogle();
    status.textContent = t("backupGoogleUnavailable");
    return;
  }
  const clientId = byId("google-client").value.trim();
  if (!/^[a-z0-9_-]+\.apps\.googleusercontent\.com$/i.test(clientId)) {
    status.textContent = t("backupConfigInvalid");
    return;
  }
  token = null;
  driveFiles.replaceChildren();
  authorizing = true;
  updateControls();
  const failed = () => {
    authorizing = false;
    status.textContent = t("backupGoogleAuthorize");
    updateControls();
  };
  const oauth = window.google.accounts.oauth2;
  try {
    oauth
      .initTokenClient({
        client_id: clientId,
        scope: DRIVE_SCOPE,
        error_callback: failed,
        callback(result) {
          authorizing = false;
          if (
            result.error ||
            !result.access_token ||
            !Number.isFinite(Number(result.expires_in)) ||
            !oauth.hasGrantedAllScopes(result, DRIVE_SCOPE)
          )
            return failed();
          token = {
            value: result.access_token,
            expires: Date.now() + Number(result.expires_in) * 1000,
          };
          status.textContent = t("backupGoogleConnected");
          updateControls();
        },
      })
      .requestAccessToken();
  } catch {
    failed();
  }
});
byId("google-client").addEventListener("input", () => {
  token = null;
  driveFiles.replaceChildren();
  updateControls();
});
loadFiles.addEventListener(
  "click",
  () =>
    void run(async () => {
      if (!token || token.expires <= Date.now()) throw new Error(t("backupGoogleAuthorize"));
      const files = await listDrive(token.value);
      driveFiles.replaceChildren(...files.map(({ id, name }) => new Option(name, id)));
      if (!files.length) status.textContent = t("backupMissing");
    }),
);
upload.addEventListener(
  "click",
  () =>
    void run(async () => {
      const file = source.files[0];
      if (!file || file.size > BACKUP_BYTES) throw new Error(t("backupSize"));
      await remote(snapshot(readRemoteBackup(await file.text())));
      status.textContent = t("backupSaved");
    }),
);
download.addEventListener(
  "click",
  () =>
    void run(async () => {
      const text = snapshot(await remote());
      const href = URL.createObjectURL(new Blob([text], { type: "application/json" }));
      const link = document.createElement("a");
      link.href = href;
      link.download = "v2ex-lite-backup.json";
      link.click();
      setTimeout(() => URL.revokeObjectURL(href), 1000);
    }),
);
source.addEventListener("change", () => {
  showCapacity();
  updateControls();
});
driveFiles.addEventListener("change", updateControls);
mode.addEventListener("change", selectProvider);
mode.value = ["github", "webdav", "drive"].includes(params.get("provider"))
  ? params.get("provider")
  : "github";
selectProvider();
showCapacity();
