"use client";

/**
 * Theme toggle.
 *
 * Deliberately stateless: the root `data-theme` attribute is the single source
 * of truth (set before paint by the inline script in the root layout), and the
 * indicator is styled from that attribute in CSS. No React state means no
 * hydration mismatch and no flash.
 */
export function ThemeToggle() {
  const toggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const root = document.documentElement;
    const next = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = next;
    // Keep the label in step with the DOM, which is the source of truth here.
    // Without this a screen-reader user has no way to tell which theme is on.
    event.currentTarget.setAttribute("aria-label", `Switch to ${next === "light" ? "dark" : "light"} theme`);
    try {
      window.localStorage.setItem("theme", next);
    } catch {
      // Storage unavailable (private mode); the toggle still works this session.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle color theme"
      className="grid h-7 w-7 place-items-center border border-line text-muted transition-colors duration-300 hover:border-line-strong hover:text-fg"
    >
      <span aria-hidden className="theme-dot block h-2.5 w-2.5 rounded-full border border-current" />
    </button>
  );
}
