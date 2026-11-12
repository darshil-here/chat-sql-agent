import assert from "node:assert/strict";
import test from "node:test";
import { MAX_TOOL_ROWS } from "../lib/chat-contract";
import { runReadOnlyQuery, type QueryRunner } from "../lib/db-query";

function runner(
  rows: Record<string, unknown>[],
  columns = ["id"],
): QueryRunner {
  return { run: async () => ({ columns, rows }) };
}

test("returns every row when the result is under the cap", async () => {
  const result = await runReadOnlyQuery("SELECT id FROM orders", {
    runner: runner([{ id: 1 }, { id: 2 }]),
  });

  assert.equal(result.rowCount, 2);
  assert.equal(result.truncated, false);
  assert.deepEqual(result.rows, [{ id: 1 }, { id: 2 }]);
});

test("caps rows at the tool limit and reports truncation", async () => {
  const rows = Array.from({ length: MAX_TOOL_ROWS + 5 }, (_, id) => ({ id }));

  const result = await runReadOnlyQuery("SELECT id FROM orders", {
    runner: runner(rows),
  });

  assert.equal(result.rowCount, MAX_TOOL_ROWS + 5);
  assert.equal(result.rows.length, MAX_TOOL_ROWS);
  assert.equal(result.truncated, true);
});

test("rejects unsafe SQL before it reaches the database", async () => {
  let called = false;
  const spy: QueryRunner = {
    run: async () => {
      called = true;
      return { columns: [], rows: [] };
    },
  };

  await assert.rejects(() =>
    runReadOnlyQuery("DROP TABLE orders", { runner: spy }),
  );
  assert.equal(called, false);
});

test("passes bound parameters through to the runner", async () => {
  let received: (string | number | null)[] | undefined;
  const spy: QueryRunner = {
    run: async (_query, args) => {
      received = args;
      return { columns: [], rows: [] };
    },
  };

  await runReadOnlyQuery("SELECT * FROM orders WHERE id = ?", {
    args: [7],
    runner: spy,
  });

  assert.deepEqual(received, [7]);
});
