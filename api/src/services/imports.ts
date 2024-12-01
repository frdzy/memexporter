import type { MutationResolvers } from 'types/graphql';

export const createImport: MutationResolvers['createImport'] = ({ input }) => {
  console.log('input', input);
  return true;
};
