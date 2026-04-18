import type { Route } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatPostDate } from "@/lib/format";
import { buttonVariants } from "@/components/ui/button";
import type { PostSummary } from "@/types/post";
import { cn } from "@/lib/utils";

type PostCardProps = {
  post: PostSummary;
  index?: number;
};

export function PostCard({ post, index = 0 }: PostCardProps) {
  const href = `/blog/${post.slug}` as Route;

  return (
    <Link
      href={href}
      className="group block h-full rounded-[calc(var(--radius)*1.2)] focus-visible:outline-none"
    >
      <article
        className="surface-card flex h-full cursor-pointer flex-col gap-5 p-6 transition-[transform,box-shadow] duration-300 group-hover:-translate-y-1 group-hover:ring-2 group-hover:ring-ring group-hover:ring-offset-4 group-hover:ring-offset-background group-focus-visible:-translate-y-1 group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-4 group-focus-visible:ring-offset-background animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
        style={{ animationDelay: `${index * 120}ms` }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">
              {formatPostDate(post.date)} · {post.readingMinutes}분 읽기
            </p>
            <div className="space-y-2">
              <h2 className="font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em] text-foreground">
                {post.title}
              </h2>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground">
                {post.description}
              </p>
            </div>
          </div>
          <span className="hidden rounded-full border border-border bg-secondary px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted-foreground md:inline-flex">
            {post.slug}
          </span>
        </div>
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
        <div className="mt-auto">
          <span
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "pointer-events-none w-fit rounded-full px-0 text-sm text-primary",
            )}
          >
            읽으러 가기
            <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1" />
          </span>
        </div>
      </article>
    </Link>
  );
}
