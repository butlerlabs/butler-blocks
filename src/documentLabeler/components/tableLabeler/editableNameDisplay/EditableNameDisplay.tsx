import React, { useState } from 'react';
import { Box, Button, makeStyles, Theme } from '@material-ui/core';
import { OutlinedTextField } from 'common/display/OutlinedTextField/OutlinedTextField';

const SAVE = 'Save';

type Props = {
  name: string;
  onSave: (name: string) => void;
  label: string;
  inputRef?: React.MutableRefObject<HTMLInputElement | null>;
};

const useStyles = makeStyles((theme: Theme) => ({
  Root: {
    minHeight: theme.spacing(3),
    alignItems: 'center',
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
}));

/**
 * Reusable visual component for displaying an outlined
 * text field with a save button, used throughout the
 * Create Doc Type flow to edit form field, table, and
 * column header names
 */
export const EditableNameDisplay: React.FC<Props> = ({
  name,
  onSave,
  label,
  inputRef,
}) => {
  const classes = useStyles();

  const [currentName, setCurrentName] = useState<string>(name);

  return (
    <Box className={classes.Root}>
      <OutlinedTextField
        value={currentName}
        onChange={(e): void => setCurrentName(e.target.value)}
        autoFocus
        label={label}
        fullWidth
        size="small"
        inputRef={inputRef}
      />
      <Button
        onClick={(): void => onSave(currentName)}
        variant="text"
        color="primary"
      >
        {SAVE}
      </Button>
    </Box>
  );
};
