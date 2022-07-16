import React, { useState } from 'react';

type Props = {
  docLabelerInfo: {
    clickCount: number;
    name: string;
  };
  onSaveCallback: (docInfo: object) => void;
};

/**
 * Will be in DocumentLabeler.tsx, exported as we do in our
 * regular codebase
 */
export const DocumentLabeler: React.FC<Props> = ({docLabelerInfo, onSaveCallback}) => {

  const [state, setState] = useState(docLabelerInfo);

  const onCountClick = () => {
    setState({
      ...state,
      clickCount: state.clickCount + 1,
    });
  };
  
  const onSaveClick = () => {
    onSaveCallback(state);
  }
   return (
    <div>
      <div>
        Name: {state.name}
        <br/>
        Click Count: {state.clickCount}
      </div>
      <button onClick={onCountClick}>Click!</button>
      <button onClick={onSaveClick}>Save!</button>
    </div>
  )
 }
 