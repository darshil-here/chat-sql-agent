import { seedDatabase } from "@/db/seed";
import { runCli } from "./cli";

runCli(async () => {
  const { tables, rows } = await seedDatabase();
  console.log(`\nSeeded ${tables} tables and ${rows} rows.`);
});
