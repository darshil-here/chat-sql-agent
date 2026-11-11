/**
 * Setup script: runs all initialization steps in order.
 * Usage: npx tsx scripts/setup-sql-rag.ts
 *
 * Steps:
 * 1. Apply database migrations
 * 2. Seed database with faker data
 * 3. Seed FTS5 schema metadata (triggers keep the index in sync)
 */

import { config } from "dotenv";
import { resolve } from "node:path";
config({ path: resolve(process.cwd(), ".env.local") });

import { seedSchemaMetadata } from "../db/schema-metadata";

async function applyMigrations() {
  console.log("1. Applying migrations...");
  const { execSync } = await import("node:child_process");
  execSync("npx drizzle-kit migrate", { stdio: "inherit", cwd: process.cwd() });
  console.log("   Migrations applied\n");
}

async function seedDatabase() {
  console.log("2. Seeding database with faker data...");
  const { execSync } = await import("node:child_process");
  execSync("npx tsx db/db.seed.ts", { stdio: "inherit", cwd: process.cwd() });
  console.log("   Database seeded\n");
}

async function main() {
  console.log("QueryMind SQL RAG Setup\n");
  console.log("=".repeat(40) + "\n");

  await applyMigrations();
  await seedDatabase();

  console.log("3. Seeding FTS5 schema metadata...");
  const count = await seedSchemaMetadata();
  console.log(`   Seeded ${count} tables\n`);

  console.log("=".repeat(40));
  console.log("Setup complete. Run 'npm run dev' to start.\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Setup failed:", error);
    process.exit(1);
  });
