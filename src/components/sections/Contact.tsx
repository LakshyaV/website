import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/layout/Reveal";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { ContactForm } from "@/components/interactive/ContactForm";
import { contact } from "@/content/copy";
import { site } from "@/content/site";

/** Only social entries with a real URL are rendered. */
const links = [
  { label: "GitHub", href: site.social.github },
  { label: "LinkedIn", href: site.social.linkedin },
  { label: "X", href: site.social.x },
].filter((link): link is { label: string; href: string } => Boolean(link.href));

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-20 py-20 sm:py-28">
      <Container>
        <SectionHeading number={contact.number} label={contact.label} />

        <div className="mt-12 grid gap-y-12 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="max-w-[46ch] text-lg leading-snug text-muted sm:text-xl">
                {contact.lead}
              </p>
            </Reveal>
            <Reveal delay={90}>
              <ContactForm />
            </Reveal>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal delay={140}>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group inline-flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted transition-colors duration-300 hover:text-fg"
                    >
                      {link.label}
                      <span
                        aria-hidden
                        className="transition-transform duration-300 group-hover:translate-x-0.5"
                      >
                        ↗
                      </span>
                    </a>
                  </li>
                ))}
                {site.resume ? (
                  <li>
                    <a
                      href={site.resume}
                      className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted transition-colors duration-300 hover:text-fg"
                    >
                      Resume
                    </a>
                  </li>
                ) : null}
              </ul>
            </Reveal>
          </div>
        </div>

        <Reveal delay={200}>
          <p className="mt-24 border-t border-line pt-6 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-faint">
            {contact.closing}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
