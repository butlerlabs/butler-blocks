import React from 'react';
import { Divider, TableHead, TableRow } from '@material-ui/core';
import { useDocumentLabeler } from 'documentLabeler/DocumentLabelerProvider';
import { FieldType } from 'common/types/DocumentLabelerTypes';
import { DocumentLabelerReducerUtils } from 'documentLabeler/state/DocumentLabelerReducerUtils';
import { DocumentLabelerTableCell } from 'documentLabeler/components/tableLabeler/DocumentLabelerTableCell';
import { DocumentLabelerTableContainer } from 'documentLabeler/components/tableLabeler/DocumentLabelerTableContainer';
import { DocumentLabelerTableHeader } from 'documentLabeler/components/tableLabeler/DocumentLabelerTableHeader';
import { ExtractedDataTableContainer } from 'common/dataTable/ExtractedDataTableContainer';
import { DataTableFtux } from 'common/dataTable/ftux/DataTableFtux';
import { DeleteRowIconCell } from 'common/dataTable/IconCell/deleteRowIconCell/DeleteRowIconCell';
import { FieldsPanelDisplayUtils } from 'documentLabeler/common/util/FieldsPanelDisplayUtils';

const COLUMN_NAME = 'Column Name';
const DRAG_OR_CLICK = 'Drag (or click) on value';
const GET_TABLE_FTUX_TEXT = () =>
    'Try adding a row to begin annotating your table!';

/**
 * Component Responsible for Displaying the Table Labeler in the Document Labeler
 */
export const TableLabeler: React.FC = () => {
  const { state, dispatch } = useDocumentLabeler();

  if (
    !state.localState.activeField ||
    state.localState.activeField.type !== FieldType.Table
  ) {
    throw new Error(
      'Table labeler cannot be rendered when there is no active table in the Document Labeler',
    );
  }

  const { activeCell } = state.localState.activeField;

  const selectedTable = DocumentLabelerReducerUtils.getSelectedTable(state);

  const activeRow = selectedTable?.rows.find(
    (row) => activeCell && row.id === activeCell.rowId,
  );
  const cell = activeRow?.cells.find(
    (cell) => cell.columnId === activeCell?.columnId,
  );

  const { columns, rows, id: activeTableId } = selectedTable;

  const handleOnCellClick = (columnId: string, rowId: string) => {
    if (activeRow?.id !== rowId || cell?.columnId !== columnId) {
      dispatch({
        type: 'setActiveField',
        payload: {
          id: activeTableId,
          type: FieldType.Table,
          activeCell: {
            rowId,
            columnId,
          },
        },
      });
    }
  };

  const handleOnDeleteRow = (rowId: string) => {
    dispatch({
      type: 'removeRowFromTable',
      payload: {
        rowId,
        tableId: selectedTable.id,
      },
    });
  };

  const handleCellTextOverride = (
    rowId: string,
    columnId: string,
    textOverride: string
  ) => {
    dispatch({
      type: 'setTableCellTextOverride',
      payload: {
        textOverride: textOverride,
        table: {
          id: selectedTable.id,
          type: FieldType.Table,
          activeCell: {
            rowId: rowId,
            columnId: columnId,
          }
        }
      }
    })
  }

  const columnHeaderDisplay = columns
    .map((column, index) => (
      <DocumentLabelerTableCell
        key={index}
        placeholder={COLUMN_NAME}
        textValue={column.name}
        header
      />
    ))
    // placeholder column header for column of delete icons in table
    .concat(
      columns.length > 0
        ? [
            <DocumentLabelerTableCell
              key={columns.length}
              placeholder={COLUMN_NAME}
              textValue=""
              header
              actionOnly
            />,
          ]
        : [],
    );

  const rowsToDisplay = rows.map((row) => (
    <TableRow key={row.id}>
      {row.cells
        .map((cell) => (
          <DocumentLabelerTableCell
            key={`${row.id}-${cell.columnId}}`}
            textValue={FieldsPanelDisplayUtils.getTextValueFromCell(cell)}
            placeholder={DRAG_OR_CLICK}
            isActive={
              activeCell &&
              cell.columnId === activeCell.columnId &&
              activeRow?.id === row.id
            }
            displayActions
            onSaveValue=
              {(value) =>
                handleCellTextOverride(row.id, cell.columnId, value)
              }
            onClick={() => handleOnCellClick(cell.columnId, row.id)}
          />
        ))
        .concat([
          <DeleteRowIconCell
            key={row.id}
            deleteRow={(): void => handleOnDeleteRow(row.id)}
          />,
        ])}
    </TableRow>
  ));

  return (
    <DocumentLabelerTableContainer>
      <DocumentLabelerTableHeader />
      <Divider />
      <ExtractedDataTableContainer numColumns={columns.length}>
        <TableHead>
          <TableRow>
            {columnHeaderDisplay}
          </TableRow>
        </TableHead>
        {rowsToDisplay.length !== 0 && rowsToDisplay}
        {rowsToDisplay.length === 0 && (
          <DataTableFtux
            ftuxText={GET_TABLE_FTUX_TEXT()}
            numColumns={columnHeaderDisplay.length}
          />
        )}
      </ExtractedDataTableContainer>
    </DocumentLabelerTableContainer>
  );
};
