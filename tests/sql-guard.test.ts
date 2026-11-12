import assert from "node:assert/strict";
import test from "node:test";
import { assertSafeReadOnlyQuery } from "../lib/sql-guard";

const allowed = [
  "SELECT COUNT(*) FROM orders",
  "SELECT replace(name, 'a', 'b') FROM customers",
  "SELECT replace (name, 'a', 'b') FROM customers",
  "SELECT ';' AS semicolon",
  "SELECT 1 -- DROP TABLE orders",
  "WITH x AS (SELECT 1 AS n) SELECT * FROM x",
  "WITH x AS (SELECT 1), y AS (SELECT 2) SELECT * FROM x, y",
  'SELECT * FROM "orders" WHERE order_status = \'completed\'',
  "SELECT name FROM customers WHERE name = 'drop table'",
];

const blocked = [
  "DROP TABLE orders",
  "SELECT 1; DROP TABLE orders",
  "SELECT 1; SELECT 2",
  "SELECT load_extension('evil')",
  "PRAGMA table_info(orders)",
  "WITH x AS (SELECT 1) DELETE FROM orders",
  "WITH x AS (SELECT 1) REPLACE INTO orders(id) VALUES (1)",
  "WITH x AS (SELECT 1) INSERT INTO orders(id) VALUES (1)",
  "ATTACH DATABASE 'x' AS y",
  "DELETE FROM orders",
  "UPDATE orders SET total_amount = 0",
];

for (const query of allowed) {
  test(`allows: ${query}`, () => {
    assert.doesNotThrow(() => assertSafeReadOnlyQuery(query));
  });
}

for (const query of blocked) {
  test(`blocks: ${query}`, () => {
    assert.throws(() => assertSafeReadOnlyQuery(query));
  });
}
