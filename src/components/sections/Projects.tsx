"use client";

import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/layout/Reveal";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { Jaw2ControlDiagram } from "@/components/diagrams/Jaw2ControlDiagram";
import { WheelchairDiagram } from "@/components/diagrams/WheelchairDiagram";
import { ThreadRail } from "@/components/interactive/ThreadRail";
import { DiagramPlate, Facets, ProjectTitle } from "./project-parts";
import { EntryRow } from "./EntryRow";
import {
  jaw2control,
  projectCapabilities,
  projectIndex,
  wheelchair,
} from "@/content/projects";

/** Projects — things built outside of any role. */
export function Projects() {
  return (
    <section id="projects" className="scroll-mt-20 py-20 sm:py-28">
      <Container>
        <SectionHeading number="03" label="Projects" />
      </Container>

      {/* ----------------------------- 01 jaw2control --------------------------- */}
      <Container className="mt-16 sm:mt-20">
        <div className="grid gap-y-10 lg:grid-cols-12 lg:gap-x-10 [&>*]:min-w-0">
          <div className="lg:col-span-8">
            <ProjectTitle
              number={jaw2control.number}
              status={jaw2control.status}
              title={jaw2control.title}
              oneLiner={jaw2control.oneLiner}
              scale="lg"
            />
          </div>
          <div className="lg:col-span-4 lg:pt-14">
            <Reveal>
              <Facets items={jaw2control.facets} layout="stack" />
            </Reveal>
          </div>
        </div>

        <DiagramPlate caption={jaw2control.diagramCaption} className="mt-14">
          <Jaw2ControlDiagram />
        </DiagramPlate>

        <div className="mt-12 grid gap-y-6 lg:grid-cols-12 lg:gap-x-10 [&>*]:min-w-0">
          <div className="lg:col-span-7 lg:col-start-4">
            {jaw2control.paragraphs.map((paragraph, i) => (
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
        </div>
      </Container>

      {/* --------------------- 02 Mind-controlled wheelchair -------------------- */}
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
                  <p className="mt-5 max-w-[54ch] text-[0.9375rem] leading-relaxed text-muted first:mt-0">
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

      {/* -------------------------------- the rest ------------------------------ */}
      <Container className="mt-28 sm:mt-36">
        <div className="border-t border-line pt-16 sm:pt-20">
          <Reveal>
            <h3 className="text-[1.5rem] tracking-[-0.02em] sm:text-[1.875rem]">Also built</h3>
            <p className="mt-3 max-w-[52ch] text-[0.9375rem] leading-relaxed text-muted">
              Agents, editors, and one extension that probably shouldn&rsquo;t exist.
            </p>
          </Reveal>

          <ThreadRail
            capabilities={projectCapabilities}
            entries={projectIndex}
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
