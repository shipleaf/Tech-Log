import Link from "next/link";
import { ArrowRight, BookOpenText, Files, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { PostCard } from "@/components/blog/post-card";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { getAllPosts } from "@/runtime/blog";

const highlights = [
  {
    title: "App Router 중심 구조",
    description: "루트 기존 파일을 유지한 채 app/ 기반 라우팅만 추가합니다.",
    icon: Files,
  },
  {
    title: "MDX 파일 기반 포스트",
    description: "content/blog 아래에 글을 추가하면 목록과 상세 페이지가 연결됩니다.",
    icon: BookOpenText,
  },
  {
    title: "Tailwind + shadcn/ui",
    description: "디자인 시스템과 빠른 컴포넌트 조합을 동시에 확보합니다.",
    icon: Sparkles,
  },
];

export default async function HomePage() {
  const posts = await getAllPosts();
  const featuredPosts = posts.slice(0, 2);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-14 md:py-20">
      <section className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)] lg:items-start">
        <div className="space-y-8">
          <span className="eyebrow">M1 · Blog Foundation</span>
          <div className="space-y-6">
            <h1 className="max-w-4xl font-[family-name:var(--font-newsreader)] text-5xl leading-none tracking-[-0.06em] text-foreground sm:text-6xl lg:text-7xl">
              기존 루트는 그대로 두고,
              <br />
              콘텐츠는 더 빠르게 쌓이는 기술 블로그.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              {siteConfig.description} 목록 페이지와 동적 상세 라우트, 파일 기반
              MDX 콘텐츠, Tailwind CSS와 shadcn/ui 기반 스타일 시스템까지 한
              번에 맞춰 둔 시작점입니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/blog"
              className={cn(buttonVariants({ size: "lg" }), "rounded-full px-5")}
            >
              모든 글 보기
              <ArrowRight />
            </Link>
            {featuredPosts[0] ? (
              <Link
                href={`/blog/${featuredPosts[0].slug}`}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "rounded-full bg-background px-5",
                )}
              >
                첫 샘플 글 열기
              </Link>
            ) : null}
          </div>
        </div>
        <div className="surface-card grid gap-4 p-5 sm:grid-cols-3 lg:grid-cols-1">
          {highlights.map(({ title, description, icon: Icon }, index) => (
            <div
              key={title}
              className="rounded-[calc(var(--radius)*1.1)] border border-border bg-background p-4 animate-in fade-in slide-in-from-right-6 duration-700 fill-mode-both"
              style={{ animationDelay: `${index * 140}ms` }}
            >
              <Icon className="mb-4 size-5 text-primary" />
              <h2 className="mb-2 text-base font-semibold text-foreground">{title}</h2>
              <p className="text-sm leading-6 text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="eyebrow">Latest Posts</span>
            <h2 className="font-[family-name:var(--font-newsreader)] text-4xl tracking-[-0.05em] text-foreground">
              바로 확인할 수 있는 샘플 포스트
            </h2>
          </div>
          <p className="hidden text-sm text-muted-foreground md:block">
            새 글은 <code>content/blog</code>에 추가합니다.
          </p>
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          {featuredPosts.map((post, index) => (
            <PostCard key={post.slug} index={index} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
