/**
 * Defense-in-depth guard for the db tool. This is NOT a substitute for running
 * the app's DB connection as a read-only / least-privilege user. Do that at the
 * database layer too.
 */

const FORBIDDEN_KEYWORDS = [
  "INSERT",
  "UPDATE",
  "DELETE",
  "DROP",
  "ALTER",
  "TRUNCATE",
  "CREATE",
  "ATTACH",
  "DETACH",
  "PRAGMA",
  "VACUUM",
  "REINDEX",
  "GRANT",
  "REVOKE",
  "EXEC",
  "EXECUTE",
  "LOAD_EXTENSION",
];

/**
 * Removes string literals and comments before the keyword scan. A semicolon or
 * a word like `drop` inside a string is data, not SQL.
 */
function stripLiteralsAndComments(query: string): string {
  let result = "";
  let quote: "'" | '"' | "`" | null = null;
  let index = 0;

  while (index < query.length) {
    const char = query[index];
    const next = query[index + 1];

    if (quote) {
      if (char === quote) {
        if (next === quote) {
          index += 2;
          continue;
        }
        quote = null;
      }
      index++;
      continue;
    }

    if (char === "'" || char === '"' || char === "`") {
      quote = char;
      index++;
      continue;
    }

    if (char === "-" && next === "-") {
      while (index < query.length && query[index] !== "\n") index++;
      continue;
    }

    if (char === "/" && next === "*") {
      index += 2;
      while (
        index < query.length &&
        !(query[index] === "*" && query[index + 1] === "/")
      ) {
        index++;
      }
      index += 2;
      continue;
    }

    result += char;
    index++;
  }

  return result;
}

export function assertSafeReadOnlyQuery(query: string): void {
  const sanitized = stripLiteralsAndComments(query).trim();

  const statements = sanitized
    .split(";")
    .map((statement) => statement.trim())
    .filter((statement) => statement.length > 0);

  if (statements.length > 1) {
    throw new Error(
      "Only a single SELECT statement is allowed per query call.",
    );
  }

  if (!/^SELECT\b|^WITH\b/i.test(sanitized)) {
    throw new Error("Only SELECT (or SELECT-only CTE) statements are allowed.");
  }

  for (const word of FORBIDDEN_KEYWORDS) {
    const wordBoundaryPattern = new RegExp(`\\b${word}\\b`, "i");
    if (wordBoundaryPattern.test(sanitized)) {
      throw new Error(`Forbidden SQL operation: ${word}`);
    }
  }
}
