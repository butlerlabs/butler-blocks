import React from 'react';
import { Paper, Table, TableContainer } from '@material-ui/core';

export type ColumnSpecs = {
  // Use this property if you would like to have a fixed width for your
  // columns, rather than the dynamically generated widths from MUI
  // This is useful when loading data from the server side to avoid flickering.
  // See https://stackoverflow.com/questions/51216285/material-ui-v1-set-table-column-widths
  // for more details
  width: string | number;
};

type Props = {
  children: React.ReactNode;
  classes?: {
    paper?: string;
    container?: string;
  };
  elevation?: number;
  columnSpecs?: Array<ColumnSpecs>;
};

/**
 * Reusable Component for rendering a DataTable. Should be
 * used in conjunction with the useDataTable component.
 * @param props
 */
export const DataTable: React.FC<Props> = ({
  children,
  classes,
  elevation,
  columnSpecs,
}) => {
  return (
    <Paper className={classes?.paper} elevation={elevation}>
      <TableContainer className={classes?.container}>
        <Table stickyHeader>
          {columnSpecs && (
            <colgroup>
              {columnSpecs.map((spec, idx) => (
                <col key={idx} style={{ width: spec.width }} />
              ))}
            </colgroup>
          )}
          {children}
        </Table>
      </TableContainer>
    </Paper>
  );
};
