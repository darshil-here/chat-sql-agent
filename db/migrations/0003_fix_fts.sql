-- Rebuild the FTS index with the columns the retrieval code uses.
-- Migration 0002 created the index with `columns` and `relationships`, but the
-- setup script later rebuilt it by hand with only three columns and left the
-- old triggers pointing at columns that no longer existed.

DROP TRIGGER IF EXISTS schema_metadata_ai;
--> statement-breakpoint
DROP TRIGGER IF EXISTS schema_metadata_ad;
--> statement-breakpoint
DROP TRIGGER IF EXISTS schema_metadata_au;
--> statement-breakpoint
DROP TABLE IF EXISTS schema_metadata_fts;
--> statement-breakpoint
CREATE VIRTUAL TABLE schema_metadata_fts USING fts5(
  table_name,
  description,
  columns,
  column_types,
  example_queries,
  content='schema_metadata',
  content_rowid='rowid'
);
--> statement-breakpoint
CREATE TRIGGER schema_metadata_ai AFTER INSERT ON schema_metadata BEGIN
  INSERT INTO schema_metadata_fts(rowid, table_name, description, columns, column_types, example_queries)
  VALUES (new.rowid, new.table_name, new.description, new.columns, new.column_types, new.example_queries);
END;
--> statement-breakpoint
CREATE TRIGGER schema_metadata_ad AFTER DELETE ON schema_metadata BEGIN
  INSERT INTO schema_metadata_fts(schema_metadata_fts, rowid, table_name, description, columns, column_types, example_queries)
  VALUES ('delete', old.rowid, old.table_name, old.description, old.columns, old.column_types, old.example_queries);
END;
--> statement-breakpoint
CREATE TRIGGER schema_metadata_au AFTER UPDATE ON schema_metadata BEGIN
  INSERT INTO schema_metadata_fts(schema_metadata_fts, rowid, table_name, description, columns, column_types, example_queries)
  VALUES ('delete', old.rowid, old.table_name, old.description, old.columns, old.column_types, old.example_queries);
  INSERT INTO schema_metadata_fts(rowid, table_name, description, columns, column_types, example_queries)
  VALUES (new.rowid, new.table_name, new.description, new.columns, new.column_types, new.example_queries);
END;
--> statement-breakpoint
INSERT INTO schema_metadata_fts(rowid, table_name, description, columns, column_types, example_queries)
  SELECT rowid, table_name, description, columns, column_types, example_queries
  FROM schema_metadata;
