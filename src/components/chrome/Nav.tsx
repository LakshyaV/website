"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Container } from "@/components/layout/Container";
import { ScrollProgress } from "./ScrollProgress";
import { ThemeToggle } from "./ThemeToggle";
import { site } from "@/content/site";

const SECTION_IDS = ["work", "projects", "contact"] as const;

export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    // Off the home page there are no sections to track; `isActive` already
    // gates on `isHome`, so any stale value is never read.
    if (!isHome) return;

    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (sections.length === 0) return;

    // Track the full set of intersecting sections, not just the latest entries,
    // so scrolling back above the first section clears the indicator instead of
    // leaving the last-seen link highlighted.
    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // Prefer the furthest-down section in view: when a boundary sits inside
        // the band, the later section is the one being scrolled into.
        const current = [...SECTION_IDS].reverse().find((id) => visible.has(id));
        setActive(current ?? null);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [isHome]);

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return isHome && active === href.slice(2);
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-bg/85 backdrop-blur-md">
      <Container>
        <nav
          aria-label="Primary"
          className="flex h-14 items-center justify-between gap-4 sm:h-16"
        >
          <Link
            href="/"
            className="font-mono text-[0.75rem] uppercase tracking-[0.16em] text-fg transition-opacity duration-300 hover:opacity-60"
          >
            <span className="sm:hidden">{site.monogram}</span>
            <span className="hidden sm:inline">{site.name}</span>
          </Link>

          <div className="flex min-w-0 items-center gap-3 sm:gap-7">
            <ul className="flex min-w-0 items-center gap-3.5 sm:gap-6">
              {site.nav.map((item) => (
                <li key={item.href} className={item.secondary ? "hidden sm:block" : undefined}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "true" : undefined}
                    className={`font-mono text-[0.6875rem] uppercase tracking-[0.14em] transition-colors duration-300 hover:text-fg ${
                      isActive(item.href) ? "text-fg" : "text-muted"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              {site.resume ? (
                <li className="hidden sm:block">
                  <a
                    href={site.resume}
                    className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted transition-colors duration-300 hover:text-fg"
                  >
                    Resume
                  </a>
                </li>
              ) : null}
            </ul>
            <ThemeToggle />
          </div>
        </nav>
      </Container>
      <ScrollProgress />
    </header>
  );
}
