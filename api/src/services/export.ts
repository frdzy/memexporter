import { db } from 'src/lib/db';
import { Notion } from 'src/lib/data_providers/notion';

export const createExport = async () => {
  // fetch all records from the database
  const records = await db.blogImport.findMany();
  const firstRecord = records[0];
  if (!firstRecord) {
    return null;
  }
  const results = await Notion.export(firstRecord);
  console.log(results);
  return results;
};
