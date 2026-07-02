CREATE TABLE `schema_metadata` (
	`table_name` text PRIMARY KEY NOT NULL,
	`description` text,
	`columns` text,
	`column_types` text,
	`relationships` text,
	`example_queries` text
);

--> statement-breakpoint

-- Create FTS5 virtual table for schema metadata search
CREATE VIRTUAL TABLE IF NOT EXISTS schema_metadata_fts USING fts5(
  table_name,
  description,
  columns,
  relationships,
  example_queries,
  content=schema_metadata,
  content_rowid=rowid
);

--> statement-breakpoint

-- Triggers to keep FTS5 index in sync with schema_metadata table

CREATE TRIGGER IF NOT EXISTS schema_metadata_ai AFTER INSERT ON schema_metadata BEGIN
  INSERT INTO schema_metadata_fts(rowid, table_name, description, columns, relationships, example_queries)
  VALUES (new.rowid, new.table_name, new.description, new.columns, new.relationships, new.example_queries);
END;

--> statement-breakpoint

CREATE TRIGGER IF NOT EXISTS schema_metadata_ad AFTER DELETE ON schema_metadata BEGIN
  INSERT INTO schema_metadata_fts(schema_metadata_fts, rowid, table_name, description, columns, relationships, example_queries)
  VALUES('delete', old.rowid, old.table_name, old.description, old.columns, old.relationships, old.example_queries);
END;

--> statement-breakpoint

CREATE TRIGGER IF NOT EXISTS schema_metadata_au AFTER UPDATE ON schema_metadata BEGIN
  INSERT INTO schema_metadata_fts(schema_metadata_fts, rowid, table_name, description, columns, relationships, example_queries)
  VALUES('delete', old.rowid, old.table_name, old.description, old.columns, old.relationships, old.example_queries);
  INSERT INTO schema_metadata_fts(rowid, table_name, description, columns, relationships, example_queries)
  VALUES (new.rowid, new.table_name, new.description, new.columns, new.relationships, new.example_queries);
END;
