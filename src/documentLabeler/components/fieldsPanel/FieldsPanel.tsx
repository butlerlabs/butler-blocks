import React from 'react';
import { Box, makeStyles, Theme, Divider } from '@material-ui/core';
import { useDocumentLabeler } from 'documentLabeler/DocumentLabelerProvider';
import { FieldsPanelDisplayRow } from 'documentLabeler/components/fieldsPanel/fieldsPanelDisplayRow/FieldsPanelDisplayRow';
import { FieldType } from 'documentLabeler/types/DocumentLabelerTypes';
import { FieldsPanelDisplayUtils } from 'documentLabeler/components/fieldsPanel/util/FieldsPanelDisplayUtils';
import { FieldsPanelUtils } from 'documentLabeler/components/fieldsPanel/util/FieldsPanelUtils';
import { FieldsPanelHeader } from 'documentLabeler/components/fieldsPanel/fieldsPanelHeader/FieldsPanelHeader';
import { DocumentLabelerReducerUtils } from 'documentLabeler/state/DocumentLabelerReducerUtils';

const useStyles = makeStyles((theme: Theme) => ({
  Root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: theme.spacing(45),
    backgroundColor: theme.palette.common.white,
    '& > *': {
      width: '100%',
      boxSizing: 'border-box',
    },
  },
  FieldsContainer: {
    overflowY: 'auto',
    flex: 1,
  },
}));

/**
 * Component responsible for rendering and managing the Fields
 */
export const FieldsPanel: React.FC = () => {
  const classes = useStyles();

  const { state } = useDocumentLabeler();

  const { fields, tables } = DocumentLabelerReducerUtils.getAllColoredFields(state.docInfo);

  return (
    <Box className={classes.Root}>
      <FieldsPanelHeader />
      <Divider />
      <Box className={classes.FieldsContainer}>
        {fields.map((field) => (
          <Box key={field.info.id}>
            <FieldsPanelDisplayRow
              {...field.info}
              value={FieldsPanelDisplayUtils.getTextValueFromField(field.info)}
              hasValue={FieldsPanelUtils.fieldHasLabeledValue(field.info)}
              color={field.color}
            />
            <Divider />
          </Box>
        ))}
        {tables.map((table) => (
          <Box key={table.info.id}>
            <FieldsPanelDisplayRow
              {...table.info}
              type={FieldType.Table}
              value={FieldsPanelDisplayUtils.getTextValueFromTable(table.info)}
              hasValue={FieldsPanelUtils.tableHasLabeledValue(table.info)}
              color={table.color}
            />
            <Divider />
          </Box>
        ))}
      </Box>
    </Box>
  );
};
