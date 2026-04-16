import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const repoRoot = process.cwd();

function readRepoFile(...segments: string[]) {
  return readFileSync(path.join(repoRoot, ...segments), "utf8");
}

test("blog post page keeps the article header borderless and centered", () => {
  const page = readRepoFile("app", "blog", "[slug]", "page.tsx");

  assert.doesNotMatch(page, /surface-card|border-b border-border/);
  assert.match(page, /max-w-3xl flex-col items-center gap-6 text-center/);
  assert.match(page, /flex-wrap items-center justify-center gap-x-6 gap-y-3/);
  assert.match(page, /mx-auto w-full max-w-3xl/);
});

test("blog post page reserves placeholder slots for engagement stats", () => {
  const page = readRepoFile("app", "blog", "[slug]", "page.tsx");

  assert.match(page, /{ label: "조회", value: "0명" }/);
  assert.match(page, /{ label: "좋아요", value: "0명" }/);
  assert.match(page, /{ label: "작성", value: formatPostDate\(post.date\) }/);
  assert.match(page, /{ label: "읽기", value: `\$\{post.readingMinutes\}분` }/);
});
