import assert from "node:assert/strict";
import test from "node:test";
import { createHTTP, currentUser, safeContent, safeURL, syncOnce } from "../src/dom.js";
import { dom } from "./helpers.js";

test("remote content drops executable elements, handlers, unsafe URLs and styles", () => {
  dom(
    '<div id="source"><script>alert(1)</script><img src="javascript:x" onerror="x()"><a href="javascript:x">bad</a><iframe src="https://evil.test"></iframe><p style="color:red" onclick="x()">Safe <b>text</b></p><a href="/member/a">member</a></div>',
  );
  const target = document.createElement("div");
  target.append(safeContent(document.querySelector("#source"), location.href));
  assert.equal(target.querySelector("script, iframe, [onclick], [onerror], [style]"), null);
  assert.equal(target.querySelector("img"), null);
  assert.equal(target.querySelector("a").hasAttribute("href"), false);
  assert.equal(target.querySelectorAll("a")[1].href, "https://www.v2ex.com/member/a");
  assert.match(target.textContent, /Safe text/);
  assert.equal(safeURL(null, location.href), null);
  assert.equal(safeURL("https://user:secret@evil.test", location.href), null);
});

test("once updates only numeric tokens, including the site's existing global", () => {
  dom('<form><input name="once" value="1"></form>');
  const doc = new DOMParser().parseFromString('<script>var once = "42";</script>', "text/html");
  const page = { once: "1" };
  syncOnce(doc, page);
  assert.equal(page.once, "42");
  assert.equal(document.querySelector("input").value, "42");
  syncOnce(new DOMParser().parseFromString('<input name="once" value="bad">', "text/html"), page);
  assert.equal(page.once, "42");
});

test("current site account cards work without a top navigation username", () => {
  dom(
    '<div id="Top"><a href="/settings">Settings</a></div><div id="Rightbar"><div class="box"><a href="/member/reader">reader</a><a href="/balance">Balance</a></div></div>',
  );
  assert.equal(currentUser(), "reader");
  document.querySelector('a[href="/balance"]').remove();
  assert.equal(currentUser(), null);
});

test("reward redirects are allowed, but external redirects with identical paths are rejected", async () => {
  dom("");
  document.cookie = "V2EX_LANG=enus";
  const get = createHTTP(async (url) => ({
    ok: true,
    url: url.includes("redeem") ? "https://www.v2ex.com/mission/daily" : "https://evil.test/t/123",
    text: async () => '<div id="Main">Daily login reward already redeemed</div>',
  }));
  assert.ok(await get("/mission/daily/redeem?once=123"));
  await assert.rejects(get("/t/123"), /redirected/);
});

test("page requests serialize, survive failures and reject sign-in redirects", async () => {
  dom("<div></div>");
  document.cookie = "V2EX_LANG=enus";
  let active = 0;
  let peak = 0;
  const get = createHTTP(async (url) => {
    active++;
    peak = Math.max(peak, active);
    await new Promise((resolve) => setTimeout(resolve, 5));
    active--;
    return {
      ok: true,
      url: url.endsWith("/bad") ? "https://www.v2ex.com/signin" : url,
      text: async () => '<div id="Main">ok</div>',
    };
  });
  const results = await Promise.allSettled([get("/bad"), get("/good"), get("/good2")]);
  assert.equal(results[0].status, "rejected");
  assert.equal(results[1].status, "fulfilled");
  assert.equal(peak, 1);
  await assert.rejects(get("https://evil.test"), /Cross-origin/);
});
