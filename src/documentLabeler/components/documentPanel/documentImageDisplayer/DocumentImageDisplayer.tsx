import { useMemo } from 'react';
import { useDocumentLabeler } from 'documentLabeler/DocumentLabelerProvider';

type Props = {
  document: string;
  width: number;
};

const DocumentImageDisplayer = (props: Props) => {
  const { document, width } = props;

  const { state, dispatch } = useDocumentLabeler();
  const { renderedImgHeight } = state.localState;

  const imageProps = useMemo(() => {
    if (typeof state.localState.renderedImgHeight === 'number') {
      return {
        height: renderedImgHeight,
      };
    }

    return {};
  }, [state]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onImgLoad = (event: any) => {
    dispatch({
      type: 'setImageHeight',
      payload: event.target.offsetHeight,
    });
  };

  return (
    <img
      {...imageProps}
      src={document}
      width={width}
      alt="DocumentImageDisplayer"
      id="DocumentImageDisplayer"
      onLoad={onImgLoad}
    />
  );
};

export { DocumentImageDisplayer };
