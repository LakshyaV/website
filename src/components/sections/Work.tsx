"use client";

import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/layout/Reveal";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { OriginDiagram } from "@/components/diagrams/OriginDiagram";
import { SurgicalDiagram } from "@/components/diagrams/SurgicalDiagram";
import { ThreadRail } from "@/components/interactive/ThreadRail";
import { DiagramPlate, Facets, ProjectTitle } from "./project-parts";
import { EntryRow } from "./EntryRow";
import { origin, surgical, workCapabilities, workIndex } from "@/content/work";

/**
 * Work — what I've been paid or appointed to do. Origin and the Harvard
 * research get full treatment; earlier roles run as a dense index.
 */
export function Work() {
  return (
    <section id="work" className="scroll-mt-20 py-20 sm:py-28">
      <Container>
        <SectionHeading number="02" label="Work" />
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

      {/* ------------------------------ earlier roles ---------------------------- */}
      <Container className="mt-28 sm:mt-36">
        <div className="border-t border-line pt-16 sm:pt-20">
          <Reveal>
            <h3 className="text-[1.5rem] tracking-[-0.02em] sm:text-[1.875rem]">Before that</h3>
            <p className="mt-3 max-w-[52ch] text-[0.9375rem] leading-relaxed text-muted">
              Three roles, taken at fifteen, sixteen, and seventeen. Different industries,
              one recurring job: make a model survive contact with a real system.
            </p>
          </Reveal>

          <ThreadRail
            capabilities={workCapabilities}
            entries={workIndex}
            renderEntry={(entry, i, { dimmed, filtering }) => (
              <EntryRow entry={entry} index={i} dimmed={dimmed} filtering={filtering} />
            )}
          />
          <div className="border-t border-line" />
        </div>
      </Container>
    </section>
  );
}
