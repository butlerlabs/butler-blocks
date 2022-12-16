import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  IconButton,
  makeStyles,
  TableCell,
  Theme,
} from '@material-ui/core';
import clsx from 'clsx';
import { EditableNameDisplay } from 'documentLabeler/components/tableLabeler/editableNameDisplay/EditableNameDisplay';
import { TruncatableTypography } from 'common/display/TruncatableTypography/TruncatableTypography';
import { Edit } from '@material-ui/icons';

const MAX_CELL_CHAR_LIMIT = 100;

const CELL_VALUE = 'Cell Value';

type Props = {
  textValue: string;
  placeholder: string;
  header?: boolean;
  displayActions?: boolean;
  isActive?: boolean;
  showEdit?: boolean;
  actionOnly?: boolean;
  onClick?: () => void;
  onSaveValue?: (value: string) => void;
  onDelete?: () => void;
  dataCy?: string;
};

const useStyles = makeStyles((theme: Theme) => ({
  Root: {
    borderRight: `1px solid ${theme.palette.divider}`,
    '&.Header': {
      backgroundColor: theme.palette.background.default,
    },
    '&.Active': {
      // Append the 1A to make background color only 10% opacity
      backgroundColor: `${theme.palette.primary.main}1A`,
    },
    '&.MinWidth': {
      minWidth: theme.spacing(25),
    },
  },
  EditContainer: {
    backgroundColor: theme.palette.background.default,
  },
  Content: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(1),
  },
  Text: {
    height: theme.spacing(3),
    whiteSpace: 'nowrap',
  },
  IconButton: {
    padding: 0,
  },
  Disabled: {
    color: theme.palette.text.disabled,
  },
  InvisibleSpacing: {
    opacity: '0%',
  },
}));

/**
 * Component responsible for:
 * 1. Rendering Column Headers in the Table Labeler
 * 2. Rendering Table Cells in the Table Labeler
 * @param Props
 */
export const DocumentLabelerTableCell: React.FC<Props> = ({
  textValue,
  placeholder,
  header = false,
  displayActions = false,
  isActive = false,
  showEdit = false,
  actionOnly = false,
  onClick,
  onSaveValue,
}) => {
  const classes = useStyles();

  // state variable used to conditionally render either
  // the display row or the editable name display
  const [editingValue, setEditingValue] = useState<boolean>(showEdit);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editingValue) {
      inputRef.current?.focus();
    }
  }, [editingValue, inputRef.current]);

  const shouldDisplayPlaceholder = !textValue && isActive;

  const needsInvisibleSpacing = !textValue && !isActive;

  const handleEditSubmit = (name: string) => {
    onSaveValue?.(name);
    setEditingValue(false);
  };

  return (
    <TableCell
      className={clsx(classes.Root, {
        Header: header,
        Active: isActive,
        MinWidth: !actionOnly,
      })}
      onClick={onClick}
    >
      <Box className={classes.Content}>
        {editingValue ? (
          <EditableNameDisplay
            name={textValue}
            onSave={handleEditSubmit}
            label={CELL_VALUE}
            inputRef={inputRef}
          />
        ) : (
          <>
            <TruncatableTypography
              typographyProps={{
                variant: header ? 'subtitle1' : 'body2',
                className: clsx(classes.Text, {
                  [classes.Disabled]: shouldDisplayPlaceholder,
                  [classes.InvisibleSpacing]: needsInvisibleSpacing,
                }),
              }}
              expandable
              maxCharLength={MAX_CELL_CHAR_LIMIT}
              paragraph={false}
              value={
                shouldDisplayPlaceholder
                  ? placeholder
                  : textValue
                  ? textValue
                  : // the period will not be visible to the end user
                    // since the opacity is 0, but it resolves spacing issues
                    '.'
              }
            />
            {displayActions && (
              <IconButton
                className={classes.IconButton}
                onClick={() => setEditingValue(true)}
              >
                <Edit />
              </IconButton>
            )}
          </>
        )}
      </Box>
    </TableCell>
  );
};
