import { config } from "dotenv";
import { resolve } from "node:path";
config({ path: resolve(process.cwd(), ".env.local") });

import { readFileSync } from "node:fs";
import { getRelevantTableNames } from "../lib/sql-rag";

interface EvalQuestion {
  id: string;
  question: string;
  expected_tables: string[];
  notes?: string;
}

async function main() {
  const questions = JSON.parse(
    readFileSync("evals/questions.json", "utf8"),
  ) as EvalQuestion[];

  let passed = 0;

  for (const item of questions) {
    const tables = await getRelevantTableNames(item.question);
    const missing = item.expected_tables.filter(
      (table) => !tables.includes(table),
    );
    const ok = missing.length === 0;
    if (ok) passed++;

    console.log(`${ok ? "PASS" : "MISS"} ${item.id}`);
    console.log(`  retrieved: ${tables.join(", ")}`);
    if (!ok) console.log(`  missing: ${missing.join(", ")}`);
  }

  console.log(`\nRetrieval recall: ${passed}/${questions.length}`);

  if (passed !== questions.length) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
