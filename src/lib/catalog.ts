import { CatalogItem } from "@/types";

// Edit this list to add real PPV items. `driveFileId` is the id from a Drive
// file's URL (drive.google.com/file/d/<THIS PART>/view) — the file must be
// shared with the service account email from .env for delivery to work.
// The Drive link itself is never shown to buyers; only an approved, one-time
// download token is.
export const catalog: CatalogItem[] = [
  {
    id: "bikini-strip",
    title: "Bikini Strip",
    description: "Watch me as I strip out of my bikini top and bottoms just for you.",
    priceUsd: 15,
    driveFileId: "1LDiitmm1pNPbGUm_O_gAuUJi5HkqrSTn",
    thumbnail: "/images/gallery/catalog-bikini-strip.jpg",
  },
];

export function getCatalogItem(id: string): CatalogItem | undefined {
  return catalog.find((item) => item.id === id);
}
