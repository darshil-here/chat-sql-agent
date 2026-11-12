<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project: QueryMind

A natural language to SQL chat app. The model gets the full schema plus FTS-selected sample rows, writes SQLite, and calls a server-side tool after a read-only guard.

### Stack

- Next.js 16 App Router, React 19, Tailwind CSS v4
- AI SDK 7 with `@openrouter/ai-sdk-provider`
- Model: `nvidia/nemotron-3.5-super-vl:free` in `app/api/chat/route.ts`
- Turso (libSQL) with Drizzle ORM
- Retrieval: SQLite FTS5 over `schema_metadata`, no embeddings
- Seed data: faker, 24 tables, about 9,200 rows

### Commands

```bash
npm run dev                                     # Dev server
npm run build                                   # Production build
npm run lint                                    # ESLint
npm test                                        # Guard, query, catalog, prompt tests
npm run db:setup                                # Migrations, seed, catalog
npm run db:seed                                 # Reseed demo data and catalog
npm run db:studio                               # Drizzle Studio
npm run eval                                    # Retrieval evaluation
npx tsx scripts/preview-context.ts "your question"  # Inspect the retrieval context
```

`npm run db:setup` is safe to rerun. See `README.md` for setup.

### Key files

- `app/api/chat/route.ts`: request validation, instructions, `db` tool wiring
- `lib/chat-contract.ts`: tool name, input schema, row cap, UI message types
- `lib/db-query.ts`: `runReadOnlyQuery`, the only path from SQL to the database
- `lib/sql-rag.ts`: full schema block, table-name boost, FTS ranking, sample rows
- `lib/sql-guard.ts`: `assertSafeReadOnlyQuery` and the forbidden keywords
- `lib/prompts.ts`: system prompt sections for run and dry-run modes
- `db/catalog.ts`: table docs, guide groups, value domains, example questions
- `db/seed.ts` / `db/seed-catalog.ts`: faker data and the FTS catalog
- `db/client.ts`: Turso client
- `db/schema.ts`: 24 business tables plus `schemaMetadataTable`
- `scripts/setup.ts`: migrations, seed, catalog
- `evals/questions.json`: evaluation questions with expected tables
- `tests/`: `node:test` checks

### Rules

- Never commit `.env.local`. Use `.env.example` for new variables.
- Every query goes through `runReadOnlyQuery` in `lib/db-query.ts`, which calls `assertSafeReadOnlyQuery`.
- Table names, columns and value domains live in `db/catalog.ts`. `tests/catalog.test.ts` keeps it in sync with `db/schema.ts`.
- The model sees every table from `getRAGContext`. FTS only decides which tables get sample rows. Test retrieval changes with `npm run eval`.
- Keep the system prompt constraints intact: `SELECT` only, no invented tables, no fabricated results.
- Use the design tokens in `app/globals.css`. See `UI-THEME.md` for the token map.
