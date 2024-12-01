// import { Link, routes } from '@redwoodjs/router'
import { FileField, Form, Submit } from '@redwoodjs/forms';
import { Metadata, useMutation } from '@redwoodjs/web';

import {
  CreateImportMutation,
  CreateImportMutationVariables,
} from 'types/graphql';

const CREATE_IMPORT = gql`
  mutation CreateImportMutation($input: CreateImportInput!) {
    createImport(input: $input)
  }
`;

const ImportPage = () => {
  const [createImport] = useMutation<
    CreateImportMutation,
    CreateImportMutationVariables
  >(CREATE_IMPORT);

  const onSubmit = (data) => {
    console.log('data', data);
    createImport({ variables: { input: data } });
  };

  return (
    <>
      <Metadata title="Import" description="Import page" />

      <h1>ImportPage</h1>

      <Form onSubmit={onSubmit}>
        <FileField name="files" multiple={true} />
        <Submit>Import</Submit>
      </Form>
    </>
  );
};

export default ImportPage;
