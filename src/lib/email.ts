import { Resend } from "resend";
import type { PaymentMethod } from "@/types";

const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  cashapp: "Cash App",
  venmo: "Venmo",
};

function client(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

function fromAddress(): string {
  return process.env.RESEND_FROM_EMAIL || "Goddess Pixie <noreply@example.com>";
}

function ownerAddress(): string {
  return process.env.OWNER_NOTIFY_EMAIL || "goddesspixie7@outlook.com";
}

export async function sendContactFormEmail(input: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  await client().emails.send({
    from: fromAddress(),
    to: ownerAddress(),
    replyTo: input.email,
    subject: `New contact form message from ${input.name}`,
    text: `From: ${input.name} <${input.email}>\n\n${input.message}`,
  });
}

export async function sendNewOrderNotification(input: {
  orderId: string;
  itemTitle: string;
  priceUsd: number;
  buyerEmail: string;
  note: string;
  paymentMethod: PaymentMethod;
}): Promise<void> {
  const adminUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/admin`;
  const methodLabel = PAYMENT_METHOD_LABEL[input.paymentMethod];
  await client().emails.send({
    from: fromAddress(),
    to: ownerAddress(),
    subject: `New PPV order (${methodLabel}): ${input.itemTitle} ($${input.priceUsd})`,
    text: [
      `Item: ${input.itemTitle}`,
      `Price: $${input.priceUsd}`,
      `Payment method: ${methodLabel}`,
      `Buyer email: ${input.buyerEmail}`,
      `Buyer note: ${input.note || "(none)"}`,
      `Order ID: ${input.orderId}`,
      "",
      `Check ${methodLabel} for a matching payment, then approve it here: ${adminUrl}`,
    ].join("\n"),
  });
}

export async function sendDownloadLinkEmail(input: {
  buyerEmail: string;
  itemTitle: string;
  downloadUrl: string;
}): Promise<void> {
  await client().emails.send({
    from: fromAddress(),
    to: input.buyerEmail,
    subject: `Your download is ready: ${input.itemTitle}`,
    text: [
      `Thanks for your purchase of "${input.itemTitle}".`,
      "",
      `Download link (expires in 3 days, works once): ${input.downloadUrl}`,
    ].join("\n"),
  });
}
