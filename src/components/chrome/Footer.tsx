import { Container } from "@/components/layout/Container";
import { site } from "@/content/site";

export function Footer() {
  // Evaluated at build time; static export keeps it stable across the session.
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line py-10">
      <Container>
        <div className="flex flex-col gap-3 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-faint sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {year} {site.name}
          </span>
          <span>{site.location}</span>
        </div>
      </Container>
    </footer>
  );
}
