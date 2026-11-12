import assert from "node:assert/strict";
import test from "node:test";
import { MAX_TOOL_ROWS } from "../lib/chat-contract";
import { buildInstructions } from "../lib/prompts";
import { FORBIDDEN_KEYWORDS } from "../lib/sql-guard";

const schema = "FULL DATABASE SCHEMA\nTABLE: orders";

test("run mode grounds the model in the schema and the row cap", () => {
  const prompt = buildInstructions({ schema, mode: "run" });

  assert.ok(prompt.includes(schema));
  assert.ok(prompt.includes(`at most ${MAX_TOOL_ROWS} rows`));
});

test("run mode names every keyword the guard blocks", () => {
  const prompt = buildInstructions({ schema, mode: "run" });

  for (const keyword of FORBIDDEN_KEYWORDS) {
    assert.ok(prompt.includes(keyword), `prompt does not mention ${keyword}`);
  }
});

test("dry run asks for SQL only and promises no execution", () => {
  const prompt = buildInstructions({ schema, mode: "dryRun" });

  assert.ok(prompt.includes(schema));
  assert.ok(prompt.includes("Respond with ONLY a markdown code block"));
  assert.ok(!prompt.includes("The tool returns"));
  assert.ok(!prompt.includes(`at most ${MAX_TOOL_ROWS} rows`));
});

test("dry run never invites a prose answer", () => {
  const prompt = buildInstructions({ schema, mode: "dryRun" });

  assert.ok(!prompt.includes("respond directly instead"));
});
