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
- Seed data: faker, 24 tables, about 8,335 rows

### Commands

```bash
npm run dev                                  # Dev server
npm run build                                # Production build
npm run lint                                 # ESLint
npm run db:setup                             # Migrations, seed, metadata
npm run db:seed                              # Reseed demo data
npm run db:studio                            # Drizzle Studio
npm run eval                                 # Retrieval evaluation
npm run test:guard                           # SQL guard checks
npx tsx scripts/test-rag.ts "your question"  # Inspect the retrieval context
```

`npm run db:setup` is safe to rerun. See `README.md` for setup.

### Key files

- `app/api/chat/route.ts`: system prompt, model call, `db` tool, 200-row cap
- `lib/sql-rag.ts`: full schema block, table-name boost, FTS ranking, sample rows
- `lib/sql-guard.ts`: `assertSafeReadOnlyQuery`
- `db/schema.ts`: 24 business tables plus `schemaMetadataTable`
- `db/schema-metadata.ts`: table docs and `seedSchemaMetadata`
- `db/db.seed.ts`: faker seed data
- `scripts/setup-sql-rag.ts`: migrations, seed, metadata
- `evals/questions.json`: evaluation questions with expected tables

### Rules

- Never commit `.env.local`. Use `.env.example` for new variables.
- Any new database tool must go through `assertSafeReadOnlyQuery`.
- The model sees every table from `getRAGContext`. FTS only decides which tables get sample rows. Test retrieval changes with `npm run eval`.
- Keep the system prompt constraints intact: `SELECT` only, no invented tables, no fabricated results.
- Use the design tokens in `app/globals.css`. See `UI-THEME.md` for the token map.
