<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes. APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project: QueryMind

A natural language to SQL chat app. The model gets schema context from an FTS5 search, writes SQLite, and calls a server-side tool after a read-only guard.

### Stack

- Next.js 16 App Router, React 19, Tailwind CSS v4
- AI SDK 6 with `@openrouter/ai-sdk-provider`
- Model: `nvidia/nemotron-3.5-super-vl:free` in `app/api/chat/route.ts`
- Turso (libSQL) with Drizzle ORM
- Retrieval: SQLite FTS5 over `schema_metadata`, no embeddings
- Seed data: faker, 24 tables, about 8,335 rows

### Commands

```bash
npm run dev                                  # Dev server
npm run build                                # Production build
npm run lint                                 # ESLint
npm run db:setup                             # Migrations, seed, metadata, FTS rebuild
npm run db:seed                              # Reseed demo data
npm run db:studio                            # Drizzle Studio
npx tsx scripts/test-rag.ts "your question"  # Check which tables RAG returns
```

`npm run db:setup` expects a fresh database. See `README.md` for setup.

### Key files

- `app/api/chat/route.ts`: system prompt, model call, `db` tool, `assertSafeReadOnlyQuery`
- `lib/sql-rag.ts`: `getRAGContext`, FTS5 query building, sample rows
- `db/schema.ts`: 24 business tables plus `schemaMetadataTable`
- `db/db.seed.ts`: faker seed data
- `scripts/setup-sql-rag.ts`: one-shot setup path
- `evals/questions.json`: evaluation questions with expected tables

### Rules

- Never commit `.env.local`. Use `.env.example` for new variables.
- Any new database tool must go through `assertSafeReadOnlyQuery`.
- The model only sees tables returned by `getRAGContext`. If retrieval misses a table, the answer will be wrong. Test retrieval changes with `scripts/test-rag.ts`.
- Keep the system prompt constraints intact: `SELECT` only, no invented tables, no fabricated results.
- Use the design tokens in `app/globals.css`. See `UI-THEME.md` for the token map.
