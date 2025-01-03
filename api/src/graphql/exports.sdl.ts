export const schema = gql`
  input CreateExportInput {
    test: Boolean
  }
  type Mutation {
    createExport(input: CreateExportInput!): Boolean! @requireAuth
  }
`;
