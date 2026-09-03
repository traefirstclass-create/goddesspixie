import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { approveOrderAndIssueToken, getOrder, listPendingOrders, rejectOrder } from "@/lib/kv";
import { getCatalogItem } from "@/lib/catalog";
import { sendDownloadLinkEmail } from "@/lib/email";

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const orders = await listPendingOrders();
    const withItems = orders.map((order) => ({
      ...order,
      item: getCatalogItem(order.itemId) ?? null,
    }));
    return NextResponse.json({ orders: withItems });
  } catch (err) {
    console.error("failed to list pending orders", err);
    return NextResponse.json(
      { error: "Could not reach the orders store. Is Redis configured?" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const orderId = typeof body?.orderId === "string" ? body.orderId : "";
  const action = body?.action === "approve" || body?.action === "reject" ? body.action : null;
  if (!orderId || !action) {
    return NextResponse.json({ error: "Missing orderId or action." }, { status: 400 });
  }

  if (action === "reject") {
    await rejectOrder(orderId);
    return NextResponse.json({ ok: true });
  }

  // action === "approve": look up the order's item to find the Drive file,
  // issue a one-time token, and email the buyer a direct link — the Drive
  // folder/URL itself is never exposed.
  const order = await getOrder(orderId);
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }
  const item = getCatalogItem(order.itemId);
  if (!item) {
    return NextResponse.json({ error: "Catalog item not found." }, { status: 404 });
  }

  const token = await approveOrderAndIssueToken(orderId, item.driveFileId, item.title);
  const downloadUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/download/${token}`;

  try {
    await sendDownloadLinkEmail({
      buyerEmail: order.buyerEmail,
      itemTitle: item.title,
      downloadUrl,
    });
  } catch (err) {
    console.error("download link email failed", err);
  }

  return NextResponse.json({ ok: true, downloadUrl });
}
