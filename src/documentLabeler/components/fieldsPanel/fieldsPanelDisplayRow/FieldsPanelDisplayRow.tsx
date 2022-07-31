import { alpha, Box, Button, IconButton, makeStyles, Theme, Typography } from '@material-ui/core';
import { Close, Create } from '@material-ui/icons';
import { OutlinedTextField } from 'common/display/OutlinedTextField/OutlinedTextField';
import { TruncatableTypography } from 'common/display/TruncatableTypography/TruncatableTypography';
import { useDocumentLabeler } from 'documentLabeler/DocumentLabelerProvider';
import { FieldType } from 'documentLabeler/types/DocumentLabelerTypes';
import React, { useState } from 'react';
import clsx from 'clsx';

const SAVE = 'Save';

const EMPTY_VALUE = 'No Value Specified';

type Props = {
  id: string;
  type: FieldType,
  name: string;
  value: string;
  color: string;
  hasValue?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  Root: {
    display: 'flex',
    gap: theme.spacing(1),
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    cursor: 'pointer',
    justifyContent: 'space-between',
    height: theme.spacing(6),
  },
  TopRowContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  FieldIconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(1),
    paddingLeft: 0,
  },
  FieldInfoContainer: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  FieldActionContainer: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  FieldLabelTypography: {
    color: theme.palette.text.disabled,
  },
  FieldValueTypography: {
    color: theme.palette.text.secondary,

    '&.Disabled': {
      color: theme.palette.text.disabled,
    },
  },
  IconButton: {
    padding: 0,
    marginRight: theme.spacing(1),
    '&.Hide': {
      opacity: 0,
      pointerEvents: 'none',
    },
  },
}));

/**
 * Component responsible for rendering a field in the fields panel.  
 * Takes in information about the field and its associated display color
 * and handles selecting the field and editing the field value.
 * @param Props
 */
export const FieldsPanelDisplayRow: React.FC<Props> = ({
  id, 
  type, 
  name, 
  value, 
  color, 
  hasValue = true,
}) => {
  const classes = useStyles();

  const { state, dispatch } = useDocumentLabeler();

  const [editingText, setEditingText] = useState<boolean>(false);
  const [localValue, setLocalValue] = useState<string>(value);

  const fieldIsActive = state.localState.activeField?.id === id;

  const handleFieldClick = () => {
    if (fieldIsActive) {
      dispatch({
        type: 'setActiveField',
        payload: undefined,
      });
    } else {
      dispatch({
        type: 'setActiveField',
        payload: {
          id: id,
          type: type,
        },
      });
    }
  };

  const handleClearLabels = () => dispatch({
    type: 'removeAllBlocksFromField',
    payload: {
      fieldId: id,
    }
  });

  const handleSaveValue = () => { 
    dispatch({
      type: 'setFieldTextOverride',
      payload: {
        fieldId: id,
        textOverride: localValue,
      }
    })
    setEditingText(false);
  };

  return (
    <Box
      className={classes.Root}
      onClick={handleFieldClick}
      style={{
        borderLeft: `4px solid ${color}`,
        backgroundColor:
          fieldIsActive
            ? alpha(color, 0.1)
            : 'transparent',
      }}
    >
      <Box className={classes.FieldInfoContainer}>
        {editingText ? (
          <OutlinedTextField
            value={localValue}
            placeholder={EMPTY_VALUE}
            onChange={(e) => setLocalValue(e.target.value)}
          />
        ) : (
          <>
            <Box className={classes.TopRowContainer}>
              <TruncatableTypography
                value={name}
                paragraph={false}
                typographyProps={{
                  variant: 'caption',
                  className: classes.FieldLabelTypography,
                }}
              />
            </Box>
            <TruncatableTypography
              value={value}
              paragraph={false}
              typographyProps={{
                variant: 'subtitle2'
              }}
            />
          </>
        )}
      </Box>
        {editingText ? (
          <Button 
            variant='text' 
            color='primary' 
            onClick={(event) => {
              event.stopPropagation();
              handleSaveValue();
            }}
          >
            {SAVE}
          </Button>
        ) : (
          <Box className={classes.FieldActionContainer}>
            <IconButton
              className={classes.IconButton}
              onClick={(event) => {
                event.stopPropagation();
                setLocalValue(value);
                setEditingText(true);
              }}
            >
              <Create fontSize='small' />
            </IconButton>
            <IconButton
              className={clsx(classes.IconButton, {
                Hide: !hasValue,
              })}
              onClick={(event) => {
                event.stopPropagation();
                handleClearLabels();
              }}
            >
              <Close fontSize='small' />
            </IconButton>
          </Box>
        )}
    </Box>
  );
};
