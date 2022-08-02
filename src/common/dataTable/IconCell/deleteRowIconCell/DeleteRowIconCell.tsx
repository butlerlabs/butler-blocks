import React from 'react';
import clsx from 'clsx';
import { IconButton, makeStyles, Theme } from '@material-ui/core';
import { DeleteOutlined } from '@material-ui/icons';
import { IconCell } from 'common/dataTable/IconCell/IconCell';

type Props = {
  deleteRow: () => void;
  disabled?: boolean;
};

const useStyles = makeStyles((theme: Theme) => ({
  Root: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  Icon: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  IconButton: {
    padding: 0,
    '&.Disabled': {
      opacity: 0.2,
    },
  },
}));

/**
 * Reusable display component for rendering the last cell in
 * each row of the extracted table editor, which contains the delete
 * row icon.  Takes in a callback function to delete the row.
 * @param Props
 */
export const DeleteRowIconCell: React.FC<Props> = ({
  deleteRow,
  disabled = false,
}) => {
  const classes = useStyles();

  return (
    <IconCell className={classes.Root}>
      <IconButton
        onClick={deleteRow}
        className={clsx(classes.IconButton, {
          Disabled: disabled,
        })}
        disabled={disabled}
      >
        <DeleteOutlined className={classes.Icon} />
      </IconButton>
    </IconCell>
  );
};
