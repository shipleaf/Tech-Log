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
  const postMeta = [
    { label: "작성", value: formatPostDate(post.date) },
    { label: "읽기", value: `${post.readingMinutes}분` },
    { label: "조회", value: "0명" },
    { label: "좋아요", value: "0명" },
  ];

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-14 md:px-10 md:py-18">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "w-fit rounded-full px-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
        )}
      >
        <ArrowLeft />
        목록으로 돌아가기
      </Link>

      <article className="flex flex-col gap-24">
        <header className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <div className="flex flex-wrap justify-center gap-2">
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
          <dl className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
            {postMeta.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <dt className="font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  {item.label}
                </dt>
                <dd className="font-medium text-foreground">{item.value}</dd>
              </div>
            ))}
          </dl>
        </header>
        <div className="mx-auto w-full max-w-3xl">
          <div className="prose prose-lg max-w-none">{content}</div>
        </div>
      </article>
    </div>
  );
}
