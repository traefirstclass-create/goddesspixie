import { NextRequest, NextResponse } from "next/server";
import { sendContactFormEmail } from "@/lib/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const message = typeof body?.message === "string" ? body.message.trim() : "";

  if (!name || !EMAIL_RE.test(email) || !message) {
    return NextResponse.json({ error: "Please fill in all fields with a valid email." }, { status: 400 });
  }
  if (name.length > 200 || message.length > 5000) {
    return NextResponse.json({ error: "That's too long." }, { status: 400 });
  }

  try {
    await sendContactFormEmail({ name, email, message });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("contact form send failed", err);
    return NextResponse.json({ error: "Message could not be sent. Try again later." }, { status: 500 });
  }
}
