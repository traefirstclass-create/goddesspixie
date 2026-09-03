import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { getAnalyticsSummary } from "@/lib/kv";

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const summary = await getAnalyticsSummary();
    return NextResponse.json(summary);
  } catch (err) {
    console.error("failed to load analytics summary", err);
    return NextResponse.json(
      { error: "Could not reach the analytics store. Is Redis configured?" },
      { status: 500 }
    );
  }
}
