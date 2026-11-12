import type { Config } from "drizzle-kit";
import { loadEnv, requireEnv } from "./lib/env";

loadEnv();

export default {
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "turso",
  dbCredentials: {
    url: requireEnv("TURSO_DATABASE_URL"),
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
} satisfies Config;
