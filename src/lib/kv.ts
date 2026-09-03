import { redis as kv } from "@/lib/redis";
import { randomUUID, randomBytes } from "crypto";
import { DownloadToken, Order } from "@/types";

const PENDING_ORDERS_KEY = "orders:pending";
const ORDER_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 3; // download links expire after 3 days

export async function createOrder(input: {
  itemId: string;
  buyerEmail: string;
  note: string;
}): Promise<Order> {
  const order: Order = {
    id: randomUUID(),
    itemId: input.itemId,
    buyerEmail: input.buyerEmail,
    note: input.note,
    status: "pending",
    createdAt: Date.now(),
  };
  await kv.set(`order:${order.id}`, order, { ex: ORDER_TTL_SECONDS });
  await kv.lpush(PENDING_ORDERS_KEY, order.id);
  return order;
}

export async function getOrder(id: string): Promise<Order | null> {
  return (await kv.get<Order>(`order:${id}`)) ?? null;
}

export async function listPendingOrders(): Promise<Order[]> {
  const ids = await kv.lrange<string>(PENDING_ORDERS_KEY, 0, -1);
  if (!ids.length) return [];
  const orders = await Promise.all(ids.map((id) => getOrder(id)));
  return orders.filter((o): o is Order => o !== null && o.status === "pending");
}

async function removeFromPendingList(id: string) {
  await kv.lrem(PENDING_ORDERS_KEY, 0, id);
}

export async function rejectOrder(id: string): Promise<void> {
  const order = await getOrder(id);
  if (!order) return;
  order.status = "rejected";
  await kv.set(`order:${id}`, order, { ex: ORDER_TTL_SECONDS });
  await removeFromPendingList(id);
}

export async function approveOrderAndIssueToken(
  id: string,
  driveFileId: string,
  fileTitle: string
): Promise<string> {
  const order = await getOrder(id);
  if (!order) throw new Error("Order not found");

  order.status = "approved";
  await kv.set(`order:${id}`, order, { ex: ORDER_TTL_SECONDS });
  await removeFromPendingList(id);

  const token = randomBytes(24).toString("base64url");
  const record: DownloadToken = {
    orderId: id,
    driveFileId,
    fileTitle,
    expiresAt: Date.now() + TOKEN_TTL_SECONDS * 1000,
    used: false,
  };
  await kv.set(`token:${token}`, record, { ex: TOKEN_TTL_SECONDS });
  return token;
}

export async function getDownloadToken(token: string): Promise<DownloadToken | null> {
  return (await kv.get<DownloadToken>(`token:${token}`)) ?? null;
}

export async function markTokenUsed(token: string, record: DownloadToken): Promise<void> {
  const remainingMs = record.expiresAt - Date.now();
  const ttl = Math.max(1, Math.floor(remainingMs / 1000));
  await kv.set(`token:${token}`, { ...record, used: true }, { ex: ttl });
}

export async function markOrderFulfilled(orderId: string): Promise<void> {
  const order = await getOrder(orderId);
  if (!order) return;
  order.status = "fulfilled";
  await kv.set(`order:${orderId}`, order, { ex: ORDER_TTL_SECONDS });
}
