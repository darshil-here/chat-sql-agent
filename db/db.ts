import { config } from "dotenv";
import { resolve } from "node:path";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

config({ path: resolve(process.cwd(), ".env.local") });

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(turso);
