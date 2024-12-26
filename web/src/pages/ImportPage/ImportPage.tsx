// import { Link, routes } from '@redwoodjs/router'
import { FileField, Form, Submit } from '@redwoodjs/forms';
import { Metadata, useMutation } from '@redwoodjs/web';
import { useState } from 'react';
import { useForm } from '@redwoodjs/forms';

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
  const formMethods = useForm();
  const [createImport] = useMutation<
    CreateImportMutation,
    CreateImportMutationVariables
  >(CREATE_IMPORT);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit = async ({ files }: { files: Array<File> }) => {
    console.log('data', { files });
    setIsLoading(true);
    try {
      await createImport({ variables: { input: { files } } });
      formMethods.reset();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Metadata title="Import" description="Import page" />

      <h1>ImportPage</h1>

      <Form formMethods={formMethods} onSubmit={onSubmit}>
        <FileField name="files" multiple={true} />
        <Submit disabled={isLoading}>Import</Submit>
      </Form>
    </>
  );
};

export default ImportPage;
