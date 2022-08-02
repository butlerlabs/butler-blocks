import React from 'react';
import { Box, makeStyles, TableCell, Theme } from '@material-ui/core';

type Props = {
  children: React.ReactNode;
  className?: string;
};

const useStyles = makeStyles((theme: Theme) => ({
  Box: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end' },
}));

/**
 * Reusable component for displaying an icon cell within a data table row.
 * @param props
 */
export const IconCell: React.FC<Props> = ({ children, className }) => {
  const classes = useStyles();

  return (
    <TableCell className={className}>
      <Box className={classes.Box}>{children}</Box>
    </TableCell>
  );
};
