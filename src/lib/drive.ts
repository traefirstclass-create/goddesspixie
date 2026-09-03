import { GoogleAuth } from "google-auth-library";

let cachedAuth: GoogleAuth | null = null;

function getAuth(): GoogleAuth {
  if (cachedAuth) return cachedAuth;

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  if (!email || !rawKey) {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY are not set"
    );
  }

  cachedAuth = new GoogleAuth({
    credentials: {
      client_email: email,
      // Vercel env vars store literal "\n" — convert back to real newlines.
      private_key: rawKey.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });
  return cachedAuth;
}

export type DriveFileStream = {
  body: ReadableStream<Uint8Array>;
  contentType: string;
  contentLength: string | null;
  fileName: string;
};

// Streams a single Drive file's bytes server-side, using service-account
// credentials. The caller never sees the underlying Drive URL or folder.
export async function fetchDriveFileStream(fileId: string): Promise<DriveFileStream> {
  const auth = getAuth();
  const client = await auth.getClient();
  const accessToken = (await client.getAccessToken()).token;
  if (!accessToken) throw new Error("Failed to obtain Google access token");

  const metaRes = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?fields=name,mimeType,size`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!metaRes.ok) {
    throw new Error(`Drive metadata request failed: ${metaRes.status} ${await metaRes.text()}`);
  }
  const meta = (await metaRes.json()) as { name: string; mimeType: string; size?: string };

  const fileRes = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!fileRes.ok || !fileRes.body) {
    throw new Error(`Drive file download failed: ${fileRes.status} ${await fileRes.text()}`);
  }

  return {
    body: fileRes.body,
    contentType: meta.mimeType || "application/octet-stream",
    contentLength: meta.size ?? fileRes.headers.get("content-length"),
    fileName: meta.name,
  };
}
