import { db } from "@/db/db";
import { sql } from "drizzle-orm";

interface TableSchema {
  table_name: string;
  description: string;
  columns: string;
  column_types: string;
  relationships: string;
}

/**
 * Cleans user question for FTS5 search.
 * Removes stop words and extracts meaningful keywords.
 */
function cleanQuestion(question: string): { andQuery: string; orQuery: string } {
  const stopWords = [
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
  ];

  const words = question
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.includes(word));

  // Use AND for precise matching — only return tables matching ALL keywords
  const andQuery = words.join(" AND ");
  // Use OR as fallback — return tables matching ANY keyword
  const orQuery = words.join(" OR ");
  return { andQuery, orQuery };
}

/**
 * Sanitizes a string for safe use in FTS5 MATCH queries.
 * Only allows alphanumeric characters, spaces, and OR operators.
 */
function sanitizeFTS(query: string): string {
  return query.replace(/[^a-zA-Z0-9\s]/g, "").trim();
}

/**
 * Searches schema metadata using FTS5 and returns relevant tables.
 * Uses FTS5 for search, then fetches full data from schema_metadata.
 * @param userQuestion - The user's natural language question
 * @param topK - Number of tables to return (default: 3)
 * @returns Array of relevant table schemas
 */
export async function getRelevantSchemas(
  userQuestion: string,
  topK: number = 3
): Promise<TableSchema[]> {
  const { andQuery, orQuery } = cleanQuestion(userQuestion);

  // If no meaningful keywords extracted, fall back to returning all tables
  if (!andQuery) {
    const allTables = await db.all(sql`
      SELECT table_name, description, columns, column_types, relationships
      FROM schema_metadata
      LIMIT ${topK}
    `);
    return allTables as TableSchema[];
  }

  // Try AND first for precise results, fall back to OR if no matches
  let safeQuery = sanitizeFTS(andQuery);
  let matchingTables = await db.all(sql.raw(`
    SELECT table_name
    FROM schema_metadata_fts
    WHERE schema_metadata_fts MATCH '${safeQuery}'
    ORDER BY rank
    LIMIT ${topK}
  `)) as { table_name: string }[];

  // Fallback to OR if AND returns nothing
  if (matchingTables.length === 0) {
    safeQuery = sanitizeFTS(orQuery);
    matchingTables = await db.all(sql.raw(`
      SELECT table_name
      FROM schema_metadata_fts
      WHERE schema_metadata_fts MATCH '${safeQuery}'
      ORDER BY rank
      LIMIT ${topK}
    `)) as { table_name: string }[];
  }

  if (matchingTables.length === 0) {
    // Fallback: return all tables if FTS returns nothing
    const allTables = await db.all(sql`
      SELECT table_name, description, columns, column_types, relationships
      FROM schema_metadata
      LIMIT ${topK}
    `);
    return allTables as TableSchema[];
  }

  // Fetch full metadata for matching tables
  // Table names come from our own database, so they're safe to interpolate
  const tableNames = matchingTables.map((t) => `'${t.table_name}'`);
  const results = await db.all(sql.raw(`
    SELECT table_name, description, columns, column_types, relationships
    FROM schema_metadata
    WHERE table_name IN (${tableNames.join(", ")})
  `));

  return results as TableSchema[];
}

/**
 * Gets sample rows from a table to show the LLM actual data values.
 * This helps with casing, formatting, and value accuracy.
 * @param tableName - The table to fetch sample rows from
 * @param limit - Number of rows to return (default: 3)
 * @returns Formatted markdown table string
 */
async function getSampleRows(
  tableName: string,
  limit: number = 3
): Promise<string> {
  try {
    const rows = await db.all(
      sql.raw(`SELECT * FROM "${tableName}" LIMIT ${limit}`)
    ) as Record<string, unknown>[];

    if (rows.length === 0) return "(no data in table)";

    // Format as markdown table
    const columns = Object.keys(rows[0]);
    const header = `| ${columns.join(" | ")} |`;
    const separator = `| ${columns.map(() => "---").join(" | ")} |`;
    const body = rows
      .map((r) => `| ${columns.map((c) => r[c] ?? "NULL").join(" | ")} |`)
      .join("\n");

    return `${header}\n${separator}\n${body}`;
  } catch {
    return "(unable to fetch sample rows)";
  }
}

/**
 * Main RAG function: retrieves relevant schemas AND sample rows.
 * Returns formatted context string for the system prompt.
 * @param userQuestion - The user's natural language question
 * @returns Formatted string with table schemas and sample data
 */
export async function getRAGContext(userQuestion: string): Promise<string> {
  // Step 1: Find relevant tables
  const schemas = await getRelevantSchemas(userQuestion, 3);

  if (schemas.length === 0) {
    return "No relevant tables found. Please rephrase your question.";
  }

  // Step 2: For each table, get schema + sample rows
  const lines: string[] = [];

  for (const schema of schemas) {
    const sampleRows = await getSampleRows(schema.table_name, 3);

    lines.push(`TABLE: ${schema.table_name}`);
    lines.push(`Description: ${schema.description}`);
    lines.push(`Columns: ${schema.column_types}`);
    lines.push(`Relationships: ${schema.relationships}`);
    lines.push(`Example data:\n${sampleRows}`);
    lines.push(""); // blank line between tables
  }

  return lines.join("\n");
}
