import type { MutationResolvers } from 'types/graphql';
import Papa from 'papaparse';
import { db } from 'src/lib/db';
import {
  Livejournal,
  LivejournalImport,
} from 'src/lib/data_providers/livejournal';

export const createImport: MutationResolvers['createImport'] = async ({
  input,
}) => {
  const { files } = input;
  console.log('input', input);

  const allPromises = files.map(async (file) => {
    const text = await file.text();
    const results = Papa.parse(text, { header: true, skipEmptyLines: true });
    return results.data;
  });
  const results = await Promise.allSettled(allPromises);

  const filteredData = results.flatMap((r): Array<LivejournalImport> => {
    if (r.status === 'rejected') {
      return [];
    }

    const results: Array<LivejournalImport> = [];
    for (const rawResult of r.value) {
      const validatedResult = Livejournal.validate(rawResult);
      if (validatedResult) {
        results.push(validatedResult);
      }
    }
    return results;
  });

  if (filteredData.length) {
    await db.blogImport.createMany({
      data: filteredData.map((d) => ({
        rawJson: JSON.stringify(d),
        type: 'LIVEJOURNAL',
        publishTime: d.eventtime,
        importTime: new Date(),
      })),
    });
  }

  return true;
};
