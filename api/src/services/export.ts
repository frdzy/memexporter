import { db } from 'src/lib/db';
import { Notion } from 'src/lib/data_providers/notion';
import { MutationResolvers } from 'types/graphql';

export const createExport: MutationResolvers['createExport'] = async ({
  input: { isDryRun },
}) => {
  // fetch all records from the database
  const records = await db.blogImport.findMany();
  for (const r of records) {
    const results = await Notion.export(r, { isDryRun });
    console.log(results);
  }
  return false;
};
