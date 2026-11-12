import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { rankTables } from "@/lib/sql-rag";
import { runCli } from "./cli";

interface EvalQuestion {
  id: string;
  question: string;
  expected_tables: string[];
  notes?: string;
}

runCli(async () => {
  const questions = JSON.parse(
    readFileSync(resolve(process.cwd(), "evals/questions.json"), "utf8"),
  ) as EvalQuestion[];

  let passed = 0;

  for (const item of questions) {
    const tables = await rankTables(item.question);
    const missing = item.expected_tables.filter((table) => !tables.includes(table));
    const ok = missing.length === 0;
    if (ok) passed++;

    console.log(`${ok ? "PASS" : "MISS"} ${item.id}`);
    console.log(`  retrieved: ${tables.join(", ")}`);
    if (!ok) {
      console.log(`  missing: ${missing.join(", ")}`);
      if (item.notes) console.log(`  note: ${item.notes}`);
    }
  }

  console.log(`\nRetrieval recall: ${passed}/${questions.length}`);
  if (passed !== questions.length) process.exitCode = 1;
});
