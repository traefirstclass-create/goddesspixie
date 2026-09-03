import { CatalogItem } from "@/types";

// Edit this list to add real PPV items. `driveFileId` is the id from a Drive
// file's URL (drive.google.com/file/d/<THIS PART>/view) — the file must be
// shared with the service account email from .env for delivery to work.
// The Drive link itself is never shown to buyers; only an approved, one-time
// download token is.
export const catalog: CatalogItem[] = [
  {
    id: "example-clip-1",
    title: "TODO: name this item",
    description: "TODO: short teaser description.",
    priceUsd: 15,
    driveFileId: "TODO_PASTE_DRIVE_FILE_ID",
    thumbnail: "/images/gallery/placeholder-1.svg",
  },
];

export function getCatalogItem(id: string): CatalogItem | undefined {
  return catalog.find((item) => item.id === id);
}
