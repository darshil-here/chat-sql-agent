-- Rebuild FTS5 without 'columns' to reduce false positives
-- 'company_id' in columns was tokenized as 'company' causing 8 tables to match

-- Recreate FTS5 virtual table with only table_name, description, example_queries
CREATE VIRTUAL TABLE IF NOT EXISTS schema_metadata_fts_new USING fts5(
  table_name,
  description,
  example_queries,
  content='schema_metadata',
  content_rowid='rowid'
);

-- Copy data from old FTS
INSERT INTO schema_metadata_fts_new(rowid, table_name, description, example_queries)
  SELECT rowid, table_name, description, example_queries FROM schema_metadata_fts;

-- Drop old FTS
DROP TABLE schema_metadata_fts;

-- Rename new to old
ALTER TABLE schema_metadata_fts_new RENAME TO schema_metadata_fts;
