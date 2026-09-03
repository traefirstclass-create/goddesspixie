import { Redis } from "@upstash/redis";

// Vercel's Marketplace Redis (Upstash) integration injects KV_REST_API_URL /
// KV_REST_API_TOKEN, not the UPSTASH_REDIS_REST_* names Redis.fromEnv()
// expects — support both so this works whether Redis was connected via
// Vercel's integration or a raw Upstash database.
export const redis = new Redis({
  url: process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL ?? "",
  token: process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN ?? "",
});
