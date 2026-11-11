import { assertSafeReadOnlyQuery } from "../lib/sql-guard";

const allowed = [
  "SELECT COUNT(*) FROM orders",
  "SELECT replace(name, 'a', 'b') FROM customers",
  "SELECT ';' AS semicolon",
  "SELECT 1 -- DROP TABLE orders",
  "WITH x AS (SELECT 1 AS n) SELECT * FROM x",
  "SELECT * FROM \"orders\" WHERE order_status = 'completed'",
  "SELECT name FROM customers WHERE name = 'drop table'",
];

const blocked = [
  "DROP TABLE orders",
  "SELECT 1; DROP TABLE orders",
  "SELECT 1; SELECT 2",
  "SELECT load_extension('evil')",
  "PRAGMA table_info(orders)",
  "WITH x AS (SELECT 1) DELETE FROM orders",
  "ATTACH DATABASE 'x' AS y",
  "DELETE FROM orders",
  "UPDATE orders SET total_amount = 0",
];

let failed = 0;

for (const query of allowed) {
  try {
    assertSafeReadOnlyQuery(query);
    console.log(`PASS allowed: ${query}`);
  } catch (error) {
    failed++;
    console.log(`FAIL allowed: ${query} -> ${(error as Error).message}`);
  }
}

for (const query of blocked) {
  try {
    assertSafeReadOnlyQuery(query);
    failed++;
    console.log(`FAIL blocked: ${query}`);
  } catch {
    console.log(`PASS blocked: ${query}`);
  }
}

if (failed > 0) {
  console.error(`\n${failed} guard checks failed.`);
  process.exit(1);
}

console.log(`\nGuard checks passed: ${allowed.length + blocked.length}`);
