import type { MutationResolvers } from 'types/graphql';
import fs from 'fs';
import Papa from 'papaparse';

export const createImport: MutationResolvers['createImport'] = async ({
  input,
}) => {
  const { files } = input;
  console.log('input', input);

  const allPromises = files.map(async (file) => {
    const text = await file.text();
    const results = Papa.parse(text, { header: true });
    return results.data;
  });
  const results = await Promise.allSettled(allPromises);
  const data = results.map((r) => (r.status === 'fulfilled' ? r.value : null));
  console.log('data', data);

  return true;
};
