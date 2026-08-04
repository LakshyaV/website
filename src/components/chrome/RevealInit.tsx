"use client";

import { useEffect } from "react";

/**
 * Observes every [data-reveal] element and adds `.in` once it enters the
 * viewport.
 *
 * The `js` class that arms the reveal styles is set by the pre-paint script in
 * the root layout, not here — setting it after hydration would blank content
 * that had already painted. If this component never runs (JS disabled, script
 * error), `js` is likewise absent and everything renders in its final visible
 * state. Reduced motion is handled entirely in CSS.
 */
export function RevealInit() {
  useEffect(() => {
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
