import { t } from "./i18n.js";
export const PREFIX = "v2ex-lite:";
export const DEFAULT_IMGUR_CLIENT_ID = "3107b9ef8b316f3";
export const DEFAULTS = Object.freeze({
  privacy: false,
  newTab: true,
  preview: true,
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
  return output;
}

export function normalizeTags(value) {
  const raw = typeof value === "string" ? value.split(/[,\uFF0C\n]/) : value;
  if (!Array.isArray(raw) || raw.length > 20) throw new Error(t("tagLimit"));
  const result = [];
  for (const item of raw) {
    const text = typeof item === "string" ? item.trim() : item?.name?.trim?.();
    if (typeof text !== "string" || text.length > 80) throw new Error(t("tagFormat"));
    if (text && !result.includes(text)) result.push(text);
  }
  return result;
}

export function parseImport(text) {
  if (text.length > 2_000_000) throw new Error(t("backupSize"));
  const data = JSON.parse(text.replace(/^V2EX_Polish_settings\s*/, ""));
  if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error(t("backupFormat"));
  if (data.schema !== undefined && data.schema !== 1) throw new Error(t("backupVersion"));
  const source = data.members ?? data["member-tag"];
  if (!source || typeof source !== "object" || Array.isArray(source))
    throw new Error(t("backupNoTags"));
  const entries = Object.entries(source);
  if (entries.length > 20_000) throw new Error(t("backupTooMany"));
  const members = Object.create(null);
  for (const [name, entry] of entries) {
    if (!validName.test(name)) throw new Error(`${t("badUsername")} ${name}`);
    members[name.toLowerCase()] = normalizeTags(
      Array.isArray(entry) || typeof entry === "string" ? entry : entry?.tags,
    );
  }
  return { members, options: data.schema === 1 ? normalizeOptions(data.options) : null };
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
    export() {
      const members = Object.create(null);
      for (const key of memberKeys()) members[key.slice(memberPrefix.length)] = api.get(key);
      const { imgurClientId: _clientId, ...options } = this.options();
      return JSON.stringify(
        { schema: 1, exportedAt: new Date().toISOString(), options, members },
        null,
        2,
      );
    },
    import(text) {
      const data = parseImport(text);
      let imported = 0;
      for (const [name, tags] of Object.entries(data.members)) {
        // Empty local entries are tombstones; importing must not resurrect removed tags.
        if (api.get(keyFor(name)) !== undefined) continue;
        this.setTags(name, tags);
        imported++;
      }
      return imported;
    },
    get: (key, fallback) => api.get(`${PREFIX}${key}`, fallback),
    set: (key, value) => write(`${PREFIX}${key}`, value),
    recordUpload(record) {
      const id = crypto.randomUUID();
      write(`${PREFIX}upload:${id}`, { ...record, id, createdAt: new Date().toISOString() });
    },
    uploads() {
      return api
        .keys()
        .filter((key) => key.startsWith(`${PREFIX}upload:`))
        .map((key) => api.get(key))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },
  };
}
