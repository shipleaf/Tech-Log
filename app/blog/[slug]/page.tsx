import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { formatPostDate } from "@/lib/format";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getPostBySlug, getPublishedPostSlugs } from "@/runtime/blog";
import { renderPostContent } from "@/runtime/blog-mdx";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getPublishedPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || !post.published) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || !post.published) {
    notFound();
  }

  const content = await renderPostContent(post.content);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-14 md:py-18">
      <Link
        href="/blog"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "w-fit rounded-full px-0 text-muted-foreground hover:bg-transparent hover:text-foreground",
        )}
      >
        <ArrowLeft />
        목록으로 돌아가기
      </Link>

      <article className="surface-card overflow-hidden">
        <header className="border-b border-border/70 px-6 py-8 md:px-10">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="space-y-3">
              <h1 className="font-[family-name:var(--font-newsreader)] text-5xl tracking-[-0.05em] text-foreground">
                {post.title}
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                {post.description}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              {formatPostDate(post.date)} · {post.readingMinutes}분 읽기
            </p>
          </div>
        </header>
        <div className="px-6 py-10 md:px-10">
          <div className="prose prose-lg max-w-none">{content}</div>
        </div>
      </article>
    </div>
  );
}
