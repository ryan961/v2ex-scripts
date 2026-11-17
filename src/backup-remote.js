import { currentUser, safeURL } from "./dom.js";
import { t } from "./i18n.js";
import { NOTE_BYTES, NOTE_MARK, readRemoteBackup } from "./backup-format.js";
import { BACKUP_BYTES } from "./storage.js";

const fileName = "v2ex-lite-backup.json";

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
  if (response.status === 409 || response.status === 412)
    throw new Error(t("backupRemoteConflict"));
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

function base64(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 32_768)
    binary += String.fromCharCode(...bytes.subarray(i, i + 32_768));
  return btoa(binary);
}

export async function githubBackup({ repo, token }, text, fetcher = fetch) {
  if (
    !/^[a-z0-9-]+\/[a-z0-9_.-]+$/i.test(repo) ||
    repo.endsWith("/.") ||
    repo.endsWith("/..") ||
    !/^[a-z0-9_]+$/i.test(token)
  )
    throw new Error(t("backupConfigInvalid"));
  const url = `https://api.github.com/repos/${repo}`;
  const headers = { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" };
  const get = (path, accept = headers.Accept) =>
    request(fetcher, url + path, { headers: { ...headers, Accept: accept } });
  const metadata = JSON.parse(await boundedText(requireOK(await get("")), 128 * 1024));
  if (metadata.private !== true || typeof metadata.default_branch !== "string")
    throw new Error(t("backupPrivateRepo"));
  const branch = metadata.default_branch;
  const path = `/contents/${fileName}`;
  const response = await get(
    `${path}?ref=${encodeURIComponent(branch)}`,
    "application/vnd.github.object+json",
  );
  let sha;
  if (response.status !== 404) {
    const file = JSON.parse(await boundedText(requireOK(response), 3 * BACKUP_BYTES));
    if (file.type !== "file" || !/^[a-f0-9]{40}$/.test(file.sha))
      throw new Error(t("backupForeign"));
    sha = file.sha;
    const raw = await get(`/git/blobs/${sha}`, "application/vnd.github.raw+json");
    const existing = readRemoteBackup(await boundedText(requireOK(raw), BACKUP_BYTES));
    if (text === undefined) return existing;
  }
  if (text === undefined) throw new Error(t("backupMissing"));
  readRemoteBackup(text);
  requireOK(
    await request(fetcher, url + path, {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Back up V2EX Lite data",
        content: base64(text),
        branch,
        sha,
      }),
    }),
  );
}

export async function webdavBackup({ url, user, password }, text, fetcher = fetch) {
  const href = safeURL(url, undefined, true);
  const endpoint = href && new URL(href);
  if (
    endpoint?.protocol !== "https:" ||
    endpoint.username ||
    endpoint.password ||
    endpoint.search ||
    endpoint.hash ||
    !endpoint.pathname.endsWith(".json") ||
    user.includes(":")
  )
    throw new Error(t("backupConfigInvalid"));
  const headers =
    user || password ? { Authorization: `Basic ${base64(`${user}:${password}`)}` } : {};
  const response = await request(fetcher, endpoint.href, { headers });
  if (response.status === 404) {
    if (text === undefined) throw new Error(t("backupMissing"));
    headers["If-None-Match"] = "*";
  } else {
    const existing = readRemoteBackup(await boundedText(requireOK(response), BACKUP_BYTES));
    if (text === undefined) return existing;
    const tag = response.headers.get("etag");
    if (!tag || !/^"[^"\r\n]*"$/.test(tag)) throw new Error(t("backupNoETag"));
    headers["If-Match"] = tag;
  }
  readRemoteBackup(text);
  requireOK(
    await request(fetcher, endpoint.href, {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: text,
    }),
  );
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
