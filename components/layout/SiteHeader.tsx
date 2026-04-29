import Link from "next/link";
import { siteConfig } from "@/config/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 h-16 bg-background text-foreground">
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between gap-4 px-6 md:px-10">
        <Link href="/" className="text-md font-bold text-foreground">
          {siteConfig.name}
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium text-foreground">
          <Link
            href="/"
            className="transition-colors hover:text-muted-foreground"
          >
            홈
          </Link>
        </nav>
      </div>
    </header>
  );
}
