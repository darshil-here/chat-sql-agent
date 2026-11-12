import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { loadEnv, requireEnv } from "@/lib/env";

// Scripts run outside Next and load .env.local themselves; Next already has.
if (!process.env.NEXT_RUNTIME) {
  loadEnv();
}

export const client = createClient({
  url: requireEnv("TURSO_DATABASE_URL"),
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client);
