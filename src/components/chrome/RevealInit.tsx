"use client";

import { useEffect } from "react";

/**
 * Adds `html.js` (which arms the CSS reveal styles) and observes every
 * [data-reveal] element, adding `.in` once it enters the viewport.
 *
 * If this never runs — JS disabled, script error — the CSS gate means all
 * content renders in its final visible state.
 */
export function RevealInit() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    root.classList.add("js");

    if (reduced) {
      document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("in"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.06 },
    );

    const observeAll = () => {
      document
        .querySelectorAll("[data-reveal]:not(.in)")
        .forEach((el) => observer.observe(el));
    };

    observeAll();

    // Catch nodes added by client navigation.
    const mutations = new MutationObserver(observeAll);
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, []);

  return null;
}
