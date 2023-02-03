import React from 'react';

import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
  ReactZoomPanPinchProps,
} from 'react-zoom-pan-pinch';

interface Props extends ReactZoomPanPinchProps {
  document: string;
  loaders: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onImgDocumentLoadSuccess: (imageHeight: number) => void;
  };
  width: number;
}

// eslint-disable-next-line react/display-name
const DocumentImageDisplayer = React.forwardRef<ReactZoomPanPinchRef, Props>(
  (props, ref) => {
    const { document, loaders, width, ...params } = props;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onImgLoad = (event: any) => {
      loaders.onImgDocumentLoadSuccess(event.target.offsetHeight);
    };

    return (
      <TransformWrapper ref={ref} {...params}>
        {() => (
          <TransformComponent>
            <img
              src={document}
              width={width}
              alt="DocumentImageDisplayer"
              id="DocumentImageDisplayer"
              onLoad={onImgLoad}
            />
          </TransformComponent>
        )}
      </TransformWrapper>
    );
  },
);

export { DocumentImageDisplayer };
