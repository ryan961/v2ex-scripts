import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("release artifact retains metadata and bundled licenses within its size budget", () => {
  const built = readFileSync(new URL("../dist/v2ex-lite.user.js", import.meta.url), "utf8");
  const metadata = readFileSync(new URL("../dist/v2ex-lite.meta.js", import.meta.url), "utf8");
  assert.ok(built.startsWith(metadata));
  for (const name of ["v2ex-polish-MIT", "v2ex-rep-MIT", "floating-ui-MIT", "lucide-LICENSE"]) {
    const license = readFileSync(new URL(`../licenses/${name}.txt`, import.meta.url), "utf8");
    assert.ok(built.replaceAll("\r\n", "\n").includes(license.replaceAll("\r\n", "\n").trim()));
  }
  assert.ok(Buffer.byteLength(built) <= 277 * 1024, "Release userscript exceeds 277 KiB");
  assert.doesNotMatch(
    built,
    /accounts\.google\.com\/gsi\/client|https:\/\/api\.github\.com\/repos\//,
  );
});

test("Greasy Fork artifact keeps readable code and matches the release version", () => {
  const built = readFileSync(
    new URL("../dist/v2ex-lite.greasyfork.user.js", import.meta.url),
    "utf8",
  );
  const metadata = readFileSync(new URL("../dist/v2ex-lite.meta.js", import.meta.url), "utf8");
  const versionLine = /^\/\/ @version\s+\S+/m;
  assert.equal(built.match(versionLine)?.[0], metadata.match(versionLine)?.[0]);
  assert.match(built, /^\/\/ @description\s+\p{Script=Han}/mu);
  assert.match(built, /^  function normalizeOptions\(/m);
  assert.doesNotMatch(built, /^\/\/ @(?:downloadURL|updateURL)\b/m);
  assert.ok(Buffer.byteLength(built) <= 2_000_000, "Greasy Fork userscript exceeds 2 MB");
});
