import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const repoRoot = process.cwd();

function readRepoFile(...segments: string[]) {
  return readFileSync(path.join(repoRoot, ...segments), "utf8");
}

test("PostCard wraps the whole card in a single link target", () => {
  const postCard = readRepoFile("components", "blog", "post-card.tsx");

  assert.match(postCard, /const href = `\/blog\/\$\{post\.slug\}` as Route;/);
  assert.match(postCard, /<Link\s+href=\{href\}/);
  assert.match(postCard, /className="group block h-full rounded-\[calc\(var\(--radius\)\*1\.2\)\] focus-visible:outline-none"/);
  assert.match(postCard, /<Link[\s\S]*<article/);
  assert.doesNotMatch(postCard, /<div className="mt-auto">\s*<Link/);
  assert.match(postCard, /pointer-events-none w-fit rounded-full px-0 text-sm text-primary/);
});

test("PostCard advertises hover and keyboard focus emphasis", () => {
  const postCard = readRepoFile("components", "blog", "post-card.tsx");

  assert.match(postCard, /cursor-pointer/);
  assert.match(postCard, /group-hover:-translate-y-1/);
  assert.match(postCard, /group-hover:ring-2 group-hover:ring-ring group-hover:ring-offset-4 group-hover:ring-offset-background/);
  assert.match(postCard, /group-focus-visible:-translate-y-1/);
  assert.match(postCard, /group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-4 group-focus-visible:ring-offset-background/);
  assert.match(postCard, /group-hover:translate-x-1 group-focus-visible:translate-x-1/);
});
