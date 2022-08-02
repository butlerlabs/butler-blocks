import { makeStyles, Theme } from '@material-ui/core';
import { ColumnSpecsUtil } from 'common/dataTable/columnSpecsUtil/ColumnSpecsUtil';
import { DataTable } from 'common/dataTable/DataTable';
import React from 'react';

type Props = {
  numColumns: number;
  children: React.ReactNode;
};

const useStyles = makeStyles((theme: Theme) => ({
  Container: {
    height: theme.spacing(29),
    overflowY: 'scroll',
  },
}));

/**
 * Reusable Display Container for the Data Table portion
 * of the Extracted Table Editor and Display components
 * @param Props
 */
export const ExtractedDataTableContainer: React.FC<Props> = ({
  numColumns,
  children,
}) => {
  const classes = useStyles();

  return (
    <DataTable
      classes={{ container: classes.Container }}
      elevation={0}
      columnSpecs={ColumnSpecsUtil.calcColumnSpecs(numColumns)}
    >
      {children}
    </DataTable>
  );
};
