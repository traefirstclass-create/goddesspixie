"use client";

import { useState } from "react";
import { catalog } from "@/lib/catalog";
import { cashAppHandle } from "@/lib/links";
import type { CatalogItem } from "@/types";

function OrderForm({ item, onDone }: { item: CatalogItem; onDone: () => void }) {
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId: item.id, buyerEmail: email, note }),
    });
    setStatus(res.ok ? "sent" : "error");
  }

  if (status === "sent") {
    return (
      <div className="mt-4 rounded-lg border border-accent/30 bg-panel2 p-4 text-sm text-white">
        Got it! Send <span className="font-semibold">${item.priceUsd}</span> to{" "}
        <span className="font-semibold">{cashAppHandle}</span> on Cash App with a note
        referencing <span className="font-semibold">{item.title}</span>. Once payment is
        confirmed, your one-time download link goes to <span className="font-semibold">{email}</span>.
        <button onClick={onDone} className="mt-3 block text-xs text-muted underline">
          Close
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-4 space-y-3">
      <p className="text-xs text-muted">
        Step 1: enter the email you want your download link sent to. Step 2: send{" "}
        <span className="font-semibold text-white">${item.priceUsd}</span> to{" "}
        <span className="font-semibold text-white">{cashAppHandle}</span> on Cash App. Delivery
        is manual — expect your link once payment is verified.
      </p>
      <input
        type="email"
        required
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-panel2 px-4 py-2 text-sm text-white outline-none focus:border-accent"
      />
      <input
        type="text"
        placeholder="Cash App name/note (optional, helps me match your payment)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-panel2 px-4 py-2 text-sm text-white outline-none focus:border-accent"
      />
      {status === "error" && (
        <p className="text-xs text-accent">Something went wrong — try again.</p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full bg-accent py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
      >
        {status === "sending" ? "Submitting…" : "I'll pay via Cash App"}
      </button>
    </form>
  );
}

export default function PPVCatalog() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="mx-auto max-w-3xl px-6 py-10">
      <h2 className="font-display text-2xl text-white">Exclusive content</h2>
      <p className="mt-1 text-sm text-muted">
        Custom &amp; exclusive clips, sold individually. Payment via Cash App, delivered as a
        private one-time download link after purchase is confirmed.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {catalog.map((item) => (
          <div key={item.id} className="rounded-xl border border-white/10 bg-panel p-4">
            <div className="aspect-video overflow-hidden rounded-lg bg-panel2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.thumbnail} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <h3 className="font-semibold text-white">{item.title}</h3>
              <span className="text-accent">${item.priceUsd}</span>
            </div>
            <p className="mt-1 text-xs text-muted">{item.description}</p>

            {openId === item.id ? (
              <OrderForm item={item} onDone={() => setOpenId(null)} />
            ) : (
              <button
                onClick={() => setOpenId(item.id)}
                className="mt-3 w-full rounded-full border border-accent/50 py-2 text-sm font-medium text-white transition hover:bg-accent/10"
              >
                Get this
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
