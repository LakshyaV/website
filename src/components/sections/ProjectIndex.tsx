import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/layout/Reveal";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { projectIndex } from "@/content/projects";

/** Dense typographic archive of supporting work — a table, not cards. */
export function ProjectIndex() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <SectionHeading number="03" label="Index" />

        <div className="mt-12">
          {projectIndex.map((entry, i) => (
            <Reveal key={entry.title} delay={Math.min(i * 50, 200)}>
              <article className="group grid grid-cols-1 gap-y-3 border-t border-line py-7 transition-colors duration-500 hover:border-line-strong sm:grid-cols-12 sm:gap-x-8">
                <div className="flex items-baseline gap-4 sm:col-span-4">
                  <span className="font-mono text-[0.625rem] tracking-[0.16em] text-faint">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-lg leading-snug tracking-[-0.01em] sm:text-xl">
                      {entry.title}
                    </h3>
                    <p className="mt-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-faint">
                      {entry.context}
                    </p>
                  </div>
                </div>

                <p className="text-[0.9375rem] leading-relaxed text-muted sm:col-span-5">
                  {entry.description}
                </p>

                <p className="font-mono text-[0.6875rem] uppercase leading-relaxed tracking-[0.12em] text-faint sm:col-span-3 sm:text-right">
                  {entry.outcome ?? ""}
                </p>
              </article>
            </Reveal>
          ))}
          <div className="border-t border-line" />
        </div>
      </Container>
    </section>
  );
}
