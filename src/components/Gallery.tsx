const placeholders = Array.from({ length: 6 }, (_, i) => `/images/gallery/placeholder-${(i % 3) + 1}.svg`);

export default function Gallery() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-10">
      <h2 className="font-display text-2xl text-white">Gallery</h2>
      <p className="mt-1 text-sm text-muted">
        A preview — placeholder images for now. Swap in real approved photos in{" "}
        <code className="rounded bg-panel2 px-1.5 py-0.5 text-xs">public/images/gallery</code>.
      </p>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {placeholders.map((src, i) => (
          <div
            key={i}
            className="aspect-[3/4] overflow-hidden rounded-xl border border-white/10 bg-panel"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}
