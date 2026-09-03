import { NextRequest, NextResponse } from "next/server";
import { recordLinkClick, recordPageview } from "@/lib/kv";

const LINK_ID_RE = /^[a-z0-9-]{1,64}$/;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const type = body?.type;

  try {
    if (type === "pageview") {
      await recordPageview();
    } else if (type === "click" && typeof body?.linkId === "string" && LINK_ID_RE.test(body.linkId)) {
      await recordLinkClick(body.linkId);
    } else {
      return NextResponse.json({ error: "Invalid tracking event." }, { status: 400 });
    }
  } catch (err) {
    // Tracking is best-effort — never let a Redis hiccup show up as a
    // visible error for site visitors.
    console.error("tracking event failed", err);
  }

  return NextResponse.json({ ok: true });
}
