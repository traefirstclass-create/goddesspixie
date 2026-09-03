import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/kv";
import { getCatalogItem } from "@/lib/catalog";
import { sendNewOrderNotification } from "@/lib/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const itemId = typeof body?.itemId === "string" ? body.itemId : "";
  const buyerEmail = typeof body?.buyerEmail === "string" ? body.buyerEmail.trim() : "";
  const note = typeof body?.note === "string" ? body.note.trim().slice(0, 500) : "";

  const item = getCatalogItem(itemId);
  if (!item) {
    return NextResponse.json({ error: "Unknown item." }, { status: 400 });
  }
  if (!EMAIL_RE.test(buyerEmail)) {
    return NextResponse.json({ error: "Enter a valid email to receive your download link." }, { status: 400 });
  }

  const order = await createOrder({ itemId, buyerEmail, note });

  try {
    await sendNewOrderNotification({
      orderId: order.id,
      itemTitle: item.title,
      priceUsd: item.priceUsd,
      buyerEmail,
      note,
    });
  } catch (err) {
    console.error("order notification email failed", err);
  }

  return NextResponse.json({ ok: true, orderId: order.id });
}
