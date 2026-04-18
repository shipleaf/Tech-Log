"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const scrollThreshold = 12;

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function syncScrollState() {
      setIsScrolled(window.scrollY > scrollThreshold);
    }

    syncScrollState();
    window.addEventListener("scroll", syncScrollState, { passive: true });

    return () => window.removeEventListener("scroll", syncScrollState);
  }, []);

  return (
    <header
      data-scrolled={isScrolled}
      className={cn(
        "sticky top-0 z-50 border-b transition-[background-color,border-color,color] duration-300 ease-out",
        isScrolled
          ? "border-primary bg-primary text-primary-foreground"
          : "border-transparent bg-transparent text-foreground",
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-5">
        <Link
          href="/"
          className={cn(
            "font-[family-name:var(--font-newsreader)] text-2xl tracking-[-0.04em] transition-colors duration-300",
            isScrolled ? "text-primary-foreground" : "text-foreground",
          )}
        >
          {siteConfig.name}
        </Link>
        <nav
          className={cn(
            "flex items-center gap-5 text-sm transition-colors duration-300",
            isScrolled ? "text-primary-foreground" : "text-foreground",
          )}
        >
          <Link href="/" className="transition-colors duration-300">
            홈
          </Link>
          <Link href="/blog" className="transition-colors duration-300">
            블로그
          </Link>
        </nav>
      </div>
    </header>
  );
}
