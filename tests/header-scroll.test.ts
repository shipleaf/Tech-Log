import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const repoRoot = process.cwd();

function readRepoFile(...segments: string[]) {
  return readFileSync(path.join(repoRoot, ...segments), "utf8");
}

test("SiteHeader keeps a fixed 64px sticky header without scroll color state", () => {
  const header = readRepoFile("components", "layout", "SiteHeader.tsx");

  assert.match(header, /sticky top-0 z-50 h-16 border-b border-border bg-background text-foreground/);
  assert.match(header, /max-w-\[1440px\]/);
  assert.match(header, /flex h-16 w-full/);
  assert.doesNotMatch(header, /"use client"/);
  assert.doesNotMatch(header, /useEffect|useState|addEventListener|scrollY|data-scrolled/);
  assert.doesNotMatch(header, /bg-primary text-primary-foreground|border-transparent bg-transparent/);
});

test("RootLayout renders shared 1440px content containers", () => {
  const layout = readRepoFile("app", "layout.tsx");

  assert.match(layout, /import \{ SiteHeader \} from "@\/components\/layout\/SiteHeader"/);
  assert.match(layout, /<SiteHeader \/>/);
  assert.match(layout, /<body className="min-h-full overflow-x-clip">/);
  assert.match(layout, /<div className="relative flex min-h-screen flex-col">/);
  assert.match(layout, /max-w-\[1440px\]/);
  assert.doesNotMatch(layout, /overflow-x-hidden/);
});
