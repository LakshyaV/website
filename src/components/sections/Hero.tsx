import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/layout/Reveal";
import { DecodingRole } from "@/components/interactive/DecodingRole";
import { hero } from "@/content/copy";

export function Hero() {
  return (
    <section className="relative pt-16 pb-24 sm:pt-24 sm:pb-32 lg:pt-32 lg:pb-40">
      <Container>
        <div className="grid gap-y-12 lg:grid-cols-12 lg:gap-x-10 [&>*]:min-w-0">
          <div className="lg:col-span-9">
            <Reveal>
              <h1 className="font-mono text-[0.6875rem] font-normal uppercase tracking-[0.22em] text-faint">
                {hero.name}
              </h1>
            </Reveal>

            <Reveal delay={80}>
              <p className="mt-8 max-w-[20ch] text-[2.5rem] leading-[1.04] tracking-[-0.03em] sm:text-[3.75rem] lg:text-[5rem] xl:text-[5.5rem]">
                {hero.statement.lead}{" "}
                <span className="font-cursive italic tracking-[-0.01em]">
                  {hero.statement.cursive}
                </span>{" "}
                <DecodingRole roles={hero.statement.roles} />.
              </p>
            </Reveal>

            <Reveal delay={180}>
              <p className="mt-10 max-w-[54ch] text-[0.9375rem] leading-relaxed text-muted sm:text-base">
                {hero.support}
              </p>
            </Reveal>

            <Reveal delay={260}>
              <Link
                href={hero.enter.href}
                className="group mt-12 inline-flex items-center gap-3 border-b border-line pb-2 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-fg transition-colors duration-300 hover:border-fg"
              >
                {hero.enter.label}
                <span
                  aria-hidden
                  className="inline-block transition-transform duration-300 group-hover:translate-y-0.5"
                >
                  ↓
                </span>
              </Link>
            </Reveal>
          </div>

          <div className="lg:col-span-3 lg:pt-2">
            <Reveal delay={320}>
              <ul className="space-y-3 border-t border-line pt-5 font-mono text-[0.6875rem] uppercase leading-relaxed tracking-[0.12em] text-faint lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
                {hero.meta.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
