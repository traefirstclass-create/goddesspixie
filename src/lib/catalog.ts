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
  {
    id: "wwyd-little-slut",
    title: "WWYD TO FUCK A LITTLE SLUT LIKE ME?",
    description: "Homewrecker slut here to ruin your life and take everything you own!",
    priceUsd: 25,
    driveFileId: "1haGVSEZzRza6ljXslj2apptxofVA1uSz",
    thumbnail: "/images/gallery/catalog-wwyd.jpg",
  },
  {
    id: "whip-pathetic-penis",
    title: "WATCH ME WHIP THIS PATHETIC PENIS",
    description: "I love whipping your pathetic penis with my belt! CBT with dirty talk/femdom!",
    priceUsd: 20,
    driveFileId: "1sZM3yXpq4TdR_yRCQb2NKIskl9bP4KTn",
    thumbnail: "/images/gallery/catalog-whip.jpg",
  },
];

export function getCatalogItem(id: string): CatalogItem | undefined {
  return catalog.find((item) => item.id === id);
}
