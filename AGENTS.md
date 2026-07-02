<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project: QueryMind — NL to SQL Chat App

### Tech Stack
- **LLM**: OpenAI gpt-oss-120b via OpenRouter (`@openrouter/ai-sdk-provider`)
- **DB**: Turso (SQLite) + Drizzle ORM
- **SQL RAG**: FTS5 (vectorless) — no embeddings, no vector store
- **Data**: faker-js for all seeding (~8,335 rows across 24 tables)

### Scripts
```bash
npm run dev          # Start dev server
npm run db:setup     # Run full setup (migrations + seed + FTS5 rebuild)
npm run db:generate  # Generate migrations
npm run db:migrate   # Apply migrations
npm run db:seed      # Seed database with faker
npm run db:studio    # Open Drizzle Studio
npx tsx scripts/test-rag.ts "YOUR QUESTION"  # Test RAG retrieval
```

### Current Status (Step 3.6 Complete)
- [x] Gemini → OpenAI gpt-oss-120b via OpenRouter
- [x] 24 tables with faker seed data (~8,335 rows)
- [x] FTS5 schema metadata table + triggers
- [x] SQL RAG: `getRAGContext()` returns relevant schemas + sample rows
- [x] FTS5 tuned: removed `columns`/`relationships` from index, AND-then-OR matching, stop words
- [x] RAG integrated into `app/api/chat/route.ts` — replaced old `schema` tool with `getRAGContext()` injection
- [x] Setup script: `scripts/setup-sql-rag.ts` — runs migrations, seed, metadata, and FTS5 rebuild in one command

### Next Steps
1. **Step 7**: Add "Show SQL" dry-run button to chat UI
2. **Step 8**: Add "?" button with project overview for recruiters
3. **Step 9**: Improve landing page

### Key Files
- `lib/sql-rag.ts` — RAG logic (FTS5 search, sample rows, `getRAGContext()`)
- `app/api/chat/route.ts` — API route (needs RAG integration)
- `db/schema.ts` — 24 table definitions + `schemaMetadataTable`
- `db/db.seed.ts` — Faker seed script
- `scripts/seed-schema-metadata.ts` — Seeds FTS5 metadata
- `scripts/setup-sql-rag.ts` — Full setup script (migrations + seed + metadata + FTS5 rebuild)
- `scripts/test-rag.ts` — Manual RAG testing
