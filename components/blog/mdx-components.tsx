import Link from "next/link";
import type { MDXComponents } from "mdx/types";

const linkClassName =
  "font-medium underline decoration-primary/40 underline-offset-4 transition-colors hover:text-primary";

export const mdxComponents: MDXComponents = {
  a: ({ href, ...props }) => {
    if (typeof href === "string" && href.startsWith("/")) {
      return <Link href={href} className={linkClassName} {...props} />;
    }

    return (
      <a
        className={linkClassName}
        href={href}
        rel="noreferrer"
        target="_blank"
        {...props}
      />
    );
  },
};
