import { syncOnce } from "./dom.js";

export function parseMemberTopics(doc) {
  const topics = [];
  for (const row of [...doc.querySelectorAll(".cell.item")].slice(0, 5)) {
    const link = row.querySelector(".item_title .topic-link");
    if (!link?.textContent.trim()) continue;
    try {
      const url = new URL(link.getAttribute("href"), location.href);
      if (url.origin === location.origin && /^\/t\/\d+\/?$/.test(url.pathname))
        topics.push({ title: link.textContent.trim(), url: url.href });
    } catch {
      /* Ignore malformed links in the optional topic list. */
    }
  }
  return topics;
}

export async function fetchMemberPage(name, signal, fetcher = fetch) {
  if (!/^[a-z0-9_-]{1,64}$/i.test(name)) throw new Error("Invalid username.");
  const path = `/member/${encodeURIComponent(name)}`;
  const response = await fetcher(path, { credentials: "same-origin", signal, cache: "no-store" });
  const final = new URL(response.url || path, location.href);
  if (
    !response.ok ||
    final.origin !== location.origin ||
    final.pathname.toLowerCase() !== path.toLowerCase()
  )
    throw new Error(
      "\u7528\u6237\u9875\u9762\u52a0\u8f7d\u5931\u8d25\uff0c\u8bf7\u68c0\u67e5\u767b\u5f55\u6216\u9a8c\u8bc1\u72b6\u6001\u3002",
    );
  const doc = new DOMParser().parseFromString(await response.text(), "text/html");
  if (!doc.querySelector("#Main"))
    throw new Error("\u7528\u6237\u9875\u9762\u5185\u5bb9\u5f02\u5e38\u3002");
  syncOnce(doc);
  return doc;
}

export async function fetchMember(name, signal, fetcher = fetch) {
  const [data, page] = await Promise.all([
    fetcher(`/api/members/show.json?username=${encodeURIComponent(name)}`, {
      credentials: "same-origin",
      signal,
    }).then(async (response) => {
      if (!response.ok) {
        const error = new Error(
          response.status === 404
            ? "\u67e5\u65e0\u6b64\u7528\u6237\uff0c\u7591\u4f3c\u5df2\u88ab\u5c01\u7981"
            : "\u83b7\u53d6\u7528\u6237\u4fe1\u606f\u5931\u8d25",
        );
        error.status = response.status;
        throw error;
      }
      const result = await response.json();
      if (
        typeof result.username !== "string" ||
        result.username.toLowerCase() !== name.toLowerCase()
      )
        throw new Error("\u7528\u6237\u4fe1\u606f\u4e0e\u8bf7\u6c42\u4e0d\u4e00\u81f4\u3002");
      return result;
    }),
    fetchMemberPage(name, signal, fetcher).catch((error) => {
      if (signal.aborted) throw error;
      return null;
    }),
  ]);
  return { ...data, topics: page ? parseMemberTopics(page) : [] };
}

export async function blockMember(name, fetcher = fetch) {
  const signal = AbortSignal.timeout(10_000);
  const page = await fetchMemberPage(name, signal, fetcher);
  const onclick =
    page.querySelector('input[type="button"][value="Block"]')?.getAttribute("onclick") ?? "";
  const path = /location\.href\s*=\s*['"](\/block\/\d+\?once=\d+)['"]/.exec(onclick)?.[1];
  if (!path)
    throw new Error(
      "\u672a\u627e\u5230\u5c4f\u853d\u6309\u94ae\uff0c\u8be5\u7528\u6237\u53ef\u80fd\u5df2\u88ab\u5c4f\u853d\uff0c\u6216\u767b\u5f55\u72b6\u6001\u5df2\u5931\u6548\u3002",
    );
  const response = await fetcher(path, { credentials: "same-origin", signal });
  const final = new URL(response.url || path, location.href);
  if (
    !response.ok ||
    final.origin !== location.origin ||
    ![path.split("?")[0], `/member/${name}`].includes(final.pathname)
  )
    throw new Error(
      "\u5c4f\u853d\u64cd\u4f5c\u5931\u8d25\uff0c\u8bf7\u5237\u65b0\u9875\u9762\u68c0\u67e5\u3002",
    );
  const result = new DOMParser().parseFromString(await response.text(), "text/html");
  syncOnce(result);
  const verified = await fetchMemberPage(name, signal, fetcher);
  if (verified.querySelector('input[type="button"][value="Block"]'))
    throw new Error(
      "\u672a\u80fd\u786e\u8ba4\u5c4f\u853d\u7ed3\u679c\uff0c\u8bf7\u5237\u65b0\u7528\u6237\u9875\u9762\u68c0\u67e5\u3002",
    );
}
