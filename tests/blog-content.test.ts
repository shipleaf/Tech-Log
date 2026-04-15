import test from "node:test";
import assert from "node:assert/strict";
import { getAllPosts, getPostBySlug, getPublishedPostSlugs } from "@/runtime/blog";

test("getAllPosts returns published posts sorted by date descending", async () => {
  const posts = await getAllPosts();

  assert.equal(posts.length, 2);
  assert.deepEqual(
    posts.map((post) => post.slug),
    ["first-post", "second-post"],
  );
  assert.ok(posts.every((post) => post.readingMinutes >= 1));
});

test("getPostBySlug loads content and frontmatter for an existing post", async () => {
  const post = await getPostBySlug("first-post");

  assert.ok(post);
  assert.equal(post.title, "루트는 유지하고, 블로그 앱만 추가하기");
  assert.match(post.content, /generateStaticParams/);
});

test("getPublishedPostSlugs only exposes publishable routes", async () => {
  const slugs = await getPublishedPostSlugs();

  assert.deepEqual(slugs, ["first-post", "second-post"]);
});

test("getPostBySlug returns null for an unknown slug", async () => {
  const post = await getPostBySlug("missing-post");

  assert.equal(post, null);
});
