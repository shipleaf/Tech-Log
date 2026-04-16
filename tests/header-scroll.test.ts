import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const repoRoot = process.cwd();

function readRepoFile(...segments: string[]) {
  return readFileSync(path.join(repoRoot, ...segments), "utf8");
}

test("SiteHeader uses scroll state to drive sticky monochrome transitions", () => {
  const header = readRepoFile("components", "layout", "SiteHeader.tsx");

  assert.match(header, /useEffect/);
  assert.match(header, /window\.addEventListener\("scroll", syncScrollState, \{ passive: true \}\)/);
  assert.match(header, /window\.scrollY > scrollThreshold/);
  assert.match(header, /sticky top-0 z-50/);
  assert.match(header, /border-transparent bg-transparent text-foreground/);
  assert.match(header, /border-primary bg-primary text-primary-foreground/);
  assert.match(header, /transition-\[background-color,border-color,color\] duration-300 ease-out/);
  assert.match(header, /data-scrolled=\{isScrolled\}/);
});

test("RootLayout renders the shared SiteHeader component", () => {
  const layout = readRepoFile("app", "layout.tsx");

  assert.match(layout, /import \{ SiteHeader \} from "@\/components\/layout\/SiteHeader"/);
  assert.match(layout, /<SiteHeader \/>/);
  assert.match(layout, /<body className="min-h-full overflow-x-clip">/);
  assert.match(layout, /<div className="relative flex min-h-screen flex-col">/);
  assert.doesNotMatch(layout, /overflow-x-hidden/);
});
