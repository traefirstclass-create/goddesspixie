import { redis as kv } from "@/lib/redis";
import { randomUUID, randomBytes } from "crypto";
import { AnalyticsSummary, DownloadToken, Order, PaymentMethod } from "@/types";

const PENDING_ORDERS_KEY = "orders:pending";
const ORDER_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 3; // download links expire after 3 days

const ANALYTICS_TOTAL_PAGEVIEWS_KEY = "analytics:pageviews:total";
const ANALYTICS_DAILY_PREFIX = "analytics:pageviews:daily:";
const ANALYTICS_CLICK_PREFIX = "analytics:clicks:";
const ANALYTICS_CLICK_SET_KEY = "analytics:clicks:known";
const ANALYTICS_DAILY_TTL_SECONDS = 60 * 60 * 24 * 95; // ~95 days of daily history

export async function createOrder(input: {
  itemId: string;
  buyerEmail: string;
  note: string;
  paymentMethod: PaymentMethod;
}): Promise<Order> {
  const order: Order = {
    id: randomUUID(),
    itemId: input.itemId,
    buyerEmail: input.buyerEmail,
    note: input.note,
    paymentMethod: input.paymentMethod,
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

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function recordPageview(): Promise<void> {
  const dailyKey = `${ANALYTICS_DAILY_PREFIX}${todayKey()}`;
  await Promise.all([kv.incr(ANALYTICS_TOTAL_PAGEVIEWS_KEY), kv.incr(dailyKey)]);
  await kv.expire(dailyKey, ANALYTICS_DAILY_TTL_SECONDS);
}

export async function recordLinkClick(linkId: string): Promise<void> {
  await Promise.all([
    kv.incr(`${ANALYTICS_CLICK_PREFIX}${linkId}`),
    kv.sadd(ANALYTICS_CLICK_SET_KEY, linkId),
  ]);
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const totalPageviews = (await kv.get<number>(ANALYTICS_TOTAL_PAGEVIEWS_KEY)) ?? 0;

  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  const dailyCounts = await Promise.all(
    days.map((day) => kv.get<number>(`${ANALYTICS_DAILY_PREFIX}${day}`))
  );
  const last7Days = days.map((date, i) => ({ date, count: dailyCounts[i] ?? 0 }));

  const linkIds = (await kv.smembers(ANALYTICS_CLICK_SET_KEY)) as string[];
  const clickCounts = await Promise.all(
    linkIds.map((id) => kv.get<number>(`${ANALYTICS_CLICK_PREFIX}${id}`))
  );
  const linkClicks = linkIds
    .map((linkId, i) => ({ linkId, count: clickCounts[i] ?? 0 }))
    .sort((a, b) => b.count - a.count);

  return { totalPageviews, last7Days, linkClicks };
}
