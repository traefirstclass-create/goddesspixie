const images = Array.from({ length: 6 }, (_, i) => `/images/gallery/gallery-${i + 1}.jpg`);

export default function Gallery() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-10">
      <h2 className="font-display text-2xl text-white">Gallery</h2>
      <p className="mt-1 text-sm text-muted">A preview — more exclusives below.</p>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((src, i) => (
          <div
            key={src}
            className="aspect-[3/4] overflow-hidden rounded-xl border border-white/10 bg-panel"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`Goddess Pixie gallery photo ${i + 1}`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
