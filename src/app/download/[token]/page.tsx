import { getDownloadToken } from "@/lib/kv";

export const dynamic = "force-dynamic";

export default async function DownloadPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const record = await getDownloadToken(token);

  const invalid = !record;
  const expired = record ? Date.now() > record.expiresAt : false;
  const used = record?.used ?? false;
  const blocked = invalid || expired || used;

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-6 text-center">
      <div className="max-w-md rounded-2xl border border-white/10 bg-panel p-8">
        {blocked ? (
          <>
            <h1 className="font-display text-2xl text-white">
              {invalid && "Link not found"}
              {!invalid && used && "Already downloaded"}
              {!invalid && !used && expired && "Link expired"}
            </h1>
            <p className="mt-3 text-sm text-muted">
              This download link is single-use and expires after 3 days. If you still need
              access, message Pixie directly.
            </p>
          </>
        ) : (
          <>
            <h1 className="font-display text-2xl text-white">Your file is ready</h1>
            <p className="mt-2 text-sm text-muted">{record!.fileTitle}</p>
            <a
              href={`/api/download/${token}`}
              className="mt-6 inline-block rounded-full bg-accent px-8 py-3 text-sm font-semibold text-white shadow-glow transition hover:brightness-110"
            >
              Download now
            </a>
            <p className="mt-4 text-xs text-muted">
              This link only works once, so make sure you&apos;re ready before you click.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
