import Link from "next/link";

import { Container } from "@/components/layout/Container";

export default function NotFound() {
  return (
    <section className="py-32 sm:py-40">
      <Container>
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-faint">
          404
        </p>
        <h1 className="mt-6 max-w-[20ch] text-[2rem] leading-[1.08] tracking-[-0.03em] sm:text-[3rem]">
          This page doesn&rsquo;t exist.
        </h1>
        <Link
          href="/"
          className="mt-10 inline-block border-b border-line pb-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.18em] transition-colors duration-300 hover:border-fg"
        >
          Back to the work
        </Link>
      </Container>
    </section>
  );
}
