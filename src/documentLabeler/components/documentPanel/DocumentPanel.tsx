import { Box, makeStyles, Theme } from "@material-ui/core";
import { DocumentDisplayer } from "documentLabeler/components/documentPanel/displayer/DocumentDisplayer";
import { useDocumentDisplayer } from "documentLabeler/components/documentPanel/displayer/useDocumentDisplayer";
import { DocumentBlockLayer } from "documentLabeler/components/documentPanel/documentBlockLayer/DocumentBlockLayer";
import { DocumentContainer } from "documentLabeler/components/documentPanel/documentContainer/DocumentContainer";
import { useDocumentLabeler } from "documentLabeler/DocumentLabelerProvider";
import { FieldType } from "documentLabeler/types/DocumentLabelerTypes";
import { withSize, SizeMeProps } from 'react-sizeme';

const useStyles = makeStyles((theme: Theme) => ({
  Root: {
    flex: 1,
  },
  DocumentContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',

    '&.FullHeight': {
      height: '100%',
    },
  },
  PreviewCard: {
    width: '100%',
  },
  DropzoneWrapper: {
    height: theme.spacing(50),
    padding: theme.spacing(4),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  TableHeightCover: {
    height: theme.spacing(41),
  },
}));

type Props = SizeMeProps;

const DocumentPanelInternal = withSize({
  monitorHeight: true,
})(({ size }: Props) => {
  const classes = useStyles();

  const { state } = useDocumentLabeler();

  const width = size?.width ?? 0;
  const height = size?.height ?? 0;

  const docDisplayerState = useDocumentDisplayer(
    state.docInfo.mimeType,
    { width, height },
    state.docInfo.docUrl,
  );

  return (
    <Box className={classes.Root}>
      <Box className={classes.DocumentContainer}>
        <DocumentContainer className={classes.PreviewCard}>
          <DocumentBlockLayer
            docPageHeights={docDisplayerState.pageHeights}
            width={width}
          />
          <DocumentDisplayer
            mimeType={state.docInfo.mimeType}
            width={width}
            document={state.docInfo.docUrl}
            loaders={docDisplayerState.loaders}
            pages={docDisplayerState.pages}
          />
        </DocumentContainer>
        {state.localState.activeField &&
          state.localState.activeField.type === FieldType.Table && (
            <Box className={classes.TableHeightCover} />
          )}
      </Box>
    </Box>
  );
});

const useExternalStyles = makeStyles((theme: Theme) => ({
  Root: {
    display: 'flex',
    flex: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(2),
    overflow: 'scroll',
    maxHeight: '100%',
  },
}));

/**
 * Component responsible for displaying & labeling the document.
 */
export const DocumentPanel: React.FC = () => {
  const classes = useExternalStyles();
  return (
    <Box className={classes.Root}>
      <DocumentPanelInternal />
    </Box>
  );
};
