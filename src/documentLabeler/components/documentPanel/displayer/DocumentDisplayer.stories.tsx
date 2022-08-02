import React from 'react';
import { withSize, SizeMeProps } from 'react-sizeme';
import { MimeType } from 'common/types/DocumentLabelerTypes';
import { useDocumentDisplayer } from 'documentLabeler/components/documentPanel/displayer/useDocumentDisplayer';
import { DocumentDisplayer } from 'documentLabeler/components/documentPanel/displayer/DocumentDisplayer';
import { MockDocumentLabelerData } from 'documentLabeler/MockDocumentLabelerData.stories';
import { DocumentContainer } from 'documentLabeler/components/documentPanel/documentContainer/DocumentContainer';

export default {
  component: DocumentDisplayer,
  title: 'Document Displayer',
  parameters: {
    fileName: __filename,
  },
};

type Props = {
  document: string;
  mimeType: string;
} & SizeMeProps;

const TestDocumentDisplayerBase: React.FC<Props> = ({
  document,
  mimeType,
  size,
}) => {
  const width = size?.width ?? 0;
  const height = size?.height ?? 0;
  const { pages, loaders } = useDocumentDisplayer(mimeType, {
    width,
    height,
  });

  return (
    <DocumentContainer>
      <DocumentDisplayer
        mimeType={mimeType}
        width={width}
        document={document}
        loaders={loaders}
        pages={pages}
      />
    </DocumentContainer>
  );
};

const TestDocumentDisplayer = withSize({ monitorHeight: true })(
  TestDocumentDisplayerBase,
);

export const Default = () => (
  <TestDocumentDisplayer
    document={MockDocumentLabelerData.docUrl}
    mimeType={MimeType.Pdf}
  />
);
