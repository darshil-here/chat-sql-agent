# QueryMind

QueryMind is a natural-language-to-SQL chat application. Ask a question about your data in plain English, and an AI agent retrieves the relevant database schema, generates a SQLite query, executes it, and answers you in business language — no SQL knowledge required.

What sets it apart is a **SQL-focused RAG pipeline**: before the model writes any SQL, a full-text search step retrieves only the schema, columns, and sample rows that are relevant to *your* question. This keeps the LLM grounded in the actual data model instead of guessing at table and column names, which meaningfully improves query accuracy.

---

## Key capabilities

- **Natural-language questions → SQL → answers**, streamed back in real time.
- **SQL RAG retrieval** over schema metadata using SQLite FTS5 (no embeddings, no vector store).
- **Schema-aware grounding** — the model only sees tables/columns relevant to the question, plus a few sample rows from each.
- **Dry Run mode** — generate and inspect the SQL without executing it, ideal for review or demos.
- **Read-only guard** — only `SELECT` statements are allowed; destructive SQL is blocked in both the prompt and a server-side validator.
- **Database Guide panel** — an in-app reference listing all 24 tables and example questions, so testers know what they can ask.
- **Seeded demo database** — 24 tables and ~8,335 rows of realistic faker data across a multi-company e-commerce/SaaS schema.

---

## How it works

1. **You ask a question** (e.g. *"What is the total revenue from completed orders?"*).
2. **SQL RAG** (`lib/sql-rag.ts`) cleans the question into keywords, runs an FTS5 `MATCH` query against `schema_metadata` (trying `AND` of keywords first, falling back to `OR`), and returns the top matching tables.
3. For each matching table it pulls the **description, column types, relationships, and 3 sample rows** — giving the LLM both the shape and the actual values of the data.
4. This context is injected into a **system prompt** that constrains the model to:
   - use only the tables/columns in the provided schema,
   - write SQLite-compatible `SELECT` statements,
   - disambiguate similar tables using documented business rules, and
   - retry on failure (bounded) rather than fabricate results.
5. The model calls a **`db` tool** with the generated SQL. The server runs `assertSafeReadOnlyQuery` (single statement, `SELECT`/`WITH` only, no DDL/DML keywords) before executing against Turso.
6. Results return to the chat UI as a formatted card showing the SQL and row count, followed by the model's plain-English answer.
7. In **Dry Run mode**, the tool is removed entirely and the model returns only the SQL code block for inspection.

---

## Architecture

```mermaid
flowchart LR
    U[User] --> UI[Chat UI<br/>app/chat]
    UI --> API["Chat API Route<br/>app/api/chat/route.ts"]
    API --> RAG["SQL RAG<br/>lib/sql-rag.ts"]
    RAG --> FTS[("FTS5 Index<br/>schema_metadata_fts")]
    RAG --> SM[("Schema Metadata<br/>schema_metadata")]
    RAG --> DB1[("Turso DB<br/>sample rows")]
    RAG -->|retrieved schema + sample rows| API
    API -->|schema context in system prompt| LLM["LLM<br/>NVIDIA Nemotron 3 Nano 30B<br/>via OpenRouter"]
    LLM -->|generated SQL| API
    API --> Guard["Read-only guard<br/>assertSafeReadOnlyQuery"]
    Guard --> DB1
    DB1 -->|rows| API
    API -->|streamed response| UI
    UI --> U
```

The arrow from **SQL RAG → Chat API → LLM** is the key edge: retrieved schema and sample rows are injected into the system prompt *before* the model generates SQL, so generation is grounded in the real data model rather than the model's prior assumptions.

---

## Tech stack

| Layer            | Technology                                                              |
| ---------------- | ----------------------------------------------------------------------- |
| Framework        | [Next.js 16](https://nextjs.org) (App Router, Turbopack)                |
| AI SDK           | [`ai`](https://sdk.vercel.ai) + `@ai-sdk/react` (`useChat`)             |
| Model            | `nvidia/nemotron-3-nano-30b-a3b:free` via [`@openrouter/ai-sdk-provider`]|
| Database         | [Turso](https://turso.tech) (libSQL/SQLite)                             |
| ORM / migrations | [Drizzle ORM](https://orm.drizzle.team) + `drizzle-kit`                 |
| SQL RAG           | SQLite FTS5 full-text search on a `schema_metadata` table               |
| UI               | React 19, Tailwind CSS v4, Radix primitives, `react-markdown`           |
| Seed data        | [`@faker-js/faker`](https://fakerjs.dev) (~8,335 rows, 24 tables)       |

---

## Setup and local development

### Prerequisites

- Node.js 18+ and npm
- A [Turso](https://turso.tech) database (free tier works) and its auth token
- An [OpenRouter](https://openrouter.ai) API key with access to the Nemotron model

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy the env example and fill in your credentials:

```bash
cp .env.example .env.local
```

`.env.local` must contain:

```bash
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-turso-auth-token
OPENROUTER_API_KEY=your-openrouter-api-key
```

### 3. Set up the database

This single command applies migrations, seeds ~8,335 faker rows, loads schema metadata, and rebuilds the FTS5 index:

```bash
npm run db:setup
```

You can also run each step individually:

```bash
npm run db:migrate      # apply schema migrations
npm run db:seed         # seed faker data only
npx tsx scripts/seed-schema-metadata.ts   # seed schema metadata only
```

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Using the app

1. Open **[http://localhost:3000/chat](http://localhost:3000/chat)**.
2. Click the **Database guide** button (bottom-right) to see every table and example questions.
3. Type a question, for example:

   > What are the top 3 best-selling products by quantity sold?

4. The assistant:
   - retrieves the relevant tables (`products`, `order_items`) via SQL RAG,
   - generates a `SELECT ... GROUP BY ... ORDER BY ... LIMIT 3` query,
   - executes it against the seeded database, and
   - answers with a short summary plus the results.

Want to see the SQL without running it? Toggle the **flask icon (Dry Run)** in the composer — the assistant returns only the SQL for your review.

### Useful npm scripts

```bash
npm run dev          # start dev server
npm run db:setup     # migrations + seed + metadata + FTS5 rebuild
npm run db:studio    # open Drizzle Studio to browse data
npm run lint         # eslint
npx tsx scripts/test-rag.ts "your question"  # inspect RAG retrieval
```

---

## Project structure

```
app/
  api/chat/route.ts    # chat API: RAG → system prompt → LLM → db tool → response
  chat/page.tsx        # chat UI: messages, SQL cards, dry-run toggle
  page.tsx             # landing page
components/
  chat/                # composer, message bubbles, tool cards, database guide
  ui/                  # shadcn-style primitives (button, textarea, scroll-area)
lib/
  sql-rag.ts           # getRelevantSchemas (FTS5) + getSampleRows + getRAGContext
db/
  schema.ts            # 24 Drizzle table definitions + schemaMetadataTable
  db.ts                # Turso/libSQL client
  db.seed.ts           # faker seeding
scripts/
  setup-sql-rag.ts     # one-shot setup (migrate + seed + metadata + FTS5)
  seed-schema-metadata.ts
  test-rag.ts          # manual RAG retrieval testing
```

---

## Safety notes and limitations

- **Read-only enforcement is defense-in-depth.** The model's system prompt forbids non-`SELECT` statements, and `assertSafeReadOnlyQuery` re-validates on the server (single statement, `SELECT`/`WITH` only, blocks DDL/DML keywords). For production, also run the DB connection as a least-privilege / read-only user at the database layer.
- **Generated SQL should be reviewed before running against production data.** Dry Run mode exists for exactly this.
- **RAG is FTS5-based, not embedding-based.** This keeps the stack lean (no vector store, no embedding model) and works well for schema-keyword matching, but won't catch semantic synonyms the way an embedding store could. The `cleanQuestion` + AND-then-OR fallback handles most phrasing variations.
- **The database in this repo is seeded demo data**, not a real production dataset.

---

## Roadmap

- Database guide trigger button on the landing page
- Improved landing-page onboarding for first-time visitors
- Semantic retrieval tier (optional embeddings) for harder paraphrases
- Per-query execution cost / latency telemetry