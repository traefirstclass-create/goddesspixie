"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "gp_age_verified";

export default function AgeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [verified, setVerified] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      setVerified(window.localStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      setVerified(false);
    }
  }, []);

  function accept() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore storage failures, gate just won't persist
    }
    setVerified(true);
  }

  // The admin dashboard is an internal tool, not adult content — never gate it.
  if (pathname?.startsWith("/admin")) return <>{children}</>;

  if (verified === null) return null;

  if (!verified) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-6 backdrop-blur-sm">
        <div className="max-w-sm rounded-2xl border border-white/10 bg-panel p-8 text-center shadow-glow">
          <h1 className="font-display text-2xl text-white">18+ Only</h1>
          <p className="mt-3 text-sm text-muted">
            This site contains adult content and is intended for visitors 18 years of age or
            older. By entering, you confirm you are of legal age in your jurisdiction.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={accept}
              className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
            >
              I am 18 or older — Enter
            </button>
            <a
              href="https://www.google.com"
              className="rounded-full border border-white/15 px-6 py-2.5 text-sm text-muted transition hover:border-white/30 hover:text-white"
            >
              Leave
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
