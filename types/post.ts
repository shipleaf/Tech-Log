export type PostFrontmatter = {
  title: string;
  description: string;
  date: string;
  tags: string[];
  published: boolean;
};

export type PostSummary = PostFrontmatter & {
  slug: string;
  readingMinutes: number;
};

export type Post = PostSummary & {
  content: string;
};
