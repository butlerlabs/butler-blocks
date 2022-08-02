import React from 'react';
import {
  Box,
  makeStyles,
  TableBody,
  TableCell,
  TableRow,
  Theme,
  Typography,
} from '@material-ui/core';

type Props = {
  ftuxText: React.ReactNode;
  numColumns: number;
  dataCy?: string;
};

const useStyles = makeStyles((theme: Theme) => ({
  TableCell: {
    padding: theme.spacing(8),
    borderBottom: 'none',
  },
  TextBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Text: {
    color: theme.palette.text.disabled,
    textAlign: 'center',
    maxWidth: '50%',
  },
}));

/**
 * Component used for displaying FTUX helper text within tables.
 * @param props
 */
export const DataTableFtux: React.FC<Props> = ({
  ftuxText,
  numColumns,
  dataCy,
}) => {
  const classes = useStyles();

  return (
    <TableBody>
      <TableRow>
        <TableCell colSpan={numColumns} className={classes.TableCell}>
          <Box className={classes.TextBox}>
            <Typography variant="h5" className={classes.Text} data-cy={dataCy}>
              {ftuxText}
            </Typography>
          </Box>
        </TableCell>
      </TableRow>
    </TableBody>
  );
};
