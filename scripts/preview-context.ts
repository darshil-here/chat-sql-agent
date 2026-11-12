import { getRAGContext } from "@/lib/sql-rag";
import { runCli } from "./cli";

runCli(async () => {
  const question = process.argv[2] ?? "How many companies from Nepal?";

  console.log(`Question: "${question}"\n`);
  console.log(await getRAGContext(question));
});
