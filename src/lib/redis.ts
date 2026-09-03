import { Redis } from "@upstash/redis";

// Populated automatically when a Vercel Marketplace Redis (Upstash) store is
// connected to the project. Locally, copy the values from that store's
// dashboard into .env.local.
export const redis = Redis.fromEnv();
