import { resolve } from "node:path";
import { migrate } from "drizzle-orm/libsql/migrator";
import { db } from "@/db/client";
import { seedDatabase } from "@/db/seed";
import { runCli } from "./cli";

runCli(async () => {
  console.log("Applying migrations…");
  await migrate(db, {
    migrationsFolder: resolve(process.cwd(), "db/migrations"),
  });

  console.log("Seeding…");
  const { tables, rows } = await seedDatabase();

  console.log(`\nSeeded ${tables} tables and ${rows} rows. Run 'npm run dev'.`);
});
