import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const repoRoot = process.cwd();

function readRepoFile(...segments: string[]) {
  return readFileSync(path.join(repoRoot, ...segments), "utf8");
}

test("home page renders the post list browser in a 1440px content area", () => {
  const page = readRepoFile("app", "page.tsx");

  assert.match(page, /import \{ PostListBrowser \} from "@\/components\/blog\/post-list-browser"/);
  assert.match(page, /const posts = await getAllPosts\(\)/);
  assert.match(page, /max-w-\[1440px\]/);
  assert.match(page, /<PostListBrowser posts=\{posts\} \/>/);
  assert.doesNotMatch(page, /M1 · Blog Foundation|Latest Posts|바로 확인할 수 있는 샘플 포스트/);
});

test("post list browser exposes category tabs, sorting, and grid-list view controls", () => {
  const browser = readRepoFile("components", "blog", "post-list-browser.tsx");

  for (const category of ["전체", "프론트엔드", "백엔드", "인프라", "CS", "AI", "취업준비"]) {
    assert.match(browser, new RegExp(category));
  }

  assert.match(browser, /type ViewMode = "grid" \| "list"/);
  assert.match(browser, /useState<ViewMode>\("grid"\)/);
  assert.match(browser, /정렬/);
  assert.doesNotMatch(browser, /Filter/);
  assert.doesNotMatch(browser, /필터/);
  assert.match(browser, /aria-label="그리드 보기"/);
  assert.match(browser, /aria-label="리스트 보기"/);
  assert.match(browser, /lg:grid-cols-3/);
  assert.match(browser, /조회수 0회/);
});

test("post list browser provides thumbnail images for post cards", () => {
  const browser = readRepoFile("components", "blog", "post-list-browser.tsx");
  const config = readRepoFile("next.config.ts");

  assert.match(browser, /import Image from "next\/image"/);
  assert.match(browser, /images\.unsplash\.com/);
  assert.match(browser, /alt=\{`\$\{title\} 썸네일/);
  assert.match(config, /hostname: "images\.unsplash\.com"/);
});
