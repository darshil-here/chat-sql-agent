import { config } from "dotenv";
import { resolve } from "node:path";
config({ path: resolve(process.cwd(), ".env.local") });

import { getRAGContext } from "../lib/sql-rag";

async function main() {
  const question = process.argv[2] || "How many companies from Nepal?";

  console.log(`Question: "${question}"\n`);
  const context = await getRAGContext(question);
  console.log(context);
}

main().catch(console.error);
