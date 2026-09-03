export default function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-16 pt-20 text-center">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          background:
            "radial-gradient(circle at 50% 20%, rgba(255,61,129,0.25), transparent 60%), radial-gradient(circle at 80% 80%, rgba(255,184,107,0.15), transparent 55%)",
        }}
      />
      <div className="mx-auto h-32 w-32 overflow-hidden rounded-full border-2 border-accent/60 shadow-glow sm:h-40 sm:w-40">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/gallery/placeholder-avatar.jpg"
          alt="Goddess Pixie"
          className="h-full w-full object-cover"
          style={{ objectPosition: "68% 42%" }}
        />
      </div>
      <h1 className="mt-6 font-display text-4xl font-bold tracking-tight sm:text-5xl">
        Goddess Pixie
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm text-muted sm:text-base">
        Model &amp; performer. Exclusives, customs, and everywhere else you can find me — all in
        one place.
      </p>
    </section>
  );
}
