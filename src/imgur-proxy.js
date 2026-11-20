export const DEFAULT_IMGUR_PROXY = "https://proxy.duckduckgo.com/iu/?u=";

export function normalizeImgurProxy(value) {
  if (typeof value !== "string" || value.length > 512) return null;
  try {
    const url = new URL(value.trim());
    const parameter = /(?:^\?|&)([a-z][a-z0-9_.-]*)=$/i.exec(url.search)?.[1];
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.href.includes("#") ||
      !parameter ||
      url.searchParams.getAll(parameter).length !== 1
    )
      return null;
    return url.href;
  } catch {
    return null;
  }
}

function imgurImage(value, base) {
  try {
    const url = new URL(value, base);
    if (
      !["https://i.imgur.com", "http://i.imgur.com"].includes(url.origin) ||
      url.username ||
      url.password ||
      !/^\/[a-z0-9]+\.(?:avif|bmp|gif|jpe?g|png|webp)$/i.test(url.pathname)
    )
      return null;
    return url;
  } catch {
    return null;
  }
}

export function proxiedImageURL(value, proxy, base) {
  if (!proxy || !value || value.startsWith(proxy)) return value;
  const url = imgurImage(value, base);
  if (!url) return value;
  url.protocol = "https:";
  url.hash = "";
  return proxy + encodeURIComponent(url.href);
}

export function originalImageURL(value, proxy) {
  if (!proxy || !value.startsWith(proxy)) return value;
  try {
    return imgurImage(decodeURIComponent(value.slice(proxy.length)))?.href ?? value;
  } catch {
    return value;
  }
}

function proxySrcset(value, proxy, base) {
  const urlToken = /[\t\n\f\r ,]*([^\t\n\f\r ,][^\t\n\f\r ]*)/y;
  const descriptors = /(?:[^,(]|\([^)]*(?:\)|$))*,?/y;
  let result = "";
  let unchangedStart = 0;
  for (let match; (match = urlToken.exec(value));) {
    const start = urlToken.lastIndex - match[1].length;
    let end = urlToken.lastIndex;
    // Commas inside the URL are part of it; trailing commas end the candidate.
    while (value[end - 1] === ",") end--;
    const url = value.slice(start, end);
    const next = proxiedImageURL(url, proxy, base);
    if (next !== url) {
      result += value.slice(unchangedStart, start) + next;
      unchangedStart = end;
    }
    if (end === urlToken.lastIndex) {
      descriptors.lastIndex = end;
      descriptors.exec(value);
      urlToken.lastIndex = descriptors.lastIndex;
    }
  }
  return result + value.slice(unchangedStart);
}

export function proxyImgurImage(image, proxy) {
  const update = (node, attribute, next) => {
    if (next === node.getAttribute(attribute)) return;
    image.setAttribute("referrerpolicy", "no-referrer");
    node.setAttribute(attribute, next);
  };
  update(image, "src", proxiedImageURL(image.getAttribute("src"), proxy, image.baseURI));
  const picture = image.parentElement?.matches("picture") ? image.parentElement : null;
  const sources = picture?.querySelectorAll(":scope > source[srcset]") ?? [];
  for (const node of [...sources, image]) {
    const candidates = node.getAttribute("srcset");
    if (!candidates) continue;
    update(node, "srcset", proxySrcset(candidates, proxy, node.baseURI));
  }
}
