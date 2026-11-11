import { db } from "@/db/db";
import { sql } from "drizzle-orm";

export interface TableSchema {
  table_name: string;
  description: string;
  columns: string;
  column_types: string;
  relationships: string;
  example_queries: string;
}

const MAX_DETAILED_TABLES = 5;
const MAX_SAMPLE_ROWS = 3;

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

  if (singularize(tableName) === word) return -100;

  const parts = tableName.split("_").map(singularize);
  if (parts.includes(word)) return -50;

  return null;
}

async function getAllSchemas(): Promise<TableSchema[]> {
  const rows = await db.all(sql`
    SELECT table_name, description, columns, column_types, relationships, example_queries
    FROM schema_metadata
    ORDER BY table_name
  `);

  return rows as TableSchema[];
}

async function getRankedTableNames(
  question: string,
  allTables: TableSchema[],
  topK: number,
): Promise<string[]> {
  const keywords = extractKeywords(question);
  if (keywords.length === 0) return [];

  const scores = new Map<string, number>();

  for (const keyword of keywords) {
    for (const table of allTables) {
      const score = tableNameScore(keyword, table.table_name);
      if (score === null) continue;
      scores.set(
        table.table_name,
        Math.min(score, scores.get(table.table_name) ?? score),
      );
    }
  }

  const ftsQuery = keywords.map((keyword) => `${keyword}*`).join(" OR ");

  try {
    const matches = (await db.all(sql`
      SELECT
        table_name,
        bm25(schema_metadata_fts, 10.0, 5.0, 2.0, 2.0, 1.0) AS score
      FROM schema_metadata_fts
      WHERE schema_metadata_fts MATCH ${ftsQuery}
      ORDER BY score
      LIMIT 12
    `)) as { table_name: string; score: number }[];

    for (const match of matches) {
      scores.set(
        match.table_name,
        Math.min(match.score, scores.get(match.table_name) ?? match.score),
      );
    }
  } catch (error) {
    console.error("FTS search failed:", error);
  }

  return [...scores.entries()]
    .sort((a, b) => a[1] - b[1])
    .slice(0, topK)
    .map(([tableName]) => tableName);
}

/**
 * Returns the tables that retrieval considers most relevant for a question.
 * Used by the evaluation script.
 */
export async function getRelevantTableNames(
  question: string,
  topK: number = MAX_DETAILED_TABLES,
): Promise<string[]> {
  const allTables = await getAllSchemas();
  return getRankedTableNames(question, allTables, topK);
}

function formatCell(value: unknown): string {
  const text = value === null || value === undefined ? "NULL" : String(value);
  return text.replace(/\|/g, "\\|").replace(/\s+/g, " ").slice(0, 80);
}

async function getSampleRows(
  tableName: string,
  limit: number = MAX_SAMPLE_ROWS,
): Promise<string> {
  if (!/^[a-z_][a-z0-9_]*$/.test(tableName)) {
    return "(invalid table name)";
  }

  try {
    const rows = (await db.all(
      sql.raw(`SELECT * FROM "${tableName}" LIMIT ${limit}`),
    )) as Record<string, unknown>[];

    if (rows.length === 0) return "(no data in table)";

    const columns = Object.keys(rows[0]);
    const header = `| ${columns.join(" | ")} |`;
    const separator = `| ${columns.map(() => "---").join(" | ")} |`;
    const body = rows
      .map(
        (row) =>
          `| ${columns.map((column) => formatCell(row[column])).join(" | ")} |`,
      )
      .join("\n");

    return `${header}\n${separator}\n${body}`;
  } catch {
    return "(unable to fetch sample rows)";
  }
}

/**
 * Builds the schema context for the system prompt.
 *
 * At 24 tables the full schema costs about 2.6k tokens, which is cheaper than
 * a retrieval miss. Every table is included so the model can always see the
 * join path it needs. FTS and table-name matching decide which tables get
 * sample rows.
 */
export async function getRAGContext(userQuestion: string): Promise<string> {
  const allTables = await getAllSchemas();

  if (allTables.length === 0) {
    return "No schema metadata found. Run `npm run db:setup` first.";
  }

  const rankedNames = await getRankedTableNames(
    userQuestion,
    allTables,
    MAX_DETAILED_TABLES,
  );
  const rankedSet = new Set(rankedNames);

  const lines: string[] = [];
  lines.push("FULL DATABASE SCHEMA");
  lines.push("Every table in the database is listed below.");
  lines.push("");

  for (const table of allTables) {
    lines.push(`TABLE: ${table.table_name}`);
    lines.push(`Description: ${table.description}`);
    lines.push(`Columns: ${table.column_types}`);
    lines.push(`Relationships: ${table.relationships}`);
    if (rankedSet.has(table.table_name)) {
      lines.push("Likely relevant to this question: yes");
    }
    lines.push("");
  }

  if (rankedNames.length > 0) {
    lines.push("SAMPLE ROWS FROM LIKELY RELEVANT TABLES");
    lines.push("");
    for (const tableName of rankedNames) {
      lines.push(`TABLE: ${tableName}`);
      lines.push(await getSampleRows(tableName));
      lines.push("");
    }
  }

  return lines.join("\n").trim();
}
