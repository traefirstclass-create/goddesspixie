import { NextRequest, NextResponse } from "next/server";
import { getDownloadToken, markOrderFulfilled, markTokenUsed } from "@/lib/kv";
import { fetchDriveFileStream } from "@/lib/drive";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const record = await getDownloadToken(token);

  if (!record) {
    return NextResponse.json({ error: "This link is invalid or has expired." }, { status: 404 });
  }
  if (record.used) {
    return NextResponse.json({ error: "This link has already been used." }, { status: 410 });
  }
  if (Date.now() > record.expiresAt) {
    return NextResponse.json({ error: "This link has expired." }, { status: 410 });
  }

  await markTokenUsed(token, record);
  await markOrderFulfilled(record.orderId);

  const file = await fetchDriveFileStream(record.driveFileId);

  return new NextResponse(file.body, {
    headers: {
      "Content-Type": file.contentType,
      ...(file.contentLength ? { "Content-Length": file.contentLength } : {}),
      "Content-Disposition": `attachment; filename="${encodeURIComponent(file.fileName)}"`,
      "Cache-Control": "no-store",
    },
  });
}
