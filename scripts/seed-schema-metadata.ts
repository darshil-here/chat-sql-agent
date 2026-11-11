import { config } from "dotenv";
import { resolve } from "node:path";
config({ path: resolve(process.cwd(), ".env.local") });

import { seedSchemaMetadata } from "../db/schema-metadata";

async function main() {
  console.log("Seeding schema metadata...");
  const count = await seedSchemaMetadata();
  console.log(`Seeded ${count} tables.`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
