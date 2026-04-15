import { PostCard } from "@/components/blog/post-card";
import { getAllPosts } from "@/runtime/blog";

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-14 md:py-18">
      <section className="space-y-5">
        <span className="eyebrow">Archive</span>
        <h1 className="font-[family-name:var(--font-newsreader)] text-5xl tracking-[-0.05em] text-foreground">
          개발 기록 아카이브
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
          MDX 포스트를 날짜순으로 보여주는 목록 페이지입니다. 새 글을
          추가하면 정적 생성 경로에도 자동으로 포함됩니다.
        </p>
      </section>
      <section className="grid gap-6">
        {posts.map((post, index) => (
          <PostCard key={post.slug} index={index} post={post} />
        ))}
      </section>
    </div>
  );
}
