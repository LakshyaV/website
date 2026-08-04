import type { ReactNode } from "react";

/** Consistent max content width and gutters across the whole site. */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[76rem] px-6 sm:px-8 lg:px-12 ${className}`}>
      {children}
    </div>
  );
}
