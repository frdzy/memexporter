export const schema = gql`
  input CreateExportInput {
    isDryRun: Boolean
  }
  type Mutation {
    createExport(input: CreateExportInput!): Boolean! @requireAuth
  }
`;
