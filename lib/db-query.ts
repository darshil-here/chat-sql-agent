import { assertSafeReadOnlyQuery } from "@/lib/sql-guard";
import { MAX_TOOL_ROWS, type QueryResult } from "@/lib/chat-contract";

export interface QueryRunner {
  run(
    query: string,
    args?: (string | number | null)[],
  ): Promise<{ columns: string[]; rows: Record<string, unknown>[] }>;
}

const libsqlRunner: QueryRunner = {
  async run(query, args) {
    const { client } = await import("@/db/client");
    return client.execute({ sql: query, args });
  },
};

interface RunOptions {
  args?: (string | number | null)[];
  runner?: QueryRunner;
}

/**
 * The only place the app executes SQL. Every statement goes through the
 * read-only guard first, and the result is capped before it leaves the server.
 */
export async function runReadOnlyQuery(
  query: string,
  { args, runner = libsqlRunner }: RunOptions = {},
): Promise<QueryResult> {
  assertSafeReadOnlyQuery(query);
  const result = await runner.run(query, args);

  return {
    columns: result.columns,
    rows: result.rows.slice(0, MAX_TOOL_ROWS),
    rowCount: result.rows.length,
    truncated: result.rows.length > MAX_TOOL_ROWS,
  };
}
