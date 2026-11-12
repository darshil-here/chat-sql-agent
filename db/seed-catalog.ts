import { db } from "./client";
import { schemaMetadataTable } from "./schema";
import { tableCatalog } from "./catalog";

/**
 * Writes the catalog into `schema_metadata`, where the FTS5 triggers index it.
 * Returns the number of tables written.
 */
export async function seedCatalog(): Promise<number> {
  await db.delete(schemaMetadataTable);
  await db.insert(schemaMetadataTable).values(tableCatalog);
  return tableCatalog.length;
}
