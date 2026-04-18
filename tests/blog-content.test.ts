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
  assert.ok(post.title.length > 0);
  assert.match(post.content, /generateStaticParams/);
  assert.match(post.content, /```tsx/);
  assert.match(post.content, /```bash/);
});

test("sample posts include multiple fenced code languages for the blog code tabs", async () => {
  const firstPost = await getPostBySlug("first-post");
  const secondPost = await getPostBySlug("second-post");

  assert.ok(firstPost);
  assert.ok(secondPost);
  assert.match(firstPost.content, /```tsx/);
  assert.match(firstPost.content, /```bash/);
  assert.match(secondPost.content, /```mdx/);
  assert.match(secondPost.content, /```json/);
});

test("getPublishedPostSlugs only exposes publishable routes", async () => {
  const slugs = await getPublishedPostSlugs();

  assert.deepEqual(slugs, ["first-post", "second-post"]);
});

test("getPostBySlug returns null for an unknown slug", async () => {
  const post = await getPostBySlug("missing-post");

  assert.equal(post, null);
});
