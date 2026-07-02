-- Rebuild FTS5 table WITHOUT the relationships column
-- The relationships column was causing false positives (e.g., "companies" matching
-- all tables that reference companies.id in their relationships)

-- Drop old triggers
DROP TRIGGER IF EXISTS schema_metadata_ai;
DROP TRIGGER IF EXISTS schema_metadata_ad;
DROP TRIGGER IF EXISTS schema_metadata_au;

-- Drop old FTS5 table
DROP TABLE IF EXISTS schema_metadata_fts;

-- Create new FTS5 table without relationships
CREATE VIRTUAL TABLE IF NOT EXISTS schema_metadata_fts USING fts5(
  table_name,
  description,
  columns,
  example_queries,
  content=schema_metadata,
  content_rowid=rowid
);

-- Re-create triggers for the new FTS5 table

CREATE TRIGGER IF NOT EXISTS schema_metadata_ai AFTER INSERT ON schema_metadata BEGIN
  INSERT INTO schema_metadata_fts(rowid, table_name, description, columns, example_queries)
  VALUES (new.rowid, new.table_name, new.description, new.columns, new.example_queries);
END;

CREATE TRIGGER IF NOT EXISTS schema_metadata_ad AFTER DELETE ON schema_metadata BEGIN
  INSERT INTO schema_metadata_fts(schema_metadata_fts, rowid, table_name, description, columns, example_queries)
  VALUES('delete', old.rowid, old.table_name, old.description, old.columns, old.example_queries);
END;

CREATE TRIGGER IF NOT EXISTS schema_metadata_au AFTER UPDATE ON schema_metadata BEGIN
  INSERT INTO schema_metadata_fts(schema_metadata_fts, rowid, table_name, description, columns, example_queries)
  VALUES('delete', old.rowid, old.table_name, old.description, old.columns, old.example_queries);
  INSERT INTO schema_metadata_fts(rowid, table_name, description, columns, example_queries)
  VALUES (new.rowid, new.table_name, new.description, new.columns, new.example_queries);
END;

-- Re-populate FTS5 index from schema_metadata
INSERT INTO schema_metadata_fts(rowid, table_name, description, columns, example_queries)
SELECT rowid, table_name, description, columns, example_queries FROM schema_metadata;
