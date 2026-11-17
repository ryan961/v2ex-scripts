import { t } from "./i18n.js";
import { BACKUP_BYTES, TAG_LIMITS, byteLength, parseImport } from "./storage.js";

export const NOTE_MARK = "V2EX_Lite_settings\n";
export const NOTE_BYTES = 65_536;
export const MAX_PARTS = 128;

export function encodeBackup(snapshot, marker = "") {
  return marker + JSON.stringify(snapshot);
}

export function checkSize(text, limit = BACKUP_BYTES) {
  if (byteLength(text) > limit) throw new Error(t("backupLimit", limit.toLocaleString()));
}

export function singleBackup(snapshot, marker = "", limit = BACKUP_BYTES) {
  if (Object.keys(snapshot.members).length > TAG_LIMITS.importMembers)
    throw new Error(t("backupTooMany", TAG_LIMITS.importMembers.toLocaleString()));
  const text = encodeBackup(snapshot, marker);
  checkSize(text, limit);
  return text;
}

export function backupParts(snapshot) {
  const text = encodeBackup(snapshot);
  const entries = Object.entries(snapshot.members);
  if (entries.length <= TAG_LIMITS.importMembers && byteLength(text) <= BACKUP_BYTES) return [text];

  const { exportedAt, options } = snapshot;
  const id = crypto.randomUUID();
  const header = (index, total) =>
    JSON.stringify({
      schema: 2,
      exportedAt,
      part: { id, index, total },
      options: index === 1 ? options : undefined,
    }).slice(0, -1) + ',"members":{';
  const parts = [[]];
  let bytes = byteLength(header(1, MAX_PARTS)) + 2;
  for (const [name, tags] of entries) {
    const record = `${JSON.stringify(name)}:${JSON.stringify(tags)}`;
    const size = byteLength(record);
    let group = parts.at(-1);
    if (group.length >= TAG_LIMITS.importMembers || bytes + size + 1 > BACKUP_BYTES) {
      if (parts.length >= MAX_PARTS) throw new Error(t("backupPartLimit", MAX_PARTS));
      group = [];
      parts.push(group);
      bytes = byteLength(header(MAX_PARTS, MAX_PARTS)) + 2;
    }
    group.push(record);
    bytes += size + 1;
  }
  return parts.map((group, i) => `${header(i + 1, parts.length)}${group.join(",")}}}`);
}

export function readBackupParts(texts) {
  if (!texts.length || texts.length > MAX_PARTS) throw new Error(t("backupPartsInvalid"));
  const parsed = texts.map((text) => parseImport(text, true));
  if (parsed.length === 1 && !parsed[0].part) return parsed[0];
  const id = parsed[0].part?.id;
  if (typeof id !== "string" || !/^[a-f0-9-]{36}$/.test(id))
    throw new Error(t("backupPartsInvalid"));
  const members = Object.create(null);
  const seen = new Set();
  let options = null;
  for (const data of parsed) {
    const { index, total } = data.part ?? {};
    if (
      data.part?.id !== id ||
      total !== parsed.length ||
      total < 2 ||
      !Number.isInteger(index) ||
      index < 1 ||
      index > total ||
      seen.has(index) ||
      (index !== 1 && data.options)
    )
      throw new Error(t("backupPartsInvalid"));
    seen.add(index);
    if (index === 1) options = data.options;
    for (const [name, tags] of Object.entries(data.members)) {
      if (Object.hasOwn(members, name)) throw new Error(t("backupPartsInvalid"));
      members[name] = tags;
    }
  }
  return { options, members };
}

export function readRemoteBackup(text, marker = "", limit = BACKUP_BYTES) {
  checkSize(text, limit);
  if (!text.startsWith(marker)) throw new Error(t("backupForeign"));
  const json = text.slice(marker.length);
  const raw = JSON.parse(json);
  if (
    raw?.schema !== 1 ||
    !raw.options ||
    typeof raw.options !== "object" ||
    Array.isArray(raw.options) ||
    !raw.members
  )
    throw new Error(t("backupForeign"));
  return parseImport(json);
}
