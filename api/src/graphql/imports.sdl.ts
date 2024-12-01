export const schema = gql`
  input CreateImportInput {
    files: [File!]!
  }
  type Mutation {
    createImport(input: CreateImportInput!): Boolean! @requireAuth
  }
`;
