-- Properly rebuild FTS5: drop old, create new without 'columns' and 'relationships'
DROP TABLE IF EXISTS schema_metadata_fts;

CREATE VIRTUAL TABLE schema_metadata_fts USING fts5(
  table_name,
  description,
  example_queries,
  content='schema_metadata',
  content_rowid='rowid'
);

-- Repopulate from schema_metadata
INSERT INTO schema_metadata_fts(rowid, table_name, description, example_queries)
  SELECT rowid, table_name, description, example_queries FROM schema_metadata;
