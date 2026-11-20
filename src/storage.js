import { DEFAULT_LANGUAGE, LANGUAGE_NAMES, t } from "./i18n.js";
import { DEFAULT_THEME, normalizeTheme } from "./theme.js";
import { DEFAULT_IMGUR_PROXY, normalizeImgurProxy } from "./imgur-proxy.js";
export const PREFIX = "v2ex-lite:";
export const DEFAULT_IMGUR_CLIENT_ID = "3107b9ef8b316f3";
export const TAG_LIMITS = Object.freeze({ perMember: 20, length: 80, importMembers: 20_000 });
export const BACKUP_BYTES = 2_000_000;
export const byteLength = (text) => new TextEncoder().encode(text).length;
export const DEFAULTS = Object.freeze({
  language: DEFAULT_LANGUAGE,
  theme: DEFAULT_THEME,
  privacy: false,
  newTab: true,
  preview: true,
  imgurProxy: false,
  imgurProxyURL: DEFAULT_IMGUR_PROXY,
  userCards: true,
  tags: true,
  preloadPages: 2,
  hotReplies: true,
  autoCheckIn: true,
  upload: true,
  emoji: true,
  autoFold: true,
  imgurClientId: "",
});

const validName = /^[a-z0-9_-]{1,64}$/i;

export function normalizeOptions(input = {}) {
  const output = { ...DEFAULTS };
  if (!input || typeof input !== "object") return output;
  output.theme = normalizeTheme(input.theme);
  if (
    typeof input.language === "string" &&
    (input.language === "site" || Object.hasOwn(LANGUAGE_NAMES, input.language))
  ) {
    output.language = input.language;
  }
  for (const key of Object.keys(DEFAULTS)) {
    if (typeof DEFAULTS[key] === "boolean" && typeof input[key] === "boolean")
      output[key] = input[key];
  }
  if (Number.isInteger(input.preloadPages) && input.preloadPages >= 0 && input.preloadPages <= 5) {
    output.preloadPages = input.preloadPages;
  }
  if (typeof input.imgurClientId === "string" && /^[a-z0-9]{0,64}$/i.test(input.imgurClientId)) {
    output.imgurClientId = input.imgurClientId;
  }
  if (input.imgurProxyURL !== undefined) {
    const proxy = normalizeImgurProxy(input.imgurProxyURL);
    if (proxy) output.imgurProxyURL = proxy;
    else output.imgurProxy = false;
  }
  return output;
}

export function normalizeTags(value) {
  const raw = typeof value === "string" ? value.split(/[,\uFF0C\n]/) : value;
  if (!Array.isArray(raw) || raw.length > TAG_LIMITS.perMember)
    throw new Error(t("tagLimit", TAG_LIMITS.perMember));
  const result = [];
  for (const item of raw) {
    const text = typeof item === "string" ? item.trim() : item?.name?.trim?.();
    if (typeof text !== "string" || text.length > TAG_LIMITS.length)
      throw new Error(t("tagFormat", TAG_LIMITS.length));
    if (text && !result.includes(text)) result.push(text);
  }
  return result;
}

export function parseImport(text, allowParts = false) {
  if (byteLength(text) > BACKUP_BYTES) throw new Error(t("backupSize"));
  const next = /^--\u7528\u6237\u6807\u7b7e--\s*/;
  const input = JSON.parse(
    text
      .replace(/^(?:\uFEFF)?\s*/, "")
      .replace(/^V2EX_Polish_settings\s*/, "")
      .replace(next, ""),
  );
  const data = next.test(text.trim()) ? { members: input } : input;
  if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error(t("backupFormat"));
  if (data.schema !== undefined && data.schema !== 1 && !(allowParts && data.schema === 2))
    throw new Error(t("backupVersion"));
  let source = data.members ?? data["member-tag"];
  if (!source && data.meta?.databaseVersion === 3 && data.data && typeof data.data === "object") {
    source = Object.create(null);
    for (const [key, entry] of Object.entries(data.data)) {
      const name =
        /^https:\/\/(?:[a-z0-9-]+\.)*v2ex\.(?:com|co)\/member\/([a-z0-9_-]{1,64})\/?$/i.exec(
          key,
        )?.[1];
      if (!name || !Array.isArray(entry?.tags)) continue;
      const tags = entry.tags.includes("._DELETED_") ? [] : entry.tags;
      const existing = source[name.toLowerCase()];
      source[name.toLowerCase()] = existing
        ? existing.length && tags.length
          ? [...new Set([...existing, ...tags])]
          : []
        : tags;
    }
  }
  if (!source || typeof source !== "object" || Array.isArray(source))
    throw new Error(t("backupNoTags"));
  const entries = Object.entries(source);
  if (entries.length > TAG_LIMITS.importMembers)
    throw new Error(t("backupTooMany", TAG_LIMITS.importMembers.toLocaleString("en")));
  const members = Object.create(null);
  for (const [name, entry] of entries) {
    if (!validName.test(name)) throw new Error(`${t("badUsername")} ${name}`);
    if (Object.hasOwn(members, name.toLowerCase())) throw new Error(t("backupFormat"));
    members[name.toLowerCase()] = normalizeTags(
      Array.isArray(entry) || typeof entry === "string" ? entry : entry?.tags,
    );
  }
  const options =
    data.schema && data.options && typeof data.options === "object" && !Array.isArray(data.options)
      ? normalizeOptions(data.options)
      : null;
  if (
    options &&
    (!Object.hasOwn(data.options, "imgurProxy") || !Object.hasOwn(data.options, "imgurProxyURL"))
  ) {
    delete options.imgurProxy;
    delete options.imgurProxyURL;
  }
  return { members, options, part: data.schema === 2 ? (data.part ?? {}) : null };
}

export function createStorage(api) {
  const cache = new Map();
  const memberPrefix = `${PREFIX}member:`;
  const keyFor = (name) => memberPrefix + name.toLowerCase();
  const memberKeys = () => api.keys().filter((key) => key.startsWith(memberPrefix));
  const write = (key, value) => {
    if (JSON.stringify(api.get(key)) === JSON.stringify(value)) return false;
    api.set(key, value);
    return true;
  };
  return {
    options: () => normalizeOptions(api.get(`${PREFIX}options`)),
    saveOptions: (value) => write(`${PREFIX}options`, normalizeOptions(value)),
    getTags(name) {
      const key = keyFor(name);
      if (!cache.has(key)) cache.set(key, normalizeTags(api.get(key, [])));
      return cache.get(key);
    },
    taggedMembers() {
      return memberKeys()
        .map((key) => ({
          name: key.slice(memberPrefix.length),
          tags: normalizeTags(api.get(key, [])),
        }))
        .filter(({ name, tags }) => validName.test(name) && tags.length)
        .sort((a, b) => a.name.localeCompare(b.name));
    },
    setTags(name, value) {
      if (!validName.test(name)) throw new Error(t("badUsername"));
      const tags = normalizeTags(value);
      const key = keyFor(name);
      write(key, tags);
      cache.set(key, tags);
    },
    watchTags(name, callback) {
      api.listen(keyFor(name), (_key, _old, value, remote) => {
        if (!remote) return;
        cache.set(keyFor(name), normalizeTags(value ?? []));
        callback();
      });
    },
    snapshot() {
      const members = Object.create(null);
      for (const key of memberKeys()) members[key.slice(memberPrefix.length)] = api.get(key);
      const { imgurClientId: _clientId, ...options } = this.options();
      return { schema: 1, exportedAt: new Date().toISOString(), options, members };
    },
    export() {
      return JSON.stringify(this.snapshot(), null, 2);
    },
    previewRestore(data) {
      const changes = { added: 0, deleted: 0, conflicts: 0 };
      for (const [name, tags] of Object.entries(data.members)) {
        const local = api.get(keyFor(name));
        if (local === undefined) changes[tags.length ? "added" : "deleted"]++;
        else if (JSON.stringify(local) !== JSON.stringify(tags)) changes.conflicts++;
      }
      return changes;
    },
    restore(data, { tags = true, settings = false, onTags } = {}) {
      let imported = 0;
      if (tags) {
        for (const [name, value] of Object.entries(data.members)) {
          // Existing records include tombstones and may have changed since the preview.
          if (api.get(keyFor(name)) !== undefined) continue;
          this.setTags(name, value);
          imported++;
          onTags?.(name, value);
        }
      }
      if (settings && data.options) {
        const { imgurProxy, imgurProxyURL, imgurClientId } = this.options();
        this.saveOptions({ imgurProxy, imgurProxyURL, ...data.options, imgurClientId });
      }
      return imported;
    },
    import(text) {
      return this.restore(parseImport(text));
    },
    get: (key, fallback) => api.get(`${PREFIX}${key}`, fallback),
    set: (key, value) => write(`${PREFIX}${key}`, value),
    recordUpload(record) {
      const id = crypto.randomUUID();
      write(`${PREFIX}upload:${id}`, { ...record, id, createdAt: new Date().toISOString() });
    },
    removeUpload(id) {
      if (typeof id !== "string" || !/^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/i.test(id))
        throw new Error(t("removeUploadFailed"));
      api.delete(`${PREFIX}upload:${id}`);
    },
    uploads() {
      return api
        .keys()
        .filter((key) => key.startsWith(`${PREFIX}upload:`))
        .map((key) => api.get(key))
        .filter(Boolean)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },
  };
}
