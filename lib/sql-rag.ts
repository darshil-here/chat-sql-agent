import { getTableDoc, tableCatalog, type TableDoc } from "@/db/catalog";
import { runReadOnlyQuery } from "@/lib/db-query";

const TOP_TABLES = 5;
const SAMPLE_ROWS = 3;
const FTS_CANDIDATES = 12;
const CELL_MAX_CHARS = 80;

const EXACT_TABLE_NAME_SCORE = -100;
const TABLE_NAME_WORD_SCORE = -50;

const STOP_WORDS = new Set([
  "what", "is", "are", "how", "many", "the", "a", "an", "in", "on",
  "at", "to", "for", "of", "with", "by", "from", "and", "or", "not",
  "this", "that", "there", "can", "you", "me", "show", "tell", "give",
  "find", "list", "count", "total", "sum", "average", "max", "min",
  "which", "where", "when", "who", "whose", "why", "do", "does",
  "did", "has", "have", "had", "was", "were", "been", "being",
  "will", "would", "could", "should", "may", "might", "shall",
  "it", "its", "they", "them", "their", "he", "she", "we", "us",
  "all", "any", "some", "each", "every", "no", "only", "own",
  "same", "so", "than", "too", "very", "just", "about", "top",
  "most", "least", "more", "much", "please", "per", "into", "over",
]);

function extractKeywords(question: string): string[] {
  const words = question
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));

  return [...new Set(words)];
}

function singularize(word: string): string {
  if (word.endsWith("ies")) return `${word.slice(0, -3)}y`;
  if (word.endsWith("ses")) return word.slice(0, -2);
  if (word.endsWith("s")) return word.slice(0, -1);
  return word;
}

/**
 * A keyword that matches a table name is a much stronger signal than a keyword
 * that only appears somewhere in the description. Exact table matches rank
 * above partial matches, and both rank above the FTS score.
 */
function tableNameScore(keyword: string, tableName: string): number | null {
  const word = singularize(keyword);

  if (singularize(tableName) === word) return EXACT_TABLE_NAME_SCORE;

  const parts = tableName.split("_").map(singularize);
  if (parts.includes(word)) return TABLE_NAME_WORD_SCORE;

  return null;
}

function keepLowerScore(scores: Map<string, number>, table: string, score: number) {
  scores.set(table, Math.min(score, scores.get(table) ?? score));
}

async function getRankedTables(question: string): Promise<TableDoc[]> {
  const keywords = extractKeywords(question);
  if (keywords.length === 0) return [];

  const scores = new Map<string, number>();

  for (const keyword of keywords) {
    for (const table of tableCatalog) {
      const score = tableNameScore(keyword, table.table_name);
      if (score !== null) keepLowerScore(scores, table.table_name, score);
    }
  }

  const ftsQuery = keywords.map((keyword) => `${keyword}*`).join(" OR ");

  // bm25 weights are positional and follow the FTS column order in
  // db/migrations/0003_fix_fts.sql: table_name, description, columns,
  // column_types, example_queries.
  const { rows } = await runReadOnlyQuery(
    `SELECT table_name, bm25(schema_metadata_fts, 10.0, 5.0, 2.0, 2.0, 1.0) AS score
     FROM schema_metadata_fts
     WHERE schema_metadata_fts MATCH ?
     ORDER BY score
     LIMIT ?`,
    { args: [ftsQuery, FTS_CANDIDATES] },
  );

  for (const row of rows) {
    const tableName = String(row.table_name);
    const score = Number(row.score);
    if (!getTableDoc(tableName) || Number.isNaN(score)) continue;
    keepLowerScore(scores, tableName, score);
  }

  return [...scores.entries()]
    .sort(([, a], [, b]) => a - b)
    .slice(0, TOP_TABLES)
    .map(([tableName]) => getTableDoc(tableName))
    .filter((table): table is TableDoc => table !== undefined);
}

/** Table names retrieval would give sample rows to, most relevant first. */
export async function rankTables(question: string): Promise<string[]> {
  const tables = await getRankedTables(question);
  return tables.map((table) => table.table_name);
}

function formatCell(value: unknown): string {
  const text = value === null || value === undefined ? "NULL" : String(value);
  return text.replace(/\|/g, "\\|").replace(/\s+/g, " ").slice(0, CELL_MAX_CHARS);
}

async function getSampleRows(table: TableDoc): Promise<string> {
  try {
    const { columns, rows } = await runReadOnlyQuery(
      `SELECT * FROM "${table.table_name}" LIMIT ${SAMPLE_ROWS}`,
    );

    if (rows.length === 0) return "(no rows in this table)";

    const header = `| ${columns.join(" | ")} |`;
    const separator = `| ${columns.map(() => "---").join(" | ")} |`;
    const body = rows
      .map(
        (row) =>
          `| ${columns.map((column) => formatCell(row[column])).join(" | ")} |`,
      )
      .join("\n");

    return [header, separator, body].join("\n");
  } catch (error) {
    console.error(`Could not read sample rows from ${table.table_name}:`, error);
    return "(sample rows unavailable)";
  }
}

/**
 * Builds the schema context for the system prompt.
 *
 * Every table is included so the model can always see the join path it needs.
 * FTS and table-name matching decide which tables also get sample rows.
 */
export async function getRAGContext(userQuestion: string): Promise<string> {
  let rankedTables: TableDoc[] = [];
  try {
    rankedTables = await getRankedTables(userQuestion);
  } catch (error) {
    console.error(
      "Table ranking failed; serving the schema without sample rows:",
      error,
    );
  }

  const lines: string[] = [
    "FULL DATABASE SCHEMA",
    "Every table in the database is listed below.",
    "",
  ];

  for (const table of tableCatalog) {
    lines.push(
      `TABLE: ${table.table_name}`,
      `Description: ${table.description}`,
      `Columns: ${table.column_types}`,
      `Relationships: ${table.relationships}`,
      "",
    );
  }

  if (rankedTables.length > 0) {
    lines.push("SAMPLE ROWS FROM LIKELY RELEVANT TABLES", "");

    for (const table of rankedTables) {
      lines.push(`TABLE: ${table.table_name}`, await getSampleRows(table), "");
    }
  }

  return lines.join("\n").trim();
}
