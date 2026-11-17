import { currentUser } from "./dom.js";
import { t } from "./i18n.js";
import { NOTE_BYTES, NOTE_MARK, readRemoteBackup } from "./backup-format.js";
import { BACKUP_BYTES } from "./storage.js";

export async function boundedText(response, limit) {
  if (Number(response.headers.get("content-length")) > limit) {
    await response.body?.cancel().catch(() => {});
    throw new Error(t("backupLimit", limit));
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let total = 0;
  let result = "";
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) return result + decoder.decode();
      total += value.byteLength;
      if (total > limit) throw new Error(t("backupLimit", limit));
      result += decoder.decode(value, { stream: true });
    }
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}

function requireOK(response) {
  if (!response.ok) throw new Error(t("requestHTTP", response.status));
  return response;
}

function request(fetcher, url, options = {}) {
  return fetcher(url, {
    cache: "no-store",
    credentials: "omit",
    redirect: "error",
    signal: AbortSignal.timeout(15_000),
    ...options,
  });
}

export async function notesBackup(
  account,
  text,
  { fetcher = fetch, origin = location.origin, approve } = {},
) {
  if (text !== undefined) readRemoteBackup(text, NOTE_MARK, NOTE_BYTES);
  const get = async (path) => {
    const url = origin + path;
    const response = requireOK(await request(fetcher, url, { credentials: "same-origin" }));
    const doc = new DOMParser().parseFromString(
      await boundedText(response, 3 * BACKUP_BYTES),
      "text/html",
    );
    if (!doc.querySelector("#Main")) throw new Error(t("backupAccount"));
    return doc;
  };
  const identify = async () => currentUser(await get("/"));
  const owner = await identify();
  if (!owner || (account && account.toLowerCase() !== owner.toLowerCase()))
    throw new Error(t("backupAccount"));
  if (text !== undefined && approve && !approve(owner)) return false;
  const findPath = async () => {
    const doc = await get("/notes");
    const paths = [...doc.querySelectorAll(".note_item_title a[href]")]
      .filter((link) => link.textContent.trim().startsWith(NOTE_MARK.trim()))
      .map((link) => /^\/notes\/(?:edit\/)?(\d+)\/?$/.exec(link.getAttribute("href"))?.[1]);
    if (paths.length > 1 || paths.includes(undefined)) throw new Error(t("backupForeign"));
    return paths.length ? `/notes/edit/${paths[0]}` : null;
  };
  const editor = (doc) => doc.querySelector('textarea[name="content"]');
  let path = await findPath();
  const doc = path && (await get(path));
  if (doc) {
    const value = editor(doc)?.value.replaceAll("\r\n", "\n");
    const data = readRemoteBackup(value ?? "", NOTE_MARK, NOTE_BYTES);
    if (text === undefined) return data;
    if (value === text) return true;
  } else if (text === undefined) throw new Error(t("backupMissing"));

  const form = editor(doc ?? (await get("/notes/new")))?.form;
  if (!form) throw new Error(t("backupForeign"));
  const body = new FormData(form);
  body.set("content", text);
  body.set("syntax", "0");
  if (!path) body.set("parent_id", "0");
  if ((await identify())?.toLowerCase() !== owner.toLowerCase())
    throw new Error(t("backupAccount"));
  const response = await request(fetcher, origin + (path ?? "/notes/new"), {
    method: "POST",
    credentials: "same-origin",
    body,
    redirect: "manual",
  });
  if (
    response.type !== "opaqueredirect" &&
    !response.redirected &&
    response.status !== 302 &&
    response.status !== 303
  )
    requireOK(response);
  path ??= await findPath();
  const verified = path && editor(await get(path))?.value.replaceAll("\r\n", "\n");
  if (verified !== text) throw new Error(t("backupVerifyFailed"));
  return true;
}
