import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { ProjectIndex } from "@/components/sections/ProjectIndex";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Thesis } from "@/components/sections/Thesis";
import { personJsonLd } from "@/lib/structured-data";

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
      />
      <Hero />
      <Thesis />
      <SelectedWork />
      <ProjectIndex />
      <About />
      <Contact />
    </>
  );
}
