import React from 'react';

import {
  TextField,
  TextFieldProps,
  OutlinedTextFieldProps,
  Theme,
  makeStyles,
} from '@material-ui/core';

// Props
type Props = TextFieldProps;

const useStyles = makeStyles((theme: Theme) => ({
  Root: {
    '& .MuiInputLabel-root': {
      color: theme.palette.text.secondary,
    },
  },
}));

/**
 * Common button used to display an outlined text field
 * @param props
 */
export const OutlinedTextField: React.FC<Props> = (props: Props) => {
  const classes = useStyles();
  const newProps: OutlinedTextFieldProps = {
    ...props,
    variant: 'outlined',
  };
  return <TextField className={classes.Root} {...newProps} />;
};
