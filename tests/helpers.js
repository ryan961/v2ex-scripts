import { JSDOM } from "jsdom";

export function dom(html, url = "https://www.v2ex.com/t/123") {
  const instance = new JSDOM(html, { url });
  Object.defineProperty(globalThis, "window", { configurable: true, value: instance.window });
  for (const key of [
    "document",
    "location",
    "DOMParser",
    "Event",
    "FormData",
    "File",
    "Node",
    "Element",
    "HTMLElement",
    "ShadowRoot",
    "Document",
    "getComputedStyle",
  ]) {
    Object.defineProperty(globalThis, key, { configurable: true, value: instance.window[key] });
  }
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: instance.window.navigator,
  });
  return instance;
}

export function memoryAPI() {
  const data = new Map();
  const writes = [];
  const listeners = new Map();
  return {
    data,
    writes,
    listeners,
    get: (key, fallback) => (data.has(key) ? structuredClone(data.get(key)) : fallback),
    set: (key, value) => {
      data.set(key, structuredClone(value));
      writes.push(key);
    },
    keys: () => [...data.keys()],
    listen: (key, callback) => listeners.set(key, callback),
  };
}

export function locks() {
  let held = false;
  return {
    async request(_name, _options, callback) {
      if (held) return callback(null);
      held = true;
      try {
        return await callback({ name: "check-in" });
      } finally {
        held = false;
      }
    },
  };
}
