import { config } from "dotenv";
import { resolve } from "node:path";

const ENV_FILE = resolve(process.cwd(), ".env.local");

/**
 * Loads `.env.local` into `process.env`. Next.js does this itself for the app;
 * scripts and `drizzle-kit` run outside Next and need it explicitly.
 */
export function loadEnv(): void {
  config({ path: ENV_FILE, quiet: true });
}

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing ${name}. Copy .env.example to .env.local and fill it in.`,
    );
  }
  return value;
}
