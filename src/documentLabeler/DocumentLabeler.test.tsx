import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { SizeMeProps } from 'react-sizeme';
import { BBConfigurationProvider } from 'documentLabeler/context/BBConfigurationProvider';
import { DocumentLabeler } from 'documentLabeler/DocumentLabeler';
import { MockDocumentLabelerData } from 'documentLabeler/MockDocumentLabelerData.stories';

jest.mock('react-sizeme', () => ({
  withSize: () => (Component: React.FC<SizeMeProps>) => {
    // eslint-disable-next-line react/display-name
    return () => (
      <Component
        size={{
          width: 639,
          height: 925,
        }}
      />
    );
  },
}));

jest.mock(
  'documentLabeler/components/documentPanel/displayer/useDocumentDisplayer',
  () => ({
    useDocumentDisplayer: () => ({
      pageHeights: [925],
      loaders: {
        onPdfDocumentLoadSuccess: jest.fn(),
      },
    }),
  }),
);

describe('DocumentLabeler', () => {
  it('should render the document labeler with default config', () => {
    render(
      <BBConfigurationProvider
        config={{
          onSaveCallback: jest.fn(),
        }}
      >
        <DocumentLabeler data={MockDocumentLabelerData.documentLabelerData} />
      </BBConfigurationProvider>,
    );

    expect(screen.getByText('Fields')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByTestId('document-labeler')).toBeInTheDocument();

    screen.getAllByTestId('edit-field-icon').forEach((editFieldIcon) => {
      expect(editFieldIcon).toBeInTheDocument();
    });

    screen.getAllByTestId('clear-field-label-icon').forEach((editFieldIcon) => {
      expect(editFieldIcon).toBeInTheDocument();
    });

    MockDocumentLabelerData.documentLabelerData.results.fields.forEach(
      (field) => {
        expect(screen.getByText(field.name)).toBeInTheDocument();
      },
    );
  });

  it('should not render the save button in document labeler', () => {
    render(
      <BBConfigurationProvider
        config={{
          onSaveCallback: jest.fn(),
          hideSaveButton: true,
        }}
      >
        <DocumentLabeler data={MockDocumentLabelerData.documentLabelerData} />
      </BBConfigurationProvider>,
    );

    expect(screen.queryByText('Save')).toBeNull();
  });

  it('should hide all edit UI elements in document labeler', () => {
    render(
      <BBConfigurationProvider
        config={{
          onSaveCallback: jest.fn(),
          displayOnly: true,
        }}
      >
        <DocumentLabeler data={MockDocumentLabelerData.documentLabelerData} />
      </BBConfigurationProvider>,
    );

    expect(screen.queryByText('Save')).toBeNull();
    expect(screen.queryAllByTestId('edit-field-icon').length).toBe(0);
    expect(screen.queryAllByTestId('clear-field-label-icon').length).toBe(0);
  });

  it('should format the fields name in uppercase', () => {
    render(
      <BBConfigurationProvider
        config={{
          onSaveCallback: jest.fn(),
          fieldDisplayNameFormatter: (fieldName: string) =>
            fieldName.toUpperCase(),
        }}
      >
        <DocumentLabeler data={MockDocumentLabelerData.documentLabelerData} />
      </BBConfigurationProvider>,
    );

    MockDocumentLabelerData.documentLabelerData.results.fields.forEach(
      (field) => {
        expect(screen.getByText(field.name.toUpperCase())).toBeInTheDocument();
      },
    );
  });

  it('should call onSaveCallback after labeling', () => {
    const onSaveCallback = jest.fn();
    render(
      <BBConfigurationProvider
        config={{
          onSaveCallback,
        }}
      >
        <DocumentLabeler data={MockDocumentLabelerData.documentLabelerData} />
      </BBConfigurationProvider>,
    );

    expect(onSaveCallback).toHaveBeenCalledTimes(0);

    fireEvent.click(screen.getByText('Save'));

    expect(onSaveCallback).toHaveBeenCalledTimes(1);
  });

  it('should clear label for field and call onLabelUpdate to notify label change', () => {
    const onLabelUpdate = jest.fn();
    render(
      <BBConfigurationProvider
        config={{
          onSaveCallback: jest.fn(),
          onLabelUpdate,
        }}
      >
        <DocumentLabeler data={MockDocumentLabelerData.documentLabelerData} />
      </BBConfigurationProvider>,
    );

    expect(onLabelUpdate).toHaveBeenCalledTimes(1);

    const field = MockDocumentLabelerData.documentLabelerData.results.fields[0];
    expect(
      screen.getByText(field.name).parentElement?.parentElement,
    ).toHaveTextContent(field.blocks.map((block) => block.text).join(' '));

    fireEvent.click(screen.queryAllByTestId('clear-field-label-icon')[0]);

    expect(onLabelUpdate).toHaveBeenCalledTimes(2);

    expect(
      screen.getByText(field.name).parentElement?.parentElement,
    ).not.toHaveTextContent(field.blocks.map((block) => block.text).join(' '));
  });

  it('should edit the field value', () => {
    render(
      <BBConfigurationProvider
        config={{
          onSaveCallback: jest.fn(),
        }}
      >
        <DocumentLabeler data={MockDocumentLabelerData.documentLabelerData} />
      </BBConfigurationProvider>,
    );

    const field = MockDocumentLabelerData.documentLabelerData.results.fields[0];
    expect(
      screen.getByText(field.name).parentElement?.parentElement,
    ).toHaveTextContent(field.blocks.map((block) => block.text).join(' '));

    fireEvent.click(screen.queryAllByTestId('edit-field-icon')[0]);

    const fieldInput = screen.getByTestId('field-value-input');
    fireEvent.change(fieldInput, { target: { value: 'Updated Value' } });

    fireEvent.click(screen.getByTestId('save-field-value-btn'));

    expect(
      screen.getByText(field.name).parentElement?.parentElement,
    ).toHaveTextContent('Updated Value');
  });

  it('should open table labeler, add rows, delete row and close it', async () => {
    const onSaveCallback = jest.fn();
    render(
      <BBConfigurationProvider
        config={{
          onSaveCallback,
        }}
      >
        <DocumentLabeler data={MockDocumentLabelerData.documentLabelerData} />
      </BBConfigurationProvider>,
    );

    expect(screen.queryByTestId('table-labeler')).toBeNull();

    const tableInfo =
      MockDocumentLabelerData.documentLabelerData.results.tables[0];

    const tableField = screen.getByTestId(`field-${tableInfo.name}`);
    expect(tableField).toBeInTheDocument();

    fireEvent.click(tableField);

    const tableLabeler = screen.queryByTestId('table-labeler');
    expect(tableLabeler).toBeInTheDocument();

    expect(tableLabeler?.getElementsByTagName('tr').length).toBe(2); // header + 1 row

    screen.getByTestId('add-row-btn').click();

    expect(tableLabeler?.getElementsByTagName('tr').length).toBe(3);

    fireEvent.click(screen.getAllByTestId('delete-row-btn')[0]);

    expect(tableLabeler?.getElementsByTagName('tr').length).toBe(2);

    fireEvent.click(screen.getByTestId('close-table-btn'));

    expect(screen.queryByTestId('table-labeler')).not.toBeInTheDocument();
  });

  it('should label the field by drawing rectangle', () => {
    HTMLDivElement.prototype.getBoundingClientRect = jest.fn(() => {
      return {
        bottom: 957,
        height: 925,
        left: 32,
        right: 671,
        top: 32,
        width: 639,
        x: 32,
        y: 32,
      } as DOMRect;
    });
    render(
      <BBConfigurationProvider
        config={{
          onSaveCallback: jest.fn(),
        }}
      >
        <DocumentLabeler data={MockDocumentLabelerData.documentLabelerData} />
      </BBConfigurationProvider>,
    );

    const field = MockDocumentLabelerData.documentLabelerData.results.fields[0];
    const fieldValue = field.blocks.map((block) => block.text).join(' ');
    expect(
      screen.getByText(field.name).parentElement?.parentElement,
    ).toHaveTextContent(fieldValue);

    fireEvent.click(screen.getByText(field.name));

    const blockLayer = screen.getByTestId('document-block-layer');

    fireEvent.mouseDown(blockLayer, { clientX: 50, clientY: 50 });
    fireEvent.mouseMove(blockLayer, { clientX: 300, clientY: 400 });
    fireEvent.mouseMove(blockLayer, { clientX: 310, clientY: 410 });
    fireEvent.mouseUp(blockLayer, { clientX: 300, clientY: 400 });

    expect(
      screen.getByText(field.name).parentElement?.parentElement,
    ).toHaveTextContent(
      fieldValue + ' 27-Apr-2018 1 x individual - per user monthly plan',
    );
  });
});
