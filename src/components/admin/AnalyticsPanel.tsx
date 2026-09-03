"use client";

import { useEffect, useState } from "react";
import type { AnalyticsSummary } from "@/types";
import { links, slugifyLinkLabel } from "@/lib/links";

const LINK_LABELS: Record<string, string> = Object.fromEntries(
  links.map((l) => [slugifyLinkLabel(l.label), l.label])
);

export default function AnalyticsPanel() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then(async (res) => {
        if (!res.ok) {
          setError(
            "Couldn't load analytics — check that Redis (Upstash) is connected in Vercel."
          );
          return;
        }
        setError("");
        setData(await res.json());
      })
      .catch(() => setError("Couldn't load analytics."));
  }, []);

  if (error) {
    return (
      <div className="mb-8 rounded-xl border border-white/10 bg-panel p-5">
        <h2 className="font-display text-xl text-white">Web Analytics</h2>
        <p className="mt-3 rounded-lg border border-accent/30 bg-panel2 px-4 py-3 text-sm text-accent">
          {error}
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mb-8 rounded-xl border border-white/10 bg-panel p-5">
        <h2 className="font-display text-xl text-white">Web Analytics</h2>
        <p className="mt-2 text-sm text-muted">Loading…</p>
      </div>
    );
  }

  const maxDaily = Math.max(1, ...data.last7Days.map((d) => d.count));
  const maxClicks = Math.max(1, ...data.linkClicks.map((c) => c.count));

  return (
    <div className="mb-8 rounded-xl border border-white/10 bg-panel p-5">
      <h2 className="font-display text-xl text-white">Web Analytics</h2>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-display text-3xl text-white">{data.totalPageviews}</span>
        <span className="text-sm text-muted">total page views</span>
      </div>

      <div className="mt-5">
        <p className="text-xs uppercase tracking-wide text-muted">Last 7 days</p>
        <div className="mt-2 space-y-1.5">
          {data.last7Days.map((d) => (
            <div key={d.date} className="flex items-center gap-3">
              <span className="w-16 shrink-0 text-xs text-muted">
                {new Date(`${d.date}T00:00:00`).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-panel2">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${(d.count / maxDaily) * 100}%` }}
                />
              </div>
              <span className="w-6 shrink-0 text-right text-xs text-white">{d.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs uppercase tracking-wide text-muted">Link clicks</p>
        {data.linkClicks.length === 0 ? (
          <p className="mt-2 text-sm text-muted">No clicks recorded yet.</p>
        ) : (
          <div className="mt-2 space-y-1.5">
            {data.linkClicks.map((c) => (
              <div key={c.linkId} className="flex items-center gap-3">
                <span
                  className="w-32 shrink-0 truncate text-xs text-muted"
                  title={LINK_LABELS[c.linkId] ?? c.linkId}
                >
                  {LINK_LABELS[c.linkId] ?? c.linkId}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-panel2">
                  <div
                    className="h-full rounded-full bg-accent2"
                    style={{ width: `${(c.count / maxClicks) * 100}%` }}
                  />
                </div>
                <span className="w-6 shrink-0 text-right text-xs text-white">{c.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
