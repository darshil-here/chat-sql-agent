import assert from "node:assert/strict";
import test from "node:test";
import { getTableColumns, getTableName } from "drizzle-orm";
import type { SQLiteTable } from "drizzle-orm/sqlite-core";
import { tableCatalog, tableGroups } from "../db/catalog";
import * as schema from "../db/schema";

const tables = Object.entries(schema)
  .filter(
    ([name]) => name !== "schemaMetadataTable" && name !== "tablesInForeignKeyOrder",
  )
  .map(([, table]) => table as SQLiteTable);

const tableNames = tables.map((table) => getTableName(table)).sort();
const catalogNames = tableCatalog.map((table) => table.table_name).sort();

function docFor(table: SQLiteTable) {
  const name = getTableName(table);
  const doc = tableCatalog.find((entry) => entry.table_name === name);
  assert.ok(doc, `${name} has no catalog entry`);
  return doc;
}

test("catalog covers every business table and nothing else", () => {
  assert.deepEqual(catalogNames, tableNames);
});

test("seed order covers every business table exactly once", () => {
  const ordered = schema.tablesInForeignKeyOrder.map(getTableName);

  assert.equal(new Set(ordered).size, ordered.length, "a table appears twice");
  assert.deepEqual(ordered.sort(), tableNames);
});

test("documented columns match the drizzle schema", () => {
  for (const table of tables) {
    const columns = Object.keys(getTableColumns(table));
    const documented = docFor(table).columns.split(",").map((c) => c.trim());
    assert.deepEqual(documented, columns, `${getTableName(table)} drifted`);
  }
});

test("column_types mentions every column", () => {
  for (const table of tables) {
    const doc = docFor(table);
    for (const column of Object.keys(getTableColumns(table))) {
      assert.match(
        doc.column_types,
        new RegExp(`\\b${column}\\b`),
        `${getTableName(table)}.${column} is missing from column_types`,
      );
    }
  }
});

test("relationships lists every foreign key column", () => {
  for (const table of tables) {
    const doc = docFor(table);
    for (const column of Object.keys(getTableColumns(table))) {
      if (column === "id" || !column.endsWith("_id")) continue;
      assert.ok(
        doc.relationships.includes(column),
        `${getTableName(table)}.${column} is missing from relationships`,
      );
    }
  }
});

test("every catalog table belongs to exactly one guide group", () => {
  const grouped = tableGroups.flatMap((group) => group.tables);

  assert.equal(new Set(grouped).size, grouped.length, "a table is in two groups");
  assert.deepEqual([...grouped].sort(), catalogNames);
});

test("table names are safe to interpolate as SQL identifiers", () => {
  for (const name of catalogNames) {
    assert.match(name, /^[a-z][a-z0-9_]*$/);
  }
});
