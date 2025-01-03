import { db } from 'src/lib/db';
import { Notion } from 'src/lib/data_providers/notion';

export const createExport = async () => {
  // fetch all records from the database
  const records = await db.blogImport.findMany();
  for (const r of records) {
    const results = await Notion.export(r);
    console.log(results);
  }
  return false;
};
