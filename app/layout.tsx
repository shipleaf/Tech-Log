import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className="h-full scroll-smooth antialiased"
    >
      <body className="min-h-full">
        <div className="relative flex min-h-screen flex-col overflow-x-hidden">
          <header className="border-b border-border bg-background">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-5">
              <Link
                href="/"
                className="font-[family-name:var(--font-newsreader)] text-2xl tracking-[-0.04em] text-foreground transition-colors hover:text-primary"
              >
                {siteConfig.name}
              </Link>
              <nav className="flex items-center gap-5 text-sm text-muted-foreground">
                <Link href="/" className="transition-colors hover:text-foreground">
                  홈
                </Link>
                <Link href="/blog" className="transition-colors hover:text-foreground">
                  블로그
                </Link>
                <span className="hidden rounded-full border border-border bg-card px-3 py-1 text-xs uppercase tracking-[0.22em] text-foreground md:inline-flex">
                  Next.js · MDX · shadcn/ui
                </span>
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-border">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
              <p>{siteConfig.footer}</p>
              <p>{siteConfig.tagline}</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
