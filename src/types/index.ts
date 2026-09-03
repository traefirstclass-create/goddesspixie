export type CatalogItem = {
  id: string;
  title: string;
  description: string;
  priceUsd: number;
  driveFileId: string;
  thumbnail: string;
};

export type OrderStatus = "pending" | "approved" | "fulfilled" | "rejected";

export type PaymentMethod = "cashapp" | "venmo";

export type Order = {
  id: string;
  itemId: string;
  buyerEmail: string;
  note: string;
  paymentMethod: PaymentMethod;
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

export type AnalyticsSummary = {
  totalPageviews: number;
  last7Days: { date: string; count: number }[];
  linkClicks: { linkId: string; count: number }[];
};
