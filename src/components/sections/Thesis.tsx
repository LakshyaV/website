import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/layout/Reveal";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { thesis } from "@/content/copy";

export function Thesis() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <SectionHeading number={thesis.number} label={thesis.label} />
        <div className="mt-12 grid gap-y-8 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-7 lg:col-start-4">
            {thesis.paragraphs.map((paragraph, i) => (
              <Reveal key={i} delay={i * 90}>
                <p
                  className={`max-w-[62ch] leading-relaxed ${
                    i === 0
                      ? "text-lg text-fg sm:text-xl sm:leading-[1.6]"
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
