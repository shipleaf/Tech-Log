import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import type { Post, PostFrontmatter, PostSummary } from "@/types/post";

const POSTS_DIRECTORY = path.join(process.cwd(), "content", "blog");
const WORDS_PER_MINUTE = 220;

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function normalizeDate(value: unknown, slug: string) {
  if (typeof value === "string" && value.length > 0) {
    return value;
  }

  throw new Error(`Invalid "date" frontmatter in ${slug}.mdx`);
}

function normalizeFrontmatter(data: Record<string, unknown>, slug: string): PostFrontmatter {
  if (typeof data.title !== "string" || data.title.length === 0) {
    throw new Error(`Missing "title" frontmatter in ${slug}.mdx`);
  }

  if (typeof data.description !== "string" || data.description.length === 0) {
    throw new Error(`Missing "description" frontmatter in ${slug}.mdx`);
  }

  return {
    title: data.title,
    description: data.description,
    date: normalizeDate(data.date, slug),
    tags: isStringArray(data.tags) ? data.tags : [],
    published: typeof data.published === "boolean" ? data.published : true,
  };
}

function estimateReadingMinutes(content: string) {
  const plainText = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, " ")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/[#>*_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!plainText) {
    return 1;
  }

  const wordCount = plainText.split(" ").length;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

async function readPostSource(slug: string) {
  const filePath = path.join(POSTS_DIRECTORY, `${slug}.mdx`);

  try {
    return await fs.readFile(filePath, "utf8");
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return null;
    }

    throw error;
  }
}

function parsePost(slug: string, source: string): Post {
  const { content, data } = matter(source);
  const frontmatter = normalizeFrontmatter(data, slug);

  return {
    slug,
    content,
    readingMinutes: estimateReadingMinutes(content),
    ...frontmatter,
  };
}

function sortPostsByDate(posts: PostSummary[]) {
  return [...posts].sort((left, right) => {
    return new Date(right.date).getTime() - new Date(left.date).getTime();
  });
}

function toPostSummary(post: Post): PostSummary {
  return {
    slug: post.slug,
    title: post.title,
    description: post.description,
    date: post.date,
    tags: post.tags,
    published: post.published,
    readingMinutes: post.readingMinutes,
  };
}

export async function getAllPosts() {
  const fileNames = await fs.readdir(POSTS_DIRECTORY);
  const posts = await Promise.all(
    fileNames
      .filter((fileName) => fileName.endsWith(".mdx"))
      .map(async (fileName) => {
        const slug = fileName.replace(/\.mdx$/, "");
        const source = await fs.readFile(path.join(POSTS_DIRECTORY, fileName), "utf8");
        return parsePost(slug, source);
      }),
  );

  return sortPostsByDate(
    posts.filter((post) => post.published).map(toPostSummary),
  );
}

export async function getPostBySlug(slug: string) {
  const source = await readPostSource(slug);

  if (!source) {
    return null;
  }

  return parsePost(slug, source);
}

export async function getPublishedPostSlugs() {
  const posts = await getAllPosts();
  return posts.map((post) => post.slug);
}
