"use client";

import { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });
    if (res.ok) {
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } else {
      setStatus("error");
    }
  }

  return (
    <section className="mx-auto max-w-md px-6 py-10">
      <h2 className="font-display text-2xl text-white">Get in touch</h2>
      <p className="mt-1 text-sm text-muted">
        Collabs, bookings, or anything else — send a message directly.
      </p>
      <form onSubmit={submit} className="mt-5 space-y-3">
        <input
          type="text"
          required
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-panel px-4 py-2.5 text-sm text-white outline-none focus:border-accent"
        />
        <input
          type="email"
          required
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-panel px-4 py-2.5 text-sm text-white outline-none focus:border-accent"
        />
        <textarea
          required
          rows={4}
          placeholder="Your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-panel px-4 py-2.5 text-sm text-white outline-none focus:border-accent"
        />
        {status === "sent" && (
          <p className="text-sm text-accent2">Message sent — thank you!</p>
        )}
        {status === "error" && (
          <p className="text-sm text-accent">Something went wrong — try again.</p>
        )}
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full rounded-full bg-accent py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
        >
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
      </form>
    </section>
  );
}
