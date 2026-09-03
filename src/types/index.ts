export type CatalogItem = {
  id: string;
  title: string;
  description: string;
  priceUsd: number;
  driveFileId: string;
  thumbnail: string;
};

export type OrderStatus = "pending" | "approved" | "fulfilled" | "rejected";

export type Order = {
  id: string;
  itemId: string;
  buyerEmail: string;
  note: string;
  status: OrderStatus;
  createdAt: number;
};

export type DownloadToken = {
  orderId: string;
  driveFileId: string;
  fileTitle: string;
  expiresAt: number;
  used: boolean;
};
