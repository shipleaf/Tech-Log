import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const repoRoot = process.cwd();

function readRepoFile(...segments: string[]) {
  return readFileSync(path.join(repoRoot, ...segments), "utf8");
}

test("globals.css locks the UI to Pretendard and black-white tokens", () => {
  const css = readRepoFile("app", "globals.css");
  const hexColors = [...css.matchAll(/#(?:[0-9a-fA-F]{3}){1,2}\b/g)].map(
    ([value]) => value.toLowerCase(),
  );

  assert.match(css, /Pretendard Variable/);
  assert.doesNotMatch(css, /@fontsource\/manrope|@fontsource\/newsreader|@fontsource\/ibm-plex-mono/);
  assert.doesNotMatch(css, /oklch\(|rgba\(|color-mix\(|radial-gradient|linear-gradient/);
  assert.deepEqual([...new Set(hexColors)].sort(), ["#000", "#fff"]);
  assert.match(css, /--code-tab-tsx: hsl\(/);
  assert.match(css, /--code-tab-javascript: hsl\(/);
  assert.match(css, /--code-block-surface: hsl\(/);
});

test("shared UI files avoid translucent or multi-color styling shortcuts", () => {
  const files = [
    ["app", "layout.tsx"],
    ["app", "page.tsx"],
    ["app", "blog", "page.tsx"],
    ["app", "blog", "[slug]", "page.tsx"],
    ["components", "blog", "mdx-components.tsx"],
    ["components", "blog", "post-card.tsx"],
    ["components", "blog", "post-list-browser.tsx"],
    ["components", "layout", "SiteHeader.tsx"],
    ["components", "ui", "button.tsx"],
  ];
  const forbiddenPatterns = [
    /(?:bg|text|border|ring|decoration)-[A-Za-z-]+\/[0-9]+/,
    /shadow-\[/,
    /backdrop-blur/,
    /bg-\[(?:radial-gradient|linear-gradient)/,
    /opacity-/,
  ];

  for (const file of files) {
    const content = readRepoFile(...file);

    for (const pattern of forbiddenPatterns) {
      assert.doesNotMatch(content, pattern, file.join("/"));
    }
  }
});
