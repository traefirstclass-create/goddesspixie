"use client";

import { useEffect, useState } from "react";
import type { CatalogItem, Order } from "@/types";

type OrderWithItem = Order & { item: CatalogItem | null };

const PAYMENT_METHOD_LABEL: Record<Order["paymentMethod"], string> = {
  cashapp: "Cash App",
  venmo: "Venmo",
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [orders, setOrders] = useState<OrderWithItem[] | null>(null);
  const [loadError, setLoadError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  async function loadOrders() {
    const res = await fetch("/api/admin/orders");
    if (res.status === 401) {
      setAuthed(false);
      return;
    }
    if (!res.ok) {
      setLoadError(
        "Logged in, but couldn't load orders — check that Redis (Upstash) is connected in Vercel."
      );
      return;
    }
    setLoadError("");
    const data = await res.json();
    setOrders(data.orders);
    setAuthed(true);
  }

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      setLoginError("Incorrect password.");
      return;
    }
    setPassword("");
    setAuthed(true);
    loadOrders();
  }

  async function act(orderId: string, action: "approve" | "reject") {
    setBusyId(orderId);
    await fetch("/api/admin/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, action }),
    });
    setBusyId(null);
    loadOrders();
  }

  if (!authed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ink px-6">
        <form
          onSubmit={login}
          className="w-full max-w-sm rounded-2xl border border-white/10 bg-panel p-8"
        >
          <h1 className="font-display text-xl text-white">Admin login</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="mt-4 w-full rounded-lg border border-white/10 bg-panel2 px-4 py-2 text-white outline-none focus:border-accent"
          />
          {loginError && <p className="mt-2 text-sm text-accent">{loginError}</p>}
          <button
            type="submit"
            className="mt-4 w-full rounded-full bg-accent py-2 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Log in
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ink px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-2xl text-white">Pending orders</h1>
        <p className="mt-1 text-sm text-muted">
          Approve only after you&apos;ve confirmed the matching payment in Cash App or Venmo.
        </p>

        {loadError && (
          <p className="mt-4 rounded-lg border border-accent/30 bg-panel2 px-4 py-3 text-sm text-accent">
            {loadError}
          </p>
        )}

        <div className="mt-8 space-y-4">
          {orders && orders.length === 0 && (
            <p className="text-muted">No pending orders.</p>
          )}
          {orders?.map((order) => (
            <div key={order.id} className="rounded-xl border border-white/10 bg-panel p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-white">
                  {order.item?.title ?? order.itemId} — ${order.item?.priceUsd ?? "?"}
                </h2>
                <span className="text-xs text-muted">
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="mt-2 text-sm text-white">
                Pay via{" "}
                <span className="font-semibold text-accent">
                  {PAYMENT_METHOD_LABEL[order.paymentMethod]}
                </span>
              </p>
              <p className="mt-1 text-sm text-muted">Buyer: {order.buyerEmail}</p>
              {order.note && <p className="mt-1 text-sm text-muted">Note: {order.note}</p>}
              <div className="mt-4 flex gap-3">
                <button
                  disabled={busyId === order.id}
                  onClick={() => act(order.id, "approve")}
                  className="rounded-full bg-accent px-5 py-1.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
                >
                  Approve &amp; send link
                </button>
                <button
                  disabled={busyId === order.id}
                  onClick={() => act(order.id, "reject")}
                  className="rounded-full border border-white/20 px-5 py-1.5 text-sm text-muted transition hover:border-white/40 hover:text-white disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
