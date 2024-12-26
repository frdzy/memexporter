import type { MutationResolvers } from 'types/graphql';
import Papa from 'papaparse';
import { db } from 'src/lib/db';

type LivejournalImport = {
  itemid: number;
  eventtime: Date;
  logtime: Date;
  subject: string;
  event: string;
  security: string;
  allowmask: number;
  current_music?: string;
  current_mood?: string;
};

function isRecord(obj: unknown): obj is Record<string, unknown> {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
}

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
      if (
        !isRecord(rawResult) ||
        typeof rawResult.itemid !== 'string' ||
        typeof rawResult.eventtime !== 'string' ||
        typeof rawResult.logtime !== 'string' ||
        typeof rawResult.subject !== 'string' ||
        typeof rawResult.event !== 'string' ||
        typeof rawResult.security !== 'string' ||
        typeof rawResult.allowmask !== 'string'
      ) {
        console.log('failed validation', rawResult);
        continue;
      }
      const {
        itemid,
        eventtime,
        logtime,
        subject,
        event,
        security,
        allowmask,
      } = rawResult;
      results.push({
        itemid: +itemid,
        eventtime: new Date(eventtime),
        logtime: new Date(logtime),
        subject,
        event,
        security,
        allowmask: +allowmask,
      });
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
