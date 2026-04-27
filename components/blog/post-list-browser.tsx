"use client";

import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpDown, Filter, Grid2X2, List } from "lucide-react";
import { formatPostDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PostSummary } from "@/types/post";

const categories = ["전체", "프론트엔드", "백엔드", "인프라", "CS", "AI", "취업준비"];

const categoryByTag: Record<string, string> = {
  "app-router": "프론트엔드",
  architecture: "CS",
  content: "프론트엔드",
  mdx: "프론트엔드",
  nextjs: "프론트엔드",
  publishing: "인프라",
};

const thumbnails = [
  {
    src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    alt: "코드가 표시된 개발자 작업 화면",
  },
  {
    src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    alt: "노트북과 기술 문서가 놓인 작업 책상",
  },
  {
    src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    alt: "웹 개발 코드가 열린 노트북",
  },
];

type ViewMode = "grid" | "list";

type PostListBrowserProps = {
  posts: PostSummary[];
};

function getCategory(post: PostSummary) {
  const matchedTag = post.tags.find((tag) => categoryByTag[tag]);

  return matchedTag ? categoryByTag[matchedTag] : "CS";
}

function getThumbnail(index: number) {
  return thumbnails[index % thumbnails.length];
}

function PostThumbnail({
  index,
  title,
  variant,
}: {
  index: number;
  title: string;
  variant: ViewMode;
}) {
  const thumbnail = getThumbnail(index);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md border border-border bg-secondary",
        variant === "grid" ? "aspect-[16/11] w-full" : "aspect-[16/10] w-full md:w-64",
      )}
    >
      <Image
        src={thumbnail.src}
        alt={`${title} 썸네일 - ${thumbnail.alt}`}
        fill
        sizes={
          variant === "grid"
            ? "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            : "(min-width: 768px) 16rem, 100vw"
        }
        className="object-cover"
      />
    </div>
  );
}

function PostSummaryCard({
  index,
  post,
  viewMode,
}: {
  index: number;
  post: PostSummary;
  viewMode: ViewMode;
}) {
  const href = `/blog/${post.slug}` as Route;
  const category = getCategory(post);

  return (
    <Link
      href={href}
      className="group block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
    >
      <article
        className={cn(
          "h-full transition-transform duration-200 group-hover:-translate-y-1",
          viewMode === "list"
            ? "grid gap-5 border-t border-border py-8 md:grid-cols-[16rem_minmax(0,1fr)]"
            : "flex flex-col gap-4",
        )}
      >
        <PostThumbnail index={index} title={post.title} variant={viewMode} />
        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{category}</span>
            <span>{formatPostDate(post.date)}</span>
            <span>조회수 0회</span>
          </div>
          <h2
            className={cn(
              "font-semibold leading-snug text-foreground",
              viewMode === "list" ? "text-2xl" : "text-xl",
            )}
          >
            {post.title}
          </h2>
          {viewMode === "list" ? (
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">
              {post.description}
            </p>
          ) : null}
        </div>
      </article>
    </Link>
  );
}

export function PostListBrowser({ posts }: PostListBrowserProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  return (
    <section className="flex flex-col gap-14" aria-labelledby="home-post-list-title">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-5">
            <h1 id="home-post-list-title" className="text-5xl font-semibold leading-none text-foreground md:text-6xl">
              전체
            </h1>
            <nav aria-label="게시글 카테고리" className="flex flex-wrap gap-x-7 gap-y-3">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={cn(
                    "text-lg font-medium text-muted-foreground transition-colors hover:text-foreground",
                    category === "전체" && "text-foreground",
                  )}
                  aria-pressed={category === "전체"}
                >
                  {category}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button type="button" className="inline-flex h-10 items-center gap-2 text-sm font-semibold text-foreground">
              필터
              <Filter className="size-4" aria-hidden="true" />
            </button>
            <button type="button" className="inline-flex h-10 items-center gap-2 text-sm font-semibold text-foreground">
              정렬
              <ArrowUpDown className="size-4" aria-hidden="true" />
            </button>
            <div className="inline-flex items-center gap-2" aria-label="게시글 보기 방식">
              <button
                type="button"
                className={cn(
                  "inline-flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground",
                  viewMode === "grid" && "border border-border text-foreground",
                )}
                aria-label="그리드 보기"
                aria-pressed={viewMode === "grid"}
                onClick={() => setViewMode("grid")}
              >
                <Grid2X2 className="size-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                className={cn(
                  "inline-flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground",
                  viewMode === "list" && "border border-border text-foreground",
                )}
                aria-label="리스트 보기"
                aria-pressed={viewMode === "list"}
                onClick={() => setViewMode("list")}
              >
                <List className="size-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={cn(
          viewMode === "grid"
            ? "grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3"
            : "grid",
        )}
      >
        {posts.map((post, index) => (
          <PostSummaryCard
            key={post.slug}
            index={index}
            post={post}
            viewMode={viewMode}
          />
        ))}
      </div>
    </section>
  );
}
