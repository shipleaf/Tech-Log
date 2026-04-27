import { PostListBrowser } from "@/components/blog/post-list-browser";
import { getAllPosts } from "@/runtime/blog";

export default async function HomePage() {
  const posts = await getAllPosts();

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col px-6 py-14 md:px-10 md:py-20">
      <PostListBrowser posts={posts} />
    </div>
  );
}
