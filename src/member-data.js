import { t } from "./i18n.js";
import { currentUser, syncOnce } from "./dom.js";

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

export function parseMemberReplies(doc) {
  const replies = [];
  for (const row of [...doc.querySelectorAll("#Main .dock_area")].slice(0, 3)) {
    const link = row.querySelector('a[href*="/t/"]');
    const content = row.nextElementSibling?.querySelector(".reply_content");
    if (!link?.textContent.trim() || !content) continue;
    try {
      const url = new URL(link.getAttribute("href"), location.href);
      if (url.origin !== location.origin || !/^\/t\/\d+\/?$/.test(url.pathname)) continue;
      const text = content.cloneNode(true);
      for (const br of text.querySelectorAll("br")) br.replaceWith(" ");
      const excerpt = text.textContent.replace(/\s+/g, " ").trim();
      replies.push({
        title: link.textContent.trim(),
        url: url.href,
        text: excerpt.length > 160 ? `${excerpt.slice(0, 160)}\u2026` : excerpt,
        time: row.querySelector(".fade")?.textContent.trim() ?? "",
      });
    } catch {
      /* Ignore malformed links in the optional reply list. */
    }
  }
  return replies;
}

function followAction(doc) {
  const header = doc.querySelector("#Main h1")?.closest(".box");
  for (const control of header?.querySelectorAll(
    'input[type="button"][onclick], button[onclick]',
  ) ?? []) {
    const match = /location\.href\s*=\s*['"](\/(unfollow|follow)\/(\d+)\?once=\d+)['"]/.exec(
      control.getAttribute("onclick"),
    );
    if (match) return { path: match[1], following: match[2] === "unfollow", id: match[3] };
  }
  return null;
}

export async function fetchMemberPage(name, signal, fetcher = fetch) {
  if (!/^[a-z0-9_-]{1,64}$/i.test(name)) throw new Error(t("badUsername"));
  const path = `/member/${encodeURIComponent(name)}`;
  const response = await fetcher(path, { credentials: "same-origin", signal, cache: "no-store" });
  const final = new URL(response.url || path, location.href);
  if (
    !response.ok ||
    final.origin !== location.origin ||
    final.pathname.toLowerCase() !== path.toLowerCase()
  )
    throw new Error(t("memberPageFailed"));
  const doc = new DOMParser().parseFromString(await response.text(), "text/html");
  if (!doc.querySelector("#Main")) throw new Error(t("memberPageUnexpected"));
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
          response.status === 404 ? t("memberMissing") : t("memberFetchFailed"),
        );
        error.status = response.status;
        throw error;
      }
      const result = await response.json();
      if (
        typeof result.username !== "string" ||
        result.username.toLowerCase() !== name.toLowerCase()
      )
        throw new Error(t("memberMismatch"));
      return result;
    }),
    fetchMemberPage(name, signal, fetcher).catch((error) => {
      if (signal.aborted) throw error;
      return null;
    }),
  ]);
  const rank = page?.querySelector('#Main a[href="/top/dau"]')?.textContent.trim();
  const activityRank = Number(rank);
  return {
    ...data,
    topics: page ? parseMemberTopics(page) : [],
    replies: page ? parseMemberReplies(page) : [],
    activityRank:
      /^\d+$/.test(rank ?? "") && Number.isSafeInteger(activityRank) && activityRank > 0
        ? activityRank
        : null,
    following: page ? (followAction(page)?.following ?? null) : null,
  };
}

export async function setMemberFollow(name, following, account, fetcher = fetch) {
  const signal = AbortSignal.timeout(10_000);
  const page = await fetchMemberPage(name, signal, fetcher);
  if (!account || currentUser(page)?.toLowerCase() !== account.toLowerCase())
    throw new Error(t("accountChanged"));
  const action = followAction(page);
  if (!action) throw new Error(t("followUnavailable"));
  if (action.following === following) return following;
  const response = await fetcher(action.path, { credentials: "same-origin", signal });
  const final = new URL(response.url || action.path, location.href);
  if (
    !response.ok ||
    final.origin !== location.origin ||
    ![action.path.split("?")[0], `/member/${name}`].includes(final.pathname)
  )
    throw new Error(t("followFailed"));
  const verified = followAction(await fetchMemberPage(name, signal, fetcher));
  if (verified?.id !== action.id || verified.following !== following)
    throw new Error(t("followFailed"));
  return following;
}

function blockPath(doc) {
  for (const control of doc.querySelectorAll(
    '#Main input[type="button"][onclick], #Main button[onclick]',
  )) {
    const path = /location\.href\s*=\s*['"](\/block\/\d+\?once=\d+)['"]/.exec(
      control.getAttribute("onclick"),
    )?.[1];
    if (path) return path;
  }
  return null;
}

export async function blockMember(name, fetcher = fetch) {
  const signal = AbortSignal.timeout(10_000);
  const page = await fetchMemberPage(name, signal, fetcher);
  const path = blockPath(page);
  if (!path) throw new Error(t("blockUnavailable"));
  const response = await fetcher(path, { credentials: "same-origin", signal });
  const final = new URL(response.url || path, location.href);
  if (
    !response.ok ||
    final.origin !== location.origin ||
    ![path.split("?")[0], `/member/${name}`].includes(final.pathname)
  )
    throw new Error(t("blockFailed"));
  const result = new DOMParser().parseFromString(await response.text(), "text/html");
  syncOnce(result);
  const verified = await fetchMemberPage(name, signal, fetcher);
  if (blockPath(verified)) throw new Error(t("blockUnconfirmed"));
}
