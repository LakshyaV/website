import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/layout/Reveal";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { about } from "@/content/copy";

export function About() {
  return (
    <section id="about" className="scroll-mt-20 py-20 sm:py-28">
      <Container>
        <SectionHeading number={about.number} label={about.label} />
        <div className="mt-12 grid gap-y-8 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-7 lg:col-start-4">
            {about.paragraphs.map((paragraph, i) => (
              <Reveal key={i} delay={i * 80}>
                <p
                  className={`max-w-[62ch] leading-relaxed ${
                    i === 0
                      ? "text-base text-fg sm:text-lg"
                      : "mt-6 text-[0.9375rem] text-muted sm:text-base"
                  }`}
                >
                  {paragraph}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
