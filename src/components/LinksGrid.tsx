import { links } from "@/lib/links";

export default function LinksGrid() {
  return (
    <section className="mx-auto max-w-md px-6 py-10">
      <div className="flex flex-col gap-3">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-panel px-6 py-3.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-glow"
          >
            <span>{link.emoji}</span>
            <span>{link.label}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
