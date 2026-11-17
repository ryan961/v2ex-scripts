import { boundedText } from "./backup-remote.js";
import { BACKUP_BYTES, byteLength } from "./storage.js";
import { readRemoteBackup } from "./backup-format.js";
import { t } from "./i18n.js";

const scope = "https://www.googleapis.com/auth/drive.file";
const endpoint = "https://www.googleapis.com";
const property = "v2exLiteBackup";
const jsonType = "application/json";
export { scope as DRIVE_SCOPE };

async function callDrive(token, path, options, fetcher) {
  if (typeof token !== "string" || !token || /\s/.test(token))
    throw new Error(t("backupConfigInvalid"));
  const response = await fetcher(endpoint + path, {
    credentials: "omit",
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(15_000),
    ...options,
    headers: { ...options?.headers, Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(t("requestHTTP", response.status));
  return response;
}

export async function uploadDrive(token, text, fetcher = fetch) {
  readRemoteBackup(text);
  const boundary = crypto.randomUUID();
  const stamp = new Date().toISOString().replaceAll(":", "-");
  const meta = {
    name: `v2ex-lite-backup-${stamp}.json`,
    mimeType: jsonType,
    appProperties: { [property]: "1" },
  };
  const body = `--${boundary}\r\nContent-Type: ${jsonType}; charset=UTF-8\r\n\r\n${JSON.stringify(meta)}\r\n--${boundary}\r\nContent-Type: ${jsonType}\r\n\r\n${text}\r\n--${boundary}--\r\n`;
  const response = await callDrive(
    token,
    "/upload/drive/v3/files?uploadType=multipart&fields=id,size",
    {
      method: "POST",
      headers: { "Content-Type": `multipart/related; boundary=${boundary}` },
      body,
    },
    fetcher,
  );
  const result = JSON.parse(await boundedText(response, 32_768));
  if (!result.id || Number(result.size) !== byteLength(text)) throw new Error(t("backupForeign"));
  return result.id;
}

export async function listDrive(token, fetcher = fetch) {
  const query = new URLSearchParams({
    q: `trashed = false and appProperties has { key='${property}' and value='1' }`,
    spaces: "drive",
    orderBy: "createdTime desc",
    pageSize: "100",
    fields: "files(id,name,size)",
  });
  const response = await callDrive(token, `/drive/v3/files?${query}`, {}, fetcher);
  const data = JSON.parse(await boundedText(response, 128 * 1024));
  if (!Array.isArray(data.files)) throw new Error(t("backupForeign"));
  return data.files.filter(
    (file) =>
      typeof file?.id === "string" &&
      /^[a-z0-9_-]+$/i.test(file.id) &&
      typeof file.name === "string" &&
      Number(file.size) <= BACKUP_BYTES,
  );
}

export async function downloadDrive(token, id, fetcher = fetch) {
  if (typeof id !== "string" || !/^[a-z0-9_-]+$/i.test(id))
    throw new Error(t("backupConfigInvalid"));
  const response = await callDrive(token, `/drive/v3/files/${id}?alt=media`, {}, fetcher);
  return readRemoteBackup(await boundedText(response, BACKUP_BYTES));
}
