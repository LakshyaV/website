import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/layout/Reveal";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { OriginDiagram } from "@/components/diagrams/OriginDiagram";
import { SurgicalDiagram } from "@/components/diagrams/SurgicalDiagram";
import { WheelchairDiagram } from "@/components/diagrams/WheelchairDiagram";
import { DiagramPlate, Facets, ProjectTitle } from "./project-parts";
import { origin, surgical, wheelchair } from "@/content/projects";

/**
 * Selected work. Each project deliberately uses a different composition:
 * Origin is full-width and largest, surgical intelligence is split into a
 * text/diagram column pair, and the wheelchair is a compact horizontal band.
 */
export function SelectedWork() {
  return (
    <section id="work" className="scroll-mt-20 py-20 sm:py-28">
      <Container>
        <SectionHeading number="02" label="Selected work" />
      </Container>

      {/* ------------------------------- 01 Origin ------------------------------ */}
      <Container className="mt-16 sm:mt-20">
        <div className="grid gap-y-10 lg:grid-cols-12 lg:gap-x-10 [&>*]:min-w-0">
          <div className="lg:col-span-8">
            <ProjectTitle
              number={origin.number}
              status={origin.status}
              title={origin.title}
              oneLiner={origin.oneLiner}
              scale="xl"
            />
          </div>
        </div>

        <DiagramPlate caption={origin.diagramCaption} className="mt-14">
          <OriginDiagram />
        </DiagramPlate>

        <div className="mt-14 grid gap-y-10 lg:grid-cols-12 lg:gap-x-10 [&>*]:min-w-0">
          <div className="lg:col-span-7">
            {origin.paragraphs.map((paragraph, i) => (
              <Reveal key={i} delay={i * 60}>
                <p
                  className={`max-w-[62ch] leading-relaxed ${
                    i === 0 ? "text-base text-fg sm:text-lg" : "mt-5 text-[0.9375rem] text-muted"
                  }`}
                >
                  {paragraph}
                </p>
              </Reveal>
            ))}
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal>
              <Facets items={origin.facets} layout="stack" />
            </Reveal>
          </div>
        </div>
      </Container>

      {/* ------------------------ 02 Surgical intelligence ---------------------- */}
      <Container className="mt-28 sm:mt-36">
        <div className="border-t border-line pt-16 sm:pt-20">
          <div className="grid gap-y-12 lg:grid-cols-12 lg:gap-x-10 [&>*]:min-w-0">
            <div className="lg:col-span-5">
              <ProjectTitle
                number={surgical.number}
                status={surgical.status}
                title={surgical.title}
                oneLiner={surgical.oneLiner}
                scale="lg"
              />
              <div className="mt-10">
                {surgical.paragraphs.map((paragraph, i) => (
                  <Reveal key={i} delay={i * 60}>
                    <p className="mt-5 max-w-[54ch] text-[0.9375rem] leading-relaxed text-muted">
                      {paragraph}
                    </p>
                  </Reveal>
                ))}
              </div>
              <Reveal className="mt-10">
                <Facets items={surgical.facets} layout="stack" />
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <DiagramPlate caption={surgical.diagramCaption}>
                <SurgicalDiagram />
              </DiagramPlate>
            </div>
          </div>
        </div>
      </Container>

      {/* --------------------- 03 Mind-controlled wheelchair -------------------- */}
      <Container className="mt-28 sm:mt-36">
        <div className="border-t border-line pt-16 sm:pt-20">
          <div className="grid gap-y-10 lg:grid-cols-12 lg:gap-x-10 [&>*]:min-w-0">
            <div className="lg:col-span-7">
              <ProjectTitle
                number={wheelchair.number}
                status={wheelchair.status}
                title={wheelchair.title}
                oneLiner={wheelchair.oneLiner}
                scale="md"
              />
            </div>
            <div className="lg:col-span-5 lg:pt-16">
              {wheelchair.paragraphs.map((paragraph, i) => (
                <Reveal key={i} delay={i * 60}>
                  <p
                    className={`max-w-[54ch] text-[0.9375rem] leading-relaxed ${
                      i === 0 ? "text-muted" : "mt-5 text-muted"
                    }`}
                  >
                    {paragraph}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>

          <DiagramPlate caption={wheelchair.diagramCaption} className="mt-14">
            <WheelchairDiagram />
          </DiagramPlate>

          <Reveal className="mt-12">
            <Facets items={wheelchair.facets} layout="row" />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
